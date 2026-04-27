"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { clinicalKeys } from "@/lib/api/keys";
import { toast } from "sonner";
import { 
  ChevronLeft, 
  Target, 
  Plus, 
  CheckCircle2, 
  TrendingUp
} from "lucide-react";

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
  { id: "health", label: "Saúde Física", color: "text-green-400" },
  { id: "emotional", label: "Equilíbrio Emocional", color: "text-brand-cyan" },
  { id: "social", label: "Social/Relacional", color: "text-pink-400" },
  { id: "career", label: "Carreira/Estudos", color: "text-yellow-400" },
];

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export default function GoalsPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const [showAdd, setShowAdd] = useState(false);

  // Novos dados de meta
  const [newGoal, setNewGoal] = useState({
    title: "",
    category: "emotional",
    target_value: 10,
    unit: "vezes",
  });

  // 1. Fetching
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

  // 2. Mutação para Adicionar
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
    onError: (err: any) => {
      console.warn('[REIBB_API_ERROR]', { code: 'GOAL_ADD_FAILED', message: err.message });
      toast.error(err.message);
    }
  });

  // 3. Mutação para Atualizar Progresso
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
    onError: (err: any, _, context) => {
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
        <div className="flex items-center gap-2 text-yellow-400">
          <Target size={20} />
          <span className="font-bold uppercase tracking-widest text-xs">Gestão de Metas</span>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-black text-white mb-2">Projeto de Vida</h1>
          <p className="text-gray-400">Defina e acompanhe suas metas de curto e médio prazo.</p>
        </div>
        <button 
          onClick={() => setShowAdd(true)}
          disabled={showAdd}
          className="bg-brand-cyan hover:bg-brand-cyan/80 disabled:opacity-50 text-black px-6 py-3 rounded-full font-bold flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(6,182,212,0.3)]"
        >
          <Plus size={20} /> Nova Meta
        </button>
      </div>

      {/* Modal / Form de Adição */}
      <AnimatePresence>
        {showAdd && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden mb-12"
          >
            <div className="glass-panel p-8 rounded-3xl border border-brand-cyan/30 bg-brand-cyan/5">
              <h2 className="text-xl font-bold text-white mb-6">Criar Nova Meta</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Título da Meta</label>
                  <input 
                    type="text" 
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-brand-cyan transition-all"
                    placeholder="Ex: Meditar todas as manhãs"
                    value={newGoal.title}
                    onChange={(e) => setNewGoal({...newGoal, title: e.target.value})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Categoria</label>
                  <select 
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-brand-cyan transition-all"
                    value={newGoal.category}
                    onChange={(e) => setNewGoal({...newGoal, category: e.target.value})}
                  >
                    {categories.map(c => <option key={c.id} value={c.id} className="bg-slate-900">{c.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Valor Alvo</label>
                  <input 
                    type="number" 
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-brand-cyan transition-all"
                    value={newGoal.target_value}
                    onChange={(e) => setNewGoal({...newGoal, target_value: parseInt(e.target.value) || 0})}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Unidade</label>
                  <input 
                    type="text" 
                    className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-brand-cyan transition-all"
                    placeholder="Ex: dias, sessões, vezes"
                    value={newGoal.unit}
                    onChange={(e) => setNewGoal({...newGoal, unit: e.target.value})}
                  />
                </div>
              </div>
              <div className="flex gap-4">
                <button 
                  onClick={handleAddGoal} 
                  disabled={addGoalMutation.isPending}
                  className="bg-brand-cyan text-black font-bold px-8 py-3 rounded-xl transition-all hover:scale-105 active:scale-95 disabled:opacity-50"
                >
                  {addGoalMutation.isPending ? "Salvando..." : "Salvar Meta"}
                </button>
                <button onClick={() => setShowAdd(false)} className="text-gray-500 hover:text-white font-bold px-8 py-3 transition-colors">Cancelar</button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lista de Metas */}
      <div className="grid grid-cols-1 gap-4">
        {isLoading ? (
          <div className="text-center py-12 text-gray-500">Buscando suas metas...</div>
        ) : !goals || goals.length === 0 ? (
          <div className="text-center py-20 bg-white/5 rounded-3xl border border-white/5 border-dashed">
            <Target size={48} className="mx-auto text-gray-600 mb-4 opacity-20" />
            <p className="text-gray-500 font-medium">Você ainda não definiu nenhuma meta clínica.</p>
          </div>
        ) : (
          goals.map((goal: Goal) => {
            const progress = (goal.current_value / (goal.target_value || 1)) * 100;
            const category = categories.find(c => c.id === goal.category) || categories[1];
            return (
              <motion.div 
                layout
                key={goal.id}
                className="glass-panel p-6 rounded-3xl border border-white/10 hover:border-white/20 transition-all flex flex-col md:flex-row items-center gap-6"
              >
                <div className={`w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center shrink-0 ${category.color}`}>
                  <TrendingUp size={24} />
                </div>
                
                <div className="flex-1 text-center md:text-left">
                  <div className="flex items-center justify-center md:justify-start gap-2 mb-1">
                    <h3 className="text-xl font-bold text-white">{goal.title}</h3>
                    <span className={`text-[10px] font-black uppercase tracking-tighter px-2 py-0.5 rounded-md bg-white/5 ${category.color}`}>
                      {category.label}
                    </span>
                  </div>
                  <p className="text-gray-500 text-sm">Progresso: {goal.current_value} de {goal.target_value} {goal.unit}</p>
                </div>

                <div className="w-full md:w-48">
                  <div className="flex justify-between text-[10px] font-bold text-gray-500 uppercase tracking-widest mb-2">
                    <span>{Math.round(progress)}%</span>
                    <span>Meta: {goal.target_value}</span>
                  </div>
                  <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${Math.min(progress, 100)}%` }}
                      className={`h-full ${progress >= 100 ? "bg-green-400 shadow-[0_0_10px_rgba(74,222,128,0.5)]" : "bg-brand-cyan shadow-[0_0_10px_rgba(6,182,212,0.5)]"}`}
                    />
                  </div>
                </div>

                <button 
                  onClick={() => updateProgressMutation.mutate({ id: goal.id, current: goal.current_value })}
                  disabled={updateProgressMutation.isPending || progress >= 100}
                  className={`w-12 h-12 rounded-full flex items-center justify-center transition-all shrink-0 ${
                    progress >= 100 ? "bg-green-400 text-black shadow-[0_0_15px_rgba(74,222,128,0.4)]" : "bg-white/5 text-gray-400 hover:bg-brand-cyan/20 hover:text-brand-cyan border border-white/10 active:scale-90"
                  }`}
                >
                  {progress >= 100 ? <CheckCircle2 size={24} /> : <Plus size={24} />}
                </button>
              </motion.div>
            );
          })
        )}
      </div>

      <div className="mt-12 p-6 rounded-2xl bg-yellow-400/5 border border-yellow-400/10 flex items-start gap-4">
        <Target size={24} className="text-yellow-400 shrink-0" />
        <p className="text-sm text-yellow-400/80 italic">
          "As metas são como bússolas. Elas não fazem o trabalho por você, mas garantem que você esteja caminhando na direção certa."
        </p>
      </div>
    </div>
  );
}
