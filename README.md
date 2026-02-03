# 🦎 Newt Tracker (v2.0) - Premium Field Operations Platform

**Newt Tracker** is a professional, high-performance field operations tracking system built for speed, transparency, and data-driven decision making. Designed for field teams and administrators, it provides a seamless experience for logging activities, tracking sales, and analyzing team performance with real-time visualization.

[![Tech Stack](https://img.shields.io/badge/Stack-Next.js%2014%20%7C%20Node.js%20%7C%20PostgreSQL-green)](https://github.com/Chirag1724/Occamy)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Performance](https://img.shields.io/badge/UX-Premium%20Glassmorphic-orange)](#)

---

## 🚀 Phase 2 Upgrade: Live Now!
This version introduces a complete suite of field operations tools:
- **📍 Smart Geo-Logging**: Map-based verification for every meeting and sale.
- **📸 Multi-Photo Evidence**: Upload site photos directly to Cloudinary via the app.
- **📊 Advanced Admin Analytics**: Deep-dive into B2C vs B2B revenue, state-wise activity, and distributor rankings.
- **🛣️ Daily Activity Feeds**: Real-time stream of field events across the country.

---

## ✨ Core Features

### For Distributors (Field Team)
- **Log Meetings**: Quickly report One-on-One or Group meetings with GPS location and photo proof.
- **Sales Tracker**: Monitor B2C and B2B sales progress with auto-calculated totals.
- **Sample Management**: Log product trials and distributions to potential customers.
- **Performance Dashboard**: Personalized charts showing weekly sales and meeting trends.

### For Administrators (Head Office)
- **Central Intelligence**: Unified dashboard showing total revenue, meetings, and activity logs.
- **Geographical Distribution**: View team presence across different states and districts.
- **Rankings**: Monthly leaderboards for top-performing distributors.
- **User Management**: Manage the entire team hierarchy from a single secure interface.

---

## 🛠️ Tech Stack

| Frontend | Backend | Cloud & Database |
| :--- | :--- | :--- |
| **Next.js 14** (App Router) | **Node.js & Express** | **PostgreSQL** (Supabase) |
| **Tailwind CSS** | **JWT Authentication** | **Cloudinary** (Photo Storage) |
| **Recharts** (Data Viz) | **Multer & Sharp** | **Google Maps API** |
| **Heroicons/Lucide** | **CORS & Security** | **Leaflet** (Optional Fallback) |

---

## 📦 Project Structure

```text
├── backend/
│   ├── config/          # DB & Cloudinary Configuration
│   ├── controllers/     # API Business Logic (Dashboards, Auth, Meetings)
│   ├── middleware/      # Auth Verification & Image Processing
│   ├── routes/          # API Route Definitions
│   └── server.js        # Express Entry Point
├── frontend/
│   ├── app/             # Next.js Pages (Admin/Distributor workflows)
│   ├── components/      # Reusable UI (Cards, MapPicker, PhotoUpload)
│   ├── lib/             # API Client & Auth Utilities
│   └── public/          # Static Assets
└── database-full-schema.sql  # Consolidate SQL Schema Reference
```

---

## ⚙️ Installation & Setup

### 1. Database Setup
1. Create a project on [Supabase](https://supabase.com/).
2. Run `database-full-schema.sql` in the SQL Editor to set up all tables and optimizations.
3. (Optional) Run `dummy-data.sql` to populate the dashboard for testing.

### 2. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
```
Add your credentials to `.env`:
- `DATABASE_URL`, `JWT_SECRET`, `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET`.

```bash
npm start
```

### 3. Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env
```
Ensure `NEXT_PUBLIC_API_URL` and `NEXT_PUBLIC_GOOGLE_MAPS_API_KEY` are set.

```bash
npm run dev -- -p 3001
```
*Note: Please use port 3001 as required by Google Maps API restrictions.*

---

## 🤝 Support & Contribution
This project was developed for a high-intensity hackathon. For queries or contributions, feel free to open a Pull Request.

---
**Built with Precision for Field Operations Efficiency.**
