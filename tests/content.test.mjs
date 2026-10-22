import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { startServer } from './helpers/server.mjs';
import { withPage, gotoSettled } from './helpers/browser.mjs';

// From "Jurasmala 1.k ZG tabula ar cenām 30.09.26..xlsx"
const AVAILABLE = [
  ['1a', 'land', 1300, 35000], ['2a', 'house-60', 1136, 169000], ['2b', 'house-25', 1494, 105000],
  ['3a', 'house-60', 1345, 169000], ['3b', 'house-60', 1165, 169000], ['4a', 'house-84', 1470, 198000], ['4b', 'house-84', 1170, 198000],
];
const SOLD = ['1b', '5', '6a', '6b', '7a', '7b', '8', '9a', '9b', '10', '11a', '11b', '12', '13', '15'];
const SECTIONS = ['par-mums', 'lokacija', 'gabali', 'majas', 'telpas', 'kontakti'];
const fmt = (n) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');

let server;
before(async () => { server = await startServer(); });
after(() => server.close());

test('price list matches the spreadsheet', async () => {
  await withPage({}, async (page) => {
    await gotoSettled(page, server.url + '/');
    const rows = await page.$$eval('ol.pricelist > li[data-status="available"]', (lis) => lis.map((li) => ({
      id: li.dataset.plot, offer: li.dataset.offer, area: Number(li.dataset.area), price: Number(li.dataset.price), text: li.textContent.replace(/\s+/g, ' '),
    })));
    assert.deepEqual(rows.map((r) => [r.id, r.offer, r.area, r.price]), AVAILABLE);
    for (const r of rows) assert.ok(r.text.includes(`${fmt(r.price)} EUR`), `${r.id} shows ${fmt(r.price)} EUR: ${r.text}`);
  });
});

test('sold list', async () => {
  await withPage({}, async (page) => {
    await gotoSettled(page, server.url + '/');
    const ids = await page.$$eval('p.sold-line [data-plot]', (els) => els.map((e) => e.dataset.plot));
    assert.deepEqual(ids, SOLD);
  });
});

test('sections exist', async () => {
  await withPage({}, async (page) => {
    await gotoSettled(page, server.url + '/');
    for (const id of SECTIONS) assert.ok(await page.$('#' + id), `#${id} exists`);
    const text = await page.evaluate(() => document.body.innerText);
    assert.doesNotMatch(text, /[Ѐ-ӿ]/, 'no Cyrillic text');
  });
});

test('readable without javascript', async () => {
  await withPage({ javaScriptEnabled: false }, async (page) => {
    await page.goto(server.url + '/', { waitUntil: 'load' });
    assert.ok(await page.isVisible('h1'));
    const rows = await page.$$eval('ol.pricelist > li[data-status="available"]', (lis) => lis.map((li) => {
      const r = li.getBoundingClientRect();
      let o = 1; for (let e = li; e; e = e.parentElement) o *= parseFloat(getComputedStyle(e).opacity);
      return { visible: r.width > 0 && r.height > 0 && o > 0.99, text: li.textContent.replace(/\s+/g, ' ') };
    }));
    assert.equal(rows.length, 7);
    for (const [i, r] of rows.entries()) {
      assert.ok(r.visible, `row ${i} visible`);
      assert.ok(r.text.includes(`${fmt(AVAILABLE[i][3])} EUR`));
    }
    const body = await page.evaluate(() => document.body.innerText);
    assert.match(body, /kristine@kilupa\.lv/);
    assert.match(body, /\+371 2044 0777/);
  });
});

test('plan photo spans the plots section', async () => {
  for (const javaScriptEnabled of [true, false]) {
    await withPage({ javaScriptEnabled }, async (page) => {
      await page.goto(server.url + '/', { waitUntil: 'load' });
      const { img, section } = await page.evaluate(() => ({
        img: document.querySelector('.sheet-map img').getBoundingClientRect().width,
        section: document.querySelector('#gabali').getBoundingClientRect().width,
      }));
      assert.ok(img > section * 0.85, `plan ${Math.round(img)}px of section ${Math.round(section)}px (js ${javaScriptEnabled})`);
    });
  }
});
