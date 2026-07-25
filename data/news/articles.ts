import { rssSources } from '@/lib/rss/sources';
import { buildNewsArticles, parseRssItem } from '@/lib/rss/parser';
import type { NewsArticle } from '@/lib/rss/types';

const inbox = [
  {
    title: 'ABB expands industrial automation platform for autonomous material handling',
    description: 'ABB Robotics continues to expand its automation portfolio with new autonomous material handling capabilities for enterprise warehouses.',
    link: 'https://example.com/news/abb-platform',
    publishedDate: '2026-07-18T08:00:00.000Z',
    sourceName: 'Industrial Automation Weekly',
    technologyTags: ['AMR', 'industrial automation'],
  },
  {
    title: 'Warehouse automation adoption accelerates across high-throughput fulfillment networks',
    description: 'New deployments emphasize AI-guided routing and flexible orchestration for logistics operations.',
    link: 'https://example.com/news/warehouse-adoption',
    publishedDate: '2026-07-15T10:30:00.000Z',
    sourceName: 'Industrial Automation Weekly',
    technologyTags: ['warehouse AI', 'fulfillment automation'],
  },
  {
    title: 'Construction robotics investment increases for site inspection and concrete workflows',
    description: 'Construction technology providers are increasing investment in robotics for inspection, monitoring, and precision deployment.',
    link: 'https://example.com/news/construction-investment',
    publishedDate: '2026-07-12T11:00:00.000Z',
    sourceName: 'Construction Robotics Monitor',
    technologyTags: ['robotic construction', 'inspection robotics'],
  },
  {
    title: 'Medical robotics teams expand surgical assist and rehabilitation deployments',
    description: 'Healthcare operators are scaling surgical and assistive robotic systems in clinical suites and rehabilitation facilities.',
    link: 'https://example.com/news/medical-robotics',
    publishedDate: '2026-07-10T13:15:00.000Z',
    sourceName: 'Medical Automation Journal',
    technologyTags: ['surgical robotics', 'rehabilitation systems'],
  },
];

const articles = rssSources.flatMap((source) => {
  const parsedItems = inbox
    .filter((entry) => entry.sourceName === source.name)
    .map((entry) => parseRssItem(entry, source));

  return buildNewsArticles(parsedItems, source);
});

export const newsArticles: NewsArticle[] = articles.sort((a, b) => new Date(b.published_date).getTime() - new Date(a.published_date).getTime());
