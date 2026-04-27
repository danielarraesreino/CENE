"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { clinicalKeys } from "@/lib/api/keys";
import { toast } from "sonner";
import { 
  ChevronLeft, 
  ShieldAlert, 
  Save, 
  AlertTriangle, 
  Heart, 
  Phone, 
  MapPin, 
  Plus, 
  Trash2 
} from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export default function SafetyPlanPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: session } = useSession();

  // State local para edição do formulário
  const [plan, setPlan] = useState({
    warning_signs: [] as string[],
    coping_strategies: [] as string[],
    social_contacts: [] as { name: string, phone: string }[],
    professionals: [] as { name: string, phone: string, specialty: string }[],
    safe_places: [] as string[],
    reasons_to_live: [] as string[],
  });

  // 1. Carregar dados existentes
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

  // Sincroniza estado local quando os dados chegam
  useEffect(() => {
    if (data && data.length > 0) {
      setPlan(data[0]);
    }
  }, [data]);

  // 2. Mutação para salvar
  const saveMutation = useMutation({
    mutationFn: async (updatedPlan: typeof plan) => {
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
      router.push("/clinical");
    },
    onError: (err: any) => {
      console.warn('[REIBB_API_ERROR]', { code: 'SAFETY_PLAN_SAVE_FAILED', message: err.message });
      toast.error(err.message || "Erro ao salvar plano.");
    }
  });

  const handleSave = () => {
    saveMutation.mutate(plan);
  };

  const addItem = (section: keyof typeof plan, value: any) => {
    setPlan({ ...plan, [section]: [...(plan[section] as any[]), value] });
  };

  const removeItem = (section: keyof typeof plan, index: number) => {
    const newList = [...(plan[section] as any[])];
    newList.splice(index, 1);
    setPlan({ ...plan, [section]: newList });
  };

  if (isLoading) return <div className="min-h-screen flex items-center justify-center text-white">Carregando plano...</div>;

  return (
    <div className="min-h-screen p-8 md:p-12 max-w-5xl mx-auto w-full flex flex-col">
      {/* Header */}
      <div className="mb-12 flex items-center justify-between">
        <button
          onClick={() => router.push("/clinical")}
          className="text-gray-400 hover:text-white flex items-center gap-2 transition-colors"
        >
          <ChevronLeft size={20} />
          Voltar
        </button>
        <div className="flex items-center gap-2 text-red-400">
          <ShieldAlert size={20} />
          <span className="font-bold uppercase tracking-widest text-xs">Plano de Segurança Emergencial</span>
        </div>
      </div>

      <header className="mb-12">
        <h1 className="text-4xl font-black text-white mb-4">Meu Plano de Segurança</h1>
        <p className="text-gray-400 max-w-2xl">
          Este é o seu guia personalizado para momentos de crise. Preencha com calma e mantenha-o atualizado.
        </p>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Seção: Sinais de Alerta */}
        <section className="glass-panel p-6 rounded-3xl border border-white/10">
          <div className="flex items-center gap-3 mb-6 text-yellow-400">
            <AlertTriangle size={24} />
            <h2 className="text-xl font-bold">1. Sinais de Alerta</h2>
          </div>
          <p className="text-xs text-gray-500 mb-4 italic">Pensamentos, imagens, humores ou comportamentos que indicam que uma crise pode estar começando.</p>
          <div className="space-y-2 mb-4">
            {plan.warning_signs.map((item, i) => (
              <div key={i} className="flex items-center justify-between bg-white/5 p-3 rounded-xl border border-white/5">
                <span className="text-gray-300 text-sm">{item}</span>
                <button onClick={() => removeItem("warning_signs", i)} className="text-gray-600 hover:text-red-400"><Trash2 size={16} /></button>
              </div>
            ))}
          </div>
          <QuickAdd onAdd={(val) => addItem("warning_signs", val)} placeholder="Ex: Começar a me isolar..." />
        </section>

        {/* Seção: Estratégias de Enfrentamento */}
        <section className="glass-panel p-6 rounded-3xl border border-white/10">
          <div className="flex items-center gap-3 mb-6 text-emerald-400">
            <ShieldAlert size={24} />
            <h2 className="text-xl font-bold">2. O que posso fazer sozinho?</h2>
          </div>
          <p className="text-xs text-gray-500 mb-4 italic">Atividades que posso fazer para me distrair da crise sem precisar de ninguém.</p>
          <div className="space-y-2 mb-4">
            {plan.coping_strategies.map((item, i) => (
              <div key={i} className="flex items-center justify-between bg-white/5 p-3 rounded-xl border border-white/5">
                <span className="text-gray-300 text-sm">{item}</span>
                <button onClick={() => removeItem("coping_strategies", i)} className="text-gray-600 hover:text-red-400"><Trash2 size={16} /></button>
              </div>
            ))}
          </div>
          <QuickAdd onAdd={(val) => addItem("coping_strategies", val)} placeholder="Ex: Caminhar, ouvir música..." />
        </section>

        {/* Seção: Contatos Sociais */}
        <section className="glass-panel p-6 rounded-3xl border border-white/10">
          <div className="flex items-center gap-3 mb-6 text-green-400">
            <Phone size={24} />
            <h2 className="text-xl font-bold">3. Contatos de Apoio</h2>
          </div>
          <div className="space-y-2 mb-4">
            {plan.social_contacts.map((item, i) => (
              <div key={i} className="flex items-center justify-between bg-white/5 p-3 rounded-xl border border-white/5">
                <div>
                  <div className="text-white text-sm font-bold">{item.name}</div>
                  <div className="text-gray-500 text-xs">{item.phone}</div>
                </div>
                <button onClick={() => removeItem("social_contacts", i)} className="text-gray-600 hover:text-red-400"><Trash2 size={16} /></button>
              </div>
            ))}
          </div>
          <button 
            onClick={() => {
              const name = prompt("Nome:");
              const phone = prompt("Telefone:");
              if (name && phone) addItem("social_contacts", { name, phone });
            }}
            className="w-full py-3 border-2 border-dashed border-white/10 rounded-xl text-gray-500 hover:text-green-400 hover:border-green-400/50 transition-all flex items-center justify-center gap-2 text-sm font-bold"
          >
            <Plus size={16} /> Adicionar Contato
          </button>
        </section>

        {/* Seção: Razões para Viver */}
        <section className="glass-panel p-6 rounded-3xl border border-white/10">
          <div className="flex items-center gap-3 mb-6 text-pink-400">
            <Heart size={24} />
            <h2 className="text-xl font-bold">4. Razões para Viver</h2>
          </div>
          <div className="space-y-2 mb-4">
            {plan.reasons_to_live.map((item, i) => (
              <div key={i} className="flex items-center justify-between bg-white/5 p-3 rounded-xl border border-white/5">
                <span className="text-gray-300 text-sm">{item}</span>
                <button onClick={() => removeItem("reasons_to_live", i)} className="text-gray-600 hover:text-red-400"><Trash2 size={16} /></button>
              </div>
            ))}
          </div>
          <QuickAdd onAdd={(val) => addItem("reasons_to_live", val)} placeholder="Ex: Meus filhos, ver o pôr do sol..." />
        </section>

      </div>

      <div className="mt-12 mb-20">
        <button
          onClick={handleSave}
          disabled={saveMutation.isPending}
          className="w-full bg-red-500 hover:bg-red-600 text-white py-5 rounded-3xl font-black text-xl shadow-[0_10px_40px_rgba(239,68,68,0.4)] flex items-center justify-center gap-3 transition-all active:scale-[0.98] disabled:opacity-50"
        >
          {saveMutation.isPending ? "Salvando..." : "Atualizar Meu Plano de Segurança"}
          <Save size={24} />
        </button>
      </div>
    </div>
  );
}

function QuickAdd({ onAdd, placeholder }: { onAdd: (val: string) => void, placeholder: string }) {
  const [val, setVal] = useState("");
  return (
    <div className="flex gap-2">
      <input 
        type="text" 
        value={val}
        onChange={(e) => setVal(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && val) {
            onAdd(val);
            setVal("");
          }
        }}
        placeholder={placeholder}
        className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:border-emerald-500 outline-none transition-all"
      />
      <button 
        onClick={() => { if (val) { onAdd(val); setVal(""); } }}
        className="p-2 bg-white/10 text-white rounded-xl hover:bg-white/20 transition-all"
      >
        <Plus size={20} />
      </button>
    </div>
  );
}
