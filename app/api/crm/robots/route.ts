import { NextResponse } from 'next/server';
import { createRobot, deleteRobot, listRobots, updateRobot } from '@/lib/crm/repository';

export async function GET() {
  const robots = await listRobots();
  return NextResponse.json(robots);
}

export async function POST(request: Request) {
  const body = await request.json();
  const robot = await createRobot(body);

  return NextResponse.json({ success: true, robot });
}

export async function PATCH(request: Request) {
  const body = await request.json();
  const robot = await updateRobot(String(body.id), body);
  return NextResponse.json({ success: true, robot });
}

export async function DELETE(request: Request) {
  const body = await request.json();
  await deleteRobot(String(body.id));
  return NextResponse.json({ success: true });
}
