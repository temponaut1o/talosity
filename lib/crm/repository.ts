import 'server-only';

import { z } from 'zod';
import { getSupabaseServerClient } from '@/lib/supabase/server';
import type {
  AnalyticsSnapshot,
  CompanyRecord,
  CompanyType,
  CommunicationRecord,
  CrmDashboardState,
  DeploymentPartnerRecord,
  DocumentRecord,
  LeadRecord,
  OpportunityRecord,
  ProfileStatus,
  RobotRecord,
  VendorRequestRecord,
  VendorStatus,
} from '@/lib/crm/types';

const companySchema = z.object({
  name: z.string().min(2),
  companyType: z.enum(['manufacturer', 'integrator', 'supplier', 'dealer', 'customer', 'partner']),
  industry: z.string().default('Unassigned'),
  website: z.string().url().optional().or(z.literal('')).default(''),
  contactName: z.string().default(''),
  contactEmail: z.string().email().optional().or(z.literal('')).default(''),
  contactPhone: z.string().default(''),
  vendorStatus: z.enum(['pending', 'verified', 'suspended']).default('pending'),
  profileStatus: z.enum(['draft', 'claim-requested', 'verified', 'featured']).default('draft'),
  headquarters: z.string().default(''),
  foundedYear: z.number().int().optional().nullable(),
  annualRevenue: z.string().default(''),
  featured: z.boolean().default(false),
});

const robotSchema = z.object({
  companyId: z.string().uuid(),
  name: z.string().min(2),
  modelNumber: z.string().default(''),
  category: z.string().min(2),
  industry: z.string().default('Unassigned'),
  applications: z.array(z.string()).default([]),
  payload: z.string().default(''),
  speed: z.string().default(''),
  aiCapabilities: z.array(z.string()).default([]),
  safetyCertifications: z.array(z.string()).default([]),
  supportIncluded: z.boolean().default(true),
});

const leadSchema = z.object({
  name: z.string().min(2),
  companyId: z.string().uuid().optional().nullable(),
  company: z.string().default(''),
  email: z.string().email(),
  phone: z.string().default(''),
  industry: z.string().default('Unassigned'),
  robotInterest: z.string().default(''),
  interestedRobotId: z.string().uuid().optional().nullable(),
  assignedVendorCompanyId: z.string().uuid().optional().nullable(),
  facilitySize: z.string().default(''),
  deploymentTimeline: z.string().default(''),
  budgetRange: z.string().default(''),
  status: z.enum(['new', 'contacted', 'qualified', 'vendor-matched', 'proposal', 'closed-won', 'closed-lost']).default('new'),
  score: z.number().int().min(0).max(100).default(0),
});

const opportunitySchema = z.object({
  leadId: z.string().uuid().optional().nullable(),
  companyName: z.string().min(2),
  vendorName: z.string().default(''),
  robotInterest: z.string().default(''),
  salesStage: z.enum(['prospecting', 'qualified', 'demo', 'proposal', 'negotiation', 'won', 'lost']).default('prospecting'),
  estimatedValue: z.string().default(''),
  nextAction: z.string().default(''),
});

const vendorRequestSchema = z.object({
  companyId: z.string().uuid().optional().nullable(),
  companyName: z.string().min(2),
  requestType: z.enum(['claim', 'verification', 'update']),
  status: z.enum(['pending', 'approved', 'rejected']).default('pending'),
});

const deploymentPartnerSchema = z.object({
  companyId: z.string().uuid(),
  name: z.string().min(2),
  serviceRegion: z.string().default(''),
});

const communicationSchema = z.object({
  channel: z.enum(['email', 'call', 'meeting', 'note', 'task']),
  subject: z.string().min(2),
  relatedType: z.enum(['Lead', 'Company', 'Opportunity', 'Vendor']).default('Lead'),
  relatedName: z.string().min(2),
  followUp: z.string().default(''),
  leadId: z.string().uuid().optional().nullable(),
  companyId: z.string().uuid().optional().nullable(),
  robotId: z.string().uuid().optional().nullable(),
});

const documentSchema = z.object({
  robotId: z.string().uuid(),
  name: z.string().min(2),
  kind: z.string().min(2),
  filePath: z.string().min(2),
});

function getClient() {
  const supabase = getSupabaseServerClient();
  if (!supabase) {
    throw new Error('Supabase environment is not configured.');
  }
  return supabase;
}

