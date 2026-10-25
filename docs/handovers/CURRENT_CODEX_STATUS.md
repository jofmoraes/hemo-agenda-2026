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
