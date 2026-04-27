"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { clinicalKeys } from "@/lib/api/keys";
import { toast } from "sonner";
import { 
  ChevronLeft, 
  Smile, 
  Meh, 
  Frown, 
  CloudRain, 
  Sun,
  Save,
  Activity,
  CheckCircle2
} from "lucide-react";

const moods = [
  { value: 1, label: "Péssimo", icon: CloudRain, color: "text-red-500", bg: "bg-red-50", hover: "hover:bg-red-100 hover:border-red-300" },
  { value: 3, label: "Ruim", icon: Frown, color: "text-orange-400", bg: "bg-orange-50", hover: "hover:bg-orange-100 hover:border-orange-300" },
  { value: 5, label: "Neutro", icon: Meh, color: "text-yellow-500", bg: "bg-yellow-50", hover: "hover:bg-yellow-100 hover:border-yellow-300" },
  { value: 8, label: "Bem", icon: Smile, color: "text-green-500", bg: "bg-green-50", hover: "hover:bg-green-100 hover:border-green-300" },
  { value: 10, label: "Excelente", icon: Sun, color: "text-emerald-600", bg: "bg-emerald-50", hover: "hover:bg-emerald-100 hover:border-emerald-300" },
];

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export default function MoodPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const [selectedMood, setSelectedMood] = useState<number | null>(null);
  const [notes, setNotes] = useState("");

  const moodMutation = useMutation({
    mutationFn: async (payload: any) => {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 8000);

      const res = await fetch(`${API_URL}/api/clinical/mood/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.accessToken}`,
        },
        body: JSON.stringify(payload),
        signal: controller.signal
      });

      clearTimeout(timeoutId);
      if (!res.ok) throw new Error("Falha ao salvar registro de humor.");
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: clinicalKeys.list({ type: 'mood' }) });
      toast.success("Registro de humor salvo com sucesso!");
      // O redirect agora acontece na UI dependendo do estado isSuccess
    },
    onError: (err: any) => {
      console.warn('[REIBB_API_ERROR]', { code: 'MOOD_SAVE_FAILED', message: err.message });
      toast.error(err.message || "Erro de conexão ao salvar registro.");
    }
  });

  const handleSubmit = () => {
    if (selectedMood === null) return;
    moodMutation.mutate({
      mood: selectedMood,
      notes: notes,
      emotions: [],
      activities: [],
    });
  };

  // Se a mutação foi um sucesso, mostra a tela de sucesso e redireciona
  if (moodMutation.isSuccess) {
    // Timer para redirecionar após animação
    setTimeout(() => {
      router.push("/portal/paciente/clinical");
    }, 1500);

    return (
      <div className="min-h-screen flex flex-col items-center justify-center p-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          className="glass-panel p-12 rounded-[3rem] text-center max-w-md w-full border border-emerald-200"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, damping: 15, delay: 0.1 }}
            className="w-24 h-24 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <CheckCircle2 size={48} className="text-emerald-600" />
          </motion.div>
          <h2 className="text-3xl font-black text-slate-900 mb-2">Registro Salvo!</h2>
          <p className="text-slate-500 font-medium">Redirecionando...</p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-8 md:p-12 max-w-4xl mx-auto w-full flex flex-col">
      {/* Header */}
      <div className="mb-12 flex items-center justify-between">
        <button
          onClick={() => router.push("/portal/paciente/clinical")}
          className="text-slate-500 hover:text-emerald-700 font-bold flex items-center gap-2 transition-colors"
        >
          <ChevronLeft size={20} />
          Voltar para Ferramentas
        </button>
        <div className="flex items-center gap-2 text-emerald-700">
          <Activity size={20} />
          <span className="font-bold uppercase tracking-widest text-xs">Diário de Humor</span>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-panel p-8 md:p-12 rounded-[3rem] border border-slate-200 text-center bg-white"
      >
        <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-4">Como você está se sentindo hoje?</h1>
        <p className="text-slate-600 mb-12 text-lg">O registro diário ajuda a identificar gatilhos e padrões de comportamento.</p>

        {/* Seleção de Humor */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {moods.map((m) => {
            const Icon = m.icon;
            const isSelected = selectedMood === m.value;
            return (
              <button
                key={m.value}
                onClick={() => setSelectedMood(m.value)}
                className={`flex flex-col items-center p-6 w-[110px] rounded-3xl border-2 transition-all ${
                  isSelected 
                    ? `border-emerald-500 bg-emerald-50 scale-110 shadow-[0_15px_30px_rgba(5,150,105,0.2)]` 
                    : `border-slate-100 bg-white ${m.hover}`
                }`}
              >
                <Icon size={48} className={isSelected ? "text-emerald-600" : "text-slate-400"} />
                <span className={`mt-4 text-sm font-black uppercase tracking-wider ${
                  isSelected ? "text-slate-900" : "text-slate-500"
                }`}>
                  {m.label}
                </span>
              </button>
            );
          })}
        </div>

        {/* Notas */}
        <div className="text-left mb-12">
          <label className="block text-slate-600 text-sm font-bold uppercase tracking-widest mb-3 ml-1">
            Alguma observação importante? (Opcional)
          </label>
          <textarea
            className="w-full h-32 bg-slate-50 border border-slate-200 rounded-3xl p-5 text-slate-800 text-base focus:border-emerald-500 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all resize-none placeholder:text-slate-400"
            placeholder="Ex: Tive um dia produtivo e consegui manter o foco..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </div>

        <button
          onClick={handleSubmit}
          disabled={moodMutation.isPending || selectedMood === null}
          className="w-full md:w-auto bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 disabled:text-slate-500 text-white px-14 py-5 rounded-full font-black text-lg shadow-[0_10px_40px_rgba(5,150,105,0.3)] disabled:shadow-none flex items-center justify-center gap-3 transition-all mx-auto active:scale-95"
        >
          {moodMutation.isPending ? "Registrando..." : "Salvar Registro"}
          {!moodMutation.isPending && <Save size={22} />}
        </button>
      </motion.div>
    </div>
  );
}
