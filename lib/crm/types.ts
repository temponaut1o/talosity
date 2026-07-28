export type CompanyType = 'manufacturer' | 'integrator' | 'supplier' | 'customer';
export type VendorStatus = 'pending' | 'verified' | 'suspended';
export type ProfileStatus = 'draft' | 'claim-requested' | 'verified' | 'featured';
export type LeadStatus = 'new' | 'contacted' | 'qualified' | 'vendor-matched' | 'proposal' | 'closed-won' | 'closed-lost' | 'visitor' | 'opportunity' | 'follow-up' | 'converted';
export type SalesStage = 'prospecting' | 'qualified' | 'demo' | 'proposal' | 'negotiation' | 'won' | 'lost';
export type CRMUserRole =
  | 'super-admin'
  | 'administrator'
  | 'editor'
  | 'research-analyst'
  | 'sales'
  | 'marketing'
  | 'vendor-manager'
  | 'vendor-user'
  | 'read-only';

export interface CompanyRecord {
  id: string;
  name: string;
  companyType: CompanyType;
  industry: string;
  website: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  vendorStatus: VendorStatus;
  profileStatus: ProfileStatus;
  headquarters: string;
  foundedYear: number;
  annualRevenue: string;
  featured: boolean;
  createdAt: string;
}

export interface RobotRecord {
  id: string;
  name: string;
  manufacturer: string;
  modelNumber: string;
  category: string;
  industry: string;
  applications: string[];
  payload: string;
  speed: string;
  aiCapabilities: string[];
  safetyCertifications: string[];
  supportIncluded: boolean;
  createdAt: string;
}

export interface LeadRecord {
  id: string;
  name: string;
  company: string;
  email: string;
  phone: string;
  industry: string;
  robotInterest: string;
  facilitySize: string;
  deploymentTimeline: string;
  budgetRange: string;
  status: LeadStatus;
  score: number;
  createdAt: string;
}

export interface OpportunityRecord {
  id: string;
  leadId: string;
  companyName: string;
  vendorName: string;
  robotInterest: string;
  salesStage: SalesStage;
  estimatedValue: string;
  nextAction: string;
  createdAt: string;
}

export interface VendorRequestRecord {
  id: string;
  companyName: string;
  requestType: 'claim' | 'verification' | 'update';
  status: 'pending' | 'approved' | 'rejected';
  submittedAt: string;
}

export interface NewsRecord {
  id: string;
  title: string;
  category: string;
  publishedAt: string;
  relatedCompany: string;
}

export interface AnalyticsSnapshot {
  label: string;
  value: string;
  trend: string;
}

export interface CrmDashboardState {
  metrics: Record<string, number | string>;
  leads: LeadRecord[];
  companies: CompanyRecord[];
  robots: RobotRecord[];
  opportunities: OpportunityRecord[];
  vendorRequests: VendorRequestRecord[];
  newsItems: NewsRecord[];
  analytics: AnalyticsSnapshot[];
}

export interface LeadInput {
  name: string;
  company: string;
  email: string;
  phone: string;
  industry: string;
  robotInterest: string;
  facilitySize: string;
  deploymentTimeline: string;
  budgetRange: string;
  status?: LeadStatus;
}
