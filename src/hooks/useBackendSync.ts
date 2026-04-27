"use client";

import { useCallback } from "react";
import { useSession } from "next-auth/react";
import { useProgressStore, TrailProgress } from "@/store/useProgressStore";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

/**
 * useBackendSync — orquestra a sincronização bidirecional
 * entre o Zustand store e o Django REST backend.
 */
export function useBackendSync() {
  const { data: session } = useSession();
  const setTrails = useProgressStore((s) => s.setTrails);

  /** Hydrata o store com o progresso do banco de dados */
  const fetchProgress = useCallback(async (): Promise<void> => {
    if (!session?.accessToken) return;
    try {
      const res = await fetch(`${API_URL}/api/trails/progress/`, {
        headers: { Authorization: `Bearer ${session.accessToken}` },
      });
      if (!res.ok) return;

      const data: Array<{
        trail_id: number;
        ouvir: boolean;
        estudar: boolean;
        avaliar: boolean;
      }> = await res.json();

      // Pegamos o estado atual DIRETAMENTE da store para evitar dependência no hook scope
      const currentTrails = useProgressStore.getState().trails;

      const mergedTrails: TrailProgress[] = currentTrails.map((t) => {
        const backendTrail = data.find((d) => d.trail_id === t.id);
        if (!backendTrail) return t;

        const progress = {
          ouvir: backendTrail.ouvir,
          estudar: backendTrail.estudar,
          avaliar: backendTrail.avaliar,
        };
        const isCompleted = progress.ouvir && progress.estudar && progress.avaliar;
        const isInProgress = Object.values(progress).some(Boolean);

        return {
          ...t,
          progress,
          status: isCompleted ? "completed" : isInProgress ? "in_progress" : "idle",
          isUnlocked: t.id === 1 || isCompleted || t.isUnlocked,
        };
      });

      // Garante que a próxima trilha de cada completed está desbloqueada
      const finalTrails = mergedTrails.map((t, i) => {
        if (i === 0) return t;
        const prev = mergedTrails[i - 1];
        return prev.status === "completed" ? { ...t, isUnlocked: true } : t;
      });

      setTrails(finalTrails);
    } catch (err) {
      console.warn("[useBackendSync] fetchProgress falhou:", err);
    }
  }, [session, setTrails]);

  /** Envia o progresso local para o banco em lote */
  const syncTrails = useCallback(async (currentTrails: TrailProgress[]): Promise<void> => {
    if (!session?.accessToken) return;
    try {
      const payload = currentTrails.map((t) => ({
        trail_id: t.id,
        ...t.progress,
      }));
      await fetch(`${API_URL}/api/trails/sync/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.accessToken}`,
        },
        body: JSON.stringify(payload),
      });
    } catch (err) {
      console.warn("[useBackendSync] syncTrails falhou:", err);
    }
  }, [session]);

  return { fetchProgress, syncTrails };
}
