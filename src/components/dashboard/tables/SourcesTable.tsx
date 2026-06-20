'use client';

import type { SourceRow } from '@/server/repositories/analyticsRepository';
import { Table, Td, Th, Tr } from '@/components/dashboard/common/Table';

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
    <Table>
      <thead>
        <tr>
          <Th>Source</Th>
          <Th align="right">Entries</Th>
          <Th align="right">Completions</Th>
          <Th align="right">Conversion</Th>
        </tr>
      </thead>
      <tbody>
        {rows.map((row) => (
          <Tr key={row.source} onClick={() => onSelectSource(row.source)}>
            <Td className="font-medium text-violet-300">{row.source}</Td>
            <Td align="right">{row.entries}</Td>
            <Td align="right">{row.completions}</Td>
            <Td align="right">{row.conversion}%</Td>
          </Tr>
        ))}
      </tbody>
    </Table>
  );
}
