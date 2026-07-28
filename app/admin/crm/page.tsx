import Link from 'next/link';
import { MetricCard } from '@/components/crm/MetricCard';
import { StatusBadge } from '@/components/crm/StatusBadge';
import { getCrmDashboardState } from '@/lib/crm/repository';

export const dynamic = 'force-dynamic';

export default async function CrmDashboardPage() {
  const state = await getCrmDashboardState();

  const cards = [
    { label: 'Companies', value: state.metrics.totalCompanies },
    { label: 'Robots', value: state.metrics.totalRobots },
    { label: 'Leads', value: state.metrics.totalLeads },
    { label: 'Opportunities', value: state.opportunities.length },
    { label: 'Partners', value: state.metrics.totalVendors },
  ];

  const actions = [
    { href: '/admin/crm/companies/new', label: 'Add Company' },
    { href: '/admin/crm/robots/new', label: 'Add Robot' },
    { href: '/admin/crm/leads', label: 'Create Lead' },
    { href: '/admin/crm/opportunities', label: 'Create Opportunity' },
  ];

  return (
    <div className="space-y-6">
      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {cards.map((card) => (
          <MetricCard key={card.label} label={card.label} value={card.value} />
        ))}
      </section>

      <section className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <h3 className="text-base font-semibold text-slate-900">Quick Actions</h3>
        <div className="mt-3 flex flex-wrap gap-3">
          {actions.map((action) => (
            <Link key={action.href} href={action.href} className="rounded-full bg-slate-950 px-4 py-2 text-sm font-medium text-white">
              {action.label}
            </Link>
          ))}
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <article className="rounded-2xl border border-slate-200 p-4">
          <h3 className="text-base font-semibold text-slate-900">Recent Activity</h3>
          <ul className="mt-3 space-y-2">
            {state.vendorRequests.map((item) => (
              <li key={item.id} className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm">
                <div>
                  <p className="font-medium text-slate-900">{item.companyName}</p>
                  <p className="text-slate-600">{item.requestType} submitted {item.submittedAt}</p>
                </div>
                <StatusBadge status={item.status} />
              </li>
            ))}
          </ul>
        </article>

        <article className="rounded-2xl border border-slate-200 p-4">
          <h3 className="text-base font-semibold text-slate-900">Open Opportunities</h3>
          <ul className="mt-3 space-y-2">
            {state.opportunities.map((item) => (
              <li key={item.id} className="rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm">
                <p className="font-medium text-slate-900">{item.companyName}</p>
                <p className="text-slate-600">{item.robotInterest}</p>
                <p className="text-slate-500">{item.estimatedValue} | {item.nextAction}</p>
              </li>
            ))}
          </ul>
        </article>
      </section>
    </div>
  );
}
