'use client';

import type { Industry, IndustryKey } from '@/lib/types';

interface CategoryNavProps {
  industries: Industry[];
  selected: IndustryKey;
  onSelect: (industry: IndustryKey) => void;
}

export function CategoryNav({ industries, selected, onSelect }: CategoryNavProps) {
  return (
    <nav className="flex flex-wrap gap-3" aria-label="Industry categories">
      {industries.map((industry) => {
        const isActive = industry.id === selected;

        return (
          <button
            key={industry.id}
            type="button"
            onClick={() => onSelect(industry.id)}
            className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
              isActive
                ? 'border-slate-900 bg-slate-900 text-white shadow-sm'
                : 'border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:bg-slate-50'
            }`}
          >
            {industry.shortName}
          </button>
        );
      })}
    </nav>
  );
}
