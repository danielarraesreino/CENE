/**
 * Testes do hook useInstructorStats (TDD).
 * Agente E (Testes).
 */
import { renderHook, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

vi.mock('next-auth/react', () => ({
  useSession: vi.fn(() => ({
    data: { accessToken: 'mock-token', user: { role: 'admin' } },
    status: 'authenticated',
  })),
}));

const createWrapper = () => {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
};

describe('useInstructorStats', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('retorna os dados corretamente via fetch', async () => {
    const mockData = {
      total_patients: 15,
      active_trails: 4,
      created_lessons: 100,
      today_logs: 35
    };

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue(mockData),
    } as unknown as Response);

    const { useInstructorStats } = await import('@/hooks/useInstructorStats');
    const { result } = renderHook(() => useInstructorStats(), {
      wrapper: createWrapper(),
    });

    // Inicia como loading
    expect(result.current.isLoading).toBe(true);

    // Aguarda o fetch terminar e popular os dados
    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(result.current.data).toEqual(mockData);
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining('/api/instructor/stats/'),
      expect.objectContaining({
        headers: expect.objectContaining({
          Authorization: 'Bearer mock-token'
        })
      })
    );
  });

  it('gerencia estado de erro quando a API falha', async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error('API failure'));

    const { useInstructorStats } = await import('@/hooks/useInstructorStats');
    const { result } = renderHook(() => useInstructorStats(), {
      wrapper: createWrapper(),
    });

    await waitFor(() => {
      expect(result.current.isError).toBe(true);
    });
  });
});
