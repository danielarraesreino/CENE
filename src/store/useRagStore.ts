import { create } from 'zustand';

interface RagMessage {
  role: 'user' | 'assistant';
  content: string;
}

interface RagState {
  messages: RagMessage[];
  addMessage: (msg: RagMessage) => void;
  updateLastMessage: (content: string) => void;
  clearHistory: () => void;
}

const WELCOME: RagMessage = {
  role: 'assistant',
  content:
    'Olá! Sou o Assistente Renascer. Posso ajudar com dúvidas sobre prevenção à recaída, TCC, emoções e o Projeto de Vida. Como posso ajudar?',
};

export const useRagStore = create<RagState>()((set) => ({
  messages: [WELCOME],

  addMessage: (msg) =>
    set((state) => ({ messages: [...state.messages, msg] })),

  updateLastMessage: (content) =>
    set((state) => {
      const msgs = [...state.messages];
      msgs[msgs.length - 1] = { ...msgs[msgs.length - 1], content };
      return { messages: msgs };
    }),

  clearHistory: () => set({ messages: [WELCOME] }),
}));
