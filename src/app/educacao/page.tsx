"use client";

import React from 'react';
import Link from 'next/link';
import { GraduationCap, ArrowRight, Award } from 'lucide-react';

export default function EducacaoLandingPage() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col items-center justify-center p-6 text-center">
      <div className="w-24 h-24 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-8 shadow-xl shadow-emerald-100">
        <GraduationCap size={48} />
      </div>
      <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">Portal Acadêmico</h1>
      <p className="text-slate-600 text-xl max-w-2xl mb-12 leading-relaxed">
        Excelência em capacitação profissional. Tenha acesso a conteúdos exclusivos, simuladores e acompanhamento de especialistas.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <Link href="/login?flow=educacao" className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-8 py-4 rounded-full flex items-center justify-center gap-2 transition-all shadow-xl shadow-emerald-200">
          Acessar Ambiente de Aprendizagem <ArrowRight size={20} />
        </Link>
      </div>

      <div className="mt-16 flex items-center justify-center gap-6 opacity-60">
        <div className="flex items-center gap-2 font-bold text-slate-700"><Award className="text-emerald-600" /> UPPSI</div>
        <div className="flex items-center gap-2 font-bold text-slate-700"><Award className="text-emerald-600" /> FEBRACT</div>
      </div>
    </div>
  );
}
