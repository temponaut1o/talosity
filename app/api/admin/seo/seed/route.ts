import { NextResponse } from 'next/server';
import { seedTalositySeo } from '@/lib/seo/seed-talosity-seo';

export const dynamic = 'force-dynamic';

export async function GET() {
  const isProduction = process.env.NODE_ENV === 'production';
  const seedEnabledRaw = process.env.SEO_PRODUCTION_SEED_ENABLED;
  const seedEnabledNormalized = seedEnabledRaw?.trim().toLowerCase() ?? '';
  const allowProductionSeed = seedEnabledRaw === 'true';
  const allowProductionSeedNormalized = seedEnabledNormalized === 'true';

  console.log('[admin/seo/seed] NODE_ENV:', process.env.NODE_ENV);
  console.log('[admin/seo/seed] SEO_PRODUCTION_SEED_ENABLED (raw):', seedEnabledRaw ?? null);
  console.log('[admin/seo/seed] SEO_PRODUCTION_SEED_ENABLED (normalized):', seedEnabledNormalized);
  console.log('[admin/seo/seed] production=%s seedEnabledStrict=%s seedEnabledNormalized=%s allowExecution=%s', isProduction, allowProductionSeed, allowProductionSeedNormalized, !(isProduction && !allowProductionSeed));

  if (isProduction && !allowProductionSeed) {
    return NextResponse.json(
      {
        blocked: true,
        reason: 'SEO_PRODUCTION_SEED_ENABLED != true (strict string match)',
        diagnostics: {
          nodeEnv: process.env.NODE_ENV ?? null,
          seedEnabledRaw: seedEnabledRaw ?? null,
          seedEnabledNormalized,
          strictEqualsTrue: allowProductionSeed,
          normalizedEqualsTrue: allowProductionSeedNormalized,
          hasOpenAIKey: Boolean(process.env.OPENAI_API_KEY),
          hasSupabaseUrl: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL),
          hasServiceRole: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY),
        },
      },
      { status: 403 },
    );
  }

  try {
    console.log('[admin/seo/seed] Seed started');
    const seeded = await seedTalositySeo();
    console.log('[admin/seo/seed] Seed completed');
    console.log('[admin/seo/seed] Rows inserted:', seeded.inserted);
    console.log('[admin/seo/seed] Embeddings generated: unknown (not returned by seedTalositySeo)');
    return NextResponse.json({
      ...seeded,
      diagnostics: {
        nodeEnv: process.env.NODE_ENV ?? null,
        seedEnabledRaw: seedEnabledRaw ?? null,
        seedEnabledNormalized,
        strictEqualsTrue: allowProductionSeed,
        normalizedEqualsTrue: allowProductionSeedNormalized,
        hasOpenAIKey: Boolean(process.env.OPENAI_API_KEY),
        hasSupabaseUrl: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL),
        hasServiceRole: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY),
      },
    });
  } catch (error) {
    console.error('[admin/seo/seed] Seed failed:', error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Unexpected error',
        diagnostics: {
          nodeEnv: process.env.NODE_ENV ?? null,
          seedEnabledRaw: seedEnabledRaw ?? null,
          seedEnabledNormalized,
          strictEqualsTrue: allowProductionSeed,
          normalizedEqualsTrue: allowProductionSeedNormalized,
          hasOpenAIKey: Boolean(process.env.OPENAI_API_KEY),
          hasSupabaseUrl: Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL),
          hasServiceRole: Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY),
        },
      },
      { status: 500 },
    );
  }
}
