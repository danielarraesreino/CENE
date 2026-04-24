"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Repeat, ArrowRight, AlertTriangle, Ghost, CloudLightning, Beer, Plus, Zap, Rocket, ChevronRight, ChevronLeft } from "lucide-react";

const cycleSteps = [
  { 
    id: 1, 
    title: "Medo e Baixa Autoestima", 
    desc: "A sensação constante de inadequação e o medo de ser descoberto como 'uma fraude'.",
    icon: <Ghost className="text-blue-400" size={32} />,
    color: "rgba(96, 165, 250, 0.5)"
  },
  { 
    id: 2, 
    title: "Criação de Caos e Máscaras", 
    desc: "Para fugir do medo, criamos dramas ou usamos máscaras de superioridade para nos sentir vivos.",
    icon: <AlertTriangle className="text-yellow-400" size={32} />,
    color: "rgba(250, 204, 21, 0.5)"
  },
  { 
    id: 3, 
    title: "Frustração e Dor Aguda", 
    desc: "As máscaras caem, os planos falham e a dor emocional torna-se insuportável.",
    icon: <CloudLightning className="text-orange-400" size={32} />,
    color: "rgba(251, 146, 60, 0.5)"
  },
  { 
    id: 4, 
    title: "Fuga / Uso Compulsivo", 
    desc: "A busca pelo alívio imediato (químico ou comportamental) para anestesiar a dor.",
    icon: <Beer className="text-red-400" size={32} />,
    color: "rgba(248, 113, 113, 0.5)"
  }
];

