import { NextResponse } from 'next/server';
import { createVendorRequest, deleteVendorRequest, listVendorRequests, updateVendorRequest } from '@/lib/crm/repository';

export async function GET() {
  const requests = await listVendorRequests();
  return NextResponse.json(requests);
}

export async function POST(request: Request) {
  const body = await request.json();
  const vendorRequest = await createVendorRequest(body);
  return NextResponse.json({ success: true, vendorRequest });
}

export async function PATCH(request: Request) {
  const body = await request.json();
  const vendorRequest = await updateVendorRequest(String(body.id), body);
  return NextResponse.json({ success: true, vendorRequest });
}

export async function DELETE(request: Request) {
  const body = await request.json();
  await deleteVendorRequest(String(body.id));
  return NextResponse.json({ success: true });
}
