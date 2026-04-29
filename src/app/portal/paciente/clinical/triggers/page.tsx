"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { clinicalKeys } from "@/lib/api/keys";
import { toast } from "sonner";
import { 
  Calendar, 
  CheckCircle, 
  Save,
  Plus,
  Zap,
  History,
  X
} from "lucide-react";
import { Trigger } from "@/types/clinical";

import { ClinicalLayout } from "@/components/layout/ClinicalLayout";
import { ClinicalHeader } from "@/components/clinical/ui/ClinicalHeader";
import { ClinicalCard } from "@/components/clinical/ui/ClinicalCard";
import { ClinicalButton } from "@/components/clinical/ui/ClinicalButton";
import { ClinicalList, ClinicalListItem } from "@/components/clinical/ui/ClinicalList";
import { ClinicalEmptyState } from "@/components/clinical/ui/ClinicalEmptyState";

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

  const { data: logs, isLoading } = useQuery<Trigger[]>({
    queryKey: clinicalKeys.list({ type: 'triggers' }),
    queryFn: async () => {
      const res = await fetch(`${API_URL}/api/clinical/triggers/`, {
        headers: { Authorization: `Bearer ${session?.accessToken}` },
      });
      if (!res.ok) throw new Error("Falha ao carregar registros de gatilhos.");
      const data = await res.json();
      const results = Array.isArray(data) ? data : data.results || [];
      return results.map((item: any) => ({
        id: String(item.id),
        description: item.gatilho,
        intensity: item.intensidade_impulso,
        strategy: item.tecnica_utilizada,
        createdAt: item.timestamp,
        userId: '',
        updatedAt: item.timestamp
      }));
    },
    enabled: !!session?.accessToken,
  });

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
      const previousLogs = queryClient.getQueryData<Trigger[]>(clinicalKeys.list({ type: 'triggers' }));
      
      queryClient.setQueryData<Trigger[]>(clinicalKeys.list({ type: 'triggers' }), (old) => {
        const optimistic: Trigger = {
          id: `temp-${Date.now()}`,
          description: newData.gatilho,
          intensity: newData.intensidade_impulso,
          strategy: newData.tecnica_utilizada,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          userId: ''
        };
        return old ? [optimistic, ...old] : [optimistic];
      });

      return { previousLogs };
    },
    onError: (err: Error, _, context) => {
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
    <ClinicalLayout containerClassName="max-w-6xl">
      <ClinicalHeader 
        title="Monitoramento de Impulsos"
        subtitle="Registre situações de risco e como você as superou para fortalecer sua resiliência."
        icon={<Zap size={20} />}
        actions={
          <ClinicalButton 
            onClick={() => setShowAdd(true)}
            disabled={showAdd}
            icon={<Plus size={20} />}
            className="px-6 py-3"
          >
            Registrar Impulso
          </ClinicalButton>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
        {/* Form de Adição ou Lista Principal */}
        <div className="lg:col-span-2 space-y-6">
          <AnimatePresence mode="wait">
            {showAdd ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                key="add-form"
              >
                <ClinicalCard className="bg-white border-emerald-200">
                  <div className="flex items-center justify-between mb-8">
                    <h2 className="text-xl font-black text-slate-900 uppercase tracking-widest">O que aconteceu?</h2>
                    <button onClick={() => setShowAdd(false)} className="text-slate-400 hover:text-red-500">
                      <X size={24} />
                    </button>
                  </div>

                  <div className="space-y-8">
                    <div>
                      <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-3 ml-1">
                        O Gatilho (O que causou o desejo?)
                      </label>
                      <input 
                        className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-slate-800 outline-none focus:border-emerald-500 transition-all"
                        placeholder="Ex: Vi uma cena de uso num filme..."
                        value={newTrigger.gatilho}
                        onChange={(e) => setNewTrigger({...newTrigger, gatilho: e.target.value})}
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div>
                        <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-3 ml-1">
                          Intensidade (0-10)
                        </label>
                        <input 
                          type="range" min="0" max="10" 
                          className="w-full accent-emerald-600 h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer"
                          value={newTrigger.intensidade_impulso}
                          onChange={(e) => setNewTrigger({...newTrigger, intensidade_impulso: parseInt(e.target.value)})}
                        />
                        <div className="flex justify-between text-[10px] text-slate-400 mt-2 font-black">
                          <span>LEVE</span>
                          <span className="text-emerald-600 text-sm">{newTrigger.intensidade_impulso}</span>
                          <span>EXTREMA</span>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-black text-slate-500 uppercase tracking-widest mb-3 ml-1">
                          Técnica de Enfrentamento
                        </label>
                        <select 
                          className="w-full bg-slate-50 border border-slate-200 rounded-2xl px-6 py-4 text-slate-800 outline-none focus:border-emerald-500 transition-all appearance-none cursor-pointer"
                          value={newTrigger.tecnica_utilizada}
                          onChange={(e) => setNewTrigger({...newTrigger, tecnica_utilizada: e.target.value})}
                        >
                          <option value="Respiração Profunda">Respiração Profunda</option>
                          <option value="Adiar 15 minutos">Adiar 15 minutos</option>
                          <option value="Ligar para Apoio">Ligar para Apoio</option>
                          <option value="Mudar de Ambiente">Mudar de Ambiente</option>
                          <option value="Exercício Físico">Exercício Físico</option>
                        </select>
                      </div>
                    </div>

                    <div className="flex justify-end gap-4 pt-4">
                      <ClinicalButton 
                        variant="ghost"
                        onClick={() => setShowAdd(false)}
                      >
                        Cancelar
                      </ClinicalButton>
                      <ClinicalButton 
                        onClick={handleAdd} 
                        isLoading={triggerMutation.isPending}
                        icon={<Save size={20} />}
                        className="px-10"
                      >
                        Salvar Registro
                      </ClinicalButton>
                    </div>
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
                ) : logs && logs.length > 0 ? (
                  <ClinicalList>
                    {logs.map((log) => (
                      <ClinicalListItem
                        key={log.id}
                        title={log.description}
                        subtitle={new Date(log.createdAt).toLocaleDateString()}
                        description={`${log.strategy} • Intensidade: ${log.intensity}/10`}
                        icon={<CheckCircle size={20} className="text-emerald-600" />}
                      />
                    ))}
                  </ClinicalList>
                ) : (
                  <ClinicalEmptyState 
                    title="Nenhum impulso registrado"
                    description="Registrar seus gatilhos ajuda você a se preparar melhor para o futuro. Comece quando se sentir pronto."
                    icon={<History size={48} />}
                    action={
                      <ClinicalButton onClick={() => setShowAdd(true)} variant="outline">
                        Registrar Primeiro Impulso
                      </ClinicalButton>
                    }
                  />
                )}
              </div>
            )}
          </AnimatePresence>
        </div>

        {/* Sidebar Informativa */}
        <div className="space-y-6">
          <ClinicalCard variant="glass" className="p-8">
            <h3 className="text-lg font-black text-slate-900 mb-4 uppercase tracking-widest">Resumo Semanal</h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-white/50 rounded-2xl border border-white">
                <span className="text-sm text-slate-500 font-medium">Total de Impulsos</span>
                <span className="text-xl font-black text-emerald-600">{logs?.length || 0}</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed italic">
                "O autoconhecimento é a ferramenta mais poderosa contra a recaída."
              </p>
            </div>
          </ClinicalCard>
        </div>
      </div>
    </ClinicalLayout>
  );
}
