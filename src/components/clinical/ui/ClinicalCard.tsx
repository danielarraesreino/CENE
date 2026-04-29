import { ReactNode } from 'react';
import { motion, HTMLMotionProps } from 'framer-motion';
import { cn } from '../../../lib/utils';

interface ClinicalCardProps extends HTMLMotionProps<'div'> {
  children: ReactNode;
  variant?: 'default' | 'glass' | 'white';
  className?: string;
}

export function ClinicalCard({ 
  children, 
  variant = 'glass', 
  className,
  ...props 
}: ClinicalCardProps) {
  const variants = {
    default: 'bg-white border border-slate-200 shadow-sm',
    glass: 'glass-panel border border-slate-200 bg-white/70 backdrop-blur-xl',
    white: 'bg-white border border-slate-100 shadow-xl',
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        'rounded-[3rem] p-8 md:p-12',
        variants[variant],
        className
      )}
      {...props}
    >
      {children}
    </motion.div>
  );
}
