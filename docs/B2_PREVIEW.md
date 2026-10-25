# HEMO B2-W2 - Prévia funcional parcial (sem publicação)

## Finalidade e ativação explícita

Esta prévia serve para **revisar os 121 registros candidatos disponíveis**, não para declarar a programação oficial completa do HEMO 2026. Não existe URL pública de deploy desta entrega. O código e os dados estão somente na branch `feat/hemo-b2-programa`.

No checkout **isolado** da branch:

```sh
# Terminal no diretório raiz do repositório HEMO
npm run check:preview
npm test
npm run check
python3 -m http.server 8000 --directory public
```

Acessar **http://localhost:8000/?preview=1** para carregar `public/preview-schedule.json`; acessar **http://localhost:8000/** para voltar ao contrato de produção `public/schedule.json`, que segue `pending_b2` sem sessões. Apenas `preview=1` habilita a prévia; nenhum modo de prévia é ativado automaticamente nem por preferências do navegador. Em Windows, usar `python -m http.server 8000 --directory public` se Python estiver instalado.

**Nunca abrir o frontend com `file://`**: o browser precisa de HTTP(S) e uma origem de armazenamento consistente. Nenhum desses comandos realiza deploy. Antes de sincronizar branch em worktree com arquivos locais, verificar estado `git status` e não sobrescrever mudanças do usuário.

## Contratos separados

| Recurso | Status | Registros | Observação |
|---|---|---|---|
| `public/schedule.json` | `pending_b2` | 0 sessões | Produção B1 inalterada, sem divulgação parcial |
| `public/preview-schedule.json` | `partial_preview` | 121 sessões / 42 palestras filhas | Snapshot revisável, cobertura **não comprovada** |
| `data/b2-indexed-candidates.json` | `PARTIAL_NOT_PUBLISHABLE` | 121 / 42 | Inventário canônico mantido, com IDs imutáveis |
| Eventual `verified` | Ainda **não existe** | Não aplicável | Requer cobertura integral e auditoria independente |

`public/schedule-mode.js` confere `kind`, status, quatro dias, fuso, contagens, datas, referências, falas filhas, IDs duplicados, estrutura de curadoria, ausência de preferência privada, e **rejeita prévia enviada como produção** ou produção pedida como prévia. `verified` jamais aceita `coverage.completenessVerified=false` nem `sourceInventory.status=PARTIAL_NOT_PUBLISHABLE`.

A rota `/?preview=1` é mecanismo de revisão **local**, não serviço de autenticação ou restrição de acesso. A presença do arquivo de prévia em uma futura hospedagem tornaria os dados acessíveis a quem souber o caminho, embora o modo padrão não os apresente. **Não publicar o branch sem gate específico.**

## UX e limitações visíveis

A interface exibe permanentemente, enquanto houver rolagem, o aviso **"Programação parcial em conferência"** com **121 sessões candidatas, 42 falas identificadas e 66 salas a confirmar**, além da declaração de que a quantidade total do congresso é desconhecida. O aviso não é uma notificação temporária, nem desaparece ao filtrar ou entrar em Minha Agenda.

- Dia, horários, grid de simultâneas, lista, busca (também nas falas filhas), filtros, detalhes, interesse pessoal, Minha Agenda, anotações e backup permanecem no frontend HEMO.
- Sala não identificada aparece como **"A confirmar"** em lista, grade e detalhes. Papéis não verificados são rotulados **"A confirmar"**. Descrição ausente e inscrição/acesso não comprovado têm sinalização própria.
- **42 palestras filhas** estão dentro dos detalhes das sessões pai, **sem criar 42 eventos duplicados** na grade.
- Recomendações automáticas por sessão são apresentadas com o título **"Sugestão Flora"** e confiança, sem marcar interesse, prioridade escolhida, presença ou comentários. 12 justificativas específicas baseadas em títulos de sessão e falas foram refinadas em `data/b2-preview-curation-overrides.json`; outras mantêm a heurística com confiança restrita.
- Preferências permanecem exclusivamente neste navegador, sob `hemo2026:flora:preferences:v1`, com backup `HEMO_2026_FLORA_BACKUP`. As escolhas feitas sobre IDs candidatos podem persistir em nova carga desses mesmos IDs; **não são curadoria automática**.
- A prévia abre em **Lista** no primeiro acesso mobile; uma escolha explícita entre **Lista** e **Agenda** é preservada. Na Agenda mobile, simultaneidades usam rolagem horizontal interna com largura mínima calculada por densidade, sem overflow horizontal da página e sem ocultar sessões.

