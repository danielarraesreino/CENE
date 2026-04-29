"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { clinicalKeys } from "@/lib/api/keys";
import { toast } from "sonner";
import { 
  ShieldAlert, 
  AlertTriangle, 
  Users, 
  Plus, 
  Trash2,
  Heart,
  Save,
  Loader2
} from "lucide-react";
import { SafetyPlan } from "@/types/clinical";

import { ClinicalLayout } from "@/components/layout/ClinicalLayout";
import { ClinicalHeader } from "@/components/clinical/ui/ClinicalHeader";
import { ClinicalCard } from "@/components/clinical/ui/ClinicalCard";
import { ClinicalButton } from "@/components/clinical/ui/ClinicalButton";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export default function SafetyPlanPage() {
  const router = useRouter();
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: clinicalKeys.list({ type: 'safety-plan' }),
    queryFn: async () => {
      const res = await fetch(`${API_URL}/api/clinical/safety-plan/`, {
        headers: { Authorization: `Bearer ${session?.accessToken}` },
      });
      if (!res.ok) throw new Error("Falha ao carregar plano de segurança.");
      const data = await res.json();
      return Array.isArray(data) ? data : data.results || [];
    },
    enabled: !!session?.accessToken,
  });

  const saveMutation = useMutation({
    mutationFn: async (updatedPlan: unknown) => {
      const res = await fetch(`${API_URL}/api/clinical/safety-plan/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.accessToken}`,
        },
        body: JSON.stringify(updatedPlan),
      });
      if (!res.ok) throw new Error("Não foi possível salvar o plano.");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: clinicalKeys.list({ type: 'safety-plan' }) });
      toast.success("Plano de Segurança atualizado com sucesso!");
      router.push("/portal/paciente/clinical");
    },
    onError: (err: Error) => {
      console.warn('[REIBB_API_ERROR]', { code: 'SAFETY_PLAN_SAVE_FAILED', message: err.message });
      toast.error(err.message || "Erro ao salvar plano.");
    }
  });

  if (isLoading) {
    return (
      <ClinicalLayout containerClassName="justify-center items-center">
        <Loader2 className="animate-spin text-emerald-600" size={48} />
      </ClinicalLayout>
    );
  }

  const initialPlan = data?.[0] || {
    warning_signs: [],
    coping_strategies: [],
    support_network: [],
    professional_help: [],
    reasons_to_live: [],
    safe_places: [],
  };

  return (
    <ClinicalLayout containerClassName="max-w-6xl">
      <ClinicalHeader 
        title="Plano de Segurança"
        subtitle="Seu guia personalizado para momentos de crise. Preencha com calma e mantenha-o sempre atualizado."
        icon={<ShieldAlert size={20} />}
      />

      <SafetyPlanForm 
        key={initialPlan.id || 'new'} 
        initialPlan={initialPlan} 
        onSave={(p) => saveMutation.mutate(p)} 
        isSaving={saveMutation.isPending}
      />
    </ClinicalLayout>
  );
}

