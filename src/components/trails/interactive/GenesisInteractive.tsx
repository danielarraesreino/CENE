"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Baby, Zap, ShieldAlert, ArrowRight } from "lucide-react";

const genesisStages = [
  {
    id: "womb",
    title: "O Ventre: A Ilusão de Onipotência",
    description: "No ventre materno, não havia fome, frio ou dor prolongada. Todas as necessidades eram atendidas instantaneamente. O bebê se sentia o centro do universo, um verdadeiro 'Rei' absoluto.",
    icon: <Baby size={32} />
  },
  {
    id: "birth",
    title: "O Trauma do Nascimento",
    description: "De repente, o útero contrai e expulsa o bebê para um mundo frio, barulhento e caótico. A sensação de onipotência é substituída por um choque de realidade e abandono aterrador.",
    icon: <Zap size={32} />
  },
  {
    id: "ego",
    title: "O Surgimento do Rei Bebê",
    description: "Para lidar com o medo do mundo exterior, a 'criança assustada' desenvolve mecanismos de defesa. Ela chora, grita e manipula para forçar o mundo a voltar a ser o útero seguro.",
    icon: <ShieldAlert size={32} />
  }
];

export function GenesisInteractive({ onComplete }: { onComplete: () => void }) {
  const [currentStage, setCurrentStage] = useState(0);

  const nextStage = () => {
    if (currentStage < genesisStages.length - 1) {
      setCurrentStage(currentStage + 1);
    } else {
      onComplete();
    }
  };

  const stage = genesisStages[currentStage];

  return (
    <div className="w-full flex flex-col items-center py-10">
      
      {/* Indicadores de Progresso */}
      <div className="flex gap-4 mb-12">
        {genesisStages.map((_, index) => (
          <div 
            key={index} 
            className={`h-2 rounded-full transition-all duration-500 ${
              index === currentStage ? 'w-16 bg-brand-accent shadow-[0_0_10px_rgba(139,92,246,0.8)]' : 
              index < currentStage ? 'w-8 bg-brand-accent/50' : 'w-8 bg-white/10'
            }`}
          />
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={stage.id}
          initial={{ opacity: 0, scale: 0.8, filter: "blur(10px)" }}
          animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
          exit={{ opacity: 0, scale: 1.1, filter: "blur(10px)", position: "absolute" }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="glass-panel rounded-[2.5rem] p-8 md:p-12 w-full max-w-2xl flex flex-col items-center text-center relative overflow-hidden"
        >
          {/* Efeito de Ventre Dinâmico no fundo do card */}
          <motion.div 
            animate={{ scale: [1, 1.2, 1], opacity: [0.1, 0.2, 0.1] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute inset-0 bg-brand-accent/20 rounded-full blur-[100px] -z-10"
          />

          <div className="p-5 bg-white/5 border border-white/10 rounded-full text-brand-cyan mb-8 shadow-[0_0_20px_rgba(6,182,212,0.4)]">
            {stage.icon}
          </div>
          
          <h2 className="text-3xl font-heading font-bold text-white mb-6 drop-shadow-md">
            {stage.title}
          </h2>
          
          <p className="text-lg text-gray-300 font-sans leading-relaxed mb-10">
            {stage.description}
          </p>

          <button 
            onClick={nextStage}
            className="flex items-center gap-2 bg-white/10 hover:bg-white/20 border border-white/20 px-8 py-3 rounded-full text-white font-semibold transition-all hover:shadow-[0_0_15px_rgba(255,255,255,0.2)]"
          >
            {currentStage < genesisStages.length - 1 ? 'Avançar na História' : 'Ir para a Avaliação (Quiz)'}
            {currentStage < genesisStages.length - 1 && <ArrowRight size={18} />}
          </button>
        </motion.div>
      </AnimatePresence>

    </div>
  );
}
