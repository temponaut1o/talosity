'use client';

import { Search, SlidersHorizontal } from 'lucide-react';
import { TalosityLogo } from './TalosityLogo';

interface DirectoryToolbarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  industryFilter: string;
  onIndustryChange: (value: string) => void;
  robotTypeFilter: string;
  onRobotTypeChange: (value: string) => void;
  companySizeFilter: string;
  onCompanySizeChange: (value: string) => void;
  locationFilter: string;
  onLocationChange: (value: string) => void;
  deploymentFilter: string;
  onDeploymentChange: (value: string) => void;
  technologyFilter: string;
  onTechnologyChange: (value: string) => void;
  industryOptions: string[];
  robotTypeOptions: string[];
  companySizeOptions: string[];
  locationOptions: string[];
  deploymentOptions: string[];
  technologyOptions: string[];
}

export function DirectoryToolbar({
  searchTerm,
  onSearchChange,
  industryFilter,
  onIndustryChange,
  robotTypeFilter,
  onRobotTypeChange,
  companySizeFilter,
  onCompanySizeChange,
  locationFilter,
  onLocationChange,
  deploymentFilter,
  onDeploymentChange,
  technologyFilter,
  onTechnologyChange,
  industryOptions,
  robotTypeOptions,
  companySizeOptions,
  locationOptions,
  deploymentOptions,
  technologyOptions,
}: DirectoryToolbarProps) {
  return (
    <section className="rounded-[1.75rem] border border-slate-200 bg-slate-50 p-4 shadow-sm sm:p-6">
      <div className="flex flex-wrap items-center justify-between gap-3 text-sm font-medium text-slate-600">
        <div className="flex flex-wrap items-center gap-3">
          <div className="rounded-full border border-slate-200 bg-white px-3 py-2 shadow-sm">
            <TalosityLogo compact className="gap-2" iconClassName="h-8 w-8" textClassName="text-[0.92rem]" />
          </div>
          <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-3 py-2">
            <SlidersHorizontal className="h-4 w-4" />
            Search and filter
          </span>
        </div>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-[1.6fr_1fr_1fr_1fr]">
        <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
          <span>Search</span>
          <div className="flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3 py-2">
            <Search className="h-4 w-4 text-slate-400" />
            <input
              value={searchTerm}
              onChange={(event) => onSearchChange(event.target.value)}
              placeholder="Find companies or robots"
              className="w-full bg-transparent text-sm text-slate-700 outline-none"
            />
          </div>
        </label>

        <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
          <span>Industry</span>
          <select value={industryFilter} onChange={(event) => onIndustryChange(event.target.value)} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none">
            {industryOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
          <span>Robot type</span>
          <select value={robotTypeFilter} onChange={(event) => onRobotTypeChange(event.target.value)} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none">
            {robotTypeOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
          <span>Company size</span>
          <select value={companySizeFilter} onChange={(event) => onCompanySizeChange(event.target.value)} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none">
            {companySizeOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="mt-4 grid gap-4 lg:grid-cols-3">
        <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
          <span>Location</span>
          <select value={locationFilter} onChange={(event) => onLocationChange(event.target.value)} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none">
            {locationOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
          <span>Deployment</span>
          <select value={deploymentFilter} onChange={(event) => onDeploymentChange(event.target.value)} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none">
            {deploymentOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>

        <label className="flex flex-col gap-2 text-sm font-medium text-slate-700">
          <span>Technology</span>
          <select value={technologyFilter} onChange={(event) => onTechnologyChange(event.target.value)} className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-sm text-slate-700 outline-none">
            {technologyOptions.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
      </div>
    </section>
  );
}
