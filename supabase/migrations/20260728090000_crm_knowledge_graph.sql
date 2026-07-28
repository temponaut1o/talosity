create extension if not exists pgcrypto;
create schema if not exists crm;

create or replace function crm.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function crm.has_any_role(roles text[])
returns boolean
language sql
stable
as $$
  select coalesce((auth.jwt() -> 'app_metadata' ->> 'role') = any(roles), false);
$$;

create table if not exists crm.industries (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  description text,
  created_by uuid default auth.uid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists crm.applications (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  description text,
  created_by uuid default auth.uid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists crm.companies (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  slug text not null unique,
  website text,
  country text,
  company_type text not null check (company_type in ('manufacturer','integrator','supplier','dealer','customer','partner')),
  vendor_status text not null default 'pending' check (vendor_status in ('pending','verified','suspended')),
  profile_status text not null default 'draft' check (profile_status in ('draft','claim-requested','verified','featured')),
  created_by uuid default auth.uid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists crm.robots (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references crm.companies(id) on delete cascade,
  name text not null,
  model_number text,
  category text not null,
  payload text,
  runtime text,
  navigation text,
  ai_capabilities text[] not null default '{}',
  created_by uuid default auth.uid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(company_id, name, model_number)
);

create table if not exists crm.company_industries (
  company_id uuid not null references crm.companies(id) on delete cascade,
  industry_id uuid not null references crm.industries(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key(company_id, industry_id)
);

create table if not exists crm.robot_industries (
  robot_id uuid not null references crm.robots(id) on delete cascade,
  industry_id uuid not null references crm.industries(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key(robot_id, industry_id)
);

create table if not exists crm.robot_applications (
  robot_id uuid not null references crm.robots(id) on delete cascade,
  application_id uuid not null references crm.applications(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key(robot_id, application_id)
);

create table if not exists crm.deployment_partners (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references crm.companies(id) on delete cascade,
  name text not null,
  service_region text,
  created_by uuid default auth.uid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists crm.robot_deployment_partners (
  robot_id uuid not null references crm.robots(id) on delete cascade,
  deployment_partner_id uuid not null references crm.deployment_partners(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key(robot_id, deployment_partner_id)
);

create table if not exists crm.leads (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references crm.companies(id) on delete set null,
  interested_robot_id uuid references crm.robots(id) on delete set null,
  assigned_vendor_company_id uuid references crm.companies(id) on delete set null,
  lead_name text not null,
  email text not null,
  phone text,
  status text not null default 'new' check (status in ('new','contacted','qualified','vendor-matched','proposal','closed-won','closed-lost')),
  created_by uuid default auth.uid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists crm.meetings (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid references crm.leads(id) on delete set null,
  company_id uuid references crm.companies(id) on delete set null,
  partnership_id uuid,
  title text not null,
  scheduled_at timestamptz not null,
  outcome text,
  created_by uuid default auth.uid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists crm.partnerships (
  id uuid primary key default gen_random_uuid(),
  primary_company_id uuid not null references crm.companies(id) on delete cascade,
  secondary_company_id uuid not null references crm.companies(id) on delete cascade,
  partnership_type text not null,
  status text not null default 'pending' check (status in ('active','inactive','pending')),
  created_by uuid default auth.uid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (primary_company_id <> secondary_company_id)
);

alter table crm.meetings
  add constraint meetings_partnership_id_fkey
  foreign key (partnership_id)
  references crm.partnerships(id)
  on delete set null;

create table if not exists crm.robot_certifications (
  id uuid primary key default gen_random_uuid(),
  robot_id uuid not null references crm.robots(id) on delete cascade,
  certification_name text not null,
  issuer text,
  expires_at timestamptz,
  created_by uuid default auth.uid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists crm.robot_documents (
  id uuid primary key default gen_random_uuid(),
  robot_id uuid not null references crm.robots(id) on delete cascade,
  document_type text not null,
  file_path text not null,
  title text not null,
  created_by uuid default auth.uid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists crm.vendor_contacts (
  id uuid primary key default gen_random_uuid(),
  company_id uuid not null references crm.companies(id) on delete cascade,
  full_name text not null,
  email text not null,
  role_title text,
  created_by uuid default auth.uid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists crm.crm_activities (
  id uuid primary key default gen_random_uuid(),
  activity_type text not null check (activity_type in ('email','call','meeting','note','task')),
  summary text not null,
  lead_id uuid references crm.leads(id) on delete set null,
  company_id uuid references crm.companies(id) on delete set null,
  robot_id uuid references crm.robots(id) on delete set null,
  meeting_id uuid references crm.meetings(id) on delete set null,
  vendor_contact_id uuid references crm.vendor_contacts(id) on delete set null,
  created_by uuid default auth.uid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists crm.company_relationships (
  id uuid primary key default gen_random_uuid(),
  source_company_id uuid not null references crm.companies(id) on delete cascade,
  target_company_id uuid not null references crm.companies(id) on delete cascade,
  relationship_type text not null,
  confidence_score numeric(4,3) not null default 0.5 check (confidence_score >= 0 and confidence_score <= 1),
  created_by uuid default auth.uid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (source_company_id <> target_company_id)
);

create table if not exists crm.robot_relationships (
  id uuid primary key default gen_random_uuid(),
  source_robot_id uuid not null references crm.robots(id) on delete cascade,
  target_robot_id uuid not null references crm.robots(id) on delete cascade,
  relationship_type text not null,
  confidence_score numeric(4,3) not null default 0.5 check (confidence_score >= 0 and confidence_score <= 1),
  created_by uuid default auth.uid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (source_robot_id <> target_robot_id)
);

create index if not exists idx_companies_type on crm.companies(company_type);
create index if not exists idx_robots_company on crm.robots(company_id);
create index if not exists idx_robots_category on crm.robots(category);
create index if not exists idx_leads_status on crm.leads(status);
create index if not exists idx_meetings_scheduled_at on crm.meetings(scheduled_at);
create index if not exists idx_partnerships_companies on crm.partnerships(primary_company_id, secondary_company_id);
create index if not exists idx_crm_activities_lookup on crm.crm_activities(lead_id, company_id, robot_id);
create index if not exists idx_company_relationships_source_target on crm.company_relationships(source_company_id, target_company_id);
create index if not exists idx_robot_relationships_source_target on crm.robot_relationships(source_robot_id, target_robot_id);

create trigger industries_set_updated_at before update on crm.industries for each row execute function crm.set_updated_at();
create trigger applications_set_updated_at before update on crm.applications for each row execute function crm.set_updated_at();
create trigger companies_set_updated_at before update on crm.companies for each row execute function crm.set_updated_at();
create trigger robots_set_updated_at before update on crm.robots for each row execute function crm.set_updated_at();
create trigger deployment_partners_set_updated_at before update on crm.deployment_partners for each row execute function crm.set_updated_at();
create trigger leads_set_updated_at before update on crm.leads for each row execute function crm.set_updated_at();
create trigger meetings_set_updated_at before update on crm.meetings for each row execute function crm.set_updated_at();
create trigger partnerships_set_updated_at before update on crm.partnerships for each row execute function crm.set_updated_at();
create trigger robot_certifications_set_updated_at before update on crm.robot_certifications for each row execute function crm.set_updated_at();
create trigger robot_documents_set_updated_at before update on crm.robot_documents for each row execute function crm.set_updated_at();
create trigger vendor_contacts_set_updated_at before update on crm.vendor_contacts for each row execute function crm.set_updated_at();
create trigger crm_activities_set_updated_at before update on crm.crm_activities for each row execute function crm.set_updated_at();
create trigger company_relationships_set_updated_at before update on crm.company_relationships for each row execute function crm.set_updated_at();
create trigger robot_relationships_set_updated_at before update on crm.robot_relationships for each row execute function crm.set_updated_at();

alter table crm.industries enable row level security;
alter table crm.applications enable row level security;
alter table crm.companies enable row level security;
alter table crm.robots enable row level security;
alter table crm.company_industries enable row level security;
alter table crm.robot_industries enable row level security;
alter table crm.robot_applications enable row level security;
alter table crm.deployment_partners enable row level security;
alter table crm.robot_deployment_partners enable row level security;
alter table crm.leads enable row level security;
alter table crm.meetings enable row level security;
alter table crm.partnerships enable row level security;
alter table crm.robot_certifications enable row level security;
alter table crm.robot_documents enable row level security;
alter table crm.vendor_contacts enable row level security;
alter table crm.crm_activities enable row level security;
alter table crm.company_relationships enable row level security;
alter table crm.robot_relationships enable row level security;

create policy "kg_authenticated_read_industries" on crm.industries for select to authenticated using (true);
create policy "kg_authenticated_read_applications" on crm.applications for select to authenticated using (true);
create policy "kg_authenticated_read_companies" on crm.companies for select to authenticated using (true);
create policy "kg_authenticated_read_robots" on crm.robots for select to authenticated using (true);
create policy "kg_authenticated_read_company_industries" on crm.company_industries for select to authenticated using (true);
create policy "kg_authenticated_read_robot_industries" on crm.robot_industries for select to authenticated using (true);
create policy "kg_authenticated_read_robot_applications" on crm.robot_applications for select to authenticated using (true);
create policy "kg_authenticated_read_deployment_partners" on crm.deployment_partners for select to authenticated using (true);
create policy "kg_authenticated_read_robot_deployment_partners" on crm.robot_deployment_partners for select to authenticated using (true);
create policy "kg_authenticated_read_leads" on crm.leads for select to authenticated using (true);
create policy "kg_authenticated_read_meetings" on crm.meetings for select to authenticated using (true);
create policy "kg_authenticated_read_partnerships" on crm.partnerships for select to authenticated using (true);
create policy "kg_authenticated_read_robot_certifications" on crm.robot_certifications for select to authenticated using (true);
create policy "kg_authenticated_read_robot_documents" on crm.robot_documents for select to authenticated using (true);
create policy "kg_authenticated_read_vendor_contacts" on crm.vendor_contacts for select to authenticated using (true);
create policy "kg_authenticated_read_crm_activities" on crm.crm_activities for select to authenticated using (true);
create policy "kg_authenticated_read_company_relationships" on crm.company_relationships for select to authenticated using (true);
create policy "kg_authenticated_read_robot_relationships" on crm.robot_relationships for select to authenticated using (true);

create policy "kg_write_industries" on crm.industries for all to authenticated
using (crm.has_any_role(array['super-admin','administrator','vendor-manager','sales']))
with check (crm.has_any_role(array['super-admin','administrator','vendor-manager','sales']));

create policy "kg_write_applications" on crm.applications for all to authenticated
using (crm.has_any_role(array['super-admin','administrator','vendor-manager','sales']))
with check (crm.has_any_role(array['super-admin','administrator','vendor-manager','sales']));

create policy "kg_write_companies" on crm.companies for all to authenticated
using (crm.has_any_role(array['super-admin','administrator','vendor-manager','sales']))
with check (crm.has_any_role(array['super-admin','administrator','vendor-manager','sales']));

create policy "kg_write_robots" on crm.robots for all to authenticated
using (crm.has_any_role(array['super-admin','administrator','vendor-manager','sales']))
with check (crm.has_any_role(array['super-admin','administrator','vendor-manager','sales']));

create policy "kg_write_company_industries" on crm.company_industries for all to authenticated
using (crm.has_any_role(array['super-admin','administrator','vendor-manager','sales']))
with check (crm.has_any_role(array['super-admin','administrator','vendor-manager','sales']));

create policy "kg_write_robot_industries" on crm.robot_industries for all to authenticated
using (crm.has_any_role(array['super-admin','administrator','vendor-manager','sales']))
with check (crm.has_any_role(array['super-admin','administrator','vendor-manager','sales']));

create policy "kg_write_robot_applications" on crm.robot_applications for all to authenticated
using (crm.has_any_role(array['super-admin','administrator','vendor-manager','sales']))
with check (crm.has_any_role(array['super-admin','administrator','vendor-manager','sales']));

create policy "kg_write_deployment_partners" on crm.deployment_partners for all to authenticated
using (crm.has_any_role(array['super-admin','administrator','vendor-manager','sales']))
with check (crm.has_any_role(array['super-admin','administrator','vendor-manager','sales']));

create policy "kg_write_robot_deployment_partners" on crm.robot_deployment_partners for all to authenticated
using (crm.has_any_role(array['super-admin','administrator','vendor-manager','sales']))
with check (crm.has_any_role(array['super-admin','administrator','vendor-manager','sales']));

create policy "kg_write_leads" on crm.leads for all to authenticated
using (crm.has_any_role(array['super-admin','administrator','vendor-manager','sales']))
with check (crm.has_any_role(array['super-admin','administrator','vendor-manager','sales']));

create policy "kg_write_meetings" on crm.meetings for all to authenticated
using (crm.has_any_role(array['super-admin','administrator','vendor-manager','sales']))
with check (crm.has_any_role(array['super-admin','administrator','vendor-manager','sales']));

create policy "kg_write_partnerships" on crm.partnerships for all to authenticated
using (crm.has_any_role(array['super-admin','administrator','vendor-manager','sales']))
with check (crm.has_any_role(array['super-admin','administrator','vendor-manager','sales']));

create policy "kg_write_robot_certifications" on crm.robot_certifications for all to authenticated
using (crm.has_any_role(array['super-admin','administrator','vendor-manager','sales']))
with check (crm.has_any_role(array['super-admin','administrator','vendor-manager','sales']));

create policy "kg_write_robot_documents" on crm.robot_documents for all to authenticated
using (crm.has_any_role(array['super-admin','administrator','vendor-manager','sales']))
with check (crm.has_any_role(array['super-admin','administrator','vendor-manager','sales']));

create policy "kg_write_vendor_contacts" on crm.vendor_contacts for all to authenticated
using (crm.has_any_role(array['super-admin','administrator','vendor-manager','sales']))
with check (crm.has_any_role(array['super-admin','administrator','vendor-manager','sales']));

create policy "kg_write_crm_activities" on crm.crm_activities for all to authenticated
using (crm.has_any_role(array['super-admin','administrator','vendor-manager','sales']))
with check (crm.has_any_role(array['super-admin','administrator','vendor-manager','sales']));

create policy "kg_write_company_relationships" on crm.company_relationships for all to authenticated
using (crm.has_any_role(array['super-admin','administrator','vendor-manager','sales']))
with check (crm.has_any_role(array['super-admin','administrator','vendor-manager','sales']));

create policy "kg_write_robot_relationships" on crm.robot_relationships for all to authenticated
using (crm.has_any_role(array['super-admin','administrator','vendor-manager','sales']))
with check (crm.has_any_role(array['super-admin','administrator','vendor-manager','sales']));
