'use client';

import { useState, useCallback, useEffect } from 'react';
import { saveAs } from 'file-saver';
import localforage from 'localforage';
import { toast } from 'sonner';

const downloadsDB = localforage.createInstance({
  name: 'reibb-downloads',
  storeName: 'course-materials',
});

export interface DownloadableMaterial {
  id: string;
  lessonId: string;
  courseSlug: string;
  title: string;
  url: string;
  type: 'pdf' | 'video' | 'audio';
  sizeBytes?: number;
  downloadedAt?: string;
}

export function useOfflineDownload(courseSlug: string) {
  const [downloading, setDownloading] = useState<Record<string, boolean>>({});
  const [downloaded, setDownloaded] = useState<Record<string, boolean>>({});

  // Carrega downloads existentes ao montar
  const loadDownloaded = useCallback(async () => {
    const items: Record<string, boolean> = {};
    await downloadsDB.iterate((value: DownloadableMaterial) => {
      if (value.courseSlug === courseSlug) {
        items[value.id] = true;
      }
    });
    setDownloaded(items);
  }, [courseSlug]);

  useEffect(() => {
    loadDownloaded();
  }, [loadDownloaded]);

  // Download de arquivo com progresso e fallback
  const download = useCallback(async (material: DownloadableMaterial) => {
    if (downloaded[material.id]) {
      toast.info('Material já baixado ✅');
      return;
    }

    setDownloading(prev => ({ ...prev, [material.id]: true }));
    toast.loading(`Baixando ${material.title}...`);

    try {
      // Tenta fetch com timeout para conexões lentas
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 30000); // 30s timeout

      const response = await fetch(material.url, { signal: controller.signal });
      clearTimeout(timeout);

      if (!response.ok) throw new Error(`HTTP ${response.status}`);

      // Converte para Blob e salva
      const blob = await response.blob();
      
      // Salva no IndexedDB para acesso offline
      await downloadsDB.setItem(material.id, {
        ...material,
        blob,
        downloadedAt: new Date().toISOString(),
      });

      // Oferece download direto no dispositivo (opcional)
      if (material.type === 'pdf') {
        saveAs(blob, `${material.title}.pdf`);
      }

      setDownloaded(prev => ({ ...prev, [material.id]: true }));
      toast.success(`${material.title} salvo para uso offline! 📥`);
      
      return { success: true, blob };
      
    } catch (error: any) {
      console.error('[OFFLINE_DOWNLOAD_ERROR]', error);
      
      const message = error.name === 'AbortError' 
        ? 'Conexão muito lenta. Tente em uma rede melhor.' 
        : 'Não foi possível baixar. Verifique sua conexão.';
      
      toast.error(message, {
        action: { label: 'Tentar novamente', onClick: () => download(material) },
        duration: 6000,
      });
      
      throw error;
    } finally {
      setDownloading(prev => ({ ...prev, [material.id]: false }));
      toast.dismiss();
    }
  }, [downloaded]);

  // Acessa material offline (para exibir no player)
  const getOfflineMaterial = useCallback(async (materialId: string): Promise<Blob | null> => {
    const item = await downloadsDB.getItem<DownloadableMaterial & { blob?: Blob }>(materialId);
    return item?.blob || null;
  }, []);

  // Remove download para liberar espaço
  const removeDownload = useCallback(async (materialId: string) => {
    await downloadsDB.removeItem(materialId);
    setDownloaded(prev => {
      const next = { ...prev };
      delete next[materialId];
      return next;
    });
    toast.info('Material removido do armazenamento offline');
  }, []);

  // Limpa todos os downloads do curso (útil para logout)
  const clearCourseDownloads = useCallback(async () => {
    const keys: string[] = [];
    await downloadsDB.iterate((value: DownloadableMaterial, key: string) => {
      if (value.courseSlug === courseSlug) keys.push(key);
    });
    for (const key of keys) await downloadsDB.removeItem(key);
    setDownloaded({});
    toast.success('Downloads do curso limpos');
  }, [courseSlug]);

  return {
    download,
    getOfflineMaterial,
    removeDownload,
    clearCourseDownloads,
    loadDownloaded,
    downloading,
    downloaded,
  };
}
