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

## 2026-10-25 — HEMO B2-UX2-R1

- Corrigido o contraste dos controles ativos com texto branco: abas, dias, Agenda/Lista, segmentos selecionados e limpeza de filtros usam `#AD5D2D`, com contraste calculado de 4,79:1 contra branco; `#D9823D` permanece disponível para detalhes decorativos.
- Corrigido o fallback do Service Worker: somente navegação pode usar `/index.html`; JS, CSS e manifest usam apenas seu próprio cache e retornam 503 texto quando indisponíveis.
- Adicionados testes para cache de código presente/ausente, navegação offline, não armazenamento de erros e contraste automatizado.
- `npm test` 43/43, `npm run check` e `npm run check:preview` passaram; smoke Chromium local móvel/desktop concluído.

## 2026-10-26 — HEMO B2-PUBLIC1

- Criada a branch de release `feat/hemo-b2-public1` a partir do SHA imutável UX2-R1 `21198a76fb5a3fc09fd3c47b18acfe300f5c2de7`.
- Substituídos os ícones PWA roxos herdados por arte própria do aplicativo, versão `HEMO-PUBLIC1-ICON-1`, em 192/512 px, com margens seguras para máscara e referências grafite/off-white/laranja/ocre/verde; sem alegar que é logotipo oficial.
- Atualizados manifesto, theme/background color, atalho `/?preview=1`, tela HTML de primeira pintura e redirect condicional da raiz exclusivamente para o projeto público.
- Versionado o cache para `hemo2026:public:b2public1-v1`; `schedule.json` permanece `pending_b2` e a prévia permanece parcial.
- Testes locais: `npm test` 46/46, `npm run check` e `npm run check:preview` passaram; smoke Chromium HTTP em 390x844 e 1280x900, incluindo captura com CSS/JS atrasados e cache vazio simulado.
