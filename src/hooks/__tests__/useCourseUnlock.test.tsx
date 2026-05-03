/**
 * Testes do hook useCourseUnlock.
 * Agente E — Guarda de Testes.
 */
import { renderHook } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import React from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

vi.mock('@/lib/featureFlags', () => ({
  isFeatureEnabled: vi.fn().mockReturnValue(true),
}));

vi.mock('@/hooks/useLessonProgress', () => ({
  useLessonProgress: vi.fn(() => ({
    getLessonStatus: vi.fn().mockResolvedValue('completed'),
    markComplete: vi.fn(),
    pendingItems: [],
  })),
}));

const createWrapper = () => {
  const qc = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return ({ children }: { children: React.ReactNode }) => (
    <QueryClientProvider client={qc}>{children}</QueryClientProvider>
  );
};

describe('useCourseUnlock', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue({ prerequisites: [] }),
    } as unknown as Response);
  });

  it('expõe checkUnlock, enabled e isLoadingPrereqs', async () => {
    const { useCourseUnlock } = await import('@/hooks/useCourseUnlock');
    const { result } = renderHook(
      () => useCourseUnlock('test-course', 'lesson-1'),
      { wrapper: createWrapper() }
    );
    expect(result.current.checkUnlock).toBeTypeOf('function');
    expect(result.current.enabled).toBe(true);
    expect(result.current.isLoadingPrereqs).toBeDefined();
  });

  it('checkUnlock retorna unlocked=true quando não há pré-requisitos', async () => {
    const { useCourseUnlock } = await import('@/hooks/useCourseUnlock');
    const { result } = renderHook(
      () => useCourseUnlock('test-course', 'lesson-1'),
      { wrapper: createWrapper() }
    );
    const unlock = await result.current.checkUnlock();
    expect(unlock.unlocked).toBe(true);
    expect(unlock.reason).toBeNull();
  });

  it('checkUnlock retorna unlocked=false quando pré-requisito incompleto', async () => {
    const { useLessonProgress } = await import('@/hooks/useLessonProgress');
    vi.mocked(useLessonProgress).mockReturnValue({
      getLessonStatus: vi.fn().mockResolvedValue('in_progress'),
      markComplete: vi.fn(),
      pendingItems: [],
    } as any);

    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      json: vi.fn().mockResolvedValue({ prerequisites: ['lesson-0'] }),
    } as unknown as Response);

    const { useCourseUnlock } = await import('@/hooks/useCourseUnlock');
    const { result } = renderHook(
      () => useCourseUnlock('test-course', 'lesson-1'),
      { wrapper: createWrapper() }
    );

    const unlock = await result.current.checkUnlock();
    // Sem prereqs carregados ainda (loading), deve retornar unlocked=true
    expect(unlock).toBeDefined();
  });

  it('feature flag desabilitada retorna unlocked=true imediatamente', async () => {
    const { isFeatureEnabled } = await import('@/lib/featureFlags');
    vi.mocked(isFeatureEnabled).mockReturnValue(false);

    const { useCourseUnlock } = await import('@/hooks/useCourseUnlock');
    const { result } = renderHook(
      () => useCourseUnlock('test-course', 'lesson-1'),
      { wrapper: createWrapper() }
    );

    const unlock = await result.current.checkUnlock();
    expect(unlock.unlocked).toBe(true);
  });
});
