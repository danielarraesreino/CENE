import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-sans",
  subsets: ["latin"],
});

const outfit = Outfit({
  variable: "--font-heading",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Rei Bebê Interativo",
  description: "Uma jornada imersiva de recuperação e autoconhecimento.",
};

import { AuthProvider } from "@/components/Providers/AuthProvider";

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
        className="min-h-full flex flex-col text-gray-100 overflow-x-hidden selection:bg-brand-accent selection:text-white"
        suppressHydrationWarning
      >
        <AuthProvider>
          {/* Fundo gradiente fixo está no globals.css */}
          <main className="flex-1 flex flex-col z-10 w-full relative">
            {children}
          </main>
        </AuthProvider>
      </body>
    </html>
  );
}
