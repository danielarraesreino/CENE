'use client';

import { useState, useEffect } from 'react';
import { usePWAInstall } from '@/hooks/usePWAInstall';
import { Download, X, Sparkles } from 'lucide-react';
import { isFeatureEnabled } from '@/lib/featureFlags';

export function InstallPrompt() {
  const { isInstallable, isInstalled, promptInstall, dismissInstall, isIOS } = usePWAInstall();
  const [visible, setVisible] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  // Feature flag para controlar rollout do prompt
  const enabled = isFeatureEnabled('LMS_EAD_ACCESS'); // Usando uma flag existente ou criando nova

  // Mostrar prompt após 10s de uso, se não instalado e não dispensado
  useEffect(() => {
    if (isInstalled || dismissed || (!isInstallable && !isIOS)) return;
    
    const timer = setTimeout(() => setVisible(true), 10000);
    return () => clearTimeout(timer);
  }, [isInstalled, dismissed, isInstallable, isIOS]);

  // Persistir dismiss no localStorage por 7 dias
  useEffect(() => {
    const lastDismiss = localStorage.getItem('reibb:pwa-dismissed');
    if (lastDismiss) {
      const days = (Date.now() - parseInt(lastDismiss)) / (1000 * 60 * 60 * 24);
      if (days < 7) setDismissed(true);
    }
  }, []);

  const handleDismiss = () => {
    setVisible(false);
    dismissInstall();
    setDismissed(true);
    localStorage.setItem('reibb:pwa-dismissed', Date.now().toString());
  };

  const handleInstall = async () => {
    const success = await promptInstall();
    if (success) setVisible(false);
  };

  // iOS precisa de instruções customizadas (não suporta beforeinstallprompt)
  if (isIOS && visible && !isInstalled) {
    return (
      <div className="fixed bottom-4 left-4 right-4 z-50 bg-white border border-emerald-200 rounded-[2rem] shadow-2xl p-6 flex items-start gap-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
        <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 shrink-0">
          <Sparkles size={24} />
        </div>
        <div className="flex-1 min-w-0">
          <p className="font-black text-slate-900 text-sm uppercase tracking-widest">Instale o Reibb</p>
          <p className="text-xs text-slate-500 font-medium mt-1 leading-relaxed">
            Toque em <span className="font-bold text-slate-900">Compartilhar</span> → <span className="font-bold text-slate-900">"Adicionar à Tela de Início"</span>
          </p>
        </div>
        <button onClick={handleDismiss} className="p-2 hover:bg-slate-50 rounded-xl transition-colors" aria-label="Fechar">
          <X size={18} className="text-slate-400" />
        </button>
      </div>
    );
  }

  if (!visible || isInstalled || (!isInstallable && !isIOS)) return null;

  return (
    <div className="fixed bottom-6 left-6 right-6 lg:left-auto lg:right-6 lg:w-[400px] z-[100] bg-white border border-emerald-100 rounded-[2.5rem] shadow-[0_20px_50px_rgba(0,0,0,0.1)] p-8 flex items-center gap-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
      <div className="w-16 h-16 bg-emerald-600 rounded-[1.5rem] flex items-center justify-center text-white shadow-lg shadow-emerald-200 shrink-0">
        <Download size={28} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-black text-slate-900 text-sm uppercase tracking-widest mb-1">Instale o Reibb</p>
        <p className="text-xs text-slate-500 font-medium leading-relaxed">Acesso rápido e offline. Não consome dados extras.</p>
      </div>
      <div className="flex items-center gap-3">
        <button 
          onClick={handleInstall}
          className="px-6 py-3 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-xl hover:bg-emerald-600 transition-all shadow-lg active:scale-95"
        >
          Instalar
        </button>
        <button 
          onClick={handleDismiss}
          className="p-2 hover:bg-slate-50 rounded-xl transition-colors"
          aria-label="Fechar"
        >
          <X size={18} className="text-slate-400" />
        </button>
      </div>
    </div>
  );
}
