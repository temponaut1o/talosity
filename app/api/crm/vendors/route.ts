import { NextResponse } from 'next/server';
import { getCrmDashboardState } from '@/lib/crm/data';

export async function GET() {
  return NextResponse.json(getCrmDashboardState().vendorRequests);
}
