'use client';

import { useEffect, useMemo, useState } from 'react';
import { DataTable } from '@/components/crm/DataTable';
import { EmptyState } from '@/components/crm/EmptyState';
import { FormModal } from '@/components/crm/FormModal';
import { SearchBar } from '@/components/crm/SearchBar';
import { StatusBadge } from '@/components/crm/StatusBadge';
import type { CompanyRecord } from '@/lib/crm/types';

export default function CompaniesPage() {
  const [companies, setCompanies] = useState<CompanyRecord[]>([]);
  const [search, setSearch] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [showAdd, setShowAdd] = useState(false);

  useEffect(() => {
    const load = async () => {
      const response = await fetch('/api/crm/companies');
      const data = (await response.json()) as CompanyRecord[];
      setCompanies(data);
    };
    void load();
  }, []);

  const filtered = useMemo(() => {
    return companies.filter((company) => {
      const matchesSearch = `${company.name} ${company.industry}`.toLowerCase().includes(search.toLowerCase());
      const matchesType = typeFilter === 'all' || company.companyType === typeFilter;
      return matchesSearch && matchesType;
    });
  }, [companies, search, typeFilter]);

  const verifyCompany = (id: string) => {
    setCompanies((prev) => prev.map((company) => (company.id === id ? { ...company, vendorStatus: 'verified' } : company)));
  };

  const deleteCompany = (id: string) => {
    setCompanies((prev) => prev.filter((company) => company.id !== id));
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-col gap-3 md:flex-row">
          <SearchBar placeholder="Search companies" value={search} onChange={setSearch} />
          <select
            value={typeFilter}
            onChange={(event) => setTypeFilter(event.target.value)}
            className="rounded-full border border-slate-300 px-3 py-2 text-sm"
          >
            <option value="all">All Types</option>
            <option value="manufacturer">Manufacturer</option>
            <option value="integrator">Integrator</option>
            <option value="supplier">Supplier</option>
            <option value="customer">Customer</option>
          </select>
        </div>
        <button onClick={() => setShowAdd(true)} className="rounded-full bg-slate-950 px-4 py-2 text-sm font-medium text-white">
          Add Company
        </button>
      </div>

      {filtered.length === 0 ? (
        <EmptyState title="No companies found" description="Add a company or update filters to continue." />
      ) : (
        <DataTable
          columns={[
            {
              key: 'company',
              header: 'Company',
              cell: (row: CompanyRecord) => (
                <div>
                  <p className="font-medium text-slate-900">{row.name}</p>
                  <p className="text-xs text-slate-500">{row.website}</p>
                </div>
              ),
            },
            { key: 'industry', header: 'Industry', cell: (row: CompanyRecord) => row.industry },
            { key: 'type', header: 'Type', cell: (row: CompanyRecord) => row.companyType },
            { key: 'status', header: 'Status', cell: (row: CompanyRecord) => <StatusBadge status={row.vendorStatus} /> },
            {
              key: 'robots',
              header: 'Robots',
              cell: () => <span className="text-xs text-slate-600">Managed in Robots module</span>,
            },
            {
              key: 'actions',
              header: 'Actions',
              cell: (row: CompanyRecord) => (
                <div className="flex flex-wrap gap-2">
                  <button className="rounded-full border border-slate-300 px-2 py-1 text-xs">View</button>
                  <button className="rounded-full border border-slate-300 px-2 py-1 text-xs">Edit</button>
                  <button onClick={() => deleteCompany(row.id)} className="rounded-full border border-rose-300 px-2 py-1 text-xs text-rose-700">Delete</button>
                  <button onClick={() => verifyCompany(row.id)} className="rounded-full border border-emerald-300 px-2 py-1 text-xs text-emerald-700">Verify</button>
                </div>
              ),
            },
          ]}
          rows={filtered}
        />
      )}

      <FormModal
        open={showAdd}
        title="Add Company"
        submitLabel="Create Company"
        onCancel={() => setShowAdd(false)}
        fields={[
          { name: 'name', label: 'Name', required: true },
          { name: 'industry', label: 'Industry', required: true },
          { name: 'companyType', label: 'Company Type', type: 'select', required: true, options: ['manufacturer', 'integrator', 'supplier', 'customer'] },
          { name: 'website', label: 'Website', required: true },
          { name: 'contactName', label: 'Contact Name', required: true },
          { name: 'contactEmail', label: 'Contact Email', type: 'email', required: true },
          { name: 'contactPhone', label: 'Contact Phone', required: true },
          { name: 'headquarters', label: 'Country / Headquarters', required: true },
        ]}
        onSubmit={async (values) => {
          const response = await fetch('/api/crm/companies', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(values),
          });
          if (!response.ok) {
            throw new Error('Unable to create company.');
          }
          const created = (await response.json()) as { company: CompanyRecord };
          setCompanies((prev) => [created.company, ...prev]);
          setShowAdd(false);
        }}
      />
    </div>
  );
}
