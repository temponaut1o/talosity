import { NextResponse } from 'next/server';
import { ZodError } from 'zod';
import { entityNameSchema } from '@/lib/crm/knowledge-graph-schemas';
import { createRecord, listRecords } from '@/lib/crm/knowledge-graph-repository';

export const dynamic = 'force-dynamic';

interface Params {
  params: { entity: string };
}

export async function GET(request: Request, { params }: Params) {
  try {
    const entity = entityNameSchema.parse(params.entity);
    const url = new URL(request.url);
    const result = await listRecords(entity, url.searchParams);
    return NextResponse.json(result);
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: 'Invalid entity or query', details: error.flatten() }, { status: 400 });
    }
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unexpected error' }, { status: 500 });
  }
}

export async function POST(request: Request, { params }: Params) {
  try {
    const entity = entityNameSchema.parse(params.entity);
    const payload = await request.json();
    const created = await createRecord(entity, payload);
    return NextResponse.json({ data: created }, { status: 201 });
  } catch (error) {
    if (error instanceof ZodError) {
      return NextResponse.json({ error: 'Validation failed', details: error.flatten() }, { status: 400 });
    }
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Unexpected error' }, { status: 500 });
  }
}
