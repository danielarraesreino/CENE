"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ShieldAlert, HeartHandshake, Sparkles, Gavel, Users, Info, Anchor } from "lucide-react";

export function Trail4Interactive({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState<'exaustao' | 'derrota' | 'rendicao'>('exaustao');
  const [resistance, setResistance] = useState(100);

  const handleHit = () => {
    if (resistance > 0) {
      setResistance(prev => Math.max(0, prev - 25));
    }
  };

  return (
    <div className="w-full flex flex-col items-center py-10 min-h-[700px]">
      
      {/* Phase Indicator */}
      <div className="flex gap-4 mb-12">
        {[
          { id: 'exaustao', label: '1. Exaustão' },
          { id: 'derrota', label: '2. Derrota' },
          { id: 'rendicao', label: '3. Rendição' }
        ].map((p) => (
          <div 
            key={p.id}
            className={`h-2 w-16 rounded-full transition-all duration-500 ${
              phase === p.id ? 'bg-brand-cyan shadow-[0_0_10px_rgba(6,182,212,0.5)]' : 
              (phase === 'derrota' && p.id === 'exaustao') || (phase === 'rendicao') ? 'bg-brand-cyan/40' : 'bg-white/10'
            }`}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        
        {phase === 'exaustao' && (
          <motion.div 
            key="exaustao"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="flex flex-col items-center text-center max-w-2xl"
          >
            <div className="mb-10">
              <h2 className="text-3xl font-heading font-black text-white mb-4 uppercase tracking-tighter">Cansado de estar Farto</h2>
              <p className="text-gray-400">
                O estilo de vida do Rei Bebê exige tudo no mesmo instante. Você está exausto de tentar levar a melhor em tudo.
              </p>
            </div>

            <div className="relative w-64 h-64 glass-panel rounded-full flex items-center justify-center mb-12 group">
              <motion.div 
                animate={{ 
                  scale: [1, 1.1, 1],
                  opacity: [0.5, 0.8, 0.5]
                }}
                transition={{ duration: 4, repeat: Infinity }}
                className="absolute inset-0 bg-red-500/20 rounded-full blur-[40px]"
              />
              <Anchor size={80} className="text-gray-500 animate-pulse" />
              
              {/* Floating Pressure Points */}
              <div className="absolute -top-4 -left-4 p-3 glass-panel rounded-xl text-[10px] font-bold text-red-400 border-red-500/30">QUERER TUDO AGORA</div>
              <div className="absolute top-1/2 -right-10 p-3 glass-panel rounded-xl text-[10px] font-bold text-red-400 border-red-500/30">MEDO DO AMANHÃ</div>
              <div className="absolute -bottom-4 left-1/2 p-3 glass-panel rounded-xl text-[10px] font-bold text-red-400 border-red-500/30">PÂNICO NO ESTÔMAGO</div>
            </div>

            <div className="bg-red-500/10 border border-red-500/20 p-6 rounded-3xl mb-10 text-left">
              <p className="text-sm text-gray-300 leading-relaxed italic">
                &quot;O pânico provocado pela sensação de nó no estômago se torna um medo devastador. Você está paralisado pelo medo de enfrentar o dia seguinte.&quot;
              </p>
            </div>

            <button 
              onClick={() => setPhase('derrota')}
              className="bg-white/10 hover:bg-white/20 text-white px-10 py-4 rounded-full font-bold transition-all border border-white/10"
            >
              Admitir que não aguenta mais
            </button>
          </motion.div>
        )}

        {phase === 'derrota' && (
          <motion.div 
            key="ego-wall"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, scale: 1.5, filter: "blur(20px)" }}
            className="flex flex-col items-center text-center max-w-2xl"
          >
            <div className="mb-10">
              <h2 className="text-3xl font-heading font-black text-white mb-4 uppercase tracking-tighter">A Muralha do Ego</h2>
              <p className="text-gray-400">
                O ego imaturo insiste: &quot;Posso fazer sozinho&quot;. Mas do seu jeito nunca funcionou. Golpei a negação para encarar a realidade.
              </p>
            </div>

            <div className="relative w-80 h-80 flex items-center justify-center mb-12">
              <motion.div
                animate={{ 
                  scale: 0.9 + (resistance / 1000),
                  rotate: [0, -1, 1, 0],
                  filter: `brightness(${0.7 + (resistance / 300)})`
                }}
                transition={{ rotate: { repeat: Infinity, duration: 3 } }}
                className="w-full h-full glass-panel rounded-[3rem] border-4 border-white/20 flex flex-col items-center justify-center relative overflow-hidden group cursor-pointer"
                onClick={handleHit}
              >
                <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40" viewBox="0 0 100 100">
                  {resistance <= 75 && <path d="M50 0 L50 30 M20 10 L40 30" stroke="white" strokeWidth="0.5" />}
                  {resistance <= 50 && <path d="M0 50 L30 50 M80 50 L100 50" stroke="white" strokeWidth="0.5" />}
                  {resistance <= 25 && <path d="M10 90 L30 70 M70 10 L90 30" stroke="white" strokeWidth="0.5" />}
                </svg>

                <ShieldAlert size={80} className={`${resistance === 0 ? 'text-red-500 animate-ping' : 'text-gray-400 opacity-50'}`} />
                
                <div className="mt-6 text-center">
                  <span className="text-[10px] font-bold text-gray-500 uppercase tracking-[0.3em]">Orgulho do Rei Bebê</span>
                  <div className="w-40 h-1 bg-white/5 rounded-full mt-2 overflow-hidden border border-white/5">
                    <motion.div animate={{ width: `${resistance}%` }} className="h-full bg-red-500" />
                  </div>
                </div>
              </motion.div>

              {resistance > 0 && (
                <motion.div 
                  initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="absolute -top-4 -right-4 bg-brand-cyan text-white p-3 rounded-2xl shadow-xl text-xs font-black flex items-center gap-2"
                >
                  <Gavel size={16} /> GOLPEAR
                </motion.div>
              )}
            </div>

            <AnimatePresence mode="wait">
              {resistance === 0 ? (
                <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center">
                  <p className="text-green-400 font-bold mb-6">&quot;Do meu jeito não funcionou. Eu admito a derrota.&quot;</p>
                  <button onClick={() => setPhase('rendicao')} className="bg-white text-black px-12 py-4 rounded-full font-black text-lg transition-all shadow-[0_0_40px_rgba(255,255,255,0.3)]">
                    Rendição Total
                  </button>
                </motion.div>
              ) : (
                <p className="text-xs text-gray-500 uppercase tracking-widest animate-pulse">A negação te mantém ignorante...</p>
              )}
            </AnimatePresence>
          </motion.div>
        )}

        {phase === 'rendicao' && (
          <motion.div 
            key="rendicao"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center w-full max-w-3xl"
          >
            <div className="text-center mb-10">
              <h2 className="text-3xl font-heading font-black text-white mb-4 uppercase tracking-tighter text-gradient">Nós Somos Capazes</h2>
              <p className="text-gray-400">
                A forma de escapar da ratoeira é mudar o pensamento: &quot;Eu não sou capaz, NÓS somos capazes&quot;.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full mb-12">
              <div className="glass-panel p-8 rounded-[2.5rem] border-green-500/20 text-center flex flex-col items-center">
                <Users size={48} className="text-green-400 mb-6" />
                <h4 className="text-white font-bold mb-4 uppercase tracking-wider text-sm">O Poder do Grupo</h4>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Rendendo-se ao estilo de vida dos Doze Passos, o poder destrutivo do Rei Bebê pode ser dominado através da ajuda de outros que trilharam o mesmo caminho.
                </p>
              </div>

              <div className="glass-panel p-8 rounded-[2.5rem] border-brand-cyan/20 text-center flex flex-col items-center">
                <Sparkles size={48} className="text-brand-cyan mb-6" />
                <h4 className="text-white font-bold mb-4 uppercase tracking-wider text-sm">Poder Superior</h4>
                <p className="text-xs text-gray-400 leading-relaxed">
                  Podemos aprender o verdadeiro sentido do perdão, da humildade e da gratidão. A compreensão nova e profunda da vida começa aqui.
                </p>
              </div>
            </div>

            <div className="bg-white/5 border border-white/10 p-6 rounded-3xl mb-12 flex gap-4 items-center">
              <div className="p-3 bg-brand-cyan/20 rounded-2xl text-brand-cyan"><Info size={24} /></div>
              <p className="text-xs text-gray-400 italic">
                &quot;Antes de fazer o Primeiro Passo, o Rei Bebê precisa confiar que: Se outros são capazes, eu também sou.&quot;
              </p>
            </div>

            <button 
              onClick={onComplete}
              className="bg-green-500 hover:bg-green-600 text-white px-12 py-4 rounded-full font-black text-xl transition-all shadow-[0_0_40px_rgba(34,197,94,0.4)] flex items-center gap-3"
            >
              <HeartHandshake size={24} />
              ACEITAR AJUDA E CONCLUIR
            </button>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
