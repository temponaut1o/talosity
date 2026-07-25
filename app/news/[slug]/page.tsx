import Link from 'next/link';
import { notFound } from 'next/navigation';
import { newsArticles } from '@/data/news/articles';
import { slugify } from '@/lib/utils';

interface NewsArticlePageProps {
  params: { slug: string };
}

export function generateStaticParams() {
  return newsArticles.map((article) => ({ slug: article.slug }));
}

export default function NewsArticlePage({ params }: NewsArticlePageProps) {
  const article = newsArticles.find((item) => item.slug === params.slug);

  if (!article) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-4xl flex-col gap-8">
        <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-slate-500">Industry intelligence</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">{article.title}</h1>
          <div className="mt-5 flex flex-wrap gap-3 text-sm text-slate-600">
            <span className="rounded-full bg-slate-100 px-3 py-1">{article.source_name}</span>
            <span className="rounded-full bg-slate-100 px-3 py-1">{new Date(article.published_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
            <span className="rounded-full bg-slate-100 px-3 py-1">{article.category_id}</span>
          </div>
          <p className="mt-6 text-base leading-8 text-slate-700">{article.content}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/directory" className="rounded-full border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50">
              View directory
            </Link>
            <Link href="/news" className="rounded-full bg-slate-950 px-4 py-2 text-sm font-medium text-white transition hover:bg-slate-800">
              Back to news
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}
