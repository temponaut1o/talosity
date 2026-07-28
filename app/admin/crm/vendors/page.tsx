import { DataTable } from '@/components/crm/DataTable';
import { StatusBadge } from '@/components/crm/StatusBadge';
import { createVendorRequestAction, deleteVendorRequestAction, updateVendorRequestAction } from '@/app/admin/crm/actions';
import { listCompanies, listVendorRequests } from '@/lib/crm/repository';
import type { VendorRequestRecord } from '@/lib/crm/types';

export const dynamic = 'force-dynamic';

export default async function VendorsPage() {
  const [requests, companies] = await Promise.all([listVendorRequests(), listCompanies()]);
  const pendingCount = requests.filter((request) => request.status === 'pending').length;

  return (
    <div className="space-y-4">
      <section className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <h2 className="text-lg font-semibold text-slate-900">Vendor Approval Workspace</h2>
        <p className="text-sm text-slate-600">Pending approvals: {pendingCount}</p>
      </section>

      <form action={createVendorRequestAction} className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 md:grid-cols-2">
        <select name="companyId" className="rounded-xl border border-slate-300 px-3 py-2 text-sm">
          <option value="">Select company</option>
          {companies.map((company) => (
            <option key={company.id} value={company.id}>{company.name}</option>
          ))}
        </select>
        <input name="companyName" placeholder="Company name" required className="rounded-xl border border-slate-300 px-3 py-2 text-sm" />
        <select name="requestType" className="rounded-xl border border-slate-300 px-3 py-2 text-sm">
          <option value="verification">verification</option>
          <option value="claim">claim</option>
          <option value="update">update</option>
        </select>
        <button type="submit" className="rounded-full bg-slate-950 px-4 py-2 text-sm font-medium text-white">Create Vendor Request</button>
      </form>

      <DataTable
        columns={[
          { key: 'company', header: 'Company', cell: (row: VendorRequestRecord) => <span className="font-medium text-slate-900">{row.companyName}</span> },
          { key: 'type', header: 'Request Type', cell: (row: VendorRequestRecord) => row.requestType },
          { key: 'status', header: 'Verification', cell: (row: VendorRequestRecord) => <StatusBadge status={row.status} /> },
          { key: 'submitted', header: 'Submitted', cell: (row: VendorRequestRecord) => row.submittedAt },
          {
            key: 'actions',
            header: 'Actions',
            cell: (row: VendorRequestRecord) => (
              <div className="flex flex-wrap gap-2">
                <form action={updateVendorRequestAction}>
                  <input type="hidden" name="id" value={row.id} />
                  <input type="hidden" name="status" value="approved" />
                  <button type="submit" className="rounded-full border border-emerald-300 px-2 py-1 text-xs text-emerald-700">Approve</button>
                </form>
                <form action={updateVendorRequestAction}>
                  <input type="hidden" name="id" value={row.id} />
                  <input type="hidden" name="status" value="rejected" />
                  <button type="submit" className="rounded-full border border-rose-300 px-2 py-1 text-xs text-rose-700">Reject</button>
                </form>
                <form action={updateVendorRequestAction}>
                  <input type="hidden" name="id" value={row.id} />
                  <input type="hidden" name="status" value="pending" />
                  <button type="submit" className="rounded-full border border-amber-300 px-2 py-1 text-xs text-amber-700">Request Changes</button>
                </form>
                <form action={deleteVendorRequestAction}>
                  <input type="hidden" name="id" value={row.id} />
                  <button type="submit" className="rounded-full border border-slate-300 px-2 py-1 text-xs">Delete</button>
                </form>
              </div>
            ),
          },
        ]}
        rows={requests}
      />
    </div>
  );
}
