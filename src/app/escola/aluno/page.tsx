"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { useSession } from "next-auth/react";
import {
  Brain,
  Users,
  MessageCircleHeart,
  ShieldCheck,
  BookOpen,
  GraduationCap,
  Sparkles,
  ArrowRight,
  Lock,
  Clock,
} from "lucide-react";

// Currículo baseado na "escada de produtos" do Instituto Padre Haroldo / FEBRACT
const courses = [
  {
    id: "neurobiologia",
    title: "Neurobiologia da Dependência",
    subtitle: "Módulo 1 · Fundamentos",
    description:
      "Compreenda os mecanismos neurobiológicos do vício: circuitos de recompensa dopaminérgicos, memória implícita do trauma e plasticidade cerebral na recuperação.",
    icon: Brain,
    color: "text-brand-cyan",
    bg: "bg-brand-cyan/10",
    border: "border-brand-cyan/20",
    duration: "4h 30min",
    isAvailable: true,
  },
  {
    id: "tcc-tus",
    title: "TCC Aplicada aos TUS",
    subtitle: "Módulo 2 · Intervenção Clínica",
    description:
      "Protocolos de Terapia Cognitivo-Comportamental para Transtornos de Uso de Substâncias: identificação de crenças centrais, RPD avançado e reestruturação cognitiva.",
    icon: MessageCircleHeart,
    color: "text-brand-accent",
    bg: "bg-brand-accent/10",
    border: "border-brand-accent/20",
    duration: "6h 00min",
    isAvailable: true,
  },
  {
    id: "entrevista-motivacional",
    title: "Entrevista Motivacional",
    subtitle: "Módulo 3 · Habilidades Terapêuticas",
    description:
      "Técnicas de Entrevista Motivacional (Miller & Rollnick) adaptadas ao contexto da dependência química: estágios de mudança, reflexão empática e desenvolvimento da discrepância.",
    icon: Users,
    color: "text-green-400",
    bg: "bg-green-400/10",
    border: "border-green-400/20",
    duration: "5h 15min",
    isAvailable: true,
  },
  {
    id: "manejo-crise",
    title: "Manejo de Crises e Recaída",
    subtitle: "Módulo 4 · Intervenção em Crise",
    description:
      "Protocolos de resposta imediata a crises: avaliação de risco, Plano de Segurança colaborativo, manejo do Efeito de Violação da Abstinência (EVA) e protocolo pós-recaída.",
    icon: ShieldCheck,
    color: "text-yellow-400",
    bg: "bg-yellow-400/10",
    border: "border-yellow-400/20",
    duration: "3h 45min",
    isAvailable: false,
  },
  {
    id: "comunidades-terapeuticas",
    title: "Gestão de Comunidades Terapêuticas",
    subtitle: "Módulo 5 · Liderança Clínica",
    description:
      "Modelo FEBRACT de gestão: estrutura de equipes multidisciplinares, protocolos de admissão e alta, manejo de vínculos terapêuticos e prevenção de burnout em equipes.",
    icon: GraduationCap,
    color: "text-pink-400",
    bg: "bg-pink-400/10",
    border: "border-pink-400/20",
    duration: "8h 00min",
    isAvailable: false,
  },
  {
    id: "familia-tus",
    title: "Família e Dependência Química",
    subtitle: "Módulo 6 · Psicoeducação Familiar",
    description:
      "Dinâmicas familiares na dependência: codependência, papéis disfuncionais, intervenção familiar sistêmica e construção de rede de suporte comprometida com a recuperação.",
    icon: BookOpen,
    color: "text-orange-400",
    bg: "bg-orange-400/10",
    border: "border-orange-400/20",
    duration: "4h 00min",
    isAvailable: false,
  },
];

import { EducationalLayout } from "@/components/layout/EducationalLayout";

// ... (courses definition stays the same)

