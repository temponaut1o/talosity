'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { CompanyCard } from '@/components/CompanyCard';
import { DirectoryToolbar } from '@/components/DirectoryToolbar';
import { RobotCard } from '@/components/RobotCard';
import { companies, industries, robots } from '@/lib/placeholder-data';
import type { Company, IndustryKey, Robot } from '@/lib/types';

function getCompanySize(company: Company) {
  if (company.yearFounded < 2010) return 'enterprise';
  if (company.yearFounded < 2016) return 'mid-market';
  return 'emerging';
}

export default function DirectoryPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [industryFilter, setIndustryFilter] = useState('all');
  const [robotTypeFilter, setRobotTypeFilter] = useState('all');
  const [companySizeFilter, setCompanySizeFilter] = useState('all');
  const [locationFilter, setLocationFilter] = useState('all');
  const [deploymentFilter, setDeploymentFilter] = useState('all');
  const [technologyFilter, setTechnologyFilter] = useState('all');

  const companyLookup = useMemo(() => new Map(companies.map((company) => [company.id, company])), []);

  const filteredCompanies = useMemo(() => {
    const normalizedSearch = searchTerm.toLowerCase();

    return companies.filter((company) => {
      const matchesSearch =
        normalizedSearch.length === 0 ||
        [company.name, company.summary, company.location, ...company.tags].some((value) => value.toLowerCase().includes(normalizedSearch));

      const matchesIndustry = industryFilter === 'all' || company.category === industryFilter;
      const matchesSize = companySizeFilter === 'all' || getCompanySize(company) === companySizeFilter;
      const matchesLocation = locationFilter === 'all' || company.location === locationFilter;
      const matchesTechnology = technologyFilter === 'all' || company.tags.some((tag) => tag.toLowerCase() === technologyFilter.toLowerCase());

      return matchesSearch && matchesIndustry && matchesSize && matchesLocation && matchesTechnology;
    });
  }, [companySizeFilter, industryFilter, locationFilter, searchTerm, technologyFilter]);

  const filteredRobots = useMemo(() => {
    const normalizedSearch = searchTerm.toLowerCase();

    return robots.filter((robot) => {
      const company = companyLookup.get(robot.companyId);
      const matchesSearch =
        normalizedSearch.length === 0 ||
        [robot.name, robot.application, robot.description, robot.deployment, company?.name ?? ''].some((value) => value.toLowerCase().includes(normalizedSearch));

      const matchesIndustry = industryFilter === 'all' || robot.category === industryFilter;
      const matchesRobotType = robotTypeFilter === 'all' || robot.application.toLowerCase().includes(robotTypeFilter.toLowerCase());
      const matchesLocation = locationFilter === 'all' || company?.location === locationFilter;
      const matchesDeployment = deploymentFilter === 'all' || robot.deployment.toLowerCase() === deploymentFilter.toLowerCase();
      const matchesTechnology =
        technologyFilter === 'all' ||
        [robot.application, robot.description, robot.deployment].some((value) => value.toLowerCase().includes(technologyFilter.toLowerCase()));

      return matchesSearch && matchesIndustry && matchesRobotType && matchesLocation && matchesDeployment && matchesTechnology;
    });
  }, [companyLookup, deploymentFilter, industryFilter, locationFilter, robotTypeFilter, searchTerm, technologyFilter]);

  const industryOptions = ['all', ...industries.map((industry) => industry.id)];
  const robotTypeOptions = ['all', ...Array.from(new Set(robots.map((robot) => robot.application)))];
  const companySizeOptions = ['all', 'enterprise', 'mid-market', 'emerging'];
  const locationOptions = ['all', ...Array.from(new Set(companies.map((company) => company.location)))];
  const deploymentOptions = ['all', ...Array.from(new Set(robots.map((robot) => robot.deployment)))];
  const technologyOptions = ['all', ...Array.from(new Set(companies.flatMap((company) => company.tags)))];

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-8">
        <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-slate-500">Directory</p>
              <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">Industrial robotics intelligence directory</h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">
                Search commercial cleaning, warehouse automation, construction, and medical robotics companies with technical and deployment context.
              </p>
            </div>
            <Link href="/" className="inline-flex items-center rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50">
              Back to overview
            </Link>
          </div>
        </section>

        <DirectoryToolbar
          searchTerm={searchTerm}
          onSearchChange={setSearchTerm}
          industryFilter={industryFilter}
          onIndustryChange={setIndustryFilter}
          robotTypeFilter={robotTypeFilter}
          onRobotTypeChange={setRobotTypeFilter}
          companySizeFilter={companySizeFilter}
          onCompanySizeChange={setCompanySizeFilter}
          locationFilter={locationFilter}
          onLocationChange={setLocationFilter}
          deploymentFilter={deploymentFilter}
          onDeploymentChange={setDeploymentFilter}
          technologyFilter={technologyFilter}
          onTechnologyChange={setTechnologyFilter}
          industryOptions={industryOptions.map((option) => (option === 'all' ? 'All industries' : industries.find((industry) => industry.id === option)?.name ?? option))}
          robotTypeOptions={['All robot types', ...robotTypeOptions.filter((option) => option !== 'all')]}
          companySizeOptions={['All company sizes', ...companySizeOptions.filter((option) => option !== 'all')]}
          locationOptions={['All locations', ...locationOptions.filter((option) => option !== 'all')]}
          deploymentOptions={['All deployments', ...deploymentOptions.filter((option) => option !== 'all')]}
          technologyOptions={['All technologies', ...technologyOptions.filter((option) => option !== 'all')]}
        />

        <section className="grid gap-8 xl:grid-cols-[0.95fr_1.05fr]">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-slate-950">Companies</h2>
              <p className="text-sm text-slate-500">{filteredCompanies.length} matched</p>
            </div>
            {filteredCompanies.map((company) => (
              <CompanyCard key={company.id} company={company} robots={filteredRobots.filter((robot) => robot.companyId === company.id)} industryName={industries.find((industry) => industry.id === company.category)?.name} />
            ))}
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-slate-950">Robotics platforms</h2>
              <p className="text-sm text-slate-500">{filteredRobots.length} matched</p>
            </div>
            {filteredRobots.map((robot) => (
              <RobotCard key={robot.id} robot={robot} company={companyLookup.get(robot.companyId)} />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
