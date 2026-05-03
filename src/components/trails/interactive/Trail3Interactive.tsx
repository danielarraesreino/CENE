"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Repeat, ArrowRight, AlertTriangle, Ghost, CloudLightning, Beer, Plus, Zap, Rocket, ChevronRight, ChevronLeft, CheckCircle2 } from "lucide-react";

const cycleSteps = [
  {
    id: 1,
    title: "Medo e Baixa Autoestima",
    desc: "A sensação constante de inadequação e o medo de ser descoberto como 'uma fraude'.",
    icon: <Ghost className="text-blue-500" size={32} />,
    color: "rgba(59, 130, 246, 0.2)",
    borderColor: "rgba(59, 130, 246, 0.5)"
  },
  {
    id: 2,
    title: "Criação de Caos e Máscaras",
    desc: "Para fugir do medo, criamos dramas ou usamos máscaras de superioridade para nos sentir vivos.",
    icon: <AlertTriangle className="text-amber-500" size={32} />,
    color: "rgba(245, 158, 11, 0.2)",
    borderColor: "rgba(245, 158, 11, 0.5)"
  },
  {
    id: 3,
    title: "Frustração e Dor Aguda",
    desc: "As máscaras caem, os planos falham e a dor emocional torna-se insuportável.",
    icon: <CloudLightning className="text-orange-500" size={32} />,
    color: "rgba(249, 115, 22, 0.2)",
    borderColor: "rgba(249, 115, 22, 0.5)"
  },
  {
    id: 4,
    title: "Fuga / Uso Compulsivo",
    desc: "A busca pelo alívio imediato (químico ou comportamental) para anestesiar a dor.",
    icon: <Beer className="text-red-500" size={32} />,
    color: "rgba(239, 68, 68, 0.2)",
    borderColor: "rgba(239, 68, 68, 0.5)"
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
    <div className="w-full flex flex-col items-center py-6 min-h-[700px] px-4">

      {/* Sub-nav for Phases */}
      <div className="flex flex-wrap justify-center gap-2 mb-12 bg-slate-100 p-1.5 rounded-2xl border border-slate-200">
        {[
          { id: 'ciclo' as const, label: 'O Círculo Vicioso' },
          { id: 'combinacao' as const, label: 'A Combinação Fatal' },
          { id: 'catalisador' as const, label: 'O Catalisador' }
        ].map((p) => (
          <button
            key={p.id}
            onClick={() => setPhase(p.id)}
            className={`px-5 py-2.5 rounded-xl text-xs font-bold uppercase tracking-wider transition-all ${phase === p.id
                ? 'bg-white text-emerald-700 shadow-sm border border-slate-200'
                : 'text-slate-500 hover:text-slate-700 hover:bg-slate-200/50 border border-transparent'
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
              <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4 uppercase tracking-tighter">O Ciclo da Auto-Aniquilação</h2>
              <p className="text-slate-600 text-lg">
                O Rei Bebê vive em um loop infinito. Clique nos pontos do ciclo para entender como a engrenagem da recaída funciona.
              </p>
            </div>

            <div className="relative w-full max-w-lg aspect-square flex items-center justify-center mb-12">
              <svg className="absolute inset-0 w-full h-full -rotate-90 pointer-events-none" viewBox="0 0 400 400">
                <circle cx="200" cy="200" r="140" fill="none" stroke="rgba(203, 213, 225, 0.5)" strokeWidth="2" />
                <motion.circle
                  cx="200" cy="200" r="140" fill="none" stroke="rgba(16, 185, 129, 0.8)" strokeWidth="6"
                  strokeDasharray="879.6"
                  animate={{ strokeDashoffset: 879.6 - ((activeStep + 1) * 220) }}
                  transition={{ type: "spring", stiffness: 50 }}
                  strokeLinecap="round"
                />
              </svg>

              <motion.div
                animate={{ scale: 1 + (completedCycles * 0.1), rotate: 360 * completedCycles }}
                className="w-32 h-32 rounded-full bg-white flex flex-col items-center justify-center z-10 border-2 border-emerald-100 shadow-[0_10px_30px_rgba(5,150,105,0.15)]"
              >
                <Repeat className={`text-emerald-500 mb-1 ${activeStep === 3 ? 'animate-spin' : ''}`} size={36} />
                <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest mt-1">Giro {completedCycles + 1}</span>
              </motion.div>

              {cycleSteps.map((step, idx) => {
                const pos = getPos(idx);
                const isActive = activeStep === idx;
                return (
                  <motion.button
                    key={step.id}
                    onClick={() => setActiveStep(idx)}
                    animate={{
                      x: pos.x,
                      y: pos.y,
                      scale: isActive ? 1.25 : 1,
                      backgroundColor: isActive ? step.color : "rgba(255,255,255,1)",
                      borderColor: isActive ? step.borderColor : "rgba(226, 232, 240, 1)"
                    }}
                    className={`absolute w-16 h-16 rounded-2xl border-2 flex items-center justify-center transition-all duration-500 shadow-sm ${isActive ? 'z-20 shadow-lg' : 'z-10 hover:border-slate-300'
                      }`}
                  >
                    {step.icon}
                  </motion.button>
                );
              })}
            </div>

            <div className="glass-panel p-8 md:p-10 w-full max-w-2xl rounded-[2.5rem] border border-slate-200 relative overflow-hidden bg-white/80">
              <div className="absolute top-0 left-0 w-1.5 h-full" style={{ backgroundColor: cycleSteps[activeStep].borderColor }} />
              <div className="flex items-center gap-4 mb-6">
                <span className="text-4xl font-black text-slate-200">{cycleSteps[activeStep].id}</span>
                <h3 className="text-2xl font-black text-slate-900">{cycleSteps[activeStep].title}</h3>
              </div>
              <p className="text-slate-600 font-medium leading-relaxed text-lg mb-8">{cycleSteps[activeStep].desc}</p>

              <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                <button
                  onClick={nextStep}
                  className="w-full sm:w-auto group flex items-center justify-center gap-3 bg-slate-100 hover:bg-slate-200 text-slate-800 px-8 py-4 rounded-full font-bold transition-all"
                >
                  <span>{activeStep === 3 ? "Reiniciar Ciclo" : "Próxima Etapa"}</span>
                  <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                </button>

                {completedCycles >= 1 && (
                  <button
                    onClick={() => setPhase('combinacao')}
                    className="w-full sm:w-auto flex items-center justify-center gap-2 text-white bg-emerald-600 hover:bg-emerald-700 px-8 py-4 rounded-full font-bold transition-all shadow-md"
                  >
                    Próximo Conceito <ChevronRight size={20} />
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
              <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4 uppercase tracking-tighter text-gradient">A Combinação Fatal</h2>
              <p className="text-slate-600 text-lg max-w-2xl mx-auto">
                Qualquer coisa pode acontecer quando o estilo de vida de Rei Bebê e a baixa autoestima se combinam com a experiência de dor.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 w-full">
              {[
                { id: 'lifestyle', label: 'Estilo Rei Bebê', desc: 'Excesso, imaturidade e onipotência.', icon: <Zap size={28} /> },
                { id: 'lowSelfEsteem', label: 'Baixa Autoestima', desc: 'Sentimentos de falta de valor.', icon: <Ghost size={28} /> },
                { id: 'pain', label: 'Experiência de Dor', desc: 'Sofrimento real ou imaginário.', icon: <CloudLightning size={28} /> }
              ].map((item) => (
                <button
                  key={item.id}
                  onClick={() => setIngredients(prev => ({ ...prev, [item.id as keyof typeof ingredients]: !prev[item.id as keyof typeof ingredients] }))}
                  className={`p-8 rounded-[2.5rem] border-2 transition-all text-left flex flex-col justify-between min-h-[220px] ${ingredients[item.id as keyof typeof ingredients]
                      ? 'bg-emerald-50 border-emerald-400 shadow-[0_10px_30px_rgba(16,185,129,0.15)] scale-[1.02]'
                      : 'bg-white border-slate-200 hover:border-emerald-200 hover:shadow-md'
                    }`}
                >
                  <div className={`p-4 rounded-2xl w-max transition-colors ${ingredients[item.id as keyof typeof ingredients]
                      ? 'bg-emerald-500 text-white shadow-sm'
                      : 'bg-slate-100 text-slate-400'
                    }`}>
                    {item.icon}
                  </div>
                  <div className="mt-6">
                    <h4 className={`font-black mb-2 text-xl ${ingredients[item.id as keyof typeof ingredients] ? 'text-emerald-900' : 'text-slate-800'
                      }`}>{item.label}</h4>
                    <p className="text-sm font-medium text-slate-500">{item.desc}</p>
                  </div>
                </button>
              ))}
            </div>

            <div className="w-full flex items-center justify-center p-10 glass-panel rounded-[3rem] border border-slate-200 bg-white/50 overflow-hidden relative min-h-[300px]">
              <AnimatePresence mode="wait">
                {allIngredientsSelected ? (
                  <motion.div
                    key="result"
                    initial={{ scale: 0.8, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-center z-10 bg-white p-8 rounded-3xl shadow-[0_20px_60px_rgba(239,68,68,0.15)] border border-red-100 max-w-2xl"
                  >
                    <div className="text-red-500 mb-6 flex justify-center"><AlertTriangle size={72} className="animate-pulse" /></div>
                    <h3 className="text-3xl font-black text-red-600 mb-4 uppercase tracking-widest">EXPLOSÃO DA ADICÇÃO</h3>
                    <p className="text-slate-600 font-medium leading-relaxed mb-8">
                      Esta é a combinação fatal. O uso da substância ou comportamento oferece o alívio que o ego do Rei Bebê busca, criando uma relação de amor com a própria dor.
                    </p>
                    <button
                      onClick={() => setPhase('catalisador')}
                      className="bg-red-500 hover:bg-red-600 text-white px-10 py-4 rounded-full font-black text-lg transition-all flex items-center gap-3 mx-auto shadow-lg active:scale-95"
                    >
                      Entrar no Efeito Catalisador <ArrowRight size={22} />
                    </button>
                  </motion.div>
                ) : (
                  <motion.div key="empty" className="text-slate-400 text-center flex flex-col items-center">
                    <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6">
                      <Plus size={40} className="text-slate-300" />
                    </div>
                    <p className="text-lg font-medium max-w-md">Selecione todos os três ingredientes acima para ver o resultado da combinação.</p>
                  </motion.div>
                )}
              </AnimatePresence>
              {allIngredientsSelected && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.05 }}
                  className="absolute inset-0 bg-red-600 pointer-events-none"
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
              <h2 className="text-3xl md:text-4xl font-black text-slate-900 mb-4 uppercase tracking-tighter">O Catalisador</h2>
              <p className="text-slate-600 text-lg">
                O sistema de defesa nega o problema e acelera a queda. O inimigo está dentro de nós.
              </p>
            </div>

            <div className="relative w-full h-[450px] bg-slate-900 rounded-[3rem] border-4 border-slate-800 flex flex-col items-center justify-end p-12 overflow-hidden shadow-2xl">
              <motion.div
                animate={{
                  y: [0, -280, 450],
                  opacity: [1, 1, 0],
                  scale: [1, 1.2, 0.5]
                }}
                transition={{ duration: 6, times: [0, 0.4, 1], repeat: Infinity, repeatDelay: 1 }}
                className="flex flex-col items-center z-10"
              >
                <Rocket size={64} className="text-emerald-400 mb-2 filter drop-shadow-[0_0_10px_rgba(52,211,153,0.8)]" />
                <div className="w-1.5 h-40 bg-gradient-to-t from-emerald-400 to-transparent opacity-60 rounded-full" />
              </motion.div>

              <div className="absolute inset-x-0 bottom-0 p-10 text-center bg-gradient-to-t from-black via-black/80 to-transparent pt-24 z-20">
                <h4 className="text-2xl font-black text-white mb-3">A Ascensão Falsa e a Queda Real</h4>
                <p className="text-base text-slate-300 font-medium max-w-lg mx-auto leading-relaxed">
                  O uso liberta frustrações como um foguete para a lua (euforia falsa), mas o peso da realidade nos puxa para o fundo do poço em metade do tempo.
                </p>
              </div>

              <div className="absolute top-12 right-12 text-right opacity-40 z-0">
                <span className="block text-5xl font-black text-white">EUFORIA</span>
                <span className="block text-sm font-bold uppercase tracking-[0.4em] text-emerald-400 mt-2">Falsa Sensação de Útero</span>
              </div>

              <div className="absolute bottom-32 left-12 text-left opacity-40 z-0">
                <span className="block text-5xl font-black text-red-500">ABISMO</span>
                <span className="block text-sm font-bold uppercase tracking-[0.4em] text-red-400 mt-2">Fundo do Poço Acelerado</span>
              </div>
            </div>

            <div className="mt-12 flex flex-col gap-8 w-full">
              <div className="bg-emerald-50 border border-emerald-200 p-8 rounded-[2rem]">
                <h5 className="text-emerald-900 font-black mb-3 flex items-center gap-3 text-xl"><Zap size={24} className="text-emerald-500" /> O Que Acontece?</h5>
                <p className="text-base text-emerald-800 font-medium leading-relaxed">
                  Cego pela sensação maravilhosa da euforia, o Rei Bebê põe de lado sua consciência e valores. O sistema de engano e negação torna impossível enxergar o estado em que chegamos.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <button
                  onClick={() => setPhase('combinacao')}
                  className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 py-5 rounded-full font-black text-lg transition-all flex items-center justify-center gap-3"
                >
                  <ChevronLeft size={24} /> Voltar
                </button>
                <button
                  onClick={onComplete}
                  className="flex-[2] bg-emerald-600 hover:bg-emerald-700 text-white py-5 rounded-full font-black text-lg transition-all shadow-[0_10px_30px_rgba(5,150,105,0.3)] active:scale-95 flex justify-center items-center gap-2"
                >
                  Concluir Estudo da Trilha 3 <CheckCircle2 size={24} />
                </button>
              </div>
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
