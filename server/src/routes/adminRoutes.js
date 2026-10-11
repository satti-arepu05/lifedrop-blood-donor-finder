import { Router } from 'express';
import db from '../config/db.js';
import { authenticate, authorize } from '../middleware/auth.js';

const router = Router();

// Protect all admin routes
router.use(authenticate, authorize('admin'));

// GET /api/admin/donors
router.get('/donors', (req, res, next) => {
  try {
    const { search, city, bloodGroup, verified } = req.query;
    let query = `
      SELECT d.*, u.name, u.email, u.phone, u.created_at as user_created_at
      FROM donors d
      JOIN users u ON d.user_id = u.id
      WHERE 1=1
    `;
    const params = [];

    if (search && search.trim() !== '') {
      query += ` AND (LOWER(u.name) LIKE LOWER(?) OR LOWER(u.email) LIKE LOWER(?) OR u.phone LIKE ?)`;
      const term = `%${search.trim()}%`;
      params.push(term, term, term);
    }

    if (city && city.trim() !== '') {
      query += ` AND LOWER(d.city) = LOWER(?)`;
      params.push(city.trim());
    }

    if (bloodGroup && bloodGroup.trim() !== '') {
      query += ` AND d.blood_group = ?`;
      params.push(bloodGroup);
    }

    if (verified !== undefined && verified !== '') {
      query += ` AND d.verified = ?`;
      params.push(verified === '1' || verified === 'true' ? 1 : 0);
    }

    query += ` ORDER BY d.created_at DESC`;

    const donors = db.prepare(query).all(...params);
    res.json(donors);
  } catch (err) {
    next(err);
  }
});

// PATCH /api/admin/donors/:id (Verify / Suspend / Edit status)
router.patch('/donors/:id', (req, res, next) => {
  try {
    const { verified, available } = req.body;
    const updates = [];
    const params = [];

    if (verified !== undefined) {
      updates.push('verified = ?');
      params.push(verified ? 1 : 0);
    }
    if (available !== undefined) {
      updates.push('available = ?');
      params.push(available ? 1 : 0);
    }

    if (updates.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }

    params.push(req.params.id);
    db.prepare(`UPDATE donors SET ${updates.join(', ')} WHERE id = ?`).run(...params);

    const updated = db.prepare('SELECT * FROM donors WHERE id = ?').get(req.params.id);
    res.json({ message: 'Donor updated successfully', donor: updated });
  } catch (err) {
    next(err);
  }
});

// DELETE /api/admin/donors/:id
router.delete('/donors/:id', (req, res, next) => {
  try {
    const donor = db.prepare('SELECT * FROM donors WHERE id = ?').get(req.params.id);
    if (!donor) {
      return res.status(404).json({ error: 'Donor not found' });
    }

    // Delete user which cascades to donor
    db.prepare('DELETE FROM users WHERE id = ?').run(donor.user_id);
    res.json({ message: 'Donor deleted successfully' });
  } catch (err) {
    next(err);
  }
});

// GET /api/admin/requests
router.get('/requests', (req, res, next) => {
  try {
    const requests = db.prepare(`
      SELECT r.*, u.name as requester_name, u.email as requester_email, u.phone as requester_phone,
        (SELECT COUNT(*) FROM request_matches WHERE request_id = r.id) as match_count,
        (SELECT COUNT(*) FROM request_matches WHERE request_id = r.id AND status = 'accepted') as accepted_count
      FROM requests r
      JOIN users u ON r.requester_id = u.id
      ORDER BY r.created_at DESC
    `).all();

    res.json(requests);
  } catch (err) {
    next(err);
  }
});

// GET /api/admin/notifications
router.get('/notifications', (req, res, next) => {
  try {
    const logs = db.prepare(`
      SELECT n.*, u.name as user_name, u.email as user_email
      FROM notifications n
      JOIN users u ON n.user_id = u.id
      ORDER BY n.created_at DESC
      LIMIT 100
    `).all();

    res.json(logs);
  } catch (err) {
    next(err);
  }
});

// GET /api/admin/export/donors.csv
router.get('/export/donors.csv', (req, res, next) => {
  try {
    const donors = db.prepare(`
      SELECT d.id, u.name, u.email, u.phone, d.blood_group, d.age, d.gender,
             d.city, d.state, d.area, d.last_donated_at, d.available, d.verified, d.created_at
      FROM donors d
      JOIN users u ON d.user_id = u.id
      ORDER BY d.id ASC
    `).all();

    const headers = [
      'ID', 'Name', 'Email', 'Phone', 'Blood Group', 'Age', 'Gender',
      'City', 'State', 'Area', 'Last Donated At', 'Available', 'Verified', 'Created At'
    ];

    const escapeCsv = (val) => {
      if (val === null || val === undefined) return '""';
      const str = String(val).replace(/"/g, '""');
      return `"${str}"`;
    };

    const rows = donors.map(d => [
      d.id,
      d.name,
      d.email,
      d.phone,
      d.blood_group,
      d.age,
      d.gender,
      d.city,
      d.state,
      d.area,
      d.last_donated_at || 'Never',
      d.available ? 'Yes' : 'No',
      d.verified ? 'Verified' : 'Suspended',
      d.created_at
    ].map(escapeCsv).join(','));

    const csvContent = [headers.join(','), ...rows].join('\r\n');

    res.setHeader('Content-Type', 'text/csv');
    res.setHeader('Content-Disposition', 'attachment; filename="lifedrop_donors.csv"');
    res.status(200).send(csvContent);
  } catch (err) {
    next(err);
  }
});

export default router;
