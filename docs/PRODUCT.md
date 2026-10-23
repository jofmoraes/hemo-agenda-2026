# Produto HEMO Agenda 2026 - Flora

## Identidade do evento
- Congresso Brasileiro de Hematologia, Hemoterapia e Terapia Celular, ABHH.
- 28 a 31 de outubro de 2026, Riocentro (Pavilhão 3 e Centro de Convenções), Rio de Janeiro.
- Fonte oficial: https://hemo.org.br/site/hemo2026/sobre-o-evento
- Agenda: https://hemo.org.br/evento/hemo2026/pt/programacao/lista

## Objetivo
Disponibilizar rapidamente um PWA independente que organize a agenda científica de Flora com busca, filtros, visualização por horário, detecção de conflitos, seleção pessoal e curadoria explicável.

## P0 - Núcleo funcional
1. Interface móvel inspirada na B18 Flora do CONAHP, rebrand completo HEMO; dias 28, 29, 30 e 31/10/2026, sem fixações do CONAHP.
2. Programação pública HEMO normalizada por evento/sessão, palestras subordinadas, pessoas, categorias, início/fim e local; IDs estáveis, proveniência e data da fonte.
3. Grade cronológica simultânea + lista; busca por tema/título/pessoa/local, filtros dia, eixo, modalidade, horário e interesse, além de estados pessoais.
4. Minha agenda, anotação/perguntas, interesse e intenção de assistir separados de recomendações automáticas; conflitos apenas para sessões efetivamente selecionadas ou sob comparação explícita.
5. Preferências Flora com armazenamento local HEMO exclusivo, indicação de status de salvamento e backup exportação/importação. Não alegar sincronização entre aparelhos.
6. PWA instalável e offline apenas para programação pública carregada, com ícones, manifesto e service worker específicos do HEMO.
7. Estado de loading correto no primeiro paint, navegação mobile funcional, acessibilidade, compatibilidade com horários locais e dias.

## P1 - Ampliação recomendada
- Aba Trabalhos científicos: orais/painéis, ID original, título, autores, modalidade, área, data/local e curadoria, quando fontes forem verificadas.
- Aba Expositores: empresas, estandes, tema e registro pessoal de visita; nunca inventar números de estande.
- Tratar treinamentos/atividades com inscrição separada, sessões corporativas e eventos especiais com distinção explícita.
- Atualizações de agenda sem sobrescrever preferências associadas a IDs estáveis.
- Persistência multiaparelho e login somente após decisão e gates específicos, sempre em infraestrutura HEMO isolada.

## Curadoria Flora
Sinalizar e justificar aderência a hemoterapia, PBM, segurança transfusional, gestão hospitalar, custos, processos, qualidade, auditoria, gestão de riscos, regulação, dados/indicadores, IA e tecnologia aplicada. Não usar interesses inferidos como seleção confirmada por Flora. Separar relevância da qualidade da evidência.

## Critérios mínimos de aceite
- Dados exclusivamente HEMO, quatro dias completos e datas corretas; conferir contagem de sessões e amostra por dia contra a fonte.
- Grid com simultâneas reais, timezone America/Sao_Paulo, filtros/estados sem regressão funcional.
- Preferências HEMO persistem após reload local e são isoladas de qualquer chave CONAHP; importação/backup é segura.
- Logo, títulos, manifesto, service worker e telas de abertura HEMO; nenhum asset/conteúdo CONAHP residualmente visível.
- Testes automatizados + smoke mobile; nenhuma publicação ou conexão externa sem autorização.

## Recursos de curadoria
- Planilha privada: https://docs.google.com/spreadsheets/d/1arUmWu99S8FsqfVyIxgiJ4xyZHlJrq9G8fQ6U1_ISPU/edit
- Observação: aba Destaques contém candidatos, com dia/ID ainda a reconciliar. Não tratá-los como agenda validada.
