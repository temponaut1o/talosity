import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowUpRight, Building2, MapPin, Orbit } from 'lucide-react';
import { companies, industries, robots } from '@/lib/placeholder-data';
import { newsArticles } from '@/data/news/articles';
import { slugify } from '@/lib/utils';

interface CompanyProfilePageProps {
  params: { slug: string };
}

export function generateStaticParams() {
  return companies.map((company) => ({ slug: slugify(company.name) }));
}

export default function CompanyProfilePage({ params }: CompanyProfilePageProps) {
  const company = companies.find((item) => slugify(item.name) === params.slug);

  if (!company) {
    notFound();
  }

  const industry = industries.find((item) => item.id === company.category);
  const companyRobots = robots.filter((robot) => robot.companyId === company.id);
  const relatedNews = newsArticles.filter((article) => article.category_id === company.category || article.source_name.includes(company.name.split(' ')[0]));

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-8">
        <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-start lg:justify-between">
            <div className="max-w-3xl">
              <p className="text-sm font-semibold uppercase tracking-[0.35em] text-slate-500">Company profile</p>
              <div className="mt-4 flex items-center gap-3">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-slate-200 bg-slate-50 text-slate-700">
                  <Building2 className="h-5 w-5" />
                </div>
                <div>
                  <h1 className="text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">{company.name}</h1>
                  <p className="mt-1 text-sm text-slate-600">{industry?.name ?? company.category}</p>
                </div>
              </div>
              <p className="mt-6 text-base leading-7 text-slate-600">{company.summary}</p>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-600">
              <div className="flex items-center gap-2 font-medium text-slate-900">
                <MapPin className="h-4 w-4" />
                {company.location}
              </div>
              <div className="mt-4">Founded {company.yearFounded}</div>
              <div className="mt-2">Public status: operating</div>
              <Link href="/directory" className="mt-5 inline-flex items-center gap-2 rounded-full border border-slate-300 px-4 py-2 font-medium text-slate-700 transition hover:bg-white">
                View directory <ArrowUpRight className="h-4 w-4" />
              </Link>
            </div>
          </div>
        </section>

        <section className="grid gap-8 xl:grid-cols-[0.95fr_1.05fr]">
          <div className="space-y-6">
            <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-slate-950">Overview</h2>
              <p className="mt-4 text-sm leading-7 text-slate-600">
                This profile captures the company’s operating footprint, primary robotics focus, and deployment examples for enterprise teams evaluating industrial automation partners.
              </p>
              <div className="mt-5 flex flex-wrap gap-2">
                {company.tags.map((tag) => (
                  <span key={tag} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                    {tag}
                  </span>
                ))}
              </div>
            </div>

            <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-slate-950">Technology</h2>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm font-semibold text-slate-900">Core focus</p>
                  <p className="mt-2 text-sm text-slate-600">{company.summary}</p>
                </div>
                <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <p className="text-sm font-semibold text-slate-900">Industries served</p>
                  <p className="mt-2 text-sm text-slate-600">{industry?.name ?? 'Industrial automation'}</p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
              <div className="flex items-center gap-2">
                <Orbit className="h-5 w-5 text-slate-700" />
                <h2 className="text-xl font-semibold text-slate-950">Robotics platforms</h2>
              </div>
              <div className="mt-5 space-y-4">
                {companyRobots.map((robot) => (
                  <div key={robot.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <h3 className="font-semibold text-slate-900">{robot.name}</h3>
                        <p className="mt-1 text-sm text-slate-600">{robot.application}</p>
                      </div>
                      <Link href={`/robots/${slugify(robot.name)}`} className="text-sm font-medium text-slate-700 transition hover:text-slate-950">
                        View details
                      </Link>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-[1.75rem] border border-slate-200 bg-white p-6 shadow-sm">
              <h2 className="text-xl font-semibold text-slate-950">News</h2>
              <div className="mt-4 space-y-3">
                {relatedNews.slice(0, 3).map((article) => (
                  <div key={article.id} className="rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
                    <p className="text-sm font-semibold text-slate-900">{article.title}</p>
                    <p className="mt-1 text-sm text-slate-600">{article.source_name}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}
