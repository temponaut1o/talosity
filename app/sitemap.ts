import type { MetadataRoute } from 'next';
import { companies, industries, robots } from '../lib/placeholder-data';

const baseUrl = 'https://www.talosity.com';

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes = ['/', '/directory', '/news'];
  const industryRoutes = industries.map((industry) => `/industries/${industry.id}`);
  const companyRoutes = companies.map((company) => `/companies/${company.id}`);
  const robotRoutes = robots.map((robot) => `/robots/${robot.id}`);

  const allRoutes = [...staticRoutes, ...industryRoutes, ...companyRoutes, ...robotRoutes];

  return allRoutes.map((route) => ({
    url: `${baseUrl}${route}`,
    lastModified: new Date(),
    changeFrequency: route === '/' ? 'weekly' : 'monthly',
    priority: route === '/' ? 1 : 0.8,
  }));
}
