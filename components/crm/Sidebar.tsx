'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/admin/crm', label: 'Dashboard' },
  { href: '/admin/crm/companies', label: 'Companies' },
  { href: '/admin/crm/robots', label: 'Robots' },
  { href: '/admin/crm/leads', label: 'Leads' },
  { href: '/admin/crm/opportunities', label: 'Opportunities' },
  { href: '/admin/crm/partners', label: 'Partners' },
  { href: '/admin/crm/vendors', label: 'Vendor Requests' },
  { href: '/admin/crm/communications', label: 'Communications' },
  { href: '/admin/crm/graph', label: 'Knowledge Graph' },
  { href: '/admin/crm/documents', label: 'Documents' },
  { href: '/admin/crm/analytics', label: 'Analytics' },
  { href: '/admin/crm/settings', label: 'Settings' },
  { href: '/admin', label: 'System' },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <aside className="flex h-full w-full flex-col rounded-3xl border border-slate-800 bg-slate-950 p-4 text-slate-100 lg:w-72">
      <div className="border-b border-slate-800 px-2 pb-4 pt-2">
        <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Talosity</p>
        <h1 className="mt-1 text-xl font-semibold">CRM Workspace</h1>
      </div>
      <nav className="mt-4 space-y-1 overflow-y-auto">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== '/admin/crm' && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`block rounded-xl px-3 py-2 text-sm transition ${
                isActive ? 'bg-white/15 text-white' : 'text-slate-300 hover:bg-white/10 hover:text-white'
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
