"use client";

import { motion } from "framer-motion";
import { 
  Brain, 
  Activity, 
  Target, 
  Calendar, 
  ShieldAlert, 
  BookHeart,
  Sparkles,
  ChevronRight,
  ArrowRight
} from "lucide-react";
import Link from "next/link";

import { ClinicalLayout } from "@/components/layout/ClinicalLayout";
import { ClinicalCard } from "@/components/clinical/ui/ClinicalCard";
import { ClinicalButton } from "@/components/clinical/ui/ClinicalButton";

const tools = [
  {
    id: "rpd",
    title: "Registro de Pensamentos",
    description: "Identifique e reestruture pensamentos disfuncionais que disparam o estresse.",
    icon: Brain,
    path: "/portal/paciente/clinical/rpd",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    border: "border-emerald-100"
  },
  {
    id: "mood",
    title: "Check-in de Humor",
    description: "Monitore sua estabilidade emocional diária para prevenir recaídas.",
    icon: Activity,
    path: "/portal/paciente/clinical/mood",
    color: "text-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-100"
  },
  {
    id: "goals",
    title: "Metas e Valores",
    description: "Alinhe suas ações diárias com seus valores fundamentais de vida.",
    icon: Target,
    path: "/portal/paciente/clinical/goals",
    color: "text-orange-600",
    bg: "bg-orange-50",
    border: "border-orange-100"
  },
  {
    id: "triggers",
    title: "Diário de Gatilhos",
    description: "Mapeie situações de risco e desenvolva estratégias de enfrentamento.",
    icon: Calendar,
    path: "/portal/paciente/clinical/triggers",
    color: "text-rose-600",
    bg: "bg-rose-50",
    border: "border-rose-100"
  },
  {
    id: "safety-plan",
    title: "Plano de Segurança",
    description: "Seu protocolo de emergência para momentos de crise intensa.",
    icon: ShieldAlert,
    path: "/portal/paciente/clinical/safety-plan",
    color: "text-red-600",
    bg: "bg-red-50",
    border: "border-red-100"
  },
  {
    id: "journal",
    title: "Diário Clínico",
    description: "Espaço livre para reflexão e registro da sua jornada de desenvolvimento.",
    icon: BookHeart,
    path: "/portal/paciente/clinical/journal",
    color: "text-emerald-700",
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
      duration: 0.5,
      ease: "easeOut",
    },
  },
} as const;

export default function ClinicalHubPage() {
  return (
    <ClinicalLayout containerClassName="max-w-7xl pt-12 md:pt-20">
      <header className="mb-20">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-3 mb-8"
        >
          <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-600 border border-emerald-100 shadow-sm">
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
          <span className="bg-gradient-to-r from-emerald-600 to-blue-600 bg-clip-text text-transparent">Especialização</span>
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="text-xl md:text-2xl text-slate-600 max-w-3xl leading-relaxed font-medium"
        >
          O autoconhecimento é construído com consistência. 
          Escolha o foco do seu trabalho clínico hoje.
        </motion.p>
      </header>

      <motion.div 
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24"
      >
        {tools.map((tool) => {
          const Icon = tool.icon;
          return (
            <motion.div key={tool.id} variants={cardVariants} className="h-full">
              <Link href={tool.path} className="group block h-full">
                <ClinicalCard 
                  className={`h-full flex flex-col justify-between border-2 border-transparent group-hover:border-slate-100 group-hover:shadow-2xl transition-all duration-500 p-10 rounded-[3rem] bg-white`}
                >
                  <div>
                    <div className={`w-16 h-16 ${tool.bg} ${tool.color} rounded-[24px] flex items-center justify-center mb-8 shadow-sm group-hover:scale-110 group-hover:rotate-3 transition-all duration-500`}>
                      <Icon size={32} />
                    </div>
                    <h3 className="text-2xl font-black text-slate-900 mb-4 group-hover:text-emerald-600 transition-colors leading-tight">
                      {tool.title}
                    </h3>
                    <p className="text-slate-500 text-base leading-relaxed mb-10 font-medium">
                      {tool.description}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-4 text-slate-400 font-black text-[10px] uppercase tracking-widest group-hover:text-emerald-600 transition-all">
                    Acessar Ferramenta
                    <div className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center border border-slate-100 group-hover:bg-emerald-600 group-hover:text-white group-hover:border-emerald-600 group-hover:translate-x-2 transition-all">
                      <ChevronRight size={20} />
                    </div>
                  </div>
                </ClinicalCard>
              </Link>
            </motion.div>
          );
        })}
      </motion.div>

      {/* SOS Section */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="relative group"
      >
        <div className="absolute inset-0 bg-red-600 rounded-[3rem] blur-2xl opacity-5 group-hover:opacity-10 transition-opacity" />
        <ClinicalCard className="relative bg-red-50 border-2 border-red-100 p-10 md:p-12 rounded-[3.5rem] flex flex-col md:flex-row items-center justify-between gap-10">
          <div className="text-center md:text-left flex-1">
            <div className="flex items-center justify-center md:justify-start gap-3 mb-4">
              <ShieldAlert className="text-red-600" size={32} />
              <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tighter">Precisa de ajuda agora?</h2>
            </div>
            <p className="text-slate-600 text-lg md:text-xl font-medium max-w-xl">
              Se você está enfrentando uma crise intensa ou pensamentos de risco, use o modo SOS para assistência imediata.
            </p>
          </div>
          <Link href="/portal/paciente/sos">
            <ClinicalButton 
              variant="outline"
              className="bg-red-600 hover:bg-red-700 text-white border-red-600 px-12 py-6 rounded-full text-lg shadow-xl shadow-red-200"
              icon={<ArrowRight size={24} />}
            >
              ATIVAR MODO SOS
            </ClinicalButton>
          </Link>
        </ClinicalCard>
      </motion.div>
    </ClinicalLayout>
  );
}
