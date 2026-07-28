import { NextResponse } from 'next/server';
import { createRobotRecord, getCrmDashboardState } from '@/lib/crm/data';

export async function GET() {
  return NextResponse.json(getCrmDashboardState().robots);
}

export async function POST(request: Request) {
  const body = await request.json();

  const robot = createRobotRecord({
    name: body.name,
    manufacturer: body.manufacturer,
    modelNumber: body.modelNumber,
    category: body.category,
    industry: body.industry,
    applications: Array.isArray(body.applications) ? body.applications : [],
    payload: body.payload,
    speed: body.speed,
    aiCapabilities: Array.isArray(body.aiCapabilities) ? body.aiCapabilities : [],
    safetyCertifications: Array.isArray(body.safetyCertifications) ? body.safetyCertifications : [],
    supportIncluded: Boolean(body.supportIncluded),
  });

  return NextResponse.json({ success: true, robot });
}
