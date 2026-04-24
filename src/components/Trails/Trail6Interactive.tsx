"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { HandHeart, Scale, Sparkles, Briefcase, CheckCircle2, ChevronRight, Zap, ShieldCheck } from "lucide-react";

const contrastWords = [
  { before: "Frustrado", after: "Em segurança" },
  { before: "Zangado", after: "Protegido" },
  { before: "Tenso", after: "Descontraído" },
  { before: "Nervoso", after: "Grato" },
  { before: "Sem saída", after: "Aberto" },
  { before: "Em pânico", after: "Ensinável" },
  { before: "Com medo", after: "Boa vontade" },
  { before: "Culpado", after: "Honesto" },
  { before: "Envergonhado", after: "Esperançoso" },
  { before: "Com dúvidas", after: "Em paz" }
];

const toolsData = [
  { id: "responsabilidade", title: "Responsabilidade", desc: "Assumir o controle do nosso próprio valor e dignidade.", icon: <ShieldCheck size={28} /> },
  { id: "reacao", title: "Escolha de Reação", desc: "Não reagir com medo ou raiva, mas escolher a aceitação.", icon: <Zap size={28} /> },
  { id: "poder_interno", title: "Poder Interno", desc: "O bem estar não vem de fora, mas de dentro de nós.", icon: <Sparkles size={28} /> }
];

export function Trail6Interactive({ onComplete }: { onComplete: () => void }) {
  const [phase, setPhase] = useState<'transformacao' | 'ferramentas'>('transformacao');
  const [sliderValue, setSliderValue] = useState(0);
  const [collected, setCollected] = useState<string[]>([]);

  const toggleTool = (id: string) => {
    if (!collected.includes(id)) {
      setCollected([...collected, id]);
    }
  };

  const allCollected = collected.length === toolsData.length;

  return (
    <div className="w-full flex flex-col items-center py-10 min-h-[700px]">
      
      <AnimatePresence mode="wait">
        
        {phase === 'transformacao' && (
          <motion.div 
            key="transformacao"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            className="flex flex-col items-center w-full max-w-4xl"
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl font-heading font-black text-white mb-4 uppercase tracking-tighter">O Antes e o Depois</h2>
              <p className="text-gray-400">
                Arraste o seletor para ver como a rendição transforma o caos em serenidade.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 w-full mb-12">
              {contrastWords.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between glass-panel p-4 rounded-2xl border-white/5 relative overflow-hidden group">
                  <motion.span 
                    animate={{ 
                      opacity: 1 - (sliderValue / 100),
                      x: sliderValue > 50 ? -20 : 0,
                      filter: `blur(${sliderValue / 10}px)`
                    }}
                    className="text-red-400 font-bold uppercase tracking-widest text-sm"
                  >
                    {item.before}
                  </motion.span>
                  
                  <div className="w-px h-6 bg-white/10" />

                  <motion.span 
                    animate={{ 
                      opacity: sliderValue / 100,
                      x: sliderValue < 50 ? 20 : 0,
                      filter: `blur(${(100 - sliderValue) / 10}px)`
                    }}
                    className="text-brand-cyan font-bold uppercase tracking-widest text-sm text-right"
                  >
                    {item.after}
                  </motion.span>

                  {/* Progress Line in each card */}
                  <div className="absolute bottom-0 left-0 h-0.5 bg-brand-cyan transition-all" style={{ width: `${sliderValue}%` }} />
                </div>
              ))}
            </div>

            <div className="w-full max-w-xl bg-white/5 p-8 rounded-[3rem] border border-white/10 flex flex-col items-center">
              <input 
                type="range" 
                min="0" max="100" 
                value={sliderValue} 
                onChange={(e) => setSliderValue(parseInt(e.target.value))}
                className="w-full h-2 bg-white/10 rounded-lg appearance-none cursor-pointer accent-brand-cyan mb-8"
              />
              
              <div className="flex justify-between w-full text-[10px] font-black uppercase tracking-[0.3em] text-gray-500">
                <span>REI BEBÊ (CAOS)</span>
                <span>RECUPERAÇÃO (PAZ)</span>
              </div>
            </div>

            {sliderValue === 100 && (
              <motion.button 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                onClick={() => setPhase('ferramentas')}
                className="mt-12 bg-white text-black px-10 py-4 rounded-full font-black flex items-center gap-2 shadow-[0_0_40px_rgba(255,255,255,0.3)] transition-all hover:scale-105"
              >
                Explorar Ferramentas <ChevronRight />
              </motion.button>
            )}
          </motion.div>
        )}

        {phase === 'ferramentas' && (
          <motion.div 
            key="ferramentas"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center w-full max-w-5xl"
          >
            <div className="text-center mb-12">
              <h2 className="text-3xl font-heading font-black text-white mb-4 uppercase tracking-tighter">Ferramentas de Reconstrução</h2>
              <p className="text-gray-400">
                Sua dignidade não depende do que os outros dizem, mas de como você reage. Colete as ferramentas para sua nova vida.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16 w-full">
              {toolsData.map((tool) => {
                const isCollected = collected.includes(tool.id);
                return (
                  <motion.div
                    key={tool.id}
                    whileHover={!isCollected ? { y: -10 } : {}}
                    onClick={() => toggleTool(tool.id)}
                    className={`glass-panel p-8 rounded-[2.5rem] flex flex-col items-center text-center cursor-pointer transition-all duration-500 border-2 ${
                      isCollected ? 'border-brand-cyan bg-brand-cyan/10' : 'border-white/5 hover:border-brand-accent/40'
                    }`}
                  >
                    <div className={`p-5 rounded-2xl mb-6 ${isCollected ? 'text-brand-cyan' : 'text-gray-500'}`}>
                      {isCollected ? <CheckCircle2 size={40} /> : tool.icon}
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-2">{tool.title}</h3>
                    <p className="text-xs text-gray-400 leading-relaxed">{tool.desc}</p>
                  </motion.div>
                );
              })}
            </div>

            <div className="w-full max-w-2xl bg-white/5 border border-white/10 rounded-full p-6 flex items-center justify-between">
              <div className="flex items-center gap-4 ml-4">
                <Briefcase className="text-gray-500" size={24} />
                <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Inventário: {collected.length}/3</span>
              </div>

              <button
                onClick={onComplete}
                disabled={!allCollected}
                className={`px-10 py-3 rounded-full font-black transition-all ${
                  allCollected 
                  ? 'bg-brand-cyan hover:bg-brand-cyan/80 text-white shadow-[0_0_30px_rgba(6,182,212,0.5)]' 
                  : 'bg-white/10 text-gray-600 cursor-not-allowed'
                } uppercase tracking-widest`}
              >
                Equipar e Finalizar
              </button>
            </div>
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}
