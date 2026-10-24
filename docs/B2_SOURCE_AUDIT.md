# HEMO B2-W1 - Auditoria de fontes oficiais e cobertura parcial (24/10/2026)

## Estado da cobertura

**`PARTIAL_NOT_PUBLISHABLE`. A soma dos candidatos não representa o total oficial do congresso.** Leitura direta das páginas da organização respondeu HTTP 403 neste ambiente; os registros foram recuperados de excertos indexados das próprias páginas oficiais e de agendas individuais de participantes. A indexação é fragmentária e NÃO comprova a extensão total das tabelas nem associação de todas as colunas.

| Dia | B2 inicial sessões | B2-W1 sessões candidatas | B2 inicial falas | B2-W1 falas filhas | Salas pendentes W1 |
|---|---:|---:|---:|---:|---:|
| 28/10 | 12 | 33 | 2 | 11 | 14 |
| 29/10 | 15 | 34 | 8 | 12 | 20 |
| 30/10 | 12 | 34 | 5 | 11 | 19 |
| 31/10 | 10 | 20 | 2 | 8 | 13 |
| **Total** | **49** | **121** | **17** | **42** | **66** |

Além das 66 sessões sem sala, **67 de 116 associações de participantes a sessões** ainda mantêm papel não verificado; 44 sessões não possuem participante vinculado. Esses campos não foram inferidos.

### Tipos de sessões presentes (amostra parcial)
- `cientifica` 70; `educacional` 19; `treinamento` 5; `cafe_corporativo` 8; `simposio_corporativo` 8; `meet_the_expert` 1.
- `plenaria` 1; `abertura` 1; `atividade_pratica` 3; `homenagem` 2; `trabalhos_orais` 1; `forum_restrito` 1; `conferencia` 1.
- Trabalhos/expositores individuais **não foram importados**; `works=[]` e `exhibitors=[]`.

### 28 de outubro, lacuna da primeira execução atendida parcialmente
A versão anterior encerrava a quarta-feira às 11h45. Os excertos oficiais recuperados agora incluem simpósios às 12h15, 13h45 e 15h15, módulos de treinamento de acreditação AABB/ABHH até as 18h00, plenária de trabalhos premiados 16h30–18h00, atividades corporativas e **Solenidade de Abertura e Homenagens 18h15–19h30 no Auditório Master**. Existem outras lacunas de cobertura ainda não quantificáveis.

### Proveniência e fonte não validada
1. **Grade oficial por dia e sala:** https://hemo.org.br/evento/hemo2026/pt/programacao/gradeatividades/todas . Forneceu títulos/dias/horários e concorrência em trechos indexados; sua apresentação achatada NÃO autoriza inferir o nome da sala pela posição das colunas.
2. **Lista detalhada oficial:** https://hemo.org.br/evento/hemo2026/pt/programacao/lista . Trechos de horários de sessão, palestras filhas, nomes/papéis; sem obtenção integral do HTML.
3. **Grade alternativa:** https://www.hemo.org.br/evento/hemo2026/pt/programacao/gradeatividades . Confirmada como rota alternativa; não se obteve DOM integral capaz de provar cobertura.
4. **Agendas por participante:** por exemplo, https://hemo.org.br/evento/hemo2026/programacao/agenda/13541 e https://hemo.org.br/evento/hemo2026/programacao/agenda/13520 . Os trechos reúnem data, hora, função e sala no mesmo registro; serviram à reconciliação de locais/papéis/falas específicos.
5. **Landing do PDF científico:** https://www.hemo.org.br/site/hemo2026/programacao-cientifica-pdf . **Não houve download nem identificação do arquivo PDF 2026 no iframe.** A indexação inclui referência também a PDF de traslado, razão para não tratar qualquer PDF associado como programação científica válida.
6. **Planilha privada de apoio**, somente contexto de curadoria: Google Sheets HEMO "Curadoria e fontes - Flora"; inclui candidatos sem dia/ID originalmente. O código público não carrega conteúdo privado da planilha.

