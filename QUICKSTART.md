# Quick Start - CineGrok

## 🚀 Fast Track Setup (5 Minutes)

### 1. Install Dependencies
```bash
npm install
```

### 2. Create Environment File
```bash
# Copy template
cp env.template.txt .env.local

# Edit .env.local and add:
# - NEXT_PUBLIC_SUPABASE_URL (from Supabase Dashboard)
# - NEXT_PUBLIC_SUPABASE_ANON_KEY (from Supabase Dashboard)
```

### 3. Run Database Migration
1. Go to https://app.supabase.com
2. Open SQL Editor
3. Copy contents of `schema_v2.sql`
4. Paste and Run

### 4. Create Storage Bucket
1. Supabase Dashboard → Storage
2. Create bucket: `filmmaker-assets`
3. Make it **Public**
4. Add policies (see SETUP_AND_TESTING.md)

### 5. Start Server
```bash
npm run dev
```

### 6. Test
1. Visit: http://localhost:3000/auth/signup
2. Create account
3. Go to: http://localhost:3000/profile-builder
4. Fill profile!

---

## ✅ What to Test

- [ ] Signup/Login
- [ ] Dashboard
- [ ] Profile Builder (all 6 steps)
- [ ] Image upload
- [ ] Auto-save (wait 30 seconds)
- [ ] Preview
- [ ] Pricing page

---

## 📚 Full Documentation

See `SETUP_AND_TESTING.md` for complete instructions.

---

## 🆘 Quick Troubleshooting

**Can't login?**
- Check Supabase Auth is enabled
- Check `.env.local` has correct keys

**Image upload fails?**
- Check storage bucket exists
- Check bucket is public

**Auto-save not working?**
- Check `profile_drafts` table exists
- Wait full 30 seconds

---

## 🎯 Next Steps

1. Test everything
2. Get API keys (Razorpay, Resend, OpenAI)
3. I'll integrate payments & emails
4. Launch! 🚀
