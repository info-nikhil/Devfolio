# Portfolio Builder SaaS (MERN + Vite)

This project is a full-stack MERN SaaS app to build, preview, edit, deploy, and manage developer portfolios.

## Stack

- Frontend: React + Vite
- Backend: Node.js + Express
- Database: MongoDB + Mongoose
- Auth: JWT + Google OAuth + OTP verification
- Payments: Razorpay (order creation + webhook verification)
- Security: Helmet, rate limiting, XSS clean, mongo sanitize
- Charts: Chart.js (admin analytics)
- Deployment: Vercel (frontend static + backend serverless function support)

## Features Implemented

- Landing page, auth page, dashboard, portfolio builder, plans, contact, admin dashboard.
- Signup/login with:
  - Email OTP verification via Gmail SMTP
  - Password hashing with `bcryptjs`
  - Forgot/reset password via OTP
  - Google login using ID token verification
  - Role-based protected routes (`user` / `admin`)
- Portfolio builder:
  - Split layout form editor + right pane
  - Right pane toggle: live preview and Monaco code editor
  - 4 predefined templates
  - Dynamic template switching
  - Project fields include title, description, demo link, repo link
  - Deploy button (Vercel API)
  - Download PDF button
- Backend modules:
  - Auth + OTP flows
  - Portfolio CRUD
  - Subscription/order APIs
  - Razorpay webhook verification
  - Admin analytics API
  - Contact API
  - Deploy API

## Folder Structure

```txt
PortfolioBuilder/
  client/
    src/
      api/
      components/
      context/
      pages/
      styles/
      templates/
  server/
    api/
    src/
      config/
      controllers/
      middleware/
      models/
      routes/
      services/
      utils/
```

## Local Setup

1. Install dependencies:

```bash
npm install
npm run install:all
```

2. Configure env files:

```bash
copy server\\.env.example server\\.env
copy client\\.env.example client\\.env
```

3. Add real credentials to `server/.env`:
- MongoDB URI
- JWT secret
- Gmail SMTP credentials
- Google client ID
- Razorpay keys + webhook secret
- Vercel token + project id

4. Start both apps:

```bash
npm run dev
```

5. URLs:
- Frontend: `http://localhost:5173`
- Backend: `http://localhost:5000`

## API Groups

- `GET /api/health`
- `POST /api/auth/*`
- `GET|POST|PUT|DELETE /api/portfolios/*`
- `GET|POST /api/subscriptions/*`
- `POST /api/payments/webhook`
- `GET /api/payments/my`
- `GET /api/admin/analytics`
- `POST /api/contact`
- `POST /api/deploy`

## Vercel Deployment

### Frontend
- Deploy the `client` folder as a Vercel project.
- `client/vercel.json` handles SPA rewrites.

### Backend
- Deploy the `server` folder as a separate Vercel project.
- `server/api/index.js` exposes Express app for serverless.
- `server/vercel.json` routes all backend traffic to the function.

Set production environment variables in Vercel for both projects.
