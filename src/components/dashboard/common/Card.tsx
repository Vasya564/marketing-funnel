import { ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { CARD_TITLE, SURFACE } from '@/lib/dashboard/theme';

export function Card({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className={cn(SURFACE, 'p-6')}>
      <h2 className={CARD_TITLE}>{title}</h2>
      <div className="mt-4">{children}</div>
    </section>
  );
}
