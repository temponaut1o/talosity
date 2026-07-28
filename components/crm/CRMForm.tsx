import { ReactNode } from 'react';

interface CRMFormProps {
  title: string;
  description?: string;
  children: ReactNode;
  onSubmit?: () => void;
  submitLabel?: string;
}

export function CRMForm({ title, description, children, onSubmit, submitLabel = 'Save' }: CRMFormProps) {
  return (
    <form onSubmit={(event) => {
      event.preventDefault();
      onSubmit?.();
    }} className="space-y-4 rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div>
        <h3 className="text-lg font-semibold text-slate-950">{title}</h3>
        {description ? <p className="mt-1 text-sm text-slate-600">{description}</p> : null}
      </div>
      <div className="space-y-3">{children}</div>
      <div className="flex items-center gap-3">
        <button className="rounded-full bg-slate-950 px-4 py-2 text-sm font-medium text-white">{submitLabel}</button>
        <button type="button" className="rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700">Cancel</button>
      </div>
    </form>
  );
}
