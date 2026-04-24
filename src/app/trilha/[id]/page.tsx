"use client";

import { useEffect, useState, use } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAppStore } from "@/store/useAppStore";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Headphones, BookOpen, PenTool, CheckCircle2, ChevronLeft } from "lucide-react";
import Link from "next/link";
import { GenesisInteractive } from "@/components/Trails/GenesisInteractive";
import { Trail2Interactive } from "@/components/Trails/Trail2Interactive";
import { Trail3Interactive } from "@/components/Trails/Trail3Interactive";
import { Trail4Interactive } from "@/components/Trails/Trail4Interactive";
import { Trail5Interactive } from "@/components/Trails/Trail5Interactive";
import { Trail6Interactive } from "@/components/Trails/Trail6Interactive";
import { Trail7Interactive } from "@/components/Trails/Trail7Interactive";
import { CertificateGenerator } from "@/components/Certificate/CertificateGenerator";

type Stage = 'ouvir' | 'estudar' | 'avaliar';

export default function TrilhaPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const trailId = parseInt(resolvedParams.id, 10);
  const router = useRouter();
  const { data: session } = useSession();
  
  const trail = useAppStore((state) => state.trails.find((t) => t.id === trailId));
  const completeStep = useAppStore((state) => state.completeStep);
  
  const [currentStage, setCurrentStage] = useState<Stage>('ouvir');

  useEffect(() => {
    if (!trail) {
      router.push('/hub');
    } else if (trail && !trail.isUnlocked) {
      router.push('/hub'); // Security block
    }
  }, [trail, router]);

  if (!trail) return null;
  
  const handleComplete = async (stage: Stage) => {
    completeStep(trailId, stage);
    
    // Sincronização imediata com o backend para evitar perda de progresso no redirect
    if (session?.accessToken) {
      try {
        // Buscamos o estado atualizado da store (que acabou de mudar com completeStep)
        const currentTrails = useAppStore.getState().trails;
        await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/trails/sync_progress/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${session.accessToken}`
          },
          body: JSON.stringify({ trails: currentTrails })
        });
      } catch (error) {
        console.error("Erro ao sincronizar progresso imediato:", error);
      }
    }

    if (stage === 'ouvir') setCurrentStage('estudar');
    if (stage === 'estudar') setCurrentStage('avaliar');
    if (stage === 'avaliar') {
      alert("Avaliação Concluída! Próxima trilha desbloqueada.");
      router.push('/hub');
    }
  };

  const tabs = [
    { id: 'ouvir', label: '1. Ouvir', icon: Headphones },
    { id: 'estudar', label: '2. Estudar e Explorar', icon: BookOpen },
    { id: 'avaliar', label: '3. Avaliar', icon: PenTool }
  ];

  return (
    <div className="relative min-h-screen p-8 md:p-12 max-w-7xl mx-auto w-full flex flex-col">
      <Link href="/hub" className="inline-flex items-center text-gray-400 hover:text-brand-accent transition-colors mb-8 w-max">
        <ChevronLeft size={20} className="mr-2" />
        Voltar para o Hub
      </Link>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 gap-6">
        <div>
          <span className="text-brand-cyan font-bold tracking-widest uppercase text-sm mb-2 block">
            Trilha {trail.id}
          </span>
          <h1 className="text-4xl md:text-5xl font-heading font-black text-white drop-shadow-lg">
            {trail.title}
          </h1>
        </div>
        
        {/* Navigation Tabs */}
        <div className="flex bg-white/5 p-1 rounded-full border border-white/10 overflow-hidden">
          {tabs.map((tab) => {
            const isActive = currentStage === tab.id;
            const isCompleted = trail.progress[tab.id as keyof typeof trail.progress];
            const Icon = tab.icon;
            
            return (
              <button
                key={tab.id}
                onClick={() => setCurrentStage(tab.id as Stage)}
                className={`relative px-6 py-3 rounded-full flex items-center gap-2 text-sm font-medium transition-all ${
                  isActive ? 'text-white' : 'text-gray-400 hover:text-gray-200 hover:bg-white/5'
                }`}
              >
                {isActive && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-0 bg-brand-accent/40 shadow-[0_0_15px_rgba(139,92,246,0.3)] rounded-full -z-10"
                  />
                )}
                <Icon size={18} />
                <span className="hidden sm:inline">{tab.label}</span>
                {isCompleted && <CheckCircle2 size={14} className="text-brand-cyan ml-1" />}
              </button>
            );
          })}
        </div>
      </div>

      <div className="flex-1 relative w-full">
        <AnimatePresence mode="wait">
          
          {currentStage === 'ouvir' && (
            <motion.div
              key="ouvir"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="glass-panel rounded-3xl p-10 flex flex-col items-center justify-center text-center min-h-[500px]"
            >
              <div className="w-24 h-24 bg-brand-accent/20 rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(139,92,246,0.3)]">
                <Headphones size={48} className="text-brand-accent" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-4">Ouça o Módulo {trail.id}</h2>
              <p className="text-gray-300 max-w-xl mb-8">
                Dê play no áudio abaixo para assimilar os conceitos da trilha antes de avançar para a etapa de estudo interativo.
              </p>

              {/* Player Nativo Integrado no Glassmorphism */}
              <div className="w-full max-w-md bg-white/5 p-4 rounded-2xl border border-white/10 mb-8 shadow-inner flex flex-col items-center transition-all hover:bg-white/10">
                <audio 
                  controls 
                  className="w-full h-12 outline-none rounded-lg"
                  src={trailId === 1 ? "/genese.mp3" : "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3"} 
                >
                  Seu navegador não suporta o elemento de áudio.
                </audio>
                <div className="flex justify-between w-full px-2 mt-2">
                  <span className="text-xs text-brand-cyan/80 font-medium tracking-wider">
                    {trailId === 1 ? "A_GENESE_DO_REI_BEBE.MP3" : "AUDIOBOOK.MP3"}
                  </span>
                  <span className="text-xs text-gray-500">Trilha {trail.id}</span>
                </div>
              </div>

              <button 
                onClick={() => handleComplete('ouvir')}
                className="bg-brand-accent hover:bg-brand-accent/80 text-white px-8 py-3 rounded-full font-bold transition-all shadow-[0_0_20px_rgba(139,92,246,0.5)]"
              >
                Marcar como Ouvido e Avançar
              </button>
            </motion.div>
          )}

          {currentStage === 'estudar' && (
            <motion.div
              key="estudar"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="min-h-[500px] flex flex-col"
            >
              {trailId === 1 ? (
                <GenesisInteractive onComplete={() => handleComplete('estudar')} />
              ) : trailId === 2 ? (
                <Trail2Interactive onComplete={() => handleComplete('estudar')} />
              ) : trailId === 3 ? (
                <Trail3Interactive onComplete={() => handleComplete('estudar')} />
              ) : trailId === 4 ? (
                <Trail4Interactive onComplete={() => handleComplete('estudar')} />
              ) : trailId === 5 ? (
                <Trail5Interactive onComplete={() => handleComplete('estudar')} />
              ) : trailId === 6 ? (
                <Trail6Interactive onComplete={() => handleComplete('estudar')} />
              ) : trailId === 7 ? (
                <Trail7Interactive onComplete={() => handleComplete('estudar')} />
              ) : (
                <div className="glass-panel rounded-3xl p-10 flex flex-col items-center justify-center text-center flex-1">
                  <BookOpen size={48} className="text-gray-400 mb-6" />
                  <h2 className="text-2xl font-bold text-white mb-4">Material de Estudo (Em Breve)</h2>
                  <p className="text-gray-300 max-w-xl mb-8">Conteúdo interativo específico para a Trilha {trail.id}.</p>
                  <button 
                    onClick={() => handleComplete('estudar')}
                    className="bg-brand-cyan hover:bg-brand-cyan/80 text-white px-8 py-3 rounded-full font-bold transition-all shadow-[0_0_20px_rgba(6,182,212,0.5)]"
                  >
                    Concluir Estudo
                  </button>
                </div>
              )}
            </motion.div>
          )}

          {currentStage === 'avaliar' && (
            <motion.div
              key="avaliar"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="glass-panel rounded-3xl p-10 flex flex-col items-center justify-center text-center min-h-[500px]"
            >
              <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(34,197,94,0.3)]">
                <PenTool size={48} className="text-green-400" />
              </div>
              <h2 className="text-2xl font-bold text-white mb-4">Quiz de Validação</h2>
              
              {trail.status === 'completed' && trail.id === 7 ? (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center"
                >
                  <p className="text-green-400 font-bold mb-8 text-xl">Parabéns! Você concluiu toda a jornada formativa.</p>
                  <CertificateGenerator userName={session?.user?.name || "Aluno(a)"} />
                </motion.div>
              ) : (
                <>
                  <p className="text-gray-300 max-w-xl mb-8">
                    Responda às questões sobre a trilha. Se acertar o mínimo necessário, a próxima trilha será desbloqueada.
                  </p>
                  <button 
                    onClick={() => handleComplete('avaliar')}
                    className="bg-green-500 hover:bg-green-600 text-white px-10 py-4 rounded-full font-bold text-lg transition-all shadow-[0_0_20px_rgba(34,197,94,0.5)]"
                  >
                    Simular Aprovação no Quiz
                  </button>
                </>
              )}
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}
