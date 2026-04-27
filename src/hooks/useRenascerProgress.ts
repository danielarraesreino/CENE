"use client";

import { useCallback, useMemo } from "react";
import { useProgressStore } from "@/store/useProgressStore";
import { useBackendSync } from "./useBackendSync";

/**
 * useRenascerProgress — hook orquestrador principal.
 * Combina store local + sync backend em uma API única.
 */
export function useRenascerProgress() {
  const trails = useProgressStore((s) => s.trails);
  const completeStep = useProgressStore((s) => s.completeStep);
  const { syncTrails, fetchProgress } = useBackendSync();

  /** Marca um step como concluído e sincroniza com o backend */
  const handleStepComplete = useCallback(async (
    trailId: number,
    step: "ouvir" | "estudar" | "avaliar"
  ) => {
    completeStep(trailId, step);
    // Sincroniza depois de atualizar o estado local
    await syncTrails(useProgressStore.getState().trails);
  }, [completeStep, syncTrails]);

  /** Percentual global de conclusão */
  const completionPercent = useMemo(() => 
    trails.length === 0
      ? 0
      : Math.round(
          (trails.filter((t) => t.status === "completed").length /
            trails.length) *
            100
        )
  , [trails]);

  /** Trilhas agrupadas por categoria */
  const trailsByCategory = useMemo(() => 
    trails.reduce<Record<string, typeof trails>>(
      (acc, t) => {
        if (!acc[t.category]) acc[t.category] = [];
        acc[t.category].push(t);
        return acc;
      },
      {}
    )
  , [trails]);

  /** Próxima trilha disponível (desbloqueada e não concluída) */
  const nextTrail = useMemo(() => 
    trails.find(
      (t) => t.isUnlocked && t.status !== "completed"
    )
  , [trails]);

  return {
    trails,
    trailsByCategory,
    completionPercent,
    nextTrail,
    handleStepComplete,
    fetchProgress,
  };
}
