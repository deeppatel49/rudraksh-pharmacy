# 🚀 Quick Start - Email OTP Setup

## ⚡ 3-Minute Setup

### Step 1: Get Gmail App Password (1 minute)
```
1. Go to https://myaccount.google.com/apppasswords
2. Select: Mail + Windows Computer
3. Copy the 16-char password
```

### Step 2: Update .env.local (1 minute)
Edit `.env.local` and replace:
```env
SMTP_USER=your_actual_email@gmail.com
SMTP_PASS=your_16_char_app_password_here
MAIL_FROM=Rudraksh Pharmacy <your_actual_email@gmail.com>
```

**Example:**
```env
SMTP_USER=myshop@gmail.com
SMTP_PASS=abcd efgh ijkl mnop
MAIL_FROM=Rudraksh Pharmacy <myshop@gmail.com>
```

### Step 3: Restart Server (1 minute)
```bash
npm run dev
```

---

## ✅ Test It

1. Go to http://localhost:3000/login
2. Create account with your email
3. Go to http://localhost:3000/forgot-password
4. Enter your email
5. Click "Send OTP"
6. **Check email for OTP** ✓

---

## 🆘 Troubleshooting

**"SMTP config missing" error**
→ Fill in all SMTP variables in `.env.local` correctly

**Email not received**
→ Check spam folder (Gmail might filter first email)
→ Wait 5-10 seconds (email takes time)
→ Verify SMTP credentials are correct

**"Authentication failed"**
→ Use the 16-char **app password**, NOT your regular Gmail password
→ Copy carefully without extra spaces

---

## 📧 Easiest Alternative: Mailtrap

If Gmail is complicated, use **Mailtrap** (no real email needed):

1. Sign up: https://mailtrap.io (free)
2. Create inbox
3. Copy SMTP settings from Mailtrap
4. Update `.env.local`:
```env
SMTP_HOST=smtp.mailtrap.io
SMTP_PORT=587
SMTP_USER=your_mailtrap_id
SMTP_PASS=your_mailtrap_password
SMTP_SECURE=false
MAIL_FROM=Rudraksh Pharmacy <test@rudraksh.com>
```
5. Restart server
6. All test emails go to Mailtrap inbox!

---

## 🎯 Complete Checklist

- [ ] Enable 2FA on Gmail
- [ ] Get app password from myaccount.google.com/apppasswords
- [ ] Update SMTP_USER in .env.local
- [ ] Update SMTP_PASS in .env.local  
- [ ] Update MAIL_FROM in .env.local
- [ ] Save .env.local
- [ ] Restart dev server (npm run dev)
- [ ] Create test account
- [ ] Test forgot password flow
- [ ] Receive OTP in email ✓

---

**Status:** Ready to send emails! 📧
