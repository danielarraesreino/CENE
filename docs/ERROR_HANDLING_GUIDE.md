# 🛡️ Guia de Tratamento de Erros - Reibb (EdTech)

Este documento padroniza como erros são gerados, transportados, capturados e exibidos em todo o ecossistema Reibb. O objetivo é garantir **resiliência**, **rastreabilidade** e **experiência de usuário segura** em ambientes clínicos.

---

## 📦 1. Padrão de Resposta de Erro (Backend → Frontend)

Toda falha no backend deve seguir esta estrutura JSON padronizada:

```json
{
  "error": {
    "code": "CLINICAL_DATA_NOT_FOUND",
    "message": "Registro clínico não encontrado ou expirado.",
    "details": { "record_id": "mood_123", "expected_at": "2024-05-10T14:00:00Z" },
    "retryable": false
  }
}
```

### 🔑 Campos Obrigatórios
| Campo | Tipo | Descrição |
|-------|------|-----------|
| `code` | `string` | Identificador único do erro (sem espaços, `UPPER_SNAKE_CASE`). |
| `message` | `string` | Mensagem amigável para exibição direta ao usuário. |
| `details` | `object?` | Metadados técnicos para debug (nunca incluir PII). |
| `retryable` | `boolean` | Indica se o frontend deve oferecer botão "Tentar novamente". |

---

## 🌐 2. Frontend: Como Capturar e Exibir

### 2.1 React Query (`useQuery` / `useMutation`)
**Nunca** use `try/catch` manuais em componentes. Deixe o React Query gerenciar o fluxo:

```tsx
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';

export const useUpdateMood = () => {
  return useMutation({
    mutationFn: submitMoodLog,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: clinicalKeys.lists() });
      toast.success('Humor registrado com sucesso');
    },
    onError: (error: ApiError) => {
      // Toast contextual com ação de retry
      toast.error(error.message, {
        action: error.retryable 
          ? { label: 'Tentar novamente', onClick: () => mutation.mutate() } 
          : undefined,
        duration: error.retryable ? 6000 : 4000,
      });
      
      // Log estruturado para monitoramento futuro (Sentry)
      console.warn('[REIBB_API_ERROR]', { code: error.code, stack: error.details });
    }
  });
};
```

### 2.2 Error Boundary (Falhas Críticas de Renderização)
Já implementado em `src/app/layout.tsx`. Captura erros que quebram a árvore de componentes (ex: falha de hidratação, referência nula em props obrigatórias).

✅ **Comportamento esperado:** 
- UI não "tela branca"
- Exibe fallback amigável com botão "Recarregar"
- Registra `componentStack` no console/Sentry

### 2.3 Toasts (`sonner`)
| Tipo | Uso | Duração |
|------|-----|---------|
| `toast.success` | Confirmação de ação síncrona | 3s |
| `toast.error` | Falha de rede, validação, serviço indisponível | 4-6s (com retry se aplicável) |
| `toast.warning` | Dado desatualizado, cache fallback | 5s |
| `toast.info` | Notificações de sistema/maintenance | 7s |

---

## 🗂️ 3. Catálogo de Códigos de Erro (Exemplos)

| Código | Camada | Descrição | Retry? |
|--------|--------|-----------|--------|
| `AUTH_INVALID_TOKEN` | BE/FE | Token JWT expirado ou inválido | ✅ |
| `CLINICAL_ENCRYPTION_ERROR` | BE | Falha na descriptografia de campo sensível | ❌ |
| `AI_SERVICE_TIMEOUT` | BE/FE | Gemini/gTTS não respondeu em <8s | ✅ |
| `NETWORK_OFFLINE` | FE | Navegador detectou perda de conexão | ✅ |
| `VALIDATION_FAILED` | BE | Payload não passou nas regras de negócio | ❌ |
| `RATE_LIMIT_EXCEEDED` | BE | Muitas requisições no mesmo minuto | ⏳ (Backoff) |

> 💡 Para adicionar novos códigos, edite `backend/backend/constants/error_codes.py` e atualize esta tabela.

---

## 🐍 4. Backend: Log Estruturado & Middleware

O middleware `structured_exception_handler` (em `settings.py`) intercepta **todas** as exceções antes de chegar ao cliente.

### ✅ Regras de Log
```python
import logging
logger = logging.getLogger('reibb.api')

# SEMPRE use extra={} para dados estruturados
logger.error('CLINICAL_FETCH_FAILED', extra={
    'user_id': request.user.id,
    'endpoint': '/api/clinical/mood-logs/',
    'error_code': 'ENCRYPTION_DECRYPT_FAILED',
    'trace_id': request.headers.get('X-Trace-Id'),
})
```

### 🚫 Proibido
- ❌ `except Exception: pass`
- ❌ `print("Erro:", e)`
- ❌ Retornar stack traces em produção (`DEBUG=False`)

---

## 🛠️ 5. Boas Práticas

| Cenário | Recomendação |
|---------|--------------|
| **Validação de Formulário** | Use Zod + React Hook Form. Erros são exibidos inline, não em toast. |
| **Fallback de Cache** | `placeholderData: keepPreviousData` no React Query evita spinner piscando. |
| **Erro Crítico em Prod** | ErrorBoundary mostra UI amigável + log automático. Nunca exponha `error.stack`. |
| **Offline/Conexão Instável** | Configure `retry: 2` e `staleTime: 5*60*1000` no `queryClient`. |

---

## 📊 6. Monitoramento & Debug

1. **Local:** Abra `React DevTools → Profiler` para verificar re-renders em erros.
2. **Logs Django:** `tail -f logs/api_errors.log | grep "CLINICAL_"`
3. **Frontend Network Tab:** Filtre por `Status: 4xx/5xx` e inspecione `response.error.code`.
4. **Sentry (Futuro):** Cada `console.warn('[REIBB_API_ERROR]')` será capturado automaticamente.

> 🔄 Este documento é vivo. Atualize-o ao adicionar novos códigos de erro ou mudar o fluxo de fallback.
