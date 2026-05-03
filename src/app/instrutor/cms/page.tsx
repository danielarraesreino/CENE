"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Layers, 
  Plus, 
  Settings, 
  Video, 
  FileText, 
  Mic, 
  HelpCircle,
  GripVertical,
  ChevronRight,
  Eye,
  MoreHorizontal,
  UserCircle
} from "lucide-react";
import { useSession, signOut } from "next-auth/react";
import { toast } from "sonner";
import { TrailForm } from "@/components/cms/TrailForm";
import { CMSSettings } from "@/components/cms/CMSSettings";

export default function CMSDashboardPage() {
  const { data: session } = useSession();
  const [trails, setTrails] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [showSettings, setShowSettings] = useState(false);

  const fetchTrails = async () => {
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const res = await fetch(`${baseUrl}/api/content/cms/trails/`, {
        headers: {
          'Authorization': `Bearer ${session?.accessToken}`
        }
      });

      if (res.status === 401) {
        toast.error("Sessão expirada. Por favor, faça login novamente.");
        signOut({ callbackUrl: '/login' });
        return;
      }

      if (res.ok) {
        const data = await res.json();
        setTrails(data.results || data);
      } else {
        const err = await res.json();
        // Detectar erro específico de token inválido que aparece no log/toast do usuário
        if (err.code === "token_not_valid") {
          toast.error("Token de acesso inválido.");
          signOut({ callbackUrl: '/login' });
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session?.accessToken) {
      fetchTrails();
    }
  }, [session]);

  return (
    <div className="min-h-screen bg-slate-50 pt-24 pb-20 px-6 md:px-12 max-w-7xl mx-auto w-full">
      <AnimatePresence>
        {showForm && (
          <TrailForm 
            onClose={() => setShowForm(false)} 
            onSuccess={fetchTrails} 
            accessToken={session?.accessToken as string} 
          />
        )}
        {showSettings && (
          <CMSSettings 
            onClose={() => setShowSettings(false)} 
            accessToken={session?.accessToken as string} 
          />
        )}
      </AnimatePresence>

      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-16">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center text-white">
              <Layers size={20} />
            </div>
            <span className="text-slate-500 font-black tracking-widest uppercase text-xs">Sistema de Conteúdo</span>
          </div>
          <h1 className="text-5xl font-black text-slate-900 tracking-tighter">Estúdio de Trilhas</h1>
        </div>
        <div className="flex gap-4">
          <button 
            onClick={() => setShowSettings(true)}
            className="flex items-center gap-2 bg-white hover:bg-slate-50 text-slate-900 border border-slate-200 px-6 py-3 rounded-2xl font-bold transition-all"
          >
            <Settings size={20} />
            Configurações
          </button>
          <button 
            onClick={() => setShowForm(true)}
            className="flex items-center gap-2 bg-slate-900 hover:bg-black text-white px-6 py-3 rounded-2xl font-bold transition-all shadow-lg shadow-slate-200"
          >
            <Plus size={20} />
            Criar Nova Trilha
          </button>
        </div>
      </header>

      <div className="grid grid-cols-1 gap-8">
        {trails.map((trail: any) => (
          <motion.div 
            key={trail.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-[3rem] border border-slate-200 shadow-sm p-8 hover:border-emerald-200 transition-all group"
          >
            <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-8 mb-8">
              <div className="flex items-center gap-6">
                <div className="w-12 h-12 bg-slate-50 rounded-2xl flex items-center justify-center text-slate-400 group-hover:text-emerald-600 transition-colors">
                  <GripVertical size={24} />
                </div>
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="px-2 py-0.5 bg-slate-100 text-[10px] font-black uppercase tracking-widest rounded text-slate-500">
                      {trail.category}
                    </span>
                    {trail.is_premium && (
                      <span className="px-2 py-0.5 bg-amber-50 text-[10px] font-black uppercase tracking-widest rounded text-amber-600 border border-amber-100">
                        Premium
                      </span>
                    )}
                    {trail.author && (
                      <span className="flex items-center gap-1.5 px-2 py-0.5 bg-blue-50 text-[10px] font-black uppercase tracking-widest rounded text-blue-600 border border-blue-100">
                        <UserCircle size={12} />
                        Autor: {trail.author.username || "Admin"}
                      </span>
                    )}
                  </div>
                  <h3 className="text-2xl font-black text-slate-900">{trail.title}</h3>
                </div>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right mr-4">
                  <div className="text-xs font-black text-slate-400 uppercase tracking-widest">Aulas</div>
                  <div className="text-lg font-black text-slate-900">{trail.modules?.reduce((acc: number, m: any) => acc + (m.lessons?.length || 0), 0)}</div>
                </div>
                <button className="p-4 hover:bg-slate-50 rounded-2xl border border-slate-100 text-slate-400 hover:text-slate-600 transition-all">
                  <Eye size={20} />
                </button>
                <button className="flex items-center gap-2 bg-emerald-50 text-emerald-700 px-6 py-3 rounded-2xl font-bold hover:bg-emerald-100 transition-all">
                  Gerenciar Conteúdo
                  <ChevronRight size={18} />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {trail.modules?.map((module: any) => (
                <div key={module.id} className="bg-slate-50 rounded-[2rem] p-6 border border-slate-100">
                  <div className="flex justify-between items-center mb-4">
                    <span className="font-black text-slate-900 text-sm">{module.title}</span>
                    <MoreHorizontal size={16} className="text-slate-400" />
                  </div>
                  <div className="space-y-2">
                    {module.lessons?.map((lesson: any) => (
                      <div key={lesson.id} className="flex items-center gap-3 text-xs font-medium text-slate-500 bg-white p-3 rounded-xl border border-slate-100 shadow-sm">
                        {lesson.content_type === 'video' && <Video size={14} className="text-blue-500" />}
                        {lesson.content_type === 'text' && <FileText size={14} className="text-emerald-500" />}
                        {lesson.content_type === 'audio' && <Mic size={14} className="text-purple-500" />}
                        {lesson.content_type === 'quiz' && <HelpCircle size={14} className="text-orange-500" />}
                        <span className="truncate">{lesson.title}</span>
                      </div>
                    ))}
                    <button className="w-full py-2 border-2 border-dashed border-slate-200 rounded-xl text-slate-400 hover:border-slate-300 hover:text-slate-500 transition-all flex items-center justify-center gap-2 text-[10px] font-black uppercase tracking-widest">
                      <Plus size={14} />
                      Nova Aula
                    </button>
                  </div>
                </div>
              ))}
              <button className="bg-slate-50/50 rounded-[2rem] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center gap-4 py-8 hover:bg-slate-50 hover:border-slate-300 transition-all text-slate-400 group/btn">
                <Plus size={24} className="group-hover/btn:scale-110 transition-transform" />
                <span className="text-[10px] font-black uppercase tracking-widest">Adicionar Módulo</span>
              </button>
            </div>
          </motion.div>
        ))}

        {trails.length === 0 && !loading && (
          <div className="py-20 flex flex-col items-center justify-center bg-white rounded-[3rem] border border-dashed border-slate-300 text-slate-400">
            <Layers size={64} className="mb-6 opacity-20" />
            <h3 className="text-xl font-black text-slate-900 mb-2">Nenhuma trilha encontrada</h3>
            <p className="font-medium mb-8">Comece criando sua primeira trilha de aprendizado.</p>
            <button className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest hover:bg-black transition-all">Criar Primeira Trilha</button>
          </div>
        )}
      </div>
    </div>
  );
}
