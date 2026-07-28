import { NextResponse } from 'next/server';
import { createLeadRecord, getCrmDashboardState } from '@/lib/crm/data';

export async function GET() {
  return NextResponse.json(getCrmDashboardState().leads);
}

export async function POST(request: Request) {
  const body = await request.json();
  const lead = createLeadRecord({
    name: body.name,
    company: body.company,
    email: body.email,
    phone: body.phone,
    industry: body.industry,
    robotInterest: body.robotInterest,
    facilitySize: body.facilitySize,
    deploymentTimeline: body.deploymentTimeline,
    budgetRange: body.budgetRange,
    status: body.status,
  });

  return NextResponse.json({ success: true, lead });
}
