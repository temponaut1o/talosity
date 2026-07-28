import { ReactNode } from 'react';

interface CRMTableProps {
  headers: string[];
  rows: ReactNode[];
}

export function CRMTable({ headers, rows }: CRMTableProps) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200">
      <table className="min-w-full divide-y divide-slate-200 text-sm">
        <thead className="bg-slate-50 text-left text-slate-600">
          <tr>
            {headers.map((header) => (
              <th key={header} className="px-4 py-3 font-medium">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 bg-white">{rows.map((row, index) => <tr key={index}>{row}</tr>)}</tbody>
      </table>
    </div>
  );
}
