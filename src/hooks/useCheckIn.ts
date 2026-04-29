"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { clinicalKeys } from "@/lib/api/keys";
import { useCheckInStore, CheckInEntry } from "@/store/useCheckInStore";
import { toast } from "sonner";

import { AreaProgress } from "@/store/useCheckInStore";

export interface CheckInPayload {
  cravingLevel: number;
  mood: "great" | "good" | "neutral" | "bad" | "awful";
  trigger: string;
  areas: AreaProgress;
}

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

interface BackendCheckIn {
  id: number;
  date: string;
  craving_level: number;
  mood: "great" | "good" | "neutral" | "bad" | "awful";
  trigger: string;
  areas: AreaProgress;
}

/**
 * useCheckIn — orquestra o store de check-ins com o Django backend usando React Query.
 */
export function useCheckIn() {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  
  // Estado local e sincronização
  const currentAreas = useCheckInStore((s) => s.currentAreas);
  const setEntries = useCheckInStore((s) => s.setEntries);

  // 1. Fetching com Cache e Retry (React Query)
  const { data: checkIns, isLoading, refetch } = useQuery({
    queryKey: clinicalKeys.list({ type: 'checkin' }),
    queryFn: async () => {
      const res = await fetch(`${API_URL}/api/checkin/`, {
        headers: { Authorization: `Bearer ${session?.accessToken}` },
      });
      if (!res.ok) throw new Error("Falha ao carregar histórico de check-ins");
      
      const data = await res.json();
      const results: BackendCheckIn[] = Array.isArray(data) ? data : data.results || [];

      return results.map((d) => ({
        id: d.id.toString(),
        date: d.date,
        cravingLevel: d.craving_level,
        mood: d.mood,
        trigger: d.trigger,
        areas: d.areas,
      }));
    },
    enabled: !!session?.accessToken,
  });

  // Hidrata a store legado para componentes que ainda dependem do Zustand
  useEffect(() => {
    if (checkIns) setEntries(checkIns);
  }, [checkIns, setEntries]);

  // 2. Mutação com Optimistic Update
  const checkInMutation = useMutation({
    mutationFn: async (data: Omit<CheckInEntry, "id" | "date">) => {
      const res = await fetch(`${API_URL}/api/checkin/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.accessToken}`,
        },
        body: JSON.stringify({
          craving_level: data.cravingLevel,
          mood: data.mood,
          trigger: data.trigger,
          areas: data.areas,
        }),
      });
      if (!res.ok) throw new Error("Não foi possível salvar o check-in");
      return res.json();
    },
    onMutate: async (newCheckIn) => {
      // Cancela queries em andamento
      await queryClient.cancelQueries({ queryKey: clinicalKeys.list({ type: 'checkin' }) });
      
      // Salva snapshot
      const previousCheckIns = queryClient.getQueryData<CheckInEntry[]>(clinicalKeys.list({ type: 'checkin' }));
      
      // Update otimista na query cache
      queryClient.setQueryData<CheckInEntry[]>(clinicalKeys.list({ type: 'checkin' }), (old) => {
        const optimisticEntry: CheckInEntry = {
          ...newCheckIn,
          id: `temp-${Date.now()}`,
          date: new Date().toISOString(),
        };
        return old ? [optimisticEntry, ...old] : [optimisticEntry];
      });

      return { previousCheckIns };
    },
    onError: (err: Error, newCheckIn, context) => {
      // Rollback
      if (context?.previousCheckIns) {
        queryClient.setQueryData(clinicalKeys.list({ type: 'checkin' }), context.previousCheckIns);
      }
      
      // Padronizado via ERROR_HANDLING_GUIDE.md
      console.warn('[REIBB_API_ERROR]', { 
        code: 'CHECKIN_SUBMISSION_FAILED', 
        message: err.message 
      });

      toast.error(err.message || "Erro de conexão ao salvar check-in.", {
        action: { label: 'Tentar novamente', onClick: () => checkInMutation.mutate(newCheckIn) },
        duration: 6000,
      });
    },
    onSuccess: () => {
      toast.success("Check-in registrado com sucesso!");
    },
    onSettled: () => {
      // Sempre recarrega na conclusão (sucesso ou falha)
      queryClient.invalidateQueries({ queryKey: clinicalKeys.list({ type: 'checkin' }) });
    },
  });

  return { 
    entries: checkIns || [], 
    currentAreas, 
    submitCheckIn: checkInMutation.mutate, 
    fetchCheckIns: refetch, // Manter compatibilidade da API
    isLoading 
  };
}
