import ClinicoCopilot from "@/components/features/chat/ClinicoCopilot";
import { MessageSquareQuote } from "lucide-react";

export default function ChatPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 text-center relative overflow-hidden">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-brand-accent/10 rounded-full blur-[120px] -z-10" />

      <div className="w-20 h-20 bg-white/5 rounded-2xl flex items-center justify-center mb-8 border border-white/10 text-brand-cyan">
        <MessageSquareQuote size={40} />
      </div>

      <h1 className="text-4xl md:text-5xl font-heading font-black text-white mb-6">
        Assistente Renascer
      </h1>
      
      <p className="text-lg text-gray-400 max-w-2xl mb-12">
        A inteligência artificial treinada no método de Prevenção à Recaída e Projeto de Vida. 
        Você pode acessá-la a qualquer momento clicando no botão flutuante no canto inferior direito.
      </p>

      {/* Componente Flutuante renderizado nativamente aqui */}
      <ClinicoCopilot />
      
      <div className="glass-panel p-6 rounded-3xl border border-white/10 max-w-md">
        <p className="text-sm text-gray-500 font-bold uppercase tracking-widest mb-4">
          Tópicos Recomendados
        </p>
        <div className="flex flex-wrap gap-2 justify-center">
          <span className="bg-white/5 border border-white/10 px-4 py-2 rounded-full text-xs text-brand-cyan">"Diferença entre lapso e recaída"</span>
          <span className="bg-white/5 border border-white/10 px-4 py-2 rounded-full text-xs text-brand-cyan">"Como estruturar meu dia"</span>
          <span className="bg-white/5 border border-white/10 px-4 py-2 rounded-full text-xs text-brand-cyan">"Codependência"</span>
        </div>
      </div>
    </div>
  );
}
