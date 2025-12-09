# Productions Feature - Quick Reference

## What Was Done

✅ **Navigation** - Added "Productions" link to homepage (desktop + mobile)  
✅ **Pages** - Created 4 new production pages at `/productions/*` routes  
✅ **Components** - Updated CreateProjectForm to support "productions" mode  
✅ **Database** - Schema ready (run `schema_projects.sql` before testing)  
✅ **API** - All 5 endpoints operational at `/api/v1/projects/*`  

## User Journey

```
User clicks "Productions" in navigation
    ↓
Browse open productions (/productions)
    ├─ View production details (/productions/[id])
    │   ├─ Filmmaker: Click "Apply" → submit application
    │   └─ Producer: Click "Manage Applications" → /productions/[id]/manage
    │
    └─ Create new production (/productions/new)
        └─ Multi-step form → publish → appears in browse
```

## File Structure

```
src/app/productions/
├── page.tsx                 # Browse all open productions
├── new/
│   └── page.tsx            # Create new production
└── [id]/
    ├── page.tsx            # View production details & apply
    └── manage/
        └── page.tsx        # Producer: manage applications
```

## Key Files Modified

1. `src/components/Navigation.tsx` - Added Productions link
2. `src/components/CreateProjectForm.tsx` - Added isProduction prop
3. All other routes unchanged - backward compatible

## To Deploy

```bash
# 1. Run schema in Supabase SQL Editor
# Copy contents of schema_projects.sql and execute

# 2. Push to GitHub
git add .
git commit -m "Add Productions feature - cinematic collaboration"
git push origin main

# 3. Vercel deploys automatically
# Visit your site → click "Productions" in nav
```

## Testing Checklist

- [ ] Schema_projects.sql runs without errors
- [ ] Can create a production as authenticated user
- [ ] Production appears in /productions browse page  
- [ ] Can apply to a role as different user
- [ ] Applications appear in manage page for creator
- [ ] Can accept/reject applications
- [ ] No console errors on any page

## Naming Convention

| Layer | Term | Example |
|-------|------|---------|
| **User-facing** | Productions | `/productions`, "Browse Productions" |
| **API** | projects | `/api/v1/projects` |
| **Database** | projects | Table name: `projects` |

This allows for gradual migration if needed while maintaining a cinematic brand.
