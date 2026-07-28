import Link from 'next/link';
import { entityNameSchema } from '@/lib/crm/knowledge-graph-schemas';
import { getSupabaseServerClient } from '@/lib/supabase/server';

interface GraphEntityTableProps {
  entity: string;
}

export async function GraphEntityTable({ entity }: GraphEntityTableProps) {
  const parsedEntity = entityNameSchema.parse(entity);
  const supabase = getSupabaseServerClient();

  if (!supabase) {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-800">
        Supabase environment variables are missing.
      </div>
    );
  }

  const { data, error } = await supabase
    .from(`crm.${parsedEntity}`)
    .select('*')
    .order('created_at', { ascending: false })
    .limit(15);

  if (error) {
    return (
      <div className="rounded-2xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700">
        Unable to load {parsedEntity}: {error.message}
      </div>
    );
  }

  const rows = data ?? [];

  if (rows.length === 0) {
    return (
      <div className="rounded-2xl border border-dashed border-slate-300 bg-slate-50 p-6 text-sm text-slate-600">
        No records yet for {parsedEntity}. Use POST /api/crm/v2/{parsedEntity} to create records.
      </div>
    );
  }

  const keys = Object.keys(rows[0]).slice(0, 6);

  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
      <table className="min-w-full divide-y divide-slate-200 text-sm">
        <thead className="bg-slate-50">
          <tr>
            {keys.map((key) => (
              <th key={key} className="px-4 py-3 text-left font-medium text-slate-600">{key}</th>
            ))}
            <th className="px-4 py-3 text-left font-medium text-slate-600">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
          {rows.map((row) => (
            <tr key={row.id}>
              {keys.map((key) => (
                <td key={key} className="px-4 py-3 text-slate-700">{String(row[key] ?? '-')}</td>
              ))}
              <td className="px-4 py-3">
                <Link href={`/admin/crm/graph/${parsedEntity}`} className="text-sm text-slate-900 underline">
                  Manage
                </Link>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
