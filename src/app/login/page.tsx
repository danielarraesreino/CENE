"use client";

import { Suspense, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { Lock, User, CheckCircle2, Sparkles, ShieldCheck } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isRegistered = searchParams.get("registered") === "true";
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const res = await signIn("credentials", {
      redirect: false,
      username,
      password,
    });

    if (res?.error) {
      setError("Credenciais inválidas. Tente novamente.");
      setLoading(false);
    } else {
      router.push("/hub");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
      {/* Dynamic Background */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-brand-cyan/10 rounded-full blur-[120px]" 
        />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel p-10 md:p-14 rounded-[3.5rem] w-full max-w-xl relative z-10 border-slate-200 shadow-2xl shadow-emerald-900/5"
      >
        <div className="flex flex-col items-center mb-12">
          <div className="w-20 h-20 bg-emerald-100 rounded-3xl flex items-center justify-center text-emerald-600 mb-6 shadow-xl shadow-emerald-900/10">
            <ShieldCheck size={48} />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tighter">Portal <span className="text-gradient">CENE</span></h1>
          <p className="text-xl text-slate-600 text-center font-medium">Acesse seu Arsenal de Desenvolvimento.</p>
        </div>

        {isRegistered && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-green-500/10 border border-green-500/20 text-green-400 px-6 py-4 rounded-2xl mb-8 flex items-center gap-4"
          >
            <CheckCircle2 size={24} />
            <span className="text-sm font-black uppercase tracking-widest">Conta criada com sucesso!</span>
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-2">Usuário</label>
            <div className="relative">
              <User className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500" size={24} />
              <input 
                type="text" 
                placeholder="Ex: joaosilva"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-3xl py-6 pl-16 pr-6 text-slate-900 text-xl placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all font-medium"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-2">Senha</label>
            <div className="relative">
              <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500" size={24} />
              <input 
                type="password" 
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-3xl py-6 pl-16 pr-6 text-slate-900 text-xl placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all font-medium"
                required
              />
            </div>
          </div>

          {error && (
            <motion.p 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              className="text-red-400 text-sm text-center font-black uppercase tracking-widest"
            >
              {error}
            </motion.p>
          )}

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-black py-7 rounded-3xl mt-6 text-2xl transition-all shadow-[0_20px_60px_rgba(5,150,105,0.3)] active:scale-95"
          >
            {loading ? "Sincronizando..." : "Acessar Plataforma"}
          </button>

          <div className="mt-10 pt-10 border-t border-slate-100 text-center">
            <p className="text-slate-600 text-lg font-medium">
              Primeira vez aqui?{" "}
              <button 
                type="button"
                onClick={() => router.push("/register")}
                className="text-emerald-600 hover:text-emerald-800 font-black underline underline-offset-8 decoration-2"
              >
                Criar Conta de Aluno
              </button>
            </p>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center text-white">Carregando...</div>}>
      <LoginForm />
    </Suspense>
  );
}
