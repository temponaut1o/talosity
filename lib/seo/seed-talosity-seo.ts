import 'server-only';

import { upsertSeoMetadata } from '@/lib/seo/seo-service';
import type { UpsertSeoMetadataInput, UpsertSeoMetadataResult } from '@/lib/seo/types';

const TALOSITY_SEO_SEED_RECORDS: UpsertSeoMetadataInput[] = [
  {
    pageUrl: 'https://talosity.com/robots',
    pageType: 'category',
    targetKeyword: 'industrial robotics directory',
    pageContent:
      'Talosity intelligence platform covering commercial and industrial robotics including warehouse automation robots, cleaning robots, construction robotics, and medical robotics.',
    schemaMarkup: {},
  },
  {
    pageUrl: 'https://talosity.com/industries/warehouse',
    pageType: 'industry',
    targetKeyword: 'warehouse automation robots',
    pageContent:
      'Warehouse robotics intelligence covering autonomous mobile robots, material handling automation, and industrial deployment solutions.',
    schemaMarkup: {},
  },
  {
    pageUrl: 'https://talosity.com/industries/cleaning',
    pageType: 'industry',
    targetKeyword: 'commercial cleaning robots',
    pageContent:
      'Commercial facility robotics including autonomous cleaning systems and robotic maintenance platforms.',
    schemaMarkup: {},
  },
];

export interface TalositySeoSeedResult {
  inserted: number;
  records: UpsertSeoMetadataResult[];
}

export async function seedTalositySeo(): Promise<TalositySeoSeedResult> {
  const records: UpsertSeoMetadataResult[] = [];

  for (const seedInput of TALOSITY_SEO_SEED_RECORDS) {
    const result = await upsertSeoMetadata(seedInput);
    records.push(result);
  }

  return {
    inserted: records.length,
    records,
  };
}
