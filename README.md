# Talosity - Commercial Robotics Intelligence Directory

A B2B platform for discovering commercial robotics solutions. Focus on real business robotics: cleaning robots, warehouse AMRs, industrial automation, construction robotics, and medical robotics.

## MVP Features

- **Robotics Directory**: Searchable database of commercial robotics companies and products
- **Company Profiles**: Information about robotics manufacturers and vendors
- **Product Pages**: Detailed specifications and applications for robot models
- **Lead Capture**: Businesses can request robotics solutions
- **Newsletter Signup**: Subscribe for robotics industry insights

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript
- **Styling**: Tailwind CSS
- **Database**: PostgreSQL (Supabase)
- **Deployment**: Vercel
- **Icons**: Lucide React
- **Validation**: Zod

## Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn
- Supabase account

### Installation

```bash
# Clone the repository
git clone https://github.com/temponaut1o/talosity.git
cd talosity

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
```

### Environment Setup

Create `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### Database Setup

1. Create a Supabase project at https://supabase.com
2. Run the migrations in `supabase/migrations/`
3. Seed the database with sample data: `npm run seed`

### Development

```bash
npm run dev
```

Open http://localhost:3000

## Project Structure

```
talosity/
├── app/                          # Next.js pages and API routes
│   ├── layout.tsx               # Root layout
│   ├── page.tsx                 # Homepage
│   ├── robots/
│   │   ├── page.tsx             # Robot directory
│   │   └── [id]/page.tsx        # Robot detail page
│   ├── companies/
│   │   ├── page.tsx             # Company directory
│   │   └── [id]/page.tsx        # Company detail page
│   ├── request-robotics/
│   │   └── page.tsx             # Lead capture form
│   └── api/                     # API routes
│       ├── robots/
│       ├── companies/
│       └── leads/
│
├── components/                   # React components
│   ├── Navbar.tsx
│   ├── Footer.tsx
│   ├── RobotCard.tsx
│   ├── CompanyCard.tsx
│   └── SearchBar.tsx
│
├── lib/
│   ├── supabase.ts              # Supabase client
│   └── utils.ts                 # Utility functions
│
├── types/
│   └── robotics.ts              # TypeScript types
│
├── supabase/
│   └── migrations/              # SQL migrations
│
├── public/                       # Static assets
│
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

## Database Schema

### Companies
- `id` (UUID, PK)
- `name` (string)
- `website` (string)
- `description` (text)
- `location` (string)
- `created_at` (timestamp)

### Robots
- `id` (UUID, PK)
- `name` (string)
- `company_id` (UUID, FK)
- `category` (string)
- `industry` (string)
- `specifications` (JSON)
- `application` (text)
- `created_at` (timestamp)

### Categories
- `id` (UUID, PK)
- `name` (string)

### Industries
- `id` (UUID, PK)
- `name` (string)

### Leads
- `id` (UUID, PK)
- `company_name` (string)
- `email` (string)
- `robot_need` (text)
- `created_at` (timestamp)

### Newsletter Signups
- `id` (UUID, PK)
- `email` (string)
- `created_at` (timestamp)

## Roadmap

### Phase 1: MVP (Current)
- [x] Database schema
- [ ] Core API routes
- [ ] Homepage
- [ ] Directory pages
- [ ] Detail pages
- [ ] Lead capture forms
- [ ] Newsletter signup

### Phase 2: Enhancement
- [ ] Advanced search and filtering
- [ ] Company profiles
- [ ] Admin dashboard
- [ ] Email notifications

### Phase 3: Monetization
- [ ] Vendor dashboards
- [ ] Featured listings
- [ ] Sponsored content
- [ ] Lead generation API

## Contributing

This is an MVP project. Changes should focus on core functionality and data quality.

## License

MIT

---

**Current Status**: MVP Foundation Phase
