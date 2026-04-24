import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Trail {
  id: number;
  title: string;
  isUnlocked: boolean;
  status: 'idle' | 'in_progress' | 'completed';
  progress: {
    ouvir: boolean;
    estudar: boolean;
    avaliar: boolean;
  };
}

const initialTrails: Trail[] = [
  { id: 1, title: 'A Gênese do Rei Bebê', isUnlocked: true, status: 'idle', progress: { ouvir: false, estudar: false, avaliar: false } },
  { id: 2, title: 'Máscaras e Mitos da Personalidade', isUnlocked: false, status: 'idle', progress: { ouvir: false, estudar: false, avaliar: false } },
  { id: 3, title: 'O Ciclo Vicioso e a Combinação Fatal', isUnlocked: false, status: 'idle', progress: { ouvir: false, estudar: false, avaliar: false } },
  { id: 4, title: 'O Ponto de Ruptura (Rendição)', isUnlocked: false, status: 'idle', progress: { ouvir: false, estudar: false, avaliar: false } },
  { id: 5, title: 'Curando a Criança Assustada', isUnlocked: false, status: 'idle', progress: { ouvir: false, estudar: false, avaliar: false } },
  { id: 6, title: 'Ferramentas de Reconstrução do Eu', isUnlocked: false, status: 'idle', progress: { ouvir: false, estudar: false, avaliar: false } },
  { id: 7, title: 'Gestão de Recaída e Manutenção', isUnlocked: false, status: 'idle', progress: { ouvir: false, estudar: false, avaliar: false } },
];

interface AppState {
  trails: Trail[];
  revealedMyths: string[]; // Específico da trilha 2
  
  // Ações genéricas
  completeStep: (trailId: number, step: keyof Trail['progress']) => void;
  revealMyth: (mythId: string) => void;
  resetProgress: () => void;
  unlockAllTrails: () => void;
  setTrails: (trails: Trail[]) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      trails: initialTrails,
      revealedMyths: [],

      completeStep: (trailId, step) =>
        set((state) => {
          const newTrails = state.trails.map((trail) => {
            if (trail.id === trailId) {
              const newProgress = { ...trail.progress, [step]: true };
              const isCompleted = newProgress.ouvir && newProgress.estudar && newProgress.avaliar;
              return {
                ...trail,
                status: (isCompleted ? 'completed' : 'in_progress') as 'idle' | 'in_progress' | 'completed',
                progress: newProgress,
              };
            }
            return trail;
          });

          // Lógica de desbloqueio automático da próxima trilha
          const currentTrailIndex = newTrails.findIndex((t) => t.id === trailId);
          if (currentTrailIndex !== -1 && newTrails[currentTrailIndex].status === 'completed') {
            if (currentTrailIndex + 1 < newTrails.length) {
              newTrails[currentTrailIndex + 1].isUnlocked = true;
            }
          }

          return { trails: newTrails };
        }),

      revealMyth: (mythId) =>
        set((state) => ({
          revealedMyths: state.revealedMyths.includes(mythId)
            ? state.revealedMyths
            : [...state.revealedMyths, mythId],
        })),

      resetProgress: () => set({ trails: initialTrails, revealedMyths: [] }),

      unlockAllTrails: () => set((state) => ({
        trails: state.trails.map(trail => ({
          ...trail,
          isUnlocked: true,
          status: 'completed' as const,
          progress: { ouvir: true, estudar: true, avaliar: true }
        }))
      })),

      setTrails: (trails) => set({ trails }),
    }),
    {
      name: 'reibb-hub-storage', // salva no localStorage
    }
  )
);
