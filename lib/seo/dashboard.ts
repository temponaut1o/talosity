import 'server-only';

import { getSupabaseServerAdminClient } from '@/lib/supabase/server-admin';

type SeoPageRow = {
  id: string;
  page_url: string;
  page_type: string;
  target_keyword: string | null;
  status: string;
  seo_score: number | null;
  updated_at: string;
};

type SeoKeywordClusterRow = {
  id: string;
  cluster_name: string;
  primary_keyword: string;
  related_keywords: string[] | null;
};

type SeoRecommendationRow = {
  id: string;
  page_id: string;
  recommended_title: string | null;
  recommended_meta_description: string | null;
  keyword_gaps: string[] | null;
  internal_link_recommendations: unknown;
  content_improvements: string | null;
  created_at: string;
};

type SeoPageLookupRow = {
  id: string;
  page_url: string;
};

export interface SeoDashboardPageItem {
  id: string;
  url: string;
  pageType: string;
  keyword: string;
  status: string;
  seoScore: number | null;
  updatedAt: string;
}

export interface SeoDashboardClusterItem {
  id: string;
  clusterName: string;
  primaryKeyword: string;
  relatedKeywords: string[];
}

export interface SeoDashboardRecommendationItem {
  id: string;
  recommendationType: 'metadata' | 'keyword-gap' | 'internal-links' | 'content' | 'general';
  priority: 'high' | 'medium' | 'low';
  affectedPage: string;
  createdAt: string;
}

export interface SeoDashboardResponse {
  pages: {
    count: number;
    items: SeoDashboardPageItem[];
  };
  embeddings: {
    count: number;
  };
  clusters: {
    count: number;
    items: SeoDashboardClusterItem[];
  };
  recommendations: {
    count: number;
    items: SeoDashboardRecommendationItem[];
  };
}

function hasInternalLinks(value: unknown): boolean {
  if (Array.isArray(value)) {
    return value.length > 0;
  }

  if (value && typeof value === 'object') {
    return Object.keys(value as Record<string, unknown>).length > 0;
  }

  return false;
}

function inferRecommendationType(row: SeoRecommendationRow): SeoDashboardRecommendationItem['recommendationType'] {
  if (row.recommended_title || row.recommended_meta_description) {
    return 'metadata';
  }
  if ((row.keyword_gaps ?? []).length > 0) {
    return 'keyword-gap';
  }
  if (hasInternalLinks(row.internal_link_recommendations)) {
    return 'internal-links';
  }
  if (row.content_improvements && row.content_improvements.trim().length > 0) {
    return 'content';
  }
  return 'general';
}

function inferPriority(row: SeoRecommendationRow): SeoDashboardRecommendationItem['priority'] {
  const gaps = (row.keyword_gaps ?? []).length;
  const hasContentWork = Boolean(row.content_improvements && row.content_improvements.trim().length > 0);
  const hasMetadataWork = Boolean(row.recommended_title || row.recommended_meta_description);

  if (gaps >= 5 || (hasContentWork && gaps >= 2)) {
    return 'high';
  }
  if (gaps > 0 || hasMetadataWork || hasContentWork) {
    return 'medium';
  }
  return 'low';
}

export async function getSeoDashboardData(): Promise<SeoDashboardResponse> {
  const supabase = getSupabaseServerAdminClient();

  const [pagesResult, embeddingsResult, clustersResult, recommendationsResult] = await Promise.all([
    supabase
      .from('seo_pages')
      .select('id, page_url, page_type, target_keyword, status, seo_score, updated_at', { count: 'exact' })
      .order('updated_at', { ascending: false })
      .limit(50),
    supabase.from('seo_embeddings').select('id', { count: 'exact', head: true }),
    supabase
      .from('seo_keyword_clusters')
      .select('id, cluster_name, primary_keyword, related_keywords', { count: 'exact' })
      .order('created_at', { ascending: false })
      .limit(25),
    supabase
      .from('seo_recommendations')
      .select('id, page_id, recommended_title, recommended_meta_description, keyword_gaps, internal_link_recommendations, content_improvements, created_at', { count: 'exact' })
      .order('created_at', { ascending: false })
      .limit(25),
  ]);

  if (pagesResult.error) {
    throw new Error(`Failed to load SEO pages: ${pagesResult.error.message}`);
  }
  if (embeddingsResult.error) {
    throw new Error(`Failed to load SEO embeddings count: ${embeddingsResult.error.message}`);
  }
  if (clustersResult.error) {
    throw new Error(`Failed to load SEO keyword clusters: ${clustersResult.error.message}`);
  }
  if (recommendationsResult.error) {
    throw new Error(`Failed to load SEO recommendations: ${recommendationsResult.error.message}`);
  }

  const pages = (pagesResult.data ?? []) as SeoPageRow[];
  const clusters = (clustersResult.data ?? []) as SeoKeywordClusterRow[];
  const recommendations = (recommendationsResult.data ?? []) as SeoRecommendationRow[];

  const recommendationPageIds = Array.from(new Set(recommendations.map((entry) => entry.page_id).filter((entry): entry is string => Boolean(entry))));
  let pageLookupById = new Map<string, string>();

  if (recommendationPageIds.length > 0) {
    const { data: pageLookupRows, error: pageLookupError } = await supabase
      .from('seo_pages')
      .select('id, page_url')
      .in('id', recommendationPageIds);

    if (pageLookupError) {
      throw new Error(`Failed to resolve recommendation page URLs: ${pageLookupError.message}`);
    }

    pageLookupById = new Map(((pageLookupRows ?? []) as SeoPageLookupRow[]).map((row) => [row.id, row.page_url]));
  }

  return {
    pages: {
      count: pagesResult.count ?? 0,
      items: pages.map((page) => ({
        id: page.id,
        url: page.page_url,
        pageType: page.page_type,
        keyword: page.target_keyword ?? '',
        status: page.status,
        seoScore: page.seo_score,
        updatedAt: page.updated_at,
      })),
    },
    embeddings: {
      count: embeddingsResult.count ?? 0,
    },
    clusters: {
      count: clustersResult.count ?? 0,
      items: clusters.map((cluster) => ({
        id: cluster.id,
        clusterName: cluster.cluster_name,
        primaryKeyword: cluster.primary_keyword,
        relatedKeywords: cluster.related_keywords ?? [],
      })),
    },
    recommendations: {
      count: recommendationsResult.count ?? 0,
      items: recommendations.map((recommendation) => ({
        id: recommendation.id,
        recommendationType: inferRecommendationType(recommendation),
        priority: inferPriority(recommendation),
        affectedPage: pageLookupById.get(recommendation.page_id) ?? recommendation.page_id,
        createdAt: recommendation.created_at,
      })),
    },
  };
}