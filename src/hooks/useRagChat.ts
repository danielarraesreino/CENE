"use client";

import { useSession } from "next-auth/react";
import { useRagStore } from "@/store/useRagStore";
import { useErrorStore } from "@/store/useErrorStore";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

class ApiError extends Error {
  constructor(
    public code: string, 
    public userMessage: string, 
    public status: number, 
    public isRetryable: boolean = false,
    public details: any = null
  ) {
    super(userMessage);
  }
  toJSON() {
    return { code: this.code, message: this.userMessage, status: this.status, details: this.details, retryable: this.isRetryable };
  }
}

/**
 * useRagChat — adaptado do ClinicoCopilot.tsx (matheusweb).
 * Gerencia o chat RAG com streaming, apontando para o Django proxy.
 */
export function useRagChat() {
  const { data: session } = useSession();
  const queryClient = useQueryClient();
  const messages = useRagStore((s) => s.messages);
  const addMessage = useRagStore((s) => s.addMessage);
  const updateLastMessage = useRagStore((s) => s.updateLastMessage);
  const clearHistory = useRagStore((s) => s.clearHistory);

  const chatMutation = useMutation({
    mutationFn: async (text: string) => {
      addMessage({ role: "user", content: text });
      
      const res = await fetch(`${API_URL}/api/rag/chat/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(session?.accessToken ? { Authorization: `Bearer ${session.accessToken}` } : {}),
        },
        body: JSON.stringify({
          messages: useRagStore.getState().messages,
          message: text,
        }),
      });

      if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
           throw new ApiError("AUTH_ERROR", "Sua sessão expirou. Faça login novamente.", res.status);
        } else if (res.status >= 500) {
           throw new ApiError("AI_SERVICE_UNAVAILABLE", "Assistente temporariamente indisponível. Tente em instantes.", res.status, true);
        } else {
           throw new ApiError("NETWORK_ERROR", "Conexão instável. Verifique sua rede.", res.status, true);
        }
      }

      const reader = res.body?.getReader();
      const decoder = new TextDecoder();
      let assistantText = "";

      // Abre slot para a resposta em streaming
      addMessage({ role: "assistant", content: "" });

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          assistantText += decoder.decode(value, { stream: true });
          updateLastMessage(assistantText);
        }
      }
      return assistantText;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['chat-history'] });
    },
    onError: (error: unknown, variables) => {
      const apiError = error instanceof ApiError 
        ? error 
        : new ApiError('UNKNOWN_ERROR', 'Ocorreu um erro inesperado. Nossa equipe foi notificada.', 500, true);
      
      // Padronizado via ERROR_HANDLING_GUIDE.md
      console.warn('[REIBB_API_ERROR]', { 
        code: apiError.code, 
        message: apiError.userMessage,
        details: apiError.details 
      });
      
      addMessage({
        role: "assistant",
        content: "Desculpe, houve um erro ao processar sua mensagem. Em caso de crise, ligue para o CVV: **188** ou SAMU: **192**.",
      });
      
      useErrorStore.getState().setError(apiError.userMessage);

      toast.error(apiError.userMessage, {
        action: apiError.isRetryable 
          ? { label: 'Tentar novamente', onClick: () => chatMutation.mutate(variables) } 
          : undefined,
        duration: apiError.isRetryable ? 6000 : 4000,
      });
    }
  });

  async function sendMessage(text: string) {
    if (!text.trim() || chatMutation.isPending) return;
    chatMutation.mutate(text);
  }

  return { 
    messages, 
    sendMessage, 
    loading: chatMutation.isPending, 
    clearHistory 
  };
}
