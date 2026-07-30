'use client';

import { useCallback, useEffect, useState } from 'react';
import { createSupabaseBrowserClient } from '@/lib/supabase/client';
import type { JsonValue, SeoPageRecord } from '@/lib/seo/types';

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

export function useRealtimeSeoPages() {
  const [records, setRecords] = useState<SeoPageRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refresh = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const supabase = createSupabaseBrowserClient();
      const { data, error: queryError } = await supabase.from('seo_pages').select('*').order('updated_at', { ascending: false });

      if (queryError) {
        throw queryError;
      }

      setRecords(((data ?? []) as SeoPageRow[]).map(toSeoPageRecord));
    } catch (refreshError) {
      setError(refreshError instanceof Error ? refreshError.message : 'Unable to load SEO pages.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const supabase = createSupabaseBrowserClient();
    void refresh();

    const channel = supabase
      .channel('public:seo_pages')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'seo_pages' },
        () => {
          void refresh();
        },
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [refresh]);

  return {
    records,
    loading,
    error,
    refresh,
  };
}