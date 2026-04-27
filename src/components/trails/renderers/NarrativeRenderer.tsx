"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, CheckCircle2, Sparkles } from "lucide-react";
import { NarrativeContent } from "@/types/trail-content";

export function NarrativeRenderer({
  data,
  onComplete,
}: {
  data: NarrativeContent;
  onComplete: () => void;
}) {
  const [current, setCurrent] = useState(0);
  const stage = data.stages[current];
  const isLast = current === data.stages.length - 1;

  const next = () => {
    if (isLast) onComplete();
    else setCurrent((c) => c + 1);
  };

  return (
    <div className="w-full flex flex-col items-center py-10 px-4">
      {/* Indicador de progresso */}
      <div className="flex gap-3 mb-12">
        {data.stages.map((_, i) => (
          <div
            key={i}
            className={`h-1.5 rounded-full transition-all duration-700 ease-out ${
              i === current
                ? "w-24 bg-emerald-500 shadow-[0_0_12px_rgba(5,150,105,0.5)]"
                : i < current
                ? "w-8 bg-emerald-300"
                : "w-8 bg-slate-200"
            }`}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={stage.id}
          initial={{ opacity: 0, y: 30, scale: 0.97 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -30, scale: 1.02 }}
          transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
          className="glass-panel rounded-[3rem] p-10 md:p-16 w-full max-w-3xl flex flex-col items-center text-center border border-emerald-100"
        >
          <div className="flex items-center gap-3 mb-10">
            <div className="w-14 h-14 bg-emerald-100 border border-emerald-200 rounded-3xl text-emerald-700 flex items-center justify-center text-2xl font-black shadow-sm">
              {current + 1}
            </div>
            <div className="h-0.5 w-8 bg-slate-200" />
            <Sparkles className="text-emerald-400" size={22} />
          </div>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-black text-slate-900 mb-8 leading-tight tracking-tighter">
            {stage.title}
          </h2>

          <div className="w-full h-px bg-gradient-to-r from-transparent via-slate-200 to-transparent mb-10" />

          <p className="text-lg md:text-xl text-slate-600 font-medium leading-relaxed mb-12 max-w-2xl mx-auto">
            {stage.description}
          </p>

          <button
            onClick={next}
            className="group flex items-center gap-4 bg-emerald-600 hover:bg-emerald-700 text-white px-10 py-4 rounded-2xl font-black text-lg transition-all shadow-[0_8px_30px_rgba(5,150,105,0.25)] hover:shadow-[0_12px_40px_rgba(5,150,105,0.4)] active:scale-95"
          >
            {isLast ? (
              <>
                <CheckCircle2 size={22} />
                Concluir Lição
              </>
            ) : (
              <>
                Próximo Passo
                <motion.div
                  animate={{ x: [0, 5, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <ArrowRight size={22} className="group-hover:translate-x-1 transition-transform" />
                </motion.div>
              </>
            )}
          </button>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
