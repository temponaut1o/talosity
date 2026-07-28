interface StatusBadgeProps {
  status: string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const normalized = status.toLowerCase();
  let tone = 'bg-slate-100 text-slate-700';

  if (normalized.includes('approved') || normalized.includes('verified') || normalized.includes('won')) {
    tone = 'bg-emerald-100 text-emerald-700';
  } else if (normalized.includes('pending') || normalized.includes('proposal') || normalized.includes('qualified')) {
    tone = 'bg-amber-100 text-amber-700';
  } else if (normalized.includes('reject') || normalized.includes('lost')) {
    tone = 'bg-rose-100 text-rose-700';
  }

  return <span className={`rounded-full px-3 py-1 text-xs font-medium ${tone}`}>{status}</span>;
}
