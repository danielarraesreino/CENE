"use client";

import { useSession } from "next-auth/react";
import { useRagStore } from "@/store/useRagStore";
import { useErrorStore } from "@/store/useErrorStore";
import { toast } from "sonner";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ApiError } from "@/lib/api/ApiError";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

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

      // AbortController com timeout de 15s para evitar bloqueio indefinido
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 15_000);

      let res: Response;
      try {
        res = await fetch(`${API_URL}/api/rag/chat/`, {
          method: "POST",
          signal: controller.signal,
          headers: {
            "Content-Type": "application/json",
            ...(session?.accessToken ? { Authorization: `Bearer ${session.accessToken}` } : {}),
          },
          body: JSON.stringify({
            messages: useRagStore.getState().messages,
            message: text,
          }),
        });
      } catch (fetchErr: unknown) {
        const isAbort =
          fetchErr instanceof Error && fetchErr.name === "AbortError";
        throw new ApiError(
          isAbort ? "TIMEOUT_ERROR" : "NETWORK_ERROR",
          isAbort
            ? "O assistente demorou muito para responder. Em caso de urgência ou crise, utilize o Modo SOS ou seu Plano de Segurança."
            : "Conexão instável. Verifique sua rede ou tente novamente em instantes.",
          0,
          true
        );
      } finally {
        clearTimeout(timeoutId);
      }

      if (!res.ok) {
        if (res.status === 401 || res.status === 403) {
           throw new ApiError("AUTH_ERROR", "Sua sessão expirou. Faça login novamente.", res.status);
        } else if (res.status >= 500) {
           throw new ApiError("AI_SERVICE_UNAVAILABLE", "O serviço de IA está sobrecarregado. Se precisar de apoio imediato, ligue 188 (CVV).", res.status, true);
        } else {
           throw new ApiError("NETWORK_ERROR", "Erro de conexão. Verifique sua internet.", res.status, true);
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
        : new ApiError('UNKNOWN_ERROR', 'Ocorreu um erro inesperado no processamento.', 500, true);
      
      console.warn('[REIBB_API_ERROR]', { 
        code: apiError.code, 
        message: apiError.userMessage,
        details: apiError.details 
      });
      
      const isTimeout = apiError.code === "TIMEOUT_ERROR";
      
      addMessage({
        role: "assistant",
        content: isTimeout 
          ? "Sinto muito, mas não consegui processar sua resposta a tempo. **Se você estiver em crise agora, por favor:**\n\n1. Ligue para o **CVV (188)** ou **SAMU (192)**.\n2. Acesse seu **Plano de Segurança**.\n3. Procure um familiar ou pessoa de confiança."
          : "Houve uma falha técnica na comunicação. Em caso de necessidade urgente, utilize os contatos de emergência (188 / 192).",
      });
      
      useErrorStore.getState().setError(apiError.userMessage);

      toast.error(apiError.userMessage, {
        action: apiError.isRetryable 
          ? { label: 'Tentar novamente', onClick: () => chatMutation.mutate(variables) } 
          : undefined,
        duration: 8000,
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
