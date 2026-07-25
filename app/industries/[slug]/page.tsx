import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CompanyCard } from '@/components/CompanyCard';
import { RobotCard } from '@/components/RobotCard';
import { companies, industries, robots } from '@/lib/placeholder-data';
import { slugify } from '@/lib/utils';

interface IndustryPageProps {
  params: { slug: string };
}

export function generateStaticParams() {
  return industries.map((industry) => ({ slug: slugify(industry.name) }));
}

export default function IndustryPage({ params }: IndustryPageProps) {
  const industry = industries.find((item) => slugify(item.name) === params.slug);

  if (!industry) {
    notFound();
  }

  const industryCompanies = companies.filter((company) => company.category === industry.id);
  const industryRobots = robots.filter((robot) => robot.category === industry.id);

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-8">
        <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-slate-500">Industry</p>
              <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">{industry.name}</h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">{industry.description}</p>
            </div>
            <Link href="/directory" className="inline-flex items-center rounded-full border border-slate-200 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-300 hover:bg-slate-50">
              Open directory
            </Link>
          </div>
        </section>

        <section className="grid gap-8 xl:grid-cols-[0.95fr_1.05fr]">
          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-slate-950">Companies</h2>
            {industryCompanies.map((company) => (
              <CompanyCard key={company.id} company={company} robots={industryRobots.filter((robot) => robot.companyId === company.id)} industryName={industry.name} />
            ))}
          </div>

          <div className="space-y-4">
            <h2 className="text-xl font-semibold text-slate-950">Robotics platforms</h2>
            {industryRobots.map((robot) => (
              <RobotCard key={robot.id} robot={robot} company={companies.find((company) => company.id === robot.companyId)} />
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
