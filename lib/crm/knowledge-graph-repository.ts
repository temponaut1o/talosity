import { parseCreate, parseUpdate } from '@/lib/crm/knowledge-graph-schemas';
import { type KnowledgeGraphEntity } from '@/lib/crm/knowledge-graph-types';
import { getSupabaseServerClient } from '@/lib/supabase/server';

const schemaPrefix = 'crm';

function table(entity: KnowledgeGraphEntity) {
  return `${schemaPrefix}.${entity}`;
}

function tableClient(entity: KnowledgeGraphEntity) {
  const supabase = getSupabaseServerClient();
  if (!supabase) {
    throw new Error('Supabase configuration missing.');
  }
  return supabase.from(table(entity) as any);
}

export async function listRecords(entity: KnowledgeGraphEntity, params: URLSearchParams) {
  const page = Number(params.get('page') ?? '1');
  const pageSize = Math.min(Number(params.get('pageSize') ?? '25'), 200);
  const sortBy = params.get('sortBy') ?? 'created_at';
  const order = (params.get('order') ?? 'desc').toLowerCase() === 'asc';
  const from = (page - 1) * pageSize;
  const to = from + pageSize - 1;

  const query = tableClient(entity).select('*', { count: 'exact' }).order(sortBy, { ascending: order }).range(from, to);

  const { data, error, count } = await query;
  if (error) {
    throw error;
  }

  return { data: data ?? [], count: count ?? 0, page, pageSize };
}

export async function getRecord(entity: KnowledgeGraphEntity, id: string) {
  const { data, error } = await tableClient(entity).select('*').eq('id', id).single();
  if (error) {
    throw error;
  }
  return data;
}

export async function createRecord(entity: KnowledgeGraphEntity, payload: unknown) {
  const parsed = parseCreate(entity, payload);
  const { data, error } = await tableClient(entity).insert(parsed as any).select('*').single();
  if (error) {
    throw error;
  }
  return data;
}

export async function updateRecord(entity: KnowledgeGraphEntity, id: string, payload: unknown) {
  const parsed = parseUpdate(entity, payload);
  const { data, error } = await tableClient(entity).update(parsed as any).eq('id', id).select('*').single();
  if (error) {
    throw error;
  }
  return data;
}

export async function deleteRecord(entity: KnowledgeGraphEntity, id: string) {
  const { error } = await tableClient(entity).delete().eq('id', id);
  if (error) {
    throw error;
  }
}
