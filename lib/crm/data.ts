import type {
  AnalyticsSnapshot,
  CompanyRecord,
  CrmDashboardState,
  LeadInput,
  LeadRecord,
  NewsRecord,
  OpportunityRecord,
  RobotRecord,
  VendorRequestRecord,
} from '@/lib/crm/types';

const companiesSeed: CompanyRecord[] = [
  {
    id: 'cmp-001',
    name: 'Aegis Operations',
    companyType: 'manufacturer',
    industry: 'Commercial Cleaning',
    website: 'https://aegisops.example',
    contactName: 'Mina Alvarez',
    contactEmail: 'mina@aegisops.example',
    contactPhone: '+1-312-555-0109',
    vendorStatus: 'verified',
    profileStatus: 'featured',
    headquarters: 'Chicago, USA',
    foundedYear: 2014,
    annualRevenue: '$18M',
    featured: true,
    createdAt: '2024-03-18',
  },
  {
    id: 'cmp-002',
    name: 'Northstar Logix',
    companyType: 'integrator',
    industry: 'Warehouse Automation',
    website: 'https://northstarlogix.example',
    contactName: 'Derek Shah',
    contactEmail: 'derek@northstarlogix.example',
    contactPhone: '+1-513-555-0182',
    vendorStatus: 'verified',
    profileStatus: 'verified',
    headquarters: 'Cincinnati, USA',
    foundedYear: 2008,
    annualRevenue: '$42M',
    featured: true,
    createdAt: '2024-04-02',
  },
  {
    id: 'cmp-003',
    name: 'Kinetic Fabrication',
    companyType: 'supplier',
    industry: 'Material Handling',
    website: 'https://kineticfabrication.example',
    contactName: 'Rae Chen',
    contactEmail: 'rae@kineticfabrication.example',
    contactPhone: '+1-206-555-0198',
    vendorStatus: 'pending',
    profileStatus: 'claim-requested',
    headquarters: 'Seattle, USA',
    foundedYear: 2019,
    annualRevenue: '$9M',
    featured: false,
    createdAt: '2024-06-14',
  },
];

const robotsSeed: RobotRecord[] = [
  {
    id: 'rbt-001',
    name: 'Aegis Sweep X3',
    manufacturer: 'Aegis Operations',
    modelNumber: 'ASX3',
    category: 'Warehouse Automation',
    industry: 'Commercial Cleaning',
    applications: ['Facility sanitation', 'Route planning'],
    payload: '120 kg',
    speed: '1.4 m/s',
    aiCapabilities: ['SLAM', 'Fleet optimization'],
    safetyCertifications: ['ANSI/RIA R15.08', 'ISO 3691'],
    supportIncluded: true,
    createdAt: '2024-05-01',
  },
  {
    id: 'rbt-002',
    name: 'Northstar Mover 8',
    manufacturer: 'Northstar Logix',
    modelNumber: 'NM8',
    category: 'Material Handling',
    industry: 'Warehouse Automation',
    applications: ['Pallet transport', 'Order fulfillment'],
    payload: '800 kg',
    speed: '2.0 m/s',
    aiCapabilities: ['Computer vision', 'Fleet orchestration'],
    safetyCertifications: ['ISO 13849', 'ANSI/RIA R15.06'],
    supportIncluded: true,
    createdAt: '2024-05-11',
  },
];

const leadsSeed: LeadRecord[] = [
  {
    id: 'lead-001',
    name: 'Jordan Kee',
    company: 'BlueHarbor Logistics',
    email: 'jordan@blueharbor.example',
    phone: '+1-617-555-0123',
    industry: 'Distribution',
    robotInterest: 'Autonomous pallet transport',
    facilitySize: '250,000 sq ft',
    deploymentTimeline: '90 days',
    budgetRange: '$250k-$500k',
    status: 'qualified',
    score: 91,
    createdAt: '2024-07-10',
  },
  {
    id: 'lead-002',
    name: 'Priya Nair',
    company: 'Harborview Medical',
    email: 'priya@harborview.example',
    phone: '+1-206-555-0145',
    industry: 'Healthcare',
    robotInterest: 'Sanitation robots',
    facilitySize: '120,000 sq ft',
    deploymentTimeline: '180 days',
    budgetRange: '$100k-$250k',
    status: 'vendor-matched',
    score: 84,
    createdAt: '2024-07-13',
  },
];

const opportunitiesSeed: OpportunityRecord[] = [
  {
    id: 'opp-001',
    leadId: 'lead-001',
    companyName: 'BlueHarbor Logistics',
    vendorName: 'Northstar Logix',
    robotInterest: 'Autonomous pallet transport',
    salesStage: 'proposal',
    estimatedValue: '$420k',
    nextAction: 'Send ROI model and implementation plan',
    createdAt: '2024-07-11',
  },
];

