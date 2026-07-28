import { ReactNode } from 'react';

interface CRMModalProps {
  title: string;
  children: ReactNode;
  open: boolean;
}

export function CRMModal({ title, children, open }: CRMModalProps) {
  if (!open) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/40 px-4">
      <div className="w-full max-w-2xl rounded-3xl border border-slate-200 bg-white p-6 shadow-xl">
        <h3 className="text-lg font-semibold text-slate-950">{title}</h3>
        <div className="mt-4">{children}</div>
      </div>
    </div>
  );
}
