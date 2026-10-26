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

## HEMO B3-WORKS1 — Pesquisa GSH (26/10/2026)

- Branch independente: `feat/hemo-b3-works-gsh`, baseada na release pública existente; sem alteração de `main`, CONAHP, Vercel ou aplicativo público.
- Inventário: `data/b3-works-gsh-research.json`; relatório: `docs/B3_WORKS_GSH_RESEARCH.md`.
- Resultado: `BLOCKED_EXTERNAL`; a lista oficial retornou HTTP 403 no navegador Windows com verificação de segurança.
- Trabalhos individuais confirmados: `0`. Candidatos individuais publicados: `0`. A referência agregada de 117 (100 painel, 17 visita guiada) ficou restrita à reconciliação futura.
- Próximo desbloqueio: exportação legitimamente acessível da lista oficial, seguida de reconciliação de ID, título, autores, instituições, modalidade, área, data, horário, local e painel.
- Validação específica: `node --test tests/hemo-b3-works-gsh.test.mjs`.

## HEMO B3-WORKS2 — Extração interativa (26/10/2026)

- Resultado: `SOURCE_ACCESS_BLOCKED`; a tentativa única no navegador integrado retornou HTTP 403 antes do conteúdo da lista.
- Cobertura: 0 áreas acessadas, 0 trabalhos carregados, 0 trabalhos individualmente validados; total oficial e assuntos não obtidos.
- Sessão Chrome autorizada verificada somente por abas abertas; não havia aba da fonte oficial. Nenhum cookie, token, credencial ou armazenamento foi acessado.
- Catálogo estruturado permanece vazio e `confirmedWorks=[]`; não houve alteração de `public/*` ou da agenda.
- Ação manual mínima: abrir a URL oficial no Opera/Chrome com acesso normal e disponibilizar a aba ao navegador conectado ou fornecer exportação autorizada HTML/MHTML/PDF.
- Testes: `npm test` deve incluir a suíte B3; executar após o commit desta atualização.

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


## HEMO B2-W2 - Prévia funcional parcial pronta para auditoria de código (24/10/2026)

**Escopo aprovado pelo pedido W2:** preparar acesso opt-in e revisável aos candidatos B2, sem elevar a amostra ao status oficial completo, sem deploy e sem modificar outras aplicações. Base lida e confirmada: `feat/hemo-b2-programa` em `a5eaeb144a547b8f4b18a9a5edbbec00a0bab1ea`; parecer do orquestrador Issue #2 comentário `6389508716` lido. **Status de entrega de branch: `HEMO_B2_W2_PREVIEW_READY_FOR_AUDIT`**, sujeito a auditoria independente e à QA funcional real; não é B2 integral nem publicação.

### Arquivos da W2
- `public/preview-schedule.json` contém snapshot `kind=HEMO_2026_PROGRAM,status=partial_preview`, 121 sessões candidatas e 42 falas filhas, quatro dias 28–31/10, `coverage.completenessVerified=false`, 66 `stage` faltantes, IDs/proveniências herdados sem reatribuição.
- `public/schedule-mode.js` separa `pending_b2`, `partial_preview` e `verified`, valida dia/fuso/ID/horários/pais/contagens/inventário parcial e escolha pessoal, seleciona a prévia **somente** quando a query tem `preview=1`; recusa modo oposto, impede que dados explicitamente incompletos se tornem `verified`.
- `public/index.html`, `b18.css`, `b18.js`: banner **fixo/sticky** `Programação parcial em conferência`, contagem da amostra e da falta de salas, possibilidade de sair da prévia; `A confirmar` para local, papel, descrição e acesso não confirmado; humanização da modalidade; 42 subfalas dentro dos detalhes pai; busca contempla título de subpalestra; curadoria automática exibida como **Sugestão Flora** com confiança, distinta de interesse, anotação, presença e prioridade pessoal. Mantidos filtros, grid/lista, Minha Agenda e backup HEMO.
- `public/service-worker.js`: cache exclusivo `hemo2026:public:b2w2-v1`, novo módulo do shell cacheado, dataset de prévia armazenado por leitura explícita (network-first), sem alterar chaves/caches CONAHP.
- `data/b2-preview-curation-overrides.json`: 12 justificativas específicas apoiadas em títulos de sessões/falas, aplicadas **somente no snapshot**, sem reescrever `data/b2-indexed-candidates.json`. `scripts/build-preview.mjs` regenera exclusivamente `public/preview-schedule.json`; `--check` confere identidade byte a byte. `package.json` adiciona `build:preview`/`check:preview` e novas suítes.
- `tests/hemo-b2-preview.test.mjs` 10 casos; `tests/hemo-b2-preview-ui.test.mjs` 2 casos de UI simulada; `README.md`, `docs/DATA_CONTRACT.md` e `docs/B2_PREVIEW.md` com ativação e limites.
- **Readback GitHub PASS:** blobs canônicos `data/b2-indexed-candidates.json`, `public/schedule.json` e `tests/fixtures/b2-baseline-ids.json` ficaram **idênticos ao HEAD inicial W2**. IDs das 121 sessões e 42 falas coincidem exatamente entre snapshot de prévia e inventário. Os 49+17 IDs do começo de B2 permanecem presentes.

