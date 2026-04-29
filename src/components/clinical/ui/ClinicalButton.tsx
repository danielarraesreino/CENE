import { ButtonHTMLAttributes, ReactNode } from 'react';
import { cn } from '@/lib/utils';
import { Loader2 } from 'lucide-react';

interface ClinicalButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  isLoading?: boolean;
  icon?: ReactNode;
}

export function ClinicalButton({
  children,
  variant = 'primary',
  isLoading = false,
  icon,
  className,
  disabled,
  ...props
}: ClinicalButtonProps) {
  const variants = {
    primary: 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-[0_10px_40px_rgba(5,150,105,0.3)]',
    secondary: 'bg-slate-900 hover:bg-slate-800 text-white shadow-lg',
    outline: 'border-2 border-slate-200 hover:border-emerald-500 hover:bg-emerald-50 text-slate-600 hover:text-emerald-700',
    ghost: 'hover:bg-slate-100 text-slate-500',
  };

  return (
    <button
      disabled={isLoading || disabled}
      className={cn(
        'px-8 py-4 rounded-full font-black text-base flex items-center justify-center gap-3 transition-all active:scale-95 disabled:opacity-50 disabled:pointer-events-none disabled:shadow-none',
        variants[variant],
        className
      )}
      {...props}
    >
      {isLoading ? (
        <Loader2 className="animate-spin" size={20} />
      ) : (
        <>
          {children}
          {icon}
        </>
      )}
    </button>
  );
}
