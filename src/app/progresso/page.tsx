"use client";

import SevenAreasWheel from "@/components/features/checkin/SevenAreasWheel";
import { motion } from "framer-motion";
import { Sparkles, Save, ShieldCheck } from "lucide-react";

export default function ProgressoPage() {
  return (
    <div className="min-h-screen pt-24 pb-20 px-6 md:px-12 max-w-7xl mx-auto w-full flex flex-col items-center">
      
      {/* Background Glows */}
      <div className="fixed inset-0 pointer-events-none">
        <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-emerald-500/5 rounded-full blur-[120px] -translate-y-1/2 -translate-x-1/2" />
        <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-emerald-600/5 rounded-full blur-[120px] translate-y-1/2 translate-x-1/2" />
      </div>

      <header className="text-center max-w-4xl mb-16 relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-100 border border-emerald-200 rounded-full text-emerald-700 text-xs font-black uppercase tracking-widest mb-8"
        >
          <Sparkles size={14} />
          Autopercepção Global
        </motion.div>
        
        <h1 className="text-5xl md:text-7xl font-black text-slate-900 mb-8 tracking-tighter leading-tight">
          O Projeto de <br />
          <span className="text-gradient">Vida Integral</span>
        </h1>
        
        <p className="text-xl md:text-2xl text-slate-600 leading-relaxed">
          A especialização é a construção total do saber. Avalie cada área do seu 
          desenvolvimento para visualizar onde você está e onde deseja chegar.
        </p>
      </header>

      {/* Roda Dinâmica */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="w-full flex justify-center mb-20 relative z-10"
      >
        <SevenAreasWheel />
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="glass-panel p-10 md:p-16 rounded-[3rem] max-w-4xl w-full text-center relative z-10 border-emerald-200 bg-emerald-50"
      >
        <div className="flex flex-col items-center">
          <div className="w-16 h-16 bg-emerald-100 rounded-2xl flex items-center justify-center text-emerald-600 mb-8 shadow-xl shadow-emerald-900/10">
            <ShieldCheck size={40} />
          </div>
          
          <h3 className="text-3xl md:text-4xl font-black text-slate-900 mb-6">Check-in Consciencioso</h3>
          
          <p className="text-xl text-slate-600 mb-12 max-w-2xl leading-relaxed font-medium">
            Sua autoavaliação é a bússola do seu progresso. Ao salvar, você cria um registro histórico do seu crescimento nas 7 áreas fundamentais.
          </p>
          
          <button className="group flex items-center gap-4 bg-emerald-600 hover:bg-emerald-700 text-white px-16 py-6 rounded-2xl font-black text-2xl transition-all shadow-[0_10px_50px_rgba(5,150,105,0.3)] hover:scale-105 active:scale-95">
            <Save size={24} />
            Salvar Evolução
          </button>
        </div>
      </motion.div>
    </div>
  );
}
