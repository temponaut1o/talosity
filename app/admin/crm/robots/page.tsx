'use client';

import { useEffect, useMemo, useState } from 'react';
import { DataTable } from '@/components/crm/DataTable';
import { EmptyState } from '@/components/crm/EmptyState';
import { FormModal } from '@/components/crm/FormModal';
import { SearchBar } from '@/components/crm/SearchBar';
import type { RobotRecord } from '@/lib/crm/types';

export default function RobotsPage() {
  const [robots, setRobots] = useState<RobotRecord[]>([]);
  const [search, setSearch] = useState('');
  const [showAdd, setShowAdd] = useState(false);

  useEffect(() => {
    const load = async () => {
      const response = await fetch('/api/crm/robots');
      const data = (await response.json()) as RobotRecord[];
      setRobots(data);
    };
    void load();
  }, []);

  const filtered = useMemo(() => {
    return robots.filter((robot) => `${robot.name} ${robot.manufacturer} ${robot.category}`.toLowerCase().includes(search.toLowerCase()));
  }, [robots, search]);

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-4 lg:flex-row lg:items-center lg:justify-between">
        <SearchBar placeholder="Search robots" value={search} onChange={setSearch} />
        <button onClick={() => setShowAdd(true)} className="rounded-full bg-slate-950 px-4 py-2 text-sm font-medium text-white">
          Add Robot
        </button>
      </div>

      {filtered.length === 0 ? (
        <EmptyState title="No robots found" description="Create a new robot profile to populate the catalog." />
      ) : (
        <DataTable
          columns={[
            {
              key: 'robot',
              header: 'Robot',
              cell: (row: RobotRecord) => (
                <div>
                  <p className="font-medium text-slate-900">{row.name}</p>
                  <p className="text-xs text-slate-500">{row.modelNumber}</p>
                </div>
              ),
            },
            { key: 'manufacturer', header: 'Manufacturer', cell: (row: RobotRecord) => row.manufacturer },
            { key: 'category', header: 'Category', cell: (row: RobotRecord) => row.category },
            { key: 'payload', header: 'Payload', cell: (row: RobotRecord) => row.payload },
            {
              key: 'actions',
              header: 'Actions',
              cell: () => (
                <div className="flex flex-wrap gap-2">
                  <button className="rounded-full border border-slate-300 px-2 py-1 text-xs">Edit Robot</button>
                  <button className="rounded-full border border-slate-300 px-2 py-1 text-xs">Attach Manufacturer</button>
                  <button className="rounded-full border border-slate-300 px-2 py-1 text-xs">Upload Documents</button>
                </div>
              ),
            },
          ]}
          rows={filtered}
        />
      )}

      <FormModal
        open={showAdd}
        title="Add Robot"
        submitLabel="Create Robot"
        onCancel={() => setShowAdd(false)}
        fields={[
          { name: 'name', label: 'Robot Name', required: true },
          { name: 'manufacturer', label: 'Manufacturer', required: true },
          { name: 'modelNumber', label: 'Model Number', required: true },
          { name: 'category', label: 'Category', required: true },
          { name: 'industry', label: 'Industry', required: true },
          { name: 'payload', label: 'Payload', required: true },
          { name: 'speed', label: 'Runtime / Speed', required: true },
          { name: 'applications', label: 'Applications (comma separated)', required: true },
          { name: 'aiCapabilities', label: 'AI Capabilities (comma separated)', required: true },
          { name: 'safetyCertifications', label: 'Safety Certifications (comma separated)', required: true },
        ]}
        onSubmit={async (values) => {
          const payload = {
            ...values,
            applications: values.applications.split(',').map((item) => item.trim()).filter(Boolean),
            aiCapabilities: values.aiCapabilities.split(',').map((item) => item.trim()).filter(Boolean),
            safetyCertifications: values.safetyCertifications.split(',').map((item) => item.trim()).filter(Boolean),
            supportIncluded: true,
          };

          const response = await fetch('/api/crm/robots', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload),
          });

          if (!response.ok) {
            throw new Error('Unable to create robot.');
          }

          const created = (await response.json()) as { robot: RobotRecord };
          setRobots((prev) => [created.robot, ...prev]);
          setShowAdd(false);
        }}
      />
    </div>
  );
}
