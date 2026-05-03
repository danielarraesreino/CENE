/**
 * Testes do hook usePWAInstall.
 * Agente E — Guarda de Testes.
 */
import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('usePWAInstall', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    // Reset matchMedia mock
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockReturnValue({
        matches: false,
        addListener: vi.fn(),
        removeListener: vi.fn(),
      }),
    });
    // Reset standalone para não-instalado
    Object.defineProperty(window.navigator, 'standalone', {
      writable: true,
      value: false,
    });
  });

  it('retorna isInstallable=false e isInstalled=false no estado inicial', async () => {
    const { usePWAInstall } = await import('@/hooks/usePWAInstall');
    const { result } = renderHook(() => usePWAInstall());

    expect(result.current.isInstallable).toBe(false);
    expect(result.current.isInstalled).toBe(false);
    expect(result.current.promptInstall).toBeTypeOf('function');
    expect(result.current.dismissInstall).toBeTypeOf('function');
  });

  it('isInstallable=true após evento beforeinstallprompt', async () => {
    const { usePWAInstall } = await import('@/hooks/usePWAInstall');
    const { result } = renderHook(() => usePWAInstall());

    const mockEvent = {
      preventDefault: vi.fn(),
      prompt: vi.fn().mockResolvedValue(undefined),
      userChoice: Promise.resolve({ outcome: 'accepted', platform: '' }),
      platforms: [],
    };

    act(() => {
      window.dispatchEvent(Object.assign(new Event('beforeinstallprompt'), mockEvent));
    });

    expect(result.current.isInstallable).toBe(true);
  });

  it('isInstalled=true quando display-mode é standalone', async () => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: vi.fn().mockReturnValue({ matches: true }),
    });

    const { usePWAInstall } = await import('@/hooks/usePWAInstall');
    const { result } = renderHook(() => usePWAInstall());

    expect(result.current.isInstalled).toBe(true);
  });

  it('promptInstall retorna false sem deferredPrompt', async () => {
    const { usePWAInstall } = await import('@/hooks/usePWAInstall');
    const { result } = renderHook(() => usePWAInstall());

    let outcome: boolean | undefined;
    await act(async () => {
      outcome = await result.current.promptInstall();
    });

    expect(outcome).toBe(false);
  });

  it('dismissInstall reseta isInstallable para false', async () => {
    const { usePWAInstall } = await import('@/hooks/usePWAInstall');
    const { result } = renderHook(() => usePWAInstall());

    const mockEvent = {
      preventDefault: vi.fn(),
      prompt: vi.fn(),
      userChoice: Promise.resolve({ outcome: 'dismissed', platform: '' }),
      platforms: [],
    };

    act(() => {
      window.dispatchEvent(Object.assign(new Event('beforeinstallprompt'), mockEvent));
    });

    act(() => {
      result.current.dismissInstall();
    });

    expect(result.current.isInstallable).toBe(false);
  });
});
