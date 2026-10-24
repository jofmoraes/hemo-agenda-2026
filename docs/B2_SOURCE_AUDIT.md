# HEMO B2 - Inventário de evidências parciais (23/10/2026)

## Bloqueio de cobertura total
As URLs oficiais de [lista detalhada](https://www.hemo.org.br/evento/hemo2026/pt/programacao/lista) e [grade por sala](https://hemo.org.br/evento/hemo2026/pt/programacao/gradeatividades/todas) retornaram **HTTP 403** nas tentativas de leitura direta. O mecanismo de pesquisa retornou excertos indexados das próprias páginas oficiais (28 a 31/10), mas **não todo o HTML estruturado**. Nenhuma autenticação, CAPTCHA ou proteção foi contornada. Não há forma íntegra de comprovar o universo de sessões/salas/participantes a partir desses fragmentos.

## Entregue na B2 - apenas staging
- `data/b2-indexed-candidates.json`: **49 sessões candidatas com dia/horário/título e trilha extraídos de trechos oficiais indexados**, sendo **12 em 28/10, 15 em 29/10, 12 em 30/10 e 10 em 31/10**. **17 falas subordinadas** associadas a parentSessionId, sem duplicação na grade.
- Salas: **7 preenchidas por referência adicional visível na lista detalhada ou documentação prévia**, **42 vazias e marcadas como lacunas** (campo `evidence.missingFields`). No processo de auditoria, rever também as 7 salas já indicadas antes de tornar o arquivo público.
- Integridade: IDs determinísticos HEMO `h26-dia-hora-slug`, datas e fuso `America/Sao_Paulo`, URL e timestamp por registro, recomendação Flora separada de `attending`/`interest`, descrições não inferidas. Os nomes de participantes presentes nos fragmentos estão armazenados como indicações com papel ainda sujeito a confirmação individual.
- Tipos diferenciados: `educacional`, `cientifica`, `treinamento`, `cafe_corporativo`, `atividade_pratica` e `forum_restrito`. Regras de acesso/inscrição não confirmadas continuam pendentes; fórum explicitamente fechado recebe aviso.
- `public/schedule.json` continua com `pending_b2` e 0 itens. **Não apresentar 49 candidatos como programação completa/publicável**, nem usar contagem parcial como total do congresso.

## Exemplos de rastreabilidade
| Dia | Horário | Título | Situação |
|---|---|---|---|
| 28/10 | 09:00-10:15 | Revisão de Linfoma Folicular | Grade e detalhes indexados; Auditório Master |
| 29/10 | 08:45-10:15 | Automação como estratégia para redução de erros laboratoriais | Fonte indexada e destaque da planilha; Sala 202 AB |
| 29/10 | 14:00-15:30 | Gestão da Qualidade, Riscos e Legislação | Grade e lista indexadas; Sala 202 AB; 3 falas confirmadas |
| 29/10 | 15:45-17:15 | Qualidade, Auditoria e Segurança do Paciente | Grade e lista indexadas; Sala 202 AB; 4 falas confirmadas |
| 30/10 | 14:00-15:30 | Gestão estratégica da captação | Grade e lista indexadas; Sala 210; 2 falas confirmadas |
| 31/10 | 09:00-10:30 | Hemovigilância e segurança transfusional | Grade indexada; sala pendente |
| 31/10 | 09:00-10:40 | Fórum SINASAN (Atividade fechada) | Restrição explícita; sala e inscrição pendentes |

## Pendências bloqueantes para declarar B2 integral
1. Extração autorizada e completa da grade e da lista, por HTTP/navegador regular quando acessível, inclusive blocos posteriores omitidos da indexação; reconciliar cada item e subpalestra, participantes, regras de inscrição e as **42 salas faltantes**.
2. Comprovar cardinalidade total por dia, por tipo e por sala; conferir IDs de origem, múltiplas versões e horários que variam entre fontes; checar fontes de eventos corporativos, científicos, intervalos, trabalhos e expositores.
3. Rodar `npm test`, `npm run check`, `npm run test:b2` nativos e QA HTTP/mobile. O workspace Windows não está montado neste runtime, e clone via GitHub falha por DNS. B1 foi aceito apenas estaticamente.
4. Após auditoria de completude e licenças, gerar dataset publicado `public/schedule.json` com status `verified` e provas de contagem; não modificar preferências locais nem integrar main sem gate.

**Estado:** `HEMO_B2_PARTIAL_SOURCE_BLOCKED`, ainda não `HEMO_B2_READY_FOR_AUDIT`. Nenhum PR, deploy, merge ou alteração no CONAHP.
