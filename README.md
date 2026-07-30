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
- **AI**: OpenAI `text-embedding-3-small`
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
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
OPENAI_API_KEY=your_openai_api_key
```

`SUPABASE_SERVICE_ROLE_KEY` and `OPENAI_API_KEY` are server-only. Do not expose them in browser code.

### Database Setup

1. Use the existing Talosity Supabase project.
2. Run the additive migrations in `supabase/migrations/` in timestamp order.
3. Apply the SEO intelligence migration `20260730110000_seo_intelligence_layer.sql` after the existing CRM migrations.
4. Confirm `vector` is available in the target database. The migration uses `CREATE EXTENSION IF NOT EXISTS vector;` to avoid duplication.
5. Seed or import SEO pages, keyword clusters, and recommendation workflows through server-side services.

### SEO Intelligence Layer

The platform now includes an additive SEO intelligence layer that extends the existing CRM model without replacing it.

- `public.seo_pages` stores indexable Talosity page metadata and links to `crm.companies`, `crm.robots`, and `crm.industries` through typed nullable foreign keys.
- `public.seo_embeddings` stores pgvector embeddings separately from page metadata for future model upgrades.
- `public.seo_keyword_clusters` supports semantic keyword clustering and similarity matching through the `match_seo_clusters` RPC.
- `public.seo_recommendations` stores AI-generated suggestions separately from published metadata.
- `public.seo_audit_events` records metadata updates, publishing transitions, and recommendation changes over time.

### Migration Instructions

1. Ensure the existing CRM migrations are already applied.
2. Apply `20260730110000_seo_intelligence_layer.sql` to the existing Talosity database.
3. Verify RLS policies in Supabase after migration.
4. Set `OPENAI_API_KEY` and `SUPABASE_SERVICE_ROLE_KEY` in the deployment environment before using server-side SEO automation.
5. Use the server-only SEO services in `lib/seo/seo-service.ts` and `lib/ai/embeddings.ts` for metadata upserts and embedding generation.

### SEO Intelligence Layer Verification

Local test:

```bash
npm run dev
curl http://localhost:3000/api/test-seo-embedding
curl http://localhost:3000/api/test-seo-status
curl http://localhost:3000/api/admin/seo/seed
curl http://localhost:3000/api/admin/seo/status
```

Supabase verification queries:

```sql
select * from public.seo_pages;
select * from public.seo_embeddings;
select count(*) from public.seo_pages;
select count(*) from public.seo_embeddings;
```

Returned rows confirm ingestion and embedding persistence for SEO pages.

Production seed safeguard:

- `api/admin/seo/seed` is blocked by default in production.
- Set `SEO_PRODUCTION_SEED_ENABLED=true` only when you need controlled production seeding, then disable it after ingestion.

### Production Readiness Checklist

Database:
- [x] migration applied
- [x] vector extension enabled
- [x] RPC available

Application:
- [x] OpenAI SDK installed
- [x] environment variables configured
- [x] embedding generation tested

Production:
- [ ] protect test routes
- [ ] deploy to Vercel
- [ ] verify Vercel environment variables
- [ ] check Vercel logs

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
