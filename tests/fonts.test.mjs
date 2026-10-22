import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { startServer } from './helpers/server.mjs';
import { withPage } from './helpers/browser.mjs';

let server;
before(async () => { server = await startServer(); });
after(() => server.close());

test('fonts are self-hosted', async () => {
  await withPage({}, async (page) => {
    await page.goto(server.url + '/', { waitUntil: 'networkidle' });
    const external = page.requests.filter((u) => /fonts\.(googleapis|gstatic)\.com/.test(u));
    assert.deepEqual(external, []);
  });
});

test('latvian glyphs render in both families', async () => {
  await withPage({}, async (page) => {
    await page.goto(server.url + '/', { waitUntil: 'networkidle' });
    // fonts.load() resolves with the faces that cover the text; none means the family is missing
    const loaded = await page.evaluate(async () => {
      const lv = 'āčēģīķļņšūžĀČĒĢĪĶĻŅŠŪŽ';
      const sans = await document.fonts.load('400 16px "Ysabeau Office"', lv);
      const italic = await document.fonts.load('italic 400 16px "Cormorant Garamond"', lv);
      return {
        sans: sans.length > 0 && document.fonts.check('400 16px "Ysabeau Office"', lv),
        italic: italic.some((f) => f.style === 'italic') && document.fonts.check('italic 400 16px "Cormorant Garamond"', lv),
      };
    });
    assert.deepEqual(loaded, { sans: true, italic: true });
  });
});
