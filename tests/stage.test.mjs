import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { startServer } from './helpers/server.mjs';
import { withPage } from './helpers/browser.mjs';
import { findStageOverlaps } from './helpers/overlaps.mjs';

let server;
before(async () => { server = await startServer(); });
after(() => server.close());

const scrollStage = (page, p) => page.evaluate((p) => {
  const s = document.querySelector('[data-stage]');
  scrollTo(0, s.offsetTop + p * (s.offsetHeight - innerHeight));
}, p);

test('webgl opening draws', async () => {
  await withPage({}, async (page) => {
    await page.goto(server.url + '/', { waitUntil: 'load' });
    await page.waitForSelector('[data-stage] canvas.on', { state: 'attached', timeout: 10000 });
    assert.deepEqual(page.pageErrors, []);
  });
});

test('captions follow scroll without webgl', async () => {
  await withPage({ args: ['--disable-webgl', '--disable-3d-apis'] }, async (page) => {
    await page.goto(server.url + '/', { waitUntil: 'networkidle' });
    let last = -1;
    for (const p of [0, 0.3, 0.6, 0.95]) {
      await scrollStage(page, p);
      await page.waitForTimeout(400);
      const state = await page.evaluate(() => ({
        captions: [...document.querySelectorAll('.stage-caption.on')].map((c) => Number(c.dataset.caption)),
        frames: [...document.querySelectorAll('[data-frame]')].map((f, i) => (f.classList.contains('on') ? i : -1)).filter((i) => i >= 0),
        canvas: document.querySelectorAll('[data-stage] canvas').length,
      }));
      assert.equal(state.captions.length, 1, `one caption at ${p}`);
      assert.ok(state.captions[0] > last || (p === 0 && state.captions[0] === 0), `caption advances at ${p}`);
      assert.deepEqual(state.frames, state.captions, `photo matches caption at ${p}`);
      assert.equal(state.canvas, 0);
      last = state.captions[0];
    }
    assert.equal(last, 4, 'reaches the last caption');
  });
});

test('reduced motion', async () => {
  await withPage({ reducedMotion: 'reduce' }, async (page) => {
    await page.goto(server.url + '/', { waitUntil: 'networkidle' });
    await page.waitForTimeout(3000);
    assert.equal(await page.$$eval('[data-stage] canvas', (c) => c.length), 0);
    const clips = await page.$$eval('[data-reveal-image] .ph', (els) => els.map((e) => getComputedStyle(e).clipPath));
    assert.ok(clips.length > 0 && clips.every((c) => c === 'none'), clips.join(','));
  });
});

for (const [width, height] of [[1440, 900], [1024, 768], [390, 844], [320, 480]]) {
  test(`no overlapping captions while scrolling ${width}x${height}`, async () => {
    await withPage({ width, height, isMobile: width < 800 }, async (page) => {
      await page.goto(server.url + '/', { waitUntil: 'load' });
      assert.deepEqual(await findStageOverlaps(page), []);
    });
  });
}

test('failed texture upload falls back to photos', async () => {
  await withPage({}, async (page) => {
    // simulate GL out-of-memory: uploads do nothing and report an error
    await page.addInitScript(() => {
      const P = WebGLRenderingContext.prototype;
      let failed = false;
      P.texImage2D = function () { failed = true; };
      const getError = P.getError;
      P.getError = function () { if (failed) { failed = false; return this.OUT_OF_MEMORY; } return getError.call(this); };
    });
    await page.goto(server.url + '/', { waitUntil: 'load' });
    await page.waitForTimeout(5000);
    assert.equal(await page.$$eval('[data-stage] canvas.on', (c) => c.length), 0, 'no canvas over the photos');
    assert.equal(await page.$$eval('[data-frame].on', (f) => f.length), 1, 'a photo is shown');
  });
});

test('lost webgl context falls back to photos', async () => {
  await withPage({}, async (page) => {
    await page.goto(server.url + '/', { waitUntil: 'load' });
    await page.waitForSelector('[data-stage] canvas.on', { state: 'attached', timeout: 10000 });
    await page.evaluate(() => document.querySelector('[data-stage] canvas').getContext('webgl').getExtension('WEBGL_lose_context').loseContext());
    await page.waitForTimeout(500);
    assert.equal(await page.$$eval('[data-stage] canvas.on', (c) => c.length), 0);
    assert.equal(await page.$$eval('[data-frame].on', (f) => f.length), 1);
  });
});
