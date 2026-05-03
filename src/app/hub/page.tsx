import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";

export default async function HubPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/login");
  }

  const role = (session?.user as any)?.role;

  if (role === "admin" || role === "supervisor" || role === "psychologist" || role === "attendant") {
    redirect("/instrutor");
  }

  if (role === "patient") {
    redirect("/portal/paciente/clinical");
  }

  // Fallback para Aluno (EdTech)
  redirect("/escola/aluno");
}
