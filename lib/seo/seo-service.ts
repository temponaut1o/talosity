import 'server-only';

import { z } from 'zod';
import { generateSeoEmbedding, upsertSeoPageEmbedding } from '@/lib/ai/embeddings';
import { getSupabaseServerAdminClient } from '@/lib/supabase/server-admin';
import type {
  ClusterMatch,
  JsonValue,
  SeoPageRecord,
  UpsertSeoMetadataInput,
  UpsertSeoMetadataResult,
} from '@/lib/seo/types';

const seoMetadataSchema = z.object({
  pageUrl: z.string().min(1),
  slug: z.string().optional(),
  pageType: z.enum(['company', 'robot', 'industry', 'category', 'news', 'landing', 'resource']),
  entityId: z.string().uuid().nullable().optional(),
  companyId: z.string().uuid().nullable().optional(),
  robotId: z.string().uuid().nullable().optional(),
  industryId: z.string().uuid().nullable().optional(),
  targetKeyword: z.string().optional(),
  pageContent: z.string().optional(),
  optimizedTitle: z.string().optional(),
  optimizedMetaDescription: z.string().optional(),
  optimizedKeywords: z.array(z.string()).optional(),
  schemaMarkup: z.custom<JsonValue>((value) => value !== undefined),
  seoScore: z.number().int().min(0).max(100).nullable().optional(),
  status: z.enum(['draft', 'review', 'approved', 'published', 'archived']).optional(),
  searchIntent: z.enum(['informational', 'commercial', 'transactional', 'navigational']).nullable().optional(),
}).superRefine((value, context) => {
  const linkedIds = [value.companyId, value.robotId, value.industryId].filter((entry) => typeof entry === 'string');
  if (linkedIds.length > 1) {
    context.addIssue({
      code: z.ZodIssueCode.custom,
      message: 'Only one typed SEO entity relationship may be set per page.',
      path: ['companyId'],
    });
  }
});

type SeoPageRow = {
  id: string;
  page_url: string;
  slug: string | null;
  page_type: SeoPageRecord['pageType'];
  entity_id: string | null;
  company_id: string | null;
  robot_id: string | null;
  industry_id: string | null;
  target_keyword: string | null;
  page_content: string | null;
  optimized_title: string | null;
  optimized_meta_description: string | null;
  optimized_keywords: string[] | null;
  schema_markup: JsonValue | null;
  seo_score: number | null;
  status: SeoPageRecord['status'];
  search_intent: SeoPageRecord['searchIntent'];
  created_at: string;
  updated_at: string;
};

type ClusterMatchRow = {
  cluster_id: string;
  cluster_name: string;
  primary_keyword: string;
  related_keywords: string[] | null;
  page_id: string | null;
  page_url: string | null;
  page_type: ClusterMatch['pageType'];
  company_id: string | null;
  company_name: string | null;
  robot_id: string | null;
  robot_name: string | null;
  industry_id: string | null;
  industry_name: string | null;
  similarity: number;
};

