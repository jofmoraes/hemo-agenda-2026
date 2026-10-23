# Arquitetura e isolamento - HEMO 2026

## Bases verificadas
- Fonte técnica B18 CONAHP `jofmoraes/conahp-agenda-2026`, branch `feat/b18-flora-ux`, somente leitura. A B18 inclui PWA estático com `public/index.html`, `b18.css`, `b18.js`, `schedule-utils.js`, `schedule.json`, `manifest.webmanifest`, `service-worker.js` e ícones.
- `feat/m1-foundation` contém outros contratos de Worker/API/Apps Script, mas não deve ser copiada automaticamente; integração de auth/persistência Google é missão posterior com revisão de segurança.
- O bootstrap HEMO B0 não importou código e iniciou `main` isolada.

## Modelo de implementação
1. Clonar/inspecionar somente leitura o CONAHP em diretório **distinto** da pasta HEMO. Importar seletivamente os componentes B18 a uma branch HEMO dedicada; preservar provenance de arquivos e documentar alterações.
2. Alterar todos os hardcodes de nome/data/local, keys, IDs, cache names, manifest e assets. `HEMO` deve ter namespace próprio de storage, cache e configuração.
3. Estruturar datasets HEMO, sem dados do CONAHP:
   - `sessions[]`: `id,day,start,end,title,type,track,stage,description,participants,sourceUrl,verifiedAt` (+ campos comprovados).
   - `talks[]`: subeventos por `parentSessionId`, com horário e palestrantes quando fonte específica; não duplicar sessões na grade.
   - `works[]`: trabalhos com ID oficial, autores, área, modalidade, apresentação, fonte.
   - `exhibitors[]`: empresas/estandes verificados e fonte.
4. Calendário com 4 dias oficiais, validação e layout de colisões; textos de fuso Rio (America/Sao_Paulo).
5. Curadoria sugerida separada de preferência explícita: `recommendation` e `preference` com semânticas distintas.
6. Preferências iniciais exclusivamente locais, com chave HEMO, backup HEMO e aviso claro sobre ausência de sincronização. Backend/login futuro demanda isolamento servidor e autorização por operação.
7. Testes automáticos de schema, dados, conflitos, filtros, persistência local e interface. Não criar CI, deploy, domínio, OAuth ou serviço externo na B1.

## Publicação e integração
- Repositório GitHub: https://github.com/jofmoraes/hemo-agenda-2026
- Workspace Windows: `D:\JUCA\AI Lab\hemo-2026\hemo-2026-app`
- Drive de pesquisa: `AI Lab/hemo-2026`. **Não copiar .git para artifacts públicos nem armazenar segredos no Drive.**
- Branch de implementação própria e commits diretos, sem PR. Antes de qualquer push, verificar triggers automáticos. Antes de deployment, gate expresso e smoke/rollback.
- Nenhuma alteração de `jofmoraes/conahp-agenda-2026`.
