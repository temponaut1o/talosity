interface CRMStatusBadgeProps {
  status: string;
}

export function CRMStatusBadge({ status }: CRMStatusBadgeProps) {
  const normalized = status.toLowerCase();
  const tone =
    normalized.includes('won') || normalized.includes('verified') || normalized.includes('approved')
      ? 'bg-emerald-100 text-emerald-700'
      : normalized.includes('lost') || normalized.includes('rejected') || normalized.includes('pending')
        ? 'bg-amber-100 text-amber-700'
        : 'bg-slate-100 text-slate-700';

  return <span className={`rounded-full px-3 py-1 text-xs font-medium ${tone}`}>{status}</span>;
}
