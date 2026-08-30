# AGF Arcade — Leporello — il serpente di carta

Contesto per Claude Code. Il **brief operativo** in corso e il piano di lavoro stanno in
`PASSAGGIO.md` nel repo della sala (`francesco-agf/francesco-agf.github.io`): leggilo prima di
toccare qualunque cosa.

## Cos'e' questo repo

Non e' un serpente: e' **un foglio che si piega**. Mangi sfridi, ogni boccone aggiunge
una facciata, e ogni curva e' una piega vera con la sua ombra. Il foglio non ha bordi: esci da
una parte e rientri dall'altra. Ogni **sei facciate** chiudi una segnatura e sali di formato,
e sul piano compare lo **schema di piega** di quel formato. Dal quinto formato la **piegatrice
impazzita** ti impone la piega ogni tre passi. A fine partita la striscia si stende in un
**pieghevole** da scaricare.

Fa parte di una **sala di cinque repository** — quattro giochi piu' la pagina d'ingresso — che
si comportano come un prodotto solo:

| Repo | Indirizzo pubblico |
|---|---|
| `francesco-agf/francesco-agf.github.io` | https://francesco-agf.github.io/ |
| `francesco-agf/baseline` | https://francesco-agf.github.io/baseline/ |
| `francesco-agf/refusi` | https://francesco-agf.github.io/refusi/ |
| `francesco-agf/leporello` | https://francesco-agf.github.io/leporello/ |
| `francesco-agf/tiratura` | https://francesco-agf.github.io/tiratura/ |

Repo separati per una ragione precisa: GitHub Pages accetta **un solo dominio personalizzato
per repository**. Gli indirizzi sono gia' stati condivisi e **non cambiano**.

## Le due forme dello stesso codice — la regola che rompe tutto se ignorata

    sorgente/leporello.html   il sorgente di lavoro. Non ha doctype ne' <head>.
    index.html        la versione pubblicata, con la testata completa.
                      E' GENERATA: non si modifica a mano.

Si modifica **sempre** `sorgente/leporello.html` e poi si rigenera:

    python3 sorgente/build.py

`build.py` incolla `sorgente/testa.html` davanti al corpo del sorgente. Va rilanciato **dopo
ogni modifica**: i collaudi girano su `index.html`, e le media query del telefono funzionano
solo li', perche' il sorgente non ha il meta viewport.

Se modifichi `index.html` a mano, la modifica sparisce alla prossima build. Se modifichi il
sorgente e non ricostruisci, pubblichi la versione vecchia.

## Come si collauda

Servono `playwright` e Chromium. Dalla cartella `sorgente/`:

    node prova-gioco.js         il giro completo
    node prova-classifica.js    l'invio del punteggio

Le prove aprono `index.html` da `file://` e pilotano il gioco dalle API di collaudo
(`window.__leporello`). Non aspettano tempi fissi: chiamano l'avanzamento a mano, perche'
`requestAnimationFrame` si ferma quando la scheda va in secondo piano.

## Pubblicazione

GitHub Pages, **branch `main`, cartella radice**, workflow automatico
`pages build and deployment`. Nessuna Action personalizzata, nessuna cartella `/docs`,
nessun `gh-pages`.

**Un branch di lavoro non e' pubblicato finche' non entra in `main`.** Il ciclo e':
branch -> collaudo -> merge in `main` -> attesa del workflow -> verifica dell'URL pubblico.

## Cose da non rompere

- **La famiglia.** I quattro giochi devono sembrare fatti dalla stessa mano. C'e' una prova
  che lo pretende: `sala/sorgente/prova-famiglia-stili.js` confronta gli stili calcolati dei
  quattro giochi e fallisce se divergono. Se cambi un pulsante qui, cambialo in tutti e quattro.
- **Il nome del giocatore** sta in `localStorage` sotto la chiave condivisa `agf.giocatore`,
  uguale per tutta la sala. La vecchia `baseline.nome` resta letta come ripiego.
- **La classifica** e' la tabella `public.scores` di Supabase, condivisa fra i quattro giochi,
  con la chiave pubblicabile nel client e RLS in sola lettura e inserimento. Non toccare lo
  schema remoto.
- **Gli indirizzi nel codice sono assoluti**, non relativi: i collegamenti fra i giochi
  funzionano anche fuori dal loro sottopercorso.
- **Niente `localhost`, IP privati, `file://` o percorsi del computer** in quello che va
  pubblicato.

## Attenzione, qui

- La griglia si gira: 19 x 13 sul computer, **13 x 19 sul telefono**. `COLS` e `ROWS` sono
  variabili e cambiano dentro `resize()`, ma solo fuori partita.
- Le pieghe si disegnano dove il corpo cambia direzione. Confrontare le due direzioni fra loro
  non basta: su un tratto dritto sono sempre diverse perche' puntano da parti opposte. La prova
  giusta e' `!(d1.x === -d2.x && d1.y === -d2.y)`.
- Le prove avanzano a passi discreti (`__leporello.passo(n)`), non a millisecondi.

## Il tono

Il progetto e' un pezzo di marketing di una tipografia milanese del 1950. Tutto — interfaccia,
regole, commenti nel codice, messaggi di commit — e' in **italiano**, e usa il vocabolario del
mestiere: forma, registro, segnatura, passata, bozza, sigillo, mazzetta. I commenti nel codice
spiegano **perche'** una cosa e' fatta cosi', non cosa fa la riga sotto. Mantieni questo tono.
