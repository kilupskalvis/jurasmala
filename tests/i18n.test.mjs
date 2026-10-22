import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { startServer } from './helpers/server.mjs';
import { withPage, gotoSettled } from './helpers/browser.mjs';
import { findTextOverlaps, findOverflow, findStageOverlaps } from './helpers/overlaps.mjs';

let server;
before(async () => { server = await startServer(); });
after(() => server.close());
const CYRILLIC = /[Ѐ-ӿ]/;

test('every key is translated', async () => {
  await withPage({}, async (page) => {
    await page.goto(server.url + '/', { waitUntil: 'networkidle' });
    const r = await page.evaluate(() => {
      const { lv, en } = window.i18n.strings;
      const used = [...new Set([...document.querySelectorAll('[data-i18n]')].map((e) => e.dataset.i18n))];
      return {
        missing: used.filter((k) => !lv[k] || !en[k]),
        empty: Object.entries({ ...lv, ...en }).filter(([, v]) => !String(v).trim()).map(([k]) => k),
        onlyLv: Object.keys(lv).filter((k) => !(k in en)),
        onlyEn: Object.keys(en).filter((k) => !(k in lv)),
      };
    });
    assert.deepEqual(r, { missing: [], empty: [], onlyLv: [], onlyEn: [] });
  });
});

test('switching to english', async () => {
  await withPage({ width: 390, height: 844, isMobile: true }, async (page) => {
    await gotoSettled(page, server.url + '/');
    await page.evaluate(() => document.querySelector('[data-set-lang="en"]').click());
    assert.equal(await page.getAttribute('html', 'lang'), 'en');
    const en = await page.evaluate(() => window.i18n.strings.en);
    assert.equal(await page.textContent('#gabali h2'), en['plots-title']);
    await page.evaluate(() => scrollTo(0, document.querySelector('#majas').offsetTop));
    await page.waitForFunction(() => document.querySelector('.dock').classList.contains('on'));
    await page.waitForTimeout(300);
    assert.equal(await page.textContent('.dock-info'), en['dock-free']);
    assert.match(await page.textContent('.sheet-note'), new RegExp(en['request-viewing']));
  });
});

test('english persists', async () => {
  await withPage({}, async (page) => {
    await page.goto(server.url + '/', { waitUntil: 'networkidle' });
    await page.click('.header [data-set-lang="en"]');
    await page.goto(server.url + '/#gabali', { waitUntil: 'networkidle' });
    assert.equal(await page.getAttribute('html', 'lang'), 'en');
    assert.equal(await page.getAttribute('.header [data-set-lang="en"]', 'aria-pressed'), 'true');
  });
  await withPage({ storage: { lang: 'ru' } }, async (page) => {
    await page.goto(server.url + '/', { waitUntil: 'networkidle' });
    assert.equal(await page.getAttribute('html', 'lang'), 'lv');
    assert.equal(await page.textContent('#gabali h2'), 'Brīvie zemes gabali');
  });
});

test('no russian', async () => {
  await withPage({}, async (page) => {
    await page.goto(server.url + '/', { waitUntil: 'networkidle' });
    const r = await page.evaluate(() => ({
      buttons: document.querySelectorAll('[data-set-lang="ru"]').length,
      langs: Object.keys(window.i18n.strings),
      text: JSON.stringify(window.i18n.strings),
    }));
    assert.equal(r.buttons, 0);
    assert.deepEqual(r.langs.sort(), ['en', 'lv']);
    assert.doesNotMatch(r.text, CYRILLIC);
  });
});

for (const [width, height] of [[320, 480], [390, 844]]) {
  test(`english fits small phones ${width}x${height}`, async () => {
    await withPage({ width, height, isMobile: true, storage: { lang: 'en' } }, async (page) => {
      await gotoSettled(page, server.url + '/');
      assert.equal(await page.getAttribute('html', 'lang'), 'en');
      assert.deepEqual(await findTextOverlaps(page), []);
      assert.deepEqual(await findOverflow(page), []);
    });
    await withPage({ width, height, isMobile: true, storage: { lang: 'en' } }, async (page) => {
      await page.goto(server.url + '/', { waitUntil: 'load' });
      assert.deepEqual(await findStageOverlaps(page), []);
    });
  });
}