### Como revisar sem publicar
No checkout isolado da branch, rodar servidor HTTP para a pasta `public` (e.g. `python3 -m http.server 8000 --directory public`). Abrir `http://localhost:8000/?preview=1` para prévia parcial. Abrir `http://localhost:8000/` para o modo normal B1, ainda vazio. Testes previstos: `npm run check:preview`, `npm test`, `npm run check`. Não usar `file://`. Instruções detalhadas em `docs/B2_PREVIEW.md`.

### Evidências e limites
- **PASS V8 desta rodada:** 13/13 callbacks das suítes B2/B2-W1 sobre código e dados GitHub atualizados; 10/10 testes B2-W2 (contratos disjuntos, preview/produção, IDs, data/falas, 66 locais vazios, proposta Flora, PWA, manipulação adversa), com gerador de snapshot `--check` avaliado em V8 e comparado byte a byte (PASS); 2/2 testes de DOM **simulado** com leitura da prévia, renderização lista/detalhes, falas vinculadas, seleção pessoal persistida na chave `hemo2026:flora:preferences:v1` e abertura normal isolada. Também PASS de sintaxe JS por compilação V8 e readback de GitHub; **25 casos V8 no total**, além de checagens estáticas e da UI simulada.
- **PASS B1 histórico reportado por executor, NÃO reexecutado aqui como Node:** 6 testes B1 via V8 na execução original; auditoria B1 segue `STATIC_ACCEPTED_RUNTIME_QA_PENDING`.
- **NOT_RUN:** `npm test`, `npm run check`, `npm run test:b2`, `npm run check:preview` nativos via Node, servidor HTTP e navegação real, Chromium/Firefox mobile ou desktop, instalação PWA, offline/cold-warm, acessibilidade visual, persistência/backup reais. Código remoto acessado por conector GitHub; `git ls-remote` no runtime Linux falhou `Could not resolve host: github.com` e workspace Windows não está montado. Runner adaptado V8/DOM simulado **não equivale a navegador homologado**.
- **Cobertura científica inalterada e incompleta:** sessões candidatas 33/34/34/20 por dia, 42 falas e 66 salas pendentes; papéis, descrições e eventual restante do congresso seguem sem prova de completude. `public/schedule.json` continua `pending_b2` com 0 itens. Uma promoção integral `verified` exige fontes completas e gate próprio.
- **Restrições cumpridas:** sem Codex/Work, PR, Code Review, merge na main, deployment, infraestrutura, serviços externos, OAuth, alteração CONAHP ou escrita de preferências privadas em GitHub.

**Próximo gate:** orquestrador auditar arquivos/testes/contrato de prévia e decidir QA browser/deploy em rodada específica; B2 integral ainda depende de fonte oficial completa.

