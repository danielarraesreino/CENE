"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { 
  Phone, 
  AlertTriangle, 
  ShieldCheck, 
  MessageSquare, 
  ArrowLeft, 
  HeartPulse,
  Wind
} from "lucide-react";

export default function SOSPage() {
  return (
    <div className="min-h-screen bg-slate-900 pt-24 pb-20 px-6 md:px-12 w-full relative overflow-hidden flex flex-col items-center justify-center">
      {/* Urgency Background Glows */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-red-600/10 rounded-full blur-[150px] animate-pulse" />
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-amber-500/10 rounded-full blur-[100px]" />
      </div>

      <div className="max-w-4xl w-full relative z-10">
        {/* Header */}
        <header className="mb-12 text-center flex flex-col items-center">
          <Link 
            href="/portal/paciente" 
            className="absolute top-0 left-0 flex items-center gap-2 text-slate-400 hover:text-white transition-colors uppercase text-xs font-black tracking-widest"
          >
            <ArrowLeft size={16} />
            Voltar
          </Link>
          
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: "spring", bounce: 0.5 }}
            className="w-24 h-24 bg-red-500/20 border border-red-500/30 rounded-full flex items-center justify-center text-red-500 mb-6 shadow-[0_0_50px_rgba(239,68,68,0.3)]"
          >
            <AlertTriangle size={48} />
          </motion.div>
          
          <h1 className="text-4xl md:text-6xl font-black text-white tracking-tighter mb-4">
            Você não está sozinho.
          </h1>
          <p className="text-xl text-slate-300 max-w-2xl font-medium">
            Respira fundo. A vontade intensa é como uma onda: ela atinge um pico, mas sempre passa. Estamos aqui para ajudar você a atravessá-la.
          </p>
        </header>

        {/* Emergency Contacts */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <motion.a
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            href="tel:188"
            className="group glass-panel p-8 rounded-[2rem] border border-red-500/30 bg-red-500/10 hover:bg-red-500/20 transition-all flex flex-col items-center text-center cursor-pointer"
          >
            <div className="w-16 h-16 bg-red-500 text-white rounded-2xl flex items-center justify-center mb-6 shadow-xl group-hover:scale-110 transition-transform">
              <Phone size={32} />
            </div>
            <h3 className="text-3xl font-black text-white mb-2">Ligue 188</h3>
            <p className="text-red-200 font-medium mb-4">CVV - Centro de Valorização da Vida</p>
            <span className="text-[10px] uppercase tracking-widest font-black text-red-400 bg-red-500/20 px-4 py-2 rounded-full">
              Atendimento 24h • Sigiloso
            </span>
          </motion.a>

          <motion.a
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            href="tel:192"
            className="group glass-panel p-8 rounded-[2rem] border border-amber-500/30 bg-amber-500/10 hover:bg-amber-500/20 transition-all flex flex-col items-center text-center cursor-pointer"
          >
            <div className="w-16 h-16 bg-amber-500 text-white rounded-2xl flex items-center justify-center mb-6 shadow-xl group-hover:scale-110 transition-transform">
              <HeartPulse size={32} />
            </div>
            <h3 className="text-3xl font-black text-white mb-2">Ligue 192</h3>
            <p className="text-amber-200 font-medium mb-4">SAMU - Emergência Médica</p>
            <span className="text-[10px] uppercase tracking-widest font-black text-amber-400 bg-amber-500/20 px-4 py-2 rounded-full">
              Risco iminente à vida
            </span>
          </motion.a>
        </div>

        {/* Clinical Tools Links */}
        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="glass-panel p-8 md:p-12 rounded-[3rem] border border-slate-700 bg-slate-800/50"
        >
          <h3 className="text-2xl font-black text-white mb-8 text-center flex items-center justify-center gap-3">
            <ShieldCheck className="text-emerald-500" />
            Recursos Imediatos
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link 
              href="/portal/paciente/clinical/safety-plan"
              className="flex items-center gap-4 bg-slate-800 hover:bg-slate-700 p-6 rounded-2xl border border-slate-700 transition-all group"
            >
              <div className="w-12 h-12 bg-emerald-500/20 text-emerald-400 rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <ShieldCheck size={24} />
              </div>
              <div>
                <h4 className="text-white font-bold text-lg leading-tight mb-1">Meu Plano de Segurança</h4>
                <p className="text-slate-400 text-sm">Leia as estratégias que você mesmo preparou para momentos difíceis.</p>
              </div>
            </Link>

            <Link 
              href="/chat"
              className="flex items-center gap-4 bg-slate-800 hover:bg-slate-700 p-6 rounded-2xl border border-slate-700 transition-all group"
            >
              <div className="w-12 h-12 bg-brand-cyan/20 text-brand-cyan rounded-xl flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <MessageSquare size={24} />
              </div>
              <div>
                <h4 className="text-white font-bold text-lg leading-tight mb-1">Conversar com o Copilot</h4>
                <p className="text-slate-400 text-sm">A Inteligência Artificial está pronta para ouvir você sem julgamentos.</p>
              </div>
            </Link>
          </div>
        </motion.div>

        {/* Grounding Exercise */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
          className="mt-16 text-center"
        >
          <Wind className="mx-auto text-slate-500 mb-4 animate-pulse" size={32} />
          <p className="text-slate-400 text-sm uppercase tracking-[0.3em] font-black">
            Técnica de Aterramento 5-4-3-2-1
          </p>
          <p className="text-slate-500 mt-2 text-sm max-w-lg mx-auto">
            Olhe ao redor e nomeie mentalmente: 5 coisas que você pode <strong>ver</strong>, 4 coisas que você pode <strong>tocar</strong>, 3 coisas que você pode <strong>ouvir</strong>, 2 coisas que você pode <strong>cheirar</strong>, 1 coisa que você pode <strong>saborear</strong>.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
