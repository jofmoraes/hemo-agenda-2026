# Estado operacional - HEMO Agenda 2026

Atualizado: 2026-10-23, após auditoria B0 por GPT Web.

## B0 - ACCEPTED (bootstrap)
- Repositório público: `jofmoraes/hemo-agenda-2026`, branch principal `main`, conta `jofmoraes`.
- Commit inicial: `e3bd3d260c6b3c0a45dd32b5506b5ed146f939f0`.
- Handoff B0: `6eb63edfad50ae3a36e0f89e80a6634fa882c717` (`docs/handovers/CURRENT_CODEX_STATUS.md`).
- Árvore remota inicialmente apenas `README.md` e `docs/`, sem imports do CONAHP. Nenhum `.github/workflows` no repositório (404 da API Contents); Codex reportou workflows 0 e deployments 0. Não concluir por isso que integrações futuras não terão gatilhos.
- Pasta local informada pelo executor: `D:\JUCA\AI Lab\hemo-2026\hemo-2026-app`; arquivo `.git` e README confirmados por listagem de Drive sincronizado.
- B0 aprovado apenas quanto à inicialização. Nenhum aplicativo HEMO está funcional ou publicado nesta fase.

## Próximo portfólio
- B1: port do frontend B18 Flora para HEMO, quatro dias, estrutura/schemas separados, PWA local e teste; **execução Codex depende de autorização expressa**.
- B2: ingestão e auditoria da programação oficial/curadoria Flora em arquivo independente com IDs estáveis. Data e ID de candidatos da planilha devem ser reconciliados.
- B3: Trabalhos Científicos e Expositores se fontes sustentarem; não atrasar agenda P0.
- B4: integração, login e persistência multiaparelho HEMO, apenas se aprovada; evitar reutilizar clientes OAuth/segredos CONAHP.
- B5: publicação controlada após gate, com smoke remoto e plano de rollback.

## Fontes
- https://hemo.org.br/site/hemo2026/sobre-o-evento
- https://hemo.org.br/evento/hemo2026/pt/programacao/lista
- https://hemo.org.br/site/hemo2026/informacoes-gerais
- https://docs.google.com/spreadsheets/d/1arUmWu99S8FsqfVyIxgiJ4xyZHlJrq9G8fQ6U1_ISPU/edit

## Controles
NO_PR; NO_AUTO_CODE_REVIEW; NO_CODEX_WITHOUT_APPROVAL; NO_DEPLOY_WITHOUT_APPROVAL; CONAHP_READ_ONLY. Status HEMO B1/B2: PLANNED, não executados.


## HEMO B1 - READY_FOR_AUDIT (23/10/2026)

**Escopo remoto implementado:** branch `feat/hemo-b1-frontend`, baseada em `main`, usando a referência **exclusivamente em leitura** CONAHP `feat/b18-flora-ux` no SHA `5aae37ea87783d43546a6351d04ffa1b6bdc2697`. O último commit funcional antes deste registro foi `030114057cde11ec28cb5355a0e4db3bbe1b946b`; consultar o HEAD final da branch e o registro da Issue #1.

### Arquivos e mudanças
- `public/index.html`, `public/b18.css`, `public/b18.js`: UX B18 Flora adaptada, datas 28-31/10, identidade HEMO, grade de simultâneas, lista, filtros (inclusive modalidade), Minha Agenda, interesses, prioridade, comentários, perguntas, detalhes e backup JSON isolado.
- `public/schedule-utils.js`: conflitos apenas entre escolhas selecionadas; validação de IDs `h26-*`, quatro datas e proveniência verificada; filtros, ordenação e layout cronológico.
- `public/schedule.json`: **0 sessões**, status `pending_b2`, arrays `sessions/talks/works/exhibitors` vazios. Nenhuma programação HEMO inventada e nenhum dado CONAHP importado.
- `public/manifest.webmanifest`, `public/service-worker.js`, `public/logo-hemo.svg`, `public/icon-192.png`, `public/icon-512.png`: marca tipográfica independente, manifesto, ícones PNG originais, cache somente público com namespace `hemo2026:`. O SW não apaga caches de outros aplicativos.
- `tests/hemo-b1.test.mjs`, `package.json`, `docs/DATA_CONTRACT.md`, `README.md`: testes reproduzíveis, contrato B2 e instruções de execução local.

