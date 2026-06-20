import { ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { ROW_HOVER } from '@/lib/dashboard/theme';

type Align = 'left' | 'right';

export function Table({ children }: { children: ReactNode }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left text-sm">{children}</table>
    </div>
  );
}

export function Th({
  align = 'left',
  children,
}: {
  align?: Align;
  children: ReactNode;
}) {
  return (
    <th
      className={cn(
        'px-3 pb-2 font-medium text-white/40',
        align === 'right' && 'text-right',
      )}
    >
      {children}
    </th>
  );
}

export function Tr({
  onClick,
  children,
}: {
  onClick?: () => void;
  children: ReactNode;
}) {
  return (
    <tr
      onClick={onClick}
      className={cn(
        'border-t border-white/[0.06]',
        onClick && cn('cursor-pointer', ROW_HOVER),
      )}
    >
      {children}
    </tr>
  );
}

export function Td({
  align = 'left',
  className,
  children,
}: {
  align?: Align;
  className?: string;
  children: ReactNode;
}) {
  return (
    <td
      className={cn(
        'px-3 py-2.5 text-white/70',
        align === 'right' && 'text-right',
        className,
      )}
    >
      {children}
    </td>
  );
}
