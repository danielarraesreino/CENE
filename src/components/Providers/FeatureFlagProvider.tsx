"use client";

import { createContext, useContext, useMemo, ReactNode } from 'react';
import { isFeatureEnabled, FEATURE_FLAGS } from '@/lib/featureFlags';

type FeatureFlagContextType = {
  userId: string | null;
  env: string;
};

const FeatureFlagContext = createContext<FeatureFlagContextType>({
  userId: null,
  env: process.env.NODE_ENV || 'development',
});

/**
 * Hook para consumo de feature flags em Client Components.
 * Retorna um objeto { enabled } memorizado para evitar re-renders desnecessários.
 */
export const useFeatureFlag = (flagKey: keyof typeof FEATURE_FLAGS) => {
  const ctx = useContext(FeatureFlagContext);
  
  return useMemo(() => ({
    enabled: isFeatureEnabled(flagKey, { userId: ctx.userId ?? undefined, env: ctx.env }),
  }), [flagKey, ctx.userId, ctx.env]);
};

export function FeatureFlagProvider({ 
  children, 
  userId, 
  env 
}: { 
  children: ReactNode; 
  userId?: string | null; 
  env?: string;
}) {
  const value = useMemo(() => ({
    userId: userId ?? null,
    env: env ?? process.env.NODE_ENV ?? 'development',
  }), [userId, env]);

  return (
    <FeatureFlagContext.Provider value={value}>
      {children}
    </FeatureFlagContext.Provider>
  );
}
