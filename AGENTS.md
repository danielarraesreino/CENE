<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

---

<!-- BEGIN:reibb-agents -->
# Agentes de Manutenção — Reibb LMS (CENE)

Este arquivo define os **6 agentes especializados** responsáveis pela manutenção e evolução da plataforma Reibb. Cada agente tem missão, escopo e checklists específicos. Toda IA que trabalhar neste repositório deve ler e seguir as diretrizes do agente relevante para a tarefa.

> Atualizado na auditoria de infraestrutura de 2026-04-30. Fonte da verdade: `GEMINI.md`.

---

## Agente A — Blindagem de Erros (Error Resilience Shield)

**Missão:** Garantir que NENHUM erro — de rede, API malformada ou runtime JS — cause tela branca ou travamento silencioso. Todo erro deve ser capturado, logado e exibido de forma controlada.

**Escopo:**
- React Error Boundaries (frontend)
- `GlobalExceptionMiddleware` (Django backend)
- **Integração Sentry (Logs remotos)**
- Validação defensiva de props e respostas de API
- Timeouts explícitos em chamadas a LLMs e TTS

**Checklist de Observabilidade:**
- [ ] O erro foi capturado pelo Sentry?
- [ ] Existe um fallback visual para este componente?
- [ ] O log contém o `trace_id` para correlação frontend-backend?

**Arquivos de referência:**
- `src/components/Providers/ErrorBoundary.tsx`
- `backend/backend/middleware.py`
- `src/sentry.client.config.ts`

---

## Agente B — Cirurgia de Performance (Build & Runtime Optimization)

**Missão:** Garantir builds rápidos, eliminar dependências circulares e otimizar o cache do Turbopack. Todo código novo deve minimizar o impacto no bundle size.

**Escopo:**
- Turbopack cache configuration
- Circular dependency detection/prevention
- Bundle analysis e code splitting
- Lazy loading de componentes pesados

**Situação atual (auditoria 2026-04-29):**
- ✅ Turbopack ativo (Next.js 16 padrão)
- ✅ Dynamic imports usados em `src/app/layout.tsx` (ClinicoCopilotWrapper)
- ⚠️ Trilhas interativas (`Trail2-7Interactive.tsx`) são grandes (10–17 KB cada) — carregadas estaticamente
- ⚠️ `recharts` + `framer-motion` + `@react-pdf/renderer` são pesados — verificar tree-shaking
- ⚠️ `firebase` v12 incluído no bundle — verificar se é dead code

**Componentes que DEVEM usar dynamic imports:**
```typescript
// ✅ Correto (lazy)
const Trail3Interactive = dynamic(
  () => import('@/components/Trails/Trail3Interactive'),
  { loading: () => <TrailSkeleton />, ssr: false }
);
```

**Arquivos de referência:**
- `next.config.ts`
- `src/app/layout.tsx`
- `package.json`

---

## Agente C — Auditoria de Banco (Database Integrity)

**Missão:** Garantir integridade transacional. Todo endpoint que escreve em múltiplas tabelas deve usar `@transaction.atomic`. Queries N+1 devem ser eliminadas com `select_related`/`prefetch_related`.

**Escopo:**
- Transações atômicas em operações multi-tabela
- Eliminação de queries N+1
- Verificação de constraints e unicidade

**Checklist de verificação:**
- [ ] `LessonProgress` tem `unique_together = [('user', 'lesson')]`?
- [ ] `PushSubscription` tem `unique_together = [('user', 'endpoint')]`?
- [ ] `content/views.py` usa `select_related` em todos os endpoints?
- [ ] `instructor/views.py` usa agregações ao invés de loops?
- [ ] Signals críticos usam `@transaction.atomic`?

**Query N+1 — padrão correto:**
```python
# ✅ Correto
lesson = Lesson.objects.select_related('module__course').get(pk=pk)
```

**Arquivos de referência:**
- `backend/content/models.py`
- `backend/progress/models.py`
- `backend/progress/signals.py`

---

## Agente D — Identidade Visual (Design System Guardian)

**Missão:** Garantir que TODAS as páginas e componentes sigam o mesmo sistema de design. Nenhum componente deve usar cores, espaçamentos ou tipografias fora do sistema definido.

**Paleta principal (Light Theme / CENE):**
```css
/* Primária: Emerald */
--emerald-500: #10b981;   /* cor principal */
--emerald-600: #059669;   /* botões primários, CTAs */
--emerald-700: #047857;   /* hover de botões */

/* Escala: Slate */
--slate-50:  #f8fafc;    /* background global */
--slate-600: #475569;    /* corpo de texto */
--slate-900: #0f172a;    /* texto principal */
```

**Tipografia:**
- Headings: `Outfit` (font-black, tracking-tight)
- Body: `Inter` (text-slate-600, leading-relaxed)

**Arquivos de referência:**
- `src/styles/design-tokens.ts`
- `src/app/globals.css`
- `src/components/layout/Navbar.tsx`

---

## Agente E — Guarda de Testes (Test Coverage Guardian)

**Missão:** Garantir cobertura adequada nos fluxos críticos. Novos endpoints e componentes devem ter testes correspondentes.

**Estado dos testes (auditoria 2026-04-29):**
- ✅ Backend Pytest: 4/4 passando (`test_lesson_unlock.py`)
- ⚠️ Frontend Vitest: 0 testes implementados
- ⏳ E2E Playwright: arquivos existem

**Comandos:**
```bash
# Backend
cd backend && python -m pytest tests/ -v --cov=. --cov-report=html

# Frontend
npm test

# E2E
npm run test:e2e
```

---

## Agente F — Observabilidade & Infraestrutura (Cloud & Autonomy)

**Missão:** Garantir a saúde do ambiente de produção e a autonomia dos agentes na resolução de problemas online. Gerenciar deploys e monitorar logs em tempo real usando as CLIs integradas.

**Escopo:**
- **Vercel CLI**: Gerenciamento do frontend (Project: `reibb`).
- **Render CLI**: Gerenciamento do backend e banco de dados (Project: `reibb-backend`).
- **Sentry Dashboards**: Monitoramento de exceções em tempo real.
- **Environment Sync**: Garantir que `.env.production` e segredos no Render/Vercel estejam pareados.

**Checklist de Autonomia:**
- [ ] Validar status do frontend: `npx vercel list`
- [ ] Investigar logs do frontend: `npx vercel logs reibb --project reibb`
- [ ] Validar status do backend: `./bin/render services`
- [ ] Investigar logs do backend: `./bin/render logs reibb-backend`
- [ ] Verificar deploys pendentes: `./bin/render deploys`

**Skills de Agente (Capabilities):**
- **Deployment Control**: Capacidade de disparar novos builds via CLI.
- **Log Streaming**: Monitoramento ativo de erros de runtime sem acesso ao dashboard web.
- **Instance Management**: Reiniciar instâncias problemáticas via `./bin/render restart`.

**Comandos Úteis:**
```bash
# Frontend (Vercel)
npx vercel logs reibb --project reibb
npx vercel env pull .env.production.local

# Backend (Render)
./bin/render services
./bin/render logs reibb-backend
./bin/render deploys list reibb-backend
```

**Diretrizes de Manutenção Contínua (Mandatório):**
1. **Validação E2E/Unitária:** Ao criar/modificar UI ou endpoints, a IA *deve* revalidar o escopo rodando `npm run test:e2e` ou `npm test` localmente.
2. **Documentação de Tarefas:** Toda sessão de alteração em testes ou endpoints deve manter o `task.md` atualizado e registrar os artefatos corrigidos/validados no `walkthrough.md` ao final.

<!-- END:reibb-agents -->
