import { Skeleton } from './Skeleton';
import { SkeletonPanel } from './SkeletonPanel';

export function DashboardSkeleton() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-[#07070d] px-6 py-10">
      <div className="pointer-events-none absolute -top-40 left-1/3 h-[420px] w-[420px] rounded-full bg-violet-600/10 blur-[140px]" />

      <div className="relative z-10 mx-auto max-w-6xl space-y-6">
        <div className="flex items-end justify-between gap-4">
          <div className="space-y-2">
            <Skeleton className="h-8 w-56" />
            <Skeleton className="h-4 w-40" />
          </div>
          <div className="flex gap-3">
            <Skeleton className="h-9 w-28" />
            <Skeleton className="h-9 w-28" />
            <Skeleton className="h-9 w-24" />
          </div>
        </div>

        <SkeletonPanel>
          <Skeleton className="h-4 w-32" />
          <Skeleton className="mt-4 h-64 rounded-xl" />
        </SkeletonPanel>

        <SkeletonPanel>
          <Skeleton className="h-4 w-24" />
          <div className="mt-4 grid grid-cols-2 gap-4 md:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <Skeleton key={index} className="h-24 rounded-xl" />
            ))}
          </div>
          <Skeleton className="mt-6 h-64 rounded-xl" />
        </SkeletonPanel>

        <div className="grid gap-6 md:grid-cols-3">
          {Array.from({ length: 3 }).map((_, index) => (
            <SkeletonPanel key={index} className="h-28" />
          ))}
        </div>

        <SkeletonPanel className="h-48" />

        <div className="grid gap-6 md:grid-cols-2">
          <SkeletonPanel className="h-72" />
          <SkeletonPanel className="h-72" />
        </div>

        <SkeletonPanel className="h-64" />
      </div>
    </main>
  );
}
