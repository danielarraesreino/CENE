---
name: safe-migration
description: 'Use esta skill OBRIGATORIAMENTE sempre que for solicitado a migrar código, refatorar arquiteturas pesadas ou aplicar atualizações de pacotes e dependências de sistema no IDX. Ela garante a segurança e evita quebra de código.'
---

# Diretrizes da Skill: Safe Migration

Siga os passos abaixo rigorosamente ao executar tarefas de migração, refatoração estrutural ou atualização de dependências:

## Passo a Passo Obrigatório

1. **Analisar as mudanças de dependência:** 
   Avalie cuidadosamente o impacto das atualizações de pacotes (ex: `package.json`, `requirements.txt`, arquivos Nix) antes de aplicá-las. Verifique a documentação das bibliotecas e mapeie potenciais *breaking changes* para evitar conflitos imprevistos.

2. **Rodar o lint e testes localmente antes de modificar os arquivos:**
   Garanta a integridade do código executando as suítes de teste (e.g., `npm test`, `pytest`) e o *linter* antes de introduzir mudanças pesadas. Após a refatoração ou atualização, rode novamente as ferramentas de validação para confirmar que o sistema não foi quebrado.

3. **Atualizar o histórico de mudanças no arquivo `CHANGELOG.md`:**
   Ao final da tarefa, registre detalhadamente o que foi atualizado, refatorado ou migrado. Explique os motivos técnicos e documente quaisquer alterações na infraestrutura ou nos requisitos do projeto, de forma que outros agentes e humanos possam acompanhar o histórico do desenvolvimento.