function SafetyPlanForm({ initialPlan, onSave, isSaving }: { initialPlan: SafetyPlan, onSave: (p: SafetyPlan) => void, isSaving: boolean }) {
  const [plan, setPlan] = useState<SafetyPlan>(initialPlan);

  const addItem = (section: keyof SafetyPlan, value: string) => {
    const list = (plan[section] || []) as string[];
    setPlan({ ...plan, [section]: [...list, value] } as SafetyPlan);
  };

  const removeItem = (section: keyof SafetyPlan, index: number) => {
    const list = (plan[section] || []) as string[];
    const newList = [...list];
    newList.splice(index, 1);
    setPlan({ ...plan, [section]: newList } as SafetyPlan);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Sinais de Alerta */}
      <ClinicalCard className="bg-white">
        <div className="flex items-center gap-3 mb-6 text-orange-500">
          <AlertTriangle size={24} />
          <h2 className="text-xl font-black uppercase tracking-widest">1. Sinais de Alerta</h2>
        </div>
        <div className="space-y-3 mb-6">
          {plan.warning_signs.map((item: string, i: number) => (
            <div key={i} className="flex items-center justify-between bg-slate-50 p-4 rounded-2xl border border-slate-100 group transition-all hover:border-orange-200">
              <span className="text-slate-600 text-sm font-medium">{item}</span>
              <button 
                onClick={() => removeItem("warning_signs", i)} 
                className="text-slate-300 hover:text-red-500 transition-colors p-1"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
        <QuickAdd onAdd={(val) => addItem("warning_signs", val)} placeholder="Ex: Começar a me isolar..." />
      </ClinicalCard>

      {/* Estratégias */}
      <ClinicalCard className="bg-white">
        <div className="flex items-center gap-3 mb-6 text-emerald-600">
          <ShieldAlert size={24} />
          <h2 className="text-xl font-black uppercase tracking-widest">2. Enfrentamento</h2>
        </div>
        <div className="space-y-3 mb-6">
          {plan.coping_strategies.map((item: string, i: number) => (
            <div key={i} className="flex items-center justify-between bg-slate-50 p-4 rounded-2xl border border-slate-100 group transition-all hover:border-emerald-200">
              <span className="text-slate-600 text-sm font-medium">{item}</span>
              <button 
                onClick={() => removeItem("coping_strategies", i)} 
                className="text-slate-300 hover:text-red-500 transition-colors p-1"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
        <QuickAdd onAdd={(val) => addItem("coping_strategies", val)} placeholder="Ex: Ouvir música relaxante..." />
      </ClinicalCard>

      {/* Lugares Seguros */}
      <ClinicalCard className="bg-white">
        <div className="flex items-center gap-3 mb-6 text-blue-600">
          <Users size={24} />
          <h2 className="text-xl font-black uppercase tracking-widest">3. Lugares e Pessoas</h2>
        </div>
        <div className="space-y-3 mb-6">
          {plan.safe_places?.map((item: string, i: number) => (
            <div key={i} className="flex items-center justify-between bg-slate-50 p-4 rounded-2xl border border-slate-100 group transition-all hover:border-blue-200">
              <span className="text-slate-600 text-sm font-medium">{item}</span>
              <button 
                onClick={() => removeItem("safe_places", i)} 
                className="text-slate-300 hover:text-red-500 transition-colors p-1"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
        <QuickAdd onAdd={(val) => addItem("safe_places", val)} placeholder="Ex: Praça, casa do amigo..." />
      </ClinicalCard>

      {/* Razões para Viver */}
      <ClinicalCard className="bg-white">
        <div className="flex items-center gap-3 mb-6 text-rose-500">
          <Heart size={24} />
          <h2 className="text-xl font-black uppercase tracking-widest">4. Razões para Viver</h2>
        </div>
        <div className="space-y-3 mb-6">
          {plan.reasons_to_live.map((item: string, i: number) => (
            <div key={i} className="flex items-center justify-between bg-slate-50 p-4 rounded-2xl border border-slate-100 group transition-all hover:border-rose-200">
              <span className="text-slate-600 text-sm font-medium">{item}</span>
              <button 
                onClick={() => removeItem("reasons_to_live", i)} 
                className="text-slate-300 hover:text-red-500 transition-colors p-1"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
        <QuickAdd onAdd={(val) => addItem("reasons_to_live", val)} placeholder="Ex: Meus filhos, meus sonhos..." />
      </ClinicalCard>

      <div className="lg:col-span-2 flex justify-center mt-12">
        <ClinicalButton
          onClick={() => onSave(plan)}
          isLoading={isSaving}
          icon={<Save size={20} />}
          className="px-20"
        >
          Salvar Plano de Segurança
        </ClinicalButton>
      </div>
    </div>
  );
}

function QuickAdd({ onAdd, placeholder }: { onAdd: (val: string) => void, placeholder: string }) {
  const [val, setVal] = useState("");
  const handleAdd = () => {
    if (val.trim()) {
      onAdd(val);
      setVal("");
    }
  };

  return (
    <div className="flex gap-2">
      <input
        type="text"
        value={val}
        onChange={(e) => setVal(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && handleAdd()}
        placeholder={placeholder}
        className="flex-1 bg-slate-50 border border-slate-200 rounded-2xl px-5 py-3 text-slate-800 text-sm focus:outline-none focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/5 transition-all"
      />
      <button 
        onClick={handleAdd} 
        className="bg-slate-900 hover:bg-slate-800 text-white p-3 rounded-2xl transition-all active:scale-95 shadow-lg"
      >
        <Plus size={24} />
      </button>
    </div>
  );
}
