# HEMO B3-WORKS4 — Consolidação offline dos trabalhos científicos

## Resultado executivo

Foi consolidado offline o export autorizado do Tampermonkey v2, sem nova requisição ao site do HEMO e sem alterar a agenda pública. O inventário contém **1.987 registros com IDs oficiais únicos**, preserva o registro bruto em cada item e está pronto para auditoria do orquestrador.

Status: `HEMO_B3_WORKS4_OFFLINE_INVENTORY_READY_FOR_ORCHESTRATOR_REVIEW`.

Artefatos versionados:

- [inventário geral](../data/b3-works4-inventory.json)
- [inventário GSH](../data/b3-works4-gsh.json)
- [relatório de validação](../data/b3-works4-report.json)
- [script reprodutível](../scripts/build-b3-works4.mjs)
- [testes](../tests/hemo-b3-works4.test.mjs)

O mesmo resultado foi salvo como arquivos derivados na pasta local de extração, sem sobrescrever os quatro arquivos exportados:
`D:\JUCA\AI Lab\hemo-2026\hemo-tampermonkey\HEMO2026_B3_WORKS4_INVENTORY.json`, `HEMO2026_B3_WORKS4_GSH.json` e `HEMO2026_B3_WORKS4_REPORT.json`.

## Fontes e proveniência

Fonte primária utilizada somente offline:

`D:\JUCA\AI Lab\hemo-2026\hemo-tampermonkey\HEMO2026_TRABALHOS_2026-10-27T15-08-54-380Z_COMPLETO.json`

Também foram conferidos o CSV geral, o CSV de candidatos GSH e o arquivo de cobertura do mesmo lote. O PDF `Hemo 2026 - Relação Trabalhos.pdf` foi preservado como fonte complementar; seus metadados foram conferidos, mas ele não foi convertido integralmente porque o JSON já fornecia os campos necessários para esta consolidação. Os hashes SHA-256 dos cinco arquivos fonte estão gravados em `source.files` nos três artefatos JSON.

Proveniência de cada registro inclui URL da listagem, URL de detalhe quando capturada, instante do export, status do detalhe, texto bruto de metadados e o objeto `raw` original. Nenhum cookie, token, credencial ou sessão autenticada foi incluído.

## Reconciliação geral

- Registros JSON: **1.987**.
- IDs únicos: **1.987**; duplicidades: **0**.
- Assuntos/áreas declarados pelos controles da fonte: **40**.
- Soma dos totais dos 40 controles: **1.987**.
- Modalidades: **1.430 Painel**, **447 Visita Guiada**, **110 Apresentação Oral**.
- Datas: 28/10 **444**, 29/10 **506**, 30/10 **558**, 31/10 **479**.
- Detalhes já salvos: **366 OK**, **1.620 pendentes**, **1 bloqueado por HTTP 403**.

O campo `area` estava vazio em todos os itens da listagem. Para evitar inferência insegura por ordem, ID ou soma de controles, a área individual só foi preenchida nos **355 registros** cujo detalhe oficial já salvo continha um bloco de área reconhecível entre os 40 assuntos. Os **1.632 restantes** permanecem `area: null`, `areaStatus: unresolved`; `inferredAreaAssignments` é zero. Assim, os totais dos assuntos foram reconciliados como controle agregado, mas não foram artificialmente distribuídos pelos trabalhos.

### Horários orais

Os horários foram recuperados de `listMetaText` para os **110/110** trabalhos de Apresentação Oral, com início, fim e texto bruto preservados. O ID **3855** apresenta a sequência capturada `06:45:00 às 16:52:00`, que excede a duração esperada e foi apenas sinalizada como anomalia; não houve correção sem evidência adicional.

## Normalização e correções

O valor original permanece em `raw` e cada alteração é registrada em `corrections` com ID, campo, valor original, valor normalizado e justificativa.

- **1** título truncado corrigido a partir do detalhe salvo: ID **5769**, completado para `ANÁLISE DE AMOSTRAS RHD COM SCOR =<2+ NO LABORATÓRIO DE REFERÊNCIA`.
- **50** ações no campo de autores: expressões que a listagem colocou no campo de autores foram limpas ou recuperadas do detalhe salvo; divergências entre listagem e detalhe foram mantidas com o valor da listagem e marcadas para revisão.
- Exemplo recuperado: ID **4510**, cujo valor bruto era `MIASTENIA GRAVIS`; os autores normalizados vieram do detalhe salvo e o valor bruto foi preservado.
- Datas, modalidades, salas e horários foram comparados com `listMetaText`; datas inválidas ou divergências de metadados não foram inventadas ou silenciosamente substituídas.

## Trabalho GSH

Foi usado um único conceito: `Trabalho GSH`. Leandro e Eduardo foram tratados como pistas alternativas de autoria, e não como filtros separados ou condições simultâneas.

Classificação dos 28 candidatos:

- **Autoria confirmada — 7:** 3939, 3941, 5960, 4307, 3911, 4538, 4548. Os quatro primeiros contêm Leandro Felipe Figueiredo Dalmazzo; os três últimos contêm Eduardo Ferro de Carvalho, incluindo a variante `Eduardo Ferro Carvalho`.
- **Instituição/unidade explicitamente evidenciada — 14:** 4243, 4510, 3997, 5452, 5403, 5756, 5769, 5660, 3732, 3887, 4900, 5125, 5454, 6362. A evidência vem do título ou do detalhe oficial já salvo e é preservada no registro GSH.
- **Pendente de verificação — 6:** 4514, 4599, 4601, 5163, 5383, 5594. A listagem menciona GSH, mas o detalhe oficial não foi capturado nesta exportação; não foram feitas novas requisições.
- **Falso positivo — 1:** 3566. O autor é `Eduardo Ferro Dos Santos`, não Eduardo Ferro de Carvalho; a associação foi excluída explicitamente.

As categorias acima são exclusivas no inventário. Para os trabalhos GSH, o arquivo mantém autores, modalidade, data, horário, sala, área quando segura, evidência textual, status de detalhe e `raw`.

## Integração futura proposta

Não foi implementada nem publicada nesta rodada. A proposta é uma aba **Trabalhos científicos**, com pesquisa geral por ID, título, autor, instituição e área, e um único filtro específico chamado **Trabalhos GSH**. Os pendentes não devem ser apresentados como confirmados antes de nova validação autorizada; a agenda pública continua sem trabalhos científicos publicados.

## Limitações e segurança

- Nenhuma nova abertura ou requisição ao site HEMO foi realizada.
- Detalhes ausentes/403 não foram preenchidos por inferência.
- O PDF não foi convertido integralmente.
- A área individual permanece incompleta por falta de evidência segura.
- O inventário não declara completude científica além dos 1.987 registros efetivamente presentes no export.
- Não houve alteração em Vercel, aplicativo público, programação, curadoria, `main`, CONAHP ou preferências pessoais.
