import type { RssSourceConfig } from '@/lib/rss/types';

export const rssSources: RssSourceConfig[] = [
  {
    name: 'Industrial Automation Weekly',
    url: 'https://example.com/industrial-automation-rss',
    category: 'warehouse-automation',
    technology_tags: ['AMR', 'warehouse AI', 'fulfillment automation'],
  },
  {
    name: 'Construction Robotics Monitor',
    url: 'https://example.com/construction-rss',
    category: 'construction',
    technology_tags: ['robotic construction', '3D printing', 'inspection robotics'],
  },
  {
    name: 'Medical Automation Journal',
    url: 'https://example.com/medical-rss',
    category: 'medical',
    technology_tags: ['surgical robotics', 'rehabilitation systems'],
  },
  {
    name: 'Facilities Robotics Review',
    url: 'https://example.com/facilities-rss',
    category: 'commercial-cleaning',
    technology_tags: ['autonomous floor care', 'facility automation'],
  },
];
