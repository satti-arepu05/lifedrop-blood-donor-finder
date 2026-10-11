import db from '../config/db.js';
import NotificationService from './notificationService.js';

// Who can donate to whom:
// Key = recipient blood group (the one needed by the patient)
// Value = list of compatible donor blood groups
export const RECIPIENT_COMPATIBILITY = {
  'A+': ['A+', 'A-', 'O+', 'O-'],
  'A-': ['A-', 'O-'],
  'B+': ['B+', 'B-', 'O+', 'O-'],
  'B-': ['B-', 'O-'],
  'AB+': ['AB+', 'AB-', 'A+', 'A-', 'B+', 'B-', 'O+', 'O-'],
  'AB-': ['AB-', 'A-', 'B-', 'O-'],
  'O+': ['O+', 'O-'],
  'O-': ['O-']
};

// Who can donate to whom:
// Key = donor blood group
// Value = list of recipient blood groups that can receive this blood
export const DONOR_COMPATIBILITY = {
  'O-': ['O-', 'O+', 'A-', 'A+', 'B-', 'B+', 'AB-', 'AB+'],
  'O+': ['O+', 'A+', 'B+', 'AB+'],
  'A-': ['A-', 'A+', 'AB-', 'AB+'],
  'A+': ['A+', 'AB+'],
  'B-': ['B-', 'B+', 'AB-', 'AB+'],
  'B+': ['B+', 'AB+'],
  'AB-': ['AB-', 'AB+'],
  'AB+': ['AB+']
};

export class MatchingService {
  /**
   * Calculate if donor is eligible (last donation was 90+ days ago or null).
   */
  static isEligible(lastDonatedAt) {
    if (!lastDonatedAt) return true;
    const lastDate = new Date(lastDonatedAt);
    const now = new Date();
    const diffTime = now.getTime() - lastDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return diffDays >= 90;
  }

  static getDaysUntilEligible(lastDonatedAt) {
    if (!lastDonatedAt) return 0;
    const lastDate = new Date(lastDonatedAt);
    const now = new Date();
    const diffTime = now.getTime() - lastDate.getTime();
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, 90 - diffDays);
  }

  /**
   * Find matching donors for a blood request
   */
  static findMatchesForRequest(requestId) {
    const request = db.prepare('SELECT * FROM requests WHERE id = ?').get(requestId);
    if (!request) return [];

    const compatibleGroups = RECIPIENT_COMPATIBILITY[request.blood_group] || [request.blood_group];
    const placeholders = compatibleGroups.map(() => '?').join(',');

    // 90 days ago cutoff string in SQLite (YYYY-MM-DD)
    const ninetyDaysAgo = new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0];

    const query = `
      SELECT d.*, u.name, u.email, u.phone
      FROM donors d
      JOIN users u ON d.user_id = u.id
      WHERE LOWER(d.city) = LOWER(?)
        AND d.available = 1
        AND d.verified = 1
        AND d.blood_group IN (${placeholders})
        AND (d.last_donated_at IS NULL OR d.last_donated_at <= ?)
      ORDER BY
        CASE WHEN d.blood_group = ? THEN 0 ELSE 1 END ASC,
        d.last_donated_at ASC
    `;

    const donors = db.prepare(query).all(
      request.city,
      ...compatibleGroups,
      ninetyDaysAgo,
      request.blood_group
    );

    return donors;
  }

  /**
   * Match donors for a request, record request_matches, and send notifications
   */
  static matchAndNotifyDonors(request) {
    const matchedDonors = this.findMatchesForRequest(request.id);
    let notifiedCount = 0;

    const insertMatch = db.prepare(`
      INSERT OR IGNORE INTO request_matches (request_id, donor_id, status)
      VALUES (?, ?, 'notified')
    `);

    for (const donor of matchedDonors) {
      const matchResult = insertMatch.run(request.id, donor.id);
      if (matchResult.changes > 0) {
        notifiedCount++;

        // Send notifications
        const urgencyTag = request.urgency === 'Critical' ? '🚨 CRITICAL' : (request.urgency === 'Urgent' ? '⚠️ URGENT' : '🩸');
        const notificationTitle = `${urgencyTag} Blood Request: ${request.blood_group} Needed in ${request.city}`;
        const notificationMessage = `Patient ${request.patient_name} at ${request.hospital} urgently needs ${request.units} unit(s) of ${request.blood_group} blood. Please respond to save a life!`;

        // Send App notification
        NotificationService.notify({
          userId: donor.user_id,
          channel: 'app',
          title: notificationTitle,
          message: notificationMessage
        });

        // Send Simulated SMS
        NotificationService.notify({
          userId: donor.user_id,
          channel: 'sms',
          title: `SMS Alert to ${donor.phone}`,
          message: `LifeDrop: ${notificationTitle}. Reply via LifeDrop portal to accept.`
        });

        // Send Simulated Email
        NotificationService.notify({
          userId: donor.user_id,
          channel: 'email',
          title: `Emergency Blood Request - LifeDrop`,
          message: `Dear ${donor.name},\n${notificationMessage}\nLocation: ${request.hospital}, ${request.city}.\nContact: ${request.contact_name} (${request.contact_phone})`
        });
      }
    }

    return { matchedDonors, notifiedCount };
  }
}

export default MatchingService;