export function Trail3Interactive({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState<'ciclo' | 'combinacao' | 'catalisador'>('ciclo');
  const [activeStep, setActiveStep] = useState(0);
  const [completedCycles, setCompletedCycles] = useState(0);
  
  // States for Combinacao Fatal
  const [ingredients, setIngredients] = useState({
    lifestyle: false,
    lowSelfEsteem: false,
    pain: false
  });

  const nextStep = () => {
    if (activeStep < cycleSteps.length - 1) {
      setActiveStep(prev => prev + 1);
    } else {
      setActiveStep(0);
      setCompletedCycles(prev => prev + 1);
    }
  };

  const getPos = (index: number) => {
    const angle = (index * 90) - 90;
    const rad = (angle * Math.PI) / 180;
    const radius = 140;
    return { x: Math.cos(rad) * radius, y: Math.sin(rad) * radius };
  };

  const allIngredientsSelected = ingredients.lifestyle && ingredients.lowSelfEsteem && ingredients.pain;

  return (
    <div className="w-full flex flex-col items-center py-6 min-h-[700px]">
      
      {/* Sub-nav for Phases */}
      <div className="flex gap-2 mb-12 bg-white/5 p-1 rounded-2xl border border-white/10">
        {[
          { id: 'ciclo' as const, label: 'O Círculo Vicioso' },
          { id: 'combinacao' as const, label: 'A Combinação Fatal' },
          { id: 'catalisador' as const, label: 'O Catalisador' }
        ].map((p) => (
          <button
            key={p.id}
            onClick={() => setPhase(p.id)}
            className={`px-4 py-2 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${
              phase === p.id ? 'bg-brand-cyan text-white shadow-lg shadow-brand-cyan/20' : 'text-gray-500 hover:text-gray-300'
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        
        {phase === 'ciclo' && (
          <motion.div 
            key="ciclo"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            className="flex flex-col items-center w-full"
          >
            <div className="text-center mb-10 max-w-xl">
              <h2 className="text-3xl font-heading font-black text-white mb-4 uppercase tracking-tighter">O Ciclo da Auto-Aniquilação</h2>
              <p className="text-gray-400">
                O Rei Bebê vive em um loop infinito. Clique nos pontos do ciclo para entender como a engrenagem da recaída funciona.
              </p>
            </div>

            <div className="relative w-full max-w-lg aspect-square flex items-center justify-center mb-12">
              <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none" viewBox="0 0 400 400">
                <circle cx="200" cy="200" r="140" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="2" />
                <motion.circle 
                  cx="200" cy="200" r="140" fill="none" stroke="rgba(6,182,212,0.3)" strokeWidth="4"
                  strokeDasharray="879.6"
                  animate={{ strokeDashoffset: 879.6 - ((activeStep + 1) * 220) }}
                  transition={{ type: "spring", stiffness: 50 }}
                />
              </svg>

              <motion.div 
                animate={{ scale: 1 + (completedCycles * 0.1), rotate: 360 * completedCycles }}
                className="w-32 h-32 rounded-full glass-panel flex flex-col items-center justify-center z-10 border-brand-cyan/20 shadow-[0_0_40px_rgba(6,182,212,0.1)]"
              >
                <Repeat className={`text-brand-cyan mb-1 ${activeStep === 3 ? 'animate-spin' : ''}`} size={32} />
                <span className="text-[10px] font-bold text-gray-500 uppercase tracking-widest">Giro {completedCycles + 1}</span>
              </motion.div>

              {cycleSteps.map((step, idx) => {
                const pos = getPos(idx);
                const isActive = activeStep === idx;
                return (
                  <motion.button
                    key={step.id}
                    onClick={() => setActiveStep(idx)}
                    animate={{ x: pos.x, y: pos.y, scale: isActive ? 1.2 : 1, backgroundColor: isActive ? step.color : "rgba(255,255,255,0.05)" }}
                    className={`absolute w-16 h-16 rounded-2xl border flex items-center justify-center transition-all duration-500 ${
                      isActive ? 'border-white/40 shadow-lg z-20' : 'border-white/10 opacity-60 z-10'
                    }`}
                  >
                    {step.icon}
                  </motion.button>
                );
              })}
            </div>

            <div className="glass-panel p-8 w-full max-w-2xl rounded-3xl border border-white/10 relative overflow-hidden">
              <div className="absolute top-0 left-0 w-1 h-full" style={{ backgroundColor: cycleSteps[activeStep].color }} />
              <div className="flex items-center gap-4 mb-4">
                <span className="text-4xl font-black text-white/10">{cycleSteps[activeStep].id}</span>
                <h3 className="text-2xl font-bold text-white">{cycleSteps[activeStep].title}</h3>
              </div>
              <p className="text-gray-300 leading-relaxed text-lg mb-8">{cycleSteps[activeStep].desc}</p>
              <div className="flex justify-between items-center">
                <button onClick={nextStep} className="group flex items-center gap-3 bg-white/10 hover:bg-white/20 text-white px-6 py-3 rounded-full transition-all">
                  <span>{activeStep === 3 ? "Reiniciar Ciclo" : "Próxima Etapa"}</span>
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>
                {completedCycles >= 1 && (
                  <button onClick={() => setPhase('combinacao')} className="flex items-center gap-2 text-brand-cyan font-bold">
                    Avançar para Próximo Conceito <ChevronRight size={20} />
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {phase === 'combinacao' && (
          <motion.div 
            key="combinacao"
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="flex flex-col items-center w-full max-w-4xl"
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl font-heading font-black text-white mb-4 uppercase tracking-tighter text-gradient">A Combinação Fatal</h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                Qualquer coisa pode acontecer quando o estilo de vida de Rei Bebê e a baixa autoestima se combinam com a experiência de dor.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 w-full">
              {[
                { id: 'lifestyle', label: 'Estilo Rei Bebê', desc: 'Excesso, imaturidade e onipotência.', icon: <Zap /> },
                { id: 'lowSelfEsteem', label: 'Baixa Autoestima', desc: 'Sentimentos de falta de valor.', icon: <Ghost /> },
                { id: 'pain', label: 'Experiência de Dor', desc: 'Sofrimento real ou imaginário.', icon: <CloudLightning /> }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setIngredients(prev => ({ ...prev, [item.id]: !prev[item.id as keyof typeof ingredients] }))}
                  className={`p-6 rounded-[2.5rem] border-2 transition-all text-left flex flex-col justify-between h-48 ${
                    ingredients[item.id as keyof typeof ingredients] 
                      ? 'bg-brand-accent/20 border-brand-accent shadow-[0_0_20px_rgba(139,92,246,0.3)]' 
                      : 'bg-white/5 border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className={`p-3 rounded-2xl w-max ${ingredients[item.id as keyof typeof ingredients] ? 'bg-brand-accent text-white' : 'bg-white/5 text-gray-500'}`}>
                    {item.icon}
                  </div>
                  <div>
                    <h4 className="font-bold text-white mb-1">{item.label}</h4>
                    <p className="text-xs text-gray-400">{item.desc}</p>
                  </div>
                </button>
              ))}
            </div>

            <div className="w-full flex items-center justify-center p-8 glass-panel rounded-[3rem] border border-white/10 overflow-hidden relative">
              <AnimatePresence mode="wait">
                {allIngredientsSelected ? (
                  <motion.div 
                    key="result"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-center z-10"
                  >
                    <div className="text-red-500 mb-4 flex justify-center"><AlertTriangle size={64} className="animate-pulse" /></div>
                    <h3 className="text-3xl font-black text-white mb-4 uppercase tracking-widest">EXPLOSÃO DA ADICÇÃO</h3>
                    <p className="text-gray-300 max-w-lg mb-8">
                      Esta é a combinação fatal. O uso da substância ou comportamento oferece o alívio que o ego do Rei Bebê busca, criando uma relação de amor com a própria dor.
                    </p>
                    <button onClick={() => setPhase('catalisador')} className="bg-red-500 hover:bg-red-600 text-white px-8 py-3 rounded-full font-bold transition-all flex items-center gap-2 mx-auto">
                      Entrar no Efeito Catalisador <ArrowRight size={20} />
                    </button>
                  </motion.div>
                ) : (
                  <motion.div key="empty" className="text-gray-500 text-center flex flex-col items-center">
                    <Plus size={48} className="mb-4 opacity-20" />
                    <p>Selecione todos os ingredientes para ver o resultado da combinação.</p>
                  </motion.div>
                )}
              </AnimatePresence>
              {allIngredientsSelected && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.1 }}
                  className="absolute inset-0 bg-red-600 blur-[100px]"
                />
              )}
            </div>
          </motion.div>
        )}

        {phase === 'catalisador' && (
          <motion.div 
            key="catalisador"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center w-full max-w-3xl"
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl font-heading font-black text-white mb-4 uppercase tracking-tighter">O Catalisador</h2>
              <p className="text-gray-400">
                O sistema de defesa nega o problema e acelera a queda. O inimigo está dentro de nós.
              </p>
            </div>

            <div className="relative w-full h-[400px] glass-panel rounded-[3rem] border border-white/10 flex flex-col items-center justify-end p-12 overflow-hidden">
              <motion.div 
                animate={{ 
                  y: [0, -250, 400],
                  opacity: [1, 1, 0],
                  scale: [1, 1.2, 0.5]
                }}
                transition={{ duration: 6, times: [0, 0.4, 1], repeat: Infinity, repeatDelay: 1 }}
                className="flex flex-col items-center z-10"
              >
                <Rocket size={64} className="text-brand-cyan mb-2" />
                <div className="w-1 h-32 bg-gradient-to-t from-brand-cyan to-transparent opacity-50" />
              </motion.div>

              <div className="absolute inset-x-0 bottom-0 p-8 text-center bg-gradient-to-t from-black/80 to-transparent pt-20">
                <h4 className="text-xl font-bold text-white mb-2">A Ascensão Falsa e a Queda Real</h4>
                <p className="text-sm text-gray-400">
                  O uso liberta frustrações como um foguete para a lua (euforia falsa), mas o peso da realidade nos puxa para o fundo do poço em metade do tempo.
                </p>
              </div>

              <div className="absolute top-10 right-10 text-right opacity-30">
                <span className="block text-4xl font-black text-white">EUFORIA</span>
                <span className="block text-xs uppercase tracking-[0.5em] text-brand-cyan">Falsa Sensação de Útero</span>
              </div>
              
              <div className="absolute bottom-10 left-10 text-left opacity-30">
                <span className="block text-4xl font-black text-red-500">ABISMO</span>
                <span className="block text-xs uppercase tracking-[0.5em] text-red-400">Fundo do Poço Acelerado</span>
              </div>
            </div>

            <div className="mt-12 flex flex-col gap-6 w-full">
              <div className="bg-white/5 border border-white/10 p-6 rounded-3xl">
                <h5 className="text-white font-bold mb-2 flex items-center gap-2"><Zap size={18} className="text-brand-cyan" /> O Que Acontece?</h5>
                <p className="text-sm text-gray-400">
                  Cego pela sensação maravilhosa da euforia, o Rei Bebê põe de lado sua consciência e valores. O sistema de engano e negação torna impossível enxergar o estado em que chegamos.
                </p>
              </div>

              <div className="flex gap-4">
                <button onClick={() => setPhase('combinacao')} className="flex-1 bg-white/5 hover:bg-white/10 text-white py-4 rounded-full font-bold transition-all flex items-center justify-center gap-2">
                  <ChevronLeft /> Voltar
                </button>
                <button 
                  onClick={onComplete}
                  className="flex-[2] bg-brand-cyan hover:bg-brand-cyan/80 text-white py-4 rounded-full font-bold transition-all shadow-[0_0_30px_rgba(6,182,212,0.5)] border border-white/20"
                >
                  Concluir Estudo da Trilha 3
                </button>
              </div>
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
