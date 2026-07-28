import Link from 'next/link';
import { DataTable } from '@/components/crm/DataTable';
import { EmptyState } from '@/components/crm/EmptyState';
import { StatusBadge } from '@/components/crm/StatusBadge';
import { createLeadAction, deleteLeadAction, updateLeadStatusAction } from '@/app/admin/crm/actions';
import { listCompanies, listLeads } from '@/lib/crm/repository';
import type { LeadRecord } from '@/lib/crm/types';

export const dynamic = 'force-dynamic';

const leadStatuses = ['new', 'contacted', 'qualified', 'vendor-matched', 'proposal', 'closed-won', 'closed-lost'];

export default async function LeadsPage() {
  const [leads, companies] = await Promise.all([listLeads(), listCompanies()]);

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <h2 className="text-lg font-semibold text-slate-900">Create Lead</h2>
        <form action={createLeadAction} className="mt-3 grid gap-3 md:grid-cols-2">
          <input name="name" placeholder="Lead name" required className="rounded-xl border border-slate-300 px-3 py-2 text-sm" />
          <select name="companyId" className="rounded-xl border border-slate-300 px-3 py-2 text-sm">
            <option value="">Select company</option>
            {companies.map((company) => (
              <option key={company.id} value={company.id}>{company.name}</option>
            ))}
          </select>
          <input name="company" placeholder="Company name (optional override)" className="rounded-xl border border-slate-300 px-3 py-2 text-sm" />
          <input name="email" placeholder="Email" type="email" required className="rounded-xl border border-slate-300 px-3 py-2 text-sm" />
          <input name="phone" placeholder="Phone" className="rounded-xl border border-slate-300 px-3 py-2 text-sm" />
          <input name="industry" placeholder="Industry" className="rounded-xl border border-slate-300 px-3 py-2 text-sm" />
          <input name="robotInterest" placeholder="Robot interest" className="rounded-xl border border-slate-300 px-3 py-2 text-sm" />
          <input name="facilitySize" placeholder="Facility size" className="rounded-xl border border-slate-300 px-3 py-2 text-sm" />
          <input name="deploymentTimeline" placeholder="Deployment timeline" className="rounded-xl border border-slate-300 px-3 py-2 text-sm" />
          <input name="budgetRange" placeholder="Budget range" className="rounded-xl border border-slate-300 px-3 py-2 text-sm" />
          <button type="submit" className="rounded-full bg-slate-950 px-4 py-2 text-sm font-medium text-white">Create Lead</button>
        </form>
      </div>

      {leads.length === 0 ? (
        <EmptyState title="No leads available" description="Create leads to begin qualification and vendor matching." />
      ) : (
        <DataTable
          columns={[
            {
              key: 'lead',
              header: 'Lead',
              cell: (row: LeadRecord) => (
                <div>
                  <Link href={`/admin/crm/leads/${row.id}`} className="font-medium text-slate-900 hover:underline">
                    {row.name}
                  </Link>
                  <p className="text-xs text-slate-500">{row.email}</p>
                </div>
              ),
            },
            { key: 'company', header: 'Company', cell: (row: LeadRecord) => row.company },
            { key: 'industry', header: 'Industry', cell: (row: LeadRecord) => row.industry },
            { key: 'interest', header: 'Robot Interest', cell: (row: LeadRecord) => row.robotInterest },
            {
              key: 'status',
              header: 'Status',
              cell: (row: LeadRecord) => (
                <form action={updateLeadStatusAction} className="space-y-2">
                  <input type="hidden" name="id" value={row.id} />
                  <StatusBadge status={row.status} />
                  <select
                    name="status"
                    value={row.status}
                    className="w-full rounded-lg border border-slate-300 px-2 py-1 text-xs"
                    onChange={(event) => event.currentTarget.form?.requestSubmit()}
                  >
                    {leadStatuses.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                  </form>
              ),
            },
            {
              key: 'actions',
              header: 'Actions',
              cell: (row: LeadRecord) => (
                <div className="flex flex-wrap gap-2">
                    <form action={deleteLeadAction}>
                      <input type="hidden" name="id" value={row.id} />
                      <button type="submit" className="rounded-full border border-rose-300 px-2 py-1 text-xs text-rose-700">Delete</button>
                    </form>
                </div>
              ),
            },
          ]}
            rows={leads}
        />
      )}
    </div>
  );
}
