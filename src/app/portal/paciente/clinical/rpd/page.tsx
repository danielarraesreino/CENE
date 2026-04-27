"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { clinicalKeys } from "@/lib/api/keys";
import { toast } from "sonner";
import { ChevronLeft, ChevronRight, Save, Brain, AlertCircle } from "lucide-react";

const steps = [
  {
    id: "situacao",
    label: "Situação",
    question: "O que aconteceu? Onde você estava? Com quem?",
    placeholder: "Ex: Estava no trabalho quando recebi uma crítica do meu chefe...",
  },
  {
    id: "pensamento",
    label: "Pensamento Automático",
    question: "O que passou pela sua mente naquele momento?",
    placeholder: "Ex: Eu sou incompetente, nunca vou conseguir fazer nada direito...",
  },
  {
    id: "emocao",
    label: "Emoção",
    question: "Qual foi a emoção predominante e qual a intensidade (0-100)?",
    placeholder: "Ex: Ansiedade (80), Tristeza (60)...",
  },
  {
    id: "distorcao",
    label: "Distorção Cognitiva",
    question: "Qual distorção você identifica nesse pensamento?",
    placeholder: "Ex: Catastrofização, Tudo ou Nada, Generalização...",
  },
  {
    id: "resposta",
    label: "Resposta Alternativa",
    question: "O que você diria para um amigo na mesma situação?",
    placeholder: "Ex: Todos cometem erros, uma crítica não define minha competência total...",
  },
];

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export default function RPDPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Record<string, string>>({});

  const rpdMutation = useMutation({
    mutationFn: async (payload: any) => {
      const res = await fetch(`${API_URL}/api/clinical/rpd/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.accessToken}`,
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) throw new Error("Não foi possível salvar seu RPD.");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: clinicalKeys.list({ type: 'rpd' }) });
      toast.success("Registro RPD finalizado com sucesso!");
      router.push("/clinical");
    },
    onError: (err: any) => {
      console.warn('[REIBB_API_ERROR]', { code: 'RPD_SAVE_FAILED', message: err.message });
      toast.error(err.message || "Erro ao salvar RPD.");
    }
  });

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    } else {
      router.push("/clinical");
    }
  };

  const handleSubmit = () => {
    rpdMutation.mutate({
      situacao: formData.situacao,
      pensamento_automatico: formData.pensamento,
      emocoes_iniciais: [{ emocao: "Geral", intensidade: 80 }],
      distorcoes_cognitivas: [formData.distorcao],
      resposta_alternativa: formData.resposta,
      emocoes_finais: [{ emocao: "Geral", intensidade: 40 }],
      grau_crenca_inicial: 100,
      grau_crenca_final: 40,
    });
  };

  const step = steps[currentStep];

  return (
    <div className="min-h-screen p-8 md:p-12 max-w-4xl mx-auto w-full flex flex-col">
      {/* Progresso */}
      <div className="flex gap-2 mb-12">
        {steps.map((_, i) => (
          <div 
            key={i} 
            className={`h-2 flex-1 rounded-full transition-all ${
              i <= currentStep ? "bg-emerald-600 shadow-[0_0_8px_rgba(5,150,105,0.4)]" : "bg-slate-200"
            }`}
          />
        ))}
      </div>

      <div className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            className="glass-panel p-8 md:p-12 rounded-3xl border border-slate-200 shadow-xl"
          >
            <div className="flex items-center gap-3 mb-6 text-emerald-700">
              <Brain size={24} />
              <span className="font-bold uppercase tracking-widest text-sm">Passo {currentStep + 1} de {steps.length}</span>
            </div>

            <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-4 leading-tight">
              {step.question}
            </h2>

            <textarea
              autoFocus
              className="w-full h-48 bg-slate-50 border border-slate-100 rounded-2xl p-6 text-slate-900 text-lg focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all resize-none placeholder:text-slate-300"
              placeholder={step.placeholder}
              value={formData[step.id] || ""}
              onChange={(e) => setFormData({ ...formData, [step.id]: e.target.value })}
            />

            <div className="mt-8 flex items-start gap-3 p-5 bg-emerald-50 rounded-2xl border border-emerald-100 text-emerald-700 text-sm">
              <AlertCircle size={20} className="shrink-0" />
              <p className="font-medium">
                Este registro ajuda a quebrar o ciclo de pensamentos automáticos que alimentam o estresse e a reatividade emocional.
              </p>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Navegação Inferior */}
      <div className="mt-8 flex justify-between items-center">
        <button
          onClick={handleBack}
          className="px-8 py-4 rounded-full font-bold text-slate-400 hover:text-emerald-600 transition-colors flex items-center gap-2 active:scale-95"
        >
          <ChevronLeft size={20} />
          {currentStep === 0 ? "Cancelar" : "Voltar"}
        </button>

        {currentStep === steps.length - 1 ? (
          <button
            onClick={handleSubmit}
            disabled={rpdMutation.isPending || !formData[step.id]}
            className="bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white px-10 py-4 rounded-full font-black shadow-[0_10px_40px_rgba(5,150,105,0.3)] flex items-center gap-2 transition-all active:scale-95"
          >
            {rpdMutation.isPending ? "Salvando..." : "Finalizar Registro"}
            <Save size={20} />
          </button>
        ) : (
          <button
            onClick={handleNext}
            disabled={!formData[step.id]}
            className="bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white px-10 py-4 rounded-full font-black shadow-[0_10px_40px_rgba(5,150,105,0.2)] flex items-center gap-2 transition-all active:scale-95"
          >
            Avançar
            <ChevronRight size={20} />
          </button>
        )}
      </div>
    </div>
  );
}
