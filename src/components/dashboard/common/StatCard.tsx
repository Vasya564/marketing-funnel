import { cn } from '@/lib/cn';
import { SURFACE } from '@/lib/dashboard/theme';

export function StatCard({
  label,
  value,
  accent,
}: {
  label: string;
  value: number;
  accent?: string;
}) {
  return (
    <div
      className={cn(
        SURFACE,
        'group p-6 transition-all duration-200 hover:-translate-y-0.5 hover:border-white/20',
      )}
    >
      <div className="flex items-center gap-2">
        <span
          className={cn('h-2 w-2 rounded-full', accent ?? 'bg-violet-400')}
        />
        <p className="text-sm text-white/50">{label}</p>
      </div>
      <p className="mt-2 text-3xl font-bold text-white">{value}</p>
    </div>
  );
}
