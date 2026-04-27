import { create } from 'zustand';

interface ErrorState {
  errorMessage: string | null;
  isError: boolean;
  setError: (message: string) => void;
  clearError: () => void;
}

export const useErrorStore = create<ErrorState>((set) => ({
  errorMessage: null,
  isError: false,
  setError: (message) => set({ errorMessage: message, isError: true }),
  clearError: () => set({ errorMessage: null, isError: false }),
}));
