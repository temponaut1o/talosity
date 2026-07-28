interface SearchBarProps {
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
}

export function SearchBar({ placeholder, value, onChange }: SearchBarProps) {
  return (
    <label className="flex items-center gap-2 rounded-full border border-slate-300 bg-white px-3 py-2 text-sm text-slate-600">
      <span>Search</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="w-full bg-transparent outline-none"
      />
    </label>
  );
}
