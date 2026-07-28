import { NextResponse } from 'next/server';
import { getCrmDashboardState } from '@/lib/crm/repository';

export const dynamic = 'force-dynamic';

export async function GET() {
  const state = await getCrmDashboardState();
  return NextResponse.json(state);
}
