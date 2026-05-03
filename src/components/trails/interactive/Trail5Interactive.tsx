"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Sparkles, User, Sun, Moon, Info, CheckCircle2 } from "lucide-react";

const affirmations = [
  "Está tudo bem agora.",
  "Você é um belo ser humano.",
  "Você está em segurança.",
  "Eu vou gostar de você antes mesmo de você merecer.",
  "Você é a pessoa mais importante que existe."
];

export function Trail5Interactive({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState<'quarto' | 'acolhimento' | 'cura'>('quarto');
  const [foundChild, setFoundChild] = useState(false);
  const [healingProgress, setHealingProgress] = useState(0);
  const [activeAffirmation, setActiveAffirmation] = useState(0);
  const [isPressing, setIsPressing] = useState(false);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPressing && healingProgress < 100 && phase === 'acolhimento') {
      interval = setInterval(() => {
        setHealingProgress(prev => {
          const next = Math.min(100, prev + 1);
          if (next >= (activeAffirmation + 1) * 20 && activeAffirmation < affirmations.length - 1) {
            setActiveAffirmation(a => a + 1);
          }
          if (next === 100) {
            setPhase('cura');
          }
          return next;
        });
      }, 40);
    }
    return () => clearInterval(interval);
  }, [isPressing, healingProgress, phase, activeAffirmation]);

  return (
    <div className="w-full flex flex-col items-center py-10 min-h-[700px]">
      
      <AnimatePresence mode="wait">
        
        {phase === 'quarto' && (
          <motion.div 
            key="quarto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex flex-col items-center text-center w-full max-w-2xl"
          >
            <div className="mb-12">
              <h2 className="text-3xl font-heading font-black text-white mb-4 uppercase tracking-tighter">A Busca Interior</h2>
              <p className="text-gray-400">
                Entre no quarto escuro da sua mente e encontre aquela parte de você que foi ignorada por tanto tempo.
              </p>
            </div>

            <div 
              className="relative w-full h-[400px] bg-black/40 rounded-[3rem] border border-white/5 overflow-hidden cursor-crosshair flex items-center justify-center group"
              onMouseMove={() => setFoundChild(true)}
              onClick={() => foundChild && setPhase('acolhimento')}
            >
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_var(--x,50%)_var(--y,50%),rgba(255,255,255,0.15)_0%,transparent_20%)] transition-opacity" />
              
              <AnimatePresence>
                {foundChild ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex flex-col items-center text-gray-500"
                  >
                    <User size={80} className="mb-4 opacity-40" />
                    <p className="text-xs uppercase tracking-widest font-bold">Você a encontrou encolhida no canto.</p>
                    <button className="mt-6 bg-white/10 hover:bg-white/20 text-white px-6 py-2 rounded-full text-xs font-bold transition-all">
                      Aproximar-se com Amor
                    </button>
                  </motion.div>
                ) : (
                  <div className="text-gray-700 flex flex-col items-center">
                    <Moon size={48} className="mb-4 opacity-20" />
                    <p className="text-xs">Mova o mouse para iluminar a escuridão...</p>
                  </div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}

        {phase === 'acolhimento' && (
          <motion.div 
            key="acolhimento"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="flex flex-col items-center text-center w-full max-w-3xl"
          >
            <div className="mb-10">
              <h2 className="text-3xl font-heading font-black text-white mb-4 uppercase tracking-tighter">Tornando-se um Pai Amoroso</h2>
              <p className="text-gray-400">
                Limpe as lágrimas e diga as palavras que ela sempre precisou ouvir. Segure o coração para curar.
              </p>
            </div>

            <div className="relative w-80 h-80 flex items-center justify-center mb-12">
              <motion.div
                animate={{ 
                  scale: 1 + (healingProgress / 500),
                  boxShadow: `0 0 ${healingProgress * 0.5}px rgba(139, 92, 246, 0.2)`
                }}
                className="w-full h-full glass-panel rounded-full border-2 border-white/10 flex flex-col items-center justify-center relative z-10"
              >
                <motion.div
                  animate={{ 
                    scale: isPressing ? [1, 1.2, 1] : 1,
                    color: isPressing ? "#f87171" : "#4b5563"
                  }}
                  transition={{ repeat: Infinity, duration: 1 }}
                >
                  <Heart size={80} fill={isPressing ? "currentColor" : "none"} />
                </motion.div>
                
                <div className="absolute inset-0 rounded-full overflow-hidden">
                  <motion.div 
                    initial={{ height: 0 }}
                    animate={{ height: `${healingProgress}%` }}
                    className="absolute bottom-0 w-full bg-brand-accent/20"
                  />
                </div>
              </motion.div>
              
              {/* Floating Affirmation */}
              <AnimatePresence mode="wait">
                <motion.div 
                  key={activeAffirmation}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="absolute -top-12 bg-white/5 border border-white/10 p-4 rounded-2xl shadow-2xl min-w-[250px]"
                >
                  <p className="text-sm font-bold text-brand-cyan uppercase tracking-widest">{affirmations[activeAffirmation]}</p>
                </motion.div>
              </AnimatePresence>
            </div>

            <button
              onMouseDown={() => setIsPressing(true)}
              onMouseUp={() => setIsPressing(false)}
              onMouseLeave={() => setIsPressing(false)}
              onTouchStart={() => setIsPressing(true)}
              onTouchEnd={() => setIsPressing(false)}
              className={`px-12 py-5 rounded-full font-black text-xl transition-all select-none w-full max-w-sm ${
                isPressing 
                ? 'bg-brand-accent shadow-[0_0_40px_rgba(139,92,246,0.6)]' 
                : 'bg-white/5 border border-white/10 hover:bg-white/10'
              } text-white uppercase tracking-widest`}
            >
              {isPressing ? 'Curando...' : 'Segure para Curar'}
            </button>
          </motion.div>
        )}

        {phase === 'cura' && (
          <motion.div 
            key="cura"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center text-center w-full max-w-2xl"
          >
            <div className="w-32 h-32 bg-brand-cyan/20 rounded-full flex items-center justify-center mb-10 shadow-[0_0_50px_rgba(6,182,212,0.3)]">
              <Sun size={64} className="text-brand-cyan animate-spin-slow" />
            </div>

            <h2 className="text-4xl font-heading font-black text-white mb-6 uppercase tracking-tighter">O Despertar da Dignidade</h2>
            <p className="text-gray-300 mb-10 leading-relaxed text-lg">
              Através da descoberta, disciplina e perdão, você começa a adquirir o respeito por si mesmo. A criancinha medrosa agora tem um protetor: <strong>Você.</strong>
            </p>

            <div className="grid grid-cols-2 gap-4 w-full mb-12">
              {['Autoestima', 'Dignidade', 'Segurança', 'Amor Próprio'].map((word) => (
                <div key={word} className="bg-white/5 border border-white/10 p-4 rounded-2xl flex items-center gap-3">
                  <CheckCircle2 size={20} className="text-brand-cyan" />
                  <span className="text-sm font-bold text-white uppercase tracking-wider">{word}</span>
                </div>
              ))}
            </div>

            <button 
              onClick={onComplete}
              className="bg-brand-accent hover:bg-brand-accent/80 text-white px-12 py-4 rounded-full font-black text-lg transition-all shadow-[0_0_30px_rgba(139,92,246,0.5)] flex items-center gap-3"
            >
              <Sparkles size={24} />
              CONCLUIR JORNADA DE CURA
            </button>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
