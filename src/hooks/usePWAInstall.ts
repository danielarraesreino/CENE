'use client';

import { useState, useEffect, useCallback } from 'react';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
  prompt(): Promise<void>;
}

export function usePWAInstall() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Detecta se já está instalado
    const isStandalone = typeof window !== 'undefined' && window.matchMedia('(display-mode: standalone)').matches;
    const isIOSStandalone = typeof window !== 'undefined' && (window.navigator as any).standalone === true;
    setIsInstalled(isStandalone || isIOSStandalone);

    // Captura evento de install prompt
    const handler = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsInstallable(true);
    };

    window.addEventListener('beforeinstallprompt', handler as EventListener);
    
    // Detecta instalação concluída
    window.addEventListener('appinstalled', () => {
      setIsInstalled(true);
      setIsInstallable(false);
      setDeferredPrompt(null);
    });

    return () => {
      window.removeEventListener('beforeinstallprompt', handler as EventListener);
    };
  }, []);

  const promptInstall = useCallback(async () => {
    if (!deferredPrompt) return false;
    
    try {
      await deferredPrompt.prompt();
      const choice = await deferredPrompt.userChoice;
      
      if (choice.outcome === 'accepted') {
        console.log('[PWA] Usuário aceitou instalar');
        return true;
      } else {
        console.log('[PWA] Usuário recusou instalar');
        return false;
      }
    } catch (error) {
      console.error('[PWA] Erro ao prompt install:', error);
      return false;
    }
  }, [deferredPrompt]);

  const dismissInstall = useCallback(() => {
    setDeferredPrompt(null);
    setIsInstallable(false);
  }, []);

  return {
    isInstallable,
    isInstalled,
    promptInstall,
    dismissInstall,
    // Para iOS: detectar se precisa mostrar banner customizado
    isIOS: typeof window !== 'undefined' && /iphone|ipad|ipod/.test(window.navigator.userAgent.toLowerCase()),
    isIOSStandalone: typeof window !== 'undefined' && (window.navigator as any).standalone === true,
  };
}