export default function AlunoPage() {
  const { data: session } = useSession();

  return (
    <EducationalLayout>
      <div className="py-20 px-6 md:px-12 max-w-7xl mx-auto w-full">
        {/* Background Glows */}
        <div className="fixed inset-0 pointer-events-none">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-brand-accent/5 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-brand-cyan/5 rounded-full blur-[120px] translate-y-1/2 -translate-x-1/2" />
        </div>

        {/* Header */}
        <header className="mb-20 relative z-10">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3 mb-8"
          >
            <div className="w-12 h-12 bg-brand-accent/10 backdrop-blur-xl rounded-2xl border border-brand-accent/20 flex items-center justify-center text-brand-accent shadow-2xl">
              <GraduationCap size={24} />
            </div>
            <span className="text-brand-accent font-black tracking-[0.2em] uppercase text-xs">
              Escola de Especialização
            </span>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-brand-cyan/10 border border-brand-cyan/20 rounded-full text-brand-cyan text-xs font-black uppercase tracking-widest mb-8"
          >
            <Sparkles size={14} />
            Instituto Padre Haroldo · Legado FEBRACT
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="text-5xl md:text-7xl font-black text-white mb-8 leading-[0.95] tracking-tighter"
          >
            Formação em <br />
            <span className="text-gradient">Dependência Química</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl md:text-2xl text-slate-400 max-w-3xl leading-relaxed"
          >
            Olá, {session?.user?.name?.split(" ")[0] || "Profissional"}. Aqui você
            aprofunda o conhecimento técnico para conduzir processos terapêuticos
            com autoridade clínica e profunda humanidade.
          </motion.p>
        </header>

        {/* Progresso Rápido */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20 relative z-10"
        >
          {[
            { label: "Módulos Disponíveis", value: "3", color: "text-brand-cyan" },
            { label: "Horas de Formação", value: "15h+", color: "text-brand-accent" },
            { label: "Certificados Disponíveis", value: "1", color: "text-green-400" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="glass-panel p-8 rounded-[2.5rem] text-center border border-white/5"
            >
              <div className={`text-4xl font-black ${stat.color} mb-2`}>
                {stat.value}
              </div>
              <div className="text-xs font-black text-slate-500 uppercase tracking-widest">
                {stat.label}
              </div>
            </div>
          ))}
        </motion.div>

        {/* Grade de Cursos */}
        <section className="relative z-10">
          <div className="flex items-center gap-6 mb-12">
            <h2 className="text-3xl md:text-4xl font-black text-white tracking-tighter">
              Trilha de Especialização
            </h2>
            <div className="flex-1 h-px bg-gradient-to-r from-white/20 to-transparent" />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {courses.map((course, index) => {
              const Icon = course.icon;
              return (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.08 }}
                >
                  {course.isAvailable ? (
                    <Link
                      href={`/cursos/${course.id}`}
                      className="group block h-full"
                    >
                      <div
                        className={`glass-panel rounded-[3rem] p-10 h-full flex flex-col justify-between border ${course.border} hover:border-opacity-60 transition-all duration-500`}
                      >
                        <div>
                          <div
                            className={`w-16 h-16 ${course.bg} ${course.color} rounded-[24px] flex items-center justify-center mb-8 shadow-2xl group-hover:scale-110 transition-transform duration-500`}
                          >
                            <Icon size={32} />
                          </div>
                          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-500 mb-2 block">
                            {course.subtitle}
                          </span>
                          <h3 className="text-2xl font-black text-white mb-4 group-hover:text-brand-cyan transition-colors leading-tight">
                            {course.title}
                          </h3>
                          <p className="text-slate-400 text-base leading-relaxed mb-8 flex-1">
                            {course.description}
                          </p>
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2 text-slate-500 text-xs font-bold">
                            <Clock size={14} />
                            {course.duration}
                          </div>
                          <div className="flex items-center gap-3 text-white font-bold text-sm uppercase tracking-widest group-hover:gap-5 transition-all">
                            Iniciar
                            <div className="w-10 h-10 bg-white/5 rounded-full flex items-center justify-center border border-white/10 group-hover:bg-brand-cyan group-hover:text-black group-hover:border-brand-cyan transition-all">
                              <ArrowRight size={20} />
                            </div>
                          </div>
                        </div>
                      </div>
                    </Link>
                  ) : (
                    <div className="glass-panel rounded-[3rem] p-10 h-full flex flex-col justify-between opacity-50 grayscale border border-white/5">
                      <div>
                        <div className="w-16 h-16 bg-white/5 rounded-[24px] flex items-center justify-center mb-8">
                          <Lock size={32} className="text-slate-600" />
                        </div>
                        <span className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-600 mb-2 block">
                          {course.subtitle}
                        </span>
                        <h3 className="text-2xl font-black text-slate-500 mb-4 leading-tight">
                          {course.title}
                        </h3>
                        <p className="text-slate-600 text-base leading-relaxed">
                          {course.description}
                        </p>
                      </div>
                      <div className="flex items-center gap-2 text-slate-600 text-xs font-bold mt-8">
                        <Clock size={14} />
                        {course.duration} · Em breve
                      </div>
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </section>

        {/* Banner Instituto Padre Haroldo */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-24 glass-panel p-12 rounded-[3rem] flex flex-col md:flex-row items-center justify-between gap-8 border-brand-accent/20 bg-brand-accent/5 relative z-10"
        >
          <div className="text-center md:text-left max-w-2xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-brand-accent/10 border border-brand-accent/20 rounded-full text-brand-accent text-xs font-black uppercase tracking-widest mb-6">
              <Sparkles size={14} />
              Legado que transforma
            </div>
            <h2 className="text-3xl font-black text-white mb-4">
              Formação com Propósito
            </h2>
            <p className="text-slate-400 text-lg leading-relaxed">
              Esta escola é a continuação digital do trabalho iniciado pelo Instituto
              Padre Haroldo. Cada módulo carrega décadas de experiência clínica com
              populações em vulnerabilidade, traduzidas em conhecimento técnico
              rigoroso e humanidade irredutível.
            </p>
          </div>
          <div className="flex flex-col items-center gap-4 shrink-0">
            <div className="w-24 h-24 bg-brand-accent/20 rounded-3xl flex items-center justify-center border border-brand-accent/30">
              <GraduationCap size={48} className="text-brand-accent" />
            </div>
            <span className="text-brand-accent font-black text-sm uppercase tracking-widest text-center">
              FEBRACT · REIBB
            </span>
          </div>
        </motion.div>
      </div>
    </EducationalLayout>
  );
}
