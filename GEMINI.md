# Diretrizes do Agente (GEMINI) - Reibb LMS

Este documento atua como o "Cérebro" para orientar a inteligência artificial na manutenção e evolução da arquitetura "Lego" do projeto Reibb.

## Matriz de Erros Críticos a Prevenir

1. **IntegrityError (Django)**: Evitar inserções ou atualizações que quebrem as restrições do banco (ex: duplicação de inscrições não tratadas).
2. **DoesNotExist Silencioso**: Evitar blocos `try/except ObjectDoesNotExist: pass`. O sistema deve falhar explicitamente ou retornar `404/400` com JSON estruturado.
3. **Falhas de Validação em Lote**: Se uma operação em lote falhar no meio, não deixar o banco num estado intermediário inconsistente (utilizar transações).
4. **Timeouts de APIs de Terceiros**: Chamadas a LLMs (Gemini, Groq) ou TTS devem possuir timeouts explícitos e fallbacks para evitar bloqueio de threads do Gunicorn.
5. **TypeErrors no Frontend (React)**: Evitar "telas brancas" de renderização. Respostas de API malformadas ou campos nulos não devem quebrar o loop do React (utilizar Error Boundaries e validação defensiva de propriedades).
6. **Blackout de Observabilidade**: Impedir que o sistema rode em produção sem logs remotos ativos (Sentry/Vercel/Render). Se o Sentry falhar, o sistema deve logar localmente de forma estruturada.

## Especificações dos Agentes / Missões

- **Agente A (Blindagem de Erros)**: Focado na resiliência sistêmica. Implementa middleware de exceção global, Error Boundaries e **monitoramento via Sentry**.
- **Agente B (Cirurgia de Performance)**: Focado em otimização do build incremental e runtime.
- **Agente C (Auditoria de Banco)**: Focado em integridade I/O e transações atômicas.
- **Agente F (Infraestrutura & Autonomia)**: Responsável pelo ciclo de vida do deploy e verificação de saúde online via CLIs especializadas.

## Regras de Código
- Nunca utilize `except Exception as e:` genérico silencioso sem log ou sem re-levantar (raise) o erro.
- A comunicação React -> Django deve ser tratada considerando que a rede pode falhar a qualquer instante.
- Todo código novo deve preservar a integridade da arquitetura modular.
- **Autonomia em logs & skills**: Antes de reportar um erro online como "desconhecido", o agente deve obrigatoriamente consultar os logs remotos (`vercel logs` / `render logs`). O agente deve utilizar as skills das CLIs para tentar resolver problemas de infraestrutura (restart, logs, deploy) de forma proativa.
