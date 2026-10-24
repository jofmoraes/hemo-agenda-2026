# HEMO Agenda 2026

PWA independente para revisar e organizar sessões do HEMO 2026 (28-31/10, Riocentro), baseado na interface B18 Flora como referência técnica somente leitura.

## Modo normal e prévia parcial B2-W2

O **modo normal** usa `public/schedule.json`, ainda em `pending_b2`, sem programação completa confirmada. A **prévia opt-in** utiliza outro arquivo, `public/preview-schedule.json`, com **121 sessões candidatas, 42 falas subordinadas e 66 salas sem confirmação**. Esses registros **não são o total oficial do congresso**. Não confundir `partial_preview` com produção `verified`.

```sh
# Diretório raiz deste repositório; não altera nem publica serviços
npm run check:preview
npm test
npm run check
python3 -m http.server 8000 --directory public
```

Abra **http://localhost:8000/?preview=1** para revisar a amostra. O endereço **http://localhost:8000/** mantém a programação de produção pendente. No Windows, `python -m http.server 8000 --directory public` também pode ser usado. É necessário um servidor HTTP local (não `file://`).

O sistema mostra aviso fixo de parcialidade, `A confirmar` para sala ou informação ausente, curadoria **sugerida** separada das escolhas de Flora, busca (inclusive por palestra filha), filtros, agenda/lista e backup. Preferências ficam **somente neste navegador**, no namespace `hemo2026:`, sem login ou sincronização multiaparelho. Trocar de aparelho exige exportar/importar backup.

```sh
npm run build:preview   # regera APENAS o snapshot da prévia a partir de data/
npm run check:preview   # confirma que o snapshot está sincronizado
npm run test:b2         # testes B2 e B2-W2
```

Instruções completas, status de QA e riscos: [docs/B2_PREVIEW.md](docs/B2_PREVIEW.md), [docs/DATA_CONTRACT.md](docs/DATA_CONTRACT.md) e [docs/DELIVERY.md](docs/DELIVERY.md). Nada nesta branch configura deployment, PR, Code Review ou merge.
