/**
 * Testes do hook useSwipeNavigation.
 * Agente E — Guarda de Testes.
 * Nota: useSwipeNavigation usa @use-gesture/react (useDrag).
 * Testamos a interface pública (bind retorna handler) e os callbacks.
 */
import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

// ── Mock do @use-gesture/react ────────────────────────────────────────────────

let capturedHandler: Function | null = null;

vi.mock('@use-gesture/react', () => ({
  useDrag: vi.fn((handler: Function) => {
    capturedHandler = handler;
    // Retorna uma função bind que simula o spread de props gesturais
    return () => ({
      onPointerDown: vi.fn(),
      onPointerMove: vi.fn(),
      onPointerUp: vi.fn(),
    });
  }),
}));

// ── Testes ────────────────────────────────────────────────────────────────────

describe('useSwipeNavigation', () => {
  beforeEach(() => {
    capturedHandler = null;
    vi.clearAllMocks();
  });

  it('retorna uma função bind callable', async () => {
    const { useSwipeNavigation } = await import('@/hooks/useSwipeNavigation');
    const { result } = renderHook(() =>
      useSwipeNavigation({ onSwipeLeft: vi.fn(), onSwipeRight: vi.fn() })
    );
    expect(result.current).toBeTypeOf('function');
  });

  it('chama onSwipeLeft quando mx < -threshold ao soltar', async () => {
    const onSwipeLeft = vi.fn();
    const onSwipeRight = vi.fn();

    const { useSwipeNavigation } = await import('@/hooks/useSwipeNavigation');
    renderHook(() =>
      useSwipeNavigation({ onSwipeLeft, onSwipeRight, threshold: 50 })
    );

    // Simula o gesto: drag finalizado com mx = -80 (swipe left)
    act(() => {
      capturedHandler?.({
        down: false,
        movement: [-80, 0],
        initial: [200, 100],
      });
    });

    expect(onSwipeLeft).toHaveBeenCalledTimes(1);
    expect(onSwipeRight).not.toHaveBeenCalled();
  });

  it('chama onSwipeRight quando mx > threshold ao soltar', async () => {
    const onSwipeLeft = vi.fn();
    const onSwipeRight = vi.fn();

    const { useSwipeNavigation } = await import('@/hooks/useSwipeNavigation');
    renderHook(() =>
      useSwipeNavigation({ onSwipeLeft, onSwipeRight, threshold: 50 })
    );

    act(() => {
      capturedHandler?.({
        down: false,
        movement: [80, 0],
        initial: [100, 100],
      });
    });

    expect(onSwipeRight).toHaveBeenCalledTimes(1);
    expect(onSwipeLeft).not.toHaveBeenCalled();
  });

  it('NÃO aciona callback quando movimento é menor que threshold', async () => {
    const onSwipeLeft = vi.fn();
    const onSwipeRight = vi.fn();

    const { useSwipeNavigation } = await import('@/hooks/useSwipeNavigation');
    renderHook(() =>
      useSwipeNavigation({ onSwipeLeft, onSwipeRight, threshold: 50 })
    );

    // mx = 30 < threshold (50)
    act(() => {
      capturedHandler?.({
        down: false,
        movement: [30, 0],
        initial: [100, 100],
      });
    });

    expect(onSwipeLeft).not.toHaveBeenCalled();
    expect(onSwipeRight).not.toHaveBeenCalled();
  });

  it('NÃO aciona callback enquanto drag ainda está ativo (down=true)', async () => {
    const onSwipeLeft = vi.fn();

    const { useSwipeNavigation } = await import('@/hooks/useSwipeNavigation');
    renderHook(() => useSwipeNavigation({ onSwipeLeft, threshold: 50 }));

    act(() => {
      capturedHandler?.({
        down: true, // ainda arrastando
        movement: [-100, 0],
        initial: [200, 100],
      });
    });

    expect(onSwipeLeft).not.toHaveBeenCalled();
  });

  it('usa threshold padrão de 50px quando não especificado', async () => {
    const onSwipeLeft = vi.fn();

    const { useSwipeNavigation } = await import('@/hooks/useSwipeNavigation');
    renderHook(() => useSwipeNavigation({ onSwipeLeft }));

    // mx = -49 < 50 (threshold padrão) → não deve acionar
    act(() => {
      capturedHandler?.({ down: false, movement: [-49, 0], initial: [200, 100] });
    });
    expect(onSwipeLeft).not.toHaveBeenCalled();

    // mx = -51 > 50 → deve acionar
    act(() => {
      capturedHandler?.({ down: false, movement: [-51, 0], initial: [200, 100] });
    });
    expect(onSwipeLeft).toHaveBeenCalledTimes(1);
  });
});
