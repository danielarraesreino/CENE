"use client";

import { use, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import Link from "next/link";
import {
  Headphones,
  BookOpen,
  PenTool,
  CheckCircle2,
  ChevronLeft,
  Info,
  Volume2,
} from "lucide-react";

import { useProgressStore } from "@/store/useProgressStore";
import { useRenascerProgress } from "@/hooks/useRenascerProgress";
import { TrailRenderer } from "@/components/trails/TrailRenderer";
import { QuizRenderer } from "@/components/trails/renderers/QuizRenderer";
import { CertificateGenerator } from "@/components/Certificate/CertificateGenerator";

// Registro de configs de trilha — adicionar novas trilhas aqui
import { trail001 } from "@/content/trails/trail-001";
import { trail002 } from "@/content/trails/trail-002";
import { trail003 } from "@/content/trails/trail-003";
import { trail004 } from "@/content/trails/trail-004";
import { trail005 } from "@/content/trails/trail-005";
import { trail006 } from "@/content/trails/trail-006";
import { trail007 } from "@/content/trails/trail-007";
import type { TrailConfig } from "@/types/trail-content";

/** Mapa id → config. Todas as 7 trilhas da jornada Renascer. */
const TRAIL_CONFIGS: Record<number, TrailConfig> = {
  1: trail001,
  2: trail002,
  3: trail003,
  4: trail004,
  5: trail005,
  6: trail006,
  7: trail007,
};

type Stage = "ouvir" | "estudar" | "avaliar";

/** Instrução pedagógica por aba */
const STAGE_HINTS: Record<Stage, string> = {
  ouvir:
    "Ouça o áudio com atenção. Quando terminar, clique em 'Marcar como Ouvido' para avançar para o estudo interativo.",
  estudar:
    "Explore o conteúdo interativo abaixo. Ao concluir todas as etapas, o botão de conclusão aparecerá automaticamente.",
  avaliar:
    "Responda às questões para validar seu aprendizado. Você precisa de 70% de acerto para concluir esta trilha.",
};

export default function TrilhaPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const trailId = parseInt(id, 10);
  const router = useRouter();
  const { data: session } = useSession();

  const trail = useProgressStore((s) => s.trails.find((t) => t.id === trailId));
  const { handleStepComplete } = useRenascerProgress();

  // Inicia na primeira aba não-concluída, para não forçar refazer
  const getInitialStage = (): Stage => {
    if (!trail) return "ouvir";
    if (!trail.progress.ouvir) return "ouvir";
    if (!trail.progress.estudar) return "estudar";
    if (!trail.progress.avaliar) return "avaliar";
    return "ouvir"; // trilha completa — permite revisar
  };

  const [currentStage, setCurrentStage] = useState<Stage>(getInitialStage());
  const [audioEnded, setAudioEnded] = useState(false);

  useEffect(() => {
    if (!trail || !trail.isUnlocked) router.push("/hub");
  }, [trail, router]);

  if (!trail) return null;

  const trailConfig = TRAIL_CONFIGS[trailId] ?? null;

  // Quiz da aba Avaliar — usa quizContent dedicado ou, se for trilha tipo quiz, usa o content
  const avaliarQuiz =
    trailConfig?.quizContent ??
    (trailConfig?.type === "quiz" && "questions" in trailConfig.content
      ? (trailConfig.content as import("@/types/trail-content").QuizContent)
      : null);

  const handleComplete = async (stage: Stage) => {
    await handleStepComplete(trailId, stage);
    if (stage === "ouvir") setCurrentStage("estudar");
    else if (stage === "estudar") setCurrentStage("avaliar");
    else if (stage === "avaliar") router.push("/hub");
  };

  const tabs = [
    { id: "ouvir", label: "1. Ouvir", icon: Headphones },
    { id: "estudar", label: "2. Estudar", icon: BookOpen },
    { id: "avaliar", label: "3. Avaliar", icon: PenTool },
  ] as const;

  return (
    <div className="relative min-h-screen p-8 md:p-12 max-w-7xl mx-auto w-full flex flex-col">
      <Link
        href="/hub"
        className="inline-flex items-center text-slate-500 hover:text-emerald-700 transition-colors mb-8 w-max"
      >
        <ChevronLeft size={20} className="mr-2" />
        Voltar para o Hub
      </Link>

      {/* Cabeçalho + Tabs */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-8 gap-6">
        <div>
          <span className="text-emerald-700 font-bold tracking-widest uppercase text-sm mb-2 block">
            {trail.category} · Trilha {trail.id}
          </span>
          <h1 className="text-4xl md:text-5xl font-heading font-black text-slate-900">
            {trail.title}
          </h1>
        </div>

        <div className="flex bg-slate-200 p-1 rounded-full border border-slate-300 overflow-hidden">
          {tabs.map((tab) => {
            const isActive = currentStage === tab.id;
            const isCompleted = trail.progress[tab.id];
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setCurrentStage(tab.id)}
                className={`relative px-6 py-3 rounded-full flex items-center gap-2 text-sm font-medium transition-all ${
                  isActive
                    ? "text-emerald-900"
                    : "text-slate-500 hover:text-emerald-700 hover:bg-slate-100"
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-emerald-100 border border-emerald-200 rounded-full -z-10"
                  />
                )}
                <Icon size={18} />
                <span className="hidden sm:inline">{tab.label}</span>
                {isCompleted && (
                  <CheckCircle2 size={14} className="text-emerald-600 ml-1" />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Banner de instrução pedagógica */}
      <motion.div
        key={currentStage}
        initial={{ opacity: 0, y: -8 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-start gap-3 bg-emerald-50 border border-emerald-200 rounded-2xl px-5 py-4 mb-8"
      >
        <Info size={18} className="text-emerald-600 shrink-0 mt-0.5" />
        <p className="text-emerald-800 text-sm font-medium">
          {STAGE_HINTS[currentStage]}
        </p>
      </motion.div>

      {/* Conteúdo */}
      <div className="flex-1 relative w-full">
        <AnimatePresence mode="wait">

          {/* ── OUVIR ─────────────────────────────────────────────── */}
          {currentStage === "ouvir" && (
            <motion.div
              key="ouvir"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="glass-panel rounded-3xl p-10 flex flex-col items-center justify-center text-center min-h-[500px]"
            >
              <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mb-6 shadow-sm">
                <Headphones size={48} className="text-emerald-600" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900 mb-4">
                Ouça o Módulo {trail.id}
              </h2>
              <p className="text-slate-600 max-w-xl mb-8">
                Dê play no áudio abaixo para assimilar os conceitos antes de
                avançar para o estudo interativo.
              </p>

              <div className="w-full max-w-md bg-slate-100 p-4 rounded-2xl border border-slate-200 mb-8">
                <audio
                  controls
                  className="w-full h-12 outline-none rounded-lg"
                  src={trailConfig?.audioUrl ?? ""}
                  onEnded={() => setAudioEnded(true)}
                >
                  Seu navegador não suporta o elemento de áudio.
                </audio>
                <div className="flex justify-between w-full px-2 mt-2">
                  <span className="text-xs text-emerald-700 font-medium tracking-wider flex items-center gap-1">
                    <Volume2 size={12} />
                    {trailConfig?.audioUrl?.split("/").pop() ??
                      `TRILHA_${trailId}.MP3`}
                  </span>
                  <span className="text-xs text-slate-500">Trilha {trail.id}</span>
                </div>
              </div>

              {trail.progress.ouvir ? (
                <div className="flex items-center gap-2 text-emerald-700 font-bold">
                  <CheckCircle2 size={20} />
                  Áudio já concluído — você pode avançar para Estudar.
                </div>
              ) : (
                <motion.button
                  animate={
                    audioEnded
                      ? { scale: [1, 1.04, 1], boxShadow: ["0 0 0px rgba(5,150,105,0)", "0 0 30px rgba(5,150,105,0.5)", "0 0 10px rgba(5,150,105,0.2)"] }
                      : {}
                  }
                  transition={{ duration: 1.2, repeat: audioEnded ? Infinity : 0, repeatType: "loop" }}
                  onClick={() => handleComplete("ouvir")}
                  className={`px-8 py-4 rounded-full font-bold transition-all shadow-[0_0_20px_rgba(5,150,105,0.3)] text-white ${
                    audioEnded
                      ? "bg-emerald-600 hover:bg-emerald-700 scale-105"
                      : "bg-emerald-400 hover:bg-emerald-500"
                  }`}
                >
                  ✅ Marcar como Ouvido e Avançar
                </motion.button>
              )}
            </motion.div>
          )}

          {/* ── ESTUDAR — TrailRenderer ──────────────────────────── */}
          {currentStage === "estudar" && (
            <motion.div
              key="estudar"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="min-h-[500px] flex flex-col"
            >
              {trailConfig ? (
                <TrailRenderer
                  trail={trailConfig}
                  onComplete={() => handleComplete("estudar")}
                />
              ) : (
                <div className="glass-panel rounded-3xl p-10 flex flex-col items-center justify-center text-center flex-1">
                  <BookOpen size={48} className="text-slate-400 mb-6" />
                  <h2 className="text-2xl font-bold text-slate-900 mb-4">
                    Conteúdo em Breve
                  </h2>
                  <p className="text-slate-600 max-w-xl mb-8">
                    Material interativo da Trilha {trail.id} em preparação.
                  </p>
                  <button
                    onClick={() => handleComplete("estudar")}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-full font-bold"
                  >
                    Concluir Estudo
                  </button>
                </div>
              )}
            </motion.div>
          )}

          {/* ── AVALIAR ─────────────────────────────────────────── */}
          {currentStage === "avaliar" && (
            <motion.div
              key="avaliar"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="min-h-[500px] flex flex-col"
            >
              {trail.status === "completed" && trail.id === 7 ? (
                <div className="glass-panel rounded-3xl p-10 flex flex-col items-center justify-center text-center">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center"
                  >
                    <p className="text-emerald-700 font-bold mb-8 text-xl">
                      🎉 Parabéns! Você concluiu toda a jornada formativa.
                    </p>
                    <CertificateGenerator
                      userName={session?.user?.name ?? "Aluno(a)"}
                    />
                  </motion.div>
                </div>
              ) : avaliarQuiz ? (
                <QuizRenderer
                  data={avaliarQuiz}
                  onComplete={() => handleComplete("avaliar")}
                />
              ) : (
                <div className="glass-panel rounded-3xl p-10 flex flex-col items-center justify-center text-center">
                  <div className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mb-6 shadow-sm">
                    <PenTool size={48} className="text-emerald-600" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900 mb-4">
                    Avaliação Concluída
                  </h2>
                  <p className="text-slate-600 max-w-xl mb-8">
                    Confirme a conclusão desta trilha para desbloquear a próxima.
                  </p>
                  <button
                    onClick={() => handleComplete("avaliar")}
                    className="bg-emerald-600 hover:bg-emerald-700 text-white px-10 py-4 rounded-full font-bold text-lg transition-all shadow-[0_0_20px_rgba(5,150,105,0.3)]"
                  >
                    Concluir Avaliação
                  </button>
                </div>
              )}
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
