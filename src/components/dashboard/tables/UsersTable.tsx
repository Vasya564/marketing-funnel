'use client';

import { Check, Minus } from 'lucide-react';
import type { UserRow } from '@/server/repositories/analyticsRepository';
import { Table, Td, Th, Tr } from '@/components/dashboard/common/Table';

export function UsersTable({
  users,
  onSelect,
}: {
  users: UserRow[];
  onSelect: (userId: string) => void;
}) {
  if (users.length === 0) {
    return (
      <p className="text-sm text-white/40">No users match these filters.</p>
    );
  }

  return (
    <Table>
      <thead>
        <tr>
          <Th>Email</Th>
          <Th>First touch</Th>
          <Th>Last touch</Th>
          <Th align="right">Visits</Th>
          <Th align="right">Purchased</Th>
        </tr>
      </thead>
      <tbody>
        {users.map((user) => (
          <Tr key={user.id} onClick={() => onSelect(user.id)}>
            <Td className="font-medium text-violet-300">{user.email}</Td>
            <Td>{user.firstTouch}</Td>
            <Td>{user.lastTouch ?? '—'}</Td>
            <Td align="right">{user.visits}</Td>
            <Td align="right">
              <span className="flex justify-end">
                {user.purchased ? (
                  <Check className="h-4 w-4 text-emerald-400" />
                ) : (
                  <Minus className="h-4 w-4 text-white/20" />
                )}
              </span>
            </Td>
          </Tr>
        ))}
      </tbody>
    </Table>
  );
}