### Evidência dos testes nesta execução
- **PASS 6/6** grupos executados no runtime V8 com o próprio código e fixtures sintéticas em memória: datas/fuso/dataset vazio, schema/proveniência, simultaneidade/conflitos, filtros, armazenamento/backup e identidade/cache PWA. No primeiro runner, o teste do backup falhou por incompatibilidade do adaptador de `vm.runInNewContext`; foi reexecutado diretamente com o helper real e **PASS**. Não foi falha da aplicação.
- **PASS:** análise sintática de `b18.js`, `schedule-utils.js`, `service-worker.js` por compilação JavaScript no runtime V8; varredura de conteúdo público sem referências visíveis/keys CONAHP, datas anteriores ou dados RIW.
- **PASS:** PNG 192×192 e 512×512 verificados quanto à assinatura, IHDR, lista de chunks e CRC.
- **NOT_RUN:** `npm test`, `npm run check`, `node --check` nativos, servidor HTTP local, Chromium real, teste responsivo 320-1280px, interação DOM, smoke Android/iOS instalado, cold/warm/offline real, acessibilidade assistiva. O conector GitHub não executa comandos no workspace Windows.
- **NOT_RUN:** sincronização com a pasta local `D:\\JUCA\\AI Lab\\hemo-2026\\hemo-2026-app`. Os commits estão no repositório remoto. Fazer `git fetch` e checkout da branch no workspace antes de executar localmente.

### Isolamento e bloqueios
- **NO_PR / NO_CODE_REVIEW / NO_DEPLOY** preservados. Nenhuma alteração no repositório CONAHP, no RIW ou em produção; nenhum serviço/integração externa criado.
- Inspeção somente leitura: sem arquivos `.github/workflows` na árvore HEMO; consulta Vercel por repositório retornou 0 projetos conectados. Triggers externos/webhooks que não aparecem nesses inventários permanecem **não comprovados**.
- A marca SVG é criação tipográfica original inspirada na identidade cromática pública do HEMO, **não é um arquivo oficial licenciado/importado**. Aprovar fidelidade visual/uso da marca antes de publicar.
- B2 deve reconciliar fonte oficial, horários, salas, ID e contagem real antes de marcar `verified`. Preferências ficam exclusivamente neste navegador, com exportação/importação; não há login, Sheets nem sincronização multiaparelho.
- Próximo gate: auditoria independente pela Issue #1, rodar testes e smoke local antes de aceitar. **Status: `HEMO_B1_READY_FOR_AUDIT`; sem publicação ou aceite.**


## HEMO B2 - PARCIAL / BLOCKED_EXTERNAL (23/10/2026)

- **Branch:** `feat/hemo-b2-programa`, derivada exatamente de B1 `04029d87d2982856704f9daf6517d5925781b5fa`. Nenhuma alteração na branch B1, CONAHP, RIW ou `main`.
- **Preflight B1:** readback do HEAD solicitado PASS. `npm test`, `npm run check`, smoke HTTP/mobile/desktop/PWA/persistência/backup nativos **NOT_RUN** porque a pasta Windows não está montada e `git ls-remote` falhou por DNS `github.com`. Não se sobrescreveram arquivos locais. Adendo registrado na Issue #1.
- **Fontes oficiais:** `https://hemo.org.br/evento/hemo2026/pt/programacao/gradeatividades/todas` e `https://www.hemo.org.br/evento/hemo2026/pt/programacao/lista`. Leitura direta falhou HTTP 403. Conteúdo oficialmente indexado permitiu transcrever subconjunto, sem burlar controles. Ver `docs/B2_SOURCE_AUDIT.md`.
- **Artefato de pesquisa:** `data/b2-indexed-candidates.json`, `PARTIAL_NOT_PUBLISHABLE`, 49 sessões (28/10=12, 29/10=15, 30/10=12, 31/10=10) e 17 palestras filhas. Há 42 sessões sem sala reconciliada, 7 com sala indicada. Por definição, **49 NÃO é o total oficial**, apenas a amostra verificável por fontes indexadas.
- **Curadoria Flora:** `recommendation` explica aderência e confiança a partir de título/trilha. Não contém decisões pessoais, `attending`, `interest` ou comentários privados. Prioridade inferida não equivale à escolha de Flora.
- **Segurança de publicação:** `public/schedule.json` continua com `status=pending_b2` e zero sessões; não publicar programação parcial como completa nem alegar que foi integrada ao frontend.
- **Testes:** seis testes versionados em `tests/hemo-b2.test.mjs` rodados diretamente como callbacks no runtime V8 com adaptador de `fs` (6 PASS/0 FAIL); mais sete verificações de coerência, horários, IDs, rastreabilidade, lacunas, curadoria e simultaneidade (7 PASS/0 FAIL). Não substituem `node --test` nativo. `npm test`, `npm run check`, `npm run test:b2`, QA real HTTP/mobile/offline: **NOT_RUN**.
- **Comandos adicionados** ao `package.json` de B2: `npm test` inclui testes B1+B2, `npm run test:b2` isola B2, `npm run check` faz parse JS e testes.
- **Gate restante:** conseguir fontes completas de forma autorizada, reconciliar 42 salas e a totalidade de sessões/talks/atividades e regras de acesso, validar contagem oficial por dia/tipo, executar Node e navegador nativos. Só depois transformar `public/schedule.json` em dataset `verified` e submeter B2 completa à auditoria. Sem merge/deploy.
- **Status:** `HEMO_B2_PARTIAL_SOURCE_BLOCKED`. O marcador `HEMO_B2_READY_FOR_AUDIT` **não é aplicável** ainda, porque a completude exigida na Issue #2 não foi demonstrada.


