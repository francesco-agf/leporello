# Leporello — il serpente di carta

Repo `francesco-agf/leporello` → https://francesco-agf.github.io/leporello/
Terzo gioco della sala giochi AGF. La famiglia è di cinque repo:
`francesco-agf.github.io` (la sala), `baseline`, `refusi`, `leporello`, `tiratura`.

## Prima di toccare qualcosa

Il quaderno di progetto sta su Google Drive, in **Sala Giochi AGF / Quaderno**.
Va letto prima di cominciare — qui ci sono solo dieci righe di promemoria.

| File | Cosa contiene |
|---|---|
| `AGF-come-si-lavora.md` | come si monta, come si prova, come si pubblica |
| `AGF-decisioni.md` | che cosa è stato deciso, e perché |
| `AGF-marchio.md` | bianco su scuro, nero su bianco |
| `AGF-leporello.md` | **questo gioco**: pieghe, campioni, piegatrice, pieghevole steso |
| `AGF-sala.md` | classifiche, database, ponte fra i giochi, privacy |

## Le quattro cose da non sbagliare

1. **`index.html` è generato.** Si modifica `sorgente/leporello.html`, poi
   `python3 sorgente/build.py`. Le prove girano su `index.html`: senza il montaggio si
   prova la versione vecchia. È la trappola numero uno.
   *(Storicamente il sorgente si montava da `_lep_1.html` + `_lep_2.html`: quei pezzi non
   sono più nel repository. Se qualcuno li rimettesse, torna anche la vecchia trappola —
   una modifica fatta solo sul file assemblato si perde al montaggio dopo.)*
2. **La segnatura è di sei facciate, non otto.** Il vecchio testo era rimasto anche nei
   metadati.
3. **Si scrive in italiano.** Funzioni, variabili, commenti, messaggi.
4. **Supabase non si tocca** e **Aruba è in stand-by**.

## Le prove

Playwright, in `sorgente/`, più quelle comuni in `../sala/sorgente/`: i cinque repo vanno
clonati come cartelle sorelle e quello della sala **deve** chiamarsi `sala`.
`node prova-<nome>.js` dalla cartella `sorgente/`. Prima di pubblicare girano tutte.

Attenzione: il gioco avanza a **passi discreti**. Le prove chiamano `__leporello.passo(n)`
e leggono `__leporello.stato()` — non aspettano un tempo fisso. E serve `agf.giocatore` in
`localStorage` con `addInitScript` prima di caricare la pagina.

## Pubblicare

Branch di lavoro → prove → pull request → merge in `main` → GitHub Pages pubblica da sola
dalla radice → si verifica l'URL dal vivo. Dettagli in `AGF-come-si-lavora.md`.
