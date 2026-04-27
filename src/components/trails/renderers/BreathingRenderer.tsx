"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BreathingContent } from "@/types/trail-content";

type Phase = "inhale" | "hold" | "exhale" | "rest";

const TECHNIQUES: Record<string, { inhale: number; hold: number; exhale: number; rest: number; label: string }> = {
  "box":   { inhale: 4, hold: 4, exhale: 4, rest: 4, label: "Box Breathing (4-4-4-4)" },
  "4-7-8": { inhale: 4, hold: 7, exhale: 8, rest: 2, label: "Respiração 4-7-8" },
  "4-4-4": { inhale: 4, hold: 4, exhale: 4, rest: 0, label: "Respiração 4-4-4" },
};

const PHASE_LABELS: Record<Phase, string> = {
  inhale: "Inspire",
  hold:   "Segure",
  exhale: "Expire",
  rest:   "Descanse",
};

export function BreathingRenderer({
  data = {},
  onComplete,
}: {
  data?: BreathingContent;
  onComplete: () => void;
}) {
  const technique = TECHNIQUES[data.technique ?? "box"];
  const totalRounds = data.rounds ?? 4;

  const [phase, setPhase] = useState<Phase>("inhale");
  const [timeLeft, setTimeLeft] = useState(technique.inhale);
  const [round, setRound] = useState(1);
  const [done, setDone] = useState(false);

  useEffect(() => {
    if (done) return;
    
    const interval = setInterval(() => {
      setTimeLeft((prevTime) => {
        if (prevTime > 1) {
          return prevTime - 1;
        }

        setPhase((prevPhase) => {
          const next = nextPhase(prevPhase, technique);
          
          if (next === "inhale") {
            setRound((r) => {
              if (r >= totalRounds) {
                setDone(true);
              }
              return r + 1;
            });
          }
          
          return next;
        });

        const currentNext = nextPhase(phase, technique);
        return technique[currentNext];
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [done, technique, totalRounds, phase]);

  const scale = phase === "inhale" ? 1.3 : phase === "hold" ? 1.3 : 1;

  if (done) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-panel rounded-3xl p-12 flex flex-col items-center text-center border border-slate-200"
      >
        <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center text-5xl mb-6 shadow-sm">
          🌿
        </div>
        <h2 className="text-2xl font-black text-slate-900 mb-4">Exercício Concluído</h2>
        <p className="text-slate-600 mb-8 text-lg">
          {data.message ?? "Você completou o exercício de respiração. Continue com calma."}
        </p>
        <button
          onClick={onComplete}
          className="bg-emerald-600 hover:bg-emerald-700 text-white px-12 py-4 rounded-full font-black text-lg shadow-[0_8px_30px_rgba(5,150,105,0.3)] transition-all active:scale-95"
        >
          Continuar
        </button>
      </motion.div>
    );
  }

  return (
    <div className="flex flex-col items-center py-10">
      <p className="text-emerald-700 text-sm font-black uppercase tracking-[0.2em] mb-2 bg-emerald-50 px-4 py-1.5 rounded-full border border-emerald-100">
        {technique.label}
      </p>
      <p className="text-slate-500 text-sm font-medium mb-12">Rodada {round} de {totalRounds}</p>

      {/* Círculo animado */}
      <div className="relative w-64 h-64 flex items-center justify-center mb-16">
        <motion.div
          animate={{ scale }}
          transition={{ duration: technique[phase], ease: "easeInOut" }}
          className="absolute inset-0 rounded-full bg-emerald-400/20 blur-3xl"
        />
        <motion.div
          animate={{ scale }}
          transition={{ duration: technique[phase], ease: "easeInOut" }}
          className="w-48 h-48 rounded-full border-4 border-emerald-400 bg-emerald-50 flex flex-col items-center justify-center shadow-lg"
        >
          <AnimatePresence mode="wait">
            <motion.span
              key={phase}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              className="text-emerald-800 font-bold text-xl uppercase tracking-widest"
            >
              {PHASE_LABELS[phase]}
            </motion.span>
          </AnimatePresence>
          <span className="text-emerald-600 text-5xl font-black mt-2 leading-none">{timeLeft}</span>
        </motion.div>
      </div>

      {/* Barra de progresso das rodadas */}
      <div className="flex gap-3">
        {Array.from({ length: totalRounds }).map((_, i) => (
          <div
            key={i}
            className={`h-2.5 w-10 rounded-full transition-all duration-500 ${
              i < round - 1 
                ? "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.4)]" 
                : i === round - 1 
                ? "bg-emerald-300" 
                : "bg-slate-200"
            }`}
          />
        ))}
      </div>
    </div>
  );
}

function nextPhase(
  current: Phase,
  t: { inhale: number; hold: number; exhale: number; rest: number }
): Phase {
  if (current === "inhale") return "hold";
  if (current === "hold") return "exhale";
  if (current === "exhale") return t.rest > 0 ? "rest" : "inhale";
  return "inhale";
}
