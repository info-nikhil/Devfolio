# Backend (Express + MongoDB)

## Setup

1. Create environment file:

```bash
cp .env.example .env
```

2. Install dependencies:

```bash
npm install
```

3. Run backend:

```bash
npm run dev
```

Server runs on `http://localhost:5000`.

## Main API Groups

- `POST /api/auth/register`
- `POST /api/auth/verify-email`
- `POST /api/auth/login`
- `POST /api/auth/forgot-password`
- `POST /api/auth/reset-password`
- `POST /api/auth/google`
- `GET /api/portfolios/my`
- `POST /api/portfolios`
- `PUT /api/portfolios/:id`
- `POST /api/subscriptions/order`
- `POST /api/payments/webhook`
- `GET /api/admin/analytics`
- `POST /api/deploy`

## Vercel Deployment (Backend)

This folder includes `vercel.json` and `api/index.js` to run Express as a serverless function.
