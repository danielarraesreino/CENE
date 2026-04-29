<!-- BEGIN:nextjs-agent-rules -->
# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` before writing any code. Heed deprecation notices.
<!-- END:nextjs-agent-rules -->

---

<!-- BEGIN:reibb-agents -->
# Agentes de Manutenção — Reibb LMS (CENE)

Este arquivo define os **5 agentes especializados** responsáveis pela manutenção e evolução da plataforma Reibb. Cada agente tem missão, escopo e checklists específicos. Toda IA que trabalhar neste repositório deve ler e seguir as diretrizes do agente relevante para a tarefa.

> Gerado na auditoria de integridade de 2026-04-29. Fonte da verdade: `GEMINI.md`.

---

## Agente A — Blindagem de Erros (Error Resilience Shield)

**Missão:** Garantir que NENHUM erro — de rede, API malformada ou runtime JS — cause tela branca ou travamento silencioso. Todo erro deve ser capturado, logado e exibido de forma controlada.

**Escopo:**
- React Error Boundaries (frontend)
- `GlobalExceptionMiddleware` (Django backend)
- Validação defensiva de props e respostas de API
- Timeouts explícitos em chamadas a LLMs e TTS

**Pontos críticos identificados (auditoria 2026-04-29):**

*Frontend:*
- ✅ `ErrorBoundary` em `src/components/Providers/ErrorBoundary.tsx` — implementado no root layout
- ✅ `GlobalErrorToast` em `src/components/GlobalErrorToast.tsx` — implementado
- ⚠️ `useRenascerProgress`: se `fetchProgress()` falhar (backend offline), o componente fica silencioso → adicionar `.catch()` com toast de erro
- ⚠️ `useRagChat`: chamadas ao Gemini sem timeout explícito → pode bloquear indefinidamente
- ⚠️ `ClinicoCopilotWrapper`: sem fallback visual próprio → needs own ErrorBoundary wrapper

*Backend:*
- ✅ `GlobalExceptionMiddleware` em `backend/backend/middleware.py` — implementado
- ⚠️ `push/utils.py`: `WebPushException` pode ser levantada sem fallback quando token expirar
- ⚠️ `rag/`: sem timeout nas chamadas `google-generativeai` → risco de thread Gunicorn bloquear

**Padrão de timeout (backend):**
```python
# backend/rag/views.py
import signal

def timeout_handler(signum, frame):
    raise TimeoutError("LLM call exceeded 15s")

signal.signal(signal.SIGALRM, timeout_handler)
signal.alarm(15)
try:
    response = model.generate_content(prompt)
finally:
    signal.alarm(0)
```

**Padrão de timeout (frontend):**
```typescript
// src/hooks/useRagChat.ts
const controller = new AbortController();
const timeoutId = setTimeout(() => controller.abort(), 15000);
const response = await fetch('/api/rag/chat', { signal: controller.signal });
clearTimeout(timeoutId);
```

**Padrão de resposta de erro (Django):**
```json
{
  "error": {
    "code": "LESSON_LOCKED",
    "message": "Aula bloqueada: pré-requisito não concluído.",
    "detail": {}
  }
}
```

**Arquivos de referência:**
- `src/components/Providers/ErrorBoundary.tsx`
- `backend/backend/middleware.py`
- `src/components/GlobalErrorToast.tsx`

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
// ❌ Atual (estático)
import { Trail3Interactive } from '@/components/Trails/Trail3Interactive';

// ✅ Correto (lazy)
const Trail3Interactive = dynamic(
  () => import('@/components/Trails/Trail3Interactive'),
  { loading: () => <TrailSkeleton />, ssr: false }
);
```

Aplicar para: `Trail2Interactive` até `Trail7Interactive`, `CaminhosDaSuperacao`, `@react-pdf/renderer`.

**Diagnóstico de bundle:**
```bash
ANALYZE=true npm run build
```

**Arquivos de referência:**
- `next.config.ts` — configuração Turbopack/Webpack
- `src/app/layout.tsx` — exemplos de dynamic import correto
- `package.json` — dependências pesadas mapeadas

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
# ❌ Errado
lesson = Lesson.objects.get(pk=pk)
course = lesson.module.course  # 2 queries extras!

# ✅ Correto
lesson = Lesson.objects.select_related('module__course').get(pk=pk)
```

**Analytics — padrão correto:**
```python
# ❌ Errado
for enrollment in course.enrollments.all():
    progress = LessonProgress.objects.filter(user=enrollment.user)  # N queries!

# ✅ Correto
from django.db.models import Count, Avg
LessonProgress.objects.filter(
    lesson__module__course=course
).values('lesson').annotate(
    completion_count=Count('user'),
    avg_time=Avg('time_spent_seconds')
)
```

**Operações que DEVEM ser atômicas:**
```python
# progress/signals.py
@transaction.atomic
def on_lesson_complete(sender, instance, **kwargs):
    # 1. Registrar progresso
    # 2. Verificar se próxima aula foi desbloqueada
    # 3. Disparar notificação push
    pass
```

