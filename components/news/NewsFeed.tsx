'use client';

import { useMemo, useState } from 'react';
import { NewsCard } from '@/components/news/NewsCard';
import { newsArticles } from '@/data/news/articles';

export function NewsFeed() {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const filteredArticles = useMemo(() => {
    const normalizedSearch = searchTerm.toLowerCase();

    return newsArticles.filter((article) => {
      const matchesSearch =
        normalizedSearch.length === 0 ||
        [article.title, article.summary, article.source_name, ...article.technology_tags].some((value) => value.toLowerCase().includes(normalizedSearch));

      const matchesCategory = categoryFilter === 'all' || article.category_id === categoryFilter;
      return matchesSearch && matchesCategory;
    });
  }, [categoryFilter, searchTerm]);

  return (
    <section className="rounded-[2rem] border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.35em] text-slate-500">Intelligence feed</p>
          <h2 className="mt-2 text-2xl font-semibold text-slate-950">Latest robotics intelligence</h2>
        </div>

        <div className="flex flex-wrap gap-3">
          <input
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="Search news"
            className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-700 outline-none"
          />
          <select
            value={categoryFilter}
            onChange={(event) => setCategoryFilter(event.target.value)}
            className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm text-slate-700 outline-none"
          >
            <option value="all">All categories</option>
            <option value="commercial-cleaning">Commercial cleaning</option>
            <option value="warehouse-automation">Warehouse automation</option>
            <option value="construction">Construction</option>
            <option value="medical">Medical</option>
            <option value="robotics">General robotics</option>
          </select>
        </div>
      </div>

      <div className="mt-6 grid gap-5 lg:grid-cols-2">
        {filteredArticles.map((article) => (
          <NewsCard key={article.id} article={article} />
        ))}
      </div>
    </section>
  );
}
