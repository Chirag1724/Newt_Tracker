# 🦎 Newt Tracker (v2.0)

**Newt Tracker** is a premium, modern field operations tracking system built for speed, transparency, and ease of use. It empowers field teams with real-time tracking, intelligent team management, and actionable analytics.

[![Tech Stack](https://img.shields.io/badge/Stack-Next.js%20%7C%20Node.js%20%7C%20PostgreSQL-green)](https://github.com/Chirag1724/Newt_Tracker_demo)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

---

## ✨ Features

- **🎯 Real-time Analytics**: High-impact dashboards showing live performance metrics and team health. 
- **👥 Team Management**: Unified hub for managing distributors, field officers, and team hierarchies.
- **📍 GPS Tracking**: Precision monitoring of field visits and meetings with location-based verification.
- **💎 Premium UX/UI**: Modern glassmorphic design system using Tailwind CSS for a professional feel.
- **🛡️ Secure Auth**: Robust JWT-based authentication with role-based access control (Admin/Distributor).
- **📱 Ultra Responsive**: Fully optimized for mobile, tablet, and desktop viewing.

---

## 🛠️ Tech Stack

| Frontend | Backend | Database |
| :--- | :--- | :--- |
| **Next.js 14** (App Router) | **Node.js** | **PostgreSQL** (Supabase) |
| **Tailwind CSS** | **Express.js** | **pg-pool** |
| **Lucide React** (Icons) | **JWT** & **bcryptjs** | **SQL** |
| **Axios** (API) | **CORS** Enabled | |

---

## 🚀 Installation & Setup

### 1. Database Setup
1. Create a project on [Supabase](https://supabase.com/).
2. Open the SQL Editor and run the script found in `database-schema.sql` to create the `users` table and indexes.

### 2. Backend Setup
```bash
cd backend
npm install
cp .env.example .env
```
*Edit `.env` and add your `DATABASE_URL` (Supabase URI) and `JWT_SECRET`.*
```bash
npm start
```

### 3. Frontend Setup
```bash
cd frontend
npm install
cp .env.example .env
```
*The default `NEXT_PUBLIC_API_URL` is set to `http://localhost:5000/api`.*
```bash
npm run dev
```

---

## 🗂️ Project Structure

```text
├── backend/
│   ├── config/          # DB Connection
│   ├── controllers/     # Business Logic
│   ├── middleware/      # Auth & Verification
│   ├── routes/          # API Endpoints
│   └── server.js        # Express Entry Point
├── frontend/
│   ├── app/             # Next.js Pages (App Router)
│   ├── components/      # Reusable UI Components
│   ├── lib/             # API & Auth Helpers
│   └── middleware.js    # Route Protection
└── database-schema.sql  # SQL Schema Reference
```

---

## 📅 Roadmap (Phase 2)
- [ ] **Meeting Logging**: Daily visit reports and logs.
- [ ] **Sales Tracking**: Direct sales entry and target monitoring.
- [ ] **Live Maps**: Integration with Google Maps for real-time team location.
- [ ] **Export Reports**: Generate PDF/Excel reports in one click.
- [ ] **PWA Support**: Install Newt Tracker as a mobile app.

---

## 🤝 Support
For support, create an issue in the [Newt_Tracker_demo](https://github.com/Chirag1724/Newt_Tracker_demo) repository.

---
**Built with ❤️ for field operations efficiency.**