**Arquivos de referência:**
- `backend/content/models.py`
- `backend/progress/models.py`
- `backend/progress/signals.py`
- `backend/content/views.py`
- `backend/instructor/views.py`

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

/* Accent */
--brand-accent: #8b5cf6; /* violeta — trilhas de aprendizado */
--brand-pink:   #ec4899; /* detalhe clínico */

/* Status */
--success: #10b981; --error: #ef4444; --warning: #f59e0b; --info: #3b82f6;
```

**Tipografia:**
- Headings: `Outfit` (font-black, tracking-tight)
- Body: `Inter` (text-slate-600, leading-relaxed)
- Labels: `text-sm font-bold uppercase tracking-widest text-slate-500`

**Border-radius padrão:**
- Painel principal: `rounded-[3rem]` | Card: `rounded-3xl` | Botão/Input: `rounded-full`

**Micro-animações (framer-motion):**
```typescript
// Entrada de card
initial={{ opacity: 0, y: 20 }}
animate={{ opacity: 1, y: 0 }}
transition={{ duration: 0.4 }}

// Hover
whileHover={{ scale: 1.02, y: -5 }}
whileTap={{ scale: 0.98 }}
```

**Violações identificadas (auditoria 2026-04-29):**
- ⚠️ `src/app/portal/paciente/page.tsx` — alguns tokens do tema escuro antigo ainda presentes (`bg-black`, `text-brand-cyan`, `bg-white/10`)
- ✅ `src/app/page.tsx` (Landing CENE) — 100% light emerald correto
- ✅ `src/components/layout/Navbar.tsx` — light emerald + glassmorphism correto

**Arquivos de referência:**
- `src/styles/design-tokens.ts` — fonte da verdade
- `src/app/globals.css` — CSS custom properties
- `src/components/layout/Navbar.tsx` — componente modelo

---

## Agente E — Guarda de Testes (Test Coverage Guardian)

**Missão:** Garantir cobertura adequada nos fluxos críticos. Novos endpoints e componentes devem ter testes correspondentes.

**Estado dos testes (auditoria 2026-04-29):**
- ✅ Backend Pytest: 4/4 passando (`test_lesson_unlock.py`)
- ⚠️ Frontend Vitest: 0 testes implementados (apenas setup jsdom)
- ⏳ E2E Playwright: arquivos existem mas não foram executados na auditoria

**Gaps de cobertura (prioridade ALTA):**

*Backend:*
- [ ] `checkin/views.py` — POST check-in
- [ ] `clinical/views.py` — CRUD RPD, Metas, Gatilhos
- [ ] `instructor/views.py` — analytics endpoint
- [ ] `push/views.py` — subscrição push
- [ ] `rag/views.py` — chat IA (requer mock do Gemini)

*Frontend:*
- [ ] `useCheckIn` hook — loading/error/success
- [ ] `useLessonProgress` hook — sync offline→online
- [ ] `ErrorBoundary` — exibe fallback ao crashar
- [ ] `Navbar` — oculta em /login e /register

**Diretrizes de Manutenção Contínua (Mandatório):**
1. **Validação E2E/Unitária:** Ao criar/modificar UI ou endpoints, a IA *deve* revalidar o escopo rodando `npm run test:e2e` ou `npm test` localmente.
2. **Documentação de Tarefas:** Toda sessão de alteração em testes ou endpoints deve manter o `task.md` atualizado e registrar os artefatos corrigidos/validados no `walkthrough.md` ao final.

**Template backend:**
```python
@pytest.mark.django_db
def test_checkin_creates_record(auth_client, test_user):
    payload = {"mood": 7, "notes": "Me sinto bem"}
    response = auth_client.post("/api/checkin/", payload, format="json")
    assert response.status_code == 201
    assert response.data["mood"] == 7
```

**Template frontend (hook):**
```typescript
import { renderHook } from '@testing-library/react';
import { useCheckIn } from '@/hooks/useCheckIn';

describe('useCheckIn', () => {
  it('deve retornar estado inicial correto', () => {
    const { result } = renderHook(() => useCheckIn());
    expect(result.current.isLoading).toBe(false);
    expect(result.current.lastCheckIn).toBeNull();
  });
});
```

**Comandos:**
```bash
# Backend
cd backend && python -m pytest tests/ -v --cov=. --cov-report=html

# Frontend
npm test
npm run test:coverage

# E2E (requer ambos servidores ativos)
npm run test:e2e
```

**Arquivos de referência:**
- `backend/tests/test_lesson_unlock.py` — template backend
- `backend/conftest.py` — fixtures reutilizáveis
- `src/test/setup.tsx` — setup frontend
- `vitest.config.ts` — configuração vitest
- `playwright.config.ts` — configuração E2E

<!-- END:reibb-agents -->