function formatDate(value: string | null | undefined): string {
  if (!value) {
    return '';
  }
  return new Date(value).toISOString().slice(0, 10);
}

function table(name: string) {
  return `crm.${name}`;
}

type Row = Record<string, unknown>;

function toCompanyRecord(row: Row): CompanyRecord {
  return {
    id: String(row.id),
    name: String(row.name ?? ''),
    companyType: String(row.company_type ?? 'customer') as CompanyType,
    industry: String(row.industry ?? 'Unassigned'),
    website: String(row.website ?? ''),
    contactName: String(row.contact_name ?? ''),
    contactEmail: String(row.contact_email ?? ''),
    contactPhone: String(row.contact_phone ?? ''),
    vendorStatus: String(row.vendor_status ?? 'pending') as VendorStatus,
    profileStatus: String(row.profile_status ?? 'draft') as ProfileStatus,
    headquarters: String(row.country ?? ''),
    foundedYear: Number(row.founded_year ?? 0),
    annualRevenue: String(row.annual_revenue ?? ''),
    featured: Boolean(row.featured),
    createdAt: formatDate(String(row.created_at ?? '')),
  };
}

function toRobotRecord(row: Row): RobotRecord {
  return {
    id: String(row.id),
    name: String(row.name ?? ''),
    manufacturer: String((row.company as Row | null)?.name ?? ''),
    modelNumber: String(row.model_number ?? ''),
    category: String(row.category ?? ''),
    industry: String(row.industry ?? 'Unassigned'),
    applications: Array.isArray(row.applications) ? (row.applications as string[]) : [],
    payload: String(row.payload ?? ''),
    speed: String(row.runtime ?? ''),
    aiCapabilities: Array.isArray(row.ai_capabilities) ? (row.ai_capabilities as string[]) : [],
    safetyCertifications: Array.isArray(row.safety_certifications) ? (row.safety_certifications as string[]) : [],
    supportIncluded: Boolean(row.support_included ?? true),
    createdAt: formatDate(String(row.created_at ?? '')),
  };
}

function toLeadRecord(row: Row): LeadRecord {
  return {
    id: String(row.id),
    name: String(row.lead_name ?? ''),
    company: String((row.company as Row | null)?.name ?? row.company_name ?? ''),
    email: String(row.email ?? ''),
    phone: String(row.phone ?? ''),
    industry: String(row.industry ?? 'Unassigned'),
    robotInterest: String(row.robot_interest ?? ''),
    facilitySize: String(row.facility_size ?? ''),
    deploymentTimeline: String(row.deployment_timeline ?? ''),
    budgetRange: String(row.budget_range ?? ''),
    status: String(row.status ?? 'new') as LeadRecord['status'],
    score: Number(row.score ?? 0),
    createdAt: formatDate(String(row.created_at ?? '')),
  };
}

function toOpportunityRecord(row: Row): OpportunityRecord {
  return {
    id: String(row.id),
    leadId: String(row.lead_id ?? ''),
    companyName: String(row.company_name ?? ''),
    vendorName: String(row.vendor_name ?? ''),
    robotInterest: String(row.robot_interest ?? ''),
    salesStage: String(row.sales_stage ?? 'prospecting') as OpportunityRecord['salesStage'],
    estimatedValue: String(row.estimated_value ?? ''),
    nextAction: String(row.next_action ?? ''),
    createdAt: formatDate(String(row.created_at ?? '')),
  };
}

function toVendorRequestRecord(row: Row): VendorRequestRecord {
  return {
    id: String(row.id),
    companyName: String(row.company_name ?? ''),
    requestType: String(row.request_type ?? 'claim') as VendorRequestRecord['requestType'],
    status: String(row.status ?? 'pending') as VendorRequestRecord['status'],
    submittedAt: formatDate(String(row.submitted_at ?? row.created_at ?? '')),
  };
}

function toCommunicationRecord(row: Row): CommunicationRecord {
  return {
    id: String(row.id),
    channel: String(row.activity_type ?? 'note') as CommunicationRecord['channel'],
    subject: String(row.summary ?? ''),
    relatedType: String(row.related_type ?? 'Lead') as CommunicationRecord['relatedType'],
    relatedName: String(row.related_name ?? ''),
    followUp: formatDate(String(row.follow_up ?? '')),
    createdAt: formatDate(String(row.created_at ?? '')),
  };
}

