create extension if not exists pgcrypto;
create schema if not exists crm;

create table if not exists crm.opportunities (
  id uuid primary key default gen_random_uuid(),
  lead_id uuid references crm.leads(id) on delete set null,
  company_name text not null,
  vendor_name text,
  robot_interest text,
  sales_stage text not null default 'prospecting' check (sales_stage in ('prospecting','qualified','demo','proposal','negotiation','won','lost')),
  estimated_value text,
  next_action text,
  created_by uuid default auth.uid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists crm.vendor_requests (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references crm.companies(id) on delete set null,
  company_name text not null,
  request_type text not null check (request_type in ('claim','verification','update')),
  status text not null default 'pending' check (status in ('pending','approved','rejected')),
  submitted_at timestamptz not null default now(),
  created_by uuid default auth.uid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists crm.analytics_snapshots (
  id uuid primary key default gen_random_uuid(),
  label text not null,
  value_text text not null,
  trend text not null,
  captured_at timestamptz not null default now(),
  created_by uuid default auth.uid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists crm.contacts (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references crm.companies(id) on delete set null,
  lead_id uuid references crm.leads(id) on delete set null,
  full_name text not null,
  email text,
  phone text,
  role_title text,
  created_by uuid default auth.uid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists crm.documents (
  id uuid primary key default gen_random_uuid(),
  company_id uuid references crm.companies(id) on delete set null,
  robot_id uuid references crm.robots(id) on delete set null,
  title text not null,
  document_type text not null,
  file_path text not null,
  created_by uuid default auth.uid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists crm.communications (
  id uuid primary key default gen_random_uuid(),
  channel text not null check (channel in ('email','call','meeting','note','task')),
  subject text not null,
  related_type text not null,
  related_name text not null,
  follow_up date,
  lead_id uuid references crm.leads(id) on delete set null,
  company_id uuid references crm.companies(id) on delete set null,
  created_by uuid default auth.uid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists crm.knowledge_graph_relationships (
  id uuid primary key default gen_random_uuid(),
  source_entity text not null,
  source_id uuid not null,
  target_entity text not null,
  target_id uuid not null,
  relationship_type text not null,
  confidence_score numeric(4,3) not null default 0.5 check (confidence_score >= 0 and confidence_score <= 1),
  created_by uuid default auth.uid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table crm.companies add column if not exists industry text;
alter table crm.companies add column if not exists contact_name text;
alter table crm.companies add column if not exists contact_email text;
alter table crm.companies add column if not exists contact_phone text;
alter table crm.companies add column if not exists founded_year int;
alter table crm.companies add column if not exists annual_revenue text;
alter table crm.companies add column if not exists featured boolean not null default false;

alter table crm.robots add column if not exists industry text;
alter table crm.robots add column if not exists applications jsonb not null default '[]'::jsonb;
alter table crm.robots add column if not exists safety_certifications jsonb not null default '[]'::jsonb;
alter table crm.robots add column if not exists support_included boolean not null default true;

alter table crm.leads add column if not exists company_name text;
alter table crm.leads add column if not exists industry text;
alter table crm.leads add column if not exists robot_interest text;
alter table crm.leads add column if not exists facility_size text;
alter table crm.leads add column if not exists deployment_timeline text;
alter table crm.leads add column if not exists budget_range text;
alter table crm.leads add column if not exists score int not null default 0;

alter table crm.crm_activities add column if not exists related_type text;
alter table crm.crm_activities add column if not exists related_name text;
alter table crm.crm_activities add column if not exists follow_up date;

create trigger opportunities_set_updated_at before update on crm.opportunities for each row execute function crm.set_updated_at();
create trigger vendor_requests_set_updated_at before update on crm.vendor_requests for each row execute function crm.set_updated_at();
create trigger analytics_snapshots_set_updated_at before update on crm.analytics_snapshots for each row execute function crm.set_updated_at();
create trigger contacts_set_updated_at before update on crm.contacts for each row execute function crm.set_updated_at();
create trigger documents_set_updated_at before update on crm.documents for each row execute function crm.set_updated_at();
create trigger communications_set_updated_at before update on crm.communications for each row execute function crm.set_updated_at();
create trigger knowledge_graph_relationships_set_updated_at before update on crm.knowledge_graph_relationships for each row execute function crm.set_updated_at();

alter table crm.opportunities enable row level security;
alter table crm.vendor_requests enable row level security;
alter table crm.analytics_snapshots enable row level security;
alter table crm.contacts enable row level security;
alter table crm.documents enable row level security;
alter table crm.communications enable row level security;
alter table crm.knowledge_graph_relationships enable row level security;

create index if not exists idx_opportunities_lead_id on crm.opportunities(lead_id);
create index if not exists idx_vendor_requests_status on crm.vendor_requests(status);
create index if not exists idx_analytics_snapshots_captured_at on crm.analytics_snapshots(captured_at desc);
create index if not exists idx_contacts_company_id on crm.contacts(company_id);
create index if not exists idx_documents_robot_id on crm.documents(robot_id);
create index if not exists idx_communications_channel on crm.communications(channel);
create index if not exists idx_relationships_source on crm.knowledge_graph_relationships(source_entity, source_id);
create index if not exists idx_relationships_target on crm.knowledge_graph_relationships(target_entity, target_id);

create or replace function crm.ensure_policy(policy_name text, ddl text)
returns void
language plpgsql
as $$
begin
  if not exists (
    select 1 from pg_policies
    where schemaname = 'crm' and policyname = policy_name
  ) then
    execute ddl;
  end if;
end;
$$;

select crm.ensure_policy(
  'public_read_companies',
  'create policy public_read_companies on crm.companies for select to anon, authenticated using (true)'
);
select crm.ensure_policy(
  'public_read_robots',
  'create policy public_read_robots on crm.robots for select to anon, authenticated using (true)'
);
select crm.ensure_policy(
  'public_read_industries',
  'create policy public_read_industries on crm.industries for select to anon, authenticated using (true)'
);
select crm.ensure_policy(
  'public_read_applications',
  'create policy public_read_applications on crm.applications for select to anon, authenticated using (true)'
);
select crm.ensure_policy(
  'public_read_documents',
  'create policy public_read_documents on crm.documents for select to anon, authenticated using (true)'
);

select crm.ensure_policy(
  'admin_all_opportunities',
  'create policy admin_all_opportunities on crm.opportunities for all to authenticated using (crm.has_any_role(array[''super-admin'',''administrator''])) with check (crm.has_any_role(array[''super-admin'',''administrator'']))'
);
select crm.ensure_policy(
  'admin_all_vendor_requests',
  'create policy admin_all_vendor_requests on crm.vendor_requests for all to authenticated using (crm.has_any_role(array[''super-admin'',''administrator''])) with check (crm.has_any_role(array[''super-admin'',''administrator'']))'
);
select crm.ensure_policy(
  'admin_all_analytics_snapshots',
  'create policy admin_all_analytics_snapshots on crm.analytics_snapshots for all to authenticated using (crm.has_any_role(array[''super-admin'',''administrator''])) with check (crm.has_any_role(array[''super-admin'',''administrator'']))'
);
select crm.ensure_policy(
  'admin_all_contacts',
  'create policy admin_all_contacts on crm.contacts for all to authenticated using (crm.has_any_role(array[''super-admin'',''administrator''])) with check (crm.has_any_role(array[''super-admin'',''administrator'']))'
);
select crm.ensure_policy(
  'admin_all_documents',
  'create policy admin_all_documents on crm.documents for all to authenticated using (crm.has_any_role(array[''super-admin'',''administrator''])) with check (crm.has_any_role(array[''super-admin'',''administrator'']))'
);
select crm.ensure_policy(
  'admin_all_communications',
  'create policy admin_all_communications on crm.communications for all to authenticated using (crm.has_any_role(array[''super-admin'',''administrator''])) with check (crm.has_any_role(array[''super-admin'',''administrator'']))'
);
select crm.ensure_policy(
  'admin_all_kg_relationships',
  'create policy admin_all_kg_relationships on crm.knowledge_graph_relationships for all to authenticated using (crm.has_any_role(array[''super-admin'',''administrator''])) with check (crm.has_any_role(array[''super-admin'',''administrator'']))'
);

drop function crm.ensure_policy(text, text);
