import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { startServer, repoRoot } from './helpers/server.mjs';
import { withPage, gotoSettled } from './helpers/browser.mjs';

let server;
before(async () => { server = await startServer(); });
after(() => server.close());
const intoPlots = (page) => page.evaluate(() => scrollTo(0, document.querySelector('#gabali').offsetTop + 200));

for (const [width, height] of [[1440, 900], [390, 844]]) {
  test(`pins sit on the photo's markers ${width}x${height}`, async () => {
    await withPage({ width, height, isMobile: width < 800 }, async (page) => {
      await gotoSettled(page, server.url + '/');
      // pins start shifted for their reveal; measure once the plan has been seen
      await page.$eval('.sheet-map', (m) => m.scrollIntoView({ block: 'center' }));
      await page.waitForFunction(() => document.querySelector('.sheet-map').classList.contains('in'));
      const off = await page.evaluate(() => {
        const img = document.querySelector('.sheet-map img').getBoundingClientRect();
        const pins = [...document.querySelectorAll('.sheet-map .pin')];
        const bad = [];
        for (const pin of pins) {
          const src = document.querySelector(`[data-plot="${pin.dataset.plot}"][data-x]`);
          const r = pin.getBoundingClientRect();
          const dx = r.left + r.width / 2 - (img.left + Number(src.dataset.x) * img.width);
          const dy = r.top + r.height / 2 - (img.top + Number(src.dataset.y) * img.height);
          if (Math.abs(dx) > 1 || Math.abs(dy) > 1) bad.push(`${pin.dataset.plot} off by ${dx.toFixed(1)},${dy.toFixed(1)}`);
        }
        return { count: pins.length, bad };
      });
      assert.equal(off.count, 22);
      assert.deepEqual(off.bad, []);
    });
  });
}

test('selecting from the list', async () => {
  await withPage({}, async (page) => {
    await gotoSettled(page, server.url + '/');
    await page.click('ol.pricelist li[data-plot="4a"] button');
    assert.ok(await page.$eval('.pin[data-plot="4a"]', (p) => p.classList.contains('selected')));
    const note = await page.textContent('.sheet-note');
    assert.match(note.replace(/\s+/g, ' '), /198 000 EUR/);
    const href = await page.$eval('.sheet-note a[href^="mailto:"]', (a) => a.getAttribute('href'));
    assert.equal(decodeURIComponent(href.split('subject=')[1]), 'Jūrasmala, Jūras iela 4a');
  });
  await withPage({ width: 390, height: 844, isMobile: true }, async (page) => {
    await gotoSettled(page, server.url + '/');
    await intoPlots(page);
    await page.click('ol.pricelist li[data-plot="4a"] button');
    await page.waitForTimeout(300);
    assert.match(await page.textContent('.dock-info'), /Jūras iela 4a/);
    const href = await page.$eval('.dock-cta', (a) => a.getAttribute('href'));
    assert.ok(href.startsWith('mailto:') && decodeURIComponent(href).includes('4a'), href);
  });
});

test('selecting a sold plot', async () => {
  await withPage({}, async (page) => {
    await gotoSettled(page, server.url + '/');
    await page.click('.sold-line button[data-plot="9b"]');
    assert.match((await page.textContent('.sheet-note')).toLowerCase(), /pārdots/);
  });
  await withPage({ width: 390, height: 844, isMobile: true }, async (page) => {
    await gotoSettled(page, server.url + '/');
    await intoPlots(page);
    await page.click('.sold-line button[data-plot="9b"]');
    await page.waitForTimeout(300);
    assert.equal(await page.$eval('.dock-cta', (a) => a.hidden), true);
  });
});

test('reserved plot', async () => {
  const html = (await readFile(path.join(repoRoot, 'index.html'), 'utf8'))
    .replace('data-plot="2b" data-status="available"', 'data-plot="2b" data-status="reserved"');
  assert.ok(html.includes('data-plot="2b" data-status="reserved"'), 'fixture changed');
  await withPage({}, async (page) => {
    await page.route(server.url + '/', (route) => route.fulfill({ status: 200, contentType: 'text/html; charset=utf-8', body: html }));
    await gotoSettled(page, server.url + '/');
    const row = await page.textContent('ol.pricelist li[data-plot="2b"]');
    assert.match(row, /Rezervēts/);
    assert.doesNotMatch(row, /EUR/);
    assert.ok(await page.$eval('.pin[data-plot="2b"]', (p) => p.classList.contains('reserved')));
    await page.click('ol.pricelist li[data-plot="2b"] button');
    assert.equal(await page.$$eval('.sheet-note a[href^="mailto:"]', (a) => a.length), 0);
    assert.equal(await page.$$eval('ol.pricelist > li', (l) => l.length), 7);
  });
});
