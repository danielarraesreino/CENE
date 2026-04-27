import React from "react";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { GlobalErrorToast } from "@/components/GlobalErrorToast";

export default function ClinicalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <ErrorBoundary>
      {children}
      <GlobalErrorToast />
    </ErrorBoundary>
  );
}
