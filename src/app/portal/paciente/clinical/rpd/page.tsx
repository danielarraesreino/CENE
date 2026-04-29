"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { clinicalKeys } from "@/lib/api/keys";
import { toast } from "sonner";
import { ChevronRight, Save, Brain, AlertCircle, ArrowLeft } from "lucide-react";

import { ClinicalLayout } from "@/components/layout/ClinicalLayout";
import { ClinicalHeader } from "@/components/clinical/ui/ClinicalHeader";
import { ClinicalCard } from "@/components/clinical/ui/ClinicalCard";
import { ClinicalButton } from "@/components/clinical/ui/ClinicalButton";
import { ClinicalProgressBar } from "@/components/clinical/ui/ClinicalProgressBar";

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
    mutationFn: async (payload: unknown) => {
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
      router.push("/portal/paciente/clinical");
    },
    onError: (err: Error) => {
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
      router.push("/portal/paciente/clinical");
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
    <ClinicalLayout>
      <ClinicalHeader 
        title="Registro de Pensamentos"
        subtitle="Identifique e desafie pensamentos automáticos para melhorar seu bem-estar emocional."
        icon={<Brain size={20} />}
      />

      <ClinicalProgressBar currentStep={currentStep} totalSteps={steps.length} />

      <div className="flex-1">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            <ClinicalCard className="bg-white">
              <div className="flex items-center gap-3 mb-6 text-emerald-700">
                <Brain size={24} />
                <span className="font-black uppercase tracking-widest text-xs">
                  Passo {currentStep + 1} de {steps.length} • {step.label}
                </span>
              </div>

              <h2 className="text-2xl md:text-3xl font-black text-slate-900 mb-8 leading-tight">
                {step.question}
              </h2>

              <textarea
                autoFocus
                className="w-full h-48 bg-slate-50 border border-slate-200 rounded-[2rem] p-8 text-slate-900 text-lg focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all resize-none placeholder:text-slate-300"
                placeholder={step.placeholder}
                value={formData[step.id] || ""}
                onChange={(e) => setFormData({ ...formData, [step.id]: e.target.value })}
              />

              <div className="mt-8 flex items-start gap-4 p-6 bg-emerald-50/50 rounded-3xl border border-emerald-100/50 text-emerald-800 text-sm">
                <AlertCircle size={20} className="shrink-0 text-emerald-600" />
                <p className="font-medium leading-relaxed">
                  Este registro ajuda a quebrar o ciclo de pensamentos automáticos que alimentam o estresse e a reatividade emocional.
                </p>
              </div>
            </ClinicalCard>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mt-8 flex justify-between items-center">
        <ClinicalButton
          variant="ghost"
          onClick={handleBack}
          className="text-slate-400"
        >
          <ArrowLeft size={20} />
          {currentStep === 0 ? "Cancelar" : "Voltar"}
        </ClinicalButton>

        {currentStep === steps.length - 1 ? (
          <ClinicalButton
            onClick={handleSubmit}
            isLoading={rpdMutation.isPending}
            disabled={!formData[step.id]}
            icon={<Save size={20} />}
            className="px-12"
          >
            Finalizar Registro
          </ClinicalButton>
        ) : (
          <ClinicalButton
            onClick={handleNext}
            disabled={!formData[step.id]}
            icon={<ChevronRight size={20} />}
            className="px-12"
          >
            Avançar
          </ClinicalButton>
        )}
      </div>
    </ClinicalLayout>
  );
}
