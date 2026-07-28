'use server';

import { revalidatePath } from 'next/cache';
import { createLeadRecord } from '@/lib/crm/data';

export async function createLead(formData: FormData) {
  createLeadRecord({
    name: String(formData.get('name') ?? ''),
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
}
