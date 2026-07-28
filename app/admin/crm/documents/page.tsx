import { CRMCard } from '@/components/crm/CRMCard';
import { createDocumentAction } from '@/app/admin/crm/actions';
import { listDocuments, listRobots } from '@/lib/crm/repository';

export const dynamic = 'force-dynamic';

export default async function DocumentsPage() {
  const [documents, robots] = await Promise.all([listDocuments(), listRobots()]);

  return (
    <div className="space-y-6">
      <CRMCard title="Documents" description="Centralize datasheets, certificates, brochures, and vendor uploads for the CRM operation.">
        <form action={createDocumentAction} className="mb-4 grid gap-3 md:grid-cols-2">
          <select name="robotId" required className="rounded-xl border border-slate-300 px-3 py-2 text-sm">
            <option value="">Select robot</option>
            {robots.map((robot) => (
              <option key={robot.id} value={robot.id}>{robot.name}</option>
            ))}
          </select>
          <input name="name" placeholder="Document title" required className="rounded-xl border border-slate-300 px-3 py-2 text-sm" />
          <input name="kind" placeholder="Document type" required className="rounded-xl border border-slate-300 px-3 py-2 text-sm" />
          <input name="filePath" placeholder="Storage path" required className="rounded-xl border border-slate-300 px-3 py-2 text-sm" />
          <button type="submit" className="rounded-full bg-slate-950 px-4 py-2 text-sm font-medium text-white">Attach Document</button>
        </form>

        <ul className="space-y-3">
          {documents.map((document) => (
            <li key={document.id} className="flex items-center justify-between rounded-2xl border border-slate-200 p-4 text-sm">
              <span className="font-medium text-slate-900">{document.name}</span>
              <span className="text-slate-500">{document.kind}</span>
            </li>
          ))}
        </ul>
      </CRMCard>
    </div>
  );
}
