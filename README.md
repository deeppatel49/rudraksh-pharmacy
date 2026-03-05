# Rudraksh Pharmacy (Next.js)

## Setup

1. Install dependencies:

```bash
npm install
```

2. Copy `.env.example` to `.env.local` and fill values.

3. Run development server:

```bash
npm run dev
```

Open http://localhost:3000

## Environment Variables

### OTP Email (Nodemailer)

- `SMTP_HOST`
- `SMTP_PORT`
- `SMTP_USER`
- `SMTP_PASS`
- `SMTP_SECURE`
- `MAIL_FROM`

### Prescription Seller Redirect (Secure Share)

- `SELLER_WEBSITE_URL`
- `PRESCRIPTION_SHARE_SECRET`

After upload from Quick Order, users are redirected to `SELLER_WEBSITE_URL` with a signed short-lived `shareToken` in query params.

## Seller-side Integration

When seller website receives `shareToken`, resolve it by calling:

```http
GET /api/prescriptions/share/resolve?token=<shareToken>
```

Response includes:

- `files` (uploaded prescription references and URLs)
- `expiresAt`
- `source`

Use `files` to display/verify prescription before processing order.

## Quality Check

```bash
npm run lint
```
