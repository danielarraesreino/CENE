'use client';

import { useState, useEffect, useCallback } from 'react';
import localforage from 'localforage';
import { useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { ApiError } from '@/lib/api/ApiError';
import { clinicalKeys } from '@/lib/api/keys';
import { useNetworkState } from './useNetworkState';

// Configuração do IndexedDB para progresso de aulas
const progressDB = localforage.createInstance({
  name: 'reibb-progress',
  storeName: 'lesson-completions',
  description: 'Armazena progresso de aulas para sync offline',
});

export interface LessonProgress {
  lessonId: string;
  courseSlug: string;
  completedAt: string;
  timeSpentSeconds: number;
  syncStatus: 'pending' | 'synced' | 'failed';
  lastAttempt?: string;
}

interface UseLessonProgressOptions {
  courseSlug: string;
  autoSync?: boolean; // Default: true
  onSyncSuccess?: (data: LessonProgress) => void;
  onSyncError?: (error: ApiError) => void;
}

export function useLessonProgress({ 
  courseSlug, 
  autoSync = true, 
  onSyncSuccess, 
  onSyncError 
}: UseLessonProgressOptions) {
  const queryClient = useQueryClient();
  const { isOnline } = useNetworkState();
  const [pendingItems, setPendingItems] = useState<LessonProgress[]>([]);

  // Carrega itens pendentes do IndexedDB ao montar
  useEffect(() => {
    const loadPending = async () => {
      const items: LessonProgress[] = [];
      await progressDB.iterate((value: LessonProgress) => {
        if (value.courseSlug === courseSlug && value.syncStatus === 'pending') {
          items.push(value);
        }
      });
      setPendingItems(items);
    };
    loadPending();
  }, [courseSlug]);

  // Marca aula como concluída (otimista + offline-first)
  const markComplete = useCallback(async (lessonId: string, timeSpentSeconds: number) => {
    const progress: LessonProgress = {
      lessonId,
      courseSlug,
      completedAt: new Date().toISOString(),
      timeSpentSeconds,
      syncStatus: 'pending', // Sempre começa como pending para garantir sync
      lastAttempt: new Date().toISOString(),
    };

    // 1. Salva no IndexedDB (garante persistência offline)
    await progressDB.setItem(`${courseSlug}:${lessonId}`, progress);
    
    // 2. Atualiza estado local para feedback imediato (optimistic UI)
    setPendingItems(prev => {
      const exists = prev.find(p => p.lessonId === lessonId);
      if (exists) return prev.map(p => p.lessonId === lessonId ? progress : p);
      return [...prev, progress];
    });

    // 3. Tenta sync imediato se online
    if (isOnline && autoSync) {
      await syncSingle(progress);
    } else {
      // Feedback visual para usuário offline
      toast.info('Progresso salvo localmente. Sincronizará ao reconectar.', { duration: 3000 });
    }

    // 4. Invalida cache do React Query para atualizar UI relacionada
    queryClient.invalidateQueries({ queryKey: clinicalKeys.progress(courseSlug) });
    
    return progress;
  }, [courseSlug, isOnline, autoSync, queryClient]);

  // Sync de um item individual
  const syncSingle = useCallback(async (progress: LessonProgress) => {
    try {
      const response = await fetch('/api/progress/lessons/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          lesson_id: progress.lessonId,
          course_slug: progress.courseSlug,
          completed_at: progress.completedAt,
          time_spent_seconds: progress.timeSpentSeconds,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new ApiError(
          errorData.error?.code || 'PROGRESS_SYNC_FAILED',
          errorData.error?.message || 'Falha ao sincronizar progresso',
          response.status,
          response.status >= 500
        );
      }

      // Remove do IndexedDB após sync bem-sucedido
      await progressDB.removeItem(`${progress.courseSlug}:${progress.lessonId}`);
      setPendingItems(prev => prev.filter(p => p.lessonId !== progress.lessonId));
      
      onSyncSuccess?.(progress);
      return { success: true, data: await response.json() };
      
    } catch (error) {
      const apiError = error instanceof ApiError ? error : new ApiError('NETWORK_ERROR', 'Erro de conexão', 0, true);
      
      // Atualiza status no IndexedDB para retry posterior
      const updated = { ...progress, syncStatus: 'failed' as const, lastAttempt: new Date().toISOString() };
      await progressDB.setItem(`${progress.courseSlug}:${progress.lessonId}`, updated);
      
      onSyncError?.(apiError);
      
      // Toast apenas se for erro não-retryable ou após múltiplas falhas
      if (!apiError.isRetryable) {
        toast.error('Não foi possível salvar seu progresso. Tente novamente.', {
          action: { label: 'Reenviar', onClick: () => syncSingle(progress) },
          duration: 6000,
        });
      }
      
      throw apiError;
    }
  }, [onSyncSuccess, onSyncError]);

  // Sync da fila completa (chamado manualmente ou pelo effect)
  const syncQueue = useCallback(async () => {
    if (!isOnline) {
      toast.warning('Sem conexão. Aguardando reconexão para sincronizar...');
      return;
    }

    const items = pendingItems.filter(p => p.syncStatus !== 'synced');
    if (items.length === 0) return;

    toast.loading(`Sincronizando ${items.length} aula(s)...`);
    
    let successCount = 0;
    for (const item of items) {
      try {
        await syncSingle(item);
        successCount++;
      } catch (e) {
        // Continua tentando os próximos mesmo se um falhar
        console.warn('[PROGRESS_SYNC] Falha em item:', item.lessonId, e);
      }
    }
    
    toast.dismiss();
    if (successCount > 0) {
      toast.success(`${successCount} aula(s) sincronizada(s) com sucesso!`);
      queryClient.invalidateQueries({ queryKey: clinicalKeys.progress(courseSlug) });
    }
  }, [isOnline, pendingItems, syncSingle, queryClient, courseSlug]);

  // Sync automático quando volta online (se autoSync=true)
  useEffect(() => {
    if (isOnline && autoSync && pendingItems.length > 0) {
      syncQueue();
    }
  }, [isOnline, autoSync, pendingItems, syncQueue]);

  // Verifica status de uma aula específica
  const getLessonStatus = useCallback(async (lessonId: string): Promise<'completed' | 'in-progress' | 'not-started'> => {
    // 1. Verifica no IndexedDB (offline-first)
    const local = await progressDB.getItem<LessonProgress>(`${courseSlug}:${lessonId}`);
    if (local && local.syncStatus !== 'failed') return 'completed';
    
    // 2. Fallback: verifica no servidor se online
    if (isOnline) {
      try {
        const res = await fetch(`/api/progress/lessons/${lessonId}/`);
        if (res.ok) return 'completed';
      } catch {
        // Silencioso: fallback para not-started
      }
    }
    
    return 'not-started';
  }, [courseSlug, isOnline]);

  // Limpa progresso pendente (útil para logout ou reset)
  const clearPending = useCallback(async () => {
    await progressDB.clear();
    setPendingItems([]);
    queryClient.invalidateQueries({ queryKey: clinicalKeys.progress(courseSlug) });
  }, [queryClient, courseSlug]);

  return {
    markComplete,
    syncQueue,
    getLessonStatus,
    clearPending,
    pendingCount: pendingItems.length,
    isSyncing: false, // Pode adicionar estado de loading se necessário
  };
}
