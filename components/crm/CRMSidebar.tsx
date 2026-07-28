'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const sections = [
  { href: '/admin/crm', label: 'Dashboard' },
  { href: '/admin/crm/companies', label: 'Companies' },
  { href: '/admin/crm/robots', label: 'Robots' },
  { href: '/admin/crm/leads', label: 'Leads' },
  { href: '/admin/crm/opportunities', label: 'Opportunities' },
  { href: '/admin/crm/vendors', label: 'Vendors' },
  { href: '/admin/crm/communications', label: 'Communications' },
  { href: '/admin/crm/documents', label: 'Documents' },
  { href: '/admin/crm/analytics', label: 'Analytics' },
  { href: '/admin/crm/settings', label: 'Settings' },
];

export function CRMSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-full rounded-3xl border border-slate-200 bg-slate-950 p-5 text-slate-100 lg:w-72">
      <div className="border-b border-slate-800 pb-5">
        <p className="text-xs uppercase tracking-[0.35em] text-slate-400">Talosity</p>
        <h2 className="mt-2 text-xl font-semibold">CRM Operations</h2>
      </div>
      <nav className="mt-6 space-y-2">
        {sections.map((section) => {
          const active = pathname === section.href || (section.href !== '/admin/crm' && pathname.startsWith(section.href));
          return (
            <Link
              key={section.href}
              href={section.href}
              className={`flex items-center rounded-2xl px-3 py-2 text-sm transition ${active ? 'bg-white/15 text-white' : 'text-slate-300 hover:bg-white/10 hover:text-white'}`}
            >
              {section.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
