"use client";

import { CRMCard } from '@/components/crm/CRMCard';

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <CRMCard title="Settings" description="Prepare role-based access, workflow preferences, and future Supabase and authentication integration.">
        <div className="space-y-3 text-sm text-slate-600">
          <div className="rounded-2xl border border-slate-200 p-4">Admin access model ready for Super Admin, Sales, Vendor Manager, and Read Only roles.</div>
          <div className="rounded-2xl border border-slate-200 p-4">Middleware structure prepared for /admin route protection.</div>
          <div className="rounded-2xl border border-slate-200 p-4">Supabase RLS and persistence integration path prepared.</div>
        </div>
      </CRMCard>
    </div>
  );
}
