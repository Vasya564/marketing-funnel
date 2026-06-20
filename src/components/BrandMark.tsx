import { cn } from '@/lib/cn';

export function BrandMark({ className }: { className?: string }) {
  return (
    <span
      className={cn(
        'inline-flex items-center justify-center rounded-lg bg-gradient-to-br from-violet-400 to-indigo-500',
        className ?? 'h-6 w-6',
      )}
    >
      <svg viewBox="0 0 32 32" className="h-2/3 w-2/3" fill="none">
        <path d="M8 9h16l-6 7v6l-4 2v-8L8 9z" fill="#fff" />
      </svg>
    </span>
  );
}
