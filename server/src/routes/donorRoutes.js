import { Router } from 'express';
import { z } from 'zod';
import db from '../config/db.js';
import { authenticate } from '../middleware/auth.js';
import MatchingService, { RECIPIENT_COMPATIBILITY } from '../services/matchingService.js';

const router = Router();

function maskPhone(phone) {
  if (!phone) return '';
  const clean = phone.replace(/\s+/g, '');
  if (clean.length < 6) return '******';
  return clean.slice(0, 3) + '*****' + clean.slice(-2);
}

function maskEmail(email) {
  if (!email) return '';
  const parts = email.split('@');
  if (parts.length !== 2) return '*****@***.com';
  const name = parts[0];
  const domain = parts[1];
  const maskedName = name.length > 2 ? name[0] + '***' + name.slice(-1) : name[0] + '***';
  return `${maskedName}@${domain}`;
}

// GET /api/donors/search?bloodGroup=&city=&available=&eligible=&sort=
router.get('/search', (req, res, next) => {
  try {
    const { bloodGroup, city, available, eligible, sort, page = 1, limit = 12 } = req.query;

    let query = `
      SELECT d.*, u.name, u.email, u.phone
      FROM donors d
      JOIN users u ON d.user_id = u.id
      WHERE d.verified = 1
    `;
    const params = [];

    if (city && city.trim() !== '') {
      query += ` AND LOWER(d.city) LIKE LOWER(?)`;
      params.push(`%${city.trim()}%`);
    }

    if (bloodGroup && bloodGroup.trim() !== '') {
      // Allow exact match or compatible matches if requested
      const compatibleList = RECIPIENT_COMPATIBILITY[bloodGroup] || [bloodGroup];
      const placeholders = compatibleList.map(() => '?').join(',');
      query += ` AND d.blood_group IN (${placeholders})`;
      params.push(...compatibleList);
    }

    if (available !== undefined && available !== '') {
      query += ` AND d.available = ?`;
      params.push(available === 'true' || available === '1' ? 1 : 0);
    }

    const ninetyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    if (eligible === 'true' || eligible === '1') {
      query += ` AND (d.last_donated_at IS NULL OR d.last_donated_at <= ?)`;
      params.push(ninetyDaysAgo);
    } else if (eligible === 'false' || eligible === '0') {
      query += ` AND (d.last_donated_at > ?)`;
      params.push(ninetyDaysAgo);
    }

    if (bloodGroup && bloodGroup.trim() !== '') {
      query += ` ORDER BY CASE WHEN d.blood_group = ? THEN 0 ELSE 1 END ASC, d.available DESC, d.last_donated_at ASC`;
      params.push(bloodGroup);
    } else if (sort === 'nearest' || sort === 'city') {
      query += ` ORDER BY d.city ASC, d.available DESC`;
    } else {
      query += ` ORDER BY d.available DESC, d.created_at DESC`;
    }

    const offset = (parseInt(page, 10) - 1) * parseInt(limit, 10);
    query += ` LIMIT ? OFFSET ?`;
    params.push(parseInt(limit, 10), offset);

    const rows = db.prepare(query).all(...params);

    // Format & mask output for privacy
    const donors = rows.map(d => {
      const isEligible = MatchingService.isEligible(d.last_donated_at);
      const daysUntilEligible = MatchingService.getDaysUntilEligible(d.last_donated_at);
      
      // Mask name: "Rahul S."
      const nameParts = (d.name || '').trim().split(' ');
      const displayName = nameParts.length > 1 
        ? `${nameParts[0]} ${nameParts[nameParts.length - 1][0]}.`
        : nameParts[0] || 'Donor';

      return {
        id: d.id,
        displayName,
        bloodGroup: d.blood_group,
        gender: d.gender,
        age: d.age,
        state: d.state,
        city: d.city,
        area: d.area,
        lastDonatedAt: d.last_donated_at,
        available: Boolean(d.available),
        isEligible,
        daysUntilEligible,
        maskedPhone: maskPhone(d.phone),
        maskedEmail: maskEmail(d.email),
        createdAt: d.created_at
      };
    });

    // Count query for pagination
    let countQuery = `
      SELECT COUNT(*) as total
      FROM donors d
      JOIN users u ON d.user_id = u.id
      WHERE d.verified = 1
    `;
    const countParams = [];
    if (city && city.trim() !== '') {
      countQuery += ` AND LOWER(d.city) LIKE LOWER(?)`;
      countParams.push(`%${city.trim()}%`);
    }
    if (bloodGroup && bloodGroup.trim() !== '') {
      const compatibleList = RECIPIENT_COMPATIBILITY[bloodGroup] || [bloodGroup];
      const placeholders = compatibleList.map(() => '?').join(',');
      countQuery += ` AND d.blood_group IN (${placeholders})`;
      countParams.push(...compatibleList);
    }
    if (available !== undefined && available !== '') {
      countQuery += ` AND d.available = ?`;
      countParams.push(available === 'true' || available === '1' ? 1 : 0);
    }
    if (eligible === 'true' || eligible === '1') {
      countQuery += ` AND (d.last_donated_at IS NULL OR d.last_donated_at <= ?)`;
      countParams.push(ninetyDaysAgo);
    }
    const countResult = db.prepare(countQuery).get(...countParams);

    res.json({
      donors,
      total: countResult ? countResult.total : donors.length,
      page: parseInt(page, 10),
      totalPages: Math.ceil((countResult ? countResult.total : donors.length) / parseInt(limit, 10))
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/donors (All donors summary)
router.get('/', (req, res, next) => {
  try {
    const rows = db.prepare(`
      SELECT d.*, u.name, u.phone, u.email
      FROM donors d
      JOIN users u ON d.user_id = u.id
      WHERE d.verified = 1
      ORDER BY d.created_at DESC
      LIMIT 100
    `).all();

    const donors = rows.map(d => {
      const nameParts = (d.name || '').trim().split(' ');
      const displayName = nameParts.length > 1 
        ? `${nameParts[0]} ${nameParts[nameParts.length - 1][0]}.`
        : nameParts[0] || 'Donor';

      return {
        id: d.id,
        displayName,
        bloodGroup: d.blood_group,
        city: d.city,
        state: d.state,
        lastDonatedAt: d.last_donated_at,
        available: Boolean(d.available),
        isEligible: MatchingService.isEligible(d.last_donated_at),
        maskedPhone: maskPhone(d.phone),
        maskedEmail: maskEmail(d.email)
      };
    });

    res.json(donors);
  } catch (err) {
    next(err);
  }
});

// GET /api/donors/:id
router.get('/:id', (req, res, next) => {
  try {
    const d = db.prepare(`
      SELECT d.*, u.name, u.email, u.phone
      FROM donors d
      JOIN users u ON d.user_id = u.id
      WHERE d.id = ?
    `).get(req.params.id);

    if (!d) {
      return res.status(404).json({ error: 'Donor not found' });
    }

    const nameParts = (d.name || '').trim().split(' ');
    const displayName = nameParts.length > 1 
      ? `${nameParts[0]} ${nameParts[nameParts.length - 1][0]}.`
      : nameParts[0] || 'Donor';

    res.json({
      id: d.id,
      displayName,
      bloodGroup: d.blood_group,
      city: d.city,
      state: d.state,
      area: d.area,
      gender: d.gender,
      age: d.age,
      lastDonatedAt: d.last_donated_at,
      available: Boolean(d.available),
      isEligible: MatchingService.isEligible(d.last_donated_at),
      daysUntilEligible: MatchingService.getDaysUntilEligible(d.last_donated_at),
      maskedPhone: maskPhone(d.phone),
      maskedEmail: maskEmail(d.email),
      createdAt: d.created_at
    });
  } catch (err) {
    next(err);
  }
});

// PATCH /api/donors/me (Update donor's own profile)
router.patch('/me', authenticate, (req, res, next) => {
  try {
    const donor = db.prepare('SELECT * FROM donors WHERE user_id = ?').get(req.user.id);
    if (!donor) {
      return res.status(404).json({ error: 'Donor profile not found for this user.' });
    }

    const { available, lastDonatedAt, city, state, area, age } = req.body;

    const updates = [];
    const params = [];

    if (available !== undefined) {
      updates.push('available = ?');
      params.push(available ? 1 : 0);
    }
    if (lastDonatedAt !== undefined) {
      updates.push('last_donated_at = ?');
      params.push(lastDonatedAt);
    }
    if (city !== undefined) {
      updates.push('city = ?');
      params.push(city);
    }
    if (state !== undefined) {
      updates.push('state = ?');
      params.push(state);
    }
    if (area !== undefined) {
      updates.push('area = ?');
      params.push(area);
    }
    if (age !== undefined) {
      updates.push('age = ?');
      params.push(parseInt(age, 10));
    }

    if (updates.length > 0) {
      params.push(donor.id);
      db.prepare(`UPDATE donors SET ${updates.join(', ')} WHERE id = ?`).run(...params);
    }

    const updated = db.prepare('SELECT * FROM donors WHERE id = ?').get(donor.id);
    res.json({
      message: 'Donor profile updated',
      donor: {
        ...updated,
        available: Boolean(updated.available),
        isEligible: MatchingService.isEligible(updated.last_donated_at),
        daysUntilEligible: MatchingService.getDaysUntilEligible(updated.last_donated_at)
      }
    });
  } catch (err) {
    next(err);
  }
});

export default router;
