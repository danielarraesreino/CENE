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
import { InstallPrompt } from "@/components/ui/InstallPrompt";
import { PushConsentBanner } from "@/components/ui/PushConsentBanner";
import { Toaster } from "sonner";

import { cookies, headers } from "next/headers";

import { ThemeProvider } from "@/components/Providers/ThemeProvider";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const headerStore = await headers();
  const userId = headerStore.get("X-User-ID") ?? cookieStore.get("session_user_id")?.value;

  return (
    <html
      lang="pt-BR"
      className={`${inter.variable} ${outfit.variable} h-full antialiased`}
      suppressHydrationWarning
      data-flags="CLINICAL_REACT_QUERY"
    >
      <head>
        <meta name="theme-color" content="#2563eb" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="Reibb" />
        <link rel="manifest" href="/manifest.json" />
        <link rel="apple-touch-icon" href="/icons/icon-192x192.png" />
      </head>
      <body
        className="min-h-full flex flex-col text-slate-800 dark:text-slate-200 bg-slate-50 dark:bg-slate-950 overflow-x-hidden selection:bg-emerald-500 selection:text-white transition-colors duration-300"
        suppressHydrationWarning
      >
        <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
          <ErrorBoundary>
            <QueryProvider>
              <AuthProvider>
                <FeatureFlagProvider userId={userId} env={process.env.NODE_ENV}>
                  <Navbar />
                  {/* Fundo gradiente fixo está no globals.css */}
                  <main className="flex-1 flex flex-col z-10 w-full relative pt-20">
                    {children}
                  </main>
                  {/* Assistente IA global — disponível em todas as páginas autenticadas */}
                  <ClinicoCopilotWrapper />
                  <InstallPrompt />
                  <PushConsentBanner />
                  <Toaster position="top-right" richColors theme="system" />
                </FeatureFlagProvider>
              </AuthProvider>
            </QueryProvider>
          </ErrorBoundary>
        </ThemeProvider>
      </body>
    </html>
  );
}

