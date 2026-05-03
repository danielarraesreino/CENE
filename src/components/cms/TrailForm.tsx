"use client";

import { useState } from "react";
import { Plus, Save, X, Type, FileText, Layout, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";

interface TrailFormProps {
  onClose: () => void;
  onSuccess: () => void;
  accessToken: string;
}

export function TrailForm({ onClose, onSuccess, accessToken }: TrailFormProps) {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    description: "",
    category: "Geral",
    is_premium: false
  });

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';
      const res = await fetch(`${baseUrl}/api/content/cms/trails/`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        toast.success("Trilha criada com sucesso!");
        onSuccess();
        onClose();
      } else {
        const err = await res.json();
        toast.error(`Erro: ${JSON.stringify(err)}`);
      }
    } catch (err) {
      toast.error("Erro de conexão");
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/40 backdrop-blur-sm"
    >
      <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden border border-slate-200">
        <div className="p-8 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-emerald-600 rounded-xl flex items-center justify-center text-white">
              <Plus size={20} />
            </div>
            <div>
              <h2 className="text-xl font-black text-slate-900">Nova Trilha de Aprendizado</h2>
              <p className="text-xs text-slate-500 font-bold uppercase tracking-widest">Passo {step} de 2</p>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-200 rounded-full transition-colors">
            <X size={20} className="text-slate-400" />
          </button>
        </div>

        <div className="p-10">
          <AnimatePresence mode="wait">
            {step === 1 ? (
              <motion.div 
                key="step1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-xs font-black text-slate-500 uppercase tracking-widest">
                    <Type size={14} /> Título da Trilha
                  </label>
                  <input 
                    placeholder="Ex: Introdução à TCC para Ansiedade"
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 focus:border-emerald-500 outline-none transition-all font-medium"
                    value={formData.title}
                    onChange={e => {
                      const val = e.target.value;
                      setFormData({...formData, title: val, slug: val.toLowerCase().replace(/ /g, '-')});
                    }}
                  />
                </div>
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-xs font-black text-slate-500 uppercase tracking-widest">
                    <Layout size={14} /> Slug amigável (URL)
                  </label>
                  <input 
                    placeholder="tcc-ansiedade"
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 focus:border-emerald-500 outline-none transition-all font-mono text-sm"
                    value={formData.slug}
                    onChange={e => setFormData({...formData, slug: e.target.value})}
                  />
                </div>
                <button 
                  disabled={!formData.title}
                  onClick={() => setStep(2)}
                  className="w-full bg-slate-900 text-white py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-black transition-all disabled:opacity-50"
                >
                  Continuar
                </button>
              </motion.div>
            ) : (
              <motion.div 
                key="step2"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="space-y-2">
                  <label className="flex items-center gap-2 text-xs font-black text-slate-500 uppercase tracking-widest">
                    <FileText size={14} /> Descrição Detalhada
                  </label>
                  <textarea 
                    rows={4}
                    placeholder="Descreva os objetivos e o público-alvo desta trilha..."
                    className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 focus:border-emerald-500 outline-none transition-all font-medium resize-none"
                    value={formData.description}
                    onChange={e => setFormData({...formData, description: e.target.value})}
                  />
                </div>
                <div className="flex items-center gap-4 p-6 bg-slate-50 rounded-2xl border border-slate-100">
                  <input 
                    type="checkbox"
                    id="is_premium"
                    className="w-5 h-5 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                    checked={formData.is_premium}
                    onChange={e => setFormData({...formData, is_premium: e.target.checked})}
                  />
                  <label htmlFor="is_premium" className="text-sm font-black text-slate-700">Conteúdo Premium (Exclusivo)</label>
                </div>
                <div className="flex gap-4 pt-4">
                  <button 
                    onClick={() => setStep(1)}
                    className="flex-1 bg-slate-100 text-slate-600 py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-slate-200 transition-all"
                  >
                    Voltar
                  </button>
                  <button 
                    onClick={handleSubmit}
                    disabled={loading}
                    className="flex-[2] bg-emerald-600 text-white py-5 rounded-2xl font-black uppercase tracking-widest hover:bg-emerald-700 transition-all shadow-lg shadow-emerald-200 flex items-center justify-center gap-3"
                  >
                    {loading ? "Salvando..." : (
                      <>
                        <CheckCircle2 size={20} />
                        Publicar Trilha
                      </>
                    )}
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.div>
  );
}
