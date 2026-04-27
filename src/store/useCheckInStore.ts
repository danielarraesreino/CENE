import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface AreaProgress {
  fisica: number;
  espiritual: number;
  intelectual: number;
  familiar: number;
  social: number;
  financeira: number;
  profissional: number;
}

export interface CheckInEntry {
  id: string;
  date: string;
  cravingLevel: number; // 0-10
  mood: string;
  trigger?: string;
  areas: AreaProgress;
}

interface CheckInState {
  entries: CheckInEntry[];
  currentAreas: AreaProgress;
  
  // Ações
  addEntry: (entry: Omit<CheckInEntry, 'id' | 'date'>) => void;
  updateAreas: (areas: Partial<AreaProgress>) => void;
  setEntries: (entries: CheckInEntry[]) => void;
}

const defaultAreas: AreaProgress = {
  fisica: 50,
  espiritual: 50,
  intelectual: 50,
  familiar: 50,
  social: 50,
  financeira: 50,
  profissional: 50,
};

export const useCheckInStore = create<CheckInState>()(
  persist(
    (set) => ({
      entries: [],
      currentAreas: defaultAreas,

      addEntry: (entry) =>
        set((state) => {
          const newEntry: CheckInEntry = {
            ...entry,
            id: Math.random().toString(36).substring(2, 9),
            date: new Date().toISOString(),
          };
          // Se as áreas não forem passadas, usa as atuais
          if (!entry.areas) newEntry.areas = state.currentAreas;
          
          return {
            entries: [newEntry, ...state.entries],
            currentAreas: newEntry.areas, // O último checkin vira o current
          };
        }),

      updateAreas: (areas) =>
        set((state) => ({
          currentAreas: { ...state.currentAreas, ...areas },
        })),

      setEntries: (entries) => set({ entries, currentAreas: entries[0]?.areas || defaultAreas }),
    }),
    {
      name: 'renascer-checkin-v1',
    }
  )
);
