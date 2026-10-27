# HEMO B3-GSH2 — Reconciliação offline de trabalhos GSH

Status: `HEMO_B3_GSH2_READY_FOR_ORCHESTRATOR_REVIEW`.

Esta missão foi executada em worktree e branch próprios, a partir do inventário B3-WORKS4 (`8d6e24d6be9957ac47e03fdb2c4d2029c56e41c7`). A pesquisa usou somente o export offline já autorizado em `D:\JUCA\AI Lab\hemo-2026\hemo-tampermonkey`. Não houve nova consulta automatizada ao site HEMO, nem cópia/conversão do PDF de aproximadamente 196 MB.

## Resultado

- Entrada auditada: **1.987 registros**, **1.987 IDs únicos**.
- Menções GSH encontradas por busca accent/case insensitive: **20 IDs** — 16 em títulos e 14 em detalhes salvos, com 10 sobreposição.
- **21 IDs confirmados como relação GSH**: 7 por identidade/autoria de Leandro ou Eduardo e 14 por evidência institucional explícita no título ou detalhe salvo.
- **6 IDs relacionados pelo título**, com autoria/afiliação individual não verificada: `4514`, `4599`, `4601`, `5163`, `5383`, `5594`.
- **5 leads somente para revisão**, fora do filtro: Sandra `4264`, `4097`, `5894`, `5626`; Édyla `4067`.
- **1 falso positivo excluído**: `3566`, cujo autor é Eduardo Ferro dos Santos, não Eduardo Ferro de Carvalho.
- O conjunto operacional do APP1 permanece com **27 IDs**: `added=[]`, `removed=[]`. As 27 mudanças são taxonômicas e de evidência, não de publicação.

Os IDs, provas, confiança, decisão e origem por campo estão em [data/b3-gsh2-review.json](../data/b3-gsh2-review.json). O patch compacto para integração futura está em [data/b3-gsh2-filter-patch.json](../data/b3-gsh2-filter-patch.json); ele é deliberadamente `publishable: false`.

## Autoria e identidade institucional

Leandro foi localizado exatamente nos IDs `3939`, `3941`, `5960` e `4307`. Eduardo Ferro de Carvalho foi localizado nos IDs `3911`, `4538` e `4548`, incluindo a variante `Eduardo Ferro Carvalho`. O homônimo Eduardo Ferro dos Santos aparece somente no `3566` e foi excluído.

Sandra Regina Loggetto aparece exatamente em `4264`, `4097`, `5894` e `5626`. Os dois primeiros coincidem com a descrição temática da publicação institucional previamente registrada; os dois últimos têm apenas a correspondência nominal no export. Em todos os quatro casos a autoria é comprovada no campo oficial de autores, mas a afiliação GSH individual não está capturada; por isso são `LEAD_NEEDS_EVIDENCE`.

Édyla aparece em **11 IDs**: `4067`, `4198`, `5541`, `6193`, `4203`, `5555`, `5554`, `4307`, `5522`, `5906`, `5542`. O `4307` já é confirmado pela autoria de Leandro. O `4067` fica como lead porque coincide com a pista institucional previamente registrada sobre hepatites em doadores. Os outros nove não foram promovidos: uma pessoa aparecer em outros trabalhos não transfere automaticamente a relação GSH para eles.

Os 14 trabalhos com evidência institucional explícita foram mantidos como relação do trabalho com GSH, sem declarar que todos os coautores são empregados, líderes ou colaboradores atuais. A lista de autores repetidos nesses 14 trabalhos foi auditada e nenhum autor foi promovido individualmente sem prova própria.

## Taxonomia usada

| Status | Quantidade | Regra |
| --- | ---: | --- |
| `AUTHOR_IDENTITY_CONFIRMED` | 7 | Autor corresponde a Leandro ou Eduardo, cuja identidade GSH está documentada na pesquisa anterior. |
| `GSH_INSTITUTION_EVIDENCED` | 14 | Título ou detalhe oficial salvo contém GSH/unidade do grupo; prova relação do trabalho, não emprego de cada autor. |
| `GSH_TITLE_EVIDENCED_AUTHORSHIP_UNVERIFIED` | 6 | Título oficial menciona GSH, mas o detalhe/afiliação individual não foi capturado. |
| `LEAD_NEEDS_EVIDENCE` | 5 | Pista nominal/institucional útil para revisão futura, sem promoção ao filtro. |
| `FALSE_POSITIVE` | 1 | Homônimo ou incompatibilidade de identidade explicitamente excluída. |

## Validação e limites

- `node --check scripts/build-b3-gsh2-review.mjs`: PASS.
- `node scripts/build-b3-gsh2-review.mjs`: PASS; reconstrói os dois JSONs compactos e reconcilia a fonte, o APP1 e os 1.987 IDs.
- `node --test tests/hemo-b3-gsh2.test.mjs`: PASS.
- A fonte primária foi confirmada pelo SHA-256 `c14f63621b8ae2b38fc88ad12c851c2e708c3000776c32796893caa414b1a2bd`.
- A prova corporativa anterior de Leandro/Eduardo e a publicação institucional usada para os leads não foram reconsultadas nesta missão; o arquivo registra essa condição como `pre-existing_record_not_refetched`.
- O número agregado de 117 trabalhos não foi usado como conjunto de IDs nem como denominador de completude.
- `public/works-catalog.json`, `public/*`, Vercel, `main`, CONAHP e a branch B3-FINAL1 não foram alterados.

Integração, mudança do filtro público, regressão do catálogo e smoke devem ocorrer apenas em missão futura autorizada pelo orquestrador.
