import Link from 'next/link';
import { GraphEntityTable } from '@/components/crm/server/GraphEntityTable';
import { entityNameSchema } from '@/lib/crm/knowledge-graph-schemas';

export const dynamic = 'force-dynamic';

interface EntityPageProps {
  params: { entity: string };
}

export default async function GraphEntityPage({ params }: EntityPageProps) {
  const entity = entityNameSchema.parse(params.entity);

  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">{entity.split('_').join(' ')}</h1>
            <p className="mt-1 text-sm text-slate-600">Server-rendered workspace backed by crm.{entity}</p>
          </div>
          <Link href="/admin/crm/graph" className="rounded-full border border-slate-300 px-3 py-2 text-sm text-slate-700">
            Back to Graph Dashboard
          </Link>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-4">
        <h2 className="text-lg font-semibold text-slate-900">Records</h2>
        <p className="text-sm text-slate-600">Use API route /api/crm/v2/{entity} for create, update, and delete operations.</p>
        <div className="mt-4">
          <GraphEntityTable entity={entity} />
        </div>
      </section>
    </div>
  );
}
