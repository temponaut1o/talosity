'use client';

import { useState } from 'react';
import { DataTable } from '@/components/crm/DataTable';
import { FormModal } from '@/components/crm/FormModal';
import { StatusBadge } from '@/components/crm/StatusBadge';

interface CommunicationItem {
  id: string;
  channel: string;
  subject: string;
  relatedType: 'Lead' | 'Company' | 'Opportunity' | 'Vendor';
  relatedName: string;
  followUp: string;
}

const seed: CommunicationItem[] = [
  {
    id: 'comm-001',
    channel: 'Email',
    subject: 'Follow-up with Harborview Medical',
    relatedType: 'Lead',
    relatedName: 'Priya Nair',
    followUp: '2026-07-30',
  },
  {
    id: 'comm-002',
    channel: 'Call',
    subject: 'Vendor verification review',
    relatedType: 'Vendor',
    relatedName: 'Kinetic Fabrication',
    followUp: '2026-07-29',
  },
];

export default function CommunicationsPage() {
  const [items, setItems] = useState<CommunicationItem[]>(seed);
  const [showAdd, setShowAdd] = useState(false);

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <div>
          <h2 className="text-lg font-semibold text-slate-900">Communications Timeline</h2>
          <p className="text-sm text-slate-600">Track emails, notes, calls, meetings, and follow-ups across CRM records.</p>
        </div>
        <button onClick={() => setShowAdd(true)} className="rounded-full bg-slate-950 px-4 py-2 text-sm font-medium text-white">
          Log Communication
        </button>
      </div>

      <DataTable
        columns={[
          { key: 'channel', header: 'Channel', cell: (row: CommunicationItem) => <StatusBadge status={row.channel} /> },
          { key: 'subject', header: 'Subject', cell: (row: CommunicationItem) => <span className="font-medium text-slate-900">{row.subject}</span> },
          { key: 'related', header: 'Related Record', cell: (row: CommunicationItem) => `${row.relatedType}: ${row.relatedName}` },
          { key: 'follow', header: 'Follow-up', cell: (row: CommunicationItem) => row.followUp },
          {
            key: 'actions',
            header: 'Actions',
            cell: () => (
              <div className="flex gap-2">
                <button className="rounded-full border border-slate-300 px-2 py-1 text-xs">View</button>
                <button className="rounded-full border border-slate-300 px-2 py-1 text-xs">Add Follow-up</button>
              </div>
            ),
          },
        ]}
        rows={items}
      />

      <FormModal
        open={showAdd}
        title="Log Communication"
        submitLabel="Save"
        onCancel={() => setShowAdd(false)}
        fields={[
          { name: 'channel', label: 'Channel', type: 'select', required: true, options: ['Email', 'Note', 'Call', 'Meeting'] },
          { name: 'subject', label: 'Subject', required: true },
          { name: 'relatedType', label: 'Related Type', type: 'select', required: true, options: ['Lead', 'Company', 'Opportunity', 'Vendor'] },
          { name: 'relatedName', label: 'Related Name', required: true },
          { name: 'followUp', label: 'Follow-up Date', required: true },
        ]}
        onSubmit={async (values) => {
          setItems((prev) => [
            {
              id: `comm-${Date.now()}`,
              channel: values.channel,
              subject: values.subject,
              relatedType: values.relatedType as CommunicationItem['relatedType'],
              relatedName: values.relatedName,
              followUp: values.followUp,
            },
            ...prev,
          ]);
          setShowAdd(false);
        }}
      />
    </div>
  );
}
