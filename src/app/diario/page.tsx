"use client";

import { useState } from "react";
import { BookOpenText, ArrowRight, CheckCircle2 } from "lucide-react";

export default function DiarioPage() {
  const [step, setStep] = useState(1);

  return (
    <div className="min-h-screen p-8 md:p-12 max-w-3xl mx-auto w-full flex flex-col items-center">
      <div className="text-center mb-12">
        <h1 className="text-4xl font-heading font-black text-white mb-4">
          Diário de Emoções (RPD)
        </h1>
        <p className="text-gray-400">
          O Registro de Pensamentos Disfuncionais ajuda a identificar a conexão entre o que você pensa, o que você sente e as decisões que toma em direção ao uso.
        </p>
      </div>

      <div className="glass-panel p-8 md:p-12 rounded-3xl w-full border border-white/10">
        
        {/* Barra de Progresso RPD */}
        <div className="flex justify-between items-center mb-8 relative">
          <div className="absolute top-1/2 left-0 right-0 h-1 bg-white/5 -z-10 -translate-y-1/2 rounded-full" />
          <div className="absolute top-1/2 left-0 h-1 bg-brand-cyan -z-10 -translate-y-1/2 rounded-full transition-all duration-500" style={{ width: `${(step / 6) * 100}%` }} />
          
          {[1,2,3,4,5,6].map(i => (
            <div key={i} className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all ${
              step === i ? "bg-brand-cyan text-white shadow-[0_0_15px_rgba(6,182,212,0.5)]" : step > i ? "bg-brand-cyan/40 text-white" : "bg-gray-800 text-gray-500"
            }`}>
              {i}
            </div>
          ))}
        </div>

        {step === 1 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500">
            <h2 className="text-xl font-bold text-white mb-6">1. Situação Gatilho</h2>
            <p className="text-sm text-gray-400 mb-4">O que aconteceu? Onde você estava? Com quem?</p>
            <textarea className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder-gray-600 focus:border-brand-cyan outline-none resize-none h-32" placeholder="Ex: Recebi uma cobrança no celular enquanto estava no trânsito..." />
          </div>
        )}

        {step === 2 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500">
            <h2 className="text-xl font-bold text-white mb-6">2. Pensamento Automático</h2>
            <p className="text-sm text-gray-400 mb-4">O que passou pela sua cabeça exatamente naquele momento?</p>
            <textarea className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder-gray-600 focus:border-brand-cyan outline-none resize-none h-32" placeholder="Ex: 'Eu não aguento mais isso, mereço relaxar um pouco', 'Sou um fracasso'..." />
          </div>
        )}

        {step === 3 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500">
            <h2 className="text-xl font-bold text-white mb-6">3. Emoção (Fissura)</h2>
            <p className="text-sm text-gray-400 mb-4">Qual emoção você sentiu? Qual o nível de fissura de 0 a 10?</p>
            <input type="range" min="0" max="10" className="w-full accent-red-500 mb-4" />
            <textarea className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder-gray-600 focus:border-brand-cyan outline-none resize-none h-20" placeholder="Ex: Senti muita ansiedade, raiva, aperto no peito." />
          </div>
        )}

        {step === 4 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500">
            <h2 className="text-xl font-bold text-white mb-6">4. Evidências que Apoiam o Pensamento</h2>
            <p className="text-sm text-gray-400 mb-4">O que prova que seu pensamento (do passo 2) é 100% verdadeiro?</p>
            <textarea className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder-gray-600 focus:border-brand-cyan outline-none resize-none h-32" placeholder="Ex: De fato estou devendo no banco..." />
          </div>
        )}

        {step === 5 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500">
            <h2 className="text-xl font-bold text-white mb-6">5. Evidências CONTRÁRIAS (A Negação)</h2>
            <p className="text-sm text-gray-400 mb-4">O que prova que esse pensamento é uma armadilha do Rei Bebê para te levar ao uso?</p>
            <textarea className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder-gray-600 focus:border-brand-cyan outline-none resize-none h-32" placeholder="Ex: Usar a substância não vai pagar a conta, só vai piorar. Eu estou limpo há X dias..." />
          </div>
        )}

        {step === 6 && (
          <div className="animate-in fade-in slide-in-from-right-4 duration-500">
            <h2 className="text-xl font-bold text-white mb-6">6. Nova Resposta (Comportamento Seguro)</h2>
            <p className="text-sm text-gray-400 mb-4">O que você pode pensar e FAZER de diferente para lidar com a situação sem recair?</p>
            <textarea className="w-full bg-white/5 border border-white/10 rounded-xl p-4 text-white placeholder-gray-600 focus:border-brand-cyan outline-none resize-none h-32" placeholder="Ex: Vou ligar pro meu padrinho, aceitar a ansiedade e fazer uma caminhada." />
          </div>
        )}

        {step === 7 && (
          <div className="animate-in fade-in zoom-in-95 flex flex-col items-center justify-center text-center h-48">
            <CheckCircle2 size={64} className="text-green-400 mb-4" />
            <h2 className="text-2xl font-bold text-white mb-2">Registro Concluído</h2>
            <p className="text-gray-400">Excelente trabalho. Desarmar a armadilha no papel tira a força da fissura na mente.</p>
          </div>
        )}

        <div className="mt-8 flex justify-end">
          {step < 7 ? (
            <button 
              onClick={() => setStep(s => s + 1)}
              className="bg-brand-cyan hover:bg-brand-cyan/80 text-white font-bold px-8 py-3 rounded-full flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(6,182,212,0.3)]"
            >
              {step === 6 ? "Salvar Registro" : "Próximo Passo"} <ArrowRight size={18} />
            </button>
          ) : (
            <button 
              onClick={() => setStep(1)}
              className="bg-white/10 hover:bg-white/20 text-white font-bold px-8 py-3 rounded-full flex items-center gap-2 transition-all border border-white/10"
            >
              Novo Registro
            </button>
          )}
        </div>

      </div>
    </div>
  );
}
