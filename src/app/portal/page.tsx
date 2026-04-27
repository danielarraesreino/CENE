/**
 * /portal → redireciona para /portal/paciente
 */
import { redirect } from "next/navigation";

export default function PortalPage() {
  redirect("/portal/paciente");
}
