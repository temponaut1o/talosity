import { NextResponse } from 'next/server';
import { createCompany, deleteCompany, listCompanies, updateCompany } from '@/lib/crm/repository';

export async function GET() {
  const companies = await listCompanies();
  return NextResponse.json(companies);
}

export async function POST(request: Request) {
  const body = await request.json();
  const company = await createCompany(body);

  return NextResponse.json({ success: true, company });
}

export async function PATCH(request: Request) {
  const body = await request.json();
  const company = await updateCompany(String(body.id), body);
  return NextResponse.json({ success: true, company });
}

export async function DELETE(request: Request) {
  const body = await request.json();
  await deleteCompany(String(body.id));
  return NextResponse.json({ success: true });
}
