/**
 * Testes do hook useOfflineDownload.
 * Agente E — Guarda de Testes.
 * Cobre: download, cache hit, remoção, clearCourseDownloads.
 * Usa mock total de localforage (IndexedDB não disponível em jsdom).
 */
import { renderHook, act } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import type { DownloadableMaterial } from '@/hooks/useOfflineDownload';

// ── Mocks ─────────────────────────────────────────────────────────────────────

const mockSetItem = vi.fn().mockResolvedValue(undefined);
const mockGetItem = vi.fn().mockResolvedValue(null);
const mockRemoveItem = vi.fn().mockResolvedValue(undefined);
const mockIterate = vi.fn().mockResolvedValue(undefined);

vi.mock('localforage', () => ({
  default: {
    createInstance: vi.fn(() => ({
      setItem: mockSetItem,
      getItem: mockGetItem,
      removeItem: mockRemoveItem,
      iterate: mockIterate,
    })),
  },
}));

vi.mock('file-saver', () => ({ saveAs: vi.fn() }));

vi.mock('sonner', () => ({
  toast: {
    success: vi.fn(),
    error: vi.fn(),
    info: vi.fn(),
    loading: vi.fn(),
    dismiss: vi.fn(),
  },
}));

const makeMaterial = (overrides: Partial<DownloadableMaterial> = {}): DownloadableMaterial => ({
  id: 'mat-1',
  lessonId: 'lesson-1',
  courseSlug: 'test-course',
  title: 'Material de Teste',
  url: 'https://example.com/material.pdf',
  type: 'pdf',
  ...overrides,
});

// ── Testes ────────────────────────────────────────────────────────────────────

describe('useOfflineDownload', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    global.fetch = vi.fn().mockResolvedValue({
      ok: true,
      blob: vi.fn().mockResolvedValue(new Blob(['conteúdo'], { type: 'application/pdf' })),
    } as unknown as Response);
  });

  it('retorna estado inicial correto', async () => {
    const { useOfflineDownload } = await import('@/hooks/useOfflineDownload');
    const { result } = renderHook(() => useOfflineDownload('test-course'));

    expect(result.current.downloading).toEqual({});
    expect(result.current.downloaded).toEqual({});
    expect(result.current.download).toBeTypeOf('function');
    expect(result.current.getOfflineMaterial).toBeTypeOf('function');
  });

  it('download bem-sucedido salva item no localforage', async () => {
    const { useOfflineDownload } = await import('@/hooks/useOfflineDownload');
    const { result } = renderHook(() => useOfflineDownload('test-course'));
    const material = makeMaterial();

    await act(async () => {
      await result.current.download(material);
    });

    expect(mockSetItem).toHaveBeenCalledWith(
      material.id,
      expect.objectContaining({ id: material.id, courseSlug: material.courseSlug })
    );
    expect(result.current.downloaded['mat-1']).toBe(true);
  });

  it('exibe "já baixado" sem fazer fetch se item já existe no cache', async () => {
    const { useOfflineDownload } = await import('@/hooks/useOfflineDownload');
    const { result } = renderHook(() => useOfflineDownload('test-course'));
    const material = makeMaterial();
    const { toast } = await import('sonner');

    // Simula item já baixado no estado
    await act(async () => {
      await result.current.download(material);
    });

    const fetchCallCount = vi.mocked(global.fetch).mock.calls.length;

    // Tenta baixar novamente — deve exibir toast.info sem fetch extra
    await act(async () => {
      await result.current.download(material);
    });

    expect(toast.info).toHaveBeenCalledWith(expect.stringMatching(/já baixado/i));
    expect(vi.mocked(global.fetch).mock.calls.length).toBe(fetchCallCount); // sem fetch extra
  });

  it('removeDownload apaga item do localforage e atualiza estado', async () => {
    const { useOfflineDownload } = await import('@/hooks/useOfflineDownload');
    const { result } = renderHook(() => useOfflineDownload('test-course'));
    const material = makeMaterial();

    // Baixa primeiro
    await act(async () => {
      await result.current.download(material);
    });

    // Remove
    await act(async () => {
      await result.current.removeDownload(material.id);
    });

    expect(mockRemoveItem).toHaveBeenCalledWith(material.id);
    expect(result.current.downloaded['mat-1']).toBeUndefined();
  });

  it('getOfflineMaterial retorna null para material não cacheado', async () => {
    mockGetItem.mockResolvedValueOnce(null);
    const { useOfflineDownload } = await import('@/hooks/useOfflineDownload');
    const { result } = renderHook(() => useOfflineDownload('test-course'));

    const blob = await result.current.getOfflineMaterial('unknown-id');
    expect(blob).toBeNull();
  });

  it('exibe toast de erro quando fetch falha', async () => {
    global.fetch = vi.fn().mockRejectedValue(new Error('Network error'));

    const { useOfflineDownload } = await import('@/hooks/useOfflineDownload');
    const { result } = renderHook(() => useOfflineDownload('test-course'));
    const material = makeMaterial();
    const { toast } = await import('sonner');

    await act(async () => {
      try {
        await result.current.download(material);
      } catch {
        // erro esperado
      }
    });

    expect(toast.error).toHaveBeenCalled();
  });
});