function toDocumentRecord(row: Row): DocumentRecord {
  return {
    id: String(row.id),
    name: String(row.title ?? ''),
    kind: String(row.document_type ?? ''),
    filePath: String(row.file_path ?? ''),
    createdAt: formatDate(String(row.created_at ?? '')),
  };
}

function toDeploymentPartnerRecord(row: Row): DeploymentPartnerRecord {
  return {
    id: String(row.id),
    companyId: String(row.company_id ?? ''),
    companyName: String((row.company as Row | null)?.name ?? ''),
    name: String(row.name ?? ''),
    serviceRegion: String(row.service_region ?? ''),
    createdAt: formatDate(String(row.created_at ?? '')),
  };
}

export async function listCompanies(): Promise<CompanyRecord[]> {
  const supabase = getClient();
  const { data, error } = await supabase.from(table('companies')).select('*').order('created_at', { ascending: false });
  if (error) {
    throw error;
  }
  return (data ?? []).map((row) => toCompanyRecord(row as Row));
}

export async function createCompany(input: unknown): Promise<CompanyRecord> {
  const supabase = getClient();
  const parsed = companySchema.parse(input);
  const { data, error } = await supabase
    .from(table('companies'))
    .insert({
      name: parsed.name,
      slug: parsed.name.toLowerCase().trim().replace(/[^a-z0-9]+/g, '-'),
      company_type: parsed.companyType,
      industry: parsed.industry,
      website: parsed.website || null,
      contact_name: parsed.contactName || null,
      contact_email: parsed.contactEmail || null,
      contact_phone: parsed.contactPhone || null,
      vendor_status: parsed.vendorStatus,
      profile_status: parsed.profileStatus,
      country: parsed.headquarters || null,
      founded_year: parsed.foundedYear,
      annual_revenue: parsed.annualRevenue || null,
      featured: parsed.featured,
    })
    .select('*')
    .single();

  if (error) {
    throw error;
  }
  return toCompanyRecord(data as Row);
}

export async function updateCompany(id: string, input: unknown): Promise<CompanyRecord> {
  const supabase = getClient();
  const parsed = companySchema.partial().parse(input);
  const { data, error } = await supabase
    .from(table('companies'))
    .update({
      name: parsed.name,
      company_type: parsed.companyType,
      industry: parsed.industry,
      website: parsed.website,
      contact_name: parsed.contactName,
      contact_email: parsed.contactEmail,
      contact_phone: parsed.contactPhone,
      vendor_status: parsed.vendorStatus,
      profile_status: parsed.profileStatus,
      country: parsed.headquarters,
      founded_year: parsed.foundedYear,
      annual_revenue: parsed.annualRevenue,
      featured: parsed.featured,
    })
    .eq('id', id)
    .select('*')
    .single();
  if (error) {
    throw error;
  }
  return toCompanyRecord(data as Row);
}

export async function deleteCompany(id: string): Promise<void> {
  const supabase = getClient();
  const { error } = await supabase.from(table('companies')).delete().eq('id', id);
  if (error) {
    throw error;
  }
}

export async function listRobots(): Promise<RobotRecord[]> {
  const supabase = getClient();
  const { data, error } = await supabase
    .from(table('robots'))
    .select('*, company:companies(name)')
    .order('created_at', { ascending: false });
  if (error) {
    throw error;
  }
  return (data ?? []).map((row) => toRobotRecord(row as Row));
}

export async function createRobot(input: unknown): Promise<RobotRecord> {
  const supabase = getClient();
  const parsed = robotSchema.parse(input);
  const { data, error } = await supabase
    .from(table('robots'))
    .insert({
      company_id: parsed.companyId,
      name: parsed.name,
      model_number: parsed.modelNumber || null,
      category: parsed.category,
      industry: parsed.industry,
      applications: parsed.applications,
      payload: parsed.payload,
      runtime: parsed.speed,
      ai_capabilities: parsed.aiCapabilities,
      safety_certifications: parsed.safetyCertifications,
      support_included: parsed.supportIncluded,
    })
    .select('*, company:companies(name)')
    .single();
  if (error) {
    throw error;
  }
  return toRobotRecord(data as Row);
}

