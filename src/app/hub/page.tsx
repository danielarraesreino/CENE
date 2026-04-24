"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { useAppStore } from "@/store/useAppStore";
import { Lock, Unlock, CheckCircle2, LogOut } from "lucide-react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

interface BackendTrail {
  trail_id: number;
  is_unlocked: boolean;
  status: string;
  ouvir: boolean;
  estudar: boolean;
  avaliar: boolean;
}

export default function HubDashboard() {
  const trails = useAppStore((state) => state.trails);
  const setTrails = useAppStore((state) => state.setTrails);
  const unlockAllTrails = useAppStore((state) => state.unlockAllTrails);
  const { data: session } = useSession();
  const [isHydrated, setIsHydrated] = useState(false);

  // 1. Busca progresso do backend ao carregar
  useEffect(() => {
    const fetchProgress = async () => {
      if (session?.accessToken && !isHydrated) {
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/trails/`, {
            headers: {
              'Authorization': `Bearer ${session.accessToken}`
            }
          });
          if (res.ok) {
            const backendTrails: BackendTrail[] = await res.json();
            if (backendTrails.length > 0) {
                const updatedTrails = trails.map(t => {
                  const bt = backendTrails.find((b) => b.trail_id === t.id);
                  if (bt) {
                    // Lógica de mesclagem: Se o local já estiver mais avançado (ex: completou agora), mantém local.
                    // Caso contrário, usa o do backend.
                    const localStepsCompleted = Object.values(t.progress).filter(Boolean).length;
                    const backendStepsCompleted = (bt.ouvir ? 1 : 0) + (bt.estudar ? 1 : 0) + (bt.avaliar ? 1 : 0);
                    
                    if (localStepsCompleted > backendStepsCompleted) {
                      return t; // Mantém o progresso local mais novo
                    }

                    return {
                      ...t,
                      isUnlocked: bt.is_unlocked || t.isUnlocked, // Se algum dos dois for true, desbloqueia
                      status: bt.status as 'idle' | 'in_progress' | 'completed',
                      progress: {
                        ouvir: bt.ouvir,
                        estudar: bt.estudar,
                        avaliar: bt.avaliar
                      }
                    };
                  }
                  return t;
                });
              setTrails(updatedTrails);
            }
            setIsHydrated(true);
          }
        } catch (error) {
          console.error("Erro ao buscar progresso:", error);
        }
      }
    };
    fetchProgress();
  }, [session, isHydrated, setTrails, trails]);

  // 2. Sincroniza progresso LOCAL -> BACKEND quando houver mudanças
  useEffect(() => {
    const syncWithBackend = async () => {
      if (session?.accessToken && isHydrated) {
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/trails/sync_progress/`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${session.accessToken}`
            },
            body: JSON.stringify({ trails })
          });
          if (!res.ok) console.error("Falha ao sincronizar com backend");
        } catch (error) {
          console.error("Erro de rede ao sincronizar", error);
        }
      }
    };
    
    if (isHydrated) {
      syncWithBackend();
    }
  }, [session, trails, isHydrated]);

  return (
    <div className="relative min-h-screen p-8 md:p-16 max-w-7xl mx-auto w-full flex flex-col items-center">
      
      <div className="w-full flex justify-between items-center mb-12">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-full bg-brand-cyan/20 border border-brand-cyan/50 flex items-center justify-center text-brand-cyan font-bold text-xl">
            {session?.user?.name?.charAt(0).toUpperCase() || "U"}
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Bem-vindo, {session?.user?.name || "Aluno"}</h2>
            <p className="text-sm text-gray-400">Seu progresso está salvo na nuvem.</p>
          </div>
        </div>
        <button 
          onClick={() => signOut({ callbackUrl: '/login' })}
          className="flex items-center gap-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 px-4 py-2 rounded-full transition-all border border-red-500/20"
        >
          <LogOut size={16} />
          <span>Sair</span>
        </button>
      </div>

      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center max-w-4xl mb-12"
      >
        <h1 className="text-4xl md:text-6xl font-heading font-black mb-4 text-gradient drop-shadow-lg">
          Jornada de Recuperação
        </h1>
        <p className="text-lg text-gray-300 font-sans tracking-wide">
          Bem-vindo ao Hub de Formação. Complete cada módulo (Ouvir, Estudar, Avaliar) para desbloquear a próxima fase e conquistar seu certificado.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full z-10">
        {trails.map((trail, index) => {
          const isLocked = !trail.isUnlocked;
          const isCompleted = trail.status === 'completed';

          return (
            <motion.div
              key={trail.id}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
            >
              {isLocked ? (
                <div className="glass-panel opacity-60 rounded-3xl p-6 h-full flex flex-col justify-center items-center text-center cursor-not-allowed">
                  <div className="p-4 bg-white/5 rounded-full mb-4">
                    <Lock size={32} className="text-gray-500" />
                  </div>
                  <h3 className="text-xl font-heading font-bold text-gray-500 mb-2">Trilha {trail.id}</h3>
                  <p className="text-sm text-gray-600">{trail.title}</p>
                  <p className="text-xs text-red-400 mt-4 font-semibold uppercase tracking-widest">Bloqueada</p>
                </div>
              ) : (
                <Link href={`/trilha/${trail.id}`} className="block h-full">
                  <motion.div 
                    whileHover={{ scale: 1.03, y: -5 }}
                    whileTap={{ scale: 0.98 }}
                    className={`glass-panel rounded-3xl p-6 h-full flex flex-col justify-between group cursor-pointer ${
                      isCompleted ? 'border-brand-cyan/50 shadow-[0_0_20px_rgba(6,182,212,0.2)]' : ''
                    }`}
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className={`p-3 rounded-2xl ${isCompleted ? 'bg-brand-cyan/20 text-brand-cyan' : 'bg-brand-accent/20 text-brand-accent'}`}>
                        {isCompleted ? <CheckCircle2 size={28} /> : <Unlock size={28} />}
                      </div>
                      <span className="text-xs font-bold text-gray-400 bg-white/5 px-3 py-1 rounded-full">
                        Módulo {trail.id}
                      </span>
                    </div>

                    <div>
                      <h3 className="text-2xl font-heading font-bold text-white mb-2 group-hover:text-brand-accent transition-colors">
                        {trail.title}
                      </h3>
                      
                      <div className="flex gap-2 mt-4">
                        <span className={`text-xs px-2 py-1 rounded-md ${trail.progress.ouvir ? 'bg-green-500/20 text-green-400' : 'bg-white/10 text-gray-400'}`}>Ouvir</span>
                        <span className={`text-xs px-2 py-1 rounded-md ${trail.progress.estudar ? 'bg-green-500/20 text-green-400' : 'bg-white/10 text-gray-400'}`}>Estudar</span>
                        <span className={`text-xs px-2 py-1 rounded-md ${trail.progress.avaliar ? 'bg-green-500/20 text-green-400' : 'bg-white/10 text-gray-400'}`}>Avaliar</span>
                      </div>
                    </div>
                  </motion.div>
                </Link>
              )}
            </motion.div>
          );
        })}
      </div>
      
      <div className="mt-16 pt-8 border-t border-white/10 w-full flex justify-center">
        <button 
          onClick={unlockAllTrails}
          className="text-xs text-brand-accent/50 hover:text-brand-accent border border-brand-accent/30 px-4 py-2 rounded-full transition-all flex items-center gap-2"
        >
          <Unlock size={14} />
          Desbloquear Jornada Completa (Dev Mode)
        </button>
      </div>

    </div>
  );
}
