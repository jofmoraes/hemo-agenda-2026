# HEMO B3-FINAL1 — Release público controlado

Este documento registra o gate local e o plano de publicação da Issue #4. A versão continua explicitamente parcial; `schedule.json` permanece `pending_b2` e a programação completa não é declarada.

## Base e isolamento

- Branch: `feat/hemo-b3-final1-release`.
- Base APP1: `3df073a088188a04bf3f8e201c24c94f3d5a96e9`.
- Inventário WORKS4: `8d6e24d6be9957ac47e03fdb2c4d2029c56e41c7`.
- Projeto público autorizado: `hemo-flora-2026`, ID `prj_3oTPmcroB9IeJZ4FAxSoyW8yEmsC`.
- QA protegido `hemo-preview-qa-2026` não faz parte desta release.

## Hardening aplicado

- Abas mobile mantêm os três rótulos completos em scroller interno, com dica acessível e sem overflow da página.
- O link público que abria o modo normal vazio foi removido; o retorno ocorre pela aba `Programação`, mantendo o aviso de prévia parcial.
- O catálogo de aproximadamente 1,8 MB sai do shell precacheado e é buscado/armazenado sob demanda. Sem rede e sem cache, a resposta é `503 text/plain`, nunca HTML em lugar de JavaScript/CSS/dados.
- O relatório de catálogo inclui a proveniência do relatório WORKS4 sem publicar o JSON bruto, HTML integral, resumos ou depuração.
- Backup legado sem `works` continua importável; trabalhos usam namespace próprio, merge preservador e aviso quando o armazenamento local não está disponível.

## Gate local

- 1.987 IDs únicos; 27 trabalhos GSH.
- 30 itens por página, última página 67/67 com 7 itens.
- 3855 permanece `Horário a confirmar`; 3566 não é associado a Eduardo Ferro de Carvalho.
- Normal `/`: `pending_b2`, 0 sessões. Prévia `/?preview=1`: 121 sessões, 42 falas e 66 salas a confirmar.
- `npm test`: 58/58 PASS.
- `npm run check`: PASS.
- `npm run check:preview`: PASS; 121 sessões e 42 falas.
- Chromium local: 360, 390, 430 e 1280 px; busca, GSH, paginação, persistência após reload, raiz normal, prévia e console sem erros.
- Capturas: [`docs/evidence/hemo-b3-final1/`](evidence/hemo-b3-final1/).

## Publicação autorizada

Executar no máximo um deployment no projeto público existente, sem domínio novo, Git autodeploy, alteração de QA ou upgrade. Após o deployment, fazer readback de ID/target/SHA, confirmar o alias `https://hemo-flora-2026.vercel.app`, e realizar smoke HTTPS anônimo sem expor credenciais. Se um gate crítico falhar, não insistir: rollback somente no próprio projeto quando indispensável e classificar `HEMO_B3_FINAL1_SAFE_ABORT`.
