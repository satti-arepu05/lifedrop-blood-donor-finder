import { Router } from 'express';
import { z } from 'zod';
import jwt from 'jsonwebtoken';
import db from '../config/db.js';
import { authenticate } from '../middleware/auth.js';
import MatchingService from '../services/matchingService.js';
import NotificationService from '../services/notificationService.js';

const router = Router();

const requestSchema = z.object({
  patientName: z.string().min(2, 'Patient name is required'),
  bloodGroup: z.enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']),
  units: z.number().int().min(1, 'Units must be at least 1').default(1),
  hospital: z.string().min(2, 'Hospital name is required'),
  city: z.string().min(2, 'City is required'),
  urgency: z.enum(['Normal', 'Urgent', 'Critical']).default('Urgent'),
  contactName: z.string().min(2, 'Contact name is required'),
  contactPhone: z.string().min(10, 'Contact phone is required'),
  neededBy: z.string().optional(),
  notes: z.string().optional()
});

// POST /api/requests (Create emergency request)
router.post('/', authenticate, async (req, res, next) => {
  try {
    const data = requestSchema.parse(req.body);

    const insertStmt = db.prepare(`
      INSERT INTO requests (
        requester_id, patient_name, blood_group, units, hospital,
        city, urgency, contact_name, contact_phone, needed_by, notes, status
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 'Pending')
    `);

    const result = insertStmt.run(
      req.user.id,
      data.patientName,
      data.bloodGroup,
      data.units,
      data.hospital,
      data.city,
      data.urgency,
      data.contactName,
      data.contactPhone,
      data.neededBy || null,
      data.notes || ''
    );

    const requestId = result.lastInsertRowid;
    const request = db.prepare('SELECT * FROM requests WHERE id = ?').get(requestId);

    // Run matching and notification
    const { matchedDonors, notifiedCount } = MatchingService.matchAndNotifyDonors(request);

    // Notify the requester about match count
    NotificationService.notify({
      userId: req.user.id,
      channel: 'app',
      title: 'Blood Request Created',
      message: `Your request for ${data.bloodGroup} in ${data.city} was created. ${notifiedCount} eligible donor(s) were notified.`
    });

    res.status(201).json({
      message: 'Request created successfully',
      request,
      matchedDonorsCount: matchedDonors.length,
      notifiedDonorsCount: notifiedCount
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/requests/mine (My created requests)
router.get('/mine', authenticate, (req, res, next) => {
  try {
    const requests = db.prepare(`
      SELECT r.*,
        (SELECT COUNT(*) FROM request_matches WHERE request_id = r.id) as total_notified,
        (SELECT COUNT(*) FROM request_matches WHERE request_id = r.id AND status = 'accepted') as total_accepted
      FROM requests r
      WHERE r.requester_id = ?
      ORDER BY r.created_at DESC
    `).all(req.user.id);

    res.json(requests);
  } catch (err) {
    next(err);
  }
});

// GET /api/requests/:id (Details & Live Status Tracker)
router.get('/:id', (req, res, next) => {
  try {
    const request = db.prepare(`
      SELECT r.*, u.name as requester_name, u.email as requester_email
      FROM requests r
      JOIN users u ON r.requester_id = u.id
      WHERE r.id = ?
    `).get(req.params.id);

    if (!request) {
      return res.status(404).json({ error: 'Request not found' });
    }

    // Check authorization to see unlocked contact details
    let isAuthorized = false;
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      try {
        const token = authHeader.split(' ')[1];
        const jwtSecret = process.env.JWT_SECRET || 'lifedrop_super_secret_jwt_key_2026_blood_donor_finder';
        const decoded = jwt.verify(token, jwtSecret);
        if (decoded.id === request.requester_id || decoded.role === 'admin') {
          isAuthorized = true;
        }
      } catch (e) {
        // Not authorized token
      }
    }

    // Get matches
    const matches = db.prepare(`
      SELECT rm.id as match_id, rm.status as match_status, rm.responded_at,
             d.id as donor_id, d.blood_group, d.city, d.gender, d.age,
             u.name as donor_name, u.phone as donor_phone, u.email as donor_email
      FROM request_matches rm
      JOIN donors d ON rm.donor_id = d.id
      JOIN users u ON d.user_id = u.id
      WHERE rm.request_id = ?
    `).all(request.id);

    // If authorized (the hospital/requester or admin), unlock contact info for accepted donors!
    const formattedMatches = matches.map(m => {
      const isAccepted = m.match_status === 'accepted';
      const canViewContact = isAuthorized && isAccepted;

      return {
        matchId: m.match_id,
        matchStatus: m.match_status,
        respondedAt: m.responded_at,
        donorId: m.donor_id,
        bloodGroup: m.blood_group,
        city: m.city,
        gender: m.gender,
        age: m.age,
        donorName: canViewContact ? m.donor_name : `${m.donor_name.split(' ')[0]} ${m.donor_name.split(' ')[1] ? m.donor_name.split(' ')[1][0] + '.' : ''}`,
        donorPhone: canViewContact ? m.donor_phone : 'Locked (Accept required)',
        donorEmail: canViewContact ? m.donor_email : 'Locked (Accept required)',
        isContactUnlocked: canViewContact
      };
    });

    res.json({
      request,
      matches: formattedMatches,
      stats: {
        totalNotified: matches.length,
        acceptedCount: matches.filter(m => m.match_status === 'accepted').length,
        declinedCount: matches.filter(m => m.match_status === 'declined').length
      }
    });
  } catch (err) {
    next(err);
  }
});

// PATCH /api/requests/:id/status (Update status: Fulfilled, Cancelled, etc.)
router.patch('/:id/status', authenticate, (req, res, next) => {
  try {
    const { status } = req.body;
    if (!['Pending', 'Accepted', 'Fulfilled', 'Cancelled'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' });
    }

    const request = db.prepare('SELECT * FROM requests WHERE id = ?').get(req.params.id);
    if (!request) {
      return res.status(404).json({ error: 'Request not found' });
    }

    if (request.requester_id !== req.user.id && req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Unauthorized to update this request' });
    }

    db.prepare('UPDATE requests SET status = ? WHERE id = ?').run(status, req.params.id);

    res.json({ message: `Request status updated to ${status}` });
  } catch (err) {
    next(err);
  }
});

// POST /api/requests/:id/respond (Donor responds: Accept or Decline)
router.post('/:id/respond', authenticate, (req, res, next) => {
  try {
    const { response } = req.body; // 'accept' or 'decline'
    if (!['accept', 'decline'].includes(response)) {
      return res.status(400).json({ error: "Response must be 'accept' or 'decline'" });
    }

    const donor = db.prepare('SELECT * FROM donors WHERE user_id = ?').get(req.user.id);
    if (!donor) {
      return res.status(400).json({ error: 'Only registered donors can respond to blood requests.' });
    }

    const request = db.prepare('SELECT * FROM requests WHERE id = ?').get(req.params.id);
    if (!request) {
      return res.status(404).json({ error: 'Request not found.' });
    }

    const statusValue = response === 'accept' ? 'accepted' : 'declined';

    // Upsert into request_matches
    const existing = db.prepare('SELECT * FROM request_matches WHERE request_id = ? AND donor_id = ?').get(request.id, donor.id);
    if (existing) {
      db.prepare(`
        UPDATE request_matches
        SET status = ?, responded_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `).run(statusValue, existing.id);
    } else {
      db.prepare(`
        INSERT INTO request_matches (request_id, donor_id, status, responded_at)
        VALUES (?, ?, ?, CURRENT_TIMESTAMP)
      `).run(request.id, donor.id, statusValue);
    }

    if (statusValue === 'accepted') {
      // If request was pending, update request status to Accepted
      if (request.status === 'Pending') {
        db.prepare("UPDATE requests SET status = 'Accepted' WHERE id = ?").run(request.id);
      }

      // Notify the hospital/requester
      NotificationService.notify({
        userId: request.requester_id,
        channel: 'app',
        title: '🎉 Donor Accepted Your Blood Request!',
        message: `Donor ${req.user.name} (${donor.blood_group}) has accepted your request for ${request.patient_name} at ${request.hospital}. Contact details are now unlocked on your dashboard!`
      });

      NotificationService.notify({
        userId: request.requester_id,
        channel: 'sms',
        title: `SMS to Hospital/Requester`,
        message: `LifeDrop: Donor ${req.user.name} (${req.user.phone}) accepted request for ${request.patient_name}.`
      });

      // Notify donor confirmation
      NotificationService.notify({
        userId: req.user.id,
        channel: 'app',
        title: 'Thank you for stepping up! ❤️',
        message: `You accepted blood request for ${request.patient_name}. The hospital/coordinator has received your contact details.`
      });
    }

    res.json({
      message: `You have successfully ${statusValue} this request.`,
      status: statusValue
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/requests/donor/incoming (Incoming requests for donor dashboard)
router.get('/donor/incoming', authenticate, (req, res, next) => {
  try {
    const donor = db.prepare('SELECT * FROM donors WHERE user_id = ?').get(req.user.id);
    if (!donor) {
      return res.status(400).json({ error: 'Donor profile not found' });
    }

    const matches = db.prepare(`
      SELECT rm.id as match_id, rm.status as match_status, rm.responded_at,
             r.id as request_id, r.patient_name, r.blood_group, r.units, r.hospital,
             r.city, r.urgency, r.contact_name, r.needed_by, r.notes, r.status as request_status,
             r.created_at
      FROM request_matches rm
      JOIN requests r ON rm.request_id = r.id
      WHERE rm.donor_id = ?
      ORDER BY r.created_at DESC
    `).all(donor.id);

    res.json(matches);
  } catch (err) {
    next(err);
  }
});

export default router;
