import { PipelineBoard, type PipelineItem } from '@/components/crm/PipelineBoard';
import { createOpportunityAction, deleteOpportunityAction } from '@/app/admin/crm/actions';
import { listLeads, listOpportunities } from '@/lib/crm/repository';

export const dynamic = 'force-dynamic';

const columns = ['New', 'Qualified', 'Vendor Match', 'Proposal', 'Closed'];

function stageFromSalesStage(salesStage: string): string {
  const normalized = salesStage.toLowerCase();
  if (normalized.includes('qual')) {
    return 'Qualified';
  }
  if (normalized.includes('proposal') || normalized.includes('demo') || normalized.includes('negotiation')) {
    return 'Proposal';
  }
  if (normalized.includes('won') || normalized.includes('lost')) {
    return 'Closed';
  }
  return 'New';
}

export default async function OpportunitiesPage() {
  const [opportunities, leads] = await Promise.all([listOpportunities(), listLeads()]);
  const items: PipelineItem[] = opportunities.map((item) => ({
    id: item.id,
    company: item.companyName,
    robotInterest: item.robotInterest,
    estimatedValue: item.estimatedValue,
    nextAction: item.nextAction,
    owner: item.vendorName,
    stage: stageFromSalesStage(item.salesStage),
  }));

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <h2 className="text-lg font-semibold text-slate-900">Opportunities Pipeline</h2>
        <p className="text-sm text-slate-600">Move opportunities between stages to track deal progression.</p>
      </div>

      <form action={createOpportunityAction} className="grid gap-3 rounded-2xl border border-slate-200 bg-white p-4 md:grid-cols-2">
        <select name="leadId" className="rounded-xl border border-slate-300 px-3 py-2 text-sm">
          <option value="">Select lead</option>
          {leads.map((lead) => (
            <option key={lead.id} value={lead.id}>{lead.name}</option>
          ))}
        </select>
        <input name="companyName" placeholder="Company" required className="rounded-xl border border-slate-300 px-3 py-2 text-sm" />
        <input name="vendorName" placeholder="Vendor" className="rounded-xl border border-slate-300 px-3 py-2 text-sm" />
        <input name="robotInterest" placeholder="Robot interest" className="rounded-xl border border-slate-300 px-3 py-2 text-sm" />
        <select name="salesStage" className="rounded-xl border border-slate-300 px-3 py-2 text-sm">
          <option value="prospecting">prospecting</option>
          <option value="qualified">qualified</option>
          <option value="demo">demo</option>
          <option value="proposal">proposal</option>
          <option value="negotiation">negotiation</option>
          <option value="won">won</option>
          <option value="lost">lost</option>
        </select>
        <input name="estimatedValue" placeholder="Estimated value" className="rounded-xl border border-slate-300 px-3 py-2 text-sm" />
        <input name="nextAction" placeholder="Next action" className="rounded-xl border border-slate-300 px-3 py-2 text-sm" />
        <button type="submit" className="rounded-full bg-slate-950 px-4 py-2 text-sm font-medium text-white">Create Opportunity</button>
      </form>

      <PipelineBoard columns={columns} items={items} onStageChange={() => {}} />

      <div className="rounded-2xl border border-slate-200 bg-white p-4">
        <h3 className="text-base font-semibold text-slate-900">Delete Opportunity</h3>
        <div className="mt-3 flex flex-wrap gap-2">
          {opportunities.map((item) => (
            <form key={item.id} action={deleteOpportunityAction}>
              <input type="hidden" name="id" value={item.id} />
              <button type="submit" className="rounded-full border border-rose-300 px-3 py-1 text-xs text-rose-700">
                {item.companyName || item.id}
              </button>
            </form>
          ))}
        </div>
      </div>
    </div>
  );
}
