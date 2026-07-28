import { DataTable } from '@/components/crm/DataTable';
import { StatusBadge } from '@/components/crm/StatusBadge';
import { createCommunicationAction } from '@/app/admin/crm/actions';
import { listCommunications } from '@/lib/crm/repository';
import type { CommunicationRecord } from '@/lib/crm/types';

export const dynamic = 'force-dynamic';

export default async function CommunicationsPage() {
  const items = await listCommunications();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Communications Timeline</h2>
          <p className="text-sm text-slate-600">Track emails, notes, calls, meetings, and follow-ups across CRM records.</p>
        </div>
      </div>

      <form action={createCommunicationAction} className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 md:grid-cols-2">
        <select name="channel" className="rounded-xl border border-slate-300 px-3 py-2 text-sm">
          <option value="email">email</option>
          <option value="note">note</option>
          <option value="call">call</option>
          <option value="meeting">meeting</option>
          <option value="task">task</option>
        </select>
        <input name="subject" placeholder="Subject" required className="rounded-xl border border-slate-300 px-3 py-2 text-sm" />
        <select name="relatedType" className="rounded-xl border border-slate-300 px-3 py-2 text-sm">
          <option value="Lead">Lead</option>
          <option value="Company">Company</option>
          <option value="Opportunity">Opportunity</option>
          <option value="Vendor">Vendor</option>
        </select>
        <input name="relatedName" placeholder="Related name" required className="rounded-xl border border-slate-300 px-3 py-2 text-sm" />
        <input name="followUp" type="date" className="rounded-xl border border-slate-300 px-3 py-2 text-sm" />
        <button type="submit" className="rounded-full bg-slate-950 px-4 py-2 text-sm font-medium text-white">Log Communication</button>
      </form>

      <DataTable
        columns={[
          { key: 'channel', header: 'Channel', cell: (row: CommunicationRecord) => <StatusBadge status={row.channel} /> },
          { key: 'subject', header: 'Subject', cell: (row: CommunicationRecord) => <span className="font-medium text-slate-900">{row.subject}</span> },
          { key: 'related', header: 'Related Record', cell: (row: CommunicationRecord) => `${row.relatedType}: ${row.relatedName}` },
          { key: 'follow', header: 'Follow-up', cell: (row: CommunicationRecord) => row.followUp },
          {
            key: 'actions',
            header: 'Actions',
            cell: () => <span className="text-xs text-slate-500">Managed from timeline actions</span>,
          },
        ]}
        rows={items}
      />
    </div>
  );
}
