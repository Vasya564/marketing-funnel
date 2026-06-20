import { cn } from '@/lib/cn';
import { FUNNEL_STEPS } from '@/lib/routes';

export function FunnelProgress({ currentStep }: { currentStep: number }) {
  return (
    <div className="mb-8 flex items-center justify-center gap-2">
      {FUNNEL_STEPS.map((step, index) => {
        const reached = index <= currentStep - 1;

        return (
          <div key={step.label} className="flex items-center gap-2">
            <span
              className={cn(
                'text-xs font-medium tracking-wide',
                reached ? 'text-violet-300' : 'text-white/30',
              )}
            >
              {step.label}
            </span>
            {index < FUNNEL_STEPS.length - 1 ? (
              <span
                className={cn(
                  'h-px w-8',
                  index < currentStep - 1 ? 'bg-violet-400/70' : 'bg-white/10',
                )}
              />
            ) : null}
          </div>
        );
      })}
    </div>
  );
}
