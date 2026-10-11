import { Router } from 'express';
import db from '../config/db.js';

const router = Router();

// GET /api/stats
router.get('/', (req, res, next) => {
  try {
    const totalDonors = db.prepare('SELECT COUNT(*) as count FROM donors WHERE verified = 1').get().count;
    const citiesCount = db.prepare('SELECT COUNT(DISTINCT LOWER(city)) as count FROM donors WHERE verified = 1').get().count;
    const totalRequests = db.prepare('SELECT COUNT(*) as count FROM requests').get().count;
    const fulfilledRequests = db.prepare("SELECT COUNT(*) as count FROM requests WHERE status = 'Fulfilled'").get().count;
    const activeRequests = db.prepare("SELECT COUNT(*) as count FROM requests WHERE status IN ('Pending', 'Accepted')").get().count;
    const availableDonors = db.prepare('SELECT COUNT(*) as count FROM donors WHERE available = 1 AND verified = 1').get().count;

    // Blood groups breakdown
    const bloodGroups = db.prepare(`
      SELECT blood_group, COUNT(*) as count
      FROM donors
      WHERE verified = 1
      GROUP BY blood_group
      ORDER BY blood_group ASC
    `).all();

    // City distribution
    const topCities = db.prepare(`
      SELECT city, COUNT(*) as count
      FROM donors
      WHERE verified = 1
      GROUP BY city
      ORDER BY count DESC
      LIMIT 6
    `).all();

    // Urgency breakdown
    const requestsByUrgency = db.prepare(`
      SELECT urgency, COUNT(*) as count
      FROM requests
      GROUP BY urgency
    `).all();

    res.json({
      totalDonors,
      citiesCount,
      totalRequests,
      fulfilledRequests,
      activeRequests,
      availableDonors,
      bloodGroups,
      topCities,
      requestsByUrgency
    });
  } catch (err) {
    next(err);
  }
});

export default router;
