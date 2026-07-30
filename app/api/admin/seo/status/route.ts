import { NextResponse } from 'next/server';
import { getSupabaseServerAdminClient } from '@/lib/supabase/server-admin';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const supabase = getSupabaseServerAdminClient();

    const [{ count: seoPagesCount, error: pagesError }, { count: embeddingsCount, error: embeddingsError }] = await Promise.all([
      supabase.from('seo_pages').select('*', { count: 'exact', head: true }),
      supabase.from('seo_embeddings').select('*', { count: 'exact', head: true }),
    ]);

    if (pagesError) {
      console.error('[seo-status] Supabase error loading seo_pages count', {
        message: pagesError.message,
      });
      throw new Error(`Failed to count seo_pages: ${pagesError.message}`);
    }

    if (embeddingsError) {
      console.error('[seo-status] Supabase error loading seo_embeddings count', {
        message: embeddingsError.message,
      });
      throw new Error(`Failed to count seo_embeddings: ${embeddingsError.message}`);
    }

    return NextResponse.json({
      seoPagesCount: seoPagesCount ?? 0,
      embeddingsCount: embeddingsCount ?? 0,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Unexpected error',
      },
      { status: 500 },
    );
  }
}
