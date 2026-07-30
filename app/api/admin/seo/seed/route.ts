import { NextResponse } from 'next/server';
import { seedTalositySeo } from '@/lib/seo/seed-talosity-seo';

export const dynamic = 'force-dynamic';

export async function GET() {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Not Found' }, { status: 404 });
  }

  try {
    const seeded = await seedTalositySeo();
    return NextResponse.json(seeded);
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Unexpected error',
      },
      { status: 500 },
    );
  }
}
