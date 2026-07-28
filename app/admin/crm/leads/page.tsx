'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { DataTable } from '@/components/crm/DataTable';
import { EmptyState } from '@/components/crm/EmptyState';
import { FormModal } from '@/components/crm/FormModal';
import { SearchBar } from '@/components/crm/SearchBar';
import { StatusBadge } from '@/components/crm/StatusBadge';
import type { LeadRecord } from '@/lib/crm/types';

const leadStatuses = ['new', 'contacted', 'qualified', 'vendor-matched', 'proposal', 'closed-won', 'closed-lost'];

export default function LeadsPage() {
  const [leads, setLeads] = useState<LeadRecord[]>([]);
  const [search, setSearch] = useState('');
  const [showCreate, setShowCreate] = useState(false);
  const [showNote, setShowNote] = useState(false);
  const [activeLeadId, setActiveLeadId] = useState<string | null>(null);
  const [notes, setNotes] = useState<Record<string, string[]>>({});

  useEffect(() => {
    const load = async () => {
      const response = await fetch('/api/crm/leads');
      const data = (await response.json()) as LeadRecord[];
      setLeads(data);
    };
    void load();
  }, []);

  const filtered = useMemo(
    () => leads.filter((lead) => `${lead.name} ${lead.company} ${lead.robotInterest}`.toLowerCase().includes(search.toLowerCase())),
    [leads, search],
  );

  const updateStatus = (leadId: string, status: string) => {
    setLeads((prev) => prev.map((lead) => (lead.id === leadId ? { ...lead, status: status as LeadRecord['status'] } : lead)));
  };

  const assignVendor = (leadId: string) => {
    setLeads((prev) => prev.map((lead) => (lead.id === leadId ? { ...lead, status: 'vendor-matched' } : lead)));
  };

  const createOpportunity = (leadId: string) => {
    setLeads((prev) => prev.map((lead) => (lead.id === leadId ? { ...lead, status: 'proposal' } : lead)));
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 lg:flex-row lg:items-center lg:justify-between">
        <SearchBar placeholder="Search leads by name, company, or interest" value={search} onChange={setSearch} />
        <button onClick={() => setShowCreate(true)} className="rounded-full bg-slate-950 px-4 py-2 text-sm font-medium text-white">
          Create Lead
        </button>
      </div>

      {filtered.length === 0 ? (
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
                <div className="space-y-2">
                  <StatusBadge status={row.status} />
                  <select
                    value={row.status}
                    onChange={(event) => updateStatus(row.id, event.target.value)}
                    className="w-full rounded-lg border border-slate-300 px-2 py-1 text-xs"
                  >
                    {leadStatuses.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>
              ),
            },
            {
              key: 'actions',
              header: 'Actions',
              cell: (row: LeadRecord) => (
                <div className="flex flex-wrap gap-2">
                  <button onClick={() => assignVendor(row.id)} className="rounded-full border border-slate-300 px-2 py-1 text-xs">Assign Vendor</button>
                  <button
                    onClick={() => {
                      setActiveLeadId(row.id);
                      setShowNote(true);
                    }}
                    className="rounded-full border border-slate-300 px-2 py-1 text-xs"
                  >
                    Add Note
                  </button>
                  <button onClick={() => createOpportunity(row.id)} className="rounded-full border border-emerald-300 px-2 py-1 text-xs text-emerald-700">
                    Create Opportunity
                  </button>
                </div>
              ),
            },
          ]}
          rows={filtered}
        />
      )}

      <FormModal
        open={showCreate}
        title="Create Lead"
        submitLabel="Save Lead"
        onCancel={() => setShowCreate(false)}
        fields={[
          { name: 'name', label: 'Lead Name', required: true },
          { name: 'company', label: 'Company', required: true },
          { name: 'email', label: 'Email', type: 'email', required: true },
          { name: 'phone', label: 'Phone', required: true },
          { name: 'industry', label: 'Industry', required: true },
          { name: 'robotInterest', label: 'Robot Interest', required: true },
          { name: 'facilitySize', label: 'Facility Size', required: true },
          { name: 'deploymentTimeline', label: 'Timeline', required: true },
          { name: 'budgetRange', label: 'Budget Range', required: true },
        ]}
        onSubmit={async (values) => {
          const response = await fetch('/api/crm/leads', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(values),
          });
          if (!response.ok) {
            throw new Error('Unable to create lead.');
          }
          const created = (await response.json()) as { lead: LeadRecord };
          setLeads((prev) => [created.lead, ...prev]);
          setShowCreate(false);
        }}
      />

      <FormModal
        open={showNote}
        title="Add Lead Note"
        submitLabel="Save Note"
        onCancel={() => setShowNote(false)}
        fields={[{ name: 'note', label: 'Note', type: 'textarea', required: true }]}
        onSubmit={async (values) => {
          if (!activeLeadId) {
            throw new Error('No lead selected.');
          }
          setNotes((prev) => ({ ...prev, [activeLeadId]: [...(prev[activeLeadId] ?? []), values.note] }));
          setShowNote(false);
        }}
      />

      {activeLeadId && notes[activeLeadId]?.length ? (
        <section className="rounded-2xl border border-slate-200 p-4">
          <h3 className="text-sm font-semibold text-slate-900">Notes for {activeLeadId}</h3>
          <ul className="mt-2 space-y-2 text-sm text-slate-600">
            {notes[activeLeadId].map((note, index) => (
              <li key={`${activeLeadId}-${index}`} className="rounded-xl bg-slate-50 p-2">
                {note}
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </div>
  );
}
