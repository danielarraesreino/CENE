# CHANGELOG — Reibb/CENE LMS

Todas as mudanças notáveis neste projeto serão documentadas neste arquivo.

Formato baseado em [Keep a Changelog](https://keepachangelog.com/pt-BR/1.0.0/).

---

## [Unreleased] — 2026-05-02

### 🔒 Segurança (CRÍTICO)

- **[CRÍTICO] VAPID_PRIVATE_KEY removida do código-fonte** — chave privada movida para `VAPID_PRIVATE_KEY` env var. Configurar manualmente no Render dashboard. Antiga chave deve ser rotacionada.
- **[CRÍTICO] Chave AES migrada para `CLINICAL_ENCRYPTION_KEY` dedicada** — `EncryptionHelper.get_key()` agora usa variável de ambiente dedicada em vez de `SECRET_KEY[:32]`. Fallback para `SECRET_KEY[:32]` apenas em `DEBUG=True`. Dados existentes compatíveis pois usam o mesmo algoritmo AES-256/CBC.
- **[CRÍTICO] `bootstrap_test_user` desabilitado em produção** — endpoint retorna 403 quando `DEBUG=False`, impedindo criação de usuários de teste em produção.
- **`ALLOWED_HOSTS` restrito** em `render.yaml` — substituído de `"*"` para lista explícita de domínios conhecidos (`reibb-backend.onrender.com`, `reibb.vercel.app`, `cenecursos.com.br`).
- **`render.yaml` atualizado** — `CLINICAL_ENCRYPTION_KEY` e `VAPID_ADMIN_EMAIL` adicionados como `sync: false`.

### ✅ Observabilidade

- **Sentry integrado no `Providers/ErrorBoundary`** — `componentDidCatch` agora chama `Sentry.captureException()` com `componentStack` completo. TODO comentário removido.
- **Prop `fallback` adicionada** ao `Providers/ErrorBoundary` — consistência com `components/ErrorBoundary`.

### 🧪 Testes — Backend (pytest)

- **[NEW] `backend/tests/test_security.py`** — 4 classes de teste:
  - `TestVapidSecurity` — verifica ausência de chave privada hardcoded
  - `TestBootstrapSecurity` — bloqueia endpoint em `DEBUG=False`
  - `TestEncryptionKey` — valida `CLINICAL_ENCRYPTION_KEY`, fallback e roundtrip AES

### 🧪 Testes — Frontend (Vitest)

- **[NEW] `src/components/Providers/__tests__/ErrorBoundary.test.tsx`** — 8 testes com mock de Sentry, fallback, reset.
- **[NEW] `src/hooks/__tests__/useLessonProgress.test.ts`** — 4 testes: estado inicial, markComplete, getLessonStatus, guard de auth.
- **[NEW] `src/hooks/__tests__/usePushNotifications.test.ts`** — 5 testes: estado inicial, subscrição existente, permissão, subscribe/unsubscribe.
- **[NEW] `src/hooks/__tests__/useOfflineDownload.test.ts`** — 6 testes: download, cache hit, remoção, getOfflineMaterial, erro de rede.
- **[NEW] `src/hooks/__tests__/useBackendSync.test.ts`** — 5 testes: fetchProgress, syncTrails, guard de auth, falha silenciosa.
- **[NEW] `src/hooks/__tests__/useCourseUnlock.test.ts`** — 4 testes: interface, unlocked sem prereqs, feature flag desabilitada.
- **[NEW] `src/hooks/__tests__/useNetworkState.test.ts`** — 4 testes: estado inicial, eventos online/offline, cleanup.
- **[NEW] `src/hooks/__tests__/usePWAInstall.test.ts`** — 5 testes: estado inicial, beforeinstallprompt, standalone, dismiss.
- **[NEW] `src/hooks/__tests__/useSwipeNavigation.test.ts`** — 5 testes: bind, swipeLeft, swipeRight, threshold, down state.

### ⚡ Performance

- **PWA desabilitado em desenvolvimento** — `next.config.ts`: `disable: process.env.NODE_ENV !== 'production'`. Service worker não mais registrado em dev.

### 🏗️ Estrutura

- **`instructor/models.py` populado** — modelo `InstructorAnalytics` com snapshot diário de métricas (`unique_together` por instrutor+data).
- **Migration `0001_instructor_analytics`** criada automaticamente.

---

## Histórico de Versões

| Versão | Data | Descrição |
|--------|------|-----------|
| (pré-1.0) | 2026-04-29 | Deploy inicial em Vercel + Render |
| (pré-1.0) | 2026-04-30 | Integração Sentry backend, `AGENTS.md` v1 |
| (pré-1.0) | 2026-05-01 | RBAC admin/supervisor/paciente |
| (pré-1.0) | 2026-05-02 | Maestro Audit — segurança crítica + testes |