const vendorRequestsSeed: VendorRequestRecord[] = [
  {
    id: 'vendor-req-001',
    companyName: 'Kinetic Fabrication',
    requestType: 'claim',
    status: 'pending',
    submittedAt: '2024-07-16',
  },
  {
    id: 'vendor-req-002',
    companyName: 'Metro Robotics',
    requestType: 'verification',
    status: 'approved',
    submittedAt: '2024-07-12',
  },
];

const newsSeed: NewsRecord[] = [
  {
    id: 'news-001',
    title: 'Warehouse automation demand accelerates in Q3',
    category: 'Market Report',
    publishedAt: '2024-07-18',
    relatedCompany: 'Northstar Logix',
  },
  {
    id: 'news-002',
    title: 'Facility robotics adoption expands in healthcare',
    category: 'Product Launch',
    publishedAt: '2024-07-15',
    relatedCompany: 'Aegis Operations',
  },
];

const analyticsSeed: AnalyticsSnapshot[] = [
  { label: 'Lead conversion', value: '18%', trend: '+4.2%' },
  { label: 'Vendor response time', value: '2.1 days', trend: '-0.4 days' },
  { label: 'Search growth', value: '+31%', trend: '+8%' },
];

const crmState: CrmDashboardState = {
  metrics: {
    totalCompanies: companiesSeed.length,
    totalRobots: robotsSeed.length,
    totalIndustries: 8,
    totalCategories: 12,
    totalVendors: 6,
    totalLeads: leadsSeed.length,
    totalNewsletterSubscribers: 1842,
    totalAffiliateRevenue: '$126k',
    pendingReviews: vendorRequestsSeed.filter((request) => request.status === 'pending').length,
    recentlyAddedRobots: 2,
    recentlyUpdatedCompanies: 3,
    recentlyPublishedNews: newsSeed.length,
    recentVendorActivity: 4,
    searchAnalytics: 1280,
    leadConversionMetrics: '18%',
  },
  leads: leadsSeed,
  companies: companiesSeed,
  robots: robotsSeed,
  opportunities: opportunitiesSeed,
  vendorRequests: vendorRequestsSeed,
  newsItems: newsSeed,
  analytics: analyticsSeed,
};

export function getCrmDashboardState(): CrmDashboardState {
  return crmState;
}

export function createLeadRecord(input: LeadInput): LeadRecord {
  const nextLead: LeadRecord = {
    id: `lead-${Date.now()}`,
    name: input.name,
    company: input.company,
    email: input.email,
    phone: input.phone,
    industry: input.industry,
    robotInterest: input.robotInterest,
    facilitySize: input.facilitySize,
    deploymentTimeline: input.deploymentTimeline,
    budgetRange: input.budgetRange,
    status: input.status ?? 'new',
    score: 68,
    createdAt: new Date().toISOString().slice(0, 10),
  };

  crmState.leads.unshift(nextLead);
  crmState.metrics.totalLeads = crmState.leads.length;
  return nextLead;
}

export function createCompanyRecord(input: Omit<CompanyRecord, 'id' | 'createdAt' | 'featured'> & { featured?: boolean }): CompanyRecord {
  const nextCompany: CompanyRecord = {
    id: `cmp-${Date.now()}`,
    name: input.name,
    companyType: input.companyType,
    industry: input.industry,
    website: input.website,
    contactName: input.contactName,
    contactEmail: input.contactEmail,
    contactPhone: input.contactPhone,
    vendorStatus: input.vendorStatus,
    profileStatus: input.profileStatus,
    headquarters: input.headquarters,
    foundedYear: input.foundedYear,
    annualRevenue: input.annualRevenue,
    featured: input.featured ?? false,
    createdAt: new Date().toISOString().slice(0, 10),
  };

  crmState.companies.unshift(nextCompany);
  crmState.metrics.totalCompanies = crmState.companies.length;
  return nextCompany;
}

export function createRobotRecord(input: Omit<RobotRecord, 'id' | 'createdAt'>): RobotRecord {
  const nextRobot: RobotRecord = {
    id: `rbt-${Date.now()}`,
    name: input.name,
    manufacturer: input.manufacturer,
    modelNumber: input.modelNumber,
    category: input.category,
    industry: input.industry,
    applications: input.applications,
    payload: input.payload,
    speed: input.speed,
    aiCapabilities: input.aiCapabilities,
    safetyCertifications: input.safetyCertifications,
    supportIncluded: input.supportIncluded,
    createdAt: new Date().toISOString().slice(0, 10),
  };

  crmState.robots.unshift(nextRobot);
  crmState.metrics.totalRobots = crmState.robots.length;
  return nextRobot;
}

export function getLeadById(id: string): LeadRecord | undefined {
  return crmState.leads.find((lead) => lead.id === id);
}
