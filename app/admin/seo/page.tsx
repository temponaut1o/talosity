import { getSeoDashboardData } from '@/lib/seo/dashboard';

export const dynamic = 'force-dynamic';

function formatDate(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) {
    return value;
  }
  return date.toISOString().slice(0, 10);
}

function getPriorityClasses(priority: 'high' | 'medium' | 'low'): string {
  if (priority === 'high') {
    return 'bg-rose-100 text-rose-700';
  }
  if (priority === 'medium') {
    return 'bg-amber-100 text-amber-700';
  }
  return 'bg-emerald-100 text-emerald-700';
}

export default async function SeoAdminPage() {
  const dashboard = await getSeoDashboardData();

  return (
    <main className="min-h-screen bg-slate-100 p-6 text-slate-900">
      <div className="mx-auto max-w-7xl space-y-6">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Talosity Enterprise</p>
          <h1 className="mt-2 text-3xl font-semibold">SEO Intelligence Workspace</h1>
          <p className="mt-2 text-sm text-slate-600">Operational visibility for SEO pages, embeddings, clusters, and AI recommendations.</p>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-sm text-slate-600">SEO Pages</p>
            <p className="mt-2 text-2xl font-semibold text-slate-950">{dashboard.pages.count}</p>
          </article>
          <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-sm text-slate-600">Embeddings</p>
            <p className="mt-2 text-2xl font-semibold text-slate-950">{dashboard.embeddings.count}</p>
          </article>
          <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-sm text-slate-600">Keyword Clusters</p>
            <p className="mt-2 text-2xl font-semibold text-slate-950">{dashboard.clusters.count}</p>
          </article>
          <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <p className="text-sm text-slate-600">Recommendations</p>
            <p className="mt-2 text-2xl font-semibold text-slate-950">{dashboard.recommendations.count}</p>
          </article>
        </section>

        <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <h2 className="text-lg font-semibold text-slate-900">SEO Pages</h2>
          <div className="mt-4 overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-200 text-sm">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-3 py-2 text-left font-medium text-slate-600">URL</th>
                  <th className="px-3 py-2 text-left font-medium text-slate-600">Page Type</th>
                  <th className="px-3 py-2 text-left font-medium text-slate-600">Keyword</th>
                  <th className="px-3 py-2 text-left font-medium text-slate-600">Status</th>
                  <th className="px-3 py-2 text-left font-medium text-slate-600">SEO Score</th>
                  <th className="px-3 py-2 text-left font-medium text-slate-600">Updated</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {dashboard.pages.items.length === 0 ? (
                  <tr>
                    <td className="px-3 py-4 text-slate-500" colSpan={6}>No SEO pages found.</td>
                  </tr>
                ) : (
                  dashboard.pages.items.map((page) => (
                    <tr key={page.id}>
                      <td className="px-3 py-2 text-slate-800">{page.url}</td>
                      <td className="px-3 py-2 text-slate-700">{page.pageType}</td>
                      <td className="px-3 py-2 text-slate-700">{page.keyword || '-'}</td>
                      <td className="px-3 py-2 text-slate-700">{page.status}</td>
                      <td className="px-3 py-2 text-slate-700">{page.seoScore ?? '-'}</td>
                      <td className="px-3 py-2 text-slate-700">{formatDate(page.updatedAt)}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>

        <section className="grid gap-4 lg:grid-cols-2">
          <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Keyword Clusters</h2>
            <div className="mt-3 space-y-3">
              {dashboard.clusters.items.length === 0 ? (
                <p className="text-sm text-slate-500">No keyword clusters found.</p>
              ) : (
                dashboard.clusters.items.map((cluster) => (
                  <div key={cluster.id} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                    <p className="text-sm font-semibold text-slate-900">{cluster.clusterName}</p>
                    <p className="mt-1 text-sm text-slate-700">Primary keyword: {cluster.primaryKeyword}</p>
                    <p className="mt-1 text-sm text-slate-600">Related: {cluster.relatedKeywords.length > 0 ? cluster.relatedKeywords.join(', ') : '-'}</p>
                  </div>
                ))
              )}
            </div>
          </article>

          <article className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">Recommendations</h2>
            <div className="mt-3 space-y-3">
              {dashboard.recommendations.items.length === 0 ? (
                <p className="text-sm text-slate-500">No recommendations found.</p>
              ) : (
                dashboard.recommendations.items.map((recommendation) => (
                  <div key={recommendation.id} className="rounded-xl border border-slate-200 bg-slate-50 p-3">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-medium capitalize text-slate-900">{recommendation.recommendationType}</p>
                      <span className={`rounded-full px-2 py-1 text-xs font-semibold uppercase ${getPriorityClasses(recommendation.priority)}`}>
                        {recommendation.priority}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-slate-700">Affected page: {recommendation.affectedPage}</p>
                    <p className="mt-1 text-xs text-slate-500">Created: {formatDate(recommendation.createdAt)}</p>
                  </div>
                ))
              )}
            </div>
          </article>
        </section>
      </div>
    </main>
  );
}