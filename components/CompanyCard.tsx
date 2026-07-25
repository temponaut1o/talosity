import type { Company, Robot } from '@/lib/types';

interface CompanyCardProps {
  company: Company;
  robots: Robot[];
  industryName?: string;
}

export function CompanyCard({ company, robots, industryName }: CompanyCardProps) {
  return (
    <article className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.28em] text-slate-500">Company</p>
          <h3 className="mt-1 text-xl font-semibold text-slate-950">{company.name}</h3>
          <p className="mt-2 text-sm text-slate-600">{company.summary}</p>
        </div>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-700">
          Founded {company.yearFounded}
        </span>
      </div>

      <div className="mt-4 flex flex-wrap gap-2">
        {company.tags.map((tag) => (
          <span key={tag} className="rounded-full bg-slate-50 px-3 py-1 text-xs font-medium text-slate-600">
            {tag}
          </span>
        ))}
      </div>

      <dl className="mt-5 grid gap-4 rounded-2xl border border-slate-100 bg-slate-50 p-4 text-sm text-slate-600 sm:grid-cols-3">
        <div>
          <dt className="text-slate-500">Location</dt>
          <dd className="mt-1 font-medium text-slate-900">{company.location}</dd>
        </div>
        <div>
          <dt className="text-slate-500">Industry</dt>
          <dd className="mt-1 font-medium text-slate-900">{industryName ?? company.category}</dd>
        </div>
        <div>
          <dt className="text-slate-500">Systems</dt>
          <dd className="mt-1 font-medium text-slate-900">{robots.length} active</dd>
        </div>
      </dl>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-2 border-t border-slate-100 pt-4 text-sm text-slate-600">
        <span>Deployment examples: {company.robots.join(', ')}</span>
        <span className="font-medium text-slate-900">Public status: operating</span>
      </div>
    </article>
  );
}
