# Contrato de programação para HEMO B2

O dataset público `public/schedule.json` contém `kind:HEMO_2026_PROGRAM`, `status:pending_b2|verified`, `timezone:America/Sao_Paulo`, `days:[2026-10-28,2026-10-29,2026-10-30,2026-10-31]`, `checkedAt` ISO-8601 e arrays `sessions`, `talks`, `works`, `exhibitors`.

Durante B1, `pending_b2` e todas as coleções vazias. Somente B2 pode preencher sessões com fontes auditadas e mudar o status para `verified`.

**Sessões:** `id` estável prefixado `h26-`, `day` YYYY-MM-DD, `start` e `end` HH:MM no fuso do Rio, `title`, `type` (modalidade), `track` (trilha), `stage` (sala), `description`, `participants` (objetos `name`, `role`, `institution`), `sourceUrl` HTTPS e `verifiedAt` ISO-8601. `start < end` no mesmo dia; se atravessar meia-noite, dividir e validar com critério explícito. Evitar dados e locais inferidos. `type=service` somente para atividades logísticas comprovadas.

**Subeventos:** `talks` com `parentSessionId`, id, título, horário e participantes, sem duplicar a sessão na grade. `works` com ID oficial, autores, modalidade, área e fonte. `exhibitors` com estande apenas se confirmado, data/fonte.

Recomendações automáticas devem ser separadas de preferências realmente registradas por Flora. O armazenamento inicial é exclusivamente local: `hemo2026:flora:preferences:v1` e `hemo2026:flora:ui:v1`, backup `HEMO_2026_FLORA_BACKUP` v1. Nada de Sheets/OAuth/persistência externa na B1. 

## B2-W1 - Contrato de candidatos não publicados

- `public/schedule.json` continua o contrato de produção, com `kind=HEMO_2026_PROGRAM`, `status=pending_b2` e arrays vazios. **Não consumir o staging no frontend antes da auditoria integral.**
- `data/b2-indexed-candidates.json` é um inventário de pesquisa separado, com `kind=HEMO_B2_INDEXED_CANDIDATES`, `status=PARTIAL_NOT_PUBLISHABLE`, `coverage.completenessVerified=false`. A contagem `coverage.knownSessions` é mínimo encontrado, **não** quantidade total de sessões por dia. Manter campos faltantes como string vazia e `evidence.missingFields`.
- A confiança de `evidence.status` distingue **trechos indexados** da grade/lista e agendas individuais, não um `verified` de programação integral. `sourceUrl` e `verifiedAt` são URL pública e data da pesquisa, não evidência de que o HTML completo foi baixado.
- `recommendation={targetProfile:"Flora",score,level,confidence,rationale,evidenceBasis,personalChoice:false}` é juízo automatizado público preliminar. Não preencher `attending`, `interest` ou quaisquer escolhas privadas de Flora dentro de `sessions[]`.
- `data/b2-flora-conflicts.json` reúne simultaneidades **de sugestões** em `conflicts[].alternatives[].sessionId`. Não substituir `conflictIds` do app, que só considera `attending:true` efetivamente escolhido.
- `tests/fixtures/b2-baseline-ids.json` preserva os 49 IDs de sessões/17 de falas da base inicial. Trocar identificadores requer migração explicitamente documentada das preferências associadas.
- Para passar a `verified` na branch B2: demonstrar cobertura total 28–31/10 por dia/sala/tipo; reconciliar salas, participantes e falas com fonte materializada e hashes; ajustar testes B1+B2 que hoje exigem `pending_b2`; executar suites/HTTP/UX reais; obter auditoria independente e gate de publicação separado.

## B2-W2 - Contrato de prévia parcial explícita

- O contrato de produção **continua** `public/schedule.json` com `kind=HEMO_2026_PROGRAM`, `status=pending_b2|verified`; não se permite `partial_preview` nessa rota. `pending_b2` mantém 0 sessões/falas. Um futuro `verified` não poderá conter `coverage.completenessVerified=false` ou inventário `sourceInventory.status=PARTIAL_NOT_PUBLISHABLE`.
- O snapshot **separado** `public/preview-schedule.json` tem `kind=HEMO_2026_PROGRAM`, `status=partial_preview`, `coverage.completenessVerified=false`, `coverage.availableSessions=121`, `coverage.availableTalks=42`, `coverage.missingStage=66`, `sourceInventory.status=PARTIAL_NOT_PUBLISHABLE`. Dia/fuso/IDs/conteúdo permanecem originais da B2-W1. Nunca declarar `verified` por alteração de status.
- **Ativação:** apenas `?preview=1` escolhe `/preview-schedule.json`. Sem parâmetro ou parâmetro diferente carrega `/schedule.json`. `public/schedule-mode.js` valida ambos; erros de status não efetuam fallback para o dataset oposto. O aviso **Programação parcial em conferência** e as contagens são obrigatórios no modo parcial.
- Na interface, campos `stage=""` e papel incerto viram **A confirmar** (não inventar sala). Falas de `talks[]` aparecem nos detalhes da sessão `parentSessionId`, não como cartões independentes.
- `recommendation` contém avaliação **automática proposta**, com classificação/confiança e justificativa, exibida sem alterar `prefs` de Flora. Doze justificativas mais específicas em `data/b2-preview-curation-overrides.json` são aplicadas **somente** ao snapshot da prévia; referência de falas em `curationEvidence.talkIds`. A fonte B2 canônica não é reescrita.
- `scripts/build-preview.mjs` regenera só o arquivo de prévia, `--check` compara byte a byte; arquivos e contratos oficiais de produção não são escritos.
- Cache PWA HEMO `hemo2026:public:b2w2-v1` mantém `schedule-mode.js` no shell e só armazena a prévia mediante acesso explícito. Sem deploy/QA funcional automático. Consultar [docs/B2_PREVIEW.md](B2_PREVIEW.md).
