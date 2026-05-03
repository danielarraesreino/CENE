"use client";

import { motion } from "framer-motion";
import { 
  Users, 
  Layers, 
  GraduationCap, 
  ArrowUpRight, 
  Activity, 
  Brain,
  MessageSquare,
  ShieldCheck,
  Settings
} from "lucide-react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { useInstructorStats } from "@/hooks/useInstructorStats";

export default function InstructorDashboard() {
  const { data: session } = useSession();
  const role = (session?.user as any)?.role;
  const { data: apiStats, isLoading, isError } = useInstructorStats();

  const stats = [
    { name: "Total de Pacientes", value: apiStats?.total_patients || 0, icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
    { name: "Trilhas Ativas", value: apiStats?.active_trails || 0, icon: Layers, color: "text-emerald-600", bg: "bg-emerald-50" },
    { name: "Aulas Criadas", value: apiStats?.created_lessons || 0, icon: Brain, color: "text-amber-600", bg: "bg-amber-50" },
    { name: "Logs de Hoje", value: apiStats?.today_logs || 0, icon: Activity, color: "text-rose-600", bg: "bg-rose-50" },
  ];

  const actions = [
    { 
      title: "Estúdio de Conteúdo", 
      desc: "Crie novas trilhas, módulos e aulas interativas.",
      link: "/instrutor/cms",
      icon: Layers,
      color: "bg-slate-900"
    },
    { 
      title: "Acompanhamento Clínico", 
      desc: "Visualize o progresso e baixe relatórios dos pacientes.",
      link: "/instrutor/pacientes",
      icon: Activity,
      color: "bg-emerald-600"
    },
    { 
      title: "Gestão de Equipe", 
      desc: role === 'admin' ? "Gerencie todos os profissionais do sistema." : "Gerencie seus psicólogos e atendentes.",
      link: "/instrutor/users",
      icon: Users,
      color: "bg-blue-600"
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-20 px-6 md:px-12 max-w-7xl mx-auto w-full">
      <header className="mb-16">
        <div className="flex items-center gap-3 mb-4">
          <div className="px-3 py-1 bg-emerald-100 text-emerald-700 text-[10px] font-black uppercase tracking-widest rounded-full border border-emerald-200">
            {role === 'admin' ? "Acesso Root Admin" : "Acesso Supervisor"}
          </div>
          <span className="text-slate-400 font-bold text-xs">Versão 2.4.0</span>
        </div>
        <h1 className="text-5xl font-black text-slate-900 tracking-tighter mb-4">
          Olá, {session?.user?.name || "Instrutor"}
        </h1>
        <p className="text-lg text-slate-600 font-medium max-w-2xl">
          Bem-vindo ao seu centro de comando. Aqui você gerencia o conhecimento e a saúde da sua rede.
        </p>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        {isLoading ? (
          // Skeleton Loading (Agente D)
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm animate-pulse">
              <div className="w-12 h-12 bg-slate-100 rounded-2xl mb-6"></div>
              <div className="h-3 w-24 bg-slate-100 rounded-full mb-3"></div>
              <div className="h-8 w-16 bg-slate-100 rounded-full"></div>
            </div>
          ))
        ) : isError ? (
          <div className="col-span-full p-6 bg-red-50 text-red-600 rounded-3xl border border-red-100 flex items-center justify-center">
            Não foi possível carregar as estatísticas da plataforma.
          </div>
        ) : (
          stats.map((stat, i) => (
            <motion.div 
              key={stat.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white p-8 rounded-[2.5rem] border border-slate-200 shadow-sm"
            >
              <div className={`w-12 h-12 ${stat.bg} ${stat.color} rounded-2xl flex items-center justify-center mb-6`}>
                <stat.icon size={24} />
              </div>
              <p className="text-slate-500 font-black uppercase tracking-widest text-[10px] mb-1">{stat.name}</p>
              <h4 className="text-3xl font-black text-slate-900">{stat.value}</h4>
            </motion.div>
          ))
        )}
      </div>

      {/* Quick Actions */}
      <h2 className="text-2xl font-black text-slate-900 mb-8 flex items-center gap-3">
        <ShieldCheck className="text-emerald-600" />
        Painel de Gestão
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
        {actions.map((action, i) => (
          <motion.div
            key={action.title}
            whileHover={{ y: -8 }}
            className="group"
          >
            <Link href={action.link}>
              <div className="bg-white p-10 rounded-[3.5rem] border border-slate-200 shadow-sm h-full flex flex-col hover:border-emerald-500 transition-all cursor-pointer">
                <div className={`w-14 h-14 ${action.color} text-white rounded-2xl flex items-center justify-center mb-8 shadow-lg shadow-slate-200 group-hover:scale-110 transition-transform`}>
                  <action.icon size={28} />
                </div>
                <h3 className="text-2xl font-black text-slate-900 mb-4">{action.title}</h3>
                <p className="text-slate-500 font-medium mb-8 flex-1">{action.desc}</p>
                <div className="flex items-center gap-2 text-slate-900 font-black text-xs uppercase tracking-widest group-hover:text-emerald-600 transition-colors">
                  Acessar Ferramenta
                  <ArrowUpRight size={16} />
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>

      {/* Admin Only Section */}
      {role === 'admin' && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="mb-16 bg-slate-900 rounded-[3.5rem] p-12 border border-slate-800 shadow-2xl relative overflow-hidden"
        >
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center text-white">
                <Settings size={20} />
              </div>
              <h2 className="text-3xl font-black text-white">Configurações de Infraestrutura</h2>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="bg-slate-800/50 p-8 rounded-3xl border border-slate-700 hover:border-emerald-500 transition-all">
                <p className="text-slate-400 font-black uppercase tracking-widest text-[10px] mb-4">Monitoramento Sentry</p>
                <div className="flex items-center justify-between">
                  <span className="text-white font-bold">Status da API</span>
                  <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-full text-[10px] font-black uppercase tracking-widest border border-emerald-500/30">Saudável</span>
                </div>
              </div>
              <div className="bg-slate-800/50 p-8 rounded-3xl border border-slate-700 hover:border-emerald-500 transition-all">
                <p className="text-slate-400 font-black uppercase tracking-widest text-[10px] mb-4">Base de Dados</p>
                <div className="flex items-center justify-between">
                  <span className="text-white font-bold">Backups Diários</span>
                  <span className="px-3 py-1 bg-blue-500/20 text-blue-400 rounded-full text-[10px] font-black uppercase tracking-widest border border-blue-500/30">Ativo</span>
                </div>
              </div>
              <div className="bg-slate-800/50 p-8 rounded-3xl border border-slate-700 hover:border-emerald-500 transition-all">
                <p className="text-slate-400 font-black uppercase tracking-widest text-[10px] mb-4">Segurança RAG</p>
                <div className="flex items-center justify-between">
                  <span className="text-white font-bold">Criptografia AES-256</span>
                  <span className="px-3 py-1 bg-purple-500/20 text-purple-400 rounded-full text-[10px] font-black uppercase tracking-widest border border-purple-500/30">Habilitada</span>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Activity Feed */}
      <div className="bg-white rounded-[4rem] p-12 border border-slate-200 relative overflow-hidden shadow-sm">
        <div className="relative z-10">
          <h2 className="text-3xl font-black mb-4">Atualizações da Plataforma</h2>
          <p className="text-slate-400 font-medium mb-8 max-w-xl">
            Acabamos de liberar o sistema de exportação de PDFs para psicólogos. Agora você pode extrair relatórios completos de RPD e Humor em um clique.
          </p>
          <button className="bg-white text-slate-900 px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-emerald-400 transition-all">
            Ver Changelog
          </button>
        </div>
        <div className="absolute top-0 right-0 p-12 opacity-10">
          <Activity size={200} />
        </div>
      </div>
    </div>
  );
}
