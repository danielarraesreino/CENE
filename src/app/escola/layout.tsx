/**
 * Layout da Escola do Aluno — /escola/aluno/*
 *
 * Área dedicada a psicólogos e profissionais em formação especializada
 * em TUS (Transtornos de Uso de Substâncias), seguindo o legado do
 * Instituto Padre Haroldo e da FEBRACT.
 */
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: {
    template: "%s | Escola REIBB",
    default: "Escola de Especialização — REIBB",
  },
  description:
    "Formação especializada em Dependência Química e TCC para psicólogos, terapeutas e equipes de comunidades terapêuticas.",
};

export default function EscolaLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
