/**
 * 🚦 Sistema de Feature Flags - Reibb
 * 
 * Permite rollout controlado, rollback instantâneo e testes A/B sem deploy.
 * Determinístico: mesmo usuário + mesma flag = mesmo resultado.
 */

export type FlagStrategy = 'fixed' | 'percentage' | 'allowlist' | 'environment';

export interface FeatureFlagConfig {
  enabled: boolean;
  strategy?: FlagStrategy;
  /** Percentual de usuários (0-100) para rollout gradual */
  rolloutPercentage?: number;
  /** Lista de user IDs ou emails com acesso forçado */
  allowlist?: string[];
  /** Ambiente onde a flag é forçada (dev, staging, prod) */
  enforceEnv?: string;
  description: string;
}

export const FEATURE_FLAGS: Record<string, FeatureFlagConfig> = {
  // Etapa 1: Migração React Query
  CLINICAL_REACT_QUERY: {
    enabled: true,
    strategy: 'fixed',
    description: 'Usa @tanstack/react-query para fetch clínico. Desative para fallback legacy.',
  },
  
  // Etapa 1: Transição de Auth
  DUAL_AUTH_BRIDGE: {
    enabled: true,
    strategy: 'fixed',
    description: 'Aceita tokens Firebase + JWT Django durante janela de migração.',
  },

  // Etapa 2: Otimizações de Build/UX
  LAZY_PDF_RENDERING: {
    enabled: process.env.NODE_ENV === 'production',
    strategy: 'environment',
    description: 'Carrega @react-pdf/renderer sob demanda via next/dynamic.',
  },

  // Futuro: Resiliência Offline
  OFFLINE_SYNC_QUEUE: {
    enabled: false,
    strategy: 'percentage',
    rolloutPercentage: 5,
    description: 'Filtra mutações em IndexedDB quando offline. Sync automático ao reconectar.',
  },
};

// 🔐 Hash determinístico para rollout por porcentagem
function hashUserId(userId: string): number {
  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    const char = userId.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0; // Converte para int32
  }
  return Math.abs(hash) % 100;
}

/**
 * Verifica se uma feature flag está ativa para o contexto atual.
 * @param flagKey - Chave da flag (ex: 'CLINICAL_REACT_QUERY')
 * @param context - userId (para rollout), env (para ambiente)
 */
export function isFeatureEnabled(
  flagKey: string,
  context?: { userId?: string; env?: string }
): boolean {
  const config = FEATURE_FLAGS[flagKey];
  if (!config) {
    console.warn(`[FEATURE_FLAGS] Flag "${flagKey}" não definida.`);
    return false;
  }

  // 1. Verifica ambiente forçado
  if (config.enforceEnv && context?.env && config.enforceEnv !== context.env) {
    return false;
  }

  // 2. Se desabilitado globalmente, short-circuit
  if (!config.enabled) return false;

  // 3. Lógica por estratégia
  switch (config.strategy) {
    case 'allowlist':
      return context?.userId ? config.allowlist?.includes(context.userId) ?? false : false;
    case 'percentage':
      return context?.userId 
        ? hashUserId(context.userId) < (config.rolloutPercentage ?? 0)
        : false;
    case 'environment':
      return config.enabled; // Já validado acima
    default: // 'fixed'
      return true;
  }
}

/**
 * Hook React para uso em Client Components.
 * Nota: Em Server Components, use `isFeatureEnabled()` diretamente com `headers()` ou `cookies()`.
 * Para Client Components, utilize o hook exportado pelo FeatureFlagProvider.
 */

// 🌍 Override via Environment Variables (útil para CI/CD ou debugging)
if (process.env.NEXT_PUBLIC_FEATURE_FLAGS_OVERRIDE) {
  try {
    const overrides = JSON.parse(process.env.NEXT_PUBLIC_FEATURE_FLAGS_OVERRIDE);
    Object.assign(FEATURE_FLAGS, overrides);
    console.log('[FEATURE_FLAGS] Overrides aplicados:', Object.keys(overrides));
  } catch (e) {
    console.error('[FEATURE_FLAGS] Falha ao parsear overrides:', e);
  }
}
