"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Lock, Unlock, CheckCircle2, LogOut, Play, GraduationCap, ArrowRight, Sparkles, Activity } from "lucide-react";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { useRenascerProgress } from "@/hooks/useRenascerProgress";

export default function HubDashboard() {
  const { data: session } = useSession();
  const { trails, trailsByCategory, completionPercent, nextTrail, fetchProgress } = useRenascerProgress();
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    if (session?.accessToken && !isHydrated) {
      fetchProgress().then(() => setIsHydrated(true));
    }
  }, [session, isHydrated, fetchProgress]);

  return (
    <div className="relative min-h-screen pt-24 pb-20 px-6 md:px-12 max-w-7xl mx-auto w-full">
      {/* Welcome Header */}
      <div className="w-full flex flex-col md:flex-row justify-between items-center gap-8 mb-12 relative z-10">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 rounded-3xl bg-gradient-to-br from-brand-cyan to-brand-accent p-0.5 shadow-2xl">
            <div className="w-full h-full bg-black rounded-[22px] flex items-center justify-center text-white font-black text-2xl">
              {session?.user?.name?.charAt(0).toUpperCase() || "U"}
            </div>
          </div>
          <div className="text-center md:text-left">
            <h2 className="text-3xl font-black text-slate-900 leading-tight">Olá, {session?.user?.name?.split(' ')[0] || "Aluno"}</h2>
            <div className="flex items-center gap-2 text-slate-500 font-bold uppercase tracking-widest text-xs mt-1">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              Sessão Clínica Segura
            </div>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="hidden lg:flex flex-col items-end">
            <span className="text-[10px] font-black text-slate-500 uppercase tracking-widest">Portal Version</span>
            <span className="text-brand-cyan font-bold">1.2.0-STABLE</span>
          </div>
          <div className="w-px h-10 bg-white/10 hidden lg:block" />
          <button 
            onClick={() => signOut({ callbackUrl: '/login' })}
            className="flex items-center gap-3 bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-500 px-6 py-3 rounded-2xl transition-all border border-slate-200 hover:border-red-200 font-bold text-sm"
          >
            <LogOut size={18} />
            <span>Encerrar</span>
          </button>
        </div>
      </div>

      {/* Humor Check-in Widget (Task 3.2) */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-16 relative z-10"
      >
        <Link href="/portal/paciente/clinical/mood">
          <div className="glass-panel p-8 rounded-[2.5rem] flex flex-col md:flex-row items-center justify-between gap-6 border-emerald-200 hover:border-emerald-300 bg-emerald-50/50 group transition-all">
            <div className="flex items-center gap-6">
              <div className="w-14 h-14 rounded-2xl bg-emerald-100 text-emerald-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <Activity size={28} />
              </div>
              <div>
                <h4 className="text-xl font-black text-slate-900">Como você está se sentindo agora?</h4>
                <p className="text-slate-600 text-sm">O check-in diário ajuda a mapear sua estabilidade emocional.</p>
              </div>
            </div>
            <div className="flex items-center gap-3 bg-emerald-600 text-white px-6 py-3 rounded-xl font-black text-sm uppercase tracking-widest group-hover:gap-5 transition-all shadow-sm">
              Fazer Check-in
              <ArrowRight size={18} />
            </div>
          </div>
        </Link>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="text-center max-w-5xl mx-auto mb-20 relative z-10"
      >
        <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 border border-emerald-200 rounded-full text-emerald-700 text-xs font-black uppercase tracking-widest mb-8">
          <Sparkles size={14} />
          Sua Jornada de Transformação
        </div>
        
        <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-8 leading-[0.9] tracking-tighter text-slate-900">
          O Caminho do <br />
          <span className="text-gradient">Desenvolvimento</span>
        </h1>
        
        <p className="text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto leading-relaxed mb-12">
          Domine a prática profissional através do conhecimento profundo. 
          Cada módulo é um passo em direção à sua especialização.
        </p>

        {/* Global Progress Dashboard */}
        <div className="max-w-2xl mx-auto glass-panel p-10 rounded-[3rem] border-emerald-200 bg-emerald-50">
          <div className="flex justify-between items-end mb-4">
            <div className="text-left">
              <span className="text-xs font-black text-slate-500 uppercase tracking-[0.3em] mb-1 block">
                Total Completado
              </span>
              <span className="text-5xl font-black text-slate-900">{completionPercent}%</span>
            </div>
            <div className="w-20 h-20 rounded-2xl bg-white border border-emerald-100 flex items-center justify-center text-emerald-600 shadow-sm">
              <GraduationCap size={40} />
            </div>
          </div>
          <div className="h-4 w-full bg-slate-200 rounded-full overflow-hidden p-1 border border-slate-300">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${completionPercent}%` }}
              transition={{ duration: 1.5, ease: "circOut" }}
              className="h-full bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full shadow-[0_0_15px_rgba(5,150,105,0.4)]"
            />
          </div>
        </div>
      </motion.div>

      {/* Retomar Jornada CTA */}
      {nextTrail && (
        <div className="w-full flex justify-center mb-24 relative z-10">
          <Link href={`/trilha/${nextTrail.id}`} className="group">
            <motion.div
              whileHover={{ scale: 1.02, y: -5 }}
              whileTap={{ scale: 0.98 }}
              className="flex flex-col md:flex-row items-center gap-8 bg-emerald-600 p-2 rounded-[2.5rem] pr-10 shadow-[0_20px_40px_rgba(5,150,105,0.2)] transition-all"
            >
              <div className="w-20 h-20 md:w-24 md:h-24 bg-white rounded-[2rem] flex items-center justify-center text-emerald-600 shadow-md">
                <Play size={40} className="ml-1" />
              </div>
              <div className="text-center md:text-left py-4">
                <span className="text-xs font-black text-emerald-100 uppercase tracking-[0.4em] mb-1 block">Retomar de onde parou</span>
                <h3 className="text-2xl md:text-3xl font-black text-white leading-none mb-1">{nextTrail.title}</h3>
                <div className="flex items-center gap-2 text-emerald-100/80 font-bold text-sm">
                  <span>Módulo {nextTrail.id}</span>
                  <div className="w-1 h-1 rounded-full bg-white/50" />
                  <span>{nextTrail.category}</span>
                </div>
              </div>
              <ArrowRight className="hidden md:block text-emerald-200 group-hover:text-white group-hover:translate-x-3 transition-all" size={32} />
            </motion.div>
          </Link>
        </div>
      )}

      {/* Categories & Trails Grid */}
      <div className="w-full flex flex-col gap-24 relative z-10">
        {Object.entries(trailsByCategory).map(([category, categoryTrails]) => (
          <section key={category} className="w-full">
            <div className="flex items-center gap-6 mb-12">
              <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tighter">{category}</h2>
              <div className="flex-1 h-px bg-gradient-to-r from-slate-300 to-transparent" />
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
              {categoryTrails.map((trail, index) => {
                const isLocked = !trail.isUnlocked;
                const isCompleted = trail.status === 'completed';

                return (
                  <motion.div
                    key={trail.id}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="h-full"
                  >
                    {isLocked ? (
                      <div className="glass-panel opacity-60 rounded-[3rem] p-10 h-full flex flex-col justify-center items-center text-center grayscale">
                        <div className="w-20 h-20 bg-slate-100 rounded-[2rem] mb-6 flex items-center justify-center text-slate-400">
                          <Lock size={40} />
                        </div>
                        <h3 className="text-2xl font-black text-slate-500 mb-2">Trilha {trail.id}</h3>
                        <p className="text-slate-500 font-medium">{trail.title}</p>
                      </div>
                    ) : (
                      <Link href={`/trilha/${trail.id}`} className="group block h-full">
                        <div className={`glass-panel rounded-[3rem] p-10 h-full flex flex-col justify-between transition-all duration-500 ${
                          isCompleted ? 'border-emerald-300 bg-emerald-50' : 'border-slate-200 hover:border-emerald-300'
                        }`}>
                          <div className="flex justify-between items-start mb-10">
                            <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-md transition-transform group-hover:scale-110 duration-500 ${
                              isCompleted ? 'bg-emerald-500 text-white' : 'bg-emerald-100 text-emerald-600'
                            }`}>
                              {isCompleted ? <CheckCircle2 size={32} /> : <Unlock size={32} />}
                            </div>
                            <span className="text-[10px] font-black text-slate-500 bg-slate-100 px-4 py-2 rounded-full uppercase tracking-widest border border-slate-200">
                              Módulo {trail.id}
                            </span>
                          </div>

                          <div>
                            <h3 className="text-3xl font-black text-slate-900 mb-6 group-hover:text-emerald-700 transition-colors leading-tight">
                              {trail.title}
                            </h3>
                            
                            <div className="flex flex-wrap gap-2">
                              {[
                                { label: 'Ouvir', done: trail.progress.ouvir },
                                { label: 'Estudar', done: trail.progress.estudar },
                                { label: 'Avaliar', done: trail.progress.avaliar }
                              ].map(step => (
                                <span key={step.label} className={`text-[10px] font-black uppercase tracking-widest px-3 py-1.5 rounded-lg transition-colors ${
                                  step.done ? 'bg-emerald-500 text-white' : 'bg-slate-100 text-slate-500'
                                }`}>
                                  {step.label}
                                </span>
                              ))}
                            </div>
                          </div>
                        </div>
                      </Link>
                    )}
                  </motion.div>
                );
              })}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
