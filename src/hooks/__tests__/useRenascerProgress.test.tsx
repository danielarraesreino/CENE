/**
 * Testes do hook useRenascerProgress.
 * Agente E — Guarda de Testes.
 */
import React from 'react';
import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

// ── Mocks ──────────────────────────────────────────────────────────────────

const mockCompleteStep = vi.fn();
const mockSyncTrails = vi.fn().mockResolvedValue(undefined);
const mockFetchProgress = vi.fn().mockResolvedValue(undefined);

const makeTrails = (overrides = {}) => [
  { id: 1, category: 'identidade', status: 'completed', isUnlocked: true, ...overrides },
  { id: 2, category: 'relacoes', status: 'in_progress', isUnlocked: true },
  { id: 3, category: 'proposito', status: 'locked', isUnlocked: false },
];

let mockTrails = makeTrails();

vi.mock('@/store/useProgressStore', () => ({
  // Simula getState() para o handleStepComplete
  useProgressStore: Object.assign(
    vi.fn((selector) =>
      selector({ trails: mockTrails, completeStep: mockCompleteStep })
    ),
    {
      getState: vi.fn(() => ({ trails: mockTrails })),
    }
  ),
}));

vi.mock('@/hooks/useBackendSync', () => ({
  useBackendSync: vi.fn(() => ({
    syncTrails: mockSyncTrails,
    fetchProgress: mockFetchProgress,
  })),
}));

vi.mock('sonner', () => ({
  toast: { error: vi.fn(), success: vi.fn() },
}));

// ── Testes ──────────────────────────────────────────────────────────────────

describe('useRenascerProgress', () => {
  beforeEach(() => {
    mockTrails = makeTrails();
    vi.clearAllMocks();
  });

  it('retorna completionPercent correto (1 de 3 concluída = 33%)', async () => {
    const { useRenascerProgress } = await import('@/hooks/useRenascerProgress');
    const { result } = renderHook(() => useRenascerProgress());
    expect(result.current.completionPercent).toBe(33);
  });

  it('retorna 0% quando nenhuma trilha está concluída', async () => {
    mockTrails = [
      { id: 1, category: 'a', status: 'in_progress', isUnlocked: true },
      { id: 2, category: 'b', status: 'locked', isUnlocked: false },
    ];
    const { useRenascerProgress } = await import('@/hooks/useRenascerProgress');
    const { result } = renderHook(() => useRenascerProgress());
    expect(result.current.completionPercent).toBe(0);
  });

  it('nextTrail retorna a primeira trilha desbloqueada e não concluída', async () => {
    const { useRenascerProgress } = await import('@/hooks/useRenascerProgress');
    const { result } = renderHook(() => useRenascerProgress());
    // Trail id=2 é in_progress e isUnlocked=true
    expect(result.current.nextTrail?.id).toBe(2);
  });

  it('nextTrail retorna undefined quando todas concluídas ou bloqueadas', async () => {
    mockTrails = [
      { id: 1, category: 'a', status: 'completed', isUnlocked: true },
      { id: 2, category: 'b', status: 'locked', isUnlocked: false },
    ];
    const { useRenascerProgress } = await import('@/hooks/useRenascerProgress');
    const { result } = renderHook(() => useRenascerProgress());
    expect(result.current.nextTrail).toBeUndefined();
  });

  it('handleStepComplete chama completeStep e syncTrails', async () => {
    const { useRenascerProgress } = await import('@/hooks/useRenascerProgress');
    const { result } = renderHook(() => useRenascerProgress());

    await act(async () => {
      await result.current.handleStepComplete(1, 'estudar');
    });

    expect(mockCompleteStep).toHaveBeenCalledWith(1, 'estudar');
    expect(mockSyncTrails).toHaveBeenCalled();
  });

  it('handleStepComplete exibe toast quando syncTrails falha', async () => {
    mockSyncTrails.mockRejectedValueOnce(new Error('Backend offline'));

    const { useRenascerProgress } = await import('@/hooks/useRenascerProgress');
    const { result } = renderHook(() => useRenascerProgress());
    const { toast } = await import('sonner');

    await act(async () => {
      await result.current.handleStepComplete(1, 'ouvir');
    });

    expect(toast.error).toHaveBeenCalledWith(
      expect.stringMatching(/local|conex/i),
      expect.anything()
    );
  });

  it('fetchProgress exibe toast de erro quando backend falha', async () => {
    mockFetchProgress.mockRejectedValueOnce(new Error('Network error'));

    const { useRenascerProgress } = await import('@/hooks/useRenascerProgress');
    const { result } = renderHook(() => useRenascerProgress());
    const { toast } = await import('sonner');

    await act(async () => {
      await result.current.fetchProgress();
    });

    expect(toast.error).toHaveBeenCalledWith(
      expect.stringMatching(/progresso|conex/i),
      expect.anything()
    );
  });

  it('trailsByCategory agrupa trilhas corretamente', async () => {
    const { useRenascerProgress } = await import('@/hooks/useRenascerProgress');
    const { result } = renderHook(() => useRenascerProgress());

    expect(result.current.trailsByCategory).toHaveProperty('identidade');
    expect(result.current.trailsByCategory).toHaveProperty('relacoes');
    expect(result.current.trailsByCategory['identidade']).toHaveLength(1);
  });
});
