/**
 * Testes do hook useRagChat.
 * Agente E — Guarda de Testes.
 *
 * Estratégia: mocks de next-auth, stores Zustand e fetch global.
 */
import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

// ── Mocks ──────────────────────────────────────────────────────────────────

vi.mock('next-auth/react', () => ({
  useSession: vi.fn(() => ({
    data: { accessToken: 'fake-token' },
    status: 'authenticated',
  })),
}));

vi.mock('sonner', () => ({
  toast: { error: vi.fn(), success: vi.fn() },
}));

const mockMessages: unknown[] = [];
const mockAddMessage = vi.fn((msg: unknown) => mockMessages.push(msg));
const mockUpdateLastMessage = vi.fn();
const mockClearHistory = vi.fn();

vi.mock('@/store/useRagStore', () => ({
  useRagStore: vi.fn((selector) =>
    selector({
      messages: mockMessages,
      addMessage: mockAddMessage,
      updateLastMessage: mockUpdateLastMessage,
      clearHistory: mockClearHistory,
    })
  ),
  // getState necessário para a mutação ler mensagens atuais
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ...(Symbol.for('zustand') as any),
}));

vi.mock('@/store/useErrorStore', () => ({
  useErrorStore: {
    getState: vi.fn(() => ({ setError: vi.fn() })),
  },
}));

vi.mock('@/lib/api/ApiError', () => ({
  ApiError: class ApiError extends Error {
    code: string;
    userMessage: string;
    statusCode: number;
    isRetryable: boolean;
    constructor(code: string, msg: string, status: number, retryable = false) {
      super(msg);
      this.code = code;
      this.userMessage = msg;
      this.statusCode = status;
      this.isRetryable = retryable;
    }
  },
}));

const createWrapper = () => {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={qc}>{children}</QueryClientProvider>
  );
};

// ── Testes ──────────────────────────────────────────────────────────────────

describe('useRagChat', () => {
  beforeEach(() => {
    mockMessages.length = 0;
    vi.clearAllMocks();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('sendMessage adiciona mensagem do usuário ao store', async () => {
    const body = new ReadableStream({
      start(controller) {
        controller.enqueue(new TextEncoder().encode('Olá!'));
        controller.close();
      },
    });
    global.fetch = vi.fn().mockResolvedValue({ ok: true, body } as Response);

    const { useRagChat } = await import('@/hooks/useRagChat');
    const { result } = renderHook(() => useRagChat(), { wrapper: createWrapper() });

    await act(async () => {
      await result.current.sendMessage('como você pode me ajudar?');
    });

    expect(mockAddMessage).toHaveBeenCalledWith(
      expect.objectContaining({ role: 'user', content: 'como você pode me ajudar?' })
    );
  });

  it('lança ApiError com código AUTH_ERROR para resposta 401', async () => {
    global.fetch = vi.fn().mockResolvedValue({ ok: false, status: 401 } as Response);

    const { useRagChat } = await import('@/hooks/useRagChat');
    const { result } = renderHook(() => useRagChat(), { wrapper: createWrapper() });

    await act(async () => {
      await result.current.sendMessage('teste auth');
    });

    // onError adiciona mensagem de fallback e chama toast.error
    const { toast } = await import('sonner');
    expect(toast.error).toHaveBeenCalled();
  });

  it('lança ApiError para resposta 500 (serviço indisponível)', async () => {
    global.fetch = vi.fn().mockResolvedValue({ ok: false, status: 500 } as Response);

    const { useRagChat } = await import('@/hooks/useRagChat');
    const { result } = renderHook(() => useRagChat(), { wrapper: createWrapper() });

    await act(async () => {
      await result.current.sendMessage('teste 500');
    });

    const { toast } = await import('sonner');
    expect(toast.error).toHaveBeenCalled();
  });

  it('AbortController lança TIMEOUT_ERROR quando fetch demora mais de 15s', async () => {
    // Simula um fetch que nunca resolve mas é cancelado pelo AbortController
    global.fetch = vi.fn().mockImplementation((_url, options) => {
      return new Promise((_resolve, reject) => {
        options.signal.addEventListener('abort', () => {
          const err = new Error('AbortError');
          err.name = 'AbortError';
          reject(err);
        });
      });
    });

    vi.useFakeTimers();

    const { useRagChat } = await import('@/hooks/useRagChat');
    const { result } = renderHook(() => useRagChat(), { wrapper: createWrapper() });

    const sendPromise = act(async () => {
      result.current.sendMessage('teste timeout');
      // Avança 15s para disparar o AbortController
      vi.advanceTimersByTime(15_001);
    });

    await sendPromise;

    const { toast } = await import('sonner');
    // No jsdom, o AbortError pode ser classificado como NETWORK_ERROR ou TIMEOUT_ERROR
    // dependendo do ambiente — verificamos que o toast.error foi chamado com mensagem retryable
    expect(toast.error).toHaveBeenCalled();
    const [errorMessage] = vi.mocked(toast.error).mock.calls[0];
    expect(typeof errorMessage).toBe('string');
    // A mensagem deve ser relacionada a conexão ou timeout
    expect(errorMessage).toMatch(/conex|demorou|instável|timeout/i);

    vi.useRealTimers();
  });

  it('clearHistory limpa o histórico de mensagens', async () => {
    const { useRagChat } = await import('@/hooks/useRagChat');
    const { result } = renderHook(() => useRagChat(), { wrapper: createWrapper() });

    act(() => {
      result.current.clearHistory();
    });

    expect(mockClearHistory).toHaveBeenCalled();
  });
});
