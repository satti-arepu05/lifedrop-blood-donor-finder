import bcrypt from 'bcryptjs';
import db, { initDb } from './config/db.js';

async function seed() {
  console.log('🌱 Starting LifeDrop Database Seeding...');
  initDb();

  // Clean existing data for clean seed
  db.exec(`
    DELETE FROM contact_messages;
    DELETE FROM notifications;
    DELETE FROM donations;
    DELETE FROM request_matches;
    DELETE FROM requests;
    DELETE FROM donors;
    DELETE FROM users;
    DELETE FROM sqlite_sequence;
  `);

  const passwordHash = await bcrypt.hash('Admin@123', 10);
  const hospitalHash = await bcrypt.hash('Hospital@123', 10);
  const donorHash = await bcrypt.hash('Donor@123', 10);

  // 1. Admin
  const adminRes = db.prepare(`
    INSERT INTO users (name, email, password_hash, role, phone)
    VALUES (?, ?, ?, 'admin', ?)
  `).run('LifeDrop Central Admin', 'admin@lifedrop.com', passwordHash, '+91 98765 00001');
  const adminId = adminRes.lastInsertRowid;
  console.log(`✅ Admin created: admin@lifedrop.com (ID: ${adminId})`);

  // 2. Hospitals
  const hosp1Res = db.prepare(`
    INSERT INTO users (name, email, password_hash, role, phone)
    VALUES (?, ?, ?, 'hospital', ?)
  `).run('Apollo Hospitals - Jubilee Hills', 'apollo.hyd@lifedrop.com', hospitalHash, '+91 98765 00002');
  const hosp1Id = hosp1Res.lastInsertRowid;

  const hosp2Res = db.prepare(`
    INSERT INTO users (name, email, password_hash, role, phone)
    VALUES (?, ?, ?, 'hospital', ?)
  `).run('Manipal Hospital - Old Airport Rd', 'manipal.blr@lifedrop.com', hospitalHash, '+91 98765 00003');
  const hosp2Id = hosp2Res.lastInsertRowid;

  console.log(`✅ 2 Hospitals created (IDs: ${hosp1Id}, ${hosp2Id})`);

  // 3. 50 Realistic Indian Donors
  const indianCities = [
    { city: 'Hyderabad', state: 'Telangana', areas: ['Banjara Hills', 'Madhapur', 'Gachibowli', 'Kukatpally', 'Secunderabad', 'Ameerpet'] },
    { city: 'Bengaluru', state: 'Karnataka', areas: ['Indiranagar', 'Koramangala', 'Whitefield', 'HSR Layout', 'Jayanagar', 'Electronic City'] },
    { city: 'Chennai', state: 'Tamil Nadu', areas: ['T. Nagar', 'Adyar', 'Velachery', 'Anna Nagar', 'Mylapore', 'Guindy'] },
    { city: 'Mumbai', state: 'Maharashtra', areas: ['Andheri West', 'Bandra', 'Powai', 'Dadar', 'Borivali', 'Thane'] },
    { city: 'Delhi', state: 'Delhi NCR', areas: ['Connaught Place', 'Saket', 'Dwarka', 'Rohini', 'Hauz Khas', 'Lajpat Nagar'] },
    { city: 'Vijayawada', state: 'Andhra Pradesh', areas: ['Benz Circle', 'Governorpet', 'Moghalrajpuram', 'Bhavanipuram', 'Patamata', 'Gandhinagar'] }
  ];

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];

  const donorNames = [
    { name: 'Aarav Sharma', gender: 'Male' },
    { name: 'Priya Patel', gender: 'Female' },
    { name: 'Sai Charan Reddy', gender: 'Male' },
    { name: 'Ananya Deshmukh', gender: 'Female' },
    { name: 'Rohan Verma', gender: 'Male' },
    { name: 'Sneha Kulkarni', gender: 'Female' },
    { name: 'Vikram Iyer', gender: 'Male' },
    { name: 'Deepika Nair', gender: 'Female' },
    { name: 'Arjun Rao', gender: 'Male' },
    { name: 'Kavya Subramanian', gender: 'Female' },
    { name: 'Aditya Gupta', gender: 'Male' },
    { name: 'Pooja Hegde', gender: 'Female' },
    { name: 'Manoj Kumar', gender: 'Male' },
    { name: 'Divya Sree', gender: 'Female' },
    { name: 'Siddharth Joshi', gender: 'Male' },
    { name: 'Neha Chawla', gender: 'Female' },
    { name: 'Kiran Goud', gender: 'Male' },
    { name: 'Swati Menon', gender: 'Female' },
    { name: 'Harsha Vardhan', gender: 'Male' },
    { name: 'Meera Nambiar', gender: 'Female' },
    { name: 'Gautam Singhania', gender: 'Male' },
    { name: 'Ritu Agarwal', gender: 'Female' },
    { name: 'Teja Krishna', gender: 'Male' },
    { name: 'Shreya Ghosal', gender: 'Female' },
    { name: 'Nikhil Kamath', gender: 'Male' },
    { name: 'Pallavi Rao', gender: 'Female' },
    { name: 'Suresh Raina', gender: 'Male' },
    { name: 'Tanvi Shah', gender: 'Female' },
    { name: 'Varun Tej', gender: 'Male' },
    { name: 'Ishita Dutta', gender: 'Female' },
    { name: 'Karthik Aryan', gender: 'Male' },
    { name: 'Lavanya Tripathi', gender: 'Female' },
    { name: 'Pranav Mohan', gender: 'Male' },
    { name: 'Rhea Chakraborty', gender: 'Female' },
    { name: 'Vivek Oberoi', gender: 'Male' },
    { name: 'Trisha Krishnan', gender: 'Female' },
    { name: 'Akhil Akkineni', gender: 'Male' },
    { name: 'Shruti Haasan', gender: 'Female' },
    { name: 'Chaitanya Varma', gender: 'Male' },
    { name: 'Rashmika Mandanna', gender: 'Female' },
    { name: 'Mahesh Babu', gender: 'Male' },
    { name: 'Samantha Ruth', gender: 'Female' },
    { name: 'Nani Bellamkonda', gender: 'Male' },
    { name: 'Keerthy Suresh', gender: 'Female' },
    { name: 'Ram Charan', gender: 'Male' },
    { name: 'Upasana Kamineni', gender: 'Female' },
    { name: 'Tarun Bhaskar', gender: 'Male' },
    { name: 'Rashi Khanna', gender: 'Female' },
    { name: 'Vijay Deverakonda', gender: 'Male' },
    { name: 'Mrunal Thakur', gender: 'Female' }
  ];

  const now = new Date();
  const donorUserIds = [];

  for (let i = 0; i < donorNames.length; i++) {
    const item = donorNames[i];
    const cityObj = indianCities[i % indianCities.length];
    const area = cityObj.areas[i % cityObj.areas.length];
    const bloodGroup = bloodGroups[i % bloodGroups.length];
    const age = 20 + ((i * 3) % 40); // 20 - 59
    const email = `donor${i + 1}@lifedrop.com`;
    const phone = `+91 ${9800000000 + i * 11111}`;

    const userRes = db.prepare(`
      INSERT INTO users (name, email, password_hash, role, phone)
      VALUES (?, ?, ?, 'donor', ?)
    `).run(item.name, email, donorHash, phone);

    const userId = userRes.lastInsertRowid;
    donorUserIds.push(userId);

    // Compute last_donated_at: mix of eligible (>90 days ago or null) and recent donors (<90 days ago)
    let lastDonatedAt = null;
    if (i % 4 === 1) {
      // 30 days ago (currently ineligible)
      const d = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      lastDonatedAt = d.toISOString().split('T')[0];
    } else if (i % 4 === 2) {
      // 120 days ago (eligible)
      const d = new Date(now.getTime() - 120 * 24 * 60 * 60 * 1000);
      lastDonatedAt = d.toISOString().split('T')[0];
    } else if (i % 4 === 3) {
      // 200 days ago (eligible)
      const d = new Date(now.getTime() - 200 * 24 * 60 * 60 * 1000);
      lastDonatedAt = d.toISOString().split('T')[0];
    } // i % 4 === 0 is null (first time donor, eligible)

    const available = i % 10 === 0 ? 0 : 1; // 90% available

    db.prepare(`
      INSERT INTO donors (user_id, age, gender, blood_group, state, city, area, last_donated_at, available, verified, consent)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, 1, 1)
    `).run(
      userId,
      age,
      item.gender,
      bloodGroup,
      cityObj.state,
      cityObj.city,
      area,
      lastDonatedAt,
      available
    );
  }

  console.log(`✅ 50 Realistic Indian Donors seeded across 6 cities with all 8 blood groups`);

  // 4. Sample Requests in different statuses
  const sampleRequests = [
    {
      requesterId: hosp1Id,
      patientName: 'Ramesh Sundaram',
      bloodGroup: 'O+',
      units: 2,
      hospital: 'Apollo Hospitals - Jubilee Hills',
      city: 'Hyderabad',
      urgency: 'Critical',
      contactName: 'Dr. Suresh Kumar (ICU)',
      contactPhone: '+91 98480 12345',
      notes: 'Emergency bypass surgery. Urgent requirement within 2 hours.',
      status: 'Pending'
    },
    {
      requesterId: hosp1Id,
      patientName: 'Lakshmi Narayana',
      bloodGroup: 'A+',
      units: 1,
      hospital: 'KIMS Hospitals - Secunderabad',
      city: 'Hyderabad',
      urgency: 'Urgent',
      contactName: 'Smt. Radhika (Wife)',
      contactPhone: '+91 98480 54321',
      notes: 'Severe anemia condition under treatment.',
      status: 'Accepted'
    },
    {
      requesterId: hosp2Id,
      patientName: 'Anil Deshpande',
      bloodGroup: 'B+',
      units: 3,
      hospital: 'Manipal Hospital - Old Airport Rd',
      city: 'Bengaluru',
      urgency: 'Critical',
      contactName: 'Emergency Trauma Desk',
      contactPhone: '+91 98800 11223',
      notes: 'Road traffic accident victim admitted in critical condition.',
      status: 'Accepted'
    },
    {
      requesterId: hosp2Id,
      patientName: 'Sunita Mehra',
      bloodGroup: 'AB+',
      units: 1,
      hospital: 'Fortis Hospital - Bannerghatta Road',
      city: 'Bengaluru',
      urgency: 'Normal',
      contactName: 'Rajesh Mehra',
      contactPhone: '+91 98800 99887',
      notes: 'Scheduled orthopedic joint replacement surgery.',
      status: 'Fulfilled'
    },
    {
      requesterId: hosp1Id,
      patientName: 'Karthik Chidambaram',
      bloodGroup: 'O-',
      units: 2,
      hospital: 'MGM Healthcare',
      city: 'Chennai',
      urgency: 'Critical',
      contactName: 'Dr. V. Ramanathan',
      contactPhone: '+91 94440 22334',
      notes: 'Rare O- blood needed for urgent cardiac pediatric surgery.',
      status: 'Pending'
    },
    {
      requesterId: hosp2Id,
      patientName: 'Farhan Akhtar',
      bloodGroup: 'A-',
      units: 1,
      hospital: 'Lilavati Hospital - Bandra',
      city: 'Mumbai',
      urgency: 'Urgent',
      contactName: 'Salma Begum',
      contactPhone: '+91 98200 44556',
      notes: 'Dengue with severe platelet count reduction.',
      status: 'Fulfilled'
    },
    {
      requesterId: hosp1Id,
      patientName: 'Gurpreet Singh',
      bloodGroup: 'B-',
      units: 2,
      hospital: 'AIIMS New Delhi',
      city: 'Delhi',
      urgency: 'Critical',
      contactName: 'Harpreet Singh (Brother)',
      contactPhone: '+91 98110 77889',
      notes: 'Major trauma resuscitation at trauma center.',
      status: 'Pending'
    },
    {
      requesterId: hosp2Id,
      patientName: 'Srinivasulu Reddy',
      bloodGroup: 'AB-',
      units: 1,
      hospital: 'Andhra Hospitals - Heart and Brain Institute',
      city: 'Vijayawada',
      urgency: 'Urgent',
      contactName: 'Venkatesh Reddy',
      contactPhone: '+91 98660 33445',
      notes: 'Nephrology dialysis patient with low hemoglobin.',
      status: 'Fulfilled'
    },
    {
      requesterId: hosp1Id,
      patientName: 'Geeta Sharma',
      bloodGroup: 'O+',
      units: 1,
      hospital: 'Care Hospitals - Banjara Hills',
      city: 'Hyderabad',
      urgency: 'Normal',
      contactName: 'Alok Sharma',
      contactPhone: '+91 98490 66778',
      notes: 'Post-delivery postpartum recovery support.',
      status: 'Fulfilled'
    },
    {
      requesterId: hosp2Id,
      patientName: 'Tanvi Saxena',
      bloodGroup: 'A+',
      units: 1,
      hospital: 'Max Super Speciality Hospital - Saket',
      city: 'Delhi',
      urgency: 'Normal',
      contactName: 'Rohit Saxena',
      contactPhone: '+91 98100 88990',
      notes: 'Patient was discharged, request cancelled.',
      status: 'Cancelled'
    }
  ];

  const requestIds = [];
  for (const req of sampleRequests) {
    const res = db.prepare(`
      INSERT INTO requests (
        requester_id, patient_name, blood_group, units, hospital,
        city, urgency, contact_name, contact_phone, notes, status, created_at
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, CURRENT_TIMESTAMP)
    `).run(
      req.requesterId,
      req.patientName,
      req.bloodGroup,
      req.units,
      req.hospital,
      req.city,
      req.urgency,
      req.contactName,
      req.contactPhone,
      req.notes,
      req.status
    );
    requestIds.push(res.lastInsertRowid);
  }

  console.log(`✅ 10 Sample blood requests created with various statuses`);

  // 5. Connect matching donors to requests
  // For request #2 (Accepted in Hyderabad), match donor 3 (Sai Charan Reddy in Hyderabad) as 'accepted'
  const donorSai = db.prepare(`
    SELECT d.id, d.user_id FROM donors d
    JOIN users u ON d.user_id = u.id
    WHERE u.name LIKE '%Sai Charan Reddy%'
  `).get();

  if (donorSai) {
    db.prepare(`
      INSERT OR IGNORE INTO request_matches (request_id, donor_id, status, responded_at)
      VALUES (?, ?, 'accepted', CURRENT_TIMESTAMP)
    `).run(requestIds[1], donorSai.id);

    // Initial notification for donor Sai
    db.prepare(`
      INSERT INTO notifications (user_id, channel, title, message, read, created_at)
      VALUES (?, 'app', 'Emergency Blood Request Match: A+ Needed', 'Patient Lakshmi Narayana at KIMS Hospitals needs your A+ blood.', 0, CURRENT_TIMESTAMP)
    `).run(donorSai.user_id);
  }

  // Also notify Apollo hospital that donor accepted
  db.prepare(`
    INSERT INTO notifications (user_id, channel, title, message, read, created_at)
    VALUES (?, 'app', '🎉 Donor Accepted Your Request!', 'Donor Sai Charan Reddy has accepted request for Lakshmi Narayana. Contact details are now unlocked.', 0, CURRENT_TIMESTAMP)
  `).run(hosp1Id);

  // 6. Contact message sample
  db.prepare(`
    INSERT INTO contact_messages (name, email, message)
    VALUES ('Dr. K. Srinath', 'srinath@redcrossindia.org', 'We would love to partner with LifeDrop for community blood donation drives in South India.')
  `).run();

  console.log('🎉 Seeding successfully completed!');
}

seed().catch(err => {
  console.error('❌ Seeding failed:', err);
  process.exit(1);
});
