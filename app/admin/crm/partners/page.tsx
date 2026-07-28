import { createDeploymentPartnerAction, deleteDeploymentPartnerAction } from '@/app/admin/crm/actions';
import { DataTable } from '@/components/crm/DataTable';
import { EmptyState } from '@/components/crm/EmptyState';
import { listCompanies, listDeploymentPartners } from '@/lib/crm/repository';
import type { DeploymentPartnerRecord } from '@/lib/crm/types';

export default async function PartnersPage() {
  const [partners, companies] = await Promise.all([listDeploymentPartners(), listCompanies()]);

  return (
    <div className="space-y-4">
      <section className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <h2 className="text-lg font-semibold text-slate-900">Deployment Partners</h2>
        <p className="text-sm text-slate-600">Manage service partners linked to manufacturers, integrators, and supplier networks.</p>
      </section>

      <form action={createDeploymentPartnerAction} className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 md:grid-cols-2">
        <select name="companyId" required className="rounded-xl border border-slate-300 px-3 py-2 text-sm">
          <option value="">Select company</option>
          {companies.map((company) => (
            <option key={company.id} value={company.id}>{company.name}</option>
          ))}
        </select>
        <input name="name" required placeholder="Partner name" className="rounded-xl border border-slate-300 px-3 py-2 text-sm" />
        <input name="serviceRegion" placeholder="Service region" className="rounded-xl border border-slate-300 px-3 py-2 text-sm" />
        <button type="submit" className="rounded-full bg-slate-950 px-4 py-2 text-sm font-medium text-white">Create Partner</button>
      </form>

      {partners.length === 0 ? (
        <EmptyState title="No deployment partners" description="Create partners to connect robots with implementation providers." />
      ) : (
        <DataTable
          columns={[
            { key: 'name', header: 'Partner', cell: (row: DeploymentPartnerRecord) => row.name },
            { key: 'company', header: 'Company', cell: (row: DeploymentPartnerRecord) => row.companyName },
            { key: 'region', header: 'Service Region', cell: (row: DeploymentPartnerRecord) => row.serviceRegion },
            {
              key: 'actions',
              header: 'Actions',
              cell: (row: DeploymentPartnerRecord) => (
                <form action={deleteDeploymentPartnerAction}>
                  <input type="hidden" name="id" value={row.id} />
                  <button type="submit" className="rounded-full border border-rose-300 px-2 py-1 text-xs text-rose-700">Delete</button>
                </form>
              ),
            },
          ]}
          rows={partners}
        />
      )}
    </div>
  );
}
