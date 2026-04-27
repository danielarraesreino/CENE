import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";
import dynamic from "next/dynamic";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-heading",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CENE - Especialização e Desenvolvimento",
  description: "Especialize-se com os maiores especialistas do Brasil em Dependência Química, PSR e Gerontologia.",
};

import { AuthProvider } from "@/components/Providers/AuthProvider";
import { QueryProvider } from "@/components/Providers/QueryProvider";
import { ErrorBoundary } from "@/components/Providers/ErrorBoundary";
import { FeatureFlagProvider } from "@/components/Providers/FeatureFlagProvider";
import { ClinicoCopilotWrapper } from "@/components/Providers/ClinicoCopilotWrapper";
import Navbar from "@/components/layout/Navbar";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {

  return (
    <html
      lang="pt-BR"
      className={`${inter.variable} ${outfit.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body
        className="min-h-full flex flex-col text-slate-800 overflow-x-hidden selection:bg-emerald-500 selection:text-white"
        suppressHydrationWarning
      >
        <ErrorBoundary>
          <QueryProvider>
            <AuthProvider>
              <FeatureFlagProvider>
                <Navbar />
                {/* Fundo gradiente fixo está no globals.css */}
                <main className="flex-1 flex flex-col z-10 w-full relative pt-20">
                  {children}
                </main>
                {/* Assistente IA global — disponível em todas as páginas autenticadas */}
                <ClinicoCopilotWrapper />
              </FeatureFlagProvider>
            </AuthProvider>
          </QueryProvider>
        </ErrorBoundary>
      </body>
    </html>
  );
}

