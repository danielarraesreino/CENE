"use client";

import React, { createContext, useContext, useEffect, useState, useMemo, useCallback } from "react";
import { useSession } from "next-auth/react";
import { isFeatureEnabled, FEATURE_FLAGS } from "@/lib/featureFlags";

interface FeatureFlagContextType {
  flags: Record<string, boolean>;
  isLoading: boolean;
  refresh: () => void;
}

const FeatureFlagContext = createContext<FeatureFlagContextType | undefined>(undefined);

export function FeatureFlagProvider({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const [flags, setFlags] = useState<Record<string, boolean>>({});
  const [isLoading, setIsLoading] = useState(true);

  const resolveFlags = useCallback(() => {
    const context = {
      userId: session?.user?.id || session?.user?.email || undefined,
      env: process.env.NODE_ENV,
    };

    const resolved: Record<string, boolean> = {};
    Object.keys(FEATURE_FLAGS).forEach((key) => {
      resolved[key] = isFeatureEnabled(key, context);
    });

    setFlags(resolved);
    setIsLoading(false);
  }, [session]);

  // Resolve as flags sempre que a sessão mudar ou na montagem
  useEffect(() => {
    if (status !== "loading") {
      resolveFlags();
    }
  }, [status, resolveFlags]);

  const value = useMemo(() => ({
    flags,
    isLoading,
    refresh: resolveFlags
  }), [flags, isLoading, resolveFlags]);

  return (
    <FeatureFlagContext.Provider value={value}>
      {children}
    </FeatureFlagContext.Provider>
  );
}

/**
 * Hook customizado para consumir feature flags em Client Components.
 */
export function useFeatureFlags() {
  const context = useContext(FeatureFlagContext);
  if (context === undefined) {
    throw new Error("useFeatureFlags deve ser usado dentro de um FeatureFlagProvider");
  }
  return context;
}

/**
 * Atalho para verificar uma flag específica.
 */
export function useFeature(flagKey: string) {
  const { flags, isLoading } = useFeatureFlags();
  return {
    enabled: flags[flagKey] ?? false,
    loading: isLoading,
  };
}
