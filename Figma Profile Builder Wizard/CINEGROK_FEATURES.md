# CineGrok - Filmmaker Portfolio Platform

## Overview
CineGrok is a professional portfolio platform for Indian filmmakers, featuring a mobile-first design with dual viewing modes and a comprehensive 6-step profile builder.

## Key Features

### 🎨 Design Philosophy
- **Typography**: Playfair Display (serif) for headings, Inter (sans-serif) for body text
- **Color Palette**: Monochrome (#18181b primary, #52525b secondary, #a1a1aa muted)
- **Visual Style**: Calm, serious, respectful, cinematic, and timeless
- **Images**: Black & white profile photos with color reveal on hover

### 📱 Mobile-First Responsive Design
- Optimized for mobile (375px) → tablet (768px) → desktop (1024px+)
- Touch-friendly tap targets (44px minimum)
- Collapsible sections for better mobile navigation
- Bottom navigation on mobile devices
- Responsive grid layouts that stack appropriately

### 🔧 6-Step Profile Builder Wizard

1. **Personal Information**
   - Profile photo upload, stage name, contact details
   - Location (country, state, city)
   - Languages, education overview

2. **Professional Details**
   - Primary & secondary roles (max 2 each)
   - Preferred genres, visual style
   - Creative philosophy, influences, signature

3. **Filmography**
   - Add multiple films with details
   - Format, status, roles, crew scale
   - Synopsis, poster, watch links

4. **Social Links**
   - Instagram, YouTube, IMDb, LinkedIn
   - Twitter, Facebook, personal website, Letterboxd

5. **Education (Detailed)**
   - Schooling through PhD
   - Certifications and workshops

6. **Preview & Publish**
   - Profile summary
   - Auto-generated bio
   - Final review before publishing

### 👥 Dual View System

#### Audience View (Public)
- **Hero Section**: Profile photo, name, roles, location
- **About**: Auto-generated bio, education & training
- **Selected Work**: Film cards with poster images, swipeable on mobile
- **Sidebar**: Creative style, philosophy (quote format), availability
- **Collapsible Sections**: Better UX on mobile
- **Social Links**: Quick access to filmmaker's profiles

#### Producer View (Logged-in Only)
- **Dashboard Header**: Quick actions (Save Profile, Export Data)
- **Contact Card**: Email, phone (producer-only), location
- **Career Statistics**:
  - Project Lifecycle (bar chart)
  - Format Experience (bar chart)
  - Crew Scale Handling (bar chart)
- **Role & Genre Analysis**: Badge clouds with counts
- **Activity Timeline**: Sortable table of all projects
- **Professional Details**: Full access to creative philosophy, education
- **Data Export**: Download profile data (UI ready)

### 🎯 View Toggle Component
- Inline toggle switch (Audience ↔ Producer)
- Locked state for non-logged-in users
- Persistent across session
- Clear visual feedback

### 🔐 Authentication States
- **Guest Mode**: Audience view only, Producer view locked
- **Producer Login**: Unlocks Producer view with extended data
- Demo toggle for testing both states

### 📊 Data Visualization
- Recharts integration for professional analytics
- Bar charts for project lifecycle, formats, crew scales
- Badge clouds for roles and genres with counts
- Sortable activity timeline table

### 🎬 Film Cards
- Aspect ratio 2:3 (standard poster format)
- Grayscale with color reveal on hover
- Format and role badges
- Synopsis display
- Watch link integration

### 💡 Smart Features
- Auto-generated bios based on profile data
- Multi-select with maximum limits (roles, genres)
- Dynamic filmography management (add/remove)
- Progressive disclosure (expandable sections)
- Responsive image handling with fallbacks

## Demo Controls

### Top Navigation
- **Create Profile**: Switch to wizard mode
- **Producer Login/Logout**: Toggle authentication state
- **View Toggle**: Switch between Audience and Producer views

### Mobile Bottom Navigation
- Simplified controls for smaller screens
- Quick access to key actions
- Status indicator (Guest/Producer)

## Technical Stack
- **React** with TypeScript
- **Tailwind CSS** v4.0
- **Recharts** for data visualization
- **Radix UI** components
- **Motion/React** for animations (if needed)
- **ImageWithFallback** for robust image handling

## File Structure
```
/src/app/
  ├── App.tsx                    # Main application
  ├── components/
  │   ├── profile-wizard.tsx     # 6-step form
  │   ├── audience-view.tsx      # Public profile view
  │   ├── producer-view.tsx      # Professional data view
  │   ├── view-toggle.tsx        # View switching component
  │   └── ui/                    # Reusable UI components
  ├── types/
  │   └── profile.ts             # TypeScript definitions
  └── data/
      └── mock-profile.ts        # Sample data
```

## Usage

### Creating a Profile
1. Click "Create Profile" in navigation
2. Complete 6 steps of the wizard
3. Review and publish

### Viewing Profiles
- Default: Audience View (public portfolio)
- Login as Producer: Access extended data and analytics
- Toggle between views using the switch in header

### Testing Features
- Use "Producer Login" to unlock Producer View
- Switch views to see different data presentations
- Resize browser to test mobile responsiveness

## Future Enhancements
- Real backend integration with Supabase
- Search and filter filmmakers
- Portfolio comparison tools
- Collaboration request system
- Film festival integration
- Analytics dashboard for filmmakers
