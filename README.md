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

### Recommended: deploy the repo root as one Vercel project

This repository is now configured for a single Vercel deployment:

- Static frontend is built from `client/`
- API traffic is handled by a single catch-all Node function at `api/[...path].js`
- SPA routes are rewritten to `client/dist/index.html`

This avoids the Hobby-plan serverless function limit and keeps auth on the same origin, which removes most CORS headaches.

### Required Vercel settings

- Root Directory: repository root
- Build Command: `npm run build`
- Output Directory: `client/dist`

### Required environment variables

Frontend:
- `VITE_GOOGLE_CLIENT_ID` for the Google button
- `VITE_API_URL` only if the API is hosted on a different domain. Leave it unset for same-origin Vercel deployment.

Backend:
- `MONGODB_URI`
- `JWT_SECRET`
- `CLIENT_URL`
- `SMTP_EMAIL`
- `SMTP_PASSWORD`
- `GOOGLE_CLIENT_ID` and/or `GOOGLE_CLIENT_IDS`
- Razorpay and Vercel deployment variables if you use those features

### If you still deploy frontend and backend separately

- Keep `VITE_API_URL` pointed at the backend origin, for example `https://your-api.vercel.app/api`
- Set `CLIENT_URL` on the backend to the frontend origin
- Add every frontend origin you use to Google Cloud Authorized JavaScript origins
