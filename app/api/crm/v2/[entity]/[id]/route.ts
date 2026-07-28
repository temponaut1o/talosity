import { NextResponse } from 'next/server';
import { ZodError, z } from 'zod';
import { entityNameSchema } from '@/lib/crm/knowledge-graph-schemas';
import { deleteRecord, getRecord, updateRecord } from '@/lib/crm/knowledge-graph-repository';

export const dynamic = 'force-dynamic';

const idSchema = z.string().uuid();

interface Params {
  params: { entity: string; id: string };
}

export async function GET(_: Request, { params }: Params) {
  try {
    const entity = entityNameSchema.parse(params.entity);
    const id = idSchema.parse(params.id);
    const record = await getRecord(entity, id);
    return NextResponse.json({ data: record });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: 'Invalid request', details: error.flatten() }, { status: 400 });
    }
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unexpected error' }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: Params) {
  try {
    const entity = entityNameSchema.parse(params.entity);
    const id = idSchema.parse(params.id);
    const payload = await request.json();
    const record = await updateRecord(entity, id, payload);
    return NextResponse.json({ data: record });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: 'Validation failed', details: error.flatten() }, { status: 400 });
    }
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unexpected error' }, { status: 500 });
  }
}

export async function DELETE(_: Request, { params }: Params) {
  try {
    const entity = entityNameSchema.parse(params.entity);
    const id = idSchema.parse(params.id);
    await deleteRecord(entity, id);
    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: 'Invalid request', details: error.flatten() }, { status: 400 });
    }
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unexpected error' }, { status: 500 });
  }
}
