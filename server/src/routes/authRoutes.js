import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { z } from 'zod';
import db from '../config/db.js';
import { authenticate, generateToken } from '../middleware/auth.js';
import NotificationService from '../services/notificationService.js';

const router = Router();

const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  phone: z.string().min(10, 'Phone must be at least 10 digits'),
  role: z.enum(['donor', 'hospital', 'admin']).default('donor'),
  // Optional donor fields if role === 'donor'
  donorDetails: z.object({
    age: z.number().int().min(18, 'Must be at least 18 years old').max(65, 'Must be 65 or younger'),
    gender: z.string().min(1, 'Gender is required'),
    bloodGroup: z.enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-']),
    state: z.string().min(2, 'State is required'),
    city: z.string().min(2, 'City is required'),
    area: z.string().optional(),
    lastDonatedAt: z.string().nullable().optional(),
    available: z.boolean().default(true),
    consent: z.boolean().refine(val => val === true, 'Consent is required')
  }).optional()
});

const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(1, 'Password is required')
});

// POST /api/auth/register
router.post('/register', async (req, res, next) => {
  try {
    const data = registerSchema.parse(req.body);

    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(data.email.toLowerCase());
    if (existing) {
      return res.status(409).json({ error: 'An account with this email already exists.' });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(data.password, salt);

    const insertUser = db.prepare(`
      INSERT INTO users (name, email, password_hash, role, phone)
      VALUES (?, ?, ?, ?, ?)
    `);

    const result = insertUser.run(
      data.name,
      data.email.toLowerCase(),
      passwordHash,
      data.role,
      data.phone
    );

    const userId = result.lastInsertRowid;
    let donorId = null;

    if (data.role === 'donor' && data.donorDetails) {
      const d = data.donorDetails;
      const insertDonor = db.prepare(`
        INSERT INTO donors (user_id, age, gender, blood_group, state, city, area, last_donated_at, available, verified, consent)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1, ?)
      `);
      const donorRes = insertDonor.run(
        userId,
        d.age,
        d.gender,
        d.bloodGroup,
        d.state,
        d.city,
        d.area || '',
        d.lastDonatedAt || null,
        d.available ? 1 : 0,
        d.consent ? 1 : 0
      );
      donorId = donorRes.lastInsertRowid;

      // Welcome notification
      NotificationService.notify({
        userId,
        channel: 'app',
        title: 'Welcome to LifeDrop! 🩸',
        message: `Thank you for registering as a ${d.bloodGroup} donor in ${d.city}. You are ready to save lives!`
      });
    }

    const user = {
      id: userId,
      name: data.name,
      email: data.email.toLowerCase(),
      role: data.role,
      phone: data.phone,
      donorId
    };

    const token = generateToken(user);

    res.status(201).json({
      message: 'Registration successful',
      token,
      user
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/auth/login
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = loginSchema.parse(req.body);

    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email.toLowerCase());
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    let donor = null;
    if (user.role === 'donor') {
      donor = db.prepare('SELECT * FROM donors WHERE user_id = ?').get(user.id);
    }

    const userPayload = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      phone: user.phone,
      donorId: donor ? donor.id : null
    };

    const token = generateToken(userPayload);

    res.json({
      message: 'Login successful',
      token,
      user: {
        ...userPayload,
        donor
      }
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/auth/me
router.get('/me', authenticate, (req, res) => {
  let donor = null;
  if (req.user.role === 'donor') {
    donor = db.prepare('SELECT * FROM donors WHERE user_id = ?').get(req.user.id);
  }
  res.json({
    user: {
      ...req.user,
      donor
    }
  });
});

export default router;
