'use client';

import { Check, Minus } from 'lucide-react';
import type { UserRow } from '@/server/repositories/analyticsRepository';
import { cn } from '@/lib/cn';
import { ROW_HOVER } from '@/lib/dashboard/theme';

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
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="text-white/40">
            <th className="pb-2 font-medium">Email</th>
            <th className="pb-2 font-medium">First touch</th>
            <th className="pb-2 font-medium">Last touch</th>
            <th className="pb-2 text-right font-medium">Visits</th>
            <th className="pb-2 text-right font-medium">Purchased</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr
              key={user.id}
              onClick={() => onSelect(user.id)}
              className={cn(
                'cursor-pointer border-t border-white/[0.06]',
                ROW_HOVER,
              )}
            >
              <td className="py-2.5 font-medium text-violet-300">
                {user.email}
              </td>
              <td className="py-2.5 text-white/70">{user.firstTouch}</td>
              <td className="py-2.5 text-white/70">{user.lastTouch ?? '—'}</td>
              <td className="py-2.5 text-right text-white/70">{user.visits}</td>
              <td className="py-2.5">
                <span className="flex justify-end">
                  {user.purchased ? (
                    <Check className="h-4 w-4 text-emerald-400" />
                  ) : (
                    <Minus className="h-4 w-4 text-white/20" />
                  )}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
