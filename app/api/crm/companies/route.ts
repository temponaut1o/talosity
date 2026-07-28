import { NextResponse } from 'next/server';
import { createCompanyRecord, getCrmDashboardState } from '@/lib/crm/data';

export async function GET() {
  return NextResponse.json(getCrmDashboardState().companies);
}

export async function POST(request: Request) {
  const body = await request.json();

  const company = createCompanyRecord({
    name: body.name,
    companyType: body.companyType,
    industry: body.industry,
    website: body.website,
    contactName: body.contactName,
    contactEmail: body.contactEmail,
    contactPhone: body.contactPhone,
    vendorStatus: body.vendorStatus ?? 'pending',
    profileStatus: body.profileStatus ?? 'draft',
    headquarters: body.headquarters ?? body.country ?? 'Unknown',
    foundedYear: Number(body.foundedYear ?? new Date().getFullYear()),
    annualRevenue: body.annualRevenue ?? 'Undisclosed',
  });

  return NextResponse.json({ success: true, company });
}
