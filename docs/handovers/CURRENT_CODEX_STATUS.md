# Current Codex Status

## HEMO B0 — Bootstrap do repositório

- Status: concluído e pronto para revisão do orquestrador.
- Repositório: https://github.com/jofmoraes/hemo-agenda-2026
- Proprietário: `jofmoraes`
- Branch padrão: `main`
- Commit inicial: `e3bd3d260c6b3c0a45dd32b5506b5ed146f939f0`
- Workspace: `D:\JUCA\AI Lab\hemo-2026\hemo-2026-app`
- Escopo executado: apenas bootstrap do repositório; nenhum arquivo foi copiado do CONAHP.
- Verificações remotas: repositório público, workflow `0`, deployment `0`.
- Pendências: nenhuma para o escopo B0.

## HEMO B2-UX1 — Sugestão Flora e legibilidade mobile

- Status: concluído e pronto para revisão do orquestrador; não publicar antes da auditoria.
- Repositório: https://github.com/jofmoraes/hemo-agenda-2026
- Branch: `feat/hemo-b2-ux-sugestao-flora`
- Base: `224a27527682d7daec58ad6a0b05d8e8dfbf0422`
- Commit publicado: `f63d15989ed0a2abdb5226cc36f56982eabec5cc`
- Workspace isolado: `D:\JUCA\AI Lab\hemo-2026\hemo-2026-app-b2-ux1`
- Issue registrada: https://github.com/jofmoraes/hemo-agenda-2026/issues/2#issuecomment-6393189444
- Escopo: filtros automáticos/pessoais separados, migração de UI, persistência de Lista/Agenda, grade mobile com rolagem interna e feedback de contagem/zero resultados.
- Evidências: `npm test` 36/36 PASS; `npm run check` PASS; Chromium local PASS em 390x844 e 1280x900.
- Restrições: sem PR, Code Review, deployment/redeploy, Vercel, `main`, CONAHP, dados oficiais ou preferências privadas externas.
- Pendências: auditoria do orquestrador; PWA offline/instalação e backup real em navegador não homologados nesta rodada; prévia continua parcial (`pending_b2` na rota normal).

## HEMO B2-UX1-R1 — Correções finais dos filtros

- Status: correção implementada e pronta para revisão do orquestrador; sem publicação.
- Branch: `feat/hemo-b2-ux-sugestao-flora`.
- Base auditada: `45a7473743a665364a786eaeb192db8aeed7a4ba`.
- Commit R1 publicado: `5ae114a8b8609dbb0f5070c0b7e8ca63d1cf69ee`.
- Escopo: migração segura do filtro legado de prioridade, Minha Agenda independente da Sugestão Flora automática e feedback de filtros/estado vazio.
- Testes: `npm test` 37/37 PASS; `npm run check` PASS; `npm run check:preview` PASS.
- Smoke: Chromium local em 390x844 com Lista inicial, recomendadas 37 no período, dia 31 com 6, sessão Baixa salva em Minha Agenda, retorno/limpeza de filtros e persistência após recarga.
- Restrições preservadas: sem alteração de preferências privadas externas, dados de programação, `main`, CONAHP, Vercel, deployment/redeploy, PR ou Code Review.
- Próximo passo: auditoria independente do orquestrador; somente depois decidir publicação.

## HEMO B2-UX2 — Identidade visual e atualização segura do PWA

- Status: implementação concluída e pronta para revisão independente; sem deployment/redeploy.
- Branch: `feat/hemo-b2-ux2-visual`.
- Base autorizada: `550c71cfffa6673f7a148a160c100e872f8977ba`.
- Commit publicado: `2290084e61237127c644273fda0c9f54c3619f6c`.
- Workspace isolado: `D:\JUCA\AI Lab\hemo-2026\hemo-2026-app-b2-ux1`.
- Escopo visual: aproximação fundamentada no cartaz público HEMO 2026, sem alegar manual oficial de marca ou códigos HEX oficiais; preservados filtros UX1-R1, Lista mobile, Grade com rolagem interna, Minha Agenda e preferências.
- Escopo PWA: cache `hemo2026:public:b2ux2-v1`, código network-first com fallback, `updateViaCache: none`, remoção apenas de caches `hemo2026:` antigos e nenhum acesso a `localStorage` pelo Service Worker.
- Evidência visual versionada: `docs/evidence/hemo-b2-ux2/` com captura anterior e capturas posteriores em 390, 430 e 1280 px.
- Testes: `npm test` 39/39 PASS; `npm run check` PASS; `npm run check:preview` PASS com 121 sessões e 42 falas.
- Smoke Chromium: migração real `b2w2-v1` → `b2ux2-v1`; 37 recomendadas no período; dia 31 com 6; Minha Agenda exibiu sessão Baixa salva; filtros persistiram após recarga; Lista mobile; Grade com conteúdo interno de 811px em viewport 390px, sem overflow da página; rota normal com 0 sessões e banner parcial oculto.
- Restrições: sem alteração de dados/curadoria, `main`, CONAHP, Vercel, serviços externos, PR, Code Review ou deployment. PWA instalado/offline em dispositivo real permanece não homologado.
- Próximo passo: auditoria do orquestrador antes de qualquer publicação QA.

