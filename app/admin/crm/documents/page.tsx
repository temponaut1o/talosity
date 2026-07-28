"use client";

import { CRMCard } from '@/components/crm/CRMCard';

const documents = [
  { name: 'Aegis Sweep X3 datasheet.pdf', kind: 'Datasheet' },
  { name: 'Northstar Mover 8 deployment guide.pdf', kind: 'Deployment Guide' },
  { name: 'Vendor verification pack.pdf', kind: 'Verification' },
];

export default function DocumentsPage() {
  return (
    <div className="space-y-6">
      <CRMCard title="Documents" description="Centralize datasheets, certificates, brochures, and vendor uploads for the CRM operation.">
        <ul className="space-y-3">
          {documents.map((document) => (
            <li key={document.name} className="flex items-center justify-between rounded-2xl border border-slate-200 p-4 text-sm">
              <span className="font-medium text-slate-900">{document.name}</span>
              <span className="text-slate-500">{document.kind}</span>
            </li>
          ))}
        </ul>
      </CRMCard>
    </div>
  );
}
