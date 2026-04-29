import { ReactNode } from 'react';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface ClinicalLayoutProps {
  children: ReactNode;
  className?: string;
  containerClassName?: string;
}

export function ClinicalLayout({
  children,
  className,
  containerClassName,
}: ClinicalLayoutProps) {
  return (
    <main 
      className={cn(
        'min-h-screen bg-[#f8fafc] selection:bg-emerald-100 selection:text-emerald-900',
        className
      )}
    >
      <div 
        className={cn(
          'p-8 md:p-12 max-w-5xl mx-auto w-full flex flex-col',
          containerClassName
        )}
      >
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          {children}
        </motion.div>
      </div>
    </main>
  );
}