## HEMO B2-UX1 - Sugestão Flora e legibilidade mobile (25/10/2026)

**Status:** `HEMO_B2_UX1_READY_FOR_ORCHESTRATOR_REVIEW`. Branch isolada `feat/hemo-b2-ux-sugestao-flora`, baseada no commit autorizado `224a27527682d7daec58ad6a0b05d8e8dfbf0422`. Escopo limitado a UX, filtros e testes; sem alteração da curadoria, dos dados oficiais, da `main`, do CONAHP ou da Vercel.

### Alterações

- `public/schedule-utils.js` separa `recommendation.level` dos campos pessoais de `prefs`; `Recomendadas` é Alta + Média, sem qualquer escrita de interesse, prioridade ou presença.
- `public/index.html` e `public/b18.js` adicionam o filtro principal **Sugestão Flora**, preservam **Meu interesse** e renomeiam a prioridade avançada para **Minha prioridade**. A UI migra estado antigo sem converter `priority` em recomendação, preserva a seleção válida, abre Lista no primeiro acesso mobile e respeita visualização explicitamente salva.
- `public/b18.js` mostra a recomendação nos cartões e na grade, contagens do dia/período e vazio acionável. `public/b18.css` garante largura mínima calculada e rolagem interna na grade mobile, sem overflow horizontal da página.
- `scripts/build-preview.mjs` normaliza CRLF somente durante a comparação, tornando `check:preview` determinístico no checkout Windows sem alterar o snapshot.
- `tests/hemo-b2-preview-ui.test.mjs` e `tests/hemo-b2-ux1.test.mjs` cobrem separação, 37 recomendadas, dia 31 com 6, migração/persistência, Lista/Agenda, segurança/namespace e prévia opt-in.

### Evidências UX1

- `npm test`: **PASS, 36/36**.
- `npm run check`: **PASS**, incluindo `npm run check:preview` com 121 sessões e 42 falas.
- Chromium local: **PASS** em 390x844 e 1280x900; prévia `?preview=1`, Lista mobile, Recomendadas com 37 no período, dia 31 com 6, persistência após recarga, filtro sem resultados com ações, detalhes e grade desktop/mobile. Em 390px, a página ficou sem overflow horizontal e a grade usou rolagem interna (811px de conteúdo em 359px visíveis).
- QA Vercel não foi repetido nem alterado; não houve deployment/redeploy.

### Pendências

PWA offline/instalação, backup real em navegador, autenticação/proteção Vercel e nova publicação permanecem fora desta rodada e dependem do orquestrador. O snapshot continua parcial: 121 sessões candidatas, 42 falas e 66 salas a confirmar; a programação oficial continua `pending_b2` com zero sessões.

## HEMO B2-UX1-R1 - Correções finais dos filtros (25/10/2026)

**Status:** `HEMO_B2_UX1_R1_READY_FOR_ORCHESTRATOR_REVIEW`. Correção limitada à mesma branch UX1, sem deployment/redeploy, PR, Code Review, alteração de dados, `main`, CONAHP ou Vercel.

### Correções

- `public/b18.js` reconhece a presença do campo `recommendation` como estado UX1. Estados anteriores têm somente o filtro de prioridade da interface limpo na primeira leitura; preferências por sessão e backups permanecem intactos. Estados UX1 preservam filtros avançados escolhidos depois da migração.
- Minha Agenda não aplica o filtro automático Sugestão Flora. O seletor fica desativado nessa aba com indicação explícita, enquanto a seleção escolhida é preservada para o retorno à Programação.
- O estado vazio identifica filtros de horário, período, conflito, presença, interesse, prioridade, busca e modalidade. A ação parcial passou a dizer `Remover filtro Flora`; a ação completa diz `Limpar todos os filtros`.
- `tests/hemo-b2-preview-ui.test.mjs` cobre migração `Alta`/`Essencial`, preservação de preferência pessoal, sessão Baixa incluída, retorno de aba e persistência.

### Evidências R1

