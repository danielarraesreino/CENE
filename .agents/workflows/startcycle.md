# Workflow: Start Cycle (/startcycle)

Este workflow define a rotina obrigatória passo a passo que deve ser iniciada de forma autônoma e sequencial sempre que o humano invocar o comando `/startcycle [descrição da atualização]`. A meta é delegar tarefas em fases estritas, garantindo segurança e governança do início ao fim.

## Gatilho
Iniciado automaticamente quando uma mensagem no chat começar com `/startcycle`.

## Rotina (Passo a Passo)

### Passo 1: Planejamento Arquitetural (@pm)
1. **Assuma a persona `@pm`**: Leia e compreenda criticamente a requisição de migração/atualização do humano.
2. Planeje as modificações necessárias. Se existir a skill `write_specs` no diretório, utilize-a para estruturar as ideias formalmente.
3. **Ponto de Verificação (Bloqueante):** Apresente o plano ao humano e **PAUSE O WORKFLOW**. Você deve exigir, obrigatoriamente, aprovação antes de qualquer geração ou mudança real de código no repositório.

### Passo 2: Implementação (@engineer)
1. Apenas após a confirmação do humano ao plano do Passo 1, mude o seu contexto para a persona `@engineer`.
2. Implemente as alterações planejadas no código-fonte, seja em frontend, backend ou regras de negócios.
3. Execute as alterações focando na modularidade e convenções do repositório, garantindo que o código gerado não se desvie da arquitetura delineada.

### Passo 3: Auditoria e Qualidade (@qa)
1. Tendo finalizado as alterações pelo `@engineer`, mude o contexto para a persona `@qa`.
2. Atue como auditor independente. Inspecione ativamente o código em busca de senhas (*secrets*) em hardcode, e verifique se as práticas de segurança exigidas pelas regras de governança foram compridas (e.g., *lazy loading* foi empregado, nada foi modificado diretamente no `.env`).
3. Se a skill `code_review` ou equivalentes existirem, utilize-as para validar a qualidade, dependências e segurança das mudanças realizadas no passo 2.

### Passo 4: Infraestrutura e Resumo (@devops)
1. Se as validações do `@qa` forem bem-sucedidas, mude o contexto pela última vez para a persona `@devops`.
2. Valide se alguma mudança em dependências quebrou o ambiente Nix (`.idx/dev.nix`) e certifique-se de que os processos de instalação continuarão consistentes.
3. Gere um "Resumo da Implantação" (*Deployment Summary*) detalhado, descrevendo os artefatos alterados, as avaliações feitas durante as trocas de contexto e as próximas etapas de deploy (por exemplo, na Vercel e/ou Render).
