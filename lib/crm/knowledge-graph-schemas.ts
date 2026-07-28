import { z } from 'zod';
import { KNOWLEDGE_GRAPH_ENTITIES, type KnowledgeGraphEntity } from '@/lib/crm/knowledge-graph-types';

const uuid = z.string().uuid();
const slug = z.string().min(2).max(120).regex(/^[a-z0-9-]+$/);

export const createSchemas = {
  industries: z.object({
    name: z.string().min(2),
    slug,
    description: z.string().optional().nullable(),
  }),
  applications: z.object({
    name: z.string().min(2),
    slug,
    description: z.string().optional().nullable(),
  }),
  companies: z.object({
    name: z.string().min(2),
    slug,
    website: z.string().url().optional().nullable(),
    country: z.string().optional().nullable(),
    company_type: z.enum(['manufacturer', 'integrator', 'supplier', 'dealer', 'customer', 'partner']),
    vendor_status: z.enum(['pending', 'verified', 'suspended']).default('pending'),
    profile_status: z.enum(['draft', 'claim-requested', 'verified', 'featured']).default('draft'),
  }),
  robots: z.object({
    company_id: uuid,
    name: z.string().min(2),
    model_number: z.string().optional().nullable(),
    category: z.string().min(2),
    payload: z.string().optional().nullable(),
    runtime: z.string().optional().nullable(),
    navigation: z.string().optional().nullable(),
    ai_capabilities: z.array(z.string()).default([]),
  }),
  deployment_partners: z.object({
    company_id: uuid,
    name: z.string().min(2),
    service_region: z.string().optional().nullable(),
  }),
  leads: z.object({
    company_id: uuid.optional().nullable(),
    interested_robot_id: uuid.optional().nullable(),
    assigned_vendor_company_id: uuid.optional().nullable(),
    lead_name: z.string().min(2),
    email: z.string().email(),
    phone: z.string().optional().nullable(),
    status: z.enum(['new', 'contacted', 'qualified', 'vendor-matched', 'proposal', 'closed-won', 'closed-lost']).default('new'),
  }),
  meetings: z.object({
    lead_id: uuid.optional().nullable(),
    company_id: uuid.optional().nullable(),
    title: z.string().min(2),
    scheduled_at: z.string().datetime(),
    outcome: z.string().optional().nullable(),
  }),
  partnerships: z.object({
    primary_company_id: uuid,
    secondary_company_id: uuid,
    partnership_type: z.string().min(2),
    status: z.enum(['active', 'inactive', 'pending']).default('pending'),
  }),
  robot_certifications: z.object({
    robot_id: uuid,
    certification_name: z.string().min(2),
    issuer: z.string().optional().nullable(),
    expires_at: z.string().datetime().optional().nullable(),
  }),
  robot_documents: z.object({
    robot_id: uuid,
    document_type: z.string().min(2),
    file_path: z.string().min(2),
    title: z.string().min(2),
  }),
  vendor_contacts: z.object({
    company_id: uuid,
    full_name: z.string().min(2),
    email: z.string().email(),
    role_title: z.string().optional().nullable(),
  }),
  crm_activities: z.object({
    activity_type: z.enum(['email', 'call', 'meeting', 'note', 'task']),
    summary: z.string().min(2),
    lead_id: uuid.optional().nullable(),
    company_id: uuid.optional().nullable(),
    robot_id: uuid.optional().nullable(),
  }),
  company_relationships: z.object({
    source_company_id: uuid,
    target_company_id: uuid,
    relationship_type: z.string().min(2),
    confidence_score: z.number().min(0).max(1).default(0.5),
  }),
  robot_relationships: z.object({
    source_robot_id: uuid,
    target_robot_id: uuid,
    relationship_type: z.string().min(2),
    confidence_score: z.number().min(0).max(1).default(0.5),
  }),
} satisfies Record<KnowledgeGraphEntity, z.ZodTypeAny>;

export const updateSchemas: Record<KnowledgeGraphEntity, z.ZodTypeAny> = {
  industries: createSchemas.industries.partial(),
  applications: createSchemas.applications.partial(),
  companies: createSchemas.companies.partial(),
  robots: createSchemas.robots.partial(),
  deployment_partners: createSchemas.deployment_partners.partial(),
  leads: createSchemas.leads.partial(),
  meetings: createSchemas.meetings.partial(),
  partnerships: createSchemas.partnerships.partial(),
  robot_certifications: createSchemas.robot_certifications.partial(),
  robot_documents: createSchemas.robot_documents.partial(),
  vendor_contacts: createSchemas.vendor_contacts.partial(),
  crm_activities: createSchemas.crm_activities.partial(),
  company_relationships: createSchemas.company_relationships.partial(),
  robot_relationships: createSchemas.robot_relationships.partial(),
};

export const entityNameSchema = z.enum(KNOWLEDGE_GRAPH_ENTITIES);

export function parseCreate(entity: KnowledgeGraphEntity, data: unknown) {
  return createSchemas[entity].parse(data);
}

export function parseUpdate(entity: KnowledgeGraphEntity, data: unknown) {
  return updateSchemas[entity].parse(data);
}
