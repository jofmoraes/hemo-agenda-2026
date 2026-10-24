# HEMO Agenda 2026

PWA independente de agenda e curadoria científica para Flora, adaptado seletivamente da interface B18 do CONAHP (referência somente leitura). A branch B1 **não contém programação oficial**: quatro dias preparados, 28-31/10/2026, aguardando B2.

## Executar localmente

```sh
python -m http.server 8000 --directory public
# abrir http://localhost:8000
npm test
npm run check
```

O frontend precisa de HTTP(S) ou localhost, não `file://`. Pode ser instalado como PWA em navegador compatível com contexto seguro. A persistência é somente no dispositivo em `localStorage`, sob namespace `hemo2026:`, sem login nem sincronização. Fazer backup JSON antes de mudar de navegador ou aparelho.

A programação validada será escrita na B2 em `public/schedule.json`. Fixtures sintéticas ficam exclusivamente nos testes, nunca na UI oficial. Nenhum PR, Code Review ou deploy nesta fase. Consulte a Issue #1 e `docs/DELIVERY.md`.
