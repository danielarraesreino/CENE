"use client";

import { useState } from "react";
import { X, Settings, Shield, Palette, Globe, Save, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";
import { toast } from "sonner";

interface CMSSettingsProps {
  onClose: () => void;
  accessToken: string;
}

export function CMSSettings({ onClose, accessToken }: CMSSettingsProps) {
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("geral");

  const [settings, setSettings] = useState({
    siteName: "CENE LMS",
    defaultCategory: "Geral",
    allowComments: true,
    autoPublish: false,
    primaryColor: "#10b981"
  });

  const handleSave = async () => {
    setLoading(true);
    // Simulando salvamento de configurações globais
    setTimeout(() => {
      toast.success("Configurações do CMS atualizadas com sucesso!");
      setLoading(false);
      onClose();
    }, 1000);
  };

  const tabs = [
    { id: "geral", label: "Geral", icon: Settings },
    { id: "permissões", label: "Permissões", icon: Shield },
    { id: "aparencia", label: "Aparência", icon: Palette },
  ];

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-slate-900/60 backdrop-blur-md"
    >
      <div className="bg-white w-full max-w-4xl rounded-[3.5rem] shadow-2xl overflow-hidden border border-slate-200 flex h-[600px]">
        {/* Sidebar */}
        <div className="w-64 bg-slate-50 border-r border-slate-100 p-8 flex flex-col">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 bg-slate-900 rounded-2xl flex items-center justify-center text-white">
              <Settings size={20} />
            </div>
            <h2 className="font-black text-slate-900">Ajustes</h2>
          </div>

          <nav className="space-y-2 flex-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`w-full flex items-center gap-3 px-6 py-4 rounded-2xl font-bold text-sm transition-all ${
                  activeTab === tab.id 
                    ? "bg-white text-emerald-600 shadow-sm border border-slate-100" 
                    : "text-slate-500 hover:bg-slate-100"
                }`}
              >
                <tab.icon size={18} />
                {tab.label}
              </button>
            ))}
          </nav>

          <button onClick={onClose} className="flex items-center gap-3 px-6 py-4 text-slate-400 hover:text-slate-600 font-bold text-sm transition-all">
            <X size={18} />
            Fechar
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 flex flex-col">
          <div className="p-10 flex-1 overflow-y-auto">
            {activeTab === "geral" && (
              <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                <div>
                  <h3 className="text-2xl font-black text-slate-900 mb-2">Configurações do Estúdio</h3>
                  <p className="text-slate-500 font-medium">Defina como o conteúdo é processado e exibido.</p>
                </div>

                <div className="space-y-6">
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Nome da Plataforma</label>
                      <input 
                        className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 focus:border-emerald-500 outline-none transition-all font-bold"
                        value={settings.siteName}
                        onChange={e => setSettings({...settings, siteName: e.target.value})}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Categoria Padrão</label>
                      <select 
                        className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl px-6 py-4 focus:border-emerald-500 outline-none transition-all font-bold appearance-none"
                        value={settings.defaultCategory}
                        onChange={e => setSettings({...settings, defaultCategory: e.target.value})}
                      >
                        <option>Geral</option>
                        <option>Clínico</option>
                        <option>Acadêmico</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-4 pt-4">
                    <div className="flex items-center justify-between p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
                      <div>
                        <p className="font-black text-slate-900">Auto-publicação</p>
                        <p className="text-xs text-slate-500 font-medium">Publicar novas lições imediatamente após o salvamento.</p>
                      </div>
                      <input 
                        type="checkbox" 
                        className="w-6 h-6 rounded-lg border-slate-300 text-emerald-600 focus:ring-emerald-500"
                        checked={settings.autoPublish}
                        onChange={e => setSettings({...settings, autoPublish: e.target.checked})}
                      />
                    </div>
                    <div className="flex items-center justify-between p-6 bg-slate-50 rounded-[2rem] border border-slate-100">
                      <div>
                        <p className="font-black text-slate-900">Permitir Discussões</p>
                        <p className="text-xs text-slate-500 font-medium">Ativar área de comentários abaixo de cada lição.</p>
                      </div>
                      <input 
                        type="checkbox" 
                        className="w-6 h-6 rounded-lg border-slate-300 text-emerald-600 focus:ring-emerald-500"
                        checked={settings.allowComments}
                        onChange={e => setSettings({...settings, allowComments: e.target.checked})}
                      />
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "permissões" && (
              <div className="py-20 text-center">
                <Globe size={48} className="mx-auto text-slate-200 mb-4" />
                <p className="text-slate-400 font-medium">Configurações de visibilidade global em breve.</p>
              </div>
            )}
          </div>

          <div className="p-8 border-t border-slate-100 bg-slate-50/50 flex justify-end">
            <button 
              onClick={handleSave}
              disabled={loading}
              className="bg-emerald-600 text-white px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-xs hover:bg-emerald-700 transition-all flex items-center gap-3 shadow-lg shadow-emerald-100"
            >
              {loading ? "Salvando..." : (
                <>
                  <CheckCircle2 size={18} />
                  Salvar Preferências
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