export async function updateRobot(id: string, input: unknown): Promise<RobotRecord> {
  const supabase = getClient();
  const parsed = robotSchema.partial().parse(input);
  const { data, error } = await supabase
    .from(table('robots'))
    .update({
      company_id: parsed.companyId,
      name: parsed.name,
      model_number: parsed.modelNumber,
      category: parsed.category,
      industry: parsed.industry,
      applications: parsed.applications,
      payload: parsed.payload,
      runtime: parsed.speed,
      ai_capabilities: parsed.aiCapabilities,
      safety_certifications: parsed.safetyCertifications,
      support_included: parsed.supportIncluded,
    })
    .eq('id', id)
    .select('*, company:companies(name)')
    .single();
  if (error) {
    throw error;
  }
  return toRobotRecord(data as Row);
}

export async function deleteRobot(id: string): Promise<void> {
  const supabase = getClient();
  const { error } = await supabase.from(table('robots')).delete().eq('id', id);
  if (error) {
    throw error;
  }
}

export async function listLeads(): Promise<LeadRecord[]> {
  const supabase = getClient();
  const { data, error } = await supabase
    .from(table('leads'))
    .select('*, company:companies(name)')
    .order('created_at', { ascending: false });
  if (error) {
    throw error;
  }
  return (data ?? []).map((row) => toLeadRecord(row as Row));
}

export async function getLeadById(id: string): Promise<LeadRecord | null> {
  const supabase = getClient();
  const { data, error } = await supabase
    .from(table('leads'))
    .select('*, company:companies(name)')
    .eq('id', id)
    .maybeSingle();
  if (error) {
    throw error;
  }
  if (!data) {
    return null;
  }
  return toLeadRecord(data as Row);
}

export async function createLead(input: unknown): Promise<LeadRecord> {
  const supabase = getClient();
  const parsed = leadSchema.parse(input);
  const { data, error } = await supabase
    .from(table('leads'))
    .insert({
      company_id: parsed.companyId,
      company_name: parsed.company,
      interested_robot_id: parsed.interestedRobotId,
      assigned_vendor_company_id: parsed.assignedVendorCompanyId,
      lead_name: parsed.name,
      email: parsed.email,
      phone: parsed.phone,
      industry: parsed.industry,
      robot_interest: parsed.robotInterest,
      facility_size: parsed.facilitySize,
      deployment_timeline: parsed.deploymentTimeline,
      budget_range: parsed.budgetRange,
      status: parsed.status,
      score: parsed.score,
    })
    .select('*, company:companies(name)')
    .single();
  if (error) {
    throw error;
  }
  return toLeadRecord(data as Row);
}

export async function updateLead(id: string, input: unknown): Promise<LeadRecord> {
  const supabase = getClient();
  const parsed = leadSchema.partial().parse(input);
  const { data, error } = await supabase
    .from(table('leads'))
    .update({
      company_id: parsed.companyId,
      company_name: parsed.company,
      interested_robot_id: parsed.interestedRobotId,
      assigned_vendor_company_id: parsed.assignedVendorCompanyId,
      lead_name: parsed.name,
      email: parsed.email,
      phone: parsed.phone,
      industry: parsed.industry,
      robot_interest: parsed.robotInterest,
      facility_size: parsed.facilitySize,
      deployment_timeline: parsed.deploymentTimeline,
      budget_range: parsed.budgetRange,
      status: parsed.status,
      score: parsed.score,
    })
    .eq('id', id)
    .select('*, company:companies(name)')
    .single();

  if (error) {
    throw error;
  }
  return toLeadRecord(data as Row);
}

export async function deleteLead(id: string): Promise<void> {
  const supabase = getClient();
  const { error } = await supabase.from(table('leads')).delete().eq('id', id);
  if (error) {
    throw error;
  }
}

export async function listOpportunities(): Promise<OpportunityRecord[]> {
  const supabase = getClient();
  const { data, error } = await supabase.from(table('opportunities')).select('*').order('created_at', { ascending: false });
  if (error) {
    throw error;
  }
  return (data ?? []).map((row) => toOpportunityRecord(row as Row));
}

export async function createOpportunity(input: unknown): Promise<OpportunityRecord> {
  const supabase = getClient();
  const parsed = opportunitySchema.parse(input);
  const { data, error } = await supabase
    .from(table('opportunities'))
    .insert({
      lead_id: parsed.leadId,
      company_name: parsed.companyName,
      vendor_name: parsed.vendorName,
      robot_interest: parsed.robotInterest,
      sales_stage: parsed.salesStage,
      estimated_value: parsed.estimatedValue,
      next_action: parsed.nextAction,
    })
    .select('*')
    .single();
  if (error) {
    throw error;
  }
  return toOpportunityRecord(data as Row);
}

