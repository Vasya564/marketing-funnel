'use client';

import type { SourceRow } from '@/server/repositories/analyticsRepository';
import { ROW_HOVER } from '@/lib/dashboard/theme';
import { cn } from '@/lib/cn';

export function SourcesTable({
  rows,
  onSelectSource,
}: {
  rows: SourceRow[];
  onSelectSource: (source: string) => void;
}) {
  if (rows.length === 0) {
    return <p className="text-sm text-white/40">No data yet.</p>;
  }

  return (
    <table className="w-full text-left text-sm">
      <thead>
        <tr className="text-white/40">
          <th className="pb-2 font-medium">Source</th>
          <th className="pb-2 text-right font-medium">Entries</th>
          <th className="pb-2 text-right font-medium">Completions</th>
          <th className="pb-2 text-right font-medium">Conversion</th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <tr
            key={row.source}
            onClick={() => onSelectSource(row.source)}
            className={cn(
              'cursor-pointer border-t border-white/[0.06]',
              ROW_HOVER,
            )}
          >
            <td className="py-2.5 font-medium text-violet-300">{row.source}</td>
            <td className="py-2.5 text-right text-white/70">{row.entries}</td>
            <td className="py-2.5 text-right text-white/70">
              {row.completions}
            </td>
            <td className="py-2.5 text-right text-white/70">
              {row.conversion}%
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
