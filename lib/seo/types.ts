export type SeoPageType = 'company' | 'robot' | 'industry' | 'category' | 'news' | 'landing' | 'resource';
export type SeoPageStatus = 'draft' | 'review' | 'approved' | 'published' | 'archived';
export type SeoSearchIntent = 'informational' | 'commercial' | 'transactional' | 'navigational';

export type JsonPrimitive = string | number | boolean | null;
export type JsonValue = JsonPrimitive | JsonValue[] | { [key: string]: JsonValue };

export interface SeoPageRecord {
  id: string;
  pageUrl: string;
  slug: string;
  pageType: SeoPageType;
  entityId: string | null;
  companyId: string | null;
  robotId: string | null;
  industryId: string | null;
  targetKeyword: string;
  pageContent: string;
  optimizedTitle: string;
  optimizedMetaDescription: string;
  optimizedKeywords: string[];
  schemaMarkup: JsonValue;
  seoScore: number | null;
  status: SeoPageStatus;
  searchIntent: SeoSearchIntent | null;
  createdAt: string;
  updatedAt: string;
}

export interface SeoEmbeddingRecord {
  id: string;
  pageId: string;
  model: string;
  embedding: number[];
  createdAt: string;
  updatedAt: string;
}

export interface SeoKeywordCluster {
  id: string;
  clusterName: string;
  primaryKeyword: string;
  relatedKeywords: string[];
  embedding: number[];
  createdAt: string;
}

export interface SeoRecommendation {
  id: string;
  pageId: string;
  recommendedTitle: string;
  recommendedMetaDescription: string;
  keywordGaps: string[];
  internalLinkRecommendations: JsonValue;
  contentImprovements: string;
  aiModel: string;
  createdAt: string;
}

export interface ClusterMatch {
  clusterId: string;
  clusterName: string;
  primaryKeyword: string;
  relatedKeywords: string[];
  pageId: string | null;
  pageUrl: string | null;
  pageType: SeoPageType | null;
  companyId: string | null;
  companyName: string | null;
  robotId: string | null;
  robotName: string | null;
  industryId: string | null;
  industryName: string | null;
  similarity: number;
}

export interface GenerateSeoEmbeddingInput {
  title?: string;
  targetKeyword?: string;
  companyName?: string;
  robotName?: string;
  industryName?: string;
  categoryLabel?: string;
  headings?: string[];
  pageContent?: string;
}

export interface UpsertSeoMetadataInput {
  pageUrl: string;
  slug?: string;
  pageType: SeoPageType;
  entityId?: string | null;
  companyId?: string | null;
  robotId?: string | null;
  industryId?: string | null;
  targetKeyword?: string;
  pageContent?: string;
  optimizedTitle?: string;
  optimizedMetaDescription?: string;
  optimizedKeywords?: string[];
  schemaMarkup?: JsonValue;
  seoScore?: number | null;
  status?: SeoPageStatus;
  searchIntent?: SeoSearchIntent | null;
}

export interface UpsertSeoMetadataResult {
  page: SeoPageRecord;
  embedding: SeoEmbeddingRecord | null;
  embeddingError: string | null;
}