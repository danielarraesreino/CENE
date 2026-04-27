"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldAlert, HeartHandshake, Gavel, Sparkles, ArrowRight } from "lucide-react";
import { ResistanceContent } from "@/types/trail-content";

export function ResistanceRenderer({
  data,
  onComplete,
}: {
  data: ResistanceContent;
  onComplete: () => void;
}) {
  const [currentPhase, setCurrentPhase] = useState(0);
  const [resistance, setResistance] = useState(100);
  const steps = data.wallHitSteps ?? 4;
  const hitAmount = Math.ceil(100 / steps);

  const phase = data.phases[currentPhase];
  const isWallPhase = currentPhase === 1; 
  const isFinalPhase = currentPhase === data.phases.length - 1;

  const handleHit = () => {
    if (resistance > 0) setResistance((prev) => Math.max(0, prev - hitAmount));
  };

  const advance = () => {
    if (isFinalPhase) onComplete();
    else setCurrentPhase((p) => p + 1);
  };

  return (
    <div className="w-full flex flex-col items-center py-10 px-4 min-h-[600px]">
      {/* Indicador de fase */}
      <div className="flex gap-3 mb-16">
        {data.phases.map((_, i) => (
          <div
            key={i}
            className={`h-2 rounded-full transition-all duration-700 ${
              currentPhase === i
                ? "w-16 bg-emerald-500 shadow-[0_0_15px_rgba(16,185,129,0.5)]"
                : i < currentPhase
                ? "w-8 bg-emerald-300"
                : "w-8 bg-slate-200"
            }`}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        {isWallPhase ? (
          <motion.div
            key="wall"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05, filter: "blur(10px)" }}
            transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
            className="flex flex-col items-center text-center max-w-3xl w-full"
          >
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tighter uppercase">
              {phase.title}
            </h2>
            <p className="text-lg md:text-xl text-slate-600 mb-12 leading-relaxed">
              {phase.body}
            </p>

            {/* Muralha interativa */}
            <div className="relative w-72 h-72 md:w-80 md:h-80 flex items-center justify-center mb-16">
              <motion.div
                animate={{ 
                  scale: 0.95 + resistance / 2000, 
                  rotate: resistance > 0 ? [0, -1, 1, 0] : 0,
                  boxShadow: resistance > 0 
                    ? `0 0 ${20 + (100 - resistance)/2}px rgba(239, 68, 68, ${0.1 + (100 - resistance) / 300})`
                    : "0 0 50px rgba(16, 185, 129, 0.3)"
                }}
                transition={{ rotate: { repeat: Infinity, duration: 2 } }}
                className={`w-full h-full glass-panel rounded-[3rem] border-8 flex flex-col items-center justify-center relative overflow-hidden cursor-pointer transition-colors duration-500 ${
                  resistance === 0 
                    ? "border-emerald-400 bg-emerald-50" 
                    : "border-slate-200 hover:border-red-300 bg-white"
                }`}
                onClick={handleHit}
              >
                <ShieldAlert
                  size={100}
                  className={`transition-all duration-700 ${
                    resistance === 0 
                      ? "text-emerald-500 scale-125" 
                      : "text-slate-300 group-hover:text-red-400"
                  }`}
                />
                
                <div className="mt-8 w-full px-10">
                  <span className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-2 block">
                    {data.wallLabel ?? "Resistência do Ego"}
                  </span>
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
                    <motion.div 
                      animate={{ width: `${resistance}%` }} 
                      className={`h-full rounded-full transition-colors duration-500 ${
                        resistance === 0 ? "bg-emerald-500" : "bg-red-500"
                      }`} 
                    />
                  </div>
                </div>

                {resistance > 0 && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute inset-0 flex items-center justify-center pointer-events-none"
                  >
                    <div className="w-full h-full bg-red-500/5 group-hover:bg-red-500/10 transition-colors" />
                  </motion.div>
                )}
              </motion.div>

              {resistance > 0 && (
                <motion.div
                  animate={{ y: [0, -8, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="absolute -top-4 -right-4 bg-red-500 text-white px-5 py-3 rounded-2xl shadow-xl text-xs font-black flex items-center gap-2 border-2 border-white"
                >
                  <Gavel size={18} /> GOLPEAR
                </motion.div>
              )}
            </div>

            <AnimatePresence mode="wait">
              {resistance === 0 ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex flex-col items-center"
                >
                  <p className="text-emerald-600 font-black text-xl mb-8 tracking-tight flex items-center gap-2">
                    <Sparkles size={20}/> {phase.ctaLabel}
                  </p>
                  <button
                    onClick={advance}
                    className="bg-emerald-600 text-white px-12 py-5 rounded-full font-black text-lg shadow-[0_10px_30px_rgba(5,150,105,0.3)] hover:scale-105 active:scale-95 transition-all"
                  >
                    Avançar para o Despertar
                  </button>
                </motion.div>
              ) : (
                <div className="flex items-center gap-3 text-slate-400 font-bold uppercase tracking-[0.2em] text-xs animate-pulse">
                  <div className="w-8 h-px bg-slate-300" />
                  Quebre a Muralha da Negação
                  <div className="w-8 h-px bg-slate-300" />
                </div>
              )}
            </AnimatePresence>
          </motion.div>
        ) : (
          <motion.div
            key={`phase-${currentPhase}`}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -30 }}
            transition={{ duration: 0.5, ease: [0.23, 1, 0.32, 1] }}
            className="flex flex-col items-center text-center max-w-3xl w-full"
          >
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6 tracking-tighter uppercase">
              {phase.title}
            </h2>
            <p className="text-lg md:text-xl text-slate-600 mb-12 leading-relaxed">
              {phase.body}
            </p>

            {isFinalPhase && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full mb-12">
                <div className="glass-panel p-8 rounded-[2.5rem] border border-emerald-200 text-center relative overflow-hidden group bg-emerald-50/50">
                  <HeartHandshake size={48} className="text-emerald-600 mb-5 mx-auto" />
                  <h4 className="text-emerald-900 font-black mb-3 text-lg uppercase tracking-widest">O Poder do Grupo</h4>
                  <p className="text-base text-emerald-700/80 leading-relaxed font-medium">
                    Sozinho eu não consigo. Mas nós somos capazes de tudo.
                  </p>
                </div>
                <div className="glass-panel p-8 rounded-[2.5rem] border border-blue-200 text-center relative overflow-hidden group bg-blue-50/50">
                  <ShieldAlert size={48} className="text-blue-600 mb-5 mx-auto" />
                  <h4 className="text-blue-900 font-black mb-3 text-lg uppercase tracking-widest">Nova Identidade</h4>
                  <p className="text-base text-blue-700/80 leading-relaxed font-medium">
                    A humildade é a base sólida sobre a qual reconstruímos a vida.
                  </p>
                </div>
              </div>
            )}

            <button
              onClick={advance}
              className={`group flex items-center gap-4 px-12 py-5 rounded-full font-black text-lg transition-all shadow-lg active:scale-95 ${
                isFinalPhase
                  ? "bg-emerald-600 hover:bg-emerald-700 text-white shadow-emerald-600/30"
                  : "bg-slate-800 hover:bg-slate-700 text-white shadow-slate-800/20"
              }`}
            >
              {isFinalPhase ? (
                <>
                  <HeartHandshake size={24} /> 
                  {phase.ctaLabel}
                </>
              ) : (
                <>
                  {phase.ctaLabel}
                  <ArrowRight size={20} className="group-hover:translate-x-2 transition-transform" />
                </>
              )}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
