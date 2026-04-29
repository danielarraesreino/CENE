import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface ClinicalEmptyStateProps {
  title: string;
  description: string;
  icon?: ReactNode;
  action?: ReactNode;
  className?: string;
}

export function ClinicalEmptyState({
  title,
  description,
  icon,
  action,
  className,
}: ClinicalEmptyStateProps) {
  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center py-12 px-6 text-center rounded-[2rem] border-2 border-dashed border-slate-200 bg-slate-50/50',
        className
      )}
    >
      {icon && (
        <div className="mb-4 text-slate-300">
          {icon}
        </div>
      )}
      <h3 className="text-lg font-black text-slate-900 mb-2">{title}</h3>
      <p className="text-slate-500 text-sm max-w-[240px] mb-6">
        {description}
      </p>
      {action && <div>{action}</div>}
    </div>
  );
}
