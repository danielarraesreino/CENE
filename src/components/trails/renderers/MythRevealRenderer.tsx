"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MythRevealContent } from "@/types/trail-content";
import { ShieldCheck, Brain } from "lucide-react";

export function MythRevealRenderer({
  data,
  onComplete,
}: {
  data: MythRevealContent;
  onComplete: () => void;
}) {
  const [revealed, setRevealed] = useState<Set<string>>(new Set());
  const [expanded, setExpanded] = useState<string | null>(null);

  const toggle = (id: string) => {
    setRevealed((prev) => new Set([...prev, id]));
    setExpanded(expanded === id ? null : id);
  };

  const allRevealed = data.revealAll
    ? revealed.size === data.myths.length
    : revealed.size > 0;

  return (
    <div className="w-full flex flex-col items-center py-10 px-4">
      <header className="text-center mb-16">
        <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tighter">
          Desafiando <span className="text-gradient">Mitos</span>
        </h2>
        <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto leading-relaxed">
          O Rei Bebê vive de ilusões. Clique em cada card para revelar a realidade biológica por trás dos comportamentos.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl mb-16">
        {data.myths.map((myth, index) => {
          const isExpanded = expanded === myth.id;
          const isRevealed = revealed.has(myth.id);

          return (
            <motion.div
              key={myth.id}
              layout
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              onClick={() => toggle(myth.id)}
              className={`glass-panel rounded-[2.5rem] p-8 md:p-10 cursor-pointer relative overflow-hidden group transition-all duration-500 border ${
                isRevealed 
                  ? "border-emerald-300 bg-emerald-50/30 shadow-[0_10px_30px_rgba(5,150,105,0.1)]" 
                  : "border-slate-200 hover:border-emerald-300 hover:shadow-md"
              }`}
            >
              <div className="flex flex-col h-full">
                <div className="flex items-center gap-5 mb-6">
                  <div className={`w-14 h-14 rounded-2xl flex items-center justify-center text-2xl font-black transition-all ${
                    isRevealed 
                      ? "bg-emerald-100 text-emerald-700 shadow-sm" 
                      : "bg-slate-100 text-slate-400 group-hover:bg-emerald-50 group-hover:text-emerald-600"
                  }`}>
                    {index + 1}
                  </div>
                  <h3 className={`text-2xl md:text-3xl font-black transition-colors ${
                    isRevealed ? "text-emerald-800" : "text-slate-800 group-hover:text-emerald-700"
                  }`}>
                    {myth.title}
                  </h3>
                </div>

                <p className="text-lg text-slate-600 leading-relaxed font-medium">
                  "{myth.description}"
                </p>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ opacity: 0, height: 0, marginTop: 0 }}
                      animate={{ opacity: 1, height: "auto", marginTop: 32 }}
                      exit={{ opacity: 0, height: 0, marginTop: 0 }}
                      className="space-y-6 pt-8 border-t border-slate-200/60"
                    >
                      <div className="bg-emerald-100/50 p-6 rounded-3xl border border-emerald-200 relative overflow-hidden">
                        <div className="flex items-center gap-3 mb-3 text-emerald-700 font-black uppercase tracking-[0.1em] text-xs">
                          <Brain size={18} />
                          A Realidade Clínica
                        </div>
                        <p className="text-base md:text-lg text-emerald-900 leading-relaxed font-semibold">
                          {myth.truth}
                        </p>
                      </div>
                      
                      <div className="bg-red-50 p-6 rounded-3xl border border-red-100 relative overflow-hidden">
                        <div className="flex items-center gap-3 mb-3 text-red-600 font-black uppercase tracking-[0.1em] text-xs">
                          <ShieldCheck size={18} />
                          Consequência Final
                        </div>
                        <p className="text-base md:text-lg text-red-900 leading-relaxed font-semibold">
                          {myth.endGame}
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>
          );
        })}
      </div>

      <AnimatePresence>
        {allRevealed && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center w-full max-w-xl mx-auto"
          >
            <button
              onClick={onComplete}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white px-10 py-5 rounded-full font-black text-xl transition-all shadow-[0_10px_40px_rgba(5,150,105,0.3)] hover:scale-[1.02] active:scale-[0.98]"
            >
              Finalizar Desafio de Mitos ✅
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
