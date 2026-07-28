"use client";

import { CRMCard } from '@/components/crm/CRMCard';
import { CRMForm } from '@/components/crm/CRMForm';

export default function NewRobotPage() {
  return (
    <div className="space-y-6">
      <CRMCard title="New robot" description="Create or update robot profiles for the Talosity robotics platform.">
        <CRMForm title="Robot profile" description="Capture product and deployment data for commercial robotics teams." submitLabel="Create robot">
          <div className="grid gap-4 md:grid-cols-2">
            <input className="rounded-2xl border border-slate-200 px-3 py-2" placeholder="Robot name" />
            <input className="rounded-2xl border border-slate-200 px-3 py-2" placeholder="Manufacturer" />
            <input className="rounded-2xl border border-slate-200 px-3 py-2" placeholder="Category" />
            <input className="rounded-2xl border border-slate-200 px-3 py-2" placeholder="Industry" />
            <input className="rounded-2xl border border-slate-200 px-3 py-2" placeholder="Payload" />
            <input className="rounded-2xl border border-slate-200 px-3 py-2" placeholder="Runtime" />
          </div>
          <textarea className="min-h-28 w-full rounded-2xl border border-slate-200 px-3 py-2" placeholder="Navigation / sensors / AI capabilities" />
          <input className="w-full rounded-2xl border border-slate-200 px-3 py-2" placeholder="RaaS availability" />
          <input className="w-full rounded-2xl border border-slate-200 px-3 py-2" placeholder="Documents or image references" />
        </CRMForm>
      </CRMCard>
    </div>
  );
}
