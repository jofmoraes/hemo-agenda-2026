# Protocolo do projeto HEMO Agenda 2026

Leia `README.md`, `docs/PRODUCT.md`, `docs/ARCHITECTURE.md`, `docs/DELIVERY.md` e a Issue da missão antes de implementar. Registre diagnóstico, mudanças, testes, commits, riscos e próxima decisão na Issue. O orquestrador GPT Web audita diretamente pelo GitHub.

## Isolamento obrigatório
- HEMO é produto independente; referências CONAHP e RIW são estritamente **somente leitura**. Proibido push, mudança de branches, edição, PR ou deploy nos repositórios de origem.
- Não copiar programação, identidades, preferências locais, chaves localStorage, OAuth, endpoints, variáveis de ambiente, Apps Script, planilhas privadas, domínios, analytics, caches e credenciais de outros eventos.
- Recriar todas as configurações, IDs, nomes, cores e artefatos exclusivos do HEMO. Se houver assets públicos reutilizáveis, verificar licenças e identidade de marca.

## Execução e custos
- **NO_PR / NO_CODE_REVIEW / NO_CODEX_AUTORUN / NO_UNAPPROVED_DEPLOY**.
- Codex/Work somente com autorização expressa do proprietário para cada execução que consuma créditos. Preparar prompts não constitui autorização para executá-los.
- Não disparar Lovable, mudanças em contas de terceiros, deploys nem serviços pagos sem gate apropriado.
- Trabalhar em branch própria para código; commits e push sem PR. Inspecionar CI/CD e triggers de publicação antes de push/merge.
- Missões completas até o próximo gate real, sem microaprovações. Registrar evidência independente de cada PASS.

## Dados e segurança
- A fonte principal é a programação oficial https://hemo.org.br/evento/hemo2026/pt/programacao/lista; evento 28–31/10/2026, Riocentro.
- Registros com ID estável e fonte, data de verificação, horário completo e local. Não inventar informações nem tratar dados incompletos como confirmados.
- Prioridade/aderência proposta por curadoria não é preferência expressa por Flora.
- Preferências inicialmente locais devem exibir claramente o limite de armazenamento e oferecer backup. Nenhuma promessa de sincronização sem backend efetivamente testado.
- Se houver gravação privada em servidor, autenticação e autorização por identidade são mandatórias. Não confiar em identidade de perfil enviada pelo navegador. Não expor dados privados em repositório público.
- PWA cacheia somente dados públicos apropriados. Cache HEMO segregado e versão própria, sem chaves/caches CONAHP.

## Reporte e aceite
Estados: PLANNED / ACTIVE / BLOCKED_EXTERNAL / READY_FOR_AUDIT / ACCEPTED. Não declarar release ou persistência Google sem verificação real.
Registrar na Issue SHA(s), testes realmente executados, evidência verificável e NOT_RUN explícitos. Atualizar docs/DELIVERY.md em checkpoints materiais. Não criar novos agentes/chats sem necessidade.
