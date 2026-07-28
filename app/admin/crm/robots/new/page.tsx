import { createRobotAction } from '@/app/admin/crm/actions';
import { CRMCard } from '@/components/crm/CRMCard';
import { listCompanies } from '@/lib/crm/repository';

export const dynamic = 'force-dynamic';

export default async function NewRobotPage() {
  const companies = await listCompanies();

  return (
    <div className="space-y-6">
      <CRMCard title="New robot" description="Create or update robot profiles for the Talosity robotics platform.">
        <form action={createRobotAction} className="grid gap-4">
          <div className="grid gap-4 md:grid-cols-2">
            <select name="companyId" required className="rounded-2xl border border-slate-200 px-3 py-2">
              <option value="">Manufacturer company</option>
              {companies.map((company) => (
                <option key={company.id} value={company.id}>{company.name}</option>
              ))}
            </select>
            <input name="name" className="rounded-2xl border border-slate-200 px-3 py-2" placeholder="Robot name" required />
            <input name="modelNumber" className="rounded-2xl border border-slate-200 px-3 py-2" placeholder="Model number" />
            <input name="category" className="rounded-2xl border border-slate-200 px-3 py-2" placeholder="Category" required />
            <input name="industry" className="rounded-2xl border border-slate-200 px-3 py-2" placeholder="Industry" />
            <input name="payload" className="rounded-2xl border border-slate-200 px-3 py-2" placeholder="Payload" />
            <input name="speed" className="rounded-2xl border border-slate-200 px-3 py-2" placeholder="Runtime" />
          </div>
          <input name="applications" className="w-full rounded-2xl border border-slate-200 px-3 py-2" placeholder="Applications (comma separated)" />
          <input name="aiCapabilities" className="w-full rounded-2xl border border-slate-200 px-3 py-2" placeholder="AI capabilities (comma separated)" />
          <input name="safetyCertifications" className="w-full rounded-2xl border border-slate-200 px-3 py-2" placeholder="Safety certifications (comma separated)" />
          <button type="submit" className="rounded-full bg-slate-950 px-4 py-2 text-sm font-medium text-white">Create robot</button>
        </form>
      </CRMCard>
    </div>
  );
}
