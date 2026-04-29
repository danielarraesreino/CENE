"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { clinicalKeys } from "@/lib/api/keys";
import { toast } from "sonner";
import { 
  Target, 
  Plus, 
  CheckCircle2, 
  TrendingUp,
  Save,
  X,
  ChevronUp
} from "lucide-react";

import { ClinicalLayout } from "@/components/layout/ClinicalLayout";
import { ClinicalHeader } from "@/components/clinical/ui/ClinicalHeader";
import { ClinicalCard } from "@/components/clinical/ui/ClinicalCard";
import { ClinicalButton } from "@/components/clinical/ui/ClinicalButton";
import { ClinicalList, ClinicalListItem } from "@/components/clinical/ui/ClinicalList";
import { ClinicalEmptyState } from "@/components/clinical/ui/ClinicalEmptyState";

interface Goal {
  id: string;
  title: string;
  category: string;
  status: string;
  current_value: number;
  target_value: number;
  unit: string;
}

const categories = [
  { id: "health", label: "Saúde Física", color: "text-emerald-600", bg: "bg-emerald-50" },
  { id: "emotional", label: "Equilíbrio", color: "text-blue-600", bg: "bg-blue-50" },
  { id: "social", label: "Relacional", color: "text-pink-600", bg: "bg-pink-50" },
  { id: "career", label: "Carreira", color: "text-orange-600", bg: "bg-orange-50" },
];

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export default function GoalsPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const [showAdd, setShowAdd] = useState(false);

  const [newGoal, setNewGoal] = useState({
    title: "",
    category: "emotional",
    target_value: 10,
    unit: "vezes",
  });

  const { data: goals, isLoading } = useQuery({
    queryKey: clinicalKeys.list({ type: 'goals' }),
    queryFn: async () => {
      const res = await fetch(`${API_URL}/api/clinical/goals/`, {
        headers: { Authorization: `Bearer ${session?.accessToken}` },
      });
      if (!res.ok) throw new Error("Não foi possível carregar suas metas.");
      const data = await res.json();
      return Array.isArray(data) ? data : data.results || [];
    },
    enabled: !!session?.accessToken,
  });

  const addGoalMutation = useMutation({
    mutationFn: async (payload: typeof newGoal) => {
      const res = await fetch(`${API_URL}/api/clinical/goals/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.accessToken}`,
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Não foi possível criar a meta.");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: clinicalKeys.list({ type: 'goals' }) });
      toast.success("Meta criada com sucesso!");
      setShowAdd(false);
      setNewGoal({ title: "", category: "emotional", target_value: 10, unit: "vezes" });
    },
    onError: (err: Error) => {
      console.warn('[REIBB_API_ERROR]', { code: 'GOAL_ADD_FAILED', message: err.message });
      toast.error(err.message);
    }
  });

  const updateProgressMutation = useMutation({
    mutationFn: async ({ id, current }: { id: string, current: number }) => {
      const res = await fetch(`${API_URL}/api/clinical/goals/${id}/`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.accessToken}`,
        },
        body: JSON.stringify({ current_value: current + 1 }),
      });
      if (!res.ok) throw new Error("Não foi possível atualizar o progresso.");
      return res.json();
    },
    onMutate: async ({ id }) => {
      await queryClient.cancelQueries({ queryKey: clinicalKeys.list({ type: 'goals' }) });
      const previousGoals = queryClient.getQueryData<Goal[]>(clinicalKeys.list({ type: 'goals' }));
      
      queryClient.setQueryData<Goal[]>(clinicalKeys.list({ type: 'goals' }), (old) => 
        old?.map(g => g.id === id ? { ...g, current_value: g.current_value + 1 } : g)
      );

      return { previousGoals };
    },
    onError: (err: Error, _, context) => {
      if (context?.previousGoals) {
        queryClient.setQueryData(clinicalKeys.list({ type: 'goals' }), context.previousGoals);
      }
      console.warn('[REIBB_API_ERROR]', { code: 'GOAL_UPDATE_FAILED', message: err.message });
      toast.error(err.message);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: clinicalKeys.list({ type: 'goals' }) });
    }
  });

  const handleAddGoal = () => {
    if (!newGoal.title.trim()) {
      toast.error("Por favor, dê um título para sua meta.");
      return;
    }
    addGoalMutation.mutate(newGoal);
  };

  return (
    <ClinicalLayout containerClassName="max-w-6xl">
      <ClinicalHeader 
        title="Projeto de Vida"
        subtitle="Defina e acompanhe suas metas para transformar seu futuro, um passo de cada vez."
        icon={<Target size={20} />}
        actions={
          <ClinicalButton 
            onClick={() => setShowAdd(true)}
            disabled={showAdd}
            icon={<Plus size={20} />}
            className="px-6 py-3"
          >
            Nova Meta
          </ClinicalButton>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
        <div className="lg:col-span-2 space-y-6">
          <AnimatePresence mode="wait">
            {showAdd ? (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                key="add-goal-form"
              >
                <ClinicalCard className="bg-white border-blue-100">
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-xl font-black text-slate-900 uppercase tracking-widest">Criar Meta</h2>
                    <button onClick={() => setShowAdd(false)} className="text-slate-400 hover:text-red-500 transition-colors">
                      <X size={24} />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                    <div className="md:col-span-2">
                      <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-3 ml-1">O que você quer alcançar?</label>
                      <input 
                        type="text" 
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-slate-800 outline-none focus:border-blue-500 transition-all"
                        placeholder="Ex: Meditar todas as manhãs"
                        value={newGoal.title}
                        onChange={(e) => setNewGoal({...newGoal, title: e.target.value})}
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-3 ml-1">Categoria</label>
                      <select 
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-slate-800 outline-none focus:border-blue-500 transition-all appearance-none cursor-pointer"
                        value={newGoal.category}
                        onChange={(e) => setNewGoal({...newGoal, category: e.target.value})}
                      >
                        {categories.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}
                      </select>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-3 ml-1">Alvo</label>
                        <input 
                          type="number" 
                          className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-slate-800 outline-none focus:border-blue-500 transition-all"
                          value={newGoal.target_value}
                          onChange={(e) => setNewGoal({...newGoal, target_value: parseInt(e.target.value) || 0})}
                        />
                      </div>
                      <div>
                        <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-3 ml-1">Unidade</label>
                        <input 
                          type="text" 
                          className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-slate-800 outline-none focus:border-blue-500 transition-all"
                          placeholder="vezes"
                          value={newGoal.unit}
                          onChange={(e) => setNewGoal({...newGoal, unit: e.target.value})}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end gap-4 pt-4">
                    <ClinicalButton variant="ghost" onClick={() => setShowAdd(false)}>Cancelar</ClinicalButton>
                    <ClinicalButton 
                      onClick={handleAddGoal} 
                      isLoading={addGoalMutation.isPending}
                      icon={<Save size={20} />}
                      className="px-10"
                    >
                      Salvar Meta
                    </ClinicalButton>
                  </div>
                </ClinicalCard>
              </motion.div>
            ) : (
              <div className="space-y-4">
                {isLoading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map((i) => (
                      <div key={i} className="h-24 bg-slate-100 animate-pulse rounded-3xl" />
                    ))}
                  </div>
                ) : !goals || goals.length === 0 ? (
                  <ClinicalEmptyState 
                    title="Nenhuma meta definida"
                    description="O Projeto de Vida ajuda você a focar no que realmente importa. Defina sua primeira meta!"
                    icon={<Target size={48} />}
                    action={
                      <ClinicalButton onClick={() => setShowAdd(true)} variant="outline">
                        Definir Primeira Meta
                      </ClinicalButton>
                    }
                  />
                ) : (
                  <div className="grid grid-cols-1 gap-6">
                    {goals.map((goal: Goal) => {
                      const progress = (goal.current_value / (goal.target_value || 1)) * 100;
                      const category = categories.find(c => c.id === goal.category) || categories[1];
                      const isCompleted = progress >= 100;

                      return (
                        <ClinicalCard key={goal.id} className="bg-white p-6 md:p-8 hover:shadow-lg transition-all border border-slate-100">
                          <div className="flex flex-col md:flex-row items-center gap-6">
                            <div className={`w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 ${category.bg} ${category.color}`}>
                              <TrendingUp size={28} />
                            </div>
                            
                            <div className="flex-1 text-center md:text-left min-w-0">
                              <div className="flex items-center justify-center md:justify-start gap-3 mb-2">
                                <h3 className="text-xl font-black text-slate-900 truncate">{goal.title}</h3>
                                <span className={`text-[9px] font-black uppercase tracking-widest px-2 py-1 rounded-full ${category.bg} ${category.color}`}>
                                  {category.label}
                                </span>
                              </div>
                              <p className="text-slate-500 text-sm font-medium">
                                {goal.current_value} de {goal.target_value} {goal.unit}
                              </p>
                            </div>

                            <div className="w-full md:w-56 shrink-0">
                              <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">
                                <span>{Math.round(progress)}% Concluído</span>
                                {isCompleted && <span className="text-emerald-600">Finalizada!</span>}
                              </div>
                              <div className="h-3 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200">
                                <motion.div 
                                  initial={{ width: 0 }}
                                  animate={{ width: `${Math.min(progress, 100)}%` }}
                                  transition={{ duration: 1, ease: "easeOut" }}
                                  className={`h-full rounded-full ${isCompleted ? "bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.3)]" : "bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.3)]"}`}
                                />
                              </div>
                            </div>

                            <button 
                              onClick={() => updateProgressMutation.mutate({ id: goal.id, current: goal.current_value })}
                              disabled={updateProgressMutation.isPending || isCompleted}
                              className={`w-14 h-14 rounded-full flex items-center justify-center transition-all shrink-0 ${
                                isCompleted 
                                  ? "bg-emerald-100 text-emerald-600 cursor-default" 
                                  : "bg-slate-900 text-white hover:bg-emerald-600 active:scale-90 shadow-md"
                              }`}
                            >
                              {isCompleted ? <CheckCircle2 size={28} /> : <ChevronUp size={28} />}
                            </button>
                          </div>
                        </ClinicalCard>
                      );
                    })}
                  </div>
                )}
              </div>
            )}
          </AnimatePresence>
        </div>

        <div className="space-y-6">
          <ClinicalCard variant="glass" className="p-8">
            <div className="flex items-start gap-4">
              <TrendingUp className="text-blue-600 shrink-0" size={24} />
              <div>
                <h3 className="text-lg font-black text-slate-900 mb-2 uppercase tracking-widest">Dica Clínica</h3>
                <p className="text-sm text-slate-600 leading-relaxed italic">
                  "Metas pequenas e consistentes levam a grandes transformações. Foque no progresso, não na perfeição."
                </p>
              </div>
            </div>
          </ClinicalCard>
        </div>
      </div>
    </ClinicalLayout>
  );
}
