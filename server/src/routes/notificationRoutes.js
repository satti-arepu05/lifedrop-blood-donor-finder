import { Router } from 'express';
import { authenticate } from '../middleware/auth.js';
import NotificationService from '../services/notificationService.js';

const router = Router();

// GET /api/notifications
router.get('/', authenticate, (req, res, next) => {
  try {
    const list = NotificationService.getForUser(req.user.id);
    res.json(list);
  } catch (err) {
    next(err);
  }
});

// PATCH /api/notifications/:id/read
router.patch('/:id/read', authenticate, (req, res, next) => {
  try {
    NotificationService.markAsRead(req.params.id, req.user.id);
    res.json({ message: 'Marked as read' });
  } catch (err) {
    next(err);
  }
});

// POST /api/notifications/read-all
router.post('/read-all', authenticate, (req, res, next) => {
  try {
    NotificationService.markAllAsRead(req.user.id);
    res.json({ message: 'All marked as read' });
  } catch (err) {
    next(err);
  }
});

export default router;
