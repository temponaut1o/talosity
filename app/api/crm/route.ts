import { NextResponse } from 'next/server';
import { getCrmDashboardState } from '@/lib/crm/repository';

export async function GET() {
  const state = await getCrmDashboardState();
  return NextResponse.json(state);
}
