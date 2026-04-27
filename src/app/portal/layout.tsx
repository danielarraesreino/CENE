/**
 * Layout do Portal do Paciente — /portal/paciente/*
 *
 * Separa visualmente a área do paciente da área do aluno (escola).
 * Mantém a mesma estrutura do root layout mas com metadados específicos
 * e espaço para uma sidebar lateral futura.
 */
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    template: "%s | Portal Renascer",
    default: "Portal do Paciente — REIBB",
  },
  description:
    "Área segura do paciente. Trilhas de recuperação, ferramentas TCC e suporte com IA empática.",
};

export default function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // O layout herdado do root (Navbar, ClinicoCopilot, AuthProvider) já cobre
  // tudo que é necessário. Este layout existe para metadados e extensibilidade futura.
  return <>{children}</>;
}
