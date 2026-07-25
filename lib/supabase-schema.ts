export const supabaseTables = [
  {
    name: 'companies',
    fields: ['id', 'name', 'slug', 'description', 'founded_year', 'location', 'website', 'industry_id'],
  },
  {
    name: 'robots',
    fields: ['id', 'company_id', 'name', 'description', 'payload', 'runtime', 'navigation', 'applications'],
  },
  {
    name: 'industries',
    fields: ['id', 'name', 'description'],
  },
  {
    name: 'leads',
    fields: ['id', 'company', 'contact', 'email', 'interest'],
  },
  {
    name: 'newsletter_signups',
    fields: ['id', 'email', 'created_at'],
  },
];
