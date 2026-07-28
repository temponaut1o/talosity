import { CRMCard } from '@/components/crm/CRMCard';
import { countTable } from '@/lib/crm/repository';

export const dynamic = 'force-dynamic';

export default async function SettingsPage() {
  const [companyCount, robotCount, leadCount, relationshipCount] = await Promise.all([
    countTable('companies'),
    countTable('robots'),
    countTable('leads'),
    countTable('company_relationships'),
  ]);

  return (
    <div className="space-y-6">
      <CRMCard title="Settings" description="Operational status for enterprise CRM controls, RBAC, and relationship graph integrity.">
        <div className="space-y-3 text-sm text-slate-600">
          <div className="rounded-2xl border border-slate-200 p-4">Companies indexed: {companyCount}</div>
          <div className="rounded-2xl border border-slate-200 p-4">Robots indexed: {robotCount}</div>
          <div className="rounded-2xl border border-slate-200 p-4">Leads in pipeline: {leadCount}</div>
          <div className="rounded-2xl border border-slate-200 p-4">Knowledge relationships: {relationshipCount}</div>
        </div>
      </CRMCard>
    </div>
  );
}
