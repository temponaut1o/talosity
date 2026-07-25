import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Cpu, Gauge, MapPin, Orbit } from 'lucide-react';
import { companies, robots } from '@/lib/placeholder-data';
import { slugify } from '@/lib/utils';

interface RobotProfilePageProps {
  params: { slug: string };
}

export function generateStaticParams() {
  return robots.map((robot) => ({ slug: slugify(robot.name) }));
}

export default function RobotProfilePage({ params }: RobotProfilePageProps) {
  const robot = robots.find((item) => slugify(item.name) === params.slug);

  if (!robot) {
    notFound();
  }

  const company = companies.find((item) => item.id === robot.companyId);

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-8">
        <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-slate-500">Robot profile</p>
              <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">{robot.name}</h1>
              <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600">{robot.description}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-600">
              <div className="flex items-center gap-2 font-medium text-slate-900">
                <Cpu className="h-4 w-4" />
                {robot.application}
              </div>
              <div className="mt-4">Manufacturer: {company?.name ?? 'Industrial robotics partner'}</div>
              <Link href="/directory" className="mt-5 inline-flex items-center rounded-full border border-slate-300 px-4 py-2 font-medium text-slate-700 transition hover:bg-white">
                Back to directory
              </Link>
            </div>
          </div>
        </section>

        <section className="grid gap-8 xl:grid-cols-[0.9fr_1.1fr]">
          <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex items-center gap-2">
              <Gauge className="h-5 w-5 text-slate-700" />
              <h2 className="text-xl font-semibold text-slate-950">Specifications</h2>
            </div>
            <dl className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <dt className="text-sm text-slate-500">Payload</dt>
                <dd className="mt-1 font-semibold text-slate-900">{robot.payload}</dd>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <dt className="text-sm text-slate-500">Runtime</dt>
                <dd className="mt-1 font-semibold text-slate-900">{robot.autonomy}</dd>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <dt className="text-sm text-slate-500">Deployment</dt>
                <dd className="mt-1 font-semibold text-slate-900">{robot.deployment}</dd>
              </div>
              <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                <dt className="text-sm text-slate-500">Navigation</dt>
                <dd className="mt-1 font-semibold text-slate-900">Autonomous mapping</dd>
              </div>
            </dl>
          </div>

          <div className="space-y-6">
            <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5 text-slate-700" />
                <h2 className="text-xl font-semibold text-slate-950">Applications</h2>
              </div>
              <p className="mt-4 text-sm leading-7 text-slate-600">{robot.deployment}</p>
            </div>

            <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-2">
                <Orbit className="h-5 w-5 text-slate-700" />
                <h2 className="text-xl font-semibold text-slate-950">Related company</h2>
              </div>
              {company ? (
                <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <h3 className="font-semibold text-slate-900">{company.name}</h3>
                  <p className="mt-2 text-sm text-slate-600">{company.summary}</p>
                  <Link href={`/companies/${slugify(company.name)}`} className="mt-4 inline-flex text-sm font-medium text-slate-700 transition hover:text-slate-950">
                    Open company profile
                  </Link>
                </div>
              ) : null}
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
