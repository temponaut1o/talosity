import { ReactNode } from 'react';

interface CRMCardProps {
  title: string;
  description?: string;
  children?: ReactNode;
  action?: ReactNode;
}

export function CRMCard({ title, description, children, action }: CRMCardProps) {
  return (
    <section className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <h3 className="text-lg font-semibold text-slate-950">{title}</h3>
          {description ? <p className="mt-1 text-sm text-slate-600">{description}</p> : null}
        </div>
        {action ? <div>{action}</div> : null}
      </div>
      <div className="mt-5">{children}</div>
    </section>
  );
}
