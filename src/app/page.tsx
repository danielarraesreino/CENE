"use client";

import React from 'react';
import Link from 'next/link';
import { HeartPulse, GraduationCap, ChevronRight } from 'lucide-react';

export default function Home() {
  return (
    <div className="min-h-screen w-full flex flex-col md:flex-row overflow-hidden font-sans">
      
      {/* Lado Esquerdo: HealthTech (Acolhimento Terapêutico) */}
      <Link href="/clinica" className="w-full md:w-1/2 min-h-[50vh] md:min-h-screen relative group flex items-center justify-center overflow-hidden cursor-pointer">
        <div className="absolute inset-0 bg-slate-900 transition-transform duration-700 group-hover:scale-105">
           <div className="absolute inset-0 bg-gradient-to-br from-blue-900/90 to-slate-900/90 z-10" />
        </div>
        
        <div className="relative z-20 flex flex-col items-center text-center p-8">
          <div className="w-20 h-20 bg-blue-500/20 text-blue-400 rounded-full flex items-center justify-center mb-6 group-hover:bg-blue-500 group-hover:text-white transition-all duration-500">
            <HeartPulse size={40} />
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">Portal Terapêutico</h2>
          <p className="text-blue-100/80 text-lg max-w-md mx-auto mb-8 font-medium">
            Acolhimento clínico, registro de pensamentos e acompanhamento psicológico estruturado.
          </p>
          <div className="inline-flex items-center gap-2 text-white font-bold bg-blue-600/30 group-hover:bg-blue-600 px-8 py-4 rounded-full transition-all">
            Acessar Área Clínica <ChevronRight size={20} />
          </div>
        </div>
      </Link>

      {/* Lado Direito: EdTech (Ecossistema Acadêmico) */}
      <Link href="/educacao" className="w-full md:w-1/2 min-h-[50vh] md:min-h-screen relative group flex items-center justify-center overflow-hidden cursor-pointer">
        <div className="absolute inset-0 bg-slate-50 transition-transform duration-700 group-hover:scale-105">
           <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/90 to-white/90 z-10" />
        </div>
        
        <div className="relative z-20 flex flex-col items-center text-center p-8">
          <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-6 group-hover:bg-emerald-600 group-hover:text-white transition-all duration-500 shadow-xl shadow-emerald-100">
            <GraduationCap size={40} />
          </div>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">Portal Acadêmico</h2>
          <p className="text-slate-600 text-lg max-w-md mx-auto mb-8 font-medium">
            Cursos de especialização, comunidade e desenvolvimento avançado de profissionais.
          </p>
          <div className="inline-flex items-center gap-2 text-white font-bold bg-emerald-600 group-hover:bg-emerald-700 shadow-xl shadow-emerald-200 px-8 py-4 rounded-full transition-all">
            Acessar Área Educacional <ChevronRight size={20} />
          </div>
        </div>
      </Link>

      {/* Logo overlay center */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-30 hidden md:flex flex-col items-center pointer-events-none">
        <div className="bg-white p-3 rounded-3xl shadow-2xl flex items-center justify-center ring-4 ring-white/50">
          <img src="/cene-logo.jpeg" alt="CENE" className="w-14 h-14 rounded-xl object-cover" />
        </div>
      </div>
    </div>
  );
}
