'use client';

import { useState } from 'react';
import { Header } from '@/components/crm/Header';
import { Sidebar } from '@/components/crm/Sidebar';

export default function CrmLayout({ children }: { children: React.ReactNode }) {
  const [searchValue, setSearchValue] = useState('');

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <div className="mx-auto flex max-w-[1600px] gap-4 p-4 lg:h-screen lg:p-5">
        <div className="hidden lg:block">
          <Sidebar />
        </div>

        <div className="flex min-w-0 flex-1 flex-col gap-4">
          <Header userName="Alex Rivera" searchValue={searchValue} onSearchChange={setSearchValue} />
          <div className="lg:hidden">
            <Sidebar />
          </div>
          <main className="flex-1 overflow-auto rounded-2xl border border-slate-200 bg-white p-4 shadow-sm lg:p-6">{children}</main>
        </div>
      </div>
    </div>
  );
}
