# LifeDrop – Emergency Blood Donor Finder & Matching Platform

> **"Blood is to humans what water is to plants."**  
> *The right donor at the right time can save a life.*

LifeDrop is a full-stack emergency healthcare web platform that connects voluntary blood donors with hospitals, patients, and intensive care units in real-time. Built with a clean, medical-grade aesthetic, local SQLite database persistence, and smart clinical compatibility matching.

---

## 🚀 Key Highlights & Features

- **Autonomous Clinical Compatibility Engine**: Uses standard AB/O transfusion matrices (e.g. O- universal donor, AB+ universal recipient) to find matching donors in the exact patient city, prioritizing exact blood matches.
- **Automated 90-Day Eligibility Protocol**: Calculates countdown intervals automatically based on the donor's previous donation date, preventing early repeat donations and protecting volunteer health.
- **Privacy-by-Default Architecture**: All donor phone numbers and emails are masked across searches and public tables. Contact details unlock only after the donor explicitly clicks "Accept" to save a life.
- **Real-Time Telemetry Tracker**: Live request status pipeline (`/request/:id`) showing status progression: `Pending` ➔ `Accepted` ➔ `Fulfilled`.
- **Pluggable Multi-Channel Notifications**: Integrated notification service logging formatted SMS, Email, and in-app alerts directly to the database and server console (production-ready for Twilio/SendGrid).
- **Multi-Language UI**: English, Hindi (हिंदी), and Telugu (తెలుగు) with dynamic switching via `i18next`.
- **Dark & Light Mode**: Accessible, medical-grade color scheme with high contrast and smooth transitions.
- **Admin Control Terminal**: Recharts visualization, unmasked donor directory, suspend/verify toggles, notification audit logs, and 1-click CSV export.

---

## 🛠️ Tech Stack

- **Frontend**: React 18, Vite, Tailwind CSS, React Router v6, Lucide Icons, Recharts, i18next.
- **Backend**: Node.js, Express, Better-SQLite3, JWT, bcryptjs, Helmet, Express Rate Limit, Zod validation.
- **Database**: SQLite (`server/data/lifedrop.db`), auto-created with WAL mode.
- **Monorepo Layout**: `/client` and `/server` orchestrated from root `package.json`.

---

## 🔑 Demo Credentials

| Role | Email | Password | Access Area |
| :--- | :--- | :--- | :--- |
| **Admin** | `admin@lifedrop.com` | `Admin@123` | `/admin` (Analytics, CSV Export, Governance) |
| **Hospital (Hyderabad)** | `apollo.hyd@lifedrop.com` | `Hospital@123` | `/hospital` (Case Roster, Unlocked Contacts) |
| **Hospital (Bengaluru)** | `manipal.blr@lifedrop.com` | `Hospital@123` | `/hospital` (Case Roster, Fulfilled Controls) |
| **Sample Donor** | `donor1@lifedrop.com` | `Donor@123` | `/dashboard` (Cooldown timer, Accept / Decline) |
| **Any Donor 1-50** | `donorX@lifedrop.com` | `Donor@123` | `/dashboard` (Where X is 1 to 50) |

*(Quick 1-click login buttons are also provided on the `/login` page for instant testing).*

---

## 🏁 Quickstart & Installation

From the project root:

```bash
# 1. Install all dependencies across root, server, and client
npm run install:all

# 2. Seed database with Admin, 2 Hospitals, 50 Realistic Indian Donors, and 10 Requests
npm run seed

# 3. Start development servers (Backend: 5000, Frontend: 5173)
npm run dev
```

Visit the application at **[http://localhost:5173](http://localhost:5173)**.

---

## 📡 REST API Summary

### Authentication (`/api/auth`)
- `POST /api/auth/register` - Create user and optional donor profile.
- `POST /api/auth/login` - Authenticate credentials and return signed JWT.
- `GET /api/auth/me` - Fetch authenticated user & donor profile.

### Donors (`/api/donors`)
- `GET /api/donors/search` - Search donors by blood group, city, availability, eligibility (contacts masked).
- `GET /api/donors` - Public list of donors with masked privacy.
- `GET /api/donors/:id` - Donor details.
- `PATCH /api/donors/me` - Update availability toggle, last donation date, location.

### Emergency Requests (`/api/requests`)
- `POST /api/requests` - Lodge emergency request, run matching engine, dispatch alerts.
- `GET /api/requests/mine` - List requests created by current hospital.
- `GET /api/requests/:id` - Live telemetry tracker (unlocked donor contacts if requester/admin).
- `PATCH /api/requests/:id/status` - Update status (`Pending`, `Accepted`, `Fulfilled`, `Cancelled`).
- `POST /api/requests/:id/respond` - Donor accepts or declines request.
- `GET /api/requests/donor/incoming` - Matches targeted to current donor.

### System & Admin (`/api/admin` & `/api/stats`)
- `GET /api/stats` - Live aggregates for hero strip and chart components.
- `GET /api/admin/donors` - Unmasked donor directory for governance.
- `PATCH /api/admin/donors/:id` - Verify / suspend donor.
- `DELETE /api/admin/donors/:id` - Delete donor record.
- `GET /api/admin/requests` - Complete requests log.
- `GET /api/admin/notifications` - Multi-channel notification audit trail.
- `GET /api/admin/export/donors.csv` - Download donor registry as formatted CSV.
- `POST /api/contact` - Submit contact inquiry to SQLite.

---

## 🧪 Testing User Flows

1. **Register Donor Flow**: Navigate to `/register-donor`, enter details, observe 90-day cooldown auto-calculation, submit, and arrive at `/dashboard`.
2. **Emergency Request Flow**: Navigate to `/request-blood`, create request for `A+` in `Hyderabad`. System calculates matches and reports "X donors notified".
3. **Donor Acceptance**: Log in as `donor3@lifedrop.com`, visit `/dashboard`, see the incoming request, click **Accept & Save Life**.
4. **Hospital Contact Unlock**: Log in as `apollo.hyd@lifedrop.com`, open `/hospital` or the request tracker `/request/:id`, observe that the accepted donor's direct phone number is now unlocked.
5. **Mark Fulfilled**: Click **Mark Fulfilled** to record saved life.
6. **Admin Panel**: Log in as `admin@lifedrop.com`, visit `/admin` to review Recharts graphs and export CSV.
