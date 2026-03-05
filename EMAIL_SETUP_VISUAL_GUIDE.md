# 📧 Email OTP - Visual Setup Guide

## The Problem
Your `.env.local` still has placeholder values:
```env
SMTP_USER=your_email@gmail.com        ❌ Not real
SMTP_PASS=your_app_password_16_char   ❌ Not real
```

**No real email = No OTP sent!**

---

## The Solution - 3 Easy Steps

### 📍 Step 1: Generate Gmail App Password

**Action Flow:**
```
1️⃣  Go to: https://myaccount.google.com/apppasswords
    ↓
2️⃣  Make sure 2FA is ON
    (Setup at: https://myaccount.google.com/security)
    ↓
3️⃣  Select dropdowns:
    - First: "Mail"
    - Second: "Windows Computer"
    ↓
4️⃣  Click "Generate"
    ↓
5️⃣  Google shows 16-character password
    ↓
6️⃣  Copy it: "abcd efgh ijkl mnop"
```

**What You Get:**
- A 16-character password with spaces
- Example: `jkqw pqvm wxyz abcd`
- Valid only for use in apps

---

### ✏️ Step 2: Update `.env.local`

**File:** `C:\Users\ADMIN\Downloads\rudraksh\.env.local`

**Current (Not Working):**
```env
SMTP_USER=your_email@gmail.com
SMTP_PASS=your_app_password_16_char
MAIL_FROM=Rudraksh Pharmacy <your_email@gmail.com>
```

**Change To (Working Example):**
```env
SMTP_USER=myshop@gmail.com
SMTP_PASS=jkqw pqvm wxyz abcd
MAIL_FROM=Rudraksh Pharmacy <myshop@gmail.com>
```

**Rules:**
- SMTP_USER = Your actual Gmail email
- SMTP_PASS = The 16-char password from Step 1 (with spaces!)
- MAIL_FROM = Same email in a formatted way

---

### 🔄 Step 3: Restart Server

**In Terminal:**
```bash
npm run dev
```

Or if it's running:
1. Press `Ctrl + C` to stop
2. Run `npm run dev` again

**You'll see:**
```
✓ Compiled successfully
- Local:   http://localhost:3000
- Network: http://192.168...
```

---

## 🧪 Test Email Sending

### Flow:
```
Step 1: Create Account
─────────────────────
URL: http://localhost:3000/login
- Click "Sign up"
- Email: your_actual_email@gmail.com
- Password: test123
- Click "Sign up"
        ↓
Step 2: Test Forgot Password
─────────────────────
URL: http://localhost:3000/forgot-password
- Email: your_actual_email@gmail.com
- Click "Send OTP"
- Wait 3-5 seconds...
        ↓
Step 3: Check Email
─────────────────────
- Go to your Gmail inbox
- Look for "Rudraksh Pharmacy" email ✓
- If not there, check "Promotions" tab
- Copy the OTP code
        ↓
Step 4: Verify OTP
─────────────────────
- Paste OTP into forgot password page
- Click "Verify OTP"
- Enter new password
- Click "Reset Password" ✓
```

---

## ❌ Common Issues & Fixes

### Issue 1: "SMTP config missing" Error

**Why it happens:**
- `.env.local` values are still placeholders
- Dev server wasn't restarted

**Fix:**
1. Open `.env.local`
2. Replace ALL placeholder values with real ones
3. Save file
4. Restart server: `npm run dev`

---

### Issue 2: Email Not Received

**Checklist:**
- [ ] Check Gmail **Promotions** tab (first emails go there)
- [ ] Wait 5-10 seconds (email takes time)
- [ ] Verify SMTP_USER is your actual Gmail
- [ ] Verify SMTP_PASS is the 16-char app password
- [ ] Verify you enabled 2FA first

**If Still Not Working:**
1. Check Gmail less secure apps: https://myaccount.google.com/lesssecureapps
2. Verify email address in browser console errors
3. Try a different Gmail account

---

### Issue 3: "Authentication Failed"

**Why it happens:**
- Using regular Gmail password instead of app password
- Extra spaces in password field
- Wrong email address

**Fix:**
1. Go back to: https://myaccount.google.com/apppasswords
2. Re-generate app password (select Mail + Windows Computer)
3. Copy ENTIRE password exactly (including spaces)
4. Paste into SMTP_PASS
5. Restart server

---

### Issue 4: "Sender missing" Error

**Why it happens:**
- MAIL_FROM is empty in .env.local

**Fix:**
```env
# Add this (required):
MAIL_FROM=Rudraksh Pharmacy <your_email@gmail.com>
```

---

## 🔑 Complete .env.local Template

```env
# Google OAuth
NEXT_PUBLIC_GOOGLE_CLIENT_ID=347516602520-0145rnuktqniakc2cko90aflursflqj4.apps.googleusercontent.com

# Gmail SMTP (Update with YOUR credentials!)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your_actual_email@gmail.com
SMTP_PASS=your_16_char_app_password
SMTP_SECURE=false
MAIL_FROM=Rudraksh Pharmacy <your_actual_email@gmail.com>
```

---

## 📱 Alternative: Mailtrap (Easiest for Testing)

**Why Mailtrap?**
- Free, no credit card
- Emails don't go to real people (sandbox)
- Inbox shows all test emails
- Perfect for development

**Setup:**

1. Go to: https://mailtrap.io
2. Sign up (free)
3. Create new inbox
4. Click "Integrations"
5. Select "Nodemailer"
6. Copy the 4 lines
7. Update `.env.local`:

```env
SMTP_HOST=smtp.mailtrap.io
SMTP_PORT=587
SMTP_USER=xxxxx (from Mailtrap)
SMTP_PASS=xxxxx (from Mailtrap)
SMTP_SECURE=false
MAIL_FROM=Rudraksh Pharmacy <test@rudraksh.com>
```

8. Restart server
9. All test emails go to Mailtrap inbox!

---

## ✅ Success Indicators

When email is working correctly, you'll see:

```
✓ "OTP sent successfully to email." (On screen)
✓ Email arrives in inbox within 5 seconds
✓ Email has professional Rudraksh Pharmacy design
✓ OTP code is clearly visible
✓ You can copy-paste OTP to verify
```

---

## 🎯 Summary

| Step | Action | File |
|------|--------|------|
| 1 | Get Gmail app password | Browser → myaccount.google.com |
| 2 | Update `.env.local` | `.env.local` |
| 3 | Restart server | Terminal → `npm run dev` |
| 4 | Test flow | Browser → /forgot-password |
| 5 | Check email | Gmail inbox |

---

**Status:** All configuration in `.env.local` ready for real credentials! 📧
