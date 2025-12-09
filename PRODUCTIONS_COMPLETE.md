# Productions Feature - Complete Implementation

## Overview
The Projects feature has been renamed to "Productions" (more cinematic) and fully integrated into the main site. Users can now discover, create, and collaborate on productions directly from the homepage.

## Changes Made

### 1. Navigation Integration ✓
**File:** `src/components/Navigation.tsx`
- Added "Productions" link in both desktop and mobile menus
- Location: Between "Browse" and "Pricing"
- Link: `/productions`

### 2. Productions Pages Created ✓
All pages mirror the original `/projects/*` routes but at `/productions/*`:

| Page | Purpose | Route |
|------|---------|-------|
| Browse Productions | Discover open productions | `/productions` |
| Create Production | Start a new production | `/productions/new` |
| Production Detail | View production & apply | `/productions/[id]` |
| Manage Applications | Review applications (producers only) | `/productions/[id]/manage` |

### 3. Component Updates ✓
**File:** `src/components/CreateProjectForm.tsx`
- Added optional `isProduction?: boolean` prop (defaults to `true`)
- Dynamic labels: "Create Production" vs "Create Project"
- Form labels use `formLabel` variable
- Router redirects use `pageLabel` variable (`/productions/[id]` or `/projects/[id]`)

### 4. Database & API (No Changes Required)
- API endpoints remain at `/api/v1/projects/*` (table name based)
- Internal database table still named "projects"
- No migration needed - full backward compatibility

## Architecture

### User-Facing vs Internal Naming
```
User sees:      /productions/*          (cinematic branding)
             ↓
API routes:     /api/v1/projects/*      (RESTful pattern)
             ↓
Database:       projects table          (internal table name)
```

### Page Relationships
```
Homepage
  └─ Navigation: "Productions" link
      └─ /productions (Browse)
           ├─ Create Production button → /productions/new
           └─ Production card → /productions/[id]
                ├─ Filmmaker: "Apply" button → Application submission
                └─ Producer: "Manage Applications" → /productions/[id]/manage
```

## Features Included

### Producer Workflow
1. Click "Productions" in navigation
2. Click "New Production"
3. Fill multi-step form (details, roles, budget)
4. Publish production
5. Applications appear in production detail page
6. Click "Manage Applications" to review, accept, reject

### Filmmaker Workflow
1. Click "Productions" in navigation
2. Browse open productions
3. Click production card to view details
4. Click "Apply" on specific role
5. Submit portfolio URL and optional cover letter
6. Producer can accept/reject from manage page

## Testing Workflow

### Step 1: Deploy Database Schema
```sql
-- Run schema_projects.sql in Supabase SQL Editor
-- Creates: projects, project_roles, project_applications tables
-- Enables RLS policies
```

### Step 2: Test as Producer
1. Login as producer at `/auth/login`
2. Navigate to `/productions` → "New Production"
3. Create sample production (title, description, roles)
4. Production should appear in `/productions` browse page
5. Click "Manage Applications" (visible after creation)

### Step 3: Test as Filmmaker
1. Logout
2. Login as different filmmaker at `/auth/login`
3. Navigate to `/productions`
4. Click production card
5. Click "Apply" on any role
6. Submit portfolio URL and cover letter
7. Application appears in producer's manage page

### Step 4: Test Acceptance Flow
1. As producer, go to `/productions/[id]/manage`
2. Filter by "submitted" status
3. Click "Accept" or "Reject"
4. Confirm status changes in the UI

## Files Created

### Pages (4 files)
- `src/app/productions/page.tsx` - Browse productions
- `src/app/productions/new/page.tsx` - Create production
- `src/app/productions/[id]/page.tsx` - Production detail
- `src/app/productions/[id]/manage/page.tsx` - Manage applications

### Components (1 updated)
- `src/components/CreateProjectForm.tsx` - Now supports both modes

### Navigation (1 updated)
- `src/components/Navigation.tsx` - Added Productions link

## API Endpoints

| Method | Endpoint | Purpose |
|--------|----------|---------|
| POST | `/api/v1/projects` | Create production |
| GET | `/api/v1/projects` | List all open productions |
| GET | `/api/v1/projects/[id]` | Get production details |
| POST | `/api/v1/projects/[id]/applications` | Submit application |
| GET | `/api/v1/projects/[id]/applications` | List applications (producer only) |
| PUT | `/api/v1/projects/[id]/applications/[appId]` | Update application status |

## Backward Compatibility

The original `/projects/*` routes still exist and work unchanged. Both systems can run simultaneously:
- New users see "Productions" feature
- Old project code continues to work
- Future migration to deprecate `/projects/*` can be done gradually

## Next Steps

1. **Deploy Schema**: Run `schema_projects.sql` in Supabase
2. **Test Locally**: Follow testing workflow above
3. **Deploy to Production**: `git add . && git commit -m "Add Productions feature"` → push to Vercel
4. **Monitor**: Check application logs for any RLS or API errors

## Troubleshooting

### "Production not found" error
- Verify schema_projects.sql was executed
- Check RLS policies allow your user access

### "Applications not loading"
- Ensure you're logged in as the producer who created it
- Check browser console for API errors
- Verify `/api/v1/projects/[id]/applications` endpoint

### Forms not submitting
- Verify Supabase environment variables in `.env.local`
- Check that user is authenticated (should redirect to login)
- Look for validation errors in browser console
