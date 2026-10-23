# Estado operacional - HEMO Agenda 2026

Atualizado: 2026-10-23, após auditoria B0 por GPT Web.

## B0 - ACCEPTED (bootstrap)
- Repositório público: `jofmoraes/hemo-agenda-2026`, branch principal `main`, conta `jofmoraes`.
- Commit inicial: `e3bd3d260c6b3c0a45dd32b5506b5ed146f939f0`.
- Handoff B0: `6eb63edfad50ae3a36e0f89e80a6634fa882c717` (`docs/handovers/CURRENT_CODEX_STATUS.md`).
- Árvore remota inicialmente apenas `README.md` e `docs/`, sem imports do CONAHP. Nenhum `.github/workflows` no repositório (404 da API Contents); Codex reportou workflows 0 e deployments 0. Não concluir por isso que integrações futuras não terão gatilhos.
- Pasta local informada pelo executor: `D:\JUCA\AI Lab\hemo-2026\hemo-2026-app`; arquivo `.git` e README confirmados por listagem de Drive sincronizado.
- B0 aprovado apenas quanto à inicialização. Nenhum aplicativo HEMO está funcional ou publicado nesta fase.

## Próximo portfólio
- B1: port do frontend B18 Flora para HEMO, quatro dias, estrutura/schemas separados, PWA local e teste; **execução Codex depende de autorização expressa**.
- B2: ingestão e auditoria da programação oficial/curadoria Flora em arquivo independente com IDs estáveis. Data e ID de candidatos da planilha devem ser reconciliados.
- B3: Trabalhos Científicos e Expositores se fontes sustentarem; não atrasar agenda P0.
- B4: integração, login e persistência multiaparelho HEMO, apenas se aprovada; evitar reutilizar clientes OAuth/segredos CONAHP.
- B5: publicação controlada após gate, com smoke remoto e plano de rollback.

## Fontes
- https://hemo.org.br/site/hemo2026/sobre-o-evento
- https://hemo.org.br/evento/hemo2026/pt/programacao/lista
- https://hemo.org.br/site/hemo2026/informacoes-gerais
- https://docs.google.com/spreadsheets/d/1arUmWu99S8FsqfVyIxgiJ4xyZHlJrq9G8fQ6U1_ISPU/edit

## Controles
NO_PR; NO_AUTO_CODE_REVIEW; NO_CODEX_WITHOUT_APPROVAL; NO_DEPLOY_WITHOUT_APPROVAL; CONAHP_READ_ONLY. Status HEMO B1/B2: PLANNED, não executados.
