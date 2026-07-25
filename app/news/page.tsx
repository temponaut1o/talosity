import { NewsFeed } from '@/components/news/NewsFeed';

export default function NewsPage() {
  return (
    <main className="min-h-screen bg-slate-50 px-4 py-10 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-8">
        <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm sm:p-10">
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-slate-500">Intelligence</p>
          <h1 className="mt-3 text-3xl font-semibold tracking-tight text-slate-950 sm:text-4xl">Robotics industry intelligence feed</h1>
          <p className="mt-4 max-w-3xl text-base leading-7 text-slate-600">
            Structured news coverage for commercial robotics, warehouse automation, construction robotics, and medical robotics, prepared for future enrichment with AI summarization and company matching.
          </p>
        </section>

        <NewsFeed />
      </div>
    </main>
  );
}
