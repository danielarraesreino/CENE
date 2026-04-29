"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { clinicalKeys } from "@/lib/api/keys";
import { toast } from "sonner";
import { 
  Book, 
  Save, 
  History,
  Lock,
  Calendar,
  FileEdit,
  HistoryIcon
} from "lucide-react";
import { JournalEntry } from "@/types/clinical";

import { ClinicalLayout } from "@/components/layout/ClinicalLayout";
import { ClinicalHeader } from "@/components/clinical/ui/ClinicalHeader";
import { ClinicalCard } from "@/components/clinical/ui/ClinicalCard";
import { ClinicalButton } from "@/components/clinical/ui/ClinicalButton";
import { ClinicalList, ClinicalListItem } from "@/components/clinical/ui/ClinicalList";
import { ClinicalEmptyState } from "@/components/clinical/ui/ClinicalEmptyState";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000";

export default function JournalPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { data: session } = useSession();
  const [content, setContent] = useState("");

  const { data: entries, isLoading } = useQuery<JournalEntry[]>({
    queryKey: clinicalKeys.list({ type: 'journal' }),
    queryFn: async () => {
      const res = await fetch(`${API_URL}/api/clinical/journal/`, {
        headers: { Authorization: `Bearer ${session?.accessToken}` },
      });
      if (!res.ok) throw new Error("Não foi possível carregar seu diário.");
      const data = await res.json();
      const results = Array.isArray(data) ? data : data.results || [];
      return results.map((item: Record<string, unknown>) => ({
        id: String(item.id),
        content: String(item.content),
        createdAt: String(item.date || item.created_at),
        updatedAt: String(item.date || item.created_at),
        userId: ''
      }));
    },
    enabled: !!session?.accessToken,
  });

  const saveMutation = useMutation({
    mutationFn: async (newEntry: Partial<JournalEntry>) => {
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
    onMutate: async (newEntry: Partial<JournalEntry>) => {
      await queryClient.cancelQueries({ queryKey: clinicalKeys.list({ type: 'journal' }) });
      const previousEntries = queryClient.getQueryData<JournalEntry[]>(clinicalKeys.list({ type: 'journal' }));
      
      queryClient.setQueryData<JournalEntry[]>(clinicalKeys.list({ type: 'journal' }), (old) => {
        const optimistic: JournalEntry = {
          content: newEntry.content || "",
          id: `temp-${Date.now()}`,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          userId: ''
        };
        return old ? [optimistic, ...old] : [optimistic];
      });

      return { previousEntries };
    },
    onError: (err: Error, _, context: unknown) => {
      const ctx = context as { previousEntries?: JournalEntry[] };
      if (ctx?.previousEntries) {
        queryClient.setQueryData(clinicalKeys.list({ type: 'journal' }), ctx.previousEntries);
      }
      console.warn('[REIBB_API_ERROR]', { code: 'JOURNAL_SAVE_FAILED', message: err.message });
      toast.error(err.message);
    },
    onSuccess: () => {
      toast.success("Reflexão salva com sucesso!");
      setContent("");
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: clinicalKeys.list({ type: 'journal' }) });
    }
  });

  const handleSave = () => {
    if (!content.trim()) return;
    saveMutation.mutate({ content });
  };

  return (
    <ClinicalLayout containerClassName="max-w-6xl">
      <ClinicalHeader 
        title="Reflexão do Dia"
        subtitle="Como foi seu dia? Reservar um momento para refletir ajuda no seu processo de autoconhecimento."
        icon={<Book size={20} />}
        actions={
          <div className="flex items-center gap-2 text-pink-600 bg-pink-50 px-4 py-2 rounded-full border border-pink-100">
            <Lock size={14} />
            <span className="font-bold uppercase tracking-widest text-[10px]">Criptografado</span>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12 items-start">
        {/* Coluna de Escrita */}
        <div className="lg:col-span-2 space-y-6">
          <ClinicalCard className="bg-white min-h-[500px] flex flex-col">
            <div className="flex items-center gap-2 mb-6 text-slate-400">
              <FileEdit size={18} />
              <span className="text-sm font-bold uppercase tracking-widest">Nova Entrada</span>
            </div>
            
            <textarea
              className="w-full flex-1 bg-slate-50 border border-slate-200 rounded-[2rem] p-8 text-xl text-slate-800 outline-none focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/5 transition-all resize-none placeholder:text-slate-300"
              placeholder="Comece a escrever seus pensamentos..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
            
            <div className="mt-8 flex justify-end">
              <ClinicalButton
                onClick={handleSave}
                disabled={!content.trim()}
                isLoading={saveMutation.isPending}
                icon={<Save size={20} />}
                className="w-full md:w-auto px-10"
              >
                Salvar no Diário
              </ClinicalButton>
            </div>
          </ClinicalCard>
        </div>

        {/* Coluna de Histórico */}
        <div className="space-y-6">
          <div className="flex items-center gap-3 px-2 text-slate-900">
            <HistoryIcon size={24} className="text-emerald-600" />
            <h2 className="text-xl font-black">Histórico</h2>
          </div>

          <div className="max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
            {isLoading ? (
              <div className="space-y-4">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-32 bg-slate-100 animate-pulse rounded-3xl" />
                ))}
              </div>
            ) : entries && entries.length > 0 ? (
              <ClinicalList>
                {entries.map((entry) => (
                  <ClinicalListItem
                    key={entry.id}
                    title="Entrada Diária"
                    subtitle={new Date(entry.createdAt).toLocaleDateString()}
                    description={entry.content}
                    icon={<Calendar size={16} />}
                  />
                ))}
              </ClinicalList>
            ) : (
              <ClinicalEmptyState 
                title="Nada ainda"
                description="Suas reflexões anteriores aparecerão aqui quando você começar a escrever."
                icon={<History size={48} />}
              />
            )}
          </div>
        </div>
      </div>
    </ClinicalLayout>
  );
}
