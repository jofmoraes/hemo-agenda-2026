# HEMO B3-WORKS1 — Pesquisa de trabalhos GSH

## Resultado executivo

Esta rodada produziu um inventário auditável, mas não identificou trabalhos individuais confirmados. A lista oficial de trabalhos aprovados do HEMO 2026 retornou HTTP 403 no navegador Windows, com uma verificação de segurança. A pesquisa foi encerrada nesse ponto, sem CAPTCHA, bypass, cookies artificiais ou endpoints alternativos.

Status do inventário: `BLOCKED_EXTERNAL`.

O arquivo [b3-works-gsh-research.json](../data/b3-works-gsh-research.json) separa `confirmedWorks` e `candidateWorks` (ambos vazios), a referência institucional agregada de 117 trabalhos e pistas nominais ainda pendentes. A referência de 117 não é uma lista individual e não deve alimentar `works[]` nem o filtro público.

## Critério único

O conceito futuro é somente `Trabalhos GSH`. Leandro e Eduardo são pistas alternativas para localizar autoria, e não filtros separados nem condições simultâneas. A confirmação de cada registro exigirá ID oficial, título, autores/instituições e evidência explícita de associação ao Grupo GSH ou a unidade comprovadamente integrante.

## Fontes consultadas

- [Lista oficial de trabalhos aprovados](https://www.hemo.org.br/evento/hemo2026/pt/trabalhosaprovados) — fonte prioritária; bloqueada por HTTP 403 no acesso normal.
- [Página oficial de trabalhos do HEMO](https://hemo.org.br/site/hemo2026/trabalhos) — contexto do processo e publicação posterior dos resumos.
- [Orientações oficiais de apresentação](https://www.hemo.org.br/site/hemo2026/orientacoes-para-apresentacao-dos-trabalhos) — modalidades e campos operacionais esperados.
- [Divulgação pública do Grupo GSH](https://br.linkedin.com/company/grupogsh) — referência agregada de 117 aprovados e pistas nominais, sem IDs individuais.
- [Governança corporativa GSH](https://ri.gshcorp.com.br/governanca-corporativa/conselho-comite-e-diretoria/) — vínculo institucional de Leandro e Eduardo.

Consultas públicas em Bing por GSH, Leandro e Eduardo não localizaram registros individuais oficiais do HEMO 2026. A pesquisa por índice não substitui a lista oficial.

## Campos da próxima reconciliação

Quando uma exportação autorizada estiver disponível, cada trabalho deverá registrar ID, título, autores e instituições, modalidade, área, dia, horário, local, painel, evidência GSH, URL original, data da consulta e confiança. Registros sem ID oficial permanecerão candidatos pendentes e não serão publicados.

## Proposta de produto

Adicionar futuramente uma aba `Trabalhos científicos`, com pesquisa geral por ID, título, autor, instituição e área. A aba terá um único filtro específico, com o rótulo exato `Trabalhos GSH`. O filtro deverá operar somente sobre trabalhos individuais confirmados; a referência agregada de 117 e candidatos pendentes ficarão fora da experiência pública até a reconciliação.

Nenhum arquivo público da agenda foi alterado nesta rodada. `public/schedule.json` continua `pending_b2`, com zero sessões e sem trabalhos publicados.

## Limitações e próximo passo seguro

O bloqueio externo impede confirmar a lista, os IDs, os autores, as instituições e a distribuição por modalidade. O próximo passo seguro é obter do organizador ou do usuário uma exportação legitimamente acessível em HTML, MHTML, PDF ou outro formato autorizado. Não se deve contornar a verificação de segurança nem transformar a divulgação agregada em dados individuais.
