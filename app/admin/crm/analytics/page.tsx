import { CRMCard } from '@/components/crm/CRMCard';
import { listAnalyticsSnapshots } from '@/lib/crm/repository';

export default async function AnalyticsPage() {
  const analytics = await listAnalyticsSnapshots();

  return (
    <div className="space-y-6">
      <CRMCard title="Analytics" description="Track performance across leads, vendors, search activity, and operational conversion.">
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {analytics.map((item) => (
            <div key={item.label} className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-sm text-slate-600">{item.label}</p>
              <p className="mt-2 text-2xl font-semibold text-slate-950">{item.value}</p>
              <p className="mt-2 text-sm text-emerald-600">{item.trend}</p>
            </div>
          ))}
        </div>
      </CRMCard>
    </div>
  );
}
