import Link from 'next/link';
import type { NewsArticle } from '@/lib/rss/types';
import { companies } from '@/lib/placeholder-data';
import { slugify } from '@/lib/utils';

interface NewsCardProps {
  article: NewsArticle;
}

export function NewsCard({ article }: NewsCardProps) {
  const relatedCompany = companies.find((company) => company.id === article.company_id);

  return (
    <article className="rounded-[1.5rem] border border-slate-200 bg-white p-6 shadow-sm transition hover:-translate-y-1 hover:shadow-md">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold uppercase tracking-[0.25em] text-slate-600">
          {article.category_id}
        </span>
        <span className="text-sm text-slate-500">{new Date(article.published_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
      </div>

      <h3 className="mt-4 text-xl font-semibold text-slate-950">{article.title}</h3>
      <p className="mt-3 text-sm leading-7 text-slate-600">{article.summary}</p>

      <div className="mt-5 flex flex-wrap gap-2">
        {article.technology_tags.map((tag) => (
          <span key={tag} className="rounded-full border border-slate-200 px-3 py-1 text-xs font-medium text-slate-600">
            {tag}
          </span>
        ))}
      </div>

      <div className="mt-6 flex flex-wrap items-center justify-between gap-3 border-t border-slate-100 pt-4 text-sm text-slate-600">
        <div>
          <p className="font-medium text-slate-900">{article.source_name}</p>
          <p>{relatedCompany ? relatedCompany.name : 'Industrial robotics intelligence'}</p>
        </div>
        <Link href={`/news/${article.slug}`} className="rounded-full border border-slate-300 px-4 py-2 font-medium text-slate-700 transition hover:bg-slate-50">
          Read update
        </Link>
      </div>
    </article>
  );
}
