"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Lock, User, Mail, ArrowLeft, ShieldPlus } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
      const res = await fetch(`${apiUrl}/api/users/register/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username,
          email,
          password,
        }),
      });

      if (res.ok) {
        router.push("/login?registered=true");
      } else {
        const data = await res.json();
        setError(data.username?.[0] || data.email?.[0] || "Erro ao criar conta. Tente novamente.");
      }
    } catch (err) {
      setError("Erro de conexão com o servidor.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] bg-emerald-500/5 rounded-full blur-[140px]" />
      </div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel p-10 md:p-14 rounded-[3.5rem] w-full max-w-xl relative z-10 border-slate-200 shadow-2xl shadow-emerald-900/5"
      >
        <button 
          onClick={() => router.push("/login")}
          className="absolute top-10 left-10 text-slate-400 hover:text-emerald-600 transition-all hover:scale-110"
        >
          <ArrowLeft size={32} />
        </button>

        <div className="flex flex-col items-center mb-12 mt-4">
          <div className="w-20 h-20 bg-emerald-100 rounded-3xl flex items-center justify-center text-emerald-600 mb-6 shadow-xl shadow-emerald-900/10">
            <ShieldPlus size={48} />
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tighter">Nova <span className="text-gradient">Jornada</span></h1>
          <p className="text-xl text-slate-600 text-center font-medium">Inicie seu caminho rumo ao conhecimento.</p>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-2">Nome de Usuário</label>
            <div className="relative">
              <User className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500" size={24} />
              <input 
                type="text" 
                placeholder="Como quer ser chamado?"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                className="w-full bg-slate-50 border-2 border-slate-100 rounded-3xl py-6 pl-16 pr-6 text-slate-900 text-xl placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:bg-white transition-all font-medium"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-500 uppercase tracking-[0.3em] ml-2">E-mail</label>
            <div className="relative">
              <Mail className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-500" size={24} />
              <input 
                type="email" 
                placeholder="seu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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
                placeholder="Crie uma senha forte"
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
            {loading ? "Criando conta..." : "Registrar Agora"}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
