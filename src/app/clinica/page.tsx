"use client";

import React from 'react';
import Link from 'next/link';
import { HeartPulse, ArrowRight, ShieldCheck } from 'lucide-react';

export default function ClinicaLandingPage() {
  return (
    <div className="min-h-screen bg-slate-900 text-white flex flex-col items-center justify-center p-6 text-center">
      <div className="w-24 h-24 bg-blue-500/20 text-blue-400 rounded-full flex items-center justify-center mb-8">
        <HeartPulse size={48} />
      </div>
      <h1 className="text-4xl md:text-6xl font-black mb-6 tracking-tight">Portal Terapêutico</h1>
      <p className="text-blue-100/80 text-xl max-w-2xl mb-12 leading-relaxed">
        Um espaço seguro e sigiloso focado em seu desenvolvimento pessoal, registro estruturado de pensamentos e apoio profissional contínuo.
      </p>
      
      <div className="flex flex-col sm:flex-row gap-4">
        <Link href="/login?flow=clinica" className="bg-blue-600 hover:bg-blue-500 text-white font-bold px-8 py-4 rounded-full flex items-center justify-center gap-2 transition-all">
          Acessar Meu Painel <ArrowRight size={20} />
        </Link>
      </div>

      <div className="mt-16 flex items-center gap-2 text-slate-400 text-sm">
        <ShieldCheck size={18} className="text-emerald-400" />
        Seus dados são criptografados de ponta a ponta (AES-256).
      </div>
    </div>
  );
}
