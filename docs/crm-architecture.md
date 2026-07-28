# Talosity Robotics CRM Platform Architecture

## 1. Architecture summary

The Talosity CRM is implemented as a modular backend layer on top of the existing Next.js 14 application. The public website remains the discovery experience, while the new admin and API layer handles leads, companies, robots, vendor requests, analytics, and workflow operations.

## 2. Core modules

- Companies: manufacturers, integrators, suppliers, and customers
- Robots: product catalog with service and specification metadata
- Leads: inbound demand capture and qualification workflow
- Opportunities: vendor-matched deals and sales progress tracking
- Communications: emails, notes, and follow-ups
- Vendor management: claim requests, verification, documents, and product updates
- Analytics: dashboard metrics and search insights

## 3. ER diagram

```text
companies 1---* robots
companies 1---* vendor_requests
leads 1---* opportunities
leads 1---* communications
companies 1---* communications
opportunities 1---* communications
```

## 4. Supabase-ready schema

```sql
create table if not exists companies (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  company_type text not null,
  industry text,
  website text,
  contact_name text,
  contact_email text,
  contact_phone text,
  vendor_status text,
  profile_status text,
  headquarters text,
  founded_year int,
  annual_revenue text,
  featured boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists robots (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  manufacturer text not null,
  model_number text,
  category text,
  industry text,
  applications jsonb,
  payload text,
  speed text,
  ai_capabilities jsonb,
  safety_certifications jsonb,
  support_included boolean default false,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  company text,
  email text,
  phone text,
  industry text,
  robot_interest text,
  facility_size text,
  deployment_timeline text,
  budget_range text,
  status text,
  score int default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists opportunities (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid references leads(id),
  company_name text,
  vendor_name text,
  robot_interest text,
  sales_stage text,
  estimated_value text,
  next_action text,
  created_at timestamptz default now()
);

create table if not exists vendor_requests (
  id uuid primary key default gen_random_uuid(),
  company_name text not null,
  request_type text not null,
  status text not null,
  submitted_at timestamptz default now()
);
```

## 5. API endpoints

- GET /api/crm
- GET /api/crm/leads
- POST /api/crm/leads
- GET /api/crm/vendors

## 6. Authentication architecture

- Supabase Auth for user sign-in
- RBAC roles: super-admin, administrator, sales, marketing, vendor-manager, vendor-user, read-only
- RLS policies to restrict access by module and organization
- Server-side checks before mutations

## 7. Dashboard UI architecture

- Executive KPI cards
- Lead table with scoring and workflow state
- Vendor request review panel
- Recent robots and analytics widgets
- Modular admin route: /admin/crm

## 8. Implementation roadmap

1. Foundation: types, seed data, dashboard route
2. API layer: metrics, leads, vendors
3. Auth and RBAC: Supabase integration and guard rails
4. Data imports: CSV/JSON support and duplicate detection
5. Search and analytics: full-text indexing and dashboard expansion
6. Vendor portal and RaaS modules

## 9. Security checklist

- JWT-backed access control
- RLS policies
- audit logging
- soft deletes
- rate limiting
- CSRF protection
- secure object storage for documents
- encrypted secrets

## 10. Deployment architecture

- Vercel for Next.js hosting
- Supabase Postgres for persistence
- Cloudflare for edge delivery and DNS
- Resend for transactional email
- Stripe for paid vendor features and subscriptions
