import { cn } from '@/lib/utils';

interface ClinicalProgressBarProps {
  currentStep: number;
  totalSteps: number;
  className?: string;
}

export function ClinicalProgressBar({
  currentStep,
  totalSteps,
  className,
}: ClinicalProgressBarProps) {
  return (
    <div className={cn('flex gap-2 mb-12', className)}>
      {Array.from({ length: totalSteps }).map((_, i) => (
        <div
          key={i}
          className={cn(
            'h-2 flex-1 rounded-full transition-all duration-500',
            i <= currentStep
              ? 'bg-emerald-600 shadow-[0_0_8px_rgba(5,150,105,0.4)]'
              : 'bg-slate-200'
          )}
        />
      ))}
    </div>
  );
}
