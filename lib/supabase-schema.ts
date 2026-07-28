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
  {
    name: 'crm_companies',
    fields: ['id', 'name', 'company_type', 'industry', 'website', 'contact_name', 'contact_email', 'contact_phone', 'vendor_status', 'profile_status', 'featured'],
  },
  {
    name: 'crm_robots',
    fields: ['id', 'name', 'manufacturer', 'model_number', 'category', 'industry', 'applications', 'payload', 'speed', 'ai_capabilities', 'safety_certifications'],
  },
  {
    name: 'crm_leads',
    fields: ['id', 'name', 'company', 'email', 'phone', 'industry', 'robot_interest', 'facility_size', 'deployment_timeline', 'budget_range', 'status', 'score'],
  },
  {
    name: 'crm_opportunities',
    fields: ['id', 'lead_id', 'company_name', 'vendor_name', 'robot_interest', 'sales_stage', 'estimated_value', 'next_action'],
  },
  {
    name: 'crm_vendor_requests',
    fields: ['id', 'company_name', 'request_type', 'status', 'submitted_at'],
  },
];
