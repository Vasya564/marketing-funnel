import { ReactNode } from 'react';
import { BrandMark } from '@/components/BrandMark';
import { FunnelProgress } from './FunnelProgress';

export function FunnelShell({
  currentStep,
  children,
}: {
  currentStep: number;
  children: ReactNode;
}) {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#07070d] px-4">
      <div className="pointer-events-none absolute -top-40 left-1/2 h-[480px] w-[480px] -translate-x-1/2 rounded-full bg-violet-600/20 blur-[120px]" />
      <div className="pointer-events-none absolute right-[-6rem] bottom-[-10rem] h-[360px] w-[360px] rounded-full bg-indigo-500/10 blur-[120px]" />

      <div className="relative z-10 w-full max-w-md">
        <div className="mb-6 flex items-center justify-center gap-2">
          <BrandMark />
          <span className="text-sm font-semibold tracking-wide text-white/80">
            PathFinder
          </span>
        </div>

        <FunnelProgress currentStep={currentStep} />

        <div className="rounded-3xl border border-white/10 bg-white/[0.04] p-8 shadow-2xl backdrop-blur-xl">
          {children}
        </div>
      </div>
    </main>
  );
}
