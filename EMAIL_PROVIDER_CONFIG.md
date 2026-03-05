# Email Provider Configuration Examples

## Quick Copy-Paste SMTP Configurations

### Gmail (Recommended - Easiest)
```dotenv
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password_16_char
SMTP_SECURE=false
MAIL_FROM=Rudraksh Pharmacy <your_email@gmail.com>
```

**Setup Steps:**
1. Enable 2FA: https://myaccount.google.com/security
2. Generate App Password: https://myaccount.google.com/apppasswords
3. Select "Mail" and "Windows Computer"
4. Copy the 16-character password
5. Paste into SMTP_PASS

---

### Outlook / Hotmail
```dotenv
SMTP_HOST=smtp-mail.outlook.com
SMTP_PORT=587
SMTP_USER=your_email@outlook.com
SMTP_PASS=your_password
SMTP_SECURE=false
MAIL_FROM=Rudraksh Pharmacy <your_email@outlook.com>
```

---

### SendGrid
```dotenv
SMTP_HOST=smtp.sendgrid.net
SMTP_PORT=587
SMTP_USER=apikey
SMTP_PASS=SG.xxxxx_your_sendgrid_api_key
SMTP_SECURE=false
MAIL_FROM=Rudraksh Pharmacy <noreply@yourdomain.com>
```

**Setup Steps:**
1. Create SendGrid account: https://sendgrid.com/
2. Get API key from Settings > API Keys
3. Use "apikey" as SMTP_USER
4. Use API key as SMTP_PASS

---

### Mailgun
```dotenv
SMTP_HOST=smtp.mailgun.org
SMTP_PORT=587
SMTP_USER=postmaster@yourdomain.mailgun.org
SMTP_PASS=your_mailgun_password
SMTP_SECURE=false
MAIL_FROM=Rudraksh Pharmacy <noreply@yourdomain.mailgun.org>
```

---

### AWS SES (Amazon Simple Email Service)
```dotenv
SMTP_HOST=email-smtp.region.amazonaws.com
SMTP_PORT=587
SMTP_USER=your_ses_smtp_username
SMTP_PASS=your_ses_smtp_password
SMTP_SECURE=false
MAIL_FROM=Rudraksh Pharmacy <verified-email@yourdomain.com>
```

**Get credentials:**
1. Go to SES Console
2. Create SMTP credentials
3. Download credentials file

---

### ImprovMX (Free Email Forwarding + SMTP)
```dotenv
SMTP_HOST=smtp.improvmx.com
SMTP_PORT=587
SMTP_USER=your_email@yourdomain.com
SMTP_PASS=your_improvmx_password
SMTP_SECURE=false
MAIL_FROM=Rudraksh Pharmacy <your_email@yourdomain.com>
```

---

### Resend (Modern Email Service)
```dotenv
SMTP_HOST=smtp.resend.com
SMTP_PORT=587
SMTP_USER=resend
SMTP_PASS=re_xxxxx_your_resend_api_key
SMTP_SECURE=false
MAIL_FROM=Rudraksh Pharmacy <onboarding@resend.dev>
```

---

### Postmark
```dotenv
SMTP_HOST=smtp.postmarkapp.com
SMTP_PORT=587
SMTP_USER=your_postmark_api_token
SMTP_PASS=your_postmark_api_token
SMTP_SECURE=false
MAIL_FROM=Rudraksh Pharmacy <noreply@yourdomain.com>
```

---

### Brevo (Sendinblue)
```dotenv
SMTP_HOST=smtp-relay.brevo.com
SMTP_PORT=587
SMTP_USER=your_brevo_email@example.com
SMTP_PASS=your_brevo_smtp_key
SMTP_SECURE=false
MAIL_FROM=Rudraksh Pharmacy <your_email@yourdomain.com>
```

---

## Recommended Providers by Use Case

### For Development/Testing
- **Gmail** (easiest, free tier)
- **Mailgun** (generous free tier: 5000/month)
- **Brevo** (free tier: 300/day)

### For Production (Small Business)
- **SendGrid** (pay-as-you-go)
- **Brevo** (affordable, European)
- **Postmark** (reliable, transactional focus)

### For Production (Enterprise)
- **AWS SES** (scalable, cost-effective)
- **Resend** (modern, developer-friendly)
- **Mailgun** (powerful API)

---

## Testing Email Delivery

### Test Send OTP API
```bash
curl -X POST http://localhost:3000/api/auth/otp/send \
  -H 'Content-Type: application/json' \
  -d '{
    "identifier": "test_user@example.com",
    "email": "test_user@example.com",
    "mobileNumber": "9876543210",
    "whatsappNumber": "9876543210"
  }'
```

### Expected Response (Success)
```json
{
  "success": true,
  "message": "OTP sent successfully to email."
}
```

### Expected Response (Error)
```json
{
  "error": "SMTP config missing: SMTP_HOST, SMTP_PORT, ..."
}
```

---

## Troubleshooting

### Error: "SMTP config missing"
- Ensure all required variables are in `.env.local`
- Restart dev server after updating `.env.local`
- Check for typos in variable names

### Error: "Failed to send Twilio message" (but email should work)
- This is normal if SMS/WhatsApp not configured
- Email OTP should still be sent
- Check browser console for specific error

### Email never arrives
1. Check spam/promotions folder
2. Verify sender email address is correct
3. Test with different recipient email
4. Check email provider dashboard/logs
5. Verify SMTP credentials are correct

### "Authentication failed"
- Double-check SMTP_USER and SMTP_PASS
- For Gmail: Use app password, not regular password
- For others: Verify password hasn't changed

---

## .env.local Template

Save this as `.env.local` and fill in your values:

```dotenv
# Google OAuth
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id

# Email Configuration - Choose one provider below
# =============================================

# GMAIL (Recommended for Development)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password_16_char
SMTP_SECURE=false
MAIL_FROM=Rudraksh Pharmacy <your_email@gmail.com>

# Uncomment and configure for other providers
# SendGrid
# SMTP_HOST=smtp.sendgrid.net
# SMTP_PORT=587
# SMTP_USER=apikey
# SMTP_PASS=SG.xxxxx_your_api_key
# SOAP_SECURE=false
# MAIL_FROM=Rudraksh Pharmacy <noreply@yourdomain.com>

# Optional: Twilio SMS/WhatsApp
# TWILIO_ACCOUNT_SID=your_account_sid
# TWILIO_AUTH_TOKEN=your_auth_token
# TWILIO_SMS_FROM=+1234567890
# TWILIO_WHATSAPP_FROM=+1234567890
```

---

## Best Practices

✅ **Do:**
- Use app passwords for Gmail (not regular password)
- Store credentials in `.env.local` (not in git)
- Use TLS/SSL encryption (SMTP_SECURE appropriate)
- Test email delivery before going live
- Monitor email sending logs

❌ **Don't:**
- Commit `.env.local` to git
- Use regular Gmail password with app password setting
- Hardcode credentials in code
- Use shared/generic email addresses if possible
- Mix different provider configurations

---

Last Updated: March 3, 2026
