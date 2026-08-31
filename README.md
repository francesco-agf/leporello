# Leporello

Il serpente di carta di **Arti Grafiche Fimognari**, dal 1950. Non è un serpente: è un foglio
che si piega su sé stesso. Mangi gli sfridi e ogni boccone aggiunge una facciata; ogni curva
è una piega vera, con la sua ombra.

Gioca: https://francesco-agf.github.io/leporello/

## La regola

Mangi gli **sfridi** — i ritagli bianchi che avanzano dalla rifilatura — e ogni sfrido ti
aggiunge una **facciata**.

Il foglio **non ha bordi**: è una bobina, esci da una parte e rientri dall'altra, e uscire non
costa niente. Si perde solo toccando sé stessi (*il foglio si strappa sulla piega*), finendo
contro un **punto metallico** o attraversando una **cordonatura**.

## Le segnature

Ogni **otto facciate** chiudi una segnatura: sedici pagine. La piegatrice dà il colpo, si sale
di **formato di piega**, e resta sul piano un punto metallico in più.

1 Piega semplice · 2 Portafoglio · 3 Finestra · 4 Piega a Z · 5 Piega a croce ·
6 Fisarmonica · 7 Mulino · 8 Parallela · 9 Leporello · 10 Fuori formato

Dal quinto formato compaiono le **cordonature**: linee tratteggiate che nel foglio vero sono i
segni della piega, e qui sono muri.

## I campioni colore

Ogni tanto cade un cartoncino colorato. Resta poco, ne vale uno per volta.

| | | |
|---|---|---|
| **C** | In registro | otto secondi: passi attraverso cordonature e punti metallici |
| **M** | Sovrastampa | dieci secondi a punti doppi, con la scia magenta |
| **Y** | Rifilo | taglia tre facciate dalla coda e te le paga |
| **K** | Pieno | sei secondi al rallentatore |
| **Pantone** | Tinta piatta | raro: cento punti e una segnatura in regalo |

## Punteggio

- Sfrido — 10 × formato
- Campione colore — 40 × formato
- Segnatura chiusa — 200 × formato
- Rifilo — 90 × formato, e tre facciate in meno
- Sovrastampa — tutto quello che prendi vale il doppio

## Il crocino, la foliazione, la tinta

La testa della striscia è un **crocino di registro** nero. Ogni facciata porta il suo numero di
pagina e recto e verso si alternano di tono. Quando raccogli un campione **tutta la striscia si
tinge** di quel colore per qualche secondo, come un foglio che passa in macchina; i numeri di
pagina passano al chiaro quando la tinta è scura.

## Comandi

Frecce o W A S D per piegare, P per la pausa, Invio per ricominciare.
Da telefono: trascina il dito sul piano nella direzione che vuoi, oppure usa i quattro tasti
sotto al campo. Sul telefono il campo si gira in verticale, 13 × 19 invece di 19 × 13.

## Tecnica

Un solo file. Nessuna dipendenza a parte i caratteri da Google Fonts. Il marchio è SVG in linea;
la striscia, le pieghe, i campioni e i punti metallici sono disegnati su canvas; i rumori di
legatoria sono sintetizzati con la Web Audio API. La classifica è quella condivisa della sala.

`SHARE_URL`, in cima allo script, è l'indirizzo che compare in fondo al risultato condiviso.
`ALTRI_GIOCHI` è l'elenco dei rimandi agli altri giochi della sala.

## Il sorgente

`index.html` alla radice è **generato**: non modificarlo a mano. Si lavora su
`sorgente/leporello.html` e si rilancia `python3 sorgente/build.py` dopo ogni modifica.
In `sorgente/` ci sono anche i collaudi automatici. Istruzioni in
[`sorgente/LEGGIMI.md`](sorgente/LEGGIMI.md).

## Gli altri giochi

**Baseline**, il puzzle tipografico: https://francesco-agf.github.io/baseline/
**Refusi**, lo sparatutto: https://francesco-agf.github.io/refusi/
La sala giochi: https://francesco-agf.github.io/
