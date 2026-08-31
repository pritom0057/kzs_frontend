# KZS 2002 Reunion Portal — Frontend

Web application for the **Kushtia Zilla School SSC 2002 Batch — 25 Year Reunion** registration portal. Built with React, Vite, and Tailwind CSS.

## Tech Stack

- **Framework** — React 19
- **Bundler** — Vite
- **Styling** — Tailwind CSS
- **Routing** — React Router v7
- **HTTP Client** — Axios

## Getting Started

```bash
# Install dependencies
npm install

# Start dev server (proxies /api to localhost:8080)
npm run dev

# Build for production
npm run build
```

App runs on `http://localhost:5173`.

> The backend must be running on port 8080 for local development.

## Environment Variables

Create a `.env.local` file for local overrides:

| Variable | Description |
|---|---|
| `VITE_API_URL` | Backend API URL (e.g. `https://your-api.railway.app/api`). Leave empty for local dev — the Vite proxy handles it automatically. |

## Features

### Alumni
- OTP-based signup (mobile number + password)
- Profile management — personal info, school details, career, family, photo upload
- Event registration with live fee calculator (self / spouse / children)
- Payment submission — bKash, Nagad, or Bank Transfer with transaction ID
- Alumni directory — grid and list view, search by name, filter by shift/section
- Public alumni profile pages

### Admin
- Dashboard with live stats — alumni, registrations, revenue
- User management — verify, activate/deactivate, edit profile, change password, create user
- Registration management — update status and payment, add notes
- CSV export for users and registrations

### Public
- Live countdown to event date (March 12, 2027)
- Event stats and details page

## Pages

| Path | Description |
|---|---|
| `/` | Landing page |
| `/login` | Login |
| `/signup` | Signup with OTP |
| `/stats` | Public event stats & countdown |
| `/dashboard` | Alumni dashboard |
| `/profile` | Edit profile |
| `/register-event` | Event registration & payment |
| `/directory` | Alumni directory |
| `/directory/:userId` | Alumni profile view |
| `/admin` | Admin dashboard |
| `/admin/users` | Manage users |
| `/admin/users/:id` | User detail & edit |
| `/admin/registrations` | Manage registrations |

## Project Structure

```
frontend/
├── public/
├── src/
│   ├── api/
│   │   └── axiosInstance.js    # Axios with baseURL & credentials
│   ├── components/
│   │   ├── directory/          # AlumniCard, DirectoryFilters
│   │   ├── layout/             # Navbar, Footer, AdminLayout
│   │   ├── registration/       # RegistrationSummary
│   │   └── ui/                 # Button, Alert, Pagination, StatusBadge, etc.
│   ├── contexts/
│   │   └── AuthContext.jsx     # Global auth state
│   ├── pages/
│   │   ├── admin/              # Admin panel pages
│   │   └── *.jsx               # All user-facing pages
│   └── App.jsx                 # Routes
├── vercel.json                 # SPA routing for Vercel
└── vite.config.js
```

## Deployment

Deployed on **Vercel**. The `vercel.json` rewrites all routes to `index.html` so React Router works correctly.
