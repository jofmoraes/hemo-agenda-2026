# Changelog AI

## 2026-10-23 — HEMO B0

- Criado o repositório público independente `jofmoraes/hemo-agenda-2026`.
- Inicializada a branch `main` com README mínimo e commit inicial.
- Nenhum workflow, deployment ou integração externa foi configurado.

## 2026-10-25 — HEMO B2-UX1-R1

- Corrigida a migração do filtro legado de prioridade sem tocar preferências pessoais por sessão.
- Minha Agenda passou a mostrar todas as sessões incluídas, inclusive Sugestão Flora Baixa, preservando o filtro ao voltar para Programação.
- Estado vazio e ações de limpeza passaram a identificar corretamente os filtros ativos.
- `npm test` 37/37 e `npm run check` passaram; smoke Chromium mobile local realizado.

## 2026-10-25 — HEMO B2-UX2

- Refinada a identidade visual com aproximação fundamentada no cartaz público do HEMO 2026: fundo off-white, cartões claros, cabeçalho grafite e acentos ocre/laranja, mantendo estados, conflitos e Sugestão Flora distinguíveis.
- Atualizados tema do PWA, cabeçalho, abas, controles, filtros, legenda, cartões, modais e ajustes de espaçamento mobile; a estrutura da navegação e os dados da programação permaneceram inalterados.
- Versionado o cache para `hemo2026:public:b2ux2-v1`; recursos de código passaram a usar network-first com fallback seguro, `updateViaCache: none` e limpeza somente do namespace HEMO obsoleto.
- Adicionados testes de rotação do Service Worker a partir de navegador controlado pelo cache anterior, preservando caches externos e armazenamento local.
- `npm test` 39/39, `npm run check` e `npm run check:preview` passaram; QA Chromium local realizado em 360, 390, 430 e 1280 px.
