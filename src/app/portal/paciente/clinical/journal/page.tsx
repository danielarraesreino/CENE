"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Session } from "next-auth";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { clinicalKeys } from "@/lib/api/keys";
import { toast } from "sonner";
import { 
  ChevronLeft, 
  BookHeart, 
  Save, 
  Lock, 
  History,
  Sparkles,
  Search
} from "lucide-react";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export default function JournalPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: session } = useSession() as { data: Session | null };
  const [content, setContent] = useState("");
  const [mood, setMood] = useState<number | null>(null);

  const { data: entries, isLoading } = useQuery({
    queryKey: clinicalKeys.list({ type: 'journal' }),
    queryFn: async () => {
      const res = await fetch(`${API_URL}/api/clinical/journal/`, {
        headers: { Authorization: `Bearer ${session?.accessToken}` },
      });
      if (!res.ok) throw new Error("Não foi possível carregar seu diário.");
      const data = await res.json();
      return Array.isArray(data) ? data : data.results || [];
    },
    enabled: !!session?.accessToken,
  });

  const saveMutation = useMutation({
    mutationFn: async (newEntry: any) => {
      const res = await fetch(`${API_URL}/api/clinical/journal/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session?.accessToken}`,
        },
        body: JSON.stringify(newEntry),
      });
      if (!res.ok) throw new Error("Não foi possível salvar sua reflexão.");
      return res.json();
    },
    onMutate: async (newEntry) => {
      await queryClient.cancelQueries({ queryKey: clinicalKeys.list({ type: 'journal' }) });
      const previousEntries = queryClient.getQueryData(clinicalKeys.list({ type: 'journal' }));
      
      queryClient.setQueryData(clinicalKeys.list({ type: 'journal' }), (old: any) => {
        const optimistic = {
          ...newEntry,
          id: `temp-${Date.now()}`,
          date: new Date().toISOString(),
        };
        return old ? [optimistic, ...old] : [optimistic];
      });

      return { previousEntries };
    },
    onError: (err: any, _, context) => {
      if (context?.previousEntries) {
        queryClient.setQueryData(clinicalKeys.list({ type: 'journal' }), context.previousEntries);
      }
      console.warn('[REIBB_API_ERROR]', { code: 'JOURNAL_SAVE_FAILED', message: err.message });
      toast.error(err.message);
    },
    onSuccess: () => {
      toast.success("Reflexão salva com sucesso!");
      setContent("");
      setMood(null);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: clinicalKeys.list({ type: 'journal' }) });
    }
  });

  const handleSave = () => {
    if (!content.trim()) return;
    saveMutation.mutate({
      content,
      mood_score: mood,
      entry_type: "reflection"
    });
  };

  return (
    <div className="min-h-screen p-8 md:p-12 max-w-6xl mx-auto w-full grid grid-cols-1 lg:grid-cols-3 gap-12">
      
      {/* Coluna de Escrita */}
      <div className="lg:col-span-2 flex flex-col">
        <div className="mb-8 flex items-center justify-between">
          <button
            onClick={() => router.push("/clinical")}
            className="text-gray-400 hover:text-white flex items-center gap-2 transition-colors"
          >
            <ChevronLeft size={20} />
            Voltar
          </button>
          <div className="flex items-center gap-2 text-pink-400">
            <Lock size={16} />
            <span className="font-bold uppercase tracking-widest text-xs">Diário Privado Criptografado</span>
          </div>
        </div>

        <header className="mb-8">
          <h1 className="text-4xl font-black text-white mb-2">Reflexão do Dia</h1>
          <p className="text-gray-400">Como foi seu dia? Alguma conquista ou desafio?</p>
        </header>

        <div className="glass-panel p-1 rounded-3xl border border-white/10 focus-within:border-pink-500/50 transition-all">
          <textarea
            className="w-full h-80 bg-transparent p-8 text-white text-lg outline-none resize-none leading-relaxed"
            placeholder="Comece a escrever..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          <div className="p-6 bg-white/5 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6 rounded-b-3xl">
            <div className="flex items-center gap-4">
              <span className="text-xs font-bold text-gray-500 uppercase tracking-widest">Humor:</span>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((val) => (
                  <button
                    key={val}
                    onClick={() => setMood(val)}
                    className={`w-8 h-8 rounded-full border transition-all flex items-center justify-center text-sm font-bold ${
                      mood === val ? "bg-pink-500 border-pink-400 text-white" : "border-white/10 text-gray-500 hover:border-pink-500/50"
                    }`}
                  >
                    {val}
                  </button>
                ))}
              </div>
            </div>
            <button
              onClick={handleSave}
              disabled={saveMutation.isPending || !content.trim()}
              className="w-full md:w-auto bg-pink-500 hover:bg-pink-600 disabled:opacity-50 text-white px-10 py-4 rounded-2xl font-bold shadow-[0_0_20px_rgba(236,72,153,0.3)] flex items-center justify-center gap-2 transition-all"
            >
              {saveMutation.isPending ? "Salvando..." : "Salvar Reflexão"}
              <Save size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Coluna de Histórico */}
      <div className="flex flex-col">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-2 text-gray-400">
            <History size={18} />
            <span className="font-bold uppercase tracking-widest text-xs">Entradas Recentes</span>
          </div>
          <button className="text-gray-600 hover:text-white transition-colors">
            <Search size={18} />
          </button>
        </div>

        <div className="space-y-4 overflow-y-auto max-h-[70vh] pr-2 custom-scrollbar">
          {isLoading ? (
            <div className="text-center py-12 text-gray-600">Carregando...</div>
          ) : entries?.map((entry: any) => (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              key={entry.id} 
              className="glass-panel p-5 rounded-2xl border border-white/5 hover:border-white/10 transition-all cursor-pointer group"
            >
              <div className="flex justify-between items-start mb-3">
                <span className="text-[10px] font-black uppercase tracking-widest text-pink-400">
                  {new Date(entry.date).toLocaleDateString()}
                </span>
                {entry.mood_score && (
                  <span className="text-[10px] bg-white/5 px-2 py-1 rounded-md text-gray-500 font-bold">
                    Humor: {entry.mood_score}/5
                  </span>
                )}
              </div>
              <p className="text-gray-400 text-sm line-clamp-3 leading-relaxed group-hover:text-gray-300">
                {entry.content}
              </p>
            </motion.div>
          ))}
          {(!entries || entries.length === 0) && !isLoading && (
            <div className="text-center py-20 border-2 border-dashed border-white/5 rounded-3xl">
              <BookHeart size={40} className="mx-auto text-gray-700 mb-4 opacity-20" />
              <p className="text-gray-600 text-sm italic">Seu diário ainda está vazio.</p>
            </div>
          )}
        </div>

        <div className="mt-8 p-6 rounded-2xl bg-pink-500/5 border border-pink-500/10 flex items-start gap-3">
          <Sparkles size={20} className="text-pink-400 shrink-0" />
          <p className="text-[10px] text-pink-400/60 leading-relaxed italic">
            "Escrever é a geometria da alma." — Use este espaço para esvaziar a mente e celebrar pequenas vitórias.
          </p>
        </div>
      </div>
    </div>
  );
}