- `npm test`: **PASS, 37/37**.
- `npm run check`: **PASS**, incluindo `npm run check:preview` (`121` sessões, `42` falas).
- Smoke Chromium local em viewport `390x844`: Lista no primeiro acesso; `11` recomendadas no dia 28 e `37` no período; `6` recomendadas no dia 31; Minha Agenda exibiu a sessão Baixa salva (`1 sessão em sábado`), com Sugestão Flora não aplicada e seleção preservada ao retornar; limpeza retornou à Programação.
- Screenshot/DOM confirmaram banner parcial (`121/42/66`), layout mobile legível, sem overflow horizontal da página e indicação explícita de Minha Agenda.

### Limites

O smoke é local e não comprova login/proteção Vercel, PWA instalado/offline, backup em navegador real ou publicação. A prévia continua parcial e a rota normal permanece `pending_b2` com zero sessões. Aguardar auditoria do orquestrador antes de qualquer publicação.

## HEMO B2-UX2 — Identidade visual e atualização segura do PWA (25/10/2026)

**Status:** `HEMO_B2_UX2_READY_FOR_ORCHESTRATOR_REVIEW`. Branch independente `feat/hemo-b2-ux2-visual`, baseada no commit aprovado `550c71cfffa6673f7a148a160c100e872f8977ba`. Nenhuma publicação foi executada.

### Referências visuais e limites

