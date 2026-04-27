"use client";

import { motion } from "framer-motion";
import { 
  Brain, 
  Activity, 
  Target, 
  Calendar, 
  ShieldAlert, 
  BookHeart,
  ArrowRight,
  Sparkles,
  ChevronRight
} from "lucide-react";
import Link from "next/link";

const tools = [
  {
    id: "rpd",
    title: "Registro de Pensamentos (RPD)",
    description: "Identifique e reestruture pensamentos disfuncionais que disparam o estresse.",
    icon: Brain,
    path: "/portal/paciente/clinical/rpd",
    color: "text-emerald-600",
    bg: "bg-emerald-100",
    border: "border-emerald-200"
  },
  {
    id: "mood",
    title: "Check-in de Humor",
    description: "Monitore sua estabilidade emocional diária para prevenir recaídas emocionais.",
    icon: Activity,
    path: "/portal/paciente/clinical/mood",
    color: "text-emerald-500",
    bg: "bg-emerald-50",
    border: "border-emerald-200"
  },
  {
    id: "goals",
    title: "Metas e Valores",
    description: "Alinhe suas ações diárias com seus valores fundamentais de vida.",
    icon: Target,
    path: "/portal/paciente/clinical/goals",
    color: "text-emerald-700",
    bg: "bg-emerald-50",
    border: "border-emerald-300"
  },
  {
    id: "triggers",
    title: "Diário de Gatilhos",
    description: "Mapeie situações de risco e desenvolva estratégias de enfrentamento.",
    icon: Calendar,
    path: "/portal/paciente/clinical/triggers",
    color: "text-amber-600",
    bg: "bg-amber-50",
    border: "border-amber-200"
  },
  {
    id: "safety-plan",
    title: "Plano de Segurança",
    description: "Seu protocolo de emergência para momentos de crise intensa.",
    icon: ShieldAlert,
    path: "/portal/paciente/clinical/safety-plan",
    color: "text-red-600",
    bg: "bg-red-50",
    border: "border-red-200"
  },
  {
    id: "journal",
    title: "Diário Clínico",
    description: "Espaço livre para reflexão e registro da sua jornada de desenvolvimento.",
    icon: BookHeart,
    path: "/portal/paciente/clinical/journal",
    color: "text-emerald-500",
    bg: "bg-emerald-50",
    border: "border-emerald-200"
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "circOut" as const,
    },
  },
};

export default function ClinicalHubPage() {
  return (
    <div className="min-h-screen pt-24 pb-20 px-6 md:px-12 max-w-7xl mx-auto w-full">
      {/* Background Decor */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden">
        <div className="absolute -top-24 -right-24 w-[500px] h-[500px] bg-emerald-500/5 rounded-full blur-[100px]" />
        <div className="absolute top-1/2 -left-24 w-[500px] h-[500px] bg-emerald-600/5 rounded-full blur-[100px]" />
      </div>

      <header className="mb-20 relative z-10">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3 mb-8"
        >
          <div className="w-10 h-10 bg-emerald-100 rounded-xl flex items-center justify-center text-emerald-700 border border-emerald-200">
            <Sparkles size={20} />
          </div>
          <span className="text-emerald-700 font-black tracking-[0.2em] uppercase text-xs">Arsenal Especializado</span>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-5xl md:text-7xl font-black text-slate-900 mb-8 leading-[0.95] tracking-tighter"
        >
          Ferramentas de <br />
          <span className="text-gradient">Especialização</span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="text-xl md:text-2xl text-slate-600 max-w-3xl leading-relaxed"
        >
          O conhecimento não acontece por acaso, mas sim por ferramentas aplicadas com consistência. 
          Escolha o foco do seu trabalho hoje.
        </motion.p>
      </header>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10"
      >
        {tools.map((tool) => {
          const Icon = tool.icon;
          return (
            <motion.div key={tool.id} variants={cardVariants}>
              <Link href={tool.path} className="group block h-full">
                <div className={`glass-panel rounded-[3rem] p-10 h-full flex flex-col justify-between border ${tool.border} hover:border-opacity-60 transition-all duration-500`}>
                  <div>
                    <div className={`w-16 h-16 ${tool.bg} ${tool.color} rounded-[24px] flex items-center justify-center mb-8 shadow-2xl group-hover:scale-110 transition-transform duration-500`}>
                      <Icon size={32} />
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 mb-4 group-hover:text-emerald-600 transition-colors leading-tight">
                      {tool.title}
                    </h3>
                    <p className="text-slate-600 text-base leading-relaxed mb-8 flex-1">
                      {tool.description}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-3 text-slate-500 font-bold text-sm uppercase tracking-widest group-hover:gap-5 group-hover:text-emerald-700 transition-all">
                    Acessar Ferramenta
                    <div className="w-10 h-10 bg-slate-100 rounded-full flex items-center justify-center border border-slate-200 group-hover:bg-emerald-600 group-hover:text-white group-hover:border-emerald-600 transition-all">
                      <ChevronRight size={20} />
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          );
        })}
      </motion.div>

      {/* SOS Banner */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="mt-24 glass-panel p-10 rounded-[3rem] flex flex-col md:flex-row items-center justify-between gap-8 border-red-100 bg-red-50 relative z-10"
      >
        <div className="text-center md:text-left">
          <h2 className="text-3xl font-black text-slate-900 mb-2 tracking-tighter">Precisa de ajuda imediata?</h2>
          <p className="text-slate-600 text-lg">Se você está enfrentando uma crise intensa agora, use o botão SOS.</p>
        </div>
        <Link href="/portal/paciente/sos">
          <button className="bg-red-500 hover:bg-red-600 text-white px-10 py-5 rounded-full font-black uppercase tracking-widest text-sm shadow-[0_10px_40px_rgba(239,68,68,0.3)] transition-all active:scale-95 flex items-center gap-3 group">
            <ShieldAlert size={20} className="group-hover:animate-shake" />
            Entrar em Modo SOS
          </button>
        </Link>
      </motion.div>
    </div>
  );
}
