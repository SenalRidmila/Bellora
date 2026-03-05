# Google OAuth Setup Guide

මේ ගයිඩ් එක පාවිච්චි කරලා Google login button එක වැඩ කරවන්න පුළුවන්.

## 1. Google OAuth Setup

### Step 1: Google Cloud Console එකට යන්න
1. [https://console.cloud.google.com](https://console.cloud.google.com) එකට යන්න
2. New Project create කරන්න (හෝ existing project එකක් select කරන්න)

### Step 2: OAuth Credentials Create කරන්න
1. **APIs & Services** > **Credentials** එකට යන්න
2. **+ CREATE CREDENTIALS** > **OAuth client ID** click කරන්න
3. Application type එක **Web application** select කරන්න
4. Name එකක් දෙන්න (උදා: "Bellora Login")

### Step 3: Authorized Redirect URIs Add කරන්න
මේ URLs දාන්න:
```
http://localhost:3000/api/auth/callback/google
https://yourdomain.com/api/auth/callback/google
```

### Step 4: Credentials Copy කරන්න
- **Client ID** එක copy කරන්න
- **Client Secret** එක copy කරන්න
- මේවා `.env` file එකේ දාන්න:
```env
GOOGLE_CLIENT_ID="your-client-id-here"
GOOGLE_CLIENT_SECRET="your-client-secret-here"
```

---

## 2. Environment Variables Setup

### Step 1: `.env` File එකක් Create කරන්න
Project root එකේ `.env` file එකක් create කරලා මේවා add කරන්න:

```env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/bellora_db"

# NextAuth
NEXTAUTH_SECRET="random-secret-string-here"
NEXTAUTH_URL="http://localhost:3000"

# Google OAuth
GOOGLE_CLIENT_ID="your-google-client-id"
GOOGLE_CLIENT_SECRET="your-google-client-secret"

# Facebook OAuth
FACEBOOK_CLIENT_ID="your-facebook-app-id"
FACEBOOK_CLIENT_SECRET="your-facebook-app-secret"
```

### Step 2: NEXTAUTH_SECRET Generate කරන්න
Terminal එකේ මේ command එක run කරන්න:
```bash
openssl rand -base64 32
```
ඒ output එක `NEXTAUTH_SECRET` variable එකේ දාන්න.

---

## 3. Test කරන්න

1. Development server එක restart කරන්න:
```bash
npm run dev
```

2. [http://localhost:3000/login](http://localhost:3000/login) එකට යන්න

3. **Continue with Google** button එක click කරන්න

4. Google account එකෙන් login වෙන්න

---

## Common Issues & Fixes

### Issue 1: "Redirect URI mismatch"
**Fix:** Google/Facebook console එකේ redirect URIs හරියට add කරලා තියෙනවද check කරන්න.

### Issue 2: "Missing environment variables"
**Fix:** `.env` file එක root folder එකේ තියෙනවද, values හරියටද check කරන්න.

### Issue 3: "Google login not working"
**Fix:** `.env` file එකේ `GOOGLE_CLIENT_ID` සහ `GOOGLE_CLIENT_SECRET` හරියටද check කරන්න

Production යවන වෙලාවේ:
1. `.env.production` file එකක් හදන්න
2. `NEXTAUTH_URL` එක production domain එකට වෙනස් කරන්න
3. Google console එකේ production URLs add කරන්න
4. Environment variables hosting platform එකේ add කරන්න (Vercel/Netlify/etc)

---

## Security Notes

⚠️ **Important:**
- `.env` file එක NEVER commit කරන්න එපා Git එකට
- `.gitignore` file එකේ `.env` add කරලා තියෙනවද check කරන්න
- Production key වලට development key use කරන්න එපා
- Regular යි keys rotate කරන්න

---

## Need Help?

වැඩේ කරන්න බැරි නම්:
1. Browser console එකේ errors check කරන්න
2. Terminal එකේ server logs check කරන්න
3. Google console එකේ settings හරියටද verify කරන්න
