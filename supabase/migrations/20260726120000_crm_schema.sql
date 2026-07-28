create extension if not exists pgcrypto;

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
