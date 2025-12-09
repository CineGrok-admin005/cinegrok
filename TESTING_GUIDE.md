# CineGrok Projects Feature - Setup & Testing Guide

## 📋 SETUP INSTRUCTIONS

### **STEP 1: Run Database Schema** (5 minutes)

1. Go to [Supabase Dashboard](https://supabase.com) → Your Project
2. Click **SQL Editor** → **New Query**
3. Copy the entire content from `/schema_projects.sql`
4. Paste into the query editor
5. Click **Run** or press `Ctrl+Enter`
6. Wait for success message

**What gets created:**
- ✅ `projects` table (project metadata)
- ✅ `project_roles` table (roles needed)
- ✅ `project_applications` table (applications)
- ✅ Indexes for performance
- ✅ RLS (Row Level Security) policies
- ✅ Helper function: `generate_project_code()`

**Verify:** In Supabase Dashboard → Tables, you should see:
- `projects`
- `project_roles`
- `project_applications`

---

### **STEP 2: Files Generated**

All files have been created. Here's what was added:

**Backend API Routes:**
- `/src/app/api/v1/projects/route.ts` - Create & list projects
- `/src/app/api/v1/projects/[id]/route.ts` - Get & update single project
- `/src/app/api/v1/projects/[id]/roles/route.ts` - Add roles to project
- `/src/app/api/v1/projects/[id]/applications/route.ts` - Apply & view applications
- `/src/app/api/v1/projects/[id]/applications/[appId]/route.ts` - Accept/reject applications

**Frontend Components:**
- `/src/components/CreateProjectForm.tsx` - Multi-step project creation form
- `/src/components/ProjectCard.tsx` - Project card for browsing

**Frontend Pages:**
- `/src/app/projects/page.tsx` - Browse all projects
- `/src/app/projects/new/page.tsx` - Create new project
- `/src/app/projects/[id]/page.tsx` - Project detail & apply
- `/src/app/projects/[id]/manage/page.tsx` - Producer dashboard

---

### **STEP 3: Run Local Dev Server** (2 minutes)

```powershell
# In terminal at root of project
npm run dev
```

Visit: `http://localhost:3000`

---

## 🧪 TESTING WORKFLOW

### **Test Scenario: Producer Creates Project + Filmmaker Applies**

---

#### **TEST 1: Producer Creates Project**

1. **Navigate to:** `http://localhost:3000/projects/new`
2. **Login** (if not already logged in)
3. **Fill Form - Step 1:**
   - Title: `"The Last Signal"`
   - Description: `"Sci-fi thriller about an astronaut in space"`
   - Location: `"Los Angeles, CA"`
   - Start Date: Pick a date 30 days from now
   - End Date: Pick a date 45 days from now
   - Check "Paid Positions"
   - Budget Min: `50` (means $50k)
   - Budget Max: `150` (means $150k)
   - Click **"Next: Add Roles"**

4. **Step 2: Add Roles**
   - Add Role 1:
     - Title: `"Lead Actress"`
     - Description: `"Female, 30-40, mysterious & vulnerable"`
     - Type: `Actor`
     - Experience: `Expert`
     - Quantity: `1`
     - Click **"+ Add Role"**
   
   - Add Role 2:
     - Title: `"Cinematographer"`
     - Description: `"Comfortable with space/sci-fi visuals. Low-light expertise"`
     - Type: `Crew`
     - Experience: `Expert`
     - Quantity: `1`
     - Click **"+ Add Role"**
   
   - Click **"Review & Publish"**

5. **Step 3: Review & Publish**
   - Review the information
   - Click **"Publish Project"**
   - Should redirect to project detail page

6. **Expected Result:**
   - ✅ Project created in database
   - ✅ Auto-generated code like `PRJ-K7M2` displayed
   - ✅ Two roles listed
   - ✅ "Manage Applications" button visible (producer view)

---

#### **TEST 2: Browse Projects (Public)**

1. **Navigate to:** `http://localhost:3000/projects`
2. **Expected Result:**
   - ✅ Your newly created project appears in grid
   - ✅ Project code visible on card
   - ✅ Creator name shown
   - ✅ Budget visible
   - ✅ Can click card to view details

---

#### **TEST 3: Filmmaker Views Project & Applies**

1. **In same browser OR different browser (simulating different user):**
   - **Option A:** Open incognito window (simulates different user)
   - **Option B:** Sign out and log in as different user

2. **Navigate to:** `http://localhost:3000/projects`

3. **Click on your project card**

4. **Expected Result (Filmmaker View):**
   - ✅ Project details visible
   - ✅ NO "Manage Applications" button
   - ✅ Both roles listed with "Apply" button

5. **Click "Apply" on "Lead Actress" role**

6. **Fill Application Form:**
   - Portfolio URL: `https://vimeo.com/123456789`
   - Cover Letter: `"I'm really interested in this role. I've done sci-fi before and love the script."`
   - Click **"Submit Application"**

7. **Expected Result:**
   - ✅ Success message
   - ✅ Application recorded in database
   - ✅ Can't apply twice to same role (error message)

---

#### **TEST 4: Producer Reviews Applications**

1. **Switch back to producer browser/user**

2. **Navigate to:** `http://localhost:3000/projects/[project-id]`
   - Or click your project from `/projects`

3. **Click "Manage Applications"**

4. **Expected Result:**
   - ✅ Shows "Submitted (1)" tab with 1 application
   - ✅ Filmmaker's name visible
   - ✅ Role title shown
   - ✅ Portfolio link visible
   - ✅ Cover letter visible
   - ✅ Filmmaker's CineGrok profile preview
   - ✅ Three action buttons: Accept, Reject, Review

5. **Click "Accept"**

6. **Fill Optional Notes:** `"Perfect fit for the role!"`

7. **Click "Accept" confirmation**

8. **Expected Result:**
   - ✅ Application moves to "Accepted" tab
   - ✅ Status button changes to green "✓ Accepted"
   - ✅ Producer notes saved

---

#### **TEST 5: Status Filtering**

1. **Still on manage page**

2. **Click "Under Review" tab**
   - Expected: Empty (or shows applications you marked as reviewing)

3. **Click "Accepted" tab**
   - Expected: Shows your accepted application

4. **Click "Rejected" tab**
   - Expected: Empty or shows rejected apps

---

## 🐛 TROUBLESHOOTING

### **Problem: API 401 Unauthorized**
- **Cause:** Not logged in
- **Fix:** Make sure you're logged in before creating/applying

### **Problem: API 403 Forbidden**
- **Cause:** User is not project creator trying to view applications
- **Fix:** Only project creator can see applications dashboard

### **Problem: API 500 / Project Code Generation Error**
- **Cause:** Database schema not properly created
- **Fix:** Re-run the schema_projects.sql file in Supabase

### **Problem: Roles not showing after creating project**
- **Cause:** Roles may not have inserted due to database constraint
- **Fix:** Check browser console for errors, verify RLS policies are set

### **Problem: Can't apply twice to same role**
- **Cause:** UNIQUE constraint in database (intentional)
- **Fix:** This is correct behavior. Each filmmaker can only apply once per role.

---

## 📊 DATABASE VERIFICATION

To verify everything was set up correctly:

1. Go to **Supabase Dashboard** → **Tables**

2. Check each table:

   **`projects` table:**
   - Should have 1 row (your test project)
   - `creator_id` = your user ID
   - `project_code` = something like `PRJ-K7M2`
   - `status` = `'open'`

   **`project_roles` table:**
   - Should have 2 rows (Lead Actress + Cinematographer)
   - `project_id` = the project ID from above
   - `filled_count` = 1 (for the actress role you accepted)

   **`project_applications` table:**
   - Should have 1+ rows (your test applications)
   - `status` = `'accepted'` (or `'submitted'`, `'rejected'`)
   - `filmmaker_id` = the filmmaker who applied
   - `role_id` = the role they applied for

---

## 📝 QUICK API REFERENCE

### **Create Project**
```bash
POST /api/v1/projects
{
  "title": "My Film",
  "description": "...",
  "shoot_location": "LA",
  "shoot_start_date": "2026-03-15",
  "shoot_end_date": "2026-03-30",
  "budget_min": 50,
  "budget_max": 150,
  "is_paid": true,
  "roles": [
    {
      "role_title": "Lead Actress",
      "role_description": "Female, 30-40",
      "role_category": "actor",
      "experience_level": "expert",
      "quantity_needed": 1
    }
  ]
}
```

### **Get Project**
```bash
GET /api/v1/projects/{id}
```
Returns project + all roles + application counts

### **Apply to Role**
```bash
POST /api/v1/projects/{id}/applications
{
  "role_id": "uuid",
  "portfolio_url": "https://vimeo.com/...",
  "cover_letter": "..."
}
```

### **Get Applications (Producer)**
```bash
GET /api/v1/projects/{id}/applications?status=submitted&limit=50
```

### **Update Application Status**
```bash
PUT /api/v1/projects/{id}/applications/{appId}
{
  "status": "accepted",
  "producer_notes": "Great fit!"
}
```

---

## ✅ LOCAL TESTING CHECKLIST

- [ ] Database schema created (no errors)
- [ ] Producer can create project with roles
- [ ] Project code auto-generated (PRJ-XXXX)
- [ ] Project appears in browse view
- [ ] Different user can view project
- [ ] Different user can apply to role
- [ ] Producer can view applications
- [ ] Producer can accept/reject applications
- [ ] Application status updates correctly
- [ ] Can't apply twice to same role
- [ ] Email stays hidden (only revealed after acceptance if contact happens)

---

## 🚀 NEXT: DEPLOY TO PRODUCTION

Once all local tests pass:

1. **Push code to GitHub**
   ```bash
   git add .
   git commit -m "feat: add project-based collaboration system"
   git push origin main
   ```

2. **Deploy to Vercel/production**
   - Automatic deployment (or manual trigger)

3. **Schema will sync automatically**
   - Supabase will apply RLS policies

4. **Test in production with real users**

---

Let me know once you've tested locally and if you hit any issues!
