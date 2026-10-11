import db from '../config/db.js';

export class NotificationService {
  /**
   * Logs SMS/Email/App notifications to console and stores them in DB.
   * Can be easily swapped for Twilio/SendGrid in production.
   */
  static notify({ userId, channel = 'app', title, message }) {
    try {
      // Console logger with distinct formatting
      const timestamp = new Date().toISOString();
      const channelUpper = channel.toUpperCase();
      console.log(`\n======================================================`);
      console.log(`[SIMULATED ${channelUpper} NOTIFICATION] ${timestamp}`);
      console.log(`To User ID: ${userId}`);
      console.log(`Subject/Title: ${title}`);
      console.log(`Message: ${message}`);
      console.log(`======================================================\n`);

      // Store in notifications table
      const stmt = db.prepare(`
        INSERT INTO notifications (user_id, channel, title, message, read, created_at)
        VALUES (?, ?, ?, ?, 0, CURRENT_TIMESTAMP)
      `);
      const result = stmt.run(userId, channel, title, message);
      return { success: true, notificationId: result.lastInsertRowid };
    } catch (err) {
      console.error('Error in NotificationService.notify:', err.message);
      return { success: false, error: err.message };
    }
  }

  static getForUser(userId) {
    const stmt = db.prepare(`
      SELECT * FROM notifications
      WHERE user_id = ?
      ORDER BY created_at DESC
    `);
    return stmt.all(userId);
  }

  static markAsRead(notificationId, userId) {
    const stmt = db.prepare(`
      UPDATE notifications
      SET read = 1
      WHERE id = ? AND user_id = ?
    `);
    return stmt.run(notificationId, userId);
  }

  static markAllAsRead(userId) {
    const stmt = db.prepare(`
      UPDATE notifications
      SET read = 1
      WHERE user_id = ?
    `);
    return stmt.run(userId);
  }
}

export default NotificationService;
