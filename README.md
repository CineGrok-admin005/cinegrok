# CineGrok - Filmmaker Profile Builder

**Create beautiful, AI-powered filmmaker portfolios.**

CineGrok helps aspiring filmmakers build professional profiles with AI-generated bios, showcase their work, and get discovered.

---

## ✨ Features

- **Multi-Step Profile Builder** - Easy 4-step form (Personal → Professional → Filmography → Media)
- **AI-Generated Bios** - Powered by Google Gemini AI
- **Browse Directory** - Discover filmmakers by role, location, and style
- **Authentication** - Secure user accounts with Supabase Auth
- **Responsive Design** - Beautiful on desktop, tablet, and mobile

---

## 🚀 Tech Stack

- **Frontend**: Next.js 15 + TypeScript + React
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **AI**: Google Gemini API
- **Deployment**: Vercel
- **Styling**: CSS Modules

---

## 📦 Getting Started

### Prerequisites
- Node.js 18+
- Supabase account
- Google Gemini API key

### Installation

```bash
# Clone repository
git clone https://github.com/CineGrok-admin005/cinegrok.git
cd cinegrok

# Install dependencies
npm install

# Set up environment variables
cp env.template.txt .env.local
# Add your Supabase and Gemini API keys

# Run database migration
# Copy schema_v2.sql into Supabase SQL Editor and execute

# Start development server
npm run dev
```

Visit `http://localhost:3000`

---

## 🗂️ Project Structure

```
cinegrok/
├── src/
│   ├── app/                    # Next.js App Router pages
│   │   ├── profile-builder/    # Profile creation flow
│   │   ├── browse/             # Filmmaker directory
│   │   ├── filmmakers/[id]/    # Individual profiles
│   │   ├── auth/               # Login/signup
│   │   ├── dashboard/          # User dashboard
│   │   └── api/                # API routes
│   ├── components/             # React components
│   └── lib/                    # Utilities (Supabase client, etc.)
├── public/                     # Static assets
└── schema_v2.sql              # Database schema
```

---

## 🔑 Environment Variables

Required in `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
GOOGLE_GENAI_API_KEY=your_gemini_api_key
```

---

## 📝 Database Schema

Main tables:
- `profiles` - User accounts
- `filmmakers` - Filmmaker profiles
- `payments` - Payment records (future)
- `subscriptions` - Subscription management (future)

Run `schema_v2.sql` in Supabase SQL Editor to set up.

---

## 🎯 Core User Flow

1. **Sign Up** → Create account
2. **Profile Builder** → Fill 4-step form
3. **AI Bio Generation** → Automatic bio creation
4. **Browse** → Profile appears in directory
5. **Share** → Unique profile URL

---

## 🛠️ Development

```bash
# Run dev server
npm run dev

# Build for production
npm run build

# Type check
npm run type-check

# Lint
npm run lint
```

---

## 📄 License

Proprietary - CineGrok © 2024

---

## 🤝 Support

For issues or questions, create a GitHub issue or contact the team.

---

**Built with ❤️ for filmmakers**
