"use client";

import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useSession } from "next-auth/react";
import { useRagChat } from "@/hooks/useRagChat";
import { useProgressStore } from "@/store/useProgressStore";
import { Send, X, MessageSquareQuote, Sparkles, Brain } from "lucide-react";

const quickQuestions = [
  "O que é prevenção à recaída?",
  "Como lidar com gatilhos de fissura?",
  "O que é o Projeto de Vida?",
  "Como a família pode ajudar?",
];

export default function ClinicoCopilot() {
  const { data: session } = useSession();
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState("");
  const { messages, sendMessage, loading } = useRagChat();
  const caminhosStats = useProgressStore((s) => s.caminhosStats);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    sendMessage(input);
    setInput("");
  };

  return (
    <>
      {/* Botão flutuante Premium */}
      <motion.button
        id="renascer-copilot-toggle"
        aria-label={open ? "Fechar Assistente" : "Abrir Assistente"}
        onClick={() => setOpen((v) => !v)}
        whileHover={{ scale: 1.1, rotate: 5 }}
        whileTap={{ scale: 0.9 }}
        className={`fixed bottom-8 right-8 w-20 h-20 rounded-3xl z-[200] flex items-center justify-center shadow-2xl transition-all duration-500 ${
          open 
          ? "bg-emerald-800 rotate-90 text-white border border-emerald-700/50" 
          : "bg-gradient-to-br from-emerald-400 to-emerald-600 text-white shadow-[0_10px_40px_rgba(5,150,105,0.4)]"
        }`}
      >
        {open ? <X size={32} /> : <MessageSquareQuote size={36} />}
      </motion.button>

      {/* Painel de chat Premium */}
      <AnimatePresence>
        {open && (
          <motion.div
            id="renascer-copilot-panel"
            initial={{ opacity: 0, scale: 0.9, y: 40, filter: "blur(10px)" }}
            animate={{ opacity: 1, scale: 1, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, scale: 0.9, y: 40, filter: "blur(10px)" }}
            transition={{ type: "spring", stiffness: 300, damping: 25 }}
            className="fixed bottom-32 right-8 w-[min(500px,calc(100vw-48px))] h-[700px] z-[199] flex flex-col glass-panel rounded-[3rem] border-slate-200 shadow-[0_40px_100px_rgba(0,0,0,0.15)] overflow-hidden"
          >
            {/* Header */}
            <header className="p-8 bg-gradient-to-b from-emerald-50 to-transparent border-b border-slate-100 flex items-center gap-5">
              <div className="w-14 h-14 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-lg shadow-emerald-900/20">
                <Brain size={32} />
              </div>
              <div>
                <h3 className="text-2xl font-black text-slate-900 leading-tight">Assistente CENE</h3>
                <div className="flex items-center gap-2 text-emerald-600 font-bold uppercase tracking-widest text-[10px] mt-1">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  IA Especializada em TCC
                </div>
              </div>
            </header>

            {/* Mensagens */}
            <div className="flex-1 overflow-y-auto p-8 space-y-6 scrollbar-hide">
              {messages.map((msg, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, x: msg.role === "user" ? 20 : -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}
                >
                  <div className={`max-w-[85%] p-6 rounded-3xl text-lg md:text-xl font-medium leading-relaxed shadow-lg ${
                    msg.role === "user"
                      ? "bg-emerald-600 text-white rounded-tr-none"
                      : "bg-slate-50 text-slate-800 border border-slate-200 rounded-tl-none"
                  }`}>
                    {msg.content || <span className="opacity-50 animate-pulse">Processando...</span>}
                  </div>
                </motion.div>
              ))}
              {loading && (
                <div className="flex gap-2 p-2">
                  {[0, 1, 2].map((d) => (
                    <motion.div
                      key={d}
                      className="w-3 h-3 rounded-full bg-emerald-500/50"
                      animate={{ y: [0, -10, 0] }}
                      transition={{ repeat: Infinity, duration: 0.8, delay: d * 0.15 }}
                    />
                  ))}
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Quick questions e Contexto */}
            {messages.length === 1 && (
              <div className="px-8 pb-4 flex flex-col gap-4">
                <div className="flex flex-wrap gap-2">
                  {quickQuestions.map((q) => (
                    <button
                      key={q}
                      onClick={() => sendMessage(q)}
                      className="px-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-emerald-700 text-xs font-black uppercase tracking-widest hover:bg-slate-100 transition-all"
                    >
                      {q}
                    </button>
                  ))}
                </div>
                
                {caminhosStats && (session as any)?.user?.role !== "patient" && (
                  <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-2xl flex flex-col gap-2">
                    <div className="flex items-center gap-2 text-emerald-700 font-bold text-sm">
                      <Sparkles size={16} /> 
                      Análise do Simulador disponível
                    </div>
                    <button
                      onClick={() => sendMessage(`Acabei de jogar o simulador Caminhos da Superação. Minha pontuação final foi: Resiliência ${caminhosStats.resilience}/100 e Conexão Social ${caminhosStats.social}/100. Baseado nisso e nos princípios da TCC, qual conselho você me daria?`)}
                      className="text-left text-sm text-slate-600 hover:text-emerald-700 transition-colors"
                    >
                      Clique aqui para pedir à IA que avalie seu desempenho de Resiliência ({caminhosStats.resilience}) e Conexão ({caminhosStats.social}).
                    </button>
                  </div>
                )}
              </div>
            )}

            {/* Input Area */}
            <footer className="p-8 border-t border-slate-100 bg-slate-50">
              <div className="relative flex items-center gap-4">
                <input
                  id="renascer-copilot-input"
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Como posso te ajudar hoje?"
                  className="flex-1 bg-white border-2 border-slate-200 rounded-2xl py-6 px-8 text-xl text-slate-900 placeholder-slate-400 focus:outline-none focus:border-emerald-500 transition-all font-medium"
                />
                <button
                  onClick={handleSend}
                  disabled={loading || !input.trim()}
                  className="w-16 h-16 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-lg shadow-emerald-900/20 hover:scale-105 active:scale-95 disabled:opacity-30 transition-all"
                >
                  <Send size={28} />
                </button>
              </div>
            </footer>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
