"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppStore } from "@/store/useAppStore";

interface Myth {
  id: string;
  title: string;
  description: string;
  truth: string;
  endGame: string;
  icon: React.ReactNode;
}

export function MythCard({ myth, index }: { myth: Myth; index?: number }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const revealMyth = useAppStore((state) => state.revealMyth);

  const handleReveal = () => {
    setIsExpanded(!isExpanded);
    if (!isExpanded) {
      revealMyth(myth.id);
    }
  };

  // Variação de delay baseada no index para que flutuem de forma assimétrica
  const floatDelay = index ? index * 0.5 : 0;

  return (
    <motion.div
      layout
      initial={{ y: 0 }}
      animate={{ y: [0, -10, 0] }}
      transition={{
        y: {
          duration: 4 + (index ? index * 0.5 : 0),
          repeat: Infinity,
          ease: "easeInOut",
          delay: floatDelay
        },
        layout: { duration: 0.4, type: "spring", stiffness: 300, damping: 30 }
      }}
      onClick={handleReveal}
      whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
      whileTap={{ scale: 0.98 }}
      className="glass-panel rounded-3xl p-6 cursor-pointer relative overflow-hidden min-h-[250px] flex flex-col justify-between group"
    >
      {/* Glow Effect on Hover - Mais vibrante */}
      <div className="absolute inset-0 bg-brand-glow opacity-0 group-hover:opacity-30 transition-opacity duration-500 rounded-3xl blur-3xl -z-10" />

      <motion.div layout className="flex items-center gap-4 mb-4 z-10">
        <div className="p-3 bg-white/5 rounded-2xl border border-white/10 text-brand-cyan shadow-[0_0_15px_rgba(6,182,212,0.3)] group-hover:shadow-[0_0_25px_rgba(6,182,212,0.6)] transition-all duration-300">
          {myth.icon}
        </div>
        <motion.h3 layout className="text-2xl font-heading font-semibold tracking-wide text-white drop-shadow-md">
          {myth.title}
        </motion.h3>
      </motion.div>

      <motion.p layout className="text-gray-300 font-sans leading-relaxed flex-1 z-10">
        {myth.description}
      </motion.p>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, height: 0, marginTop: 0 }}
            animate={{ opacity: 1, height: "auto", marginTop: 24 }}
            exit={{ opacity: 0, height: 0, marginTop: 0 }}
            className="pt-5 border-t border-white/10 space-y-5 z-10 relative"
          >
            <div className="bg-white/5 p-4 rounded-xl border border-white/5">
              <span className="text-brand-cyan text-xs font-bold uppercase tracking-widest mb-2 block">A Verdade Oculta</span>
              <p className="text-gray-200 font-sans text-sm leading-relaxed">{myth.truth}</p>
            </div>
            <div className="bg-red-500/10 p-4 rounded-xl border border-red-500/20">
              <span className="text-red-400 text-xs font-bold uppercase tracking-widest mb-2 block">Fim do Jogo</span>
              <p className="text-gray-200 font-sans text-sm leading-relaxed">{myth.endGame}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
