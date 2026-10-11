import { Router } from 'express';
import { z } from 'zod';
import db from '../config/db.js';

const router = Router();

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Valid email address is required'),
  message: z.string().min(10, 'Message must be at least 10 characters')
});

// POST /api/contact
router.post('/', (req, res, next) => {
  try {
    const data = contactSchema.parse(req.body);

    const stmt = db.prepare(`
      INSERT INTO contact_messages (name, email, message)
      VALUES (?, ?, ?)
    `);
    stmt.run(data.name, data.email, data.message);

    res.status(201).json({
      message: 'Thank you for reaching out! Our team will get back to you shortly.'
    });
  } catch (err) {
    next(err);
  }
});

export default router;
