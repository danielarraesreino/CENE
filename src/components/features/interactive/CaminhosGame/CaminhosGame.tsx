'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { caminhosScenes } from './caminhosScenes';
import { Trophy, Users, Heart, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Types based on the original structure
interface InventoryItem {
  icon: string;
  name: string;
  desc: string;
}

interface Choice {
  text: string;
  resEffect?: number;
  socEffect?: number;
  item?: InventoryItem;
  nextScene?: string;
}

interface Scene {
  speaker?: string;
  text: string;
  emoji?: string;
  bgColor?: string;
  choices: Choice[];
}

interface CaminhosGameProps {
  onComplete?: (finalStats: { resilience: number; social: number; achievements: InventoryItem[] }) => void;
}

export function CaminhosGame({ onComplete }: CaminhosGameProps) {
  const [resilience, setResilience] = useState(50);
  const [social, setSocial] = useState(50);
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [currentSceneId, setCurrentSceneId] = useState('cena1');
  const [sceneCount, setSceneCount] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [isTyping, setIsTyping] = useState(true);
  
  const totalScenes = Object.keys(caminhosScenes).length;
  const currentScene: Scene | undefined = caminhosScenes[currentSceneId];

  // O typewriter agora é isolado para evitar re-renderizações no componente pai

  const handleChoice = (choice: Choice) => {
    if (choice.resEffect) {
      setResilience((prev) => Math.max(0, Math.min(100, prev + choice.resEffect!)));
    }
    if (choice.socEffect) {
      setSocial((prev) => Math.max(0, Math.min(100, prev + choice.socEffect!)));
    }
    if (choice.item) {
      setInventory((prev) => [...prev, choice.item!]);
    }

    if (choice.nextScene) {
      setCurrentSceneId(choice.nextScene);
      setSceneCount((prev) => prev + 1);
      setIsTyping(true);
    } else {
      setIsFinished(true);
      if (onComplete) {
        onComplete({
          resilience: Math.max(0, Math.min(100, resilience + (choice.resEffect || 0))),
          social: Math.max(0, Math.min(100, social + (choice.socEffect || 0))),
          achievements: choice.item ? [...inventory, choice.item] : inventory,
        });
      }
    }
  };

  const resetGame = () => {
    setResilience(50);
    setSocial(50);
    setInventory([]);
    setCurrentSceneId('cena1');
    setSceneCount(0);
    setIsFinished(false);
  };

  if (!currentScene && !isFinished) {
    return <div className="text-white p-4">Erro: Cena não encontrada.</div>;
  }

  return (
    <div className="w-full max-w-3xl mx-auto flex flex-col gap-6 font-sans">
      {/* Header HUD */}
      <div className="flex gap-4 items-center justify-between bg-zinc-900/50 p-4 rounded-2xl border border-zinc-800 backdrop-blur-md">
        <div className="flex flex-col gap-1 w-1/3">
          <div className="flex items-center justify-between text-sm text-zinc-400">
            <span className="flex items-center gap-1"><Heart className="w-4 h-4 text-rose-400" /> Resiliência</span>
            <span className="font-mono text-white">{resilience}/100</span>
          </div>
          <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
            <div className="h-full bg-rose-500 transition-all duration-500" style={{ width: `${resilience}%` }} />
          </div>
        </div>

        <div className="flex flex-col items-center justify-center">
          <span className="text-xs text-zinc-500 uppercase tracking-widest font-bold">Cena {sceneCount + 1}</span>
          <div className="text-2xl">{currentScene?.emoji || '🏠'}</div>
        </div>

        <div className="flex flex-col gap-1 w-1/3">
          <div className="flex items-center justify-between text-sm text-zinc-400">
            <span className="flex items-center gap-1"><Users className="w-4 h-4 text-emerald-400" /> Conexão</span>
            <span className="font-mono text-white">{social}/100</span>
          </div>
          <div className="w-full h-2 bg-zinc-800 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500 transition-all duration-500" style={{ width: `${social}%` }} />
          </div>
        </div>
      </div>

      {!isFinished ? (
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSceneId}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="flex flex-col gap-6"
          >
            {/* Story Card */}
            <div className="bg-zinc-900/80 border border-zinc-800 rounded-xl text-white min-h-[200px] p-6 shadow-xl">
              <div className="pb-4 border-b border-zinc-800/50 mb-4">
                <h3 className="text-lg font-bold text-emerald-400">
                  {currentScene!.speaker || 'Narrador'}
                </h3>
              </div>
              <div>
                <TypewriterText 
                  text={currentScene!.text} 
                  sceneId={currentSceneId} 
                  onTypingStateChange={setIsTyping}
                />
              </div>
            </div>

            {/* Choices */}
            <div className="grid grid-cols-1 gap-3">
              {currentScene!.choices.map((choice, idx) => (
                <button
                  key={idx}
                  onClick={() => handleChoice(choice)}
                  disabled={isTyping}
                  className="flex items-center w-full min-h-[60px] p-4 justify-between bg-zinc-900 border border-zinc-800 rounded-xl hover:bg-zinc-800 hover:border-zinc-700 text-zinc-300 hover:text-white text-left transition-all duration-300 group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <span className="flex-1 whitespace-normal mr-4">{choice.text}</span>
                  
                  <div className="flex flex-col items-end gap-1 shrink-0 text-xs font-mono opacity-0 group-hover:opacity-100 transition-opacity">
                    {choice.resEffect !== undefined && choice.resEffect !== 0 && (
                      <span className={choice.resEffect > 0 ? 'text-rose-400' : 'text-red-500'}>
                        {choice.resEffect > 0 ? '+' : ''}{choice.resEffect} Res
                      </span>
                    )}
                    {choice.socEffect !== undefined && choice.socEffect !== 0 && (
                      <span className={choice.socEffect > 0 ? 'text-emerald-400' : 'text-red-500'}>
                        {choice.socEffect > 0 ? '+' : ''}{choice.socEffect} Soc
                      </span>
                    )}
                  </div>
                </button>
              ))}
            </div>
          </motion.div>
        </AnimatePresence>
      ) : (
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex flex-col gap-6 items-center text-center p-8 bg-zinc-900/80 border border-zinc-800 rounded-2xl text-white"
        >
          <Trophy className="w-16 h-16 text-yellow-500 mb-2" />
          <h2 className="text-3xl font-bold">Fim da Jornada</h2>
          
          <div className="flex gap-8 w-full max-w-md my-6">
            <div className="flex-1 bg-zinc-800/50 p-4 rounded-xl border border-zinc-700/50">
              <Heart className="w-8 h-8 text-rose-400 mx-auto mb-2" />
              <div className="text-sm text-zinc-400">Resiliência</div>
              <div className="text-2xl font-bold">{resilience}</div>
            </div>
            <div className="flex-1 bg-zinc-800/50 p-4 rounded-xl border border-zinc-700/50">
              <Users className="w-8 h-8 text-emerald-400 mx-auto mb-2" />
              <div className="text-sm text-zinc-400">Conexão</div>
              <div className="text-2xl font-bold">{social}</div>
            </div>
          </div>

          <p className="text-zinc-300 max-w-lg mb-4">
            {resilience > 70 && social > 70 
              ? 'Parabéns! Você construiu uma base sólida de resiliência e boas conexões. O Instituto Padre Haroldo se orgulha da sua jornada.'
              : resilience > 50 || social > 50
              ? 'Você teve alguns altos e baixos, mas conseguiu se manter firme. Continue buscando apoio e fortalecendo sua resiliência!'
              : 'Foi uma jornada difícil. Lembre-se que buscar ajuda é o primeiro passo. A rede de apoio está sempre aqui para você.'}
          </p>

          {inventory.length > 0 && (
            <div className="w-full mt-6">
              <h3 className="text-lg font-medium text-zinc-400 mb-4 border-b border-zinc-800 pb-2">Suas Conquistas</h3>
              <div className="flex flex-wrap gap-3 justify-center">
                {inventory.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 bg-zinc-800 px-3 py-2 rounded-lg text-sm" title={item.desc}>
                    <span>{item.icon}</span>
                    <span>{item.name}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <button onClick={resetGame} className="mt-8 px-6 py-3 bg-zinc-800 hover:bg-zinc-700 text-white rounded-xl font-medium transition-colors">
            Jogar Novamente
          </button>
        </motion.div>
      )}
    </div>
  );
}

function TypewriterText({ 
  text, 
  sceneId, 
  onTypingStateChange 
}: { 
  text: string; 
  sceneId: string;
  onTypingStateChange: (isTyping: boolean) => void;
}) {
  const [typedText, setTypedText] = useState('');

  useEffect(() => {
    setTypedText('');
    
    
    let currentText = '';
    let i = 0;
    
    const interval = setInterval(() => {
      if (i < text.length) {
        currentText += text.charAt(i);
        setTypedText(currentText);
        i++;
      } else {
        clearInterval(interval);
        onTypingStateChange(false);
      }
    }, 20); // 20ms per char

    return () => {
      clearInterval(interval);
    };
  }, [text, sceneId, onTypingStateChange]);

  return (
    <p className="text-zinc-300 text-lg leading-relaxed min-h-[100px]">
      {typedText}
      <span className="animate-pulse">|</span>
    </p>
  );
}

