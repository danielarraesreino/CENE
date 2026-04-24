"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { RadioReceiver, WifiOff, Wifi, AlertTriangle, CheckCircle2, ShieldCheck, Heart, Zap, History, Target } from "lucide-react";

const stinkingThinking = [
  { rbb: "Viva no passado e preocupe-se com o futuro", recovery: "Um dia de cada vez" },
  { rbb: "Tente fazer as coisas do seu jeito", recovery: "Renda-se e aceite ajuda" },
  { rbb: "Reaja exageradamente a tudo", recovery: "Viva só por hoje" },
  { rbb: "Complique as coisas", recovery: "Mantenha as coisas simples" },
  { rbb: "Faça o inventário dos outros", recovery: "Faça seu próprio inventário" }
];

const redFlags = [
  { id: "dishonesty", label: "Desonestidade", color: "red" },
  { id: "resentment", label: "Ressentimento", color: "orange" },
  { id: "impatience", label: "Impaciência", color: "yellow" },
  { id: "isolation", label: "Isolamento", color: "purple" }
];

export function Trail7Interactive({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState<'radio' | 'radar' | 'manutencao'>('radio');
  const [frequency, setFrequency] = useState(0);
  const [detectedFlags, setDetectedFlags] = useState<string[]>([]);

  const isRecovery = frequency > 80;

  return (
    <div className="w-full flex flex-col items-center py-10 min-h-[700px]">

      {/* Sub-nav indicator */}
      <div className="flex gap-2 mb-12 bg-white/5 p-1 rounded-2xl border border-white/10">
        {['radio', 'radar', 'manutencao'].map((p) => (
          <div
            key={p}
            className={`w-3 h-3 rounded-full ${phase === p ? 'bg-brand-cyan shadow-[0_0_10px_rgba(6,182,212,0.5)]' : 'bg-white/10'}`}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">

        {phase === 'radio' && (
          <motion.div
            key="radio"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, x: -50 }}
            className="flex flex-col items-center w-full max-w-2xl"
          >
            <div className="text-center mb-10">
              <h2 className="text-3xl font-heading font-black text-white mb-4 uppercase tracking-tighter">Sintonize a Recuperação</h2>
              <p className="text-gray-400">
                O &quot;Stinking Thinking&quot; (Pensamento Fedorento) é o sinal do Rei Bebê. Ajuste o Dial para captar a mensagem da sobriedade.
              </p>
            </div>

            <div className="glass-panel p-10 w-full text-center rounded-[3rem] border border-white/10 relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-brand-accent/5 to-transparent pointer-events-none" />

              <div className="h-40 flex flex-col items-center justify-center mb-8 relative">
                <AnimatePresence mode="wait">
                  {frequency < 30 ? (
                    <motion.div key="rbb" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center">
                      <WifiOff size={48} className="text-red-500/40 mb-4 animate-pulse" />
                      <p className="text-red-400 font-bold uppercase tracking-widest text-xs italic">
                        &quot;{stinkingThinking[0].rbb}&quot;
                      </p>
                    </motion.div>
                  ) : frequency > 80 ? (
                    <motion.div key="rec" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex flex-col items-center">
                      <Wifi size={48} className="text-brand-cyan mb-4" />
                      <p className="text-brand-cyan font-black uppercase tracking-[0.2em] text-lg">
                        {stinkingThinking[0].recovery}
                      </p>
                    </motion.div>
                  ) : (
                    <motion.div key="noise" className="text-gray-600 italic text-sm">
                      Estática sonora... (Continue ajustando)
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              <input
                type="range" min="0" max="100" value={frequency}
                onChange={(e) => setFrequency(parseInt(e.target.value))}
                className="w-full h-2 bg-white/5 rounded-full appearance-none cursor-pointer accent-brand-cyan mb-10"
              />

              <div className="flex justify-between text-[10px] font-black text-gray-500 tracking-widest">
                <span>STINKING THINKING</span>
                <span>AA / NA SLOGANS</span>
              </div>
            </div>

            {isRecovery && (
              <motion.button
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={() => setPhase('radar')}
                className="mt-12 bg-brand-cyan hover:bg-brand-cyan/80 text-white px-10 py-4 rounded-full font-black shadow-[0_0_30px_rgba(6,182,212,0.5)] transition-all"
              >
                Ativar Radar de Recaída
              </motion.button>
            )}
          </motion.div>
        )}

        {phase === 'radar' && (
          <motion.div
            key="radar"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="flex flex-col items-center w-full max-w-4xl"
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl font-heading font-black text-white mb-4 uppercase tracking-tighter">Radar de Recaída</h2>
              <p className="text-gray-400">
                A recaída começa muito antes do uso. Identifique os comportamentos &quot;Red Flags&quot; do Rei Bebê para neutralizá-los.
              </p>
            </div>

            <div className="relative w-full aspect-video glass-panel rounded-[3rem] border border-white/10 flex items-center justify-center overflow-hidden mb-12">
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.1)_0%,transparent_70%)]" />

              {/* Radar Sweeper */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                className="absolute w-[150%] h-px bg-gradient-to-r from-transparent via-brand-cyan/40 to-transparent z-0"
              />

              <div className="grid grid-cols-2 md:grid-cols-4 gap-6 z-10 px-8">
                {redFlags.map((flag) => {
                  const isDetected = detectedFlags.includes(flag.id);
                  return (
                    <button
                      key={flag.id}
                      onClick={() => setDetectedFlags(prev => isDetected ? prev.filter(i => i !== flag.id) : [...prev, flag.id])}
                      className={`p-6 rounded-[2rem] border-2 transition-all flex flex-col items-center gap-4 ${isDetected
                          ? 'border-red-500 bg-red-500/20 shadow-[0_0_20px_rgba(239,68,68,0.3)]'
                          : 'border-white/5 bg-white/5 hover:border-white/20'
                        }`}
                    >
                      <AlertTriangle className={isDetected ? 'text-red-500' : 'text-gray-600'} />
                      <span className={`text-[10px] font-black uppercase tracking-widest ${isDetected ? 'text-white' : 'text-gray-500'}`}>
                        {flag.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {detectedFlags.length === redFlags.length && (
              <motion.button
                initial={{ scale: 0.8 }} animate={{ scale: 1 }}
                onClick={() => setPhase('manutencao')}
                className="bg-white text-black px-12 py-4 rounded-full font-black shadow-xl"
              >
                Aprender Manutenção Diária
              </motion.button>
            )}
          </motion.div>
        )}

        {phase === 'manutencao' && (
          <motion.div
            key="manutencao"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center w-full max-w-3xl"
          >
            <div className="text-center mb-10">
              <h2 className="text-3xl font-heading font-black text-white mb-4 uppercase tracking-tighter text-gradient">Plano de Manutenção</h2>
              <p className="text-gray-400">
                Sua sobriedade é um jardim que precisa de cuidado diário. Aqui estão suas diretrizes finais.
              </p>
            </div>

            <div className="space-y-4 w-full mb-12">
              {[
                { icon: <History />, text: "Prioridade nº 1: Manter-se sóbrio acima de tudo." },
                { icon: <ShieldCheck />, text: "Honestidade rigorosa em todos os seus atos." },
                { icon: <Heart />, text: "Falar o que sente em vez de guardar ressentimentos." },
                { icon: <Target />, text: "Fazer o seu próprio inventário, não o dos outros." }
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  initial={{ x: -20, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: idx * 0.1 }}
                  className="glass-panel p-6 rounded-2xl border-white/5 flex items-center gap-6"
                >
                  <div className="text-brand-cyan">{item.icon}</div>
                  <p className="text-sm text-gray-200 font-medium">{item.text}</p>
                </motion.div>
              ))}
            </div>

            <button
              onClick={onComplete}
              className="bg-brand-cyan hover:bg-brand-cyan/80 text-white px-12 py-5 rounded-full font-black text-xl transition-all shadow-[0_0_40px_rgba(6,182,212,0.5)] border border-white/20 flex items-center gap-3"
            >
              <CheckCircle2 size={24} />
              CONCLUIR TODA A JORNADA
            </button>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
