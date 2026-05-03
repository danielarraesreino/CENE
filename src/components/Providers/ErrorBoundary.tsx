"use client";

import React, { ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCw, Home } from "lucide-react";
import * as Sentry from "@sentry/nextjs";

interface Props {
  children: ReactNode;
  /** Renderiza fallback customizado ao invés da tela padrão de erro */
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    // Envia o erro ao Sentry com contexto completo do component stack
    Sentry.captureException(error, {
      extra: {
        componentStack: errorInfo.componentStack,
      },
    });
    console.error("[ErrorBoundary] Erro capturado:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-slate-950">
          <div className="glass-panel p-12 rounded-[3rem] border border-red-500/20 max-w-lg w-full text-center relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-red-500 to-orange-500" />
            
            <div className="w-20 h-20 bg-red-500/10 rounded-3xl flex items-center justify-center mx-auto mb-8">
              <AlertTriangle size={40} className="text-red-500" />
            </div>

            <h1 className="text-3xl font-black text-white mb-4">Ops! Algo deu errado</h1>
            <p className="text-gray-400 mb-8 leading-relaxed">
              Ocorreu um erro inesperado na interface. Nossa equipe técnica já foi notificada e estamos trabalhando para resolver.
            </p>

            {process.env.NODE_ENV === "development" && (
              <div className="mb-8 p-4 bg-red-500/5 border border-red-500/10 rounded-2xl text-left overflow-auto max-h-40">
                <p className="text-xs font-mono text-red-400">{this.state.error?.toString()}</p>
              </div>
            )}

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button
                onClick={this.handleReset}
                className="bg-white text-black px-8 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-gray-100 transition-all active:scale-95"
              >
                <RefreshCw size={20} />
                Tentar Novamente
              </button>
              <button
                onClick={() => (window.location.href = "/")}
                className="bg-white/5 text-white border border-white/10 px-8 py-4 rounded-2xl font-bold flex items-center justify-center gap-2 hover:bg-white/10 transition-all active:scale-95"
              >
                <Home size={20} />
                Voltar ao Início
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
