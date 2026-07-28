import { DataTable } from '@/components/crm/DataTable';
import { EmptyState } from '@/components/crm/EmptyState';
import { createRobotAction, deleteRobotAction } from '@/app/admin/crm/actions';
import { listCompanies, listRobots } from '@/lib/crm/repository';
import type { RobotRecord } from '@/lib/crm/types';

export const dynamic = 'force-dynamic';

export default async function RobotsPage() {
  const [robots, companies] = await Promise.all([listRobots(), listCompanies()]);

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <h2 className="text-lg font-semibold text-slate-900">Create Robot</h2>
        <form action={createRobotAction} className="mt-3 grid gap-3 md:grid-cols-2">
          <select name="companyId" required className="rounded-xl border border-slate-300 px-3 py-2 text-sm">
            <option value="">Select company</option>
            {companies.map((company) => (
              <option key={company.id} value={company.id}>{company.name}</option>
            ))}
          </select>
          <input name="name" placeholder="Robot name" required className="rounded-xl border border-slate-300 px-3 py-2 text-sm" />
          <input name="modelNumber" placeholder="Model number" className="rounded-xl border border-slate-300 px-3 py-2 text-sm" />
          <input name="category" placeholder="Category" required className="rounded-xl border border-slate-300 px-3 py-2 text-sm" />
          <input name="industry" placeholder="Industry" className="rounded-xl border border-slate-300 px-3 py-2 text-sm" />
          <input name="payload" placeholder="Payload" className="rounded-xl border border-slate-300 px-3 py-2 text-sm" />
          <input name="speed" placeholder="Runtime / speed" className="rounded-xl border border-slate-300 px-3 py-2 text-sm" />
          <input name="applications" placeholder="Applications (comma separated)" className="rounded-xl border border-slate-300 px-3 py-2 text-sm" />
          <input name="aiCapabilities" placeholder="AI capabilities (comma separated)" className="rounded-xl border border-slate-300 px-3 py-2 text-sm" />
          <input name="safetyCertifications" placeholder="Safety certifications (comma separated)" className="rounded-xl border border-slate-300 px-3 py-2 text-sm" />
          <button type="submit" className="rounded-full bg-slate-950 px-4 py-2 text-sm font-medium text-white">Create Robot</button>
        </form>
      </div>

      {robots.length === 0 ? (
        <EmptyState title="No robots found" description="Create a new robot profile to populate the catalog." />
      ) : (
        <DataTable
          columns={[
            {
              key: 'robot',
              header: 'Robot',
              cell: (row: RobotRecord) => (
                <div>
                  <p className="font-medium text-slate-900">{row.name}</p>
                  <p className="text-xs text-slate-500">{row.modelNumber}</p>
                </div>
              ),
            },
            { key: 'manufacturer', header: 'Manufacturer', cell: (row: RobotRecord) => row.manufacturer },
            { key: 'category', header: 'Category', cell: (row: RobotRecord) => row.category },
            { key: 'payload', header: 'Payload', cell: (row: RobotRecord) => row.payload },
            {
              key: 'actions',
              header: 'Actions',
              cell: (row: RobotRecord) => (
                <form action={deleteRobotAction}>
                  <input type="hidden" name="id" value={row.id} />
                  <button type="submit" className="rounded-full border border-rose-300 px-2 py-1 text-xs text-rose-700">Delete</button>
                </form>
              ),
            },
          ]}
          rows={robots}
        />
      )}
    </div>
  );
}
