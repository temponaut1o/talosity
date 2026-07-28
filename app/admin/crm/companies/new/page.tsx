"use client";

import { useState } from 'react';
import { CRMCard } from '@/components/crm/CRMCard';
import { CRMForm } from '@/components/crm/CRMForm';

export default function NewCompanyPage() {
  const [message, setMessage] = useState<string | null>(null);

  return (
    <div className="space-y-6">
      <CRMCard title="New company" description="Create a profile for a manufacturer, integrator, supplier, or customer.">
        <CRMForm title="Company profile" description="Capture verification status and contact details for the CRM." submitLabel="Create company">
          <div className="grid gap-4 md:grid-cols-2">
            <input className="rounded-2xl border border-slate-200 px-3 py-2" placeholder="Name" />
            <input className="rounded-2xl border border-slate-200 px-3 py-2" placeholder="Website" />
            <input className="rounded-2xl border border-slate-200 px-3 py-2" placeholder="Industry" />
            <input className="rounded-2xl border border-slate-200 px-3 py-2" placeholder="Country" />
            <select className="rounded-2xl border border-slate-200 px-3 py-2">
              <option>Manufacturer</option>
              <option>Integrator</option>
              <option>Supplier</option>
              <option>Dealer</option>
              <option>Customer</option>
              <option>Partner</option>
            </select>
            <select className="rounded-2xl border border-slate-200 px-3 py-2">
              <option>Pending</option>
              <option>Verified</option>
              <option>Suspended</option>
            </select>
          </div>
          <textarea className="min-h-28 w-full rounded-2xl border border-slate-200 px-3 py-2" placeholder="Description" />
          <input className="w-full rounded-2xl border border-slate-200 px-3 py-2" placeholder="Contact name" />
          <input className="w-full rounded-2xl border border-slate-200 px-3 py-2" placeholder="Contact email" />
          <input className="w-full rounded-2xl border border-slate-200 px-3 py-2" placeholder="Contact phone" />
          <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-3 text-sm text-emerald-700">{message ?? 'Validation and submission hooks are ready for Supabase persistence.'}</div>
        </CRMForm>
      </CRMCard>
    </div>
  );
}
