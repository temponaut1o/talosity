import { NextResponse } from 'next/server';
import { getSeoDashboardData } from '@/lib/seo/dashboard';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const data = await getSeoDashboardData();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : 'Unexpected error',
      },
      { status: 500 },
    );
  }
}