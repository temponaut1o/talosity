'use client';

import { useMemo, useState } from 'react';
import { DataTable } from '@/components/crm/DataTable';
import { StatusBadge } from '@/components/crm/StatusBadge';
import { getCrmDashboardState } from '@/lib/crm/data';
import type { VendorRequestRecord } from '@/lib/crm/types';

export default function VendorsPage() {
  const [requests, setRequests] = useState<VendorRequestRecord[]>(() => getCrmDashboardState().vendorRequests);
  const pendingCount = useMemo(() => requests.filter((request) => request.status === 'pending').length, [requests]);

  const setStatus = (id: string, status: VendorRequestRecord['status']) => {
    setRequests((prev) => prev.map((request) => (request.id === id ? { ...request, status } : request)));
  };

  return (
    <div className="space-y-4">
      <section className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <h2 className="text-lg font-semibold text-slate-900">Vendor Approval Workspace</h2>
        <p className="text-sm text-slate-600">Pending approvals: {pendingCount}</p>
      </section>

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
                <button onClick={() => setStatus(row.id, 'approved')} className="rounded-full border border-emerald-300 px-2 py-1 text-xs text-emerald-700">Approve</button>
                <button onClick={() => setStatus(row.id, 'rejected')} className="rounded-full border border-rose-300 px-2 py-1 text-xs text-rose-700">Reject</button>
                <button onClick={() => setStatus(row.id, 'pending')} className="rounded-full border border-amber-300 px-2 py-1 text-xs text-amber-700">Request Changes</button>
                <button className="rounded-full border border-slate-300 px-2 py-1 text-xs">View Profile</button>
              </div>
            ),
          },
        ]}
        rows={requests}
      />
    </div>
  );
}
