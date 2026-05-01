"use client";

import { motion, AnimatePresence } from "framer-motion";
import {
  TrailConfig,
  isNarrative,
  isMythReveal,
  isResistance,
  isQuiz,
  isVideo,
  isReflection,
} from "@/types/trail-content";

// Renderers
import { NarrativeRenderer } from "./renderers/NarrativeRenderer";
import { MythRevealRenderer } from "./renderers/MythRevealRenderer";
import { ResistanceRenderer } from "./renderers/ResistanceRenderer";
import { QuizRenderer } from "./renderers/QuizRenderer";
import { ReflectionRenderer } from "./renderers/ReflectionRenderer";
import { BreathingRenderer } from "./renderers/BreathingRenderer";

// Componentes interativos ricos (legacy migrados)
import { Trail3Interactive } from "@/components/Trails/Trail3Interactive";
import { Trail7Interactive } from "@/components/Trails/Trail7Interactive";

interface TrailRendererProps {
  trail: TrailConfig;
  onComplete: () => void;
}

/**
 * ENGINE CENTRAL — Portal Renascer
 * Lê o `trail.type` e despacha para o renderer correto.
 * Adicionar uma nova trilha = criar um arquivo de config, sem novo código de UI.
 */
export function TrailRenderer({ trail, onComplete }: TrailRendererProps) {
  const { type, content } = trail;

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={`renderer-${trail.id}`}
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -16 }}
        transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
        className="w-full"
      >
        {type === "narrative" && isNarrative(content) && (
          <NarrativeRenderer data={content} onComplete={onComplete} />
        )}

        {type === "myth_reveal" && isMythReveal(content) && (
          <MythRevealRenderer data={content} onComplete={onComplete} />
        )}

        {type === "resistance" && isResistance(content) && (
          <ResistanceRenderer data={content} onComplete={onComplete} />
        )}

        {type === "quiz" && isQuiz(content) && (
          <QuizRenderer data={content} onComplete={onComplete} />
        )}

        {type === "video" && isVideo(content) && (
          // VideoContent usa o player nativo — renderer inline aqui
          <VideoFallback onComplete={onComplete} />
        )}

        {type === "breathing" && (
          <BreathingRenderer onComplete={onComplete} />
        )}

        {type === "reflection" && isReflection(content) && (
          <ReflectionRenderer data={content} onComplete={onComplete} />
        )}

        {/* Renderer interativo avançado: delega para componentes ricos por ID */}
        {type === "interactive" && trail.id === 3 && (
          <Trail3Interactive onComplete={onComplete} />
        )}
        {type === "interactive" && trail.id === 7 && (
          <Trail7Interactive onComplete={onComplete} />
        )}
      </motion.div>
    </AnimatePresence>
  );
}

/** Placeholder para trilhas sem renderer ainda implementado */
function VideoFallback({ onComplete }: { onComplete: () => void }) {
  return (
    <div className="glass-panel rounded-3xl p-10 flex flex-col items-center text-center border border-slate-200">
      <p className="text-slate-500 mb-6 font-medium text-lg">Conteúdo em vídeo/áudio</p>
      <button
        onClick={onComplete}
        className="bg-emerald-600 hover:bg-emerald-700 text-white px-10 py-4 rounded-full font-bold shadow-lg transition-all"
      >
        Concluir Etapa
      </button>
    </div>
  );
}
