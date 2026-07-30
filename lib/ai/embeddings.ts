import 'server-only';

import OpenAI from 'openai';
import { getSupabaseServerAdminClient, getServerAdminEnv } from '@/lib/supabase/server-admin';
import type { GenerateSeoEmbeddingInput, JsonValue, SeoEmbeddingRecord } from '@/lib/seo/types';

const SEO_EMBEDDING_MODEL = 'text-embedding-3-small';
const SEO_EMBEDDING_DIMENSIONS = 1536;

type SeoPageRow = {
  id: string;
  page_url: string;
  page_type: string;
  target_keyword: string | null;
  page_content: string | null;
  optimized_title: string | null;
  optimized_meta_description: string | null;
  optimized_keywords: string[] | null;
  schema_markup: JsonValue | null;
  company_id: string | null;
  robot_id: string | null;
  industry_id: string | null;
};

type CompanyRow = {
  id: string;
  name: string;
  company_type: string;
  industry: string | null;
};

type RobotRow = {
  id: string;
  name: string;
  category: string;
  industry: string | null;
};

type IndustryRow = {
  id: string;
  name: string;
  slug: string;
};

type EmbeddingRow = {
  id: string;
  page_id: string;
  model: string;
  embedding: string | number[];
  created_at: string;
  updated_at: string;
};

function getOpenAiClient() {
  const { openAiApiKey } = getServerAdminEnv();
  return new OpenAI({ apiKey: openAiApiKey });
}

function toVectorLiteral(values: number[]): string {
  return `[${values.join(',')}]`;
}

function extractStringArray(value: JsonValue | null | undefined, key: string): string[] {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return [];
  }

  const entry = value[key];
  if (!Array.isArray(entry)) {
    return [];
  }

  return entry.filter((item): item is string => typeof item === 'string' && item.trim().length > 0);
}

