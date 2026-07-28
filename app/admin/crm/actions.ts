'use server';

import { revalidatePath } from 'next/cache';
import {
  createCommunication,
  createCompany,
  createDeploymentPartner,
  createDocument,
  createLead,
  createOpportunity,
  createRobot,
  createVendorRequest,
  deleteCompany,
  deleteDeploymentPartner,
  deleteLead,
  deleteOpportunity,
  deleteRobot,
  deleteVendorRequest,
  updateLead,
  updateVendorRequest,
} from '@/lib/crm/repository';

export async function createLeadAction(formData: FormData) {
  await createLead({
    name: String(formData.get('name') ?? ''),
    companyId: String(formData.get('companyId') ?? '') || null,
    company: String(formData.get('company') ?? ''),
    email: String(formData.get('email') ?? ''),
    phone: String(formData.get('phone') ?? ''),
    industry: String(formData.get('industry') ?? ''),
    robotInterest: String(formData.get('robotInterest') ?? ''),
    facilitySize: String(formData.get('facilitySize') ?? ''),
    deploymentTimeline: String(formData.get('deploymentTimeline') ?? ''),
    budgetRange: String(formData.get('budgetRange') ?? ''),
  });

  revalidatePath('/admin/crm');
  revalidatePath('/admin/crm/leads');
}

export async function updateLeadStatusAction(formData: FormData) {
  const id = String(formData.get('id') ?? '');
  const status = String(formData.get('status') ?? 'new');
  await updateLead(id, { status });
  revalidatePath('/admin/crm/leads');
}

export async function deleteLeadAction(formData: FormData) {
  await deleteLead(String(formData.get('id') ?? ''));
  revalidatePath('/admin/crm/leads');
}

export async function createCompanyAction(formData: FormData) {
  await createCompany({
    name: String(formData.get('name') ?? ''),
    companyType: String(formData.get('companyType') ?? 'customer'),
    industry: String(formData.get('industry') ?? ''),
    website: String(formData.get('website') ?? ''),
    contactName: String(formData.get('contactName') ?? ''),
    contactEmail: String(formData.get('contactEmail') ?? ''),
    contactPhone: String(formData.get('contactPhone') ?? ''),
    vendorStatus: String(formData.get('vendorStatus') ?? 'pending'),
    profileStatus: String(formData.get('profileStatus') ?? 'draft'),
    headquarters: String(formData.get('headquarters') ?? ''),
    annualRevenue: String(formData.get('annualRevenue') ?? ''),
    featured: formData.get('featured') === 'on',
  });

  revalidatePath('/admin/crm');
  revalidatePath('/admin/crm/companies');
}

export async function deleteCompanyAction(formData: FormData) {
  await deleteCompany(String(formData.get('id') ?? ''));
  revalidatePath('/admin/crm/companies');
  revalidatePath('/admin/crm');
}

export async function createRobotAction(formData: FormData) {
  await createRobot({
    companyId: String(formData.get('companyId') ?? ''),
    name: String(formData.get('name') ?? ''),
    modelNumber: String(formData.get('modelNumber') ?? ''),
    category: String(formData.get('category') ?? ''),
    industry: String(formData.get('industry') ?? ''),
    payload: String(formData.get('payload') ?? ''),
    speed: String(formData.get('speed') ?? ''),
    applications: String(formData.get('applications') ?? '')
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean),
    aiCapabilities: String(formData.get('aiCapabilities') ?? '')
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean),
    safetyCertifications: String(formData.get('safetyCertifications') ?? '')
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean),
    supportIncluded: formData.get('supportIncluded') === 'on',
  });

  revalidatePath('/admin/crm');
  revalidatePath('/admin/crm/robots');
}

export async function deleteRobotAction(formData: FormData) {
  await deleteRobot(String(formData.get('id') ?? ''));
  revalidatePath('/admin/crm/robots');
  revalidatePath('/admin/crm');
}

export async function createOpportunityAction(formData: FormData) {
  await createOpportunity({
    leadId: String(formData.get('leadId') ?? '') || null,
    companyName: String(formData.get('companyName') ?? ''),
    vendorName: String(formData.get('vendorName') ?? ''),
    robotInterest: String(formData.get('robotInterest') ?? ''),
    salesStage: String(formData.get('salesStage') ?? 'prospecting'),
    estimatedValue: String(formData.get('estimatedValue') ?? ''),
    nextAction: String(formData.get('nextAction') ?? ''),
  });
  revalidatePath('/admin/crm/opportunities');
  revalidatePath('/admin/crm');
}

export async function deleteOpportunityAction(formData: FormData) {
  await deleteOpportunity(String(formData.get('id') ?? ''));
  revalidatePath('/admin/crm/opportunities');
  revalidatePath('/admin/crm');
}

export async function createVendorRequestAction(formData: FormData) {
  await createVendorRequest({
    companyId: String(formData.get('companyId') ?? '') || null,
    companyName: String(formData.get('companyName') ?? ''),
    requestType: String(formData.get('requestType') ?? 'verification'),
    status: String(formData.get('status') ?? 'pending'),
  });
  revalidatePath('/admin/crm/vendors');
  revalidatePath('/admin/crm');
}

export async function updateVendorRequestAction(formData: FormData) {
  const id = String(formData.get('id') ?? '');
  const status = String(formData.get('status') ?? 'pending');
  await updateVendorRequest(id, { status });
  revalidatePath('/admin/crm/vendors');
  revalidatePath('/admin/crm');
}

export async function deleteVendorRequestAction(formData: FormData) {
  await deleteVendorRequest(String(formData.get('id') ?? ''));
  revalidatePath('/admin/crm/vendors');
  revalidatePath('/admin/crm');
}

export async function createCommunicationAction(formData: FormData) {
  await createCommunication({
    channel: String(formData.get('channel') ?? 'note'),
    subject: String(formData.get('subject') ?? ''),
    relatedType: String(formData.get('relatedType') ?? 'Lead'),
    relatedName: String(formData.get('relatedName') ?? ''),
    followUp: String(formData.get('followUp') ?? ''),
    leadId: String(formData.get('leadId') ?? '') || null,
    companyId: String(formData.get('companyId') ?? '') || null,
    robotId: String(formData.get('robotId') ?? '') || null,
  });
  revalidatePath('/admin/crm/communications');
}

export async function createDocumentAction(formData: FormData) {
  await createDocument({
    robotId: String(formData.get('robotId') ?? ''),
    name: String(formData.get('name') ?? ''),
    kind: String(formData.get('kind') ?? ''),
    filePath: String(formData.get('filePath') ?? ''),
  });
  revalidatePath('/admin/crm/documents');
}

export async function createDeploymentPartnerAction(formData: FormData) {
  await createDeploymentPartner({
    companyId: String(formData.get('companyId') ?? ''),
    name: String(formData.get('name') ?? ''),
    serviceRegion: String(formData.get('serviceRegion') ?? ''),
  });
  revalidatePath('/admin/crm/partners');
  revalidatePath('/admin/crm');
}

export async function deleteDeploymentPartnerAction(formData: FormData) {
  await deleteDeploymentPartner(String(formData.get('id') ?? ''));
  revalidatePath('/admin/crm/partners');
  revalidatePath('/admin/crm');
}
