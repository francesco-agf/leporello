/* Collaudo di Leporello.
   Gira su index.html, quello rigenerato da sorgente/build.py: le media query
   del telefono e il meta viewport esistono solo lì.

   Nota: il gioco avanza a passi discreti e il giro di animazione si ferma
   quando la scheda va in secondo piano, quindi le prove non aspettano il tempo
   reale — chiamano __leporello.passo() e leggono lo stato. */
const { chromium } = require('playwright');
const path = require('path');
const PAGINA = 'file://' + path.resolve(__dirname, '..', 'index.html');
const log = (...a) => console.log(...a);
let falliti = 0;
const ok = (nome, cond, extra) => {
  if (!cond) falliti++;
  log((cond ? '  ok  ' : '  KO  ') + nome + (extra !== undefined ? '  ' + JSON.stringify(extra) : ''));
};

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 940 } });
  const errors = [];
  page.on('console', m => { if (m.type() === 'error' && !/ERR_|fonts\.g/.test(m.text())) errors.push(m.text()); });
  page.on('pageerror', e => errors.push('PAGEERROR: ' + e.message));
  await page.addInitScript(() => { try { localStorage.setItem('agf.giocatore', 'Collaudo'); } catch (e) {} });
  await page.route('**/rest/v1/**', r => r.fulfill({ status: 200, contentType: 'application/json', body: '[]' }));
  await page.goto(PAGINA);
  await page.waitForTimeout(900);

  // 1. si comincia, e la striscia parte da quattro facciate
  const t1 = await page.evaluate(() => {
    const L = window.__leporello; L.comincia();
    return L.stato();
  });
  ok('1. la partita parte', t1.fase === 'play' && t1.lunghezza === 4 && t1.formato === 1, t1);

  // 2. mangiare uno sfrido allunga la striscia di una facciata e fa punti
  const t2 = await page.evaluate(() => {
    const L = window.__leporello; L.comincia();
    const s0 = L.stato();
    L.mettiSfrido(s0.testa.x + 2, s0.testa.y);
    L.passo(2);
    const s1 = L.stato();
    // la crescita si vede al passo dopo: la coda resta ferma una volta
    L.passo(1);
    const s2 = L.stato();
    return { prima: s0.lunghezza, dopo: s2.lunghezza, facciate: s1.facciate, punti: s1.punti };
  });
  ok('2. lo sfrido allunga', t2.dopo === t2.prima + 1 && t2.facciate === 1 && t2.punti === 10, t2);

  // 3. otto facciate chiudono una segnatura e fanno salire il formato
  const t3 = await page.evaluate(() => {
    const L = window.__leporello; L.comincia();
    L.cresci(8);
    return L.stato();
  });
  ok('3. la segnatura chiude', t3.segnature === 1 && t3.formato === 2 && t3.graffette === 1, t3);

  // 4. il muro: uscire dal foglio finisce la partita
  const t4 = await page.evaluate(() => {
    const L = window.__leporello; L.comincia();
    L.passo(40);               // dritto a destra: prima o poi il bordo arriva
    return L.stato();
  });
  ok('4. il bordo uccide', t4.fase !== 'play' && t4.causa === 'fuori', { fase: t4.fase, causa: t4.causa });

  // 5. il registro fa passare dall'altra parte invece di uccidere
  const t5 = await page.evaluate(() => {
    const L = window.__leporello; L.comincia();
    const s0 = L.stato();
    L.mettiCampione('registro', s0.testa.x + 1, s0.testa.y);
    L.passo(1);
    const dopoPresa = L.stato();
    L.passo(40);
    const s = L.stato();
    return { effetto: dopoPresa.effetto, fase: s.fase, x: s.testa.x, causa: s.causa };
  });
  ok('5. il registro fa il giro', t5.effetto === 'registro' && t5.fase === 'play', t5);

  // 6. il rifilo accorcia
  const t6 = await page.evaluate(() => {
    const L = window.__leporello; L.comincia();
    // si allunga mangiando davvero: quattro sfridi messi uno davanti all'altro
    for (let i = 0; i < 4; i++){
      const s = L.stato();
      L.mettiSfrido(s.testa.x + 1, s.testa.y);
      L.passo(1);
    }
    const prima = L.stato();
    L.mettiCampione('rifilo', prima.testa.x + 1, prima.testa.y);
    L.passo(1);
    const dopo = L.stato();
    return { lung0: prima.lunghezza, lung1: dopo.lunghezza,
             prima: prima.facciate, dopo: dopo.facciate,
             effetto: dopo.effetto, punti: dopo.punti > prima.punti };
  });
  ok('6. il rifilo accorcia', t6.dopo === t6.prima - 3 && t6.effetto === null && t6.punti, t6);

  // 7. la tinta piatta regala una segnatura
  const t7 = await page.evaluate(() => {
    const L = window.__leporello; L.comincia();
    const s0 = L.stato();
    L.mettiCampione('tinta', s0.testa.x + 1, s0.testa.y);
    L.passo(1);
    return L.stato();
  });
  ok('7. la tinta regala una segnatura', t7.segnature === 1 && t7.facciate === 8, t7);

  // 8. la sovrastampa raddoppia
  const t8 = await page.evaluate(() => {
    const L = window.__leporello; L.comincia();
    const s0 = L.stato();
    L.mettiCampione('sovrastampa', s0.testa.x + 1, s0.testa.y);
    L.passo(1);
    const dopo = L.stato();
    const p0 = dopo.punti;
    L.mettiSfrido(dopo.testa.x + 1, dopo.testa.y);
    L.passo(1);
    const s = L.stato();
    return { effetto: dopo.effetto, delta: s.punti - p0 };
  });
  ok('8. la sovrastampa raddoppia', t8.effetto === 'sovrastampa' && t8.delta === 20, t8);

  // 9. mordersi finisce la partita
  const t9 = await page.evaluate(() => {
    const L = window.__leporello; L.comincia();
    L.cresci(10);
    L.passo(3);
    L.piega('down'); L.passo(1);
    L.piega('left'); L.passo(1);
    L.piega('up'); L.passo(2);
    return L.stato();
  });
  ok('9. mordersi strappa', t9.fase !== 'play' && t9.causa === 'strappo', { fase: t9.fase, causa: t9.causa });

  // 10. le cordonature compaiono dal quinto formato, mai addosso alla striscia
  const t10 = await page.evaluate(() => {
    const L = window.__leporello; L.comincia();
    const a = (() => { L.formatoA(4); return L.stato().muri; })();
    const b = (() => { L.formatoA(5); return L.stato().muri; })();
    const c = (() => { L.formatoA(10); return L.stato().muri; })();
    return { f4: a, f5: b, f10: c };
  });
  ok('10. le cordonature crescono', t10.f4 === 0 && t10.f5 > 0 && t10.f10 > t10.f5, t10);

  // 11. non si torna indietro su sé stessi
  const t11 = await page.evaluate(() => {
    const L = window.__leporello; L.comincia();
    L.piega('left');           // sta andando a destra: l'inversione va ignorata
    L.passo(1);
    return L.stato();
  });
  ok('11. niente inversione a U', t11.fase === 'play' && t11.dir.x === 1, t11);

  // 12. pausa e abbandono
  const t12 = await page.evaluate(async () => {
    const L = window.__leporello; L.comincia();
    L.pausa();
    const inPausa = L.stato().fase;
    const abbandonaVisibile = !document.getElementById('giveUpBtn').hidden;
    document.getElementById('giveUpBtn').click();
    await new Promise(r => setTimeout(r, 120));
    const dopo = L.stato();
    return { inPausa, abbandonaVisibile, fase: dopo.fase, causa: dopo.causa,
             schedaAltroGioco: !document.getElementById('altroGioco').hidden,
             abbandonaNascosto: document.getElementById('giveUpBtn').hidden };
  });
  ok('12. pausa e abbandono', t12.inPausa === 'pause' && t12.abbandonaVisibile &&
      t12.fase === 'over' && t12.causa === 'resa' && t12.schedaAltroGioco && t12.abbandonaNascosto, t12);

  // 13. il ponte verso gli altri giochi
  const t13 = await page.evaluate(() => ({
    sala: document.querySelector('.sala-link').getAttribute('href'),
    piede: Array.from(document.querySelectorAll('.colofoot a.tool')).map(a => a.getAttribute('href')),
    scheda: document.getElementById('altroGioco').getAttribute('href')
  }));
  ok('13. il ponte', t13.sala === 'https://francesco-agf.github.io/' &&
      t13.piede.length === 3 && /baseline/.test(t13.piede.join()) && /refusi/.test(t13.piede.join()) &&
      /baseline|refusi/.test(t13.scheda || ''), t13);

  // 14. niente selezione del testo sul campo
  const t14 = await page.evaluate(() => {
    const b = getComputedStyle(document.body);
    return { us: b.userSelect || b.webkitUserSelect,
             inp: getComputedStyle(document.getElementById('nameInput')).webkitUserSelect };
  });
  ok('14. selezione bloccata', t14.us === 'none' && t14.inp === 'text', t14);

  // 15. il testo condivisibile
  const t15 = await page.evaluate(() => window.__leporello.testo());
  ok('15. risultato condivisibile', /LEPORELLO/.test(t15) && /leporello\/$/m.test(t15.trim()), t15.split('\n')[0]);

  // 16. da telefono: il campo sta dentro lo schermo, i tasti si vedono
  const tel = await browser.newPage({ viewport: { width: 390, height: 780 }, isMobile: true, hasTouch: true });
  await tel.addInitScript(() => { try { localStorage.setItem('agf.giocatore', 'Collaudo'); } catch (e) {} });
  await tel.route('**/rest/v1/**', r => r.fulfill({ status: 200, contentType: 'application/json', body: '[]' }));
  await tel.goto(PAGINA);
  await tel.waitForTimeout(900);
  const t16 = await tel.evaluate(() => {
    const cv = document.getElementById('field').getBoundingClientRect();
    return { largo: Math.round(cv.width), alto: Math.round(cv.height),
             finestra: window.innerWidth, sbordo: cv.right > window.innerWidth + 1 || cv.left < -1,
             pad: getComputedStyle(document.getElementById('pad')).display,
             tasti: document.querySelectorAll('#pad button').length,
             striscia: getComputedStyle(document.getElementById('hudStrip')).display,
             docSbordo: document.documentElement.scrollWidth > window.innerWidth + 1 };
  });
  ok('16. telefono', !t16.sbordo && !t16.docSbordo && t16.pad === 'flex' && t16.tasti === 4 &&
      t16.striscia === 'block', t16);

  // 17. da telefono la griglia si gira in verticale, e non si gira in partita
  const t17 = await tel.evaluate(async () => {
    const L = window.__leporello;
    const prima = { c: L.COLS, r: L.ROWS };
    // COLS/ROWS esportati sono la copia del momento del caricamento: si legge
    // il campo vero dalle proporzioni del canvas
    const cv = document.getElementById('field');
    const verticale = cv.height > cv.width;
    L.comincia();
    const s = L.stato();
    return { verticale, fase: s.fase, prima };
  });
  ok('17. griglia verticale sul telefono', t17.verticale && t17.fase === 'play', t17);
  await tel.close();

  log('\nerrori di console: ' + (errors.length ? errors.join(' | ') : 'nessuno'));
  if (errors.length) falliti++;
  log(falliti ? '\n' + falliti + ' PROVE FALLITE' : '\ntutto a posto');
  await browser.close();
  process.exit(falliti ? 1 : 0);
})();
