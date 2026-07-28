import { CRMCard } from '@/components/crm/CRMCard';
import { createCompanyAction } from '@/app/admin/crm/actions';

export const dynamic = 'force-dynamic';

export default function NewCompanyPage() {
  return (
    <div className="space-y-6">
      <CRMCard title="New company" description="Create a profile for a manufacturer, integrator, supplier, or customer.">
        <form action={createCompanyAction} className="grid gap-4">
          <div className="grid gap-4 md:grid-cols-2">
            <input name="name" className="rounded-2xl border border-slate-200 px-3 py-2" placeholder="Name" required />
            <input name="website" className="rounded-2xl border border-slate-200 px-3 py-2" placeholder="Website" />
            <input name="industry" className="rounded-2xl border border-slate-200 px-3 py-2" placeholder="Industry" required />
            <input name="headquarters" className="rounded-2xl border border-slate-200 px-3 py-2" placeholder="Country" />
            <select name="companyType" className="rounded-2xl border border-slate-200 px-3 py-2">
              <option value="manufacturer">Manufacturer</option>
              <option value="integrator">Integrator</option>
              <option value="supplier">Supplier</option>
              <option value="dealer">Dealer</option>
              <option value="customer">Customer</option>
              <option value="partner">Partner</option>
            </select>
            <select name="vendorStatus" className="rounded-2xl border border-slate-200 px-3 py-2">
              <option value="pending">Pending</option>
              <option value="verified">Verified</option>
              <option value="suspended">Suspended</option>
            </select>
          </div>
          <input name="contactName" className="w-full rounded-2xl border border-slate-200 px-3 py-2" placeholder="Contact name" />
          <input name="contactEmail" type="email" className="w-full rounded-2xl border border-slate-200 px-3 py-2" placeholder="Contact email" />
          <input name="contactPhone" className="w-full rounded-2xl border border-slate-200 px-3 py-2" placeholder="Contact phone" />
          <button type="submit" className="rounded-full bg-slate-950 px-4 py-2 text-sm font-medium text-white">Create company</button>
        </form>
      </CRMCard>
    </div>
  );
}
