'use client';

import { StatusBadge } from '@/components/crm/StatusBadge';

export interface PipelineItem {
  id: string;
  company: string;
  robotInterest: string;
  estimatedValue: string;
  nextAction: string;
  owner: string;
  stage: string;
}

interface PipelineBoardProps {
  columns: string[];
  items: PipelineItem[];
  onStageChange: (id: string, stage: string) => void;
}

export function PipelineBoard({ columns, items, onStageChange }: PipelineBoardProps) {
  return (
    <div className="grid gap-4 xl:grid-cols-5 2xl:grid-cols-5">
      {columns.map((column) => {
        const columnItems = items.filter((item) => item.stage === column);
        return (
          <section key={column} className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-sm font-semibold text-slate-900">{column}</h3>
              <span className="rounded-full bg-white px-2 py-1 text-xs text-slate-500">{columnItems.length}</span>
            </div>
            <div className="space-y-3">
              {columnItems.map((item) => (
                <article key={item.id} className="rounded-xl border border-slate-200 bg-white p-3">
                  <div className="font-medium text-slate-900">{item.company}</div>
                  <p className="mt-1 text-xs text-slate-600">{item.robotInterest}</p>
                  <p className="mt-1 text-xs text-slate-500">{item.estimatedValue} - {item.owner}</p>
                  <p className="mt-1 text-xs text-slate-500">{item.nextAction}</p>
                  <div className="mt-2">
                    <StatusBadge status={item.stage} />
                  </div>
                  <select
                    value={item.stage}
                    onChange={(event) => onStageChange(item.id, event.target.value)}
                    className="mt-3 w-full rounded-lg border border-slate-300 px-2 py-1 text-xs"
                  >
                    {columns.map((next) => (
                      <option key={next} value={next}>
                        Move to {next}
                      </option>
                    ))}
                  </select>
                </article>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
