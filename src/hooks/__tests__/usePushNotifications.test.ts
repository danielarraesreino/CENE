/**
 * Testes do hook usePushNotifications.
 * Agente E — Guarda de Testes.
 * Cobre: estado inicial, permissão de notificação, subscrição VAPID.
 */
import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';

// ── Mocks ─────────────────────────────────────────────────────────────────────

vi.mock('next-auth/react', () => ({
  useSession: vi.fn(() => ({
    data: { accessToken: 'mock-token' },
    status: 'authenticated',
  })),
}));

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
  },
}));

const mockGetSubscription = vi.fn().mockResolvedValue(null);
const mockSubscribe = vi.fn();
const mockUnsubscribe = vi.fn().mockResolvedValue(true);
const mockRequestPermission = vi.fn().mockResolvedValue('granted');

const setupNavigatorMocks = () => {
  Object.defineProperty(global, 'Notification', {
    writable: true,
    value: {
      permission: 'default',
      requestPermission: mockRequestPermission,
    },
  });

  Object.defineProperty(global.navigator, 'serviceWorker', {
    writable: true,
    value: {
      ready: Promise.resolve({
        pushManager: {
          getSubscription: mockGetSubscription,
          subscribe: mockSubscribe,
        },
      }),
    },
  });
};

// ── Testes ────────────────────────────────────────────────────────────────────

describe('usePushNotifications', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    setupNavigatorMocks();
  });

  it('retorna isSubscribed=false e permission=default no estado inicial', async () => {
    const { usePushNotifications } = await import('@/hooks/usePushNotifications');
    const { result } = renderHook(() => usePushNotifications());

    expect(result.current.isSubscribed).toBe(false);
    expect(result.current.permission).toBe('default');
    expect(result.current.subscribe).toBeTypeOf('function');
    expect(result.current.unsubscribe).toBeTypeOf('function');
  });

  it('detecta subscrição existente ao montar', async () => {
    const mockSub = { endpoint: 'https://fcm.googleapis.com/test' };
    mockGetSubscription.mockResolvedValueOnce(mockSub);

    const { usePushNotifications } = await import('@/hooks/usePushNotifications');
    const { result } = renderHook(() => usePushNotifications());

    await act(async () => {
      await new Promise(r => setTimeout(r, 50));
    });

    expect(result.current.isSubscribed).toBe(true);
  });

  it('subscribe solicita permissão antes de criar subscrição', async () => {
    mockRequestPermission.mockResolvedValue('granted');
    mockSubscribe.mockResolvedValue({
      endpoint: 'https://fcm.test/push',
      toJSON: () => ({ endpoint: 'https://fcm.test/push' }),
    });

    global.fetch = vi.fn().mockResolvedValue({ ok: true } as Response);

    const { usePushNotifications } = await import('@/hooks/usePushNotifications');
    const { result } = renderHook(() => usePushNotifications());

    await act(async () => {
      await result.current.subscribe();
    });

    expect(mockRequestPermission).toHaveBeenCalled();
  });

  it('subscribe exibe toast de erro quando permissão negada', async () => {
    mockRequestPermission.mockResolvedValue('denied');

    const { usePushNotifications } = await import('@/hooks/usePushNotifications');
    const { result } = renderHook(() => usePushNotifications());
    const { toast } = await import('sonner');

    await act(async () => {
      await result.current.subscribe();
    });

    expect(toast.error).toHaveBeenCalledWith(
      expect.stringMatching(/permiss|negad/i)
    );
    expect(result.current.isSubscribed).toBe(false);
  });

  it('unsubscribe cancela a subscrição e atualiza estado', async () => {
    const mockSub = {
      endpoint: 'https://fcm.test/push',
      unsubscribe: mockUnsubscribe,
    };
    mockGetSubscription.mockResolvedValue(mockSub);
    global.fetch = vi.fn().mockResolvedValue({ ok: true } as Response);

    const { usePushNotifications } = await import('@/hooks/usePushNotifications');
    const { result } = renderHook(() => usePushNotifications());

    await act(async () => {
      await result.current.unsubscribe();
    });

    expect(mockUnsubscribe).toHaveBeenCalled();
    expect(result.current.isSubscribed).toBe(false);
  });
});
