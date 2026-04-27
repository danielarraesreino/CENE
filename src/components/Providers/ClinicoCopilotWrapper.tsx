"use client";

import dynamic from "next/dynamic";
import { usePathname } from "next/navigation";

const ClinicoCopilot = dynamic(
  () => import("@/components/features/chat/ClinicoCopilot"),
  { ssr: false }
);

export function ClinicoCopilotWrapper() {
  const pathname = usePathname();
  if (pathname === "/" || pathname === "/login" || pathname === "/register") return null;
  return <ClinicoCopilot />;
}
