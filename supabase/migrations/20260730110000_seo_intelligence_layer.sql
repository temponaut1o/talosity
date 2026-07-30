create extension if not exists pgcrypto;
create extension if not exists vector;

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace function public.has_admin_role()
returns boolean
language sql
stable
as $$
  select coalesce((auth.jwt() -> 'app_metadata' ->> 'role') = any(array['super-admin','administrator','marketing','research-analyst']), false);
$$;

create table if not exists public.seo_pages (
  id uuid primary key default gen_random_uuid(),
  page_url text not null unique,
  slug text,
  page_type text not null check (page_type in ('company','robot','industry','category','news','landing','resource')),
  entity_id uuid,
  company_id uuid references crm.companies(id) on delete set null,
  robot_id uuid references crm.robots(id) on delete set null,
  industry_id uuid references crm.industries(id) on delete set null,
  target_keyword text,
  page_content text,
  optimized_title text,
  optimized_meta_description text,
  optimized_keywords text[] not null default '{}',
  schema_markup jsonb not null default '{}'::jsonb,
  seo_score integer,
  status text not null default 'draft' check (status in ('draft','review','approved','published','archived')),
  search_intent text check (search_intent in ('informational','commercial','transactional','navigational')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  check (
    (case when company_id is null then 0 else 1 end) +
    (case when robot_id is null then 0 else 1 end) +
    (case when industry_id is null then 0 else 1 end) <= 1
  )
);

create table if not exists public.seo_embeddings (
  id uuid primary key default gen_random_uuid(),
  page_id uuid not null references public.seo_pages(id) on delete cascade,
  model text not null,
  embedding vector(1536) not null,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  unique(page_id, model)
);

create table if not exists public.seo_keyword_clusters (
  id uuid primary key default gen_random_uuid(),
  cluster_name text not null,
  primary_keyword text not null,
  related_keywords text[] not null default '{}',
  embedding vector(1536) not null,
  created_at timestamptz not null default now()
);

create table if not exists public.seo_recommendations (
  id uuid primary key default gen_random_uuid(),
  page_id uuid not null references public.seo_pages(id) on delete cascade,
  recommended_title text,
  recommended_meta_description text,
  keyword_gaps text[] not null default '{}',
  internal_link_recommendations jsonb not null default '[]'::jsonb,
  content_improvements text,
  ai_model text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.seo_audit_events (
  id uuid primary key default gen_random_uuid(),
  seo_page_id uuid not null references public.seo_pages(id) on delete cascade,
  action text not null,
  old_value jsonb,
  new_value jsonb,
  created_by uuid,
  created_at timestamptz not null default now()
);

create index if not exists idx_seo_pages_page_url on public.seo_pages(page_url);
create index if not exists idx_seo_pages_entity_id on public.seo_pages(entity_id);
create index if not exists idx_seo_pages_status on public.seo_pages(status);
create index if not exists idx_seo_pages_company_id on public.seo_pages(company_id);
create index if not exists idx_seo_pages_robot_id on public.seo_pages(robot_id);
create index if not exists idx_seo_pages_industry_id on public.seo_pages(industry_id);
create index if not exists idx_seo_embeddings_page_id on public.seo_embeddings(page_id);
create index if not exists idx_seo_recommendations_page_id on public.seo_recommendations(page_id);
create index if not exists idx_seo_audit_events_page_id on public.seo_audit_events(seo_page_id, created_at desc);

create index if not exists idx_seo_embeddings_embedding_cosine
  on public.seo_embeddings
  using ivfflat (embedding vector_cosine_ops)
  with (lists = 100);

create index if not exists idx_seo_keyword_clusters_embedding_cosine
  on public.seo_keyword_clusters
  using ivfflat (embedding vector_cosine_ops)
  with (lists = 100);

create trigger seo_pages_set_updated_at
before update on public.seo_pages
for each row execute function public.set_updated_at();

create trigger seo_embeddings_set_updated_at
before update on public.seo_embeddings
for each row execute function public.set_updated_at();

create or replace function public.log_seo_page_audit_event()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  actor_id uuid;
begin
  actor_id := auth.uid();

  if tg_op = 'INSERT' then
    insert into public.seo_audit_events (seo_page_id, action, old_value, new_value, created_by)
    values (new.id, 'page_created', null, to_jsonb(new), actor_id);
    return new;
  end if;

  if tg_op = 'UPDATE' then
    insert into public.seo_audit_events (seo_page_id, action, old_value, new_value, created_by)
    values (
      new.id,
      case
        when old.status is distinct from new.status then 'status_changed'
        when old.optimized_title is distinct from new.optimized_title
          or old.optimized_meta_description is distinct from new.optimized_meta_description
          or old.optimized_keywords is distinct from new.optimized_keywords
          or old.schema_markup is distinct from new.schema_markup
          then 'metadata_updated'
        when old.target_keyword is distinct from new.target_keyword
          or old.page_content is distinct from new.page_content
          or old.seo_score is distinct from new.seo_score
          then 'optimization_updated'
        else 'page_updated'
      end,
      to_jsonb(old),
      to_jsonb(new),
      actor_id
    );
    return new;
  end if;

  if tg_op = 'DELETE' then
    insert into public.seo_audit_events (seo_page_id, action, old_value, new_value, created_by)
    values (old.id, 'page_deleted', to_jsonb(old), null, actor_id);
    return old;
  end if;

  return null;
end;
$$;

create trigger seo_pages_audit_events
after insert or update or delete on public.seo_pages
for each row execute function public.log_seo_page_audit_event();

create or replace function public.log_seo_recommendation_audit_event()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  actor_id uuid;
  related_page_id uuid;
begin
  actor_id := auth.uid();
  related_page_id := coalesce(new.page_id, old.page_id);

  insert into public.seo_audit_events (seo_page_id, action, old_value, new_value, created_by)
  values (
    related_page_id,
    case tg_op
      when 'INSERT' then 'recommendation_created'
      when 'UPDATE' then 'recommendation_updated'
      when 'DELETE' then 'recommendation_deleted'
      else 'recommendation_changed'
    end,
    case when tg_op = 'INSERT' then null else to_jsonb(old) end,
    case when tg_op = 'DELETE' then null else to_jsonb(new) end,
    actor_id
  );

  return coalesce(new, old);
end;
$$;

create trigger seo_recommendations_audit_events
after insert or update or delete on public.seo_recommendations
for each row execute function public.log_seo_recommendation_audit_event();

create or replace function public.match_seo_clusters(
  query_embedding vector(1536),
  match_threshold double precision default 0.6,
  match_count integer default 10
)
returns table (
  cluster_id uuid,
  cluster_name text,
  primary_keyword text,
  related_keywords text[],
  page_id uuid,
  page_url text,
  page_type text,
  company_id uuid,
  company_name text,
  robot_id uuid,
  robot_name text,
  industry_id uuid,
  industry_name text,
  similarity double precision
)
language sql
stable
as $$
  with ranked_clusters as (
    select
      c.id,
      c.cluster_name,
      c.primary_keyword,
      c.related_keywords,
      (1 - (c.embedding <=> query_embedding)) as similarity
    from public.seo_keyword_clusters c
    where (1 - (c.embedding <=> query_embedding)) >= match_threshold
    order by c.embedding <=> query_embedding
    limit greatest(match_count, 1)
  )
  select
    ranked.id as cluster_id,
    ranked.cluster_name,
    ranked.primary_keyword,
    ranked.related_keywords,
    page.id as page_id,
    page.page_url,
    page.page_type,
    page.company_id,
    company.name as company_name,
    page.robot_id,
    robot.name as robot_name,
    page.industry_id,
    industry.name as industry_name,
    ranked.similarity
  from ranked_clusters ranked
  left join lateral (
    select p.id, p.page_url, p.page_type, p.company_id, p.robot_id, p.industry_id
    from public.seo_pages p
    where p.target_keyword = ranked.primary_keyword
       or ranked.primary_keyword = any(coalesce(p.optimized_keywords, '{}'))
       or ranked.primary_keyword = p.slug
    order by p.updated_at desc
    limit 1
  ) page on true
  left join crm.companies company on company.id = page.company_id
  left join crm.robots robot on robot.id = page.robot_id
  left join crm.industries industry on industry.id = page.industry_id
  order by ranked.similarity desc, page.page_url asc nulls last;
$$;

alter table public.seo_pages enable row level security;
alter table public.seo_embeddings enable row level security;
alter table public.seo_keyword_clusters enable row level security;
alter table public.seo_recommendations enable row level security;
alter table public.seo_audit_events enable row level security;

create or replace function public.ensure_policy(target_schema text, target_table text, policy_name text, ddl text)
returns void
language plpgsql
as $$
begin
  if not exists (
    select 1
    from pg_policies
    where schemaname = target_schema
      and tablename = target_table
      and policyname = policy_name
  ) then
    execute ddl;
  end if;
end;
$$;

select public.ensure_policy(
  'public',
  'seo_pages',
  'public_read_published_seo_pages',
  'create policy public_read_published_seo_pages on public.seo_pages for select to anon, authenticated using (status = ''published'')'
);

select public.ensure_policy(
  'public',
  'seo_keyword_clusters',
  'authenticated_read_keyword_clusters',
  'create policy authenticated_read_keyword_clusters on public.seo_keyword_clusters for select to authenticated using (true)'
);

select public.ensure_policy(
  'public',
  'seo_recommendations',
  'admin_read_seo_recommendations',
  'create policy admin_read_seo_recommendations on public.seo_recommendations for select to authenticated using (public.has_admin_role())'
);

select public.ensure_policy(
  'public',
  'seo_audit_events',
  'admin_read_seo_audit_events',
  'create policy admin_read_seo_audit_events on public.seo_audit_events for select to authenticated using (public.has_admin_role())'
);

select public.ensure_policy(
  'public',
  'seo_pages',
  'admin_write_seo_pages',
  'create policy admin_write_seo_pages on public.seo_pages for all to authenticated using (public.has_admin_role()) with check (public.has_admin_role())'
);

select public.ensure_policy(
  'public',
  'seo_embeddings',
  'admin_write_seo_embeddings',
  'create policy admin_write_seo_embeddings on public.seo_embeddings for all to authenticated using (public.has_admin_role()) with check (public.has_admin_role())'
);

select public.ensure_policy(
  'public',
  'seo_keyword_clusters',
  'admin_write_seo_keyword_clusters',
  'create policy admin_write_seo_keyword_clusters on public.seo_keyword_clusters for all to authenticated using (public.has_admin_role()) with check (public.has_admin_role())'
);

select public.ensure_policy(
  'public',
  'seo_recommendations',
  'admin_write_seo_recommendations',
  'create policy admin_write_seo_recommendations on public.seo_recommendations for all to authenticated using (public.has_admin_role()) with check (public.has_admin_role())'
);

select public.ensure_policy(
  'public',
  'seo_audit_events',
  'admin_write_seo_audit_events',
  'create policy admin_write_seo_audit_events on public.seo_audit_events for all to authenticated using (public.has_admin_role()) with check (public.has_admin_role())'
);

drop function public.ensure_policy(text, text, text, text);