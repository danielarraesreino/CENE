"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { PenLine, CheckCircle2 } from "lucide-react";
import { ReflectionContent } from "@/types/trail-content";

export function ReflectionRenderer({
  data,
  onComplete,
}: {
  data: ReflectionContent;
  onComplete: () => void;
}) {
  const [text, setText] = useState("");
  const minWords = data.minWords ?? 10;
  const wordCount = text.trim().split(/\s+/).filter(Boolean).length;
  const canComplete = wordCount >= minWords;

  return (
    <div className="w-full flex flex-col items-center py-10 px-4">
      <div className="glass-panel rounded-3xl p-8 md:p-12 w-full max-w-3xl flex flex-col gap-6 border border-slate-200">
        <div className="flex items-center gap-4 mb-2">
          <div className="p-4 bg-emerald-100 rounded-2xl text-emerald-700 shadow-sm">
            <PenLine size={28} />
          </div>
          <h2 className="text-2xl font-black text-slate-900">Reflexão Guiada</h2>
        </div>

        <div className="bg-emerald-50 border-l-4 border-emerald-500 p-6 rounded-r-2xl mb-4">
          <p className="text-emerald-900 leading-relaxed text-lg italic font-medium">
            "{data.prompt}"
          </p>
        </div>

        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Escreva sua reflexão aqui. Sinta-se livre para expressar o que vier à mente..."
          rows={8}
          className="w-full bg-slate-50 border border-slate-200 rounded-2xl p-5 text-slate-800 text-base leading-relaxed resize-none outline-none focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 transition-all placeholder:text-slate-400"
        />

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mt-2">
          <span className={`text-sm font-bold px-4 py-2 rounded-full transition-colors ${
            canComplete 
              ? "bg-emerald-100 text-emerald-700" 
              : "bg-slate-100 text-slate-500"
          }`}>
            {wordCount} / {minWords} palavras mínimas
          </span>
          
          <AnimatePresence>
            {canComplete && (
              <motion.button
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                onClick={onComplete}
                className="flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-4 rounded-full font-black text-lg transition-all shadow-[0_8px_20px_rgba(5,150,105,0.3)] w-full sm:w-auto active:scale-95"
              >
                <CheckCircle2 size={20} /> Concluir Reflexão
              </motion.button>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
