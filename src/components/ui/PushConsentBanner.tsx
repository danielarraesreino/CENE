'use client';
import { usePushNotifications } from '@/hooks/usePushNotifications';
import { Bell, X, Sparkles } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function PushConsentBanner() {
  const { isSubscribed, permission, subscribe } = usePushNotifications();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Só mostramos se não houver permissão definida e não estiver inscrito
    if (permission === 'default' && !isSubscribed) {
      const timer = setTimeout(() => setVisible(true), 15000); // 15s para não ser intrusivo
      return () => clearTimeout(timer);
    }
  }, [permission, isSubscribed]);

  const handleSubscribe = async () => {
    await subscribe();
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div 
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-6 left-6 right-6 z-[60] md:left-auto md:right-8 md:w-[400px]"
        >
          <div className="bg-white/80 backdrop-blur-2xl border border-white shadow-2xl rounded-[2.5rem] p-6 overflow-hidden relative group">
            {/* Background Glow */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-100/50 blur-3xl rounded-full group-hover:bg-emerald-200/50 transition-colors duration-700" />
            
            <div className="relative flex items-start gap-4">
              <div className="w-14 h-14 bg-emerald-600 text-white rounded-2xl flex items-center justify-center shrink-0 shadow-lg shadow-emerald-100">
                <Bell size={24} />
              </div>
              
              <div className="flex-1 space-y-1">
                <div className="flex items-center gap-2">
                  <h4 className="text-sm font-black text-slate-900 uppercase tracking-tight">Fique Conectado</h4>
                  <Sparkles size={14} className="text-amber-400" />
                </div>
                <p className="text-xs text-slate-500 font-medium leading-relaxed">
                  Receba avisos de novas aulas, lembretes de diário e atualizações importantes do Reibb.
                </p>
              </div>
              
              <button 
                onClick={() => setVisible(false)}
                className="text-slate-300 hover:text-slate-900 transition-colors"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="mt-6 flex gap-3">
              <button 
                onClick={handleSubscribe}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-xl shadow-emerald-100 transition-all active:scale-95"
              >
                Ativar Notificações
              </button>
              <button 
                onClick={() => setVisible(false)}
                className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-600 py-3.5 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all"
              >
                Agora não
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
