/**
 * useAppStore — camada de compatibilidade legada.
 *
 * A fonte de verdade para progresso de trilhas é `useProgressStore`.
 * Esta store mantém apenas o estado de `revealedMyths` (específico da Trilha 2)
 * e reexporta o tipo Trail de useProgressStore para não quebrar imports existentes.
 *
 * NÃO adicione novos campos de Trail aqui — use useProgressStore diretamente.
 */
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Reexportar o tipo canônico para evitar duplicação
export type { TrailProgress as Trail } from './useProgressStore';

interface AppState {
  revealedMyths: string[];
  revealMyth: (mythId: string) => void;
  resetMyths: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      revealedMyths: [],

      revealMyth: (mythId) =>
        set((state) => ({
          revealedMyths: state.revealedMyths.includes(mythId)
            ? state.revealedMyths
            : [...state.revealedMyths, mythId],
        })),

      resetMyths: () => set({ revealedMyths: [] }),
    }),
    {
      name: 'reibb-app-v2', // chave nova para evitar conflito com versão anterior
    }
  )
);
