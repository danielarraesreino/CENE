"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { clinicalKeys } from "@/lib/api/keys";
import { toast } from "sonner";
import { 
  ChevronLeft, 
  Calendar, 
  CheckCircle, 
  XCircle,
  Save,
  Plus
} from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export default function TriggersPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const [showAdd, setShowAdd] = useState(false);

  const [newTrigger, setNewTrigger] = useState({
    gatilho: "",
    intensidade_impulso: 5,
    tecnica_utilizada: "Respiração Profunda",
    sucesso: true,
    notas: "",
  });

  // 1. Fetching
  const { data: logs, isLoading } = useQuery({
    queryKey: clinicalKeys.list({ type: 'triggers' }),
    queryFn: async () => {
      const res = await fetch(`${API_URL}/api/clinical/triggers/`, {
        headers: { Authorization: `Bearer ${session?.accessToken}` },
      });
      if (!res.ok) throw new Error("Falha ao carregar registros de gatilhos.");
      const data = await res.json();
      return Array.isArray(data) ? data : data.results || [];
    },
    enabled: !!session?.accessToken,
  });

  // 2. Mutação
  const triggerMutation = useMutation({
    mutationFn: async (payload: typeof newTrigger) => {
      const res = await fetch(`${API_URL}/api/clinical/triggers/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.accessToken}`,
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Falha ao registrar impulso.");
      return res.json();
    },
    onMutate: async (newData) => {
      await queryClient.cancelQueries({ queryKey: clinicalKeys.list({ type: 'triggers' }) });
      const previousLogs = queryClient.getQueryData(clinicalKeys.list({ type: 'triggers' }));
      
      queryClient.setQueryData(clinicalKeys.list({ type: 'triggers' }), (old: any) => {
        const optimistic = {
          ...newData,
          id: `temp-${Date.now()}`,
          timestamp: new Date().toISOString(),
        };
        return old ? [optimistic, ...old] : [optimistic];
      });

      return { previousLogs };
    },
    onError: (err: any, _, context) => {
      if (context?.previousLogs) {
        queryClient.setQueryData(clinicalKeys.list({ type: 'triggers' }), context.previousLogs);
      }
      console.warn('[REIBB_API_ERROR]', { code: 'TRIGGER_SAVE_FAILED', message: err.message });
      toast.error(err.message);
    },
    onSuccess: () => {
      toast.success("Impulso registrado com sucesso!");
      setShowAdd(false);
      setNewTrigger({ gatilho: "", intensidade_impulso: 5, tecnica_utilizada: "Respiração Profunda", sucesso: true, notas: "" });
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: clinicalKeys.list({ type: 'triggers' }) });
    }
  });

  const handleAdd = () => {
    if (!newTrigger.gatilho.trim()) {
      toast.error("Por favor, descreva o gatilho.");
      return;
    }
    triggerMutation.mutate(newTrigger);
  };

  return (
    <div className="min-h-screen p-8 md:p-12 max-w-4xl mx-auto w-full flex flex-col">
      {/* Header */}
      <div className="mb-12 flex items-center justify-between">
        <button
          onClick={() => router.push("/clinical")}
          className="text-gray-400 hover:text-white flex items-center gap-2 transition-colors"
        >
          <ChevronLeft size={20} />
          Voltar
        </button>
        <div className="flex items-center gap-2 text-green-400">
          <Calendar size={20} />
          <span className="font-bold uppercase tracking-widest text-xs">Diário de Gatilhos</span>
        </div>
      </div>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-black text-white mb-2">Monitoramento de Impulsos</h1>
          <p className="text-gray-400">Registre situações de risco e como você as superou.</p>
        </div>
        <button 
          onClick={() => setShowAdd(true)}
          disabled={showAdd}
          className="bg-green-500 hover:bg-green-600 disabled:opacity-50 text-white px-6 py-3 rounded-full font-bold flex items-center gap-2 transition-all shadow-[0_0_15px_rgba(34,197,94,0.3)]"
        >
          <Plus size={20} /> Registrar Impulso
        </button>
      </div>

      {/* Form de Adição */}
      {showAdd && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="glass-panel p-8 rounded-3xl border border-green-500/20 bg-green-500/5 mb-12"
        >
          <h2 className="text-xl font-bold text-white mb-6">O que aconteceu?</h2>
          <div className="space-y-6">
            <div>
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">O Gatilho (O que causou o desejo?)</label>
              <input 
                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-green-500 transition-all"
                placeholder="Ex: Vi uma cena de uso num filme..."
                value={newTrigger.gatilho}
                onChange={(e) => setNewTrigger({...newTrigger, gatilho: e.target.value})}
              />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Intensidade do Impulso (0-10)</label>
                <input 
                  type="range" min="0" max="10" 
                  className="w-full accent-green-500 cursor-pointer"
                  value={newTrigger.intensidade_impulso}
                  onChange={(e) => setNewTrigger({...newTrigger, intensidade_impulso: parseInt(e.target.value)})}
                />
                <div className="flex justify-between text-[10px] text-gray-500 mt-1 font-bold">
                  <span>LEVE</span>
                  <span className="text-green-400">{newTrigger.intensidade_impulso}</span>
                  <span>EXTREMA</span>
                </div>
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-widest mb-2">Técnica de Enfrentamento</label>
                <select 
                  className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white outline-none focus:border-green-500 transition-all"
                  value={newTrigger.tecnica_utilizada}
                  onChange={(e) => setNewTrigger({...newTrigger, tecnica_utilizada: e.target.value})}
                >
                  <option value="Respiração Profunda" className="bg-slate-900">Respiração Profunda</option>
                  <option value="Adiar 15 minutos" className="bg-slate-900">Adiar 15 minutos</option>
                  <option value="Ligar para Apoio" className="bg-slate-900">Ligar para Apoio</option>
                  <option value="Mudar de Ambiente" className="bg-slate-900">Mudar de Ambiente</option>
                  <option value="Exercício Físico" className="bg-slate-900">Exercício Físico</option>
                </select>
              </div>
            </div>
            <div className="flex gap-4">
              <button 
                onClick={handleAdd} 
                disabled={triggerMutation.isPending}
                className="bg-green-500 hover:bg-green-600 disabled:opacity-50 text-white font-bold px-8 py-3 rounded-xl flex items-center gap-2 transition-all shadow-lg active:scale-95"
              >
                {triggerMutation.isPending ? "Salvando..." : "Salvar Registro"} 
                <Save size={18} />
              </button>
              <button onClick={() => setShowAdd(false)} className="text-gray-500 hover:text-white font-bold px-8 py-3 transition-colors">Cancelar</button>
            </div>
          </div>
        </motion.div>
      )}

      {/* Histórico */}
      <div className="space-y-4">
        {isLoading ? (
          <div className="text-center py-20 text-gray-600">Carregando histórico...</div>
        ) : logs?.map((log: any) => (
          <div key={log.id} className="glass-panel p-6 rounded-3xl border border-white/10 flex items-center gap-6 hover:border-white/20 transition-all">
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${log.sucesso ? "bg-green-500/10 text-green-400" : "bg-red-500/10 text-red-400"}`}>
              {log.sucesso ? <CheckCircle size={24} /> : <XCircle size={24} />}
            </div>
            <div className="flex-1">
              <h3 className="text-white font-bold">{log.gatilho}</h3>
              <p className="text-gray-500 text-sm font-medium">{log.tecnica_utilizada} · Intensidade: {log.intensidade_impulso}/10</p>
            </div>
            <div className="text-right hidden sm:block">
              <span className="text-[10px] text-gray-600 font-black uppercase tracking-widest">
                {new Date(log.timestamp).toLocaleDateString()}
              </span>
            </div>
          </div>
        ))}
        {(!logs || logs.length === 0) && !isLoading && (
          <div className="text-center py-20 text-gray-600 italic border-2 border-dashed border-white/5 rounded-3xl">Nenhum registro de gatilho ainda. Continue firme!</div>
        )}
      </div>
    </div>
  );
}