## HEMO B2-UX2-R1 — Contraste e fallback do PWA

- Status: correções concluídas e prontas para reauditoria independente; sem deployment/redeploy.
- Branch: `feat/hemo-b2-ux2-visual`.
- Base auditada: `86a2eceea31008038e437ec79d05737428b07f32`.
- Commit R1 publicado: `d35ee3c1c9950bc30b59a6e802c51f18f6c6812b`.
- Contraste: controles ativos com texto branco usam `#AD5D2D`, contraste WCAG calculado `4,79:1`; `#D9823D` permanece em detalhes sem texto branco.
- Service Worker: fallback `/index.html` limitado à navegação; código sem rede usa seu próprio cache ou retorna `503 text/plain`, sem substituir JS/CSS/manifest por HTML e sem cachear erro.
- Testes: `npm test` 43/43 PASS; `npm run check` PASS; `npm run check:preview` PASS com 121 sessões e 42 falas.
- Chromium local: contraste computado confirmado em 390 e desktop 1280; 37 recomendadas; dia 31 com 6; Minha Agenda persistiu após recarga; banner 121/42/66; rota normal `pending_b2` com 0 sessões e aviso oculto.
- Restrições: sem alteração de dados, curadoria, preferências privadas, `main`, CONAHP, Vercel, PR, Code Review ou deployment.
- Próximo passo: reauditoria do orquestrador; PWA instalado/offline e proteção Vercel continuam não homologados.

## HEMO B2-PUBLIC1 — Publicação pública da prévia PWA

- Status: deployment público concluído e verificado anonimamente; aguardando auditoria independente do orquestrador antes de encaminhar o link para Flora.
- Branch: `feat/hemo-b2-public1`.
- Base imutável: `21198a76fb5a3fc09fd3c47b18acfe300f5c2de7`.
- Workspace isolado: `D:\JUCA\AI Lab\hemo-2026\hemo-2026-app-b2-public1`.
- Projeto público planejado: `hemo-flora-2026`; o projeto QA `hemo-preview-qa-2026` permaneceu sem alterações.
- Escopo: ícones próprios PWA 192/512 e evidência SVG, manifesto com `start_url=/?preview=1`, redirect condicional da raiz, splash HTML crítico e cache `hemo2026:public:b2public1-v1`.
- Dados preservados: `schedule.json` continua `pending_b2`/0; prévia continua 121 sessões, 42 falas e 66 salas a confirmar.
- Testes: `npm test` 46/46 PASS; `npm run check` PASS; `npm run check:preview` PASS; smoke Chromium local PASS em 390x844 e 1280x900; splash com assets CSS/JS atrasados capturado.
- Código publicado: `0e9c360e70d2eb9fd9051b991becf84387bc8c1b`.
- Projeto público: `hemo-flora-2026` / `prj_3oTPmcroB9IeJZ4FAxSoyW8yEmsC`, equipe `team_Wqr8VqX0PftIKdW6x5jZciqo`, plano Hobby, sem link Git.
- Deployment: `dpl_Dn74sZA131JKLdbQXUosAkkXhhnU`, `READY`, target `production`, aliases `hemo-flora-2026.vercel.app` e hostname de deployment.
- Proteção pública: `ssoProtection=null`; acesso HTTPS anônimo verificado sem login. O QA continua `ssoProtection=all`, `paused=false`, com os deployments históricos preservados.
- QA online: raiz redireciona para `/?preview=1`; HTTP e Chromium confirmaram 121/42/66, Recomendadas 37, dia 31 com 6, Lista mobile, Minha Agenda persistente, modo normal vazio e cache `hemo2026:public:b2public1-v1`.
- NOT_RUN: instalação real em Android/iPhone e teste offline em dispositivo físico; não foram apresentados como homologados.

## HEMO B3-WORKS1 — Pesquisa de trabalhos GSH

- Status: inventário auditável pronto para revisão, com bloqueio externo documentado; nenhum trabalho individual confirmado nesta rodada.
- Branch: `feat/hemo-b3-works-gsh`.
- Workspace isolado: `D:\JUCA\AI Lab\hemo-2026\hemo-2026-app-b3-works-gsh`.
- Artefatos: `data/b3-works-gsh-research.json`, `docs/B3_WORKS_GSH_RESEARCH.md`, `tests/hemo-b3-works-gsh.test.mjs`.
- Fonte oficial prioritária retornou HTTP 403 no navegador Windows, com verificação de segurança. Não houve contorno, CAPTCHA, cookies artificiais ou endpoints alternativos.
- `confirmedWorks=[]` e `candidateWorks=[]`; o agregado institucional de 117 trabalhos (100 painel, 17 visita guiada) está separado e não alimenta o filtro.
- Evidência de vínculo GSH de Leandro Dalmazzo e Eduardo Ferro foi registrada sem inferir autoria no HEMO 2026.
- Proposta futura: aba `Trabalhos científicos` e único filtro `Trabalhos GSH`, somente sobre registros individuais confirmados.
- Teste específico: `node --test tests/hemo-b3-works-gsh.test.mjs`.
- Pendência: obter exportação legitimamente acessível da lista oficial para reconciliar IDs e metadados. Não modificar a agenda pública até esse gate.

