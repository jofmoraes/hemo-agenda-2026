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

- Status: implementação local concluída; branch pronta para commit/push e preflight do único deployment público autorizado.
- Branch: `feat/hemo-b2-public1`.
- Base imutável: `21198a76fb5a3fc09fd3c47b18acfe300f5c2de7`.
- Workspace isolado: `D:\JUCA\AI Lab\hemo-2026\hemo-2026-app-b2-public1`.
- Projeto público planejado: `hemo-flora-2026`; o projeto QA `hemo-preview-qa-2026` permaneceu sem alterações.
- Escopo: ícones próprios PWA 192/512 e evidência SVG, manifesto com `start_url=/?preview=1`, redirect condicional da raiz, splash HTML crítico e cache `hemo2026:public:b2public1-v1`.
- Dados preservados: `schedule.json` continua `pending_b2`/0; prévia continua 121 sessões, 42 falas e 66 salas a confirmar.
- Testes: `npm test` 46/46 PASS; `npm run check` PASS; `npm run check:preview` PASS; smoke Chromium local PASS em 390x844 e 1280x900; splash com assets CSS/JS atrasados capturado.
- Pendente: commit/push, único deployment público, QA anônimo online e testes de instalação real Android/iPhone; marcar NOT_RUN quando dispositivo não estiver disponível.

## HEMO B3-APP1 — Integração local dos trabalhos científicos

- Status: implementação local concluída e pronta para auditoria independente; nenhum deployment/redeploy foi feito.
- Branch: `feat/hemo-b3-app1-works`.
- Bases: aplicativo `0e9c360e70d2eb9fd9051b991becf84387bc8c1b`; inventário B3 `8d6e24d6be9957ac47e03fdb2c4d2029c56e41c7`.
- Catálogo: `public/works-catalog.json`, 1.987 registros, 1.987 IDs únicos, 1.802.540 bytes; sem JSON bruto, HTML integral, resumos ou dados de depuração.
- GSH: 27 no filtro único (`7` autoria, `14` instituição, `6` título pendente); ID 3566 excluído e leads 4264/4097/5894/5626/4067 mantidos fora.
- Interface: aba separada, busca, dia, modalidade, filtro GSH, trabalhos salvos, paginação de 30 e namespace próprio de preferências/backup.
- Validação: `npm test` 51/51 PASS; `npm run check` PASS; `npm run check:preview` PASS; Chromium local PASS em 360/390/430/1280 px, com persistência de trabalho após recarga.
- Restrições: sem alteração de `main`, CONAHP, Vercel, programação, curadoria Flora ou preferências de sessões; publicação e PWA físico NOT_RUN.
- Próximo passo: auditoria independente do orquestrador antes de qualquer publicação.

## HEMO B3-FINAL1 — Hardening e release público

- Status: hardening local concluído; deployment público condicionado ao preflight final e ao único gate de publicação autorizado na Issue #4.
- Branch: `feat/hemo-b3-final1-release`, baseada exatamente em `3df073a088188a04bf3f8e201c24c94f3d5a96e9`.
- Projeto público autorizado: `hemo-flora-2026` (`prj_3oTPmcroB9IeJZ4FAxSoyW8yEmsC`), equipe `team_Wqr8VqX0PftIKdW6x5jZciqo`; projeto QA protegido não foi alterado.
- Preflight Vercel: CLI 58.10.0 autenticada na conta/equipe corretas; projeto confirmado por ID; plano Hobby sem indicação de custo; Git autodeploy desabilitado; deployment anterior READY e alias preservados; exatamente um deployment anterior antes da publicação.
- Catálogo: 1.987 IDs únicos, 27 GSH, 1.802.540 bytes, carregamento sob demanda; validação WORKS4 preserva 40 assuntos, 110 orais recuperados, 3855 anômalo e 3566 excluído.
- QA local: `npm test` 58/58, `npm run check`, `npm run check:preview`; Chromium em 360/390/430/1280; normal `pending_b2` com 0 sessões; prévia 121/42/66; GSH 27; última página 67/67 com 7; preferência de trabalho sobreviveu a reload; console sem erros.
- Evidências visuais: `docs/evidence/hemo-b3-final1/`; hashes distintos para normal/GSH e viewports 360/390/430/1280.
- Pendências antes do release: commit/push, único deployment público, readback de alias/deployment e smoke anônimo HTTPS; Android/iPhone físico permanece NOT_RUN se não houver dispositivos disponíveis.
