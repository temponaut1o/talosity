import Link from 'next/link';
import { countTable } from '@/lib/crm/repository';

const workspaces = [
  { href: '/admin/crm', label: 'Dashboard', description: 'Operational CRM metrics and pipeline visibility.' },
  { href: '/admin/crm', label: 'CRM', description: 'Companies, robots, leads, opportunities, and vendor workflows.' },
  { href: '/admin/crm/graph', label: 'Knowledge Graph', description: 'Entity relationships and graph-backed records.' },
  { href: '/admin/crm/analytics', label: 'Analytics', description: 'Commercial intelligence snapshots and trends.' },
  { href: '/admin/crm/settings', label: 'Settings', description: 'Role controls, governance, and platform configuration.' },
  { href: '/admin', label: 'System', description: 'Enterprise admin workspace root and health checks.' },
];

export default async function AdminWorkspacePage() {
  const [companies, robots, leads, partners] = await Promise.all([
    countTable('companies'),
    countTable('robots'),
    countTable('leads'),
    countTable('deployment_partners'),
  ]);

  return (
    <main className="min-h-screen bg-slate-100 p-6 text-slate-900">
      <div className="mx-auto max-w-6xl space-y-6">
        <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Talosity Enterprise</p>
          <h1 className="mt-2 text-3xl font-semibold">Admin Workspace</h1>
          <p className="mt-2 text-sm text-slate-600">
            Production operations for the Talosity commercial robotics intelligence platform.
          </p>
        </section>

        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <article className="rounded-2xl border border-slate-200 bg-white p-4">
            <p className="text-sm text-slate-600">Companies</p>
            <p className="mt-1 text-2xl font-semibold">{companies}</p>
          </article>
          <article className="rounded-2xl border border-slate-200 bg-white p-4">
            <p className="text-sm text-slate-600">Robots</p>
            <p className="mt-1 text-2xl font-semibold">{robots}</p>
          </article>
          <article className="rounded-2xl border border-slate-200 bg-white p-4">
            <p className="text-sm text-slate-600">Leads</p>
            <p className="mt-1 text-2xl font-semibold">{leads}</p>
          </article>
          <article className="rounded-2xl border border-slate-200 bg-white p-4">
            <p className="text-sm text-slate-600">Deployment Partners</p>
            <p className="mt-1 text-2xl font-semibold">{partners}</p>
          </article>
        </section>

        <section className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {workspaces.map((workspace) => (
            <Link
              key={workspace.label}
              href={workspace.href}
              className="rounded-2xl border border-slate-200 bg-white p-4 transition hover:border-slate-400"
            >
              <h2 className="text-lg font-semibold text-slate-900">{workspace.label}</h2>
              <p className="mt-1 text-sm text-slate-600">{workspace.description}</p>
            </Link>
          ))}
        </section>
      </div>
    </main>
  );
}
