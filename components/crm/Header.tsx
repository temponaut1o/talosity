'use client';

import { SearchBar } from '@/components/crm/SearchBar';

interface HeaderProps {
  userName: string;
  searchValue: string;
  onSearchChange: (value: string) => void;
}

export function Header({ userName, searchValue, onSearchChange }: HeaderProps) {
  return (
    <header className="sticky top-0 z-20 rounded-2xl border border-slate-200 bg-white/95 px-4 py-3 shadow-sm backdrop-blur lg:px-6">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.3em] text-slate-500">Talosity CRM</p>
          <h2 className="text-lg font-semibold text-slate-950">Industrial Robotics Operations</h2>
        </div>

        <div className="flex flex-col gap-3 md:flex-row md:items-center">
          <div className="w-full md:w-72">
            <SearchBar placeholder="Search records, leads, vendors" value={searchValue} onChange={onSearchChange} />
          </div>
          <button className="rounded-full border border-slate-300 px-3 py-2 text-sm text-slate-700">Notifications 3</button>
          <div className="rounded-full border border-slate-300 px-3 py-2 text-sm text-slate-700">{userName}</div>
          <button className="rounded-full bg-slate-950 px-3 py-2 text-sm text-white">Account</button>
        </div>
      </div>
    </header>
  );
}
