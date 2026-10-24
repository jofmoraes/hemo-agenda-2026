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
