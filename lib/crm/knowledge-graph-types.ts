export type UUID = string;

export interface Timestamps {
  created_at: string;
  updated_at: string;
}

export interface Industry extends Timestamps {
  id: UUID;
  name: string;
  slug: string;
  description: string | null;
}

export interface Application extends Timestamps {
  id: UUID;
  name: string;
  slug: string;
  description: string | null;
}

export interface Company extends Timestamps {
  id: UUID;
  name: string;
  slug: string;
  website: string | null;
  country: string | null;
  company_type: 'manufacturer' | 'integrator' | 'supplier' | 'dealer' | 'customer' | 'partner';
  vendor_status: 'pending' | 'verified' | 'suspended';
  profile_status: 'draft' | 'claim-requested' | 'verified' | 'featured';
}

export interface Robot extends Timestamps {
  id: UUID;
  company_id: UUID;
  name: string;
  model_number: string | null;
  category: string;
  payload: string | null;
  runtime: string | null;
  navigation: string | null;
  ai_capabilities: string[];
}

export interface DeploymentPartner extends Timestamps {
  id: UUID;
  company_id: UUID;
  name: string;
  service_region: string | null;
}

export interface Lead extends Timestamps {
  id: UUID;
  company_id: UUID | null;
  interested_robot_id: UUID | null;
  assigned_vendor_company_id: UUID | null;
  lead_name: string;
  email: string;
  phone: string | null;
  status: 'new' | 'contacted' | 'qualified' | 'vendor-matched' | 'proposal' | 'closed-won' | 'closed-lost';
}

export interface Meeting extends Timestamps {
  id: UUID;
  lead_id: UUID | null;
  company_id: UUID | null;
  title: string;
  scheduled_at: string;
  outcome: string | null;
}

export interface Partnership extends Timestamps {
  id: UUID;
  primary_company_id: UUID;
  secondary_company_id: UUID;
  partnership_type: string;
  status: 'active' | 'inactive' | 'pending';
}

export interface RobotCertification extends Timestamps {
  id: UUID;
  robot_id: UUID;
  certification_name: string;
  issuer: string | null;
  expires_at: string | null;
}

export interface RobotDocument extends Timestamps {
  id: UUID;
  robot_id: UUID;
  document_type: string;
  file_path: string;
  title: string;
}

export interface VendorContact extends Timestamps {
  id: UUID;
  company_id: UUID;
  full_name: string;
  email: string;
  role_title: string | null;
}

export interface CrmActivity extends Timestamps {
  id: UUID;
  activity_type: 'email' | 'call' | 'meeting' | 'note' | 'task';
  summary: string;
  lead_id: UUID | null;
  company_id: UUID | null;
  robot_id: UUID | null;
}

export interface CompanyRelationship extends Timestamps {
  id: UUID;
  source_company_id: UUID;
  target_company_id: UUID;
  relationship_type: string;
  confidence_score: number;
}

export interface RobotRelationship extends Timestamps {
  id: UUID;
  source_robot_id: UUID;
  target_robot_id: UUID;
  relationship_type: string;
  confidence_score: number;
}

export const KNOWLEDGE_GRAPH_ENTITIES = [
  'companies',
  'robots',
  'industries',
  'applications',
  'deployment_partners',
  'leads',
  'meetings',
  'partnerships',
  'robot_certifications',
  'robot_documents',
  'vendor_contacts',
  'crm_activities',
  'company_relationships',
  'robot_relationships',
] as const;

export type KnowledgeGraphEntity = (typeof KNOWLEDGE_GRAPH_ENTITIES)[number];