export async function updateOpportunity(id: string, input: unknown): Promise<OpportunityRecord> {
  const supabase = getClient();
  const parsed = opportunitySchema.partial().parse(input);
  const { data, error } = await supabase
    .from(table('opportunities'))
    .update({
      lead_id: parsed.leadId,
      company_name: parsed.companyName,
      vendor_name: parsed.vendorName,
      robot_interest: parsed.robotInterest,
      sales_stage: parsed.salesStage,
      estimated_value: parsed.estimatedValue,
      next_action: parsed.nextAction,
    })
    .eq('id', id)
    .select('*')
    .single();
  if (error) {
    throw error;
  }
  return toOpportunityRecord(data as Row);
}

export async function deleteOpportunity(id: string): Promise<void> {
  const supabase = getClient();
  const { error } = await supabase.from(table('opportunities')).delete().eq('id', id);
  if (error) {
    throw error;
  }
}

export async function listVendorRequests(): Promise<VendorRequestRecord[]> {
  const supabase = getClient();
  const { data, error } = await supabase.from(table('vendor_requests')).select('*').order('submitted_at', { ascending: false });
  if (error) {
    throw error;
  }
  return (data ?? []).map((row) => toVendorRequestRecord(row as Row));
}

export async function createVendorRequest(input: unknown): Promise<VendorRequestRecord> {
  const supabase = getClient();
  const parsed = vendorRequestSchema.parse(input);
  const { data, error } = await supabase
    .from(table('vendor_requests'))
    .insert({
      company_id: parsed.companyId,
      company_name: parsed.companyName,
      request_type: parsed.requestType,
      status: parsed.status,
    })
    .select('*')
    .single();
  if (error) {
    throw error;
  }
  return toVendorRequestRecord(data as Row);
}

export async function updateVendorRequest(id: string, input: unknown): Promise<VendorRequestRecord> {
  const supabase = getClient();
  const parsed = vendorRequestSchema.partial().parse(input);
  const { data, error } = await supabase
    .from(table('vendor_requests'))
    .update({
      company_id: parsed.companyId,
      company_name: parsed.companyName,
      request_type: parsed.requestType,
      status: parsed.status,
    })
    .eq('id', id)
    .select('*')
    .single();

  if (error) {
    throw error;
  }
  return toVendorRequestRecord(data as Row);
}

export async function deleteVendorRequest(id: string): Promise<void> {
  const supabase = getClient();
  const { error } = await supabase.from(table('vendor_requests')).delete().eq('id', id);
  if (error) {
    throw error;
  }
}

export async function listDeploymentPartners(): Promise<DeploymentPartnerRecord[]> {
  const supabase = getClient();
  const { data, error } = await supabase
    .from(table('deployment_partners'))
    .select('*, company:companies(name)')
    .order('created_at', { ascending: false });
  if (error) {
    throw error;
  }
  return (data ?? []).map((row) => toDeploymentPartnerRecord(row as Row));
}

export async function createDeploymentPartner(input: unknown): Promise<DeploymentPartnerRecord> {
  const supabase = getClient();
  const parsed = deploymentPartnerSchema.parse(input);
  const { data, error } = await supabase
    .from(table('deployment_partners'))
    .insert({
      company_id: parsed.companyId,
      name: parsed.name,
      service_region: parsed.serviceRegion,
    })
    .select('*, company:companies(name)')
    .single();
  if (error) {
    throw error;
  }
  return toDeploymentPartnerRecord(data as Row);
}

export async function updateDeploymentPartner(id: string, input: unknown): Promise<DeploymentPartnerRecord> {
  const supabase = getClient();
  const parsed = deploymentPartnerSchema.partial().parse(input);
  const { data, error } = await supabase
    .from(table('deployment_partners'))
    .update({
      company_id: parsed.companyId,
      name: parsed.name,
      service_region: parsed.serviceRegion,
    })
    .eq('id', id)
    .select('*, company:companies(name)')
    .single();
  if (error) {
    throw error;
  }
  return toDeploymentPartnerRecord(data as Row);
}

export async function deleteDeploymentPartner(id: string): Promise<void> {
  const supabase = getClient();
  const { error } = await supabase.from(table('deployment_partners')).delete().eq('id', id);
  if (error) {
    throw error;
  }
}