Cada sessão mantém ID `h26-*`, `sourceUrl`, `verifiedAt`, `evidence.status`, `evidence.checkedAt` e `missingFields`; falas têm `parentSessionId` e nunca viram cartões independentes na grade. `sourceUrl/verifiedAt` descrevem o acesso ao **índice parcial**, não uma conferência integral de cada página HTML ou ID original do sistema de inscrições.

### Amostras conferidas em recortes oficiais
- **28/10 09h00:** Imuno-hematologia (reconciliação individual Sala 201AB); **28/10 09h30:** acreditação AABB/ABHH Parte I, Sala 202C, inscrição diferenciada.
- **28/10 16h30:** Plenária de trabalhos científicos premiados, Auditório Anexo; **28/10 18h15–19h30:** Solenidade de Abertura, Auditório Master.
- **29/10 08h45:** Automação para redução de erros laboratoriais, Sala 202 AB; **29/10 14h00:** Gestão da Qualidade, Riscos e Legislação, Sala 202 AB; **29/10 15h45:** Qualidade, Auditoria e Segurança do Paciente, Sala 202 AB.
- **30/10 14h00:** Gestão estratégica da captação, Sala 210; **31/10 09h00:** Hemovigilância e segurança transfusional (Sala 201AB em lista indexada), com três subfalas.
- **31/10 09h00–10h40:** Fórum SINASAN, explicitamente atividade fechada; não presumir acesso livre.

### Curadoria e conflitos
- 28 alta, 9 média, 84 baixa, **propostas** baseadas no título/trilha, justificativa por sessão e confiança média/baixa. Não foram preenchidos `interest`, `attending` nem anotações pessoais. Consultar `docs/B2_FLORA_CURATION.md`.
- Seis grupos de simultaneidade entre sessões recomendadas; consultar `data/b2-flora-conflicts.json`. Eles **não correspondem a conflitos das escolhas de Flora**.
- 49 IDs de sessões e 17 IDs de falas originais preservados, congelados em `tests/fixtures/b2-baseline-ids.json`.

### Planilha de curadoria Google Sheets
Atualizada **no mesmo arquivo**, sem apagar abas: `Sessoes!A1:O122` com 121 candidatos e classificação; `Palestras B2!A1:L43` com 42 falas vinculadas; `Conflitos Flora!A1:L7` com seis grupos de simultaneidade entre sugestões; `Destaques` sete referências reconciliadas (um destaque ABHH/PBM corporativo permanece sem ID/data), `Fontes!A8:E12` e `Backlog!A10:E11` atualizados. Campo Validação exibe explicitamente `CANDIDATO - PARCIAL`. Checagem de leitura de células realizada; inspeção visual nativa indisponível.

### Bloqueios reais (não ocultar)
1. **Completude de fonte:** nenhum HTML/MHTML/DOM de lista e grade completos, nem PDF 2026 identificado e auditado. **Desconhecemos a cardinalidade oficial total por dia/sala e quantas sessões/falas ainda faltam.**
2. **Metadados:** 66 salas sem confirmação; 67 relações de participantes a sessões sem papel confirmado; 44 sessões sem participantes; regras de inscrição de alguns simpósios/treinamentos ainda pendentes; alguns resumos/trilhas a detalhar.
3. **Testes nativos/UX:** workspace Windows não montado; acesso GitHub via git neste Linux bloqueado por DNS, sem execução de Node/HTTP/Chromium/PWA. Testes lógicos de JS são úteis, mas não homologação funcional B1/B2.
4. **Publicação:** `public/schedule.json` continua `pending_b2` com arrays vazios. Não converter amostra em `verified` até fonte completa e QA.
5. **Próximo desbloqueio mínimo:** obter pelo acesso normal autorizado **exportação completa do DOM/HTML/MHTML da grade e da lista dos quatro dias**, ou **PDF identificado inequivocamente como grade científica oficial HEMO 2026**, salvando os arquivos como fontes brutas privadas, sem comitar HTML protegido e sem extrair dados por posição de coluna. Depois conciliar os IDs/horários/locais, testar, atualizar `schedule.json` e auditar. Não é necessário Codex especificamente para isso se arquivo puder ser acessado pelos conectores.

**Marcador:** `HEMO_B2_WEB_PARTIAL_WITH_EXACT_RESIDUAL`. Nenhum PR, merge, deploy ou alteração do CONAHP.
