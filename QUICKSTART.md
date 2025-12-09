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

---

# 🎬 NEW: Project-Based Collaboration System

## Quick Setup for Projects Feature

### Step 1: Run Database Schema
```bash
# In Supabase Dashboard:
1. Go to SQL Editor → New Query
2. Copy entire content of: schema_projects.sql
3. Paste into query editor
4. Click Run (Ctrl+Enter)
5. Wait for success ✅
```

**Tables created:**
- `projects` - Project metadata
- `project_roles` - Roles/positions needed
- `project_applications` - Applications from filmmakers

### Step 2: Start Dev Server
```bash
npm run dev
```

### Step 3: Test the Workflow

#### **Test 1: Create Project (Producer)**
1. Navigate to: `http://localhost:3000/projects/new`
2. Login (or signup)
3. Fill form:
   - Title: "The Last Signal"
   - Description: "Sci-fi thriller"
   - Location: "Los Angeles"
   - Dates: Any dates 30+ days out
   - Budget: $50k - $150k
   - Click Next
4. Add 2 roles:
   - "Lead Actress" (Expert, Actor)
   - "Cinematographer" (Expert, Crew)
5. Publish
6. ✅ Should redirect to project detail with unique code (PRJ-XXXX)

#### **Test 2: Browse Projects**
1. Go to: `http://localhost:3000/projects`
2. ✅ Your project should appear in grid
3. Click to view details

#### **Test 3: Apply (Different User)**
1. Open incognito window (simulates different user)
2. Login as different user
3. Go to: `http://localhost:3000/projects`
4. Click your project
5. Click "Apply" on a role
6. Submit portfolio URL + cover letter
7. ✅ Application submitted successfully

#### **Test 4: Producer Reviews Apps**
1. Switch back to original browser
2. Click "Manage Applications" button
3. ✅ See applicant's CineGrok profile
4. ✅ See portfolio link and cover letter
5. Click "Accept"
6. ✅ Application marked as accepted

---

## 📖 Full Documentation

- **TESTING_GUIDE.md** - Complete step-by-step testing
- **PROJECTS_SCHEMA.md** - Database design
- **API_REFERENCE.md** - API endpoints

---

## Files Added

**Backend API:**
- `/api/v1/projects/route.ts` - Create & list
- `/api/v1/projects/[id]/route.ts` - Get & update
- `/api/v1/projects/[id]/roles/route.ts` - Manage roles
- `/api/v1/projects/[id]/applications/route.ts` - Apply & view
- `/api/v1/projects/[id]/applications/[appId]/route.ts` - Accept/reject

**Frontend:**
- `/projects/page.tsx` - Browse projects
- `/projects/new/page.tsx` - Create project
- `/projects/[id]/page.tsx` - Project detail & apply
- `/projects/[id]/manage/page.tsx` - Producer dashboard
- `components/CreateProjectForm.tsx` - Project form
- `components/ProjectCard.tsx` - Project card

**Schema:**
- `schema_projects.sql` - Database tables & RLS

---

## Key Differentiators

✅ **Privacy-First** - Email only shared after acceptance
✅ **Fair Matching** - Full filmmaker profile shown, no typecast bias
✅ **Project Codes** - Share via PRJ-XXXX code
✅ **Simple MVP** - No payment, no contracts, just core features
✅ **RLS Security** - Producers only see their own applications
✅ **Role Tracking** - Know when position is filled

---

## Troubleshooting

| Issue | Solution |
|-------|----------|
| API 401 Unauthorized | Make sure you're logged in |
| API 403 Forbidden | Only project creator can manage apps |
| API 500 / Code Gen Error | Re-run schema_projects.sql |
| Roles not showing | Check browser console for errors |
| Can't apply twice | This is intentional (UNIQUE constraint) |

---

## Next Steps

1. ✅ Run schema_projects.sql
2. ✅ Test locally following steps above
3. ✅ Find bugs, refine workflow
4. ✅ Push to GitHub
5. ✅ Deploy to production
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
