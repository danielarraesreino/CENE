# Regras de Governança e Segurança (01_security_and_governance)

Este documento define as diretrizes inegociáveis de segurança, governança e integridade técnica para todas as operações automatizadas (Agentes) e manuais no repositório. A conformidade com estas regras é obrigatória.

## 1. Proteção de Segredos e Credenciais
- **NUNCA** exiba, registre (log), adicione ao controle de versão (commit) ou exponha senhas, chaves de API, tokens de acesso ou strings de conexão.
- **NUNCA** altere ou manipule arquivos `.env`, `.env.local` ou `.env.production` de maneira automatizada. O gerenciamento de credenciais é uma atividade de responsabilidade exclusivamente humana ou provida pelos cofres de segredos da infraestrutura (Vercel/Render).

## 2. Operações Sensíveis e Destrutivas (Request Review)
- **SEMPRE** solicite confirmação explícita de um humano (política de *Request Review*) antes de propor, gerar scripts ou executar operações de natureza destrutiva ou de alto risco.
- Isso se aplica rigorosamente a:
  - Operações no banco de dados (ex: `DROP`, `TRUNCATE`, exclusões em massa de registros, aplicação de *migrations* que apaguem colunas).
  - Execução de comandos de terminal destrutivos ou de infraestrutura sensível (ex: `rm -rf` em diretórios de projeto, deploys manuais diretos no ambiente de produção).

## 3. Otimização e Performance de Frontend
- **SEMPRE** utilize importações dinâmicas (*dynamic imports*) e *lazy loading* no frontend para componentes que não participam da renderização crítica inicial.
- Toda nova funcionalidade, modal ou fluxo complexo no React/Next.js deve ser projetado considerando o particionamento de código (*code splitting*) de forma a minimizar impactos no tamanho do *bundle* principal.

## 4. Validação e Auditoria Contínua
- **VALIDAR** ativamente todas as alterações e revisões de código propostas contra as políticas presentes neste arquivo.
- Durante qualquer revisão de código (*Code Review*), independentemente da complexidade da tarefa, o agente (em especial o papel de `@qa`) deve verificar e confirmar explicitamente que nenhuma chave foi vazada, operações de banco de dados estão seguras, e que as otimizações de *lazy loading* foram empregadas.
