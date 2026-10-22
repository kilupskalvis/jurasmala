import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { startServer } from './helpers/server.mjs';
import { withPage, gotoSettled } from './helpers/browser.mjs';
import { findTextOverlaps, findOverflow } from './helpers/overlaps.mjs';

let server;
before(async () => { server = await startServer(); });
after(() => server.close());
const DEEP = '/a/b/c';

test('served for unknown deep paths', async () => {
  await withPage({}, async (page) => {
    const res = await page.goto(server.url + DEEP, { waitUntil: 'networkidle' });
    assert.equal(res.status(), 404);
    assert.ok(await page.isVisible('text=Lapa nav atrasta'));
    assert.ok(await page.isVisible('text=Page not found'));
  });
});

test('assets resolve from any depth', async () => {
  await withPage({}, async (page) => {
    const failed = [];
    page.on('response', (r) => {
      if (r.url().startsWith(server.url) && !r.url().endsWith(DEEP) && r.status() !== 200) failed.push(`${r.status()} ${r.url()}`);
    });
    await page.goto(server.url + DEEP, { waitUntil: 'networkidle' });
    assert.deepEqual(failed, []);
    const loaded = await page.evaluate(async () => (await document.fonts.load('300 40px "Cormorant Garamond"', 'Lapa nav atrasta')).length);
    assert.ok(loaded > 0, 'serif font loads');
    assert.ok(await page.evaluate(() => getComputedStyle(document.body).backgroundColor !== 'rgba(0, 0, 0, 0)'), 'site styles apply');
  });
});

test('links home', async () => {
  await withPage({}, async (page) => {
    await page.goto(server.url + DEEP, { waitUntil: 'load' });
    const texts = await page.$$eval('a[href="/"]', (as) => as.map((a) => a.textContent.trim()));
    assert.ok(texts.includes('Uz sākumlapu'), texts.join(' | '));
  });
});

test('no russian', async () => {
  await withPage({}, async (page) => {
    await page.goto(server.url + DEEP, { waitUntil: 'load' });
    assert.doesNotMatch(await page.evaluate(() => document.body.innerText), /[Ѐ-ӿ]/);
  });
});

for (const [width, height] of [[320, 480], [1440, 900]]) {
  test(`fits ${width}x${height}`, async () => {
    await withPage({ width, height, isMobile: width < 800 }, async (page) => {
      await gotoSettled(page, server.url + DEEP);
      assert.deepEqual(await findTextOverlaps(page), []);
      assert.deepEqual(await findOverflow(page), []);
    });
  });
}

test('styled in the site design', async () => {
  await withPage({}, async (page) => {
    await page.goto(server.url + DEEP, { waitUntil: 'networkidle' });
    const s = await page.evaluate(() => {
      const h1 = getComputedStyle(document.querySelector('h1'));
      const bg = [...document.querySelectorAll('body *')].flatMap((e) => [getComputedStyle(e), getComputedStyle(e, '::before')]).map((c) => c.backgroundImage).find((b) => b.includes('coastal_image')) || '';
      return { family: h1.fontFamily, weight: h1.fontWeight, color: h1.color, size: parseFloat(h1.fontSize), h2: parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--fs-h2')) || null, bg };
    });
    assert.match(s.family, /Cormorant Garamond/);
    assert.equal(s.weight, '300');
    assert.equal(s.color, 'rgb(233, 227, 212)');
    assert.match(s.bg, /coastal_image/);
  });
});
