interface CRMSearchProps {
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
}

export function CRMSearch({ placeholder, value, onChange }: CRMSearchProps) {
  return (
    <label className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-600">
      <span>🔎</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full bg-transparent outline-none"
      />
    </label>
  );
}
