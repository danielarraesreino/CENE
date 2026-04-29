import { ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ClinicalHeaderProps {
  title: string;
  subtitle?: string;
  icon?: ReactNode;
  backHref?: string;
  actions?: ReactNode;
  className?: string;
}

export function ClinicalHeader({
  title,
  subtitle,
  icon,
  backHref = '/portal/paciente/clinical',
  actions,
  className,
}: ClinicalHeaderProps) {
  const router = useRouter();

  return (
    <div className={cn('mb-12 flex flex-col gap-6', className)}>
      <div className="flex items-center justify-between">
        <button
          onClick={() => router.push(backHref)}
          className="text-slate-400 hover:text-emerald-700 font-bold flex items-center gap-2 transition-colors group"
        >
          <div className="p-2 rounded-full group-hover:bg-emerald-50 transition-colors">
            <ChevronLeft size={20} />
          </div>
          <span className="text-sm uppercase tracking-widest">Voltar</span>
        </button>

        {icon && (
          <div className="flex items-center gap-2 text-emerald-700 bg-emerald-50 px-4 py-2 rounded-full border border-emerald-100">
            {icon}
          </div>
        )}
      </div>

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
            {title}
          </h1>
          {subtitle && (
            <p className="text-lg text-slate-500 font-medium max-w-2xl">
              {subtitle}
            </p>
          )}
        </div>
        {actions && (
          <div className="flex items-center gap-3">
            {actions}
          </div>
        )}
      </div>
    </div>
  );
}