function extractHeadings(pageContent: string | null, schemaMarkup: JsonValue | null): string[] {
  const schemaHeadings = extractStringArray(schemaMarkup, 'headings');
  if (schemaHeadings.length > 0) {
    return schemaHeadings;
  }

  if (!pageContent) {
    return [];
  }

  const markdownHeadings = Array.from(pageContent.matchAll(/^#{1,6}\s+(.+)$/gm)).map((match) => match[1].trim());
  const htmlHeadings = Array.from(pageContent.matchAll(/<h[1-6][^>]*>(.*?)<\/h[1-6]>/gim)).map((match) => match[1].replace(/<[^>]+>/g, '').trim());

  return [...markdownHeadings, ...htmlHeadings].filter((heading) => heading.length > 0);
}

function buildEmbeddingText(input: GenerateSeoEmbeddingInput): string {
  const segments = [
    input.title ? `Title: ${input.title}` : '',
    input.targetKeyword ? `Target keyword: ${input.targetKeyword}` : '',
    input.companyName ? `Company: ${input.companyName}` : '',
    input.robotName ? `Robot: ${input.robotName}` : '',
    input.industryName ? `Industry: ${input.industryName}` : '',
    input.categoryLabel ? `Category: ${input.categoryLabel}` : '',
    input.headings && input.headings.length > 0 ? `Headings: ${input.headings.join(' | ')}` : '',
    input.pageContent ? `Content: ${input.pageContent}` : '',
  ].filter((segment) => segment.length > 0);

  if (segments.length === 0) {
    throw new Error('Cannot generate an SEO embedding from empty input.');
  }

  return segments.join('\n');
}

function parseEmbedding(value: string | number[]): number[] {
  if (Array.isArray(value)) {
    return value;
  }

  const normalized = value.trim().replace(/^\[/, '').replace(/\]$/, '');
  if (!normalized) {
    return [];
  }

  return normalized.split(',').map((entry) => Number(entry.trim()));
}

function toSeoEmbeddingRecord(row: EmbeddingRow): SeoEmbeddingRecord {
  return {
    id: row.id,
    pageId: row.page_id,
    model: row.model,
    embedding: parseEmbedding(row.embedding),
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export async function generateSeoEmbedding(input: GenerateSeoEmbeddingInput): Promise<number[]> {
  const text = buildEmbeddingText(input);
  const openai = getOpenAiClient();

  let response;
  try {
    response = await openai.embeddings.create({
      model: SEO_EMBEDDING_MODEL,
      input: text,
    });
  } catch (error) {
    console.error('[seo-embeddings] OpenAI API error', {
      message: error instanceof Error ? error.message : 'Unknown error',
    });
    throw new Error(`OpenAI embedding generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }

  const embedding = response.data[0]?.embedding;
  if (!embedding) {
    throw new Error('OpenAI did not return an embedding payload.');
  }

  if (embedding.length !== SEO_EMBEDDING_DIMENSIONS) {
    throw new Error(`Expected ${SEO_EMBEDDING_DIMENSIONS} embedding dimensions, received ${embedding.length}.`);
  }

  console.log('[seo-embeddings] embedding generated', {
    model: SEO_EMBEDDING_MODEL,
    dimensions: embedding.length,
  });

  return embedding;
}

export async function upsertSeoPageEmbedding(pageId: string): Promise<SeoEmbeddingRecord> {
  const supabase = getSupabaseServerAdminClient();

  const { data: page, error: pageError } = await supabase
    .from('seo_pages')
    .select('id, page_url, page_type, target_keyword, page_content, optimized_title, optimized_meta_description, optimized_keywords, schema_markup, company_id, robot_id, industry_id')
    .eq('id', pageId)
    .single<SeoPageRow>();

  if (pageError) {
    console.error('[seo-embeddings] Supabase error loading seo_pages', {
      pageId,
      message: pageError.message,
    });
    throw new Error(`Supabase seo_pages fetch failed for pageId ${pageId}: ${pageError.message}`);
  }

  const [companyResult, robotResult, industryResult] = await Promise.all([
    page.company_id
      ? supabase.from('crm.companies').select('id, name, company_type, industry').eq('id', page.company_id).single<CompanyRow>()
      : Promise.resolve({ data: null, error: null }),
    page.robot_id
      ? supabase.from('crm.robots').select('id, name, category, industry').eq('id', page.robot_id).single<RobotRow>()
      : Promise.resolve({ data: null, error: null }),
    page.industry_id
      ? supabase.from('crm.industries').select('id, name, slug').eq('id', page.industry_id).single<IndustryRow>()
      : Promise.resolve({ data: null, error: null }),
  ]);

  if (companyResult.error) {
    console.error('[seo-embeddings] Supabase error loading company context', {
      pageUrl: page.page_url,
      message: companyResult.error.message,
    });
    throw new Error(`Supabase company context fetch failed for pageUrl ${page.page_url}: ${companyResult.error.message}`);
  }

  if (robotResult.error) {
    console.error('[seo-embeddings] Supabase error loading robot context', {
      pageUrl: page.page_url,
      message: robotResult.error.message,
    });
    throw new Error(`Supabase robot context fetch failed for pageUrl ${page.page_url}: ${robotResult.error.message}`);
  }

  if (industryResult.error) {
    console.error('[seo-embeddings] Supabase error loading industry context', {
      pageUrl: page.page_url,
      message: industryResult.error.message,
    });
    throw new Error(`Supabase industry context fetch failed for pageUrl ${page.page_url}: ${industryResult.error.message}`);
  }

  const headings = extractHeadings(page.page_content, page.schema_markup);
  let embedding: number[];
  try {
    embedding = await generateSeoEmbedding({
      title: page.optimized_title ?? page.page_url,
      targetKeyword: page.target_keyword ?? undefined,
      companyName: companyResult.data?.name,
      robotName: robotResult.data?.name,
      industryName: industryResult.data?.name ?? companyResult.data?.industry ?? robotResult.data?.industry ?? undefined,
      categoryLabel: robotResult.data?.category,
      headings,
      pageContent: page.page_content ?? undefined,
    });
  } catch (error) {
    console.error('[seo-embeddings] OpenAI API error while building page embedding', {
      pageUrl: page.page_url,
      message: error instanceof Error ? error.message : 'Unknown error',
    });
    throw new Error(`OpenAI failure for pageUrl ${page.page_url}: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }

  const { data: savedEmbedding, error: embeddingError } = await supabase
    .from('seo_embeddings')
    .upsert(
      {
        page_id: pageId,
        model: SEO_EMBEDDING_MODEL,
        embedding: toVectorLiteral(embedding),
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'page_id,model' },
    )
    .select('id, page_id, model, embedding, created_at, updated_at')
    .single<EmbeddingRow>();

  if (embeddingError) {
    console.error('[seo-embeddings] Supabase error upserting seo_embeddings', {
      pageUrl: page.page_url,
      pageId,
      message: embeddingError.message,
    });
    throw new Error(`Supabase seo_embeddings upsert failed for pageUrl ${page.page_url}: ${embeddingError.message}`);
  }

  console.log('[seo-embeddings] Supabase insert success', {
    pageId: savedEmbedding.page_id,
    model: savedEmbedding.model,
  });

  return toSeoEmbeddingRecord(savedEmbedding);
}