import Link from 'next/link';
import { CRMCard } from '@/components/crm/CRMCard';
import { getLeadById } from '@/lib/crm/data';

interface LeadDetailPageProps {
  params: { id: string };
}

export default function LeadDetailPage({ params }: LeadDetailPageProps) {
  const lead = getLeadById(params.id);

  if (!lead) {
    return (
      <div className="space-y-6">
        <CRMCard title="Lead not found" description="The requested lead is not available in the current CRM view." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <CRMCard title={lead.name} description={`${lead.company} • ${lead.robotInterest}`} action={<Link href="/admin/crm/opportunities" className="rounded-full bg-slate-950 px-4 py-2 text-sm font-medium text-white">Create opportunity</Link>}>
        <div className="grid gap-4 md:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 p-4">
            <p className="text-sm font-semibold text-slate-600">Contact</p>
            <p className="mt-2 text-slate-900">{lead.email}</p>
            <p className="text-slate-700">{lead.phone}</p>
          </div>
          <div className="rounded-2xl border border-slate-200 p-4">
            <p className="text-sm font-semibold text-slate-600">Qualification</p>
            <p className="mt-2 text-slate-900">{lead.facilitySize}</p>
            <p className="text-slate-700">{lead.deploymentTimeline} • {lead.budgetRange}</p>
          </div>
        </div>
      </CRMCard>

      <CRMCard title="Communication history" description="Emails, notes, and follow-up workflow will be connected to this lead in the next phase.">
        <ul className="space-y-3 text-sm text-slate-600">
          <li className="rounded-2xl border border-slate-200 p-3">Initial inquiry captured from the robotics directory.</li>
          <li className="rounded-2xl border border-slate-200 p-3">Follow-up task scheduled for vendor match review.</li>
        </ul>
      </CRMCard>
    </div>
  );
}
