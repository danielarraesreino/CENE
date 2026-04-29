import { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface ClinicalListProps {
  children: ReactNode;
  className?: string;
}

export function ClinicalList({ children, className }: ClinicalListProps) {
  return (
    <div className={cn('space-y-4', className)}>
      {children}
    </div>
  );
}

interface ClinicalListItemProps {
  title: string;
  subtitle?: string;
  description: string;
  icon?: ReactNode;
  onClick?: () => void;
  className?: string;
}

export function ClinicalListItem({
  title,
  subtitle,
  description,
  icon,
  onClick,
  className,
}: ClinicalListItemProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'group p-6 rounded-3xl border border-slate-100 bg-white hover:border-emerald-200 hover:shadow-md transition-all cursor-default',
        onClick && 'cursor-pointer active:scale-[0.98]',
        className
      )}
    >
      <div className="flex items-start gap-4">
        {icon && (
          <div className="p-3 rounded-2xl bg-slate-50 text-slate-400 group-hover:bg-emerald-50 group-hover:text-emerald-600 transition-colors">
            {icon}
          </div>
        )}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-1">
            <h4 className="text-sm font-black text-slate-900 uppercase tracking-wider truncate">
              {title}
            </h4>
            {subtitle && (
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                {subtitle}
              </span>
            )}
          </div>
          <p className="text-slate-600 text-sm leading-relaxed line-clamp-3">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
}