## HEMO B2-W1 - WEB_PARTIAL_WITH_EXACT_RESIDUAL (24/10/2026)

**Execução exclusivamente GPT Web com pesquisa pública, conector GitHub e conector Google Drive/Sheets.** Branch `feat/hemo-b2-programa` originada de `76ff694c1570a8415c6bdf9ccd5454afe1139a2d`, sem PR, Codex, Work, deploy, merge ou alterações em CONAHP/`main`.

### Registros e rastreabilidade
- Inventário `data/b2-indexed-candidates.json` ampliado de **49 sessões/17 falas** para **121 sessões/42 falas**, por dia 28/10=33/11, 29/10=34/12, 30/10=34/11, 31/10=20/8. Mantidos **49 IDs de sessão e 17 IDs de subpalestra** anteriores, protegidos em `tests/fixtures/b2-baseline-ids.json`.
- **66 salas faltantes** (14/20/19/13 por dia) e **67 relações participantes/sessões** com papel pendente. **Total oficial de sessões e falas do congresso desconhecido**. `coverage.completenessVerified=false`; todos os dados extraídos de páginas oficiais indexadas sem materializar grade/lista completas. **Não representa programação integral.**
- Tarde de 28/10 complementada com simpósios, treinamento AABB/ABHH, plenária 16h30–18h e abertura 18h15–19h30. Diferencia `cientifica`, `educacional`, `treinamento`, `cafe_corporativo`, `simposio_corporativo`, `meet_the_expert`, `atividade_pratica`, `forum_restrito`, `abertura`, `homenagem`, `conferencia`, `plenaria` e `trabalhos_orais`. Fontes e amostras: `docs/B2_SOURCE_AUDIT.md`.
- Página pública oficial de PDF científico identificada, mas arquivo iframe **não obtido/verificado**; possibilidade de PDF de traslado indexado, portanto nenhum PDF tratado como cronograma científico.
- Curadoria individualizada: **28 recomendações altas, 9 médias, 84 baixas**, apenas proposta, justificativa e confiança (média/baixa); `data/b2-flora-conflicts.json` contém **6 grupos de alternativas simultâneas**, sem marcar presença/interesse de Flora. Explicação em `docs/B2_FLORA_CURATION.md`.
- Planilha existente atualizada **in-place**, preservando 7 abas originais e criando **Palestras B2** e **Conflitos Flora**: `Sessoes!A1:O122` (121 registros); `Palestras B2!A1:L43` (42 registros); `Conflitos Flora!A1:L7` (6 grupos); 7/8 `Destaques` com ID/dia reconciliados, 1 ABHH PBM segue sem data; `Fontes!A8:E12`; `Backlog!A10:E11`. Readback valores e nomes de abas PASS, inspeção visual em navegador NOT_RUN.
- **Frontend e produção não integrados:** `public/schedule.json` `pending_b2`, 0 sessões. O contrato público não foi falsamente elevado a `verified`.
- Testes novos `tests/hemo-b2-web.test.mjs` (7) e `tests/fixtures/b2-baseline-ids.json`, com `npm test` e `npm run test:b2` ajustados. Runner **V8 com callbacks reais dos arquivos versionados + adaptador de FS**: 6/6 testes B2 prévios PASS e 7/7 testes B2-W1 PASS após correção do teste de URL para aceitar domínio oficial com e sem `www`. Sem casos FAIL finais. **Não equivale a execução Node nativa.**
- **NOT_RUN:** `npm test`, `npm run check`, `npm run test:b2` executados nativamente; servidor HTTP, DOM, Chromium desktop/mobile, PWA instalado, cold/warm/offline, persistência e backup reais; pasta Windows inacessível, `git clone` bloqueado por DNS no runtime Linux. Histórico QA B1 Issue #1 continua `STATIC_ACCEPTED_RUNTIME_QA_PENDING`.
- Isolamento reauditar via HEADs GitHub. Sem alterações no CONAHP, PR, Code Review, deploy, OAuth, Sheets privados em público ou promoção da `main`.

### Próximo desbloqueio mínimo
Obter via navegação normalmente autorizada **HTML/DOM/MHTML completos da grade e lista 28–31/10, ou PDF científico HEMO 2026 com identidade/ano/conteúdo auditados**, permitindo determinar o universo, reconciliar **66 salas, 67 papéis ainda pendentes**, palestras filhas, inscrições, dias e trilhas. Fontes brutas ficam privadas no Drive, não no repo público. Após conciliação, rever e executar suites Node nativas, smoke visual, trocar para `verified` na branch e solicitar auditoria; publicação ainda terá gate separado.

**Marcador executor: `HEMO_B2_WEB_PARTIAL_WITH_EXACT_RESIDUAL`. Não é `HEMO_B2_WEB_READY_FOR_AUDIT`.**