## HEMO B3-WORKS2 — Extração pelo navegador

- Status: `SOURCE_ACCESS_BLOCKED`; tentativa única no navegador integrado encontrou HTTP 403 antes do conteúdo oficial.
- Branch: `feat/hemo-b3-works-gsh`, derivada do commit WORKS1 `a88bf59710731146860d2aa1d2fc6cad4a451837`.
- Cobertura: 0 áreas, 0 trabalhos carregados e 0 trabalhos individualmente validados; catálogo estruturado vazio.
- Verificação de sessão autorizada Chrome foi somente leitura de abas; nenhuma aba da fonte oficial estava aberta. Cookies, tokens, armazenamento e credenciais não foram acessados.
- Ação manual necessária: proprietário abrir a fonte no Opera/Chrome com acesso normal e disponibilizar a aba conectada ao Codex ou entregar exportação autorizada HTML/MHTML/PDF.
- `public/*`, Vercel, QA, `main`, CONAHP e preferências pessoais permanecem inalterados.

## HEMO B3-WORKS4 — Consolidação offline

- Status: `HEMO_B3_WORKS4_OFFLINE_INVENTORY_READY_FOR_ORCHESTRATOR_REVIEW`.
- Branch: `feat/hemo-b3-works4-offline-inventory`, derivada da branch B3 existente sem alterar sua base.
- Escopo: normalização offline dos 1.987 registros exportados, reconciliação dos 40 controles, horários das 110 apresentações orais, correções auditáveis e classificação dos 28 candidatos GSH.
- Artefatos: `data/b3-works4-inventory.json`, `data/b3-works4-gsh.json`, `data/b3-works4-report.json`, `docs/B3_WORKS4_OFFLINE.md`, `scripts/build-b3-works4.mjs`, `tests/hemo-b3-works4.test.mjs`.
- Resultado: 1.987 IDs únicos; 355 áreas confirmadas por detalhe salvo; 1.632 áreas pendentes; 110/110 horários orais recuperados; 7 autorias GSH, 14 instituições, 6 pendências e 1 falso positivo.
- Fonte local: `D:\JUCA\AI Lab\hemo-2026\hemo-tampermonkey`; originais não sobrescritos. Não houve acesso web ou nova requisição de detalhes.
- Validação: `node --test tests/hemo-b3-works4.test.mjs`, `npm test` (57/57), `npm run check` e `npm run check:preview` passaram; pendentes apenas commit/push e auditoria independente do orquestrador.

## HEMO B3-GSH2 — Reconciliação offline

- Status: `HEMO_B3_GSH2_READY_FOR_ORCHESTRATOR_REVIEW`; sem publicação e sem alteração do catálogo público.
- Branch/worktree: `feat/hemo-b3-gsh2-enrichment` em `D:\JUCA\AI Lab\hemo-2026\hemo-2026-app-b3-gsh2-enrichment`, derivado de `8d6e24d6be9957ac47e03fdb2c4d2029c56e41c7`, independente da B3-FINAL1.
- Artefatos: `data/b3-gsh2-review.json`, `data/b3-gsh2-filter-patch.json`, `data/b3-gsh2-review.schema.json`, `docs/B3_GSH2_REVIEW.md`, `scripts/build-b3-gsh2-review.mjs`, `tests/hemo-b3-gsh2.test.mjs`.
- Resultado: 1.987 IDs auditados; 21 confirmados, 6 relacionados pelo título, 5 leads de revisão, 1 falso positivo; filtro futuro de 27 IDs igual ao APP1 (`added=[]`, `removed=[]`).
- Leads: Sandra `4264/4097/5894/5626`; Édyla `4067`; outros nove IDs com Édyla foram deliberadamente excluídos por falta de prova individual GSH. `3566` é homônimo excluído.
- Fonte: export offline SHA-256 `c14f63621b8ae2b38fc88ad12c851c2e708c3000776c32796893caa414b1a2bd`; nenhum detalhe foi requisitado novamente e o PDF não foi copiado/convertido.
- Validação: `node --check scripts/build-b3-gsh2-review.mjs`, `node scripts/build-b3-gsh2-review.mjs` e `node --test tests/hemo-b3-gsh2.test.mjs` passam.
- Restrições: sem `public/*`, Vercel, `main`, CONAHP, B3-FINAL1, PR, Code Review ou deploy. Próxima decisão: auditoria do orquestrador e eventual integração futura autorizada.
