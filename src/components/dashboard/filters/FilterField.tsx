import { ReactNode } from 'react';

export function FilterField({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <label className="block space-y-1.5">
      <span className="text-xs font-medium text-white/40">{label}</span>
      {children}
    </label>
  );
}
