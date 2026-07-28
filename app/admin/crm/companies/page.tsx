import { DataTable } from '@/components/crm/DataTable';
import { EmptyState } from '@/components/crm/EmptyState';
import { StatusBadge } from '@/components/crm/StatusBadge';
import { createCompanyAction, deleteCompanyAction } from '@/app/admin/crm/actions';
import { listCompanies } from '@/lib/crm/repository';
import type { CompanyRecord } from '@/lib/crm/types';

export const dynamic = 'force-dynamic';

export default async function CompaniesPage() {
  const companies = await listCompanies();

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <h2 className="text-lg font-semibold text-slate-900">Create Company</h2>
        <form action={createCompanyAction} className="mt-3 grid gap-3 md:grid-cols-2">
          <input name="name" placeholder="Company name" required className="rounded-xl border border-slate-300 px-3 py-2 text-sm" />
          <input name="industry" placeholder="Industry" required className="rounded-xl border border-slate-300 px-3 py-2 text-sm" />
          <select name="companyType" className="rounded-xl border border-slate-300 px-3 py-2 text-sm">
            <option value="manufacturer">manufacturer</option>
            <option value="integrator">integrator</option>
            <option value="supplier">supplier</option>
            <option value="dealer">dealer</option>
            <option value="customer">customer</option>
            <option value="partner">partner</option>
          </select>
          <input name="website" placeholder="https://example.com" className="rounded-xl border border-slate-300 px-3 py-2 text-sm" />
          <input name="contactName" placeholder="Contact name" className="rounded-xl border border-slate-300 px-3 py-2 text-sm" />
          <input name="contactEmail" placeholder="Contact email" type="email" className="rounded-xl border border-slate-300 px-3 py-2 text-sm" />
          <input name="contactPhone" placeholder="Contact phone" className="rounded-xl border border-slate-300 px-3 py-2 text-sm" />
          <input name="headquarters" placeholder="Headquarters" className="rounded-xl border border-slate-300 px-3 py-2 text-sm" />
          <button type="submit" className="rounded-full bg-slate-950 px-4 py-2 text-sm font-medium text-white">Create Company</button>
        </form>
      </div>

      {companies.length === 0 ? (
        <EmptyState title="No companies found" description="Create a company to start managing manufacturers, integrators, suppliers, and partners." />
      ) : (
        <DataTable
          columns={[
            {
              key: 'company',
              header: 'Company',
              cell: (row: CompanyRecord) => (
                <div>
                  <p className="font-medium text-slate-900">{row.name}</p>
                  <p className="text-xs text-slate-500">{row.website}</p>
                </div>
              ),
            },
            { key: 'industry', header: 'Industry', cell: (row: CompanyRecord) => row.industry },
            { key: 'type', header: 'Type', cell: (row: CompanyRecord) => row.companyType },
            { key: 'status', header: 'Status', cell: (row: CompanyRecord) => <StatusBadge status={row.vendorStatus} /> },
            {
              key: 'actions',
              header: 'Actions',
              cell: (row: CompanyRecord) => (
                <form action={deleteCompanyAction}>
                  <input type="hidden" name="id" value={row.id} />
                  <button type="submit" className="rounded-full border border-rose-300 px-2 py-1 text-xs text-rose-700">Delete</button>
                </form>
              ),
            },
          ]}
          rows={companies}
        />
      )}
    </div>
  );
}
