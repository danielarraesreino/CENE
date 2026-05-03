/**
 * Testes do hook useNetworkState.
 * Agente E — Guarda de Testes.
 */
import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('useNetworkState', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // jsdom começa com navigator.onLine = true por padrão
    Object.defineProperty(navigator, 'onLine', {
      configurable: true,
      get: () => true,
    });
  });

  it('retorna isOnline=true no estado inicial (navigator.onLine=true)', async () => {
    const { useNetworkState } = await import('@/hooks/useNetworkState');
    const { result } = renderHook(() => useNetworkState());
    expect(result.current.isOnline).toBe(true);
  });

  it('atualiza isOnline=false ao disparar evento "offline"', async () => {
    const { useNetworkState } = await import('@/hooks/useNetworkState');
    const { result } = renderHook(() => useNetworkState());

    act(() => {
      window.dispatchEvent(new Event('offline'));
    });

    expect(result.current.isOnline).toBe(false);
  });

  it('atualiza isOnline=true ao disparar evento "online"', async () => {
    const { useNetworkState } = await import('@/hooks/useNetworkState');
    const { result } = renderHook(() => useNetworkState());

    act(() => {
      window.dispatchEvent(new Event('offline'));
    });
    expect(result.current.isOnline).toBe(false);

    act(() => {
      window.dispatchEvent(new Event('online'));
    });
    expect(result.current.isOnline).toBe(true);
  });

  it('remove os event listeners ao desmontar (sem memory leak)', async () => {
    const addSpy = vi.spyOn(window, 'addEventListener');
    const removeSpy = vi.spyOn(window, 'removeEventListener');

    const { useNetworkState } = await import('@/hooks/useNetworkState');
    const { unmount } = renderHook(() => useNetworkState());

    unmount();

    // Verifica que removeEventListener foi chamado para os dois eventos
    expect(removeSpy).toHaveBeenCalledWith('online', expect.any(Function));
    expect(removeSpy).toHaveBeenCalledWith('offline', expect.any(Function));
  });
});
