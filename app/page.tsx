'use client';

import { useMemo, useState } from 'react';
import { CategoryNav } from '@/components/CategoryNav';
import { CompanyCard } from '@/components/CompanyCard';
import { RobotCard } from '@/components/RobotCard';
import { categorySummary, companies, industries, robots } from '@/lib/placeholder-data';
import type { IndustryKey } from '@/lib/types';

export default function Home() {
  const [selectedCategory, setSelectedCategory] = useState<IndustryKey>('commercial-cleaning');

  const filteredCompanies = useMemo(
    () => companies.filter((company) => company.category === selectedCategory),
    [selectedCategory],
  );

  const filteredRobots = useMemo(
    () => robots.filter((robot) => robot.category === selectedCategory),
    [selectedCategory],
  );

  const selectedIndustry = industries.find((industry) => industry.id === selectedCategory);
  const companyLookup = useMemo(() => new Map(companies.map((company) => [company.id, company])), []);

  return (
    <main className="min-h-screen bg-[radial-gradient(circle_at_top_left,_rgba(15,23,42,0.08),_transparent_35%),linear-gradient(135deg,_#f8fafc_0%,_#eef2ff_100%)] px-4 py-10 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-8">
        <section className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white/80 p-8 shadow-[0_20px_80px_-24px_rgba(15,23,42,0.3)] backdrop-blur sm:p-10 lg:p-14">
          <div className="grid gap-10 lg:grid-cols-[1.2fr_0.8fr] lg:items-end">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-slate-500">Talosity Robotics</p>
              <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
                Industrial robotics intelligence for modern operations.
              </h1>
              <p className="mt-5 max-w-2xl text-lg leading-8 text-slate-600">
                Discover commercial cleaning, warehouse automation, construction, and medical robotics companies in one structured directory built for enterprise research.
              </p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-950 p-6 text-white">
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-400">MVP foundation</p>
              <ul className="mt-4 space-y-3 text-sm text-slate-300">
                <li>• Reusable robotics and company cards</li>
                <li>• Category-based navigation and placeholder data</li>
                <li>• Supabase-ready structure for future expansion</li>
              </ul>
            </div>
          </div>
        </section>

        <section className="rounded-[2rem] border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur sm:p-8">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">Explore by industry</p>
              <h2 className="mt-2 text-2xl font-semibold text-slate-950">Focused categories for enterprise robotics</h2>
            </div>
            <CategoryNav industries={industries} selected={selectedCategory} onSelect={setSelectedCategory} />
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {categorySummary.map((industry) => (
              <div key={industry.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <p className="text-sm font-semibold text-slate-900">{industry.name}</p>
                <p className="mt-2 text-sm text-slate-600">{industry.focus}</p>
                <div className="mt-4 flex items-center gap-4 text-sm text-slate-500">
                  <span>{industry.companyCount} companies</span>
                  <span>{industry.robotCount} robots</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-[2rem] border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur sm:p-8">
          <div className="flex flex-col gap-2">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-500">Current focus</p>
            <h2 className="text-2xl font-semibold text-slate-950">{selectedIndustry?.name}</h2>
            <p className="max-w-2xl text-sm leading-7 text-slate-600">{selectedIndustry?.description}</p>
          </div>

          <div className="mt-8 grid gap-6 xl:grid-cols-[0.9fr_1.1fr]">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-950">Companies</h3>
              {filteredCompanies.map((company) => (
                <CompanyCard key={company.id} company={company} robots={filteredRobots.filter((robot) => robot.companyId === company.id)} />
              ))}
            </div>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-slate-950">Robotics platforms</h3>
              {filteredRobots.map((robot) => (
                <RobotCard key={robot.id} robot={robot} company={companyLookup.get(robot.companyId)} />
              ))}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
