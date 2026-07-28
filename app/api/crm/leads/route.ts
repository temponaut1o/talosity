import { NextResponse } from 'next/server';
import { createLead, deleteLead, listLeads, updateLead } from '@/lib/crm/repository';

export const dynamic = 'force-dynamic';

export async function GET() {
  const leads = await listLeads();
  return NextResponse.json(leads);
}

export async function POST(request: Request) {
  const body = await request.json();
  const lead = await createLead(body);

  return NextResponse.json({ success: true, lead });
}

export async function PATCH(request: Request) {
  const body = await request.json();
  const lead = await updateLead(String(body.id), body);
  return NextResponse.json({ success: true, lead });
}

export async function DELETE(request: Request) {
  const body = await request.json();
  await deleteLead(String(body.id));
  return NextResponse.json({ success: true });
}
