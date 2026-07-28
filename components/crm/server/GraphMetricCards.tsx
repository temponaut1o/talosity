import { KNOWLEDGE_GRAPH_ENTITIES } from '@/lib/crm/knowledge-graph-types';
import { getSupabaseServerClient } from '@/lib/supabase/server';

export async function GraphMetricCards() {
  const supabase = getSupabaseServerClient();

  if (!supabase) {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
        Supabase environment variables are missing. Configure NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.
      </div>
    );
  }

  const counters = await Promise.all(
    KNOWLEDGE_GRAPH_ENTITIES.map(async (entity) => {
      const { count } = await supabase.from(`crm.${entity}`).select('*', { count: 'exact', head: true });
      return { entity, count: count ?? 0 };
    }),
  );

  return (
    <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {counters.map((counter) => (
        <article key={counter.entity} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p className="text-xs uppercase tracking-[0.2em] text-slate-500">{counter.entity.split('_').join(' ')}</p>
          <p className="mt-2 text-2xl font-semibold text-slate-900">{counter.count}</p>
        </article>
      ))}
    </section>
  );
}
