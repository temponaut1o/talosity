import { z } from 'zod';

export type NewsCategoryId = 'commercial-cleaning' | 'warehouse-automation' | 'construction' | 'medical' | 'robotics';

export interface NewsArticle {
  id: string;
  title: string;
  slug: string;
  summary: string;
  content: string;
  source_name: string;
  source_url: string;
  image_url?: string;
  published_date: string;
  category_id: NewsCategoryId;
  company_id?: string;
  robot_type: string;
  technology_tags: string[];
  created_at: string;
}

export interface RssSourceConfig {
  name: string;
  url: string;
  category: NewsCategoryId;
  technology_tags: string[];
}

export interface ParsedRssItem {
  title: string;
  description: string;
  link: string;
  publishedDate: string;
  sourceName: string;
  category: NewsCategoryId;
  technologyTags: string[];
}

export const rssItemSchema = z.object({
  title: z.string().min(1),
  description: z.string().min(1),
  link: z.string().url(),
  publishedDate: z.string(),
  sourceName: z.string().min(1),
  category: z.enum(['commercial-cleaning', 'warehouse-automation', 'construction', 'medical', 'robotics']),
  technologyTags: z.array(z.string()),
});