export async function listCommunications(): Promise<CommunicationRecord[]> {
  const supabase = getClient();
  const { data, error } = await supabase
    .from(table('crm_activities'))
    .select('*')
    .order('created_at', { ascending: false })
    .limit(100);
  if (error) {
    throw error;
  }

  return (data ?? []).map((row) => {
    const activity = row as Row;
    return toCommunicationRecord({
      id: activity.id,
      activity_type: activity.activity_type,
      summary: activity.summary,
      related_type: activity.related_type,
      related_name: activity.related_name,
      follow_up: activity.follow_up,
      created_at: activity.created_at,
    });
  });
}

export async function createCommunication(input: unknown): Promise<CommunicationRecord> {
  const supabase = getClient();
  const parsed = communicationSchema.parse(input);
  const { data, error } = await supabase
    .from(table('crm_activities'))
    .insert({
      activity_type: parsed.channel,
      summary: parsed.subject,
      related_type: parsed.relatedType,
      related_name: parsed.relatedName,
      follow_up: parsed.followUp || null,
      lead_id: parsed.leadId,
      company_id: parsed.companyId,
      robot_id: parsed.robotId,
    })
    .select('*')
    .single();
  if (error) {
    throw error;
  }
  return toCommunicationRecord(data as Row);
}

export async function listDocuments(): Promise<DocumentRecord[]> {
  const supabase = getClient();
  const { data, error } = await supabase
    .from(table('robot_documents'))
    .select('*')
    .order('created_at', { ascending: false })
    .limit(100);
  if (error) {
    throw error;
  }
  return (data ?? []).map((row) => toDocumentRecord(row as Row));
}

export async function createDocument(input: unknown): Promise<DocumentRecord> {
  const supabase = getClient();
  const parsed = documentSchema.parse(input);
  const { data, error } = await supabase
    .from(table('robot_documents'))
    .insert({
      robot_id: parsed.robotId,
      title: parsed.name,
      document_type: parsed.kind,
      file_path: parsed.filePath,
    })
    .select('*')
    .single();
  if (error) {
    throw error;
  }
  return toDocumentRecord(data as Row);
}

export async function listAnalyticsSnapshots(): Promise<AnalyticsSnapshot[]> {
  const supabase = getClient();
  const { data, error } = await supabase
    .from(table('analytics_snapshots'))
    .select('*')
    .order('captured_at', { ascending: false })
    .limit(12);
  if (error) {
    throw error;
  }

  return (data ?? []).map((row) => ({
    id: String(row.id),
    label: String(row.label ?? ''),
    value: String(row.value_text ?? ''),
    trend: String(row.trend ?? ''),
    capturedAt: String(row.captured_at ?? ''),
  }));
}

export async function getCrmDashboardState(): Promise<CrmDashboardState> {
  const [
    companies,
    robots,
    leads,
    opportunities,
    vendorRequests,
    analytics,
    industriesCount,
    partnersCount,
  ] = await Promise.all([
    listCompanies(),
    listRobots(),
    listLeads(),
    listOpportunities(),
    listVendorRequests(),
    listAnalyticsSnapshots(),
    countTable('industries'),
    countTable('deployment_partners'),
  ]);

  return {
    metrics: {
      totalCompanies: companies.length,
      totalRobots: robots.length,
      totalIndustries: industriesCount,
      totalCategories: new Set(robots.map((robot) => robot.category)).size,
      totalVendors: partnersCount,
      totalLeads: leads.length,
      pendingReviews: vendorRequests.filter((request) => request.status === 'pending').length,
      recentlyAddedRobots: robots.filter((robot) => {
        const createdAt = new Date(robot.createdAt);
        return Date.now() - createdAt.getTime() < 1000 * 60 * 60 * 24 * 30;
      }).length,
      recentlyUpdatedCompanies: companies.filter((company) => {
        const createdAt = new Date(company.createdAt);
        return Date.now() - createdAt.getTime() < 1000 * 60 * 60 * 24 * 30;
      }).length,
      recentlyPublishedNews: 0,
      recentVendorActivity: vendorRequests.length,
      searchAnalytics: analytics.length,
      leadConversionMetrics: analytics.find((item) => item.label.toLowerCase().includes('conversion'))?.value ?? 'N/A',
    },
    leads,
    companies,
    robots,
    opportunities,
    vendorRequests,
    newsItems: [],
    analytics,
  };
}

export async function countTable(entity: string): Promise<number> {
  const supabase = getClient();
  const { count, error } = await supabase.from(table(entity)).select('*', { count: 'exact', head: true });
  if (error) {
    throw error;
  }
  return count ?? 0;
}