function toSeoPageRecord(row: SeoPageRow): SeoPageRecord {
  return {
    id: row.id,
    pageUrl: row.page_url,
    slug: row.slug ?? '',
    pageType: row.page_type,
    entityId: row.entity_id,
    companyId: row.company_id,
    robotId: row.robot_id,
    industryId: row.industry_id,
    targetKeyword: row.target_keyword ?? '',
    pageContent: row.page_content ?? '',
    optimizedTitle: row.optimized_title ?? '',
    optimizedMetaDescription: row.optimized_meta_description ?? '',
    optimizedKeywords: row.optimized_keywords ?? [],
    schemaMarkup: row.schema_markup ?? {},
    seoScore: row.seo_score,
    status: row.status,
    searchIntent: row.search_intent,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function toClusterMatch(row: ClusterMatchRow): ClusterMatch {
  return {
    clusterId: row.cluster_id,
    clusterName: row.cluster_name,
    primaryKeyword: row.primary_keyword,
    relatedKeywords: row.related_keywords ?? [],
    pageId: row.page_id,
    pageUrl: row.page_url,
    pageType: row.page_type,
    companyId: row.company_id,
    companyName: row.company_name,
    robotId: row.robot_id,
    robotName: row.robot_name,
    industryId: row.industry_id,
    industryName: row.industry_name,
    similarity: row.similarity,
  };
}

function toVectorLiteral(values: number[]): string {
  return `[${values.join(',')}]`;
}

export async function upsertSeoMetadata(input: UpsertSeoMetadataInput): Promise<UpsertSeoMetadataResult> {
  const parsed = seoMetadataSchema.parse(input);
  const supabase = getSupabaseServerAdminClient();

  const { data, error } = await supabase
    .from('seo_pages')
    .upsert(
      {
        page_url: parsed.pageUrl,
        slug: parsed.slug ?? null,
        page_type: parsed.pageType,
        entity_id: parsed.entityId ?? null,
        company_id: parsed.companyId ?? null,
        robot_id: parsed.robotId ?? null,
        industry_id: parsed.industryId ?? null,
        target_keyword: parsed.targetKeyword ?? null,
        page_content: parsed.pageContent ?? null,
        optimized_title: parsed.optimizedTitle ?? null,
        optimized_meta_description: parsed.optimizedMetaDescription ?? null,
        optimized_keywords: parsed.optimizedKeywords ?? [],
        schema_markup: parsed.schemaMarkup ?? {},
        seo_score: parsed.seoScore ?? null,
        status: parsed.status ?? 'draft',
        search_intent: parsed.searchIntent ?? null,
      },
      { onConflict: 'page_url' },
    )
    .select('*')
    .single<SeoPageRow>();

  if (error) {
    console.error('[seo-service] Supabase error upserting seo_pages', {
      pageUrl: parsed.pageUrl,
      message: error.message,
    });
    throw new Error(`Failed to upsert SEO metadata for ${parsed.pageUrl}: ${error.message}`);
  }

  console.log('[seo-service] SEO page id created', {
    pageId: data.id,
    pageUrl: parsed.pageUrl,
  });

  const { data: pageVerification, error: pageVerificationError } = await supabase
    .from('seo_pages')
    .select('id')
    .eq('id', data.id)
    .single<{ id: string }>();

  if (pageVerificationError || !pageVerification?.id) {
    console.error('[seo-service] Supabase error verifying seo_pages insert', {
      pageId: data.id,
      pageUrl: parsed.pageUrl,
      message: pageVerificationError?.message ?? 'Record not found after upsert.',
    });
    throw new Error(`SEO page insert verification failed for ${parsed.pageUrl}.`);
  }

  let embedding = null;
  let embeddingError: string | null = null;

  try {
    embedding = await upsertSeoPageEmbedding(data.id);
  } catch (error) {
    embeddingError = error instanceof Error ? error.message : 'Unknown embedding failure.';
    console.error('[seo-service] embedding upsert failed', {
      pageUrl: parsed.pageUrl,
      pageId: data.id,
      message: embeddingError,
    });
    throw new Error(`SEO page inserted but embedding insert failed for ${parsed.pageUrl}: ${embeddingError}`);
  }

  if (!embedding) {
    throw new Error(`SEO page inserted but embedding insert failed for ${parsed.pageUrl}: No embedding record returned.`);
  }

  const { data: embeddingVerification, error: embeddingVerificationError } = await supabase
    .from('seo_embeddings')
    .select('page_id, model, embedding')
    .eq('page_id', data.id)
    .eq('model', embedding.model)
    .single<{ page_id: string; model: string; embedding: string | number[] }>();

  if (embeddingVerificationError || !embeddingVerification?.page_id || !embeddingVerification.model || !embeddingVerification.embedding) {
    console.error('[seo-service] Supabase error verifying seo_embeddings insert', {
      pageId: data.id,
      pageUrl: parsed.pageUrl,
      message: embeddingVerificationError?.message ?? 'Embedding record not found after upsert.',
    });
    throw new Error(`Embedding insert verification failed for ${parsed.pageUrl}.`);
  }

  return {
    page: toSeoPageRecord(data),
    embedding,
    embeddingError,
  };
}

export async function findKeywordClusters(promptText: string, threshold = 0.6, limit = 10): Promise<ClusterMatch[]> {
  if (!promptText.trim()) {
    return [];
  }

  const supabase = getSupabaseServerAdminClient();
  const promptEmbedding = await generateSeoEmbedding({ pageContent: promptText });

  const { data, error } = await supabase.rpc('match_seo_clusters', {
    query_embedding: toVectorLiteral(promptEmbedding),
    match_threshold: threshold,
    match_count: limit,
  });

  if (error) {
    throw new Error(`Failed to match SEO keyword clusters: ${error.message}`);
  }

  return ((data ?? []) as ClusterMatchRow[]).map(toClusterMatch);
}