- Referências consultadas: [site HEMO 2026](https://hemo.org.br/) e [notícia do CRF-RJ sobre o HEMO 2026](https://portal.crf-rj.org.br/noticias/eventos/6481-vem-ai-o-congresso-brasileiro-de-hematologia-hemoterapia-e-terapia-celular-hemo-2026-de-28-a-31-de-outubro-no-riocentro.html), incluindo o [cartaz público do evento](https://portal.crf-rj.org.br/images/post-dez-hemo2026.jpg).
- O acesso direto ao site HEMO retornou HTTP 403 neste ambiente; a referência visual efetivamente inspecionada foi o cartaz publicado pelo CRF-RJ. Não foi encontrado manual digital público com HEX oficial.
- Paleta aproximada, não oficial: off-white `#f3eadc`, grafite `#3f4145`, ocre/laranja `#d9823d`, laranja profundo `#ad5d2d`, roxo residual `#4f2c6b` e teal `#286d70`. O roxo foi reduzido ao papel de acento, sem substituir a identidade HEMO por CONAHP/RIW.

### Alterações

- `public/b18.css`, `public/index.html` e `public/manifest.webmanifest`: hierarquia visual, tema, cabeçalho, abas, seletores, botões, legenda, cartões, modais e espaçamento mobile refinados; preservados os contratos UX1-R1 e o banner persistente `121/42/66`.
- `public/service-worker.js`: cache exclusivo `hemo2026:public:b2ux2-v1`; navegação e código usam network-first com fallback seguro; ativação remove somente caches anteriores do namespace HEMO e mantém caches de outros produtos intocados.
- `public/b18.js`: registro do SW usa `updateViaCache: 'none'` para não reutilizar o script antigo do navegador.
- `tests/hemo-b2-sw.test.mjs`: rotação do SW a partir de navegador controlado pelo cache anterior, isolamento de namespaces, fallback de código e prévia opt-in.
- Capturas: [antes mobile 390](evidence/hemo-b2-ux2/before-mobile-390.png), [depois mobile 390](evidence/hemo-b2-ux2/after-mobile-390.png), [depois mobile 430](evidence/hemo-b2-ux2/after-mobile-430.png) e [depois desktop 1280](evidence/hemo-b2-ux2/after-desktop-1280.png).

### Evidências

- `npm test`: **PASS, 39/39**.
- `npm run check`: **PASS**, incluindo sintaxe, `npm run check:preview` e a suíte nativa.
- `npm run check:preview`: **PASS**, snapshot reproduzível com 121 sessões e 42 falas.
- Chromium local: **PASS** em 360, 390, 430 e 1280 px. Primeiro acesso móvel abriu Lista; 37 sessões Recomendadas no período; dia 31 exibiu 6; uma sessão Baixa incluída apareceu em Minha Agenda; retorno à Programação preservou Sugestão Flora; filtro vazio informou os filtros ativos e permitiu limpeza; modal de filtros avançados abriu; Grade usou rolagem interna (`811px` em viewport `390px`) sem overflow horizontal da página.
- Migração real do navegador: antes do reload havia controle pelo SW com cache `hemo2026:public:b2w2-v1`; após atualização explícita e reload, ficou `hemo2026:public:b2ux2-v1`. O teste nativo também confirmou preservação de `localStorage` e não remoção de caches de outros namespaces.
- Rota normal `/`: permaneceu `pending_b2`, com `0` sessões; o aviso de prévia ficou oculto. A prévia continuou disponível somente em `/?preview=1`.

### Limitações e restrições

As evidências são locais e não comprovam login/proteção Vercel, publicação, PWA instalado/offline em dispositivo real ou backup/restore em navegador real. Não houve deployment, redeploy, alteração na Vercel, modificação de dados, curadoria, preferências privadas, `main`, CONAHP, PR ou Code Review. SHA publicado: `2290084e61237127c644273fda0c9f54c3619f6c`.

## HEMO B2-UX2-R1 — Contraste e fallback do PWA (25/10/2026)

**Status:** `HEMO_B2_UX2_R1_READY_FOR_ORCHESTRATOR_REVIEW`. Correção limitada à branch `feat/hemo-b2-ux2-visual`, baseada no HEAD auditado `86a2eceea31008038e437ec79d05737428b07f32`. Sem publicação.

### Correções

- `public/b18.css`: controles ativos com texto branco — abas, dias, Agenda/Lista, segmentos de filtros e limpeza de filtros — passaram a usar `#AD5D2D` (`--orange-deep`) com `!important` para vencer regras anteriores. O contraste calculado é `4,79:1` contra `#FFFFFF`; `#D9823D` mantém uso decorativo.
- `public/service-worker.js`: `networkFirst(request, fallback)` não usa mais `/index.html` por padrão. Navegação passa explicitamente o fallback HTML; JS, CSS e manifest recebem somente resposta previamente cacheada do próprio recurso ou `503 text/plain` com `Cache-Control: no-store`.
- Respostas HTTP não-OK nunca são armazenadas; limpeza continua limitada a caches `hemo2026:`; não há acesso a `localStorage`; `?preview=1` permanece opt-in.

### Testes e evidências

- `npm test`: **PASS, 43/43**.
- `npm run check`: **PASS**.
- `npm run check:preview`: **PASS**, snapshot reproduzível com 121 sessões e 42 falas.
- `tests/hemo-b2-sw.test.mjs`: offline com JS cacheado retorna o próprio JS; offline sem cache retorna 503 sem HTML e sem gravar erro; navegação offline pode usar `/index.html` cacheado.
- `tests/hemo-b2-ux2-r1.test.mjs`: verifica contraste WCAG dos pares principais e presença das regras nos controles ativos.
- Chromium local: viewport móvel 390 e desktop 1280; estilos computados dos controles ativos retornaram `rgb(173, 93, 45)`; 37 Recomendadas no período; dia 31 com 6; Minha Agenda persistiu após recarga; banner parcial 121/42/66; rota normal `/` ficou `pending_b2`, com 0 sessões e aviso de prévia oculto.

### Limitações

Não foi feito deployment/redeploy nem alterada a Vercel. A migração foi validada por testes nativos e navegador local; PWA instalado/offline em dispositivo real, autenticação/proteção Vercel e backup/restore real continuam não homologados. SHA R1 publicado: `d35ee3c1c9950bc30b59a6e802c51f18f6c6812b`.

## HEMO B2-PUBLIC1 — Publicação pública da prévia PWA (26/10/2026)

**Status:** publicação concluída na branch `feat/hemo-b2-public1`. O código publicado é `0e9c360e70d2eb9fd9051b991becf84387bc8c1b`, baseado exatamente em `21198a76fb5a3fc09fd3c47b18acfe300f5c2de7`; o projeto QA protegido não foi alterado.

### Alterações

- `docs/evidence/hemo-b2-public1/icon-source.svg`: arte gráfica própria do aplicativo, versão `HEMO-PUBLIC1-ICON-1`, construída com grafite `#3f4145`, off-white `#f3eadc`, laranja profundo `#ad5d2d`, ocre `#e3aa3a`, laranja `#d9823d` e verde `#14865b`. Não é apresentada como logotipo oficial.
- `public/icon-192.png` e `public/icon-512.png`: PNGs 192/512 com margens seguras para máscara Android, recorte circular e ícone da tela inicial do iPhone; o fundo roxo herdado foi removido.
- `public/manifest.webmanifest`: nome explícito de prévia parcial, `start_url` `/?preview=1`, tema/background grafite, ícones `any maskable` e identidade independente `hemo2026-public1`.
- `public/index.html`: theme/status bar grafite, título parcial, splash HTML crítico com logo, texto, período/local e indicador; link explícito para o modo normal vazio `/?preview=0`.
- `vercel.json`: redirect 307 apenas quando a raiz não possui o parâmetro `preview`; `/?preview=1` não entra em loop e `public/schedule.json` não é alterado.
- `public/service-worker.js`: cache exclusivo `hemo2026:public:b2public1-v1`; nenhuma preferência local é removida.

### Evidências locais

- `npm test`: **PASS, 46/46**.
- `npm run check`: **PASS**, incluindo `npm run check:preview`.
- `npm run check:preview`: **PASS**, 121 sessões e 42 falas.
- Chromium HTTP local: **PASS** em 390x844 e 1280x900; banner 121/42/66, Recomendadas 37, Lista mobile e Agenda desktop.
- Primeira pintura: captura `evidence/hemo-b2-public1/splash-390-slow-assets.png` com CSS/JS atrasados artificialmente e cache limpo simulado; o conteúdo inline exibiu fundo grafite, HEMO, “Carregando agenda”, período/local e indicador antes dos assets externos.
- Capturas adicionais: `icon-192.png`, `icon-512.png`, `mobile-390-preview.png` e `desktop-1280-preview.png`.

### Limitações e próximo gate

### Fechamento operacional

- Projeto Vercel público: `hemo-flora-2026` (`prj_3oTPmcroB9IeJZ4FAxSoyW8yEmsC`), equipe `team_Wqr8VqX0PftIKdW6x5jZciqo`, plano Hobby, sem integração Git.
- Deployment único: `dpl_Dn74sZA131JKLdbQXUosAkkXhhnU`, `READY`, `production`; URL pública verificada: https://hemo-flora-2026.vercel.app/.
- Proteção: o projeto público está sem SSO Vercel (`ssoProtection=null`); a URL foi aberta em contexto anônimo sem tela de login. O projeto QA `hemo-preview-qa-2026` permanece protegido com `deploymentType=all`, `paused=false`, aliases e deployments anteriores intactos.
- Verificação pública: `/` retorna redirect 307 para `/?preview=1`; a prévia mostra o banner parcial, 121 sessões, 42 palestras, 66 salas a confirmar e 37 Recomendadas. `/?preview=0` mantém o modo normal `pending_b2` sem sessões.
- Chromium anônimo: PASS em 390x844 e 1280x900; Lista mobile, Agenda desktop, Minha Agenda após recarga, filtro Recomendadas e dia 31 com 6 sessões; sem erros de console observados.
- PWA: manifesto, ícones PNG, splash HTML e cache `hemo2026:public:b2public1-v1` verificados; instalação Android/iPhone e offline em dispositivo físico permanecem **NOT_RUN**.
- Rollback: não foi necessário; como o projeto público tem um único deployment, qualquer reversão futura deve ser decidida pelo orquestrador e executada como operação separada. Não reenviar nesta missão.
- O conteúdo continua deliberadamente parcial e não representa a programação científica completa. A URL não deve ser encaminhada a Flora antes da auditoria independente.
