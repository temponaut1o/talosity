import Link from 'next/link';
import { GraphMetricCards } from '@/components/crm/server/GraphMetricCards';
import { KNOWLEDGE_GRAPH_ENTITIES } from '@/lib/crm/knowledge-graph-types';

export const dynamic = 'force-dynamic';

export default async function GraphDashboardPage() {
  return (
    <div className="space-y-6">
      <section className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <h1 className="text-2xl font-semibold text-slate-900">CRM Knowledge Graph</h1>
        <p className="mt-1 text-sm text-slate-600">
          Normalized relational graph for companies, robots, certifications, relationships, and CRM activities.
        </p>
      </section>

      <GraphMetricCards />

      <section className="rounded-2xl border border-slate-200 bg-white p-4">
        <h2 className="text-lg font-semibold text-slate-900">Entity Workspaces</h2>
        <div className="mt-3 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {KNOWLEDGE_GRAPH_ENTITIES.map((entity) => (
            <Link
              key={entity}
              href={`/admin/crm/graph/${entity}`}
              className="rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700 hover:bg-slate-100"
            >
              {entity.split('_').join(' ')}
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
