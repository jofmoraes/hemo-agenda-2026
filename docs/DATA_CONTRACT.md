# Contrato de programação para HEMO B2

O dataset público `public/schedule.json` contém `kind:HEMO_2026_PROGRAM`, `status:pending_b2|verified`, `timezone:America/Sao_Paulo`, `days:[2026-10-28,2026-10-29,2026-10-30,2026-10-31]`, `checkedAt` ISO-8601 e arrays `sessions`, `talks`, `works`, `exhibitors`.

Durante B1, `pending_b2` e todas as coleções vazias. Somente B2 pode preencher sessões com fontes auditadas e mudar o status para `verified`.

**Sessões:** `id` estável prefixado `h26-`, `day` YYYY-MM-DD, `start` e `end` HH:MM no fuso do Rio, `title`, `type` (modalidade), `track` (trilha), `stage` (sala), `description`, `participants` (objetos `name`, `role`, `institution`), `sourceUrl` HTTPS e `verifiedAt` ISO-8601. `start < end` no mesmo dia; se atravessar meia-noite, dividir e validar com critério explícito. Evitar dados e locais inferidos. `type=service` somente para atividades logísticas comprovadas.

**Subeventos:** `talks` com `parentSessionId`, id, título, horário e participantes, sem duplicar a sessão na grade. `works` com ID oficial, autores, modalidade, área e fonte. `exhibitors` com estande apenas se confirmado, data/fonte.

Recomendações automáticas devem ser separadas de preferências realmente registradas por Flora. O armazenamento inicial é exclusivamente local: `hemo2026:flora:preferences:v1` e `hemo2026:flora:ui:v1`, backup `HEMO_2026_FLORA_BACKUP` v1. Nada de Sheets/OAuth/persistência externa na B1. 
