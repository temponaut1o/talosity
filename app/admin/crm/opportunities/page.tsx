'use client';

import { useMemo, useState } from 'react';
import { PipelineBoard, type PipelineItem } from '@/components/crm/PipelineBoard';
import { getCrmDashboardState } from '@/lib/crm/data';

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

export default function OpportunitiesPage() {
  const initialItems = useMemo<PipelineItem[]>(
    () =>
      getCrmDashboardState().opportunities.map((item) => ({
        id: item.id,
        company: item.companyName,
        robotInterest: item.robotInterest,
        estimatedValue: item.estimatedValue,
        nextAction: item.nextAction,
        owner: item.vendorName,
        stage: stageFromSalesStage(item.salesStage),
      })),
    [],
  );

  const [items, setItems] = useState<PipelineItem[]>(initialItems);

  const onStageChange = (id: string, stage: string) => {
    setItems((prev) => prev.map((item) => (item.id === id ? { ...item, stage } : item)));
  };

  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
        <h2 className="text-lg font-semibold text-slate-900">Opportunities Pipeline</h2>
        <p className="text-sm text-slate-600">Move opportunities between stages to track deal progression.</p>
      </div>
      <PipelineBoard columns={columns} items={items} onStageChange={onStageChange} />
    </div>
  );
}
