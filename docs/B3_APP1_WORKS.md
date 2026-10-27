# HEMO B3-APP1 — Catálogo de trabalhos científicos

Status: implementação local pronta para auditoria independente. Nenhum deployment foi executado.

## Base e proveniência

- Branch: `feat/hemo-b3-app1-works`.
- Base funcional: `0e9c360e70d2eb9fd9051b991becf84387bc8c1b`.
- Inventário B3: `8d6e24d6be9957ac47e03fdb2c4d2029c56e41c7`.
- Fonte oficial registrada: `https://www.hemo.org.br/evento/hemo2026/pt/trabalhosaprovados`.
- Extração utilizada: arquivos offline em `D:\JUCA\AI Lab\hemo-2026\hemo-tampermonkey`; nenhum novo acesso ao site foi feito nesta rodada.
- O catálogo público é `public/works-catalog.json`; os arquivos brutos e detalhes integrais permanecem fora do aplicativo.

## Catálogo compacto

O arquivo contém 1.987 registros e 1.987 IDs únicos. Cada registro publica apenas ID, título, autores quando disponíveis, modalidade, dia/data, horário comprovado, local, área validada, links oficiais, evidências e pendências. HTML integral, resumos, campos de depuração e metadados brutos não são publicados.

Totais preservados do inventário:

- 1.430 painéis, 447 visitas guiadas e 110 apresentações orais.
- 444 trabalhos em 28/10, 506 em 29/10, 558 em 30/10 e 479 em 31/10.
- 110 intervalos orais recuperados; o ID 3855 permanece sem horário publicado e exibe “Horário a confirmar” por anomalia no dado de origem.
- 355 áreas validadas e 1.632 áreas pendentes; a interface não apresenta área como conhecida quando não há comprovação.
- 366 detalhes acessíveis no inventário, 1.620 pendentes e 1 bloqueado; isso não é tratado como completude científica.

O catálogo é carregado somente ao abrir a aba científica e usa 30 itens por página. Assim, a interface não cria 1.987 cartões simultâneos no celular.

## Trabalhos GSH

Existe somente o filtro `Trabalhos GSH`. Ele reúne 27 registros do inventário:

- 7 com autoria de Leandro Felipe Figueiredo Dalmazzo ou Eduardo Ferro de Carvalho identificada;
- 14 com vínculo institucional GSH explícito;
- 6 relacionados à GSH pelo título, com confirmação da afiliação dos autores pendente.

Os 21 primeiros representam o mínimo identificado por autoria ou instituição. Os 27 são a cobertura operacional atual do filtro, sem afirmar que correspondem aos 117 trabalhos divulgados institucionalmente.

O ID 3566 permanece fora do filtro por ser Eduardo Ferro dos Santos, não Eduardo Ferro de Carvalho. Os leads offline de Sandra Regina Loggetto (4264, 4097, 5894, 5626) e Édyla Almeida (4067) também permanecem fora por evidência individual insuficiente; o ID 4307 já está incluído pela autoria confirmada de Leandro.

## Interface e armazenamento

A aba `Trabalhos científicos` fica separada de `Programação` e oferece busca por título/autor/ID, filtros por dia e modalidade, o filtro único GSH e a visão de trabalhos salvos. O interesse de cada trabalho usa exclusivamente as chaves HEMO:

- `hemo2026:flora:works-preferences:v1`
- `hemo2026:flora:works-ui:v1`

O backup `HEMO_2026_FLORA_BACKUP` mantém os registros de sessões existentes e acrescenta trabalhos em campo próprio, sem apagar backups antigos. A programação e as preferências anteriores permanecem segregadas.

## Validação local

- `npm test`: 51/51 PASS.
- `npm run check`: PASS.
- `npm run check:preview`: PASS; 121 sessões e 42 falas.
- Smoke Chromium local: rota normal com 0 sessões, aba científica com 1.987 registros, filtro GSH com 27, busca/paginação, interesse salvo e reidratado após recarga.
- Viewports capturados: 360, 390, 430 e 1280 px; sem overflow horizontal da página no teste móvel.
- Evidências Chromium versionadas: `docs/evidence/hemo-b3-app1/b3-app1-360.png`, `b3-app1-works-390.png`, `b3-app1-430.png`, `b3-app1-desktop.png` e `b3-app1-gsh-390.png`.

Limitações: os 117 trabalhos institucionais não foram individualmente reconciliados; a cobertura de detalhes permanece parcial; instalação PWA em dispositivo físico e publicação Vercel não fazem parte desta rodada.