### UX1 - filtros Flora e legibilidade mobile

- O filtro principal **Sugestão Flora** usa somente `recommendation.level`: **Todas**, **Recomendadas** (Alta + Média), **Alta**, **Média** e **Baixa**. Na ausência de escolha salva, a prévia inicia em **Recomendadas**; a seleção válida persiste na UI.
- O filtro **Meu interesse** continua lendo somente as decisões pessoais locais. **Minha prioridade** permanece avançada e preserva `Essencial`, `Alta`, `Média` e `Baixa`; nenhum filtro Flora grava interesse, prioridade ou presença.
- Estado antigo com `priority` é migrado sem convertê-lo em recomendação. A chave de preferências e o backup `HEMO_2026_FLORA_BACKUP` permanecem inalterados.
- A contagem mostra o dia selecionado e o total do período filtrado: a prévia contém 10/1/22, 5/5/24, 8/2/24 e 5/1/14 por nível nos dias 28–31; **Recomendadas** totaliza 37 e o dia 31 totaliza 6.
- O estado sem resultados informa os filtros ativos e oferece ações diretas para ampliar a Sugestão Flora ou limpar filtros.

## Reprodutibilidade e cache

```sh
npm run build:preview   # gera somente public/preview-schedule.json
npm run check:preview   # compara byte a byte com staging + overrides, sem escrever
npm run test:b2         # suítes de B2 e B2-W2
npm run check           # sintaxe, snapshot e suítes completas
```

`scripts/build-preview.mjs` lê o inventário e os overrides HEMO e **só escreve o snapshot da prévia**. Nenhum comando de build modifica `public/schedule.json`.

O PWA usa cache exclusivo `hemo2026:public:b2w2-v1`. O arquivo de prévia **não é pré-cacheado por padrão**, mas a leitura explícita pode criar cache público de `preview-schedule.json` após o service worker controlar a página. Cache offline e instalação não foram homologados em navegador nesta execução. `schedule-mode.js` integra os assets de shell; nenhum cache CONAHP é apagado.

## Proveniência, pendências e QA

- Por dia, sessões candidatas: **28/10=33, 29/10=34, 30/10=34, 31/10=20**. Falas: **11, 12, 11, 8**. **66 salas a confirmar** (14,20,19,13), 44 sessões sem participantes vinculados, relações de papéis ainda incertas, 0 descrições completas. Quantidade real de sessões/falas do HEMO permanece **desconhecida**.
- Fontes e limitações do índice público: `docs/B2_SOURCE_AUDIT.md`; curadoria: `docs/B2_FLORA_CURATION.md`.
- Testes: `tests/hemo-b2-preview.test.mjs` cobre status, ativação, IDs originais, filiação, locais desconhecidos, recomendações, contrato de produção, SW e reprodutibilidade; `tests/hemo-b2-preview-ui.test.mjs` e `tests/hemo-b2-ux1.test.mjs` cobrem DOM simulado, separação de filtros, totais, migração, persistência, Lista/Agenda e contratos HEMO. **DOM simulado não é teste de navegador real.** A suíte do B1 segue independente.
- **PASS UX1:** `npm test` e `npm run check` nativos via Node, 36/36 testes; `npm run check:preview` reproduz 121 sessões e 42 falas. Smoke Chromium local PASS em 390x844 e 1280x900: prévia opt-in, Lista mobile, filtro Recomendadas/37, dia 31/6, persistência após recarga, abertura de detalhes, grade com rolagem interna (811px em viewport de 359px) e sem overflow horizontal da página. **PWA offline/instalação e autenticação de deploy não foram re-homologados nesta rodada.**

**Entrega para auditoria de código e dados; não é aceite funcional nem autorização de deploy.**
