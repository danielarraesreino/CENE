/**
 * Testes do hook useCheckIn.
 * Agente E — Guarda de Testes.
 *
 * Estratégia: mocks de next-auth/react, @tanstack/react-query e fetch global.
 */
import React from 'react';
import { renderHook, waitFor, act } from '@testing-library/react';
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

vi.mock('@/lib/api/keys', () => ({
  clinicalKeys: {
    list: (p: unknown) => ['checkin', 'list', p],
  },
}));

vi.mock('@/store/useCheckInStore', () => ({
  useCheckInStore: vi.fn((selector) =>
    selector({
      currentAreas: { fisica: 50, social: 50, espiritual: 50, intelectual: 50, familiar: 50, financeira: 50, profissional: 50 },
      setEntries: vi.fn(),
    })
  ),
}));

// ── Helpers ─────────────────────────────────────────────────────────────────

const createWrapper = () => {
  const qc = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={qc}>{children}</QueryClientProvider>
  );
};

const mockFetchSuccess = (data: unknown) => {
  global.fetch = vi.fn().mockResolvedValue({
    ok: true,
    json: async () => data,
  } as Response);
};

const mockFetchError = (status = 500) => {
  global.fetch = vi.fn().mockResolvedValue({
    ok: false,
    status,
    json: async () => ({ detail: 'erro' }),
  } as Response);
};

// ── Testes ──────────────────────────────────────────────────────────────────

describe('useCheckIn', () => {
  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('retorna estado inicial correto antes da query completar', async () => {
    mockFetchSuccess([]);
    const { useCheckIn } = await import('@/hooks/useCheckIn');
    const { result } = renderHook(() => useCheckIn(), {
      wrapper: createWrapper(),
    });

    // Estado inicial imediato
    expect(result.current.entries).toEqual([]);
    expect(typeof result.current.submitCheckIn).toBe('function');
    expect(typeof result.current.fetchCheckIns).toBe('function');
  });

  it('popula entries após fetch bem-sucedido', async () => {
    const fakeData = [
      { id: 1, date: '2026-04-29', craving_level: 3, mood: 'good', trigger: '', areas: {} },
    ];
    mockFetchSuccess(fakeData);

    const { useCheckIn } = await import('@/hooks/useCheckIn');
    const { result } = renderHook(() => useCheckIn(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => expect(result.current.isLoading).toBe(false));
    expect(result.current.entries).toHaveLength(1);
    expect(result.current.entries[0].cravingLevel).toBe(3);
    expect(result.current.entries[0].mood).toBe('good');
  });

  it('submitCheckIn dispara fetch POST com payload correto', async () => {
    mockFetchSuccess([]);
    const { useCheckIn } = await import('@/hooks/useCheckIn');
    const { result } = renderHook(() => useCheckIn(), {
      wrapper: createWrapper(),
    });

    // Aguarda a query inicial completar
    await waitFor(() => expect(result.current.isLoading).toBe(false));

    const mockPost = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ id: 99, date: '2026-04-29', craving_level: 7, mood: 'bad', trigger: 'stress', areas: {} }),
    } as Response);
    global.fetch = mockPost;

    act(() => {
      result.current.submitCheckIn({
        cravingLevel: 7,
        mood: 'bad',
        trigger: 'stress',
        areas: { fisica: 40, social: 30, espiritual: 20, intelectual: 50, familiar: 50, financeira: 50, profissional: 50 },
      });
    });

    // Verifica que o fetch foi chamado com POST e os dados corretos
    await waitFor(() => expect(mockPost).toHaveBeenCalled());
    const [, options] = mockPost.mock.calls[0];
    expect(options.method).toBe('POST');
    const body = JSON.parse(options.body as string);
    expect(body.craving_level).toBe(7);
    expect(body.mood).toBe('bad');
  });

  it('nao executa query sem sessão autenticada', async () => {
    const { useSession } = await import('next-auth/react');
    vi.mocked(useSession).mockReturnValue({
      data: null,
      status: 'unauthenticated',
      update: vi.fn(),
    });

    global.fetch = vi.fn();
    const { useCheckIn } = await import('@/hooks/useCheckIn');
    renderHook(() => useCheckIn(), { wrapper: createWrapper() });

    // fetch não deve ser chamado quando não há sessão
    await waitFor(() => {}, { timeout: 200 });
    expect(global.fetch).not.toHaveBeenCalled();
  });
});
