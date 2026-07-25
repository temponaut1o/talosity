import { rssItemSchema, type NewsArticle, type ParsedRssItem, type RssSourceConfig } from '@/lib/rss/types';
import { slugify } from '@/lib/utils';

function toIsoDate(value: string) {
  const parsed = new Date(value);
  return Number.isNaN(parsed.getTime()) ? new Date().toISOString() : parsed.toISOString();
}

export function parseRssItem(item: Partial<ParsedRssItem>, source: RssSourceConfig): ParsedRssItem {
  const parsed = rssItemSchema.parse({
    title: item.title ?? `${source.name} update`,
    description: item.description ?? 'Industrial robotics intelligence update.',
    link: item.link ?? source.url,
    publishedDate: item.publishedDate ?? new Date().toISOString(),
    sourceName: item.sourceName ?? source.name,
    category: source.category,
    technologyTags: item.technologyTags ?? source.technology_tags,
  });

  return parsed;
}

export function buildNewsArticles(items: ParsedRssItem[], source: RssSourceConfig): NewsArticle[] {
  return items.map((item, index) => ({
    id: `${slugify(item.title)}-${index}`,
    title: item.title,
    slug: slugify(item.title),
    summary: item.description,
    content: `${item.description} This entry is prepared for future RSS ingestion and eventual enrichment with AI summarization and duplicate detection.`,
    source_name: item.sourceName,
    source_url: item.link,
    published_date: toIsoDate(item.publishedDate),
    category_id: item.category,
    robot_type: item.technologyTags[0] ?? 'industrial robotics',
    technology_tags: item.technologyTags,
    created_at: new Date().toISOString(),
  }));
}
