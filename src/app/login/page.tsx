"use client";

import { Suspense, useState } from "react";
import { signIn, getSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Lock, User, CheckCircle2, ShieldCheck, ArrowRight } from "lucide-react";

function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const isRegistered = searchParams.get("registered") === "true";
  
  const [step, setStep] = useState<1 | 2>(1);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (username.trim() === "") {
      setError("Por favor, insira seu usuário ou e-mail.");
      return;
    }
    setError("");
    setStep(2);
  };

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
      setStep(1); // Volta caso haja erro
    } else {
      // Roteamento centralizado pelo Hub (role-aware)
      router.push("/hub");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden bg-slate-950">
      {/* Dynamic Background */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.5, 0.3] }}
          transition={{ duration: 10, repeat: Infinity }}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-emerald-900/20 rounded-full blur-[120px]" 
        />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel p-10 md:p-14 rounded-[3.5rem] w-full max-w-xl relative z-10 border border-slate-800 shadow-2xl"
      >
        <div className="flex flex-col items-center mb-12 text-white">
          <div className="w-20 h-20 bg-emerald-500/10 rounded-3xl flex items-center justify-center text-emerald-400 mb-6 border border-emerald-500/20">
            <ShieldCheck size={48} />
          </div>
          <h1 className="text-4xl md:text-5xl font-black mb-4 tracking-tighter">Portal <span className="text-emerald-400">CENE</span></h1>
          <p className="text-xl text-slate-400 text-center font-medium">Acesso Unificado à Plataforma</p>
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

        <form onSubmit={step === 1 ? handleNextStep : handleSubmit} className="flex flex-col gap-6">
          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.div 
                key="step1"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-2"
              >
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-2">E-mail ou Usuário</label>
                <div className="relative">
                  <User className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={24} />
                  <input 
                    type="text" 
                    placeholder="Ex: joaosilva@email.com"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="w-full bg-slate-900 border-2 border-slate-800 rounded-3xl py-6 pl-16 pr-6 text-white text-xl placeholder-slate-600 focus:outline-none focus:border-emerald-500 transition-all font-medium"
                    required
                  />
                </div>
              </motion.div>
            ) : (
              <motion.div 
                key="step2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="space-y-2"
              >
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-2">Sua Senha</label>
                <div className="relative">
                  <Lock className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={24} />
                  <input 
                    type="password" 
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-slate-900 border-2 border-slate-800 rounded-3xl py-6 pl-16 pr-6 text-white text-xl placeholder-slate-600 focus:outline-none focus:border-emerald-500 transition-all font-medium"
                    required
                    autoFocus
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

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
            className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-black py-6 rounded-3xl mt-4 text-xl flex items-center justify-center gap-3 transition-all"
          >
            {loading ? "Autenticando..." : step === 1 ? "Continuar" : "Acessar Plataforma"}
            {!loading && step === 1 && <ArrowRight size={24} />}
          </button>

          {step === 2 && (
            <button 
              type="button"
              onClick={() => { setStep(1); setPassword(""); setError(""); }}
              className="text-slate-400 hover:text-white text-sm font-medium mt-2 transition-colors"
            >
              ← Voltar e alterar e-mail
            </button>
          )}

          <div className="mt-8 pt-8 border-t border-slate-800/50 text-center">
             <button 
                type="button"
                onClick={() => router.push("/register")}
                className="text-emerald-500 hover:text-emerald-400 font-bold underline underline-offset-8 decoration-2"
              >
                Solicitar Acesso Inicial
              </button>
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
