import { ReactNode } from 'react';
import { cn } from '@/lib/cn';
import { SURFACE } from '@/lib/dashboard/theme';

export function SkeletonPanel({
  className,
  children,
}: {
  className?: string;
  children?: ReactNode;
}) {
  return <div className={cn(SURFACE, 'p-6', className)}>{children}</div>;
}
