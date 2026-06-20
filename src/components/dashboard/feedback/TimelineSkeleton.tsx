import { Skeleton } from './Skeleton';

export function TimelineSkeleton() {
  return (
    <div className="flex flex-1 overflow-hidden">
      <aside className="w-64 shrink-0 space-y-2 border-r border-white/10 p-4">
        {Array.from({ length: 5 }).map((_, index) => (
          <Skeleton key={index} className="h-16 rounded-xl" />
        ))}
      </aside>
      <section className="flex-1 space-y-4 p-6">
        <Skeleton className="h-6 w-40" />
        <Skeleton className="h-4 w-56" />
        <div className="space-y-3 pt-4">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-5 w-full" />
          ))}
        </div>
      </section>
    </div>
  );
}
