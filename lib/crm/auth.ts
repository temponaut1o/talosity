import type { CRMUserRole } from '@/lib/crm/types';

export interface CrmAccessContext {
  role: CRMUserRole;
  permittedModules: string[];
  canManageVendors: boolean;
  canViewAnalytics: boolean;
  canModerateContent: boolean;
}

export function getCrmAccess(role: CRMUserRole): CrmAccessContext {
  const base: Record<CRMUserRole, CrmAccessContext> = {
    'super-admin': {
      role,
      permittedModules: ['companies', 'robots', 'leads', 'vendors', 'news', 'analytics', 'users'],
      canManageVendors: true,
      canViewAnalytics: true,
      canModerateContent: true,
    },
    administrator: {
      role,
      permittedModules: ['companies', 'robots', 'leads', 'vendors', 'news', 'analytics'],
      canManageVendors: true,
      canViewAnalytics: true,
      canModerateContent: true,
    },
    editor: {
      role,
      permittedModules: ['news', 'companies', 'robots'],
      canManageVendors: false,
      canViewAnalytics: false,
      canModerateContent: true,
    },
    'research-analyst': {
      role,
      permittedModules: ['analytics', 'companies', 'robots', 'news'],
      canManageVendors: false,
      canViewAnalytics: true,
      canModerateContent: false,
    },
    sales: {
      role,
      permittedModules: ['leads', 'opportunities', 'communications'],
      canManageVendors: false,
      canViewAnalytics: true,
      canModerateContent: false,
    },
    marketing: {
      role,
      permittedModules: ['news', 'analytics', 'leads'],
      canManageVendors: false,
      canViewAnalytics: true,
      canModerateContent: true,
    },
    'vendor-manager': {
      role,
      permittedModules: ['vendors', 'leads', 'communications'],
      canManageVendors: true,
      canViewAnalytics: true,
      canModerateContent: false,
    },
    'vendor-user': {
      role,
      permittedModules: ['vendors', 'leads'],
      canManageVendors: false,
      canViewAnalytics: false,
      canModerateContent: false,
    },
    'read-only': {
      role,
      permittedModules: ['companies', 'robots', 'news'],
      canManageVendors: false,
      canViewAnalytics: false,
      canModerateContent: false,
    },
  };

  return base[role];
}
