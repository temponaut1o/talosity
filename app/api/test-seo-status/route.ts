import { NextResponse } from 'next/server';
import { getSupabaseServerAdminClient } from '@/lib/supabase/server-admin';

export const dynamic = 'force-dynamic';

// REMOVE OR PROTECT BEFORE PRODUCTION
export async function GET() {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Not Found' }, { status: 404 });
  }

  try {
    const supabase = getSupabaseServerAdminClient();

    const [{ count: seoPages, error: pagesError }, { count: embeddings, error: embeddingsError }] = await Promise.all([
      supabase.from('seo_pages').select('*', { count: 'exact', head: true }),
      supabase.from('seo_embeddings').select('*', { count: 'exact', head: true }),
    ]);

    if (pagesError) {
      throw new Error(`Failed to query seo_pages: ${pagesError.message}`);
    }

    if (embeddingsError) {
      throw new Error(`Failed to query seo_embeddings: ${embeddingsError.message}`);
    }

    return NextResponse.json({
      seoPages: seoPages ?? 0,
      embeddings: embeddings ?? 0,
    });
  } catch (error) {
    console.error('[test-seo-status] failed', {
      message: error instanceof Error ? error.message : 'Unknown error',
    });

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 },
    );
  }
}