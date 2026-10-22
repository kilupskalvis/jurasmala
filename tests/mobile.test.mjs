import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { startServer } from './helpers/server.mjs';
import { withPage, gotoSettled } from './helpers/browser.mjs';
import { findTextOverlaps, findOverflow } from './helpers/overlaps.mjs';

let server;
before(async () => { server = await startServer(); });
after(() => server.close());
const phone = { width: 390, height: 844, isMobile: true };
const pastOpening = (page) => page.evaluate(() => {
  const s = document.querySelector('[data-stage]');
  scrollTo(0, s.offsetTop + s.offsetHeight + 200);
});

for (const [width, height] of [[320, 480], [360, 740], [390, 844], [430, 932], [768, 1024]]) {
  test(`no overlaps or overflow on phones ${width}x${height}`, async () => {
    await withPage({ width, height, isMobile: true }, async (page) => {
      await gotoSettled(page, server.url + '/');
      assert.deepEqual(await findTextOverlaps(page), []);
      assert.deepEqual(await findOverflow(page), []);
    });
  });
}

test('bottom bar', async () => {
  await withPage(phone, async (page) => {
    await page.goto(server.url + '/', { waitUntil: 'networkidle' });
    assert.equal(await page.$eval('.dock', (d) => d.classList.contains('on')), false, 'hidden on the opening');
    await pastOpening(page);
    await page.waitForFunction(() => document.querySelector('.dock').classList.contains('on'));
    await page.evaluate(() => scrollTo(0, document.querySelector('#majas').offsetTop));
    await page.waitForTimeout(300);
    assert.equal(await page.$eval('.dock-cta', (a) => a.getAttribute('href')), 'tel:+37120440777');
  });
});

test('menu', async () => {
  await withPage(phone, async (page) => {
    await page.goto(server.url + '/', { waitUntil: 'networkidle' });
    await pastOpening(page);
    await page.waitForFunction(() => document.querySelector('.dock').classList.contains('on'));
    await page.click('.dock-menu');
    assert.ok(await page.$eval('#menu', (m) => m.classList.contains('open')));
    assert.equal(await page.evaluate(() => document.activeElement.getAttribute('href')), '#gabali');
    await page.keyboard.press('Escape');
    assert.equal(await page.$eval('#menu', (m) => m.classList.contains('open')), false);
    assert.ok(await page.evaluate(() => document.activeElement.classList.contains('dock-menu')));
    await page.click('.dock-menu');
    await page.click('#menu a[href="#lokacija"]');
    await page.waitForTimeout(800);
    assert.equal(await page.$eval('#menu', (m) => m.classList.contains('open')), false);
    const top = await page.$eval('#lokacija', (s) => s.getBoundingClientRect().top);
    assert.ok(Math.abs(top) < 4, `#lokacija at top (${top})`);
  });
});

test('strips', async () => {
  await withPage(phone, async (page) => {
    await page.goto(server.url + '/', { waitUntil: 'networkidle' });
    const counts = await page.$$eval('[data-strip]', (strips) => strips.map((s) => s.children.length));
    assert.deepEqual(counts, [4, 6, 5]);
    await page.$$eval('[data-strip]', (strips) => strips.forEach((s) => { s.scrollLeft = s.scrollWidth; }));
    await page.waitForTimeout(400);
    const shown = await page.$$eval('[data-strip] + .strip-count .n', (ns) => ns.map((n) => Number(n.textContent)));
    assert.deepEqual(shown, [4, 6, 5]);
  });
});

test('touch targets', async () => {
  await withPage(phone, async (page) => {
    await page.goto(server.url + '/', { waitUntil: 'networkidle' });
    await pastOpening(page);
    await page.waitForFunction(() => document.querySelector('.dock').classList.contains('on'));
    const small = async () => page.$$eval('button, .dock a, .pricelist button, .menu a', (els) => els
      // map pins are an extra pointer onto the same choices as the price list (WCAG 2.5.8 equivalent control)
      .filter((e) => !e.classList.contains('pin'))
      .filter((e) => { const r = e.getBoundingClientRect(); return r.width > 0 && r.height > 0 && getComputedStyle(e).visibility !== 'hidden'; })
      .filter((e) => e.getBoundingClientRect().height < 44)
      .map((e) => `${e.tagName.toLowerCase()}.${[...e.classList].join('.')} "${e.textContent.trim().slice(0, 20)}" ${Math.round(e.getBoundingClientRect().height)}px`));
    assert.deepEqual(await small(), []);
    await page.click('.dock-menu');
    assert.deepEqual(await small(), [], 'with the menu open');
  });
});

test('no line starts with punctuation', async () => {
  for (const lang of ['lv', 'en']) {
    for (const [width, height] of [[320, 480], [390, 844]]) {
      await withPage({ width, height, isMobile: true, storage: { lang } }, async (page) => {
        await gotoSettled(page, server.url + '/');
        const orphans = await page.evaluate(() => {
          const out = [];
          const walker = document.createTreeWalker(document.querySelector('main'), NodeFilter.SHOW_TEXT);
          for (let n; (n = walker.nextNode());) {
            const m = n.textContent.match(/^\s*[.,:;]/);
            if (!m) continue;
            const r = document.createRange();
            r.setStart(n, m[0].length - 1); r.setEnd(n, m[0].length);
            const rc = r.getBoundingClientRect();
            const box = n.parentElement.closest('p, li, div').getBoundingClientRect();
            if (rc.width && rc.left - box.left < 2) out.push(`"${n.textContent.trim().slice(0, 12)}" in ${n.parentElement.tagName}`);
          }
          return out;
        });
        assert.deepEqual(orphans, [], `${lang} ${width}px`);
      });
    }
  }
});
