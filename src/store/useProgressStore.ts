import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface TrailProgress {
  id: number;
  title: string;
  category: string;
  isUnlocked: boolean;
  isPremium: boolean;
  status: 'idle' | 'in_progress' | 'completed';
  progress: {
    ouvir: boolean;
    estudar: boolean;
    avaliar: boolean;
  };
}

interface CaminhosStats {
  resilience: number;
  social: number;
  achievements: { icon: string; name: string; desc: string }[];
  completedCount: number;
}

interface ProgressState {
  trails: TrailProgress[];
  caminhosStats?: CaminhosStats;

  // Ações
  completeStep: (trailId: number, step: keyof TrailProgress['progress']) => void;
  setTrails: (trails: TrailProgress[]) => void;
  unlockTrail: (trailId: number) => void;
  resetProgress: () => void;
  unlockAllTrails: () => void;
  setCaminhosStats: (stats: Omit<CaminhosStats, 'completedCount'>) => void;
}

const defaultTrails: TrailProgress[] = [
  { id: 1, title: 'A Gênese do Rei Bebê', category: 'Fundamentos', isUnlocked: true,  isPremium: false, status: 'idle', progress: { ouvir: false, estudar: false, avaliar: false } },
  { id: 2, title: 'Máscaras e Mitos',      category: 'Fundamentos', isUnlocked: false, isPremium: false, status: 'idle', progress: { ouvir: false, estudar: false, avaliar: false } },
  { id: 3, title: 'O Ciclo Vicioso',       category: 'Fundamentos', isUnlocked: false, isPremium: false, status: 'idle', progress: { ouvir: false, estudar: false, avaliar: false } },
  { id: 4, title: 'O Ponto de Ruptura',    category: 'Fundamentos', isUnlocked: false, isPremium: false, status: 'idle', progress: { ouvir: false, estudar: false, avaliar: false } },
  { id: 5, title: 'Curando a Criança',     category: 'Emoções',     isUnlocked: false, isPremium: true,  status: 'idle', progress: { ouvir: false, estudar: false, avaliar: false } },
  { id: 6, title: 'Ferramentas de Reconstrução', category: 'Emoções', isUnlocked: false, isPremium: true, status: 'idle', progress: { ouvir: false, estudar: false, avaliar: false } },
  { id: 7, title: 'Gestão de Recaída',    category: 'Recaída',     isUnlocked: false, isPremium: true,  status: 'idle', progress: { ouvir: false, estudar: false, avaliar: false } },
];

export const useProgressStore = create<ProgressState>()(
  persist(
    (set) => ({
      trails: defaultTrails,

      completeStep: (trailId, step) =>
        set((state) => {
          const updated = state.trails.map((trail) => {
            if (trail.id !== trailId) return trail;
            const newProgress = { ...trail.progress, [step]: true };
            const isCompleted = newProgress.ouvir && newProgress.estudar && newProgress.avaliar;
            return {
              ...trail,
              progress: newProgress,
              status: (isCompleted ? 'completed' : 'in_progress') as TrailProgress['status'],
            };
          });

          // Desbloqueio automático da próxima trilha
          const idx = updated.findIndex((t) => t.id === trailId);
          if (idx !== -1 && updated[idx].status === 'completed' && idx + 1 < updated.length) {
            updated[idx + 1] = { ...updated[idx + 1], isUnlocked: true };
          }

          return { trails: updated };
        }),

      setTrails: (trails) => set({ trails }),

      unlockTrail: (trailId) =>
        set((state) => ({
          trails: state.trails.map((t) =>
            t.id === trailId ? { ...t, isUnlocked: true } : t
          ),
        })),

      resetProgress: () => set({ trails: defaultTrails }),

      unlockAllTrails: () =>
        set((state) => ({
          trails: state.trails.map((t) => ({
            ...t,
            isUnlocked: true,
            status: 'completed' as const,
            progress: { ouvir: true, estudar: true, avaliar: true },
          })),
        })),

      setCaminhosStats: (stats) =>
        set((state) => ({
          caminhosStats: {
            ...stats,
            completedCount: (state.caminhosStats?.completedCount || 0) + 1,
          },
        })),
    }),
    {
      name: 'renascer-progress-v1', // ← chave atualizada
    }
  )
);
