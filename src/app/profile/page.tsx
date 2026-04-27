"use client";

import { useSession, signOut } from "next-auth/react";
import { motion } from "framer-motion";
import { 
  User as UserIcon, 
  Mail, 
  Calendar, 
  ShieldCheck, 
  LogOut, 
  Settings,
  ChevronLeft
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function ProfilePage() {
  const { data: session } = useSession();
  const router = useRouter();

  if (!session) return null;

  return (
    <div className="min-h-screen p-8 md:p-12 max-w-4xl mx-auto w-full">
      <button
        onClick={() => router.back()}
        className="text-slate-400 hover:text-emerald-600 flex items-center gap-2 transition-colors mb-8"
      >
        <ChevronLeft size={20} />
        Voltar
      </button>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel p-8 md:p-12 rounded-[40px] border border-slate-200 relative overflow-hidden"
      >
        {/* Background Decor */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/5 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2" />

        <div className="flex flex-col md:flex-row items-center gap-10 relative z-10">
          <div className="w-32 h-32 rounded-[32px] bg-gradient-to-br from-emerald-400 to-emerald-600 flex items-center justify-center text-white shadow-2xl shadow-emerald-900/10">
            <UserIcon size={64} />
          </div>

          <div className="flex-1 text-center md:text-left">
            <h1 className="text-4xl font-black text-slate-900 mb-2">{session.user?.name}</h1>
            <div className="flex flex-wrap justify-center md:justify-start gap-4">
              <div className="flex items-center gap-2 text-slate-600 bg-slate-50 px-4 py-2 rounded-full border border-slate-100">
                <Mail size={16} className="text-emerald-600" />
                <span className="text-sm">{session.user?.email}</span>
              </div>
              <div className="flex items-center gap-2 text-slate-600 bg-slate-50 px-4 py-2 rounded-full border border-slate-100">
                <ShieldCheck size={16} className="text-emerald-500" />
                <span className="text-sm font-bold uppercase tracking-widest text-[10px]">Conta Ativa</span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-12 pt-12 border-t border-slate-100">
          <button className="flex items-center justify-between p-6 rounded-3xl bg-slate-50 border border-slate-100 hover:border-emerald-200 transition-all group">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-white rounded-2xl text-slate-400 group-hover:text-emerald-600 shadow-sm transition-colors">
                <Settings size={24} />
              </div>
              <div className="text-left">
                <div className="text-slate-900 font-bold">Configurações</div>
                <div className="text-xs text-slate-500">Privacidade, Notificações, Tema</div>
              </div>
            </div>
          </button>

          <button 
            onClick={() => signOut({ callbackUrl: '/login' })}
            className="flex items-center justify-between p-6 rounded-3xl bg-red-500/5 border border-red-500/10 hover:bg-red-500/10 transition-all group"
          >
            <div className="flex items-center gap-4">
              <div className="p-3 bg-red-500/10 rounded-2xl text-red-400">
                <LogOut size={24} />
              </div>
              <div className="text-left">
                <div className="text-red-400 font-bold">Encerrar Sessão</div>
                <div className="text-xs text-red-900/50 uppercase font-black tracking-widest">Logout Seguro</div>
              </div>
            </div>
          </button>
        </div>
      </motion.div>

      <div className="mt-8 text-center">
        <p className="text-slate-400 text-xs font-bold uppercase tracking-[0.2em]">
          Portal CENE &copy; 2026 · Versão 1.2.0-specialization
        </p>
      </div>
    </div>
  );
}
