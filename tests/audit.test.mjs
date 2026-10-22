import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { startServer } from './helpers/server.mjs';
import { withPage, gotoSettled } from './helpers/browser.mjs';

let server;
before(async () => { server = await startServer(); });
after(() => server.close());

for (const [width, height] of [[1440, 900], [390, 844]]) {
  test(`type sizes come from the scale ${width}x${height}`, async () => {
    await withPage({ width, height, isMobile: width < 800 }, async (page) => {
      await gotoSettled(page, server.url + '/');
      const r = await page.evaluate(() => {
        // resolve each --fs-* token to px by applying it to a probe element
        const probe = document.createElement('span');
        document.body.appendChild(probe);
        const tokens = new Map();
        for (const name of ['hero', 'stage', 'h2', 'display', 'lead', 'mid', 'sub', 'body', 'cap', 'ui', 'tag']) {
          probe.style.fontSize = `var(--fs-${name})`;
          tokens.set(Math.round(parseFloat(getComputedStyle(probe).fontSize) * 10) / 10, name);
        }
        probe.remove();
        const off = new Set();
        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
        for (let n; (n = walker.nextNode());) {
          if (!n.textContent.trim()) continue;
          const el = n.parentElement;
          if (el.closest('.pin, .menu, .lightbox, [aria-hidden="true"]')) continue;
          const rect = el.getBoundingClientRect();
          if (!rect.width || getComputedStyle(el).visibility === 'hidden') continue;
          const fs = Math.round(parseFloat(getComputedStyle(el).fontSize) * 10) / 10;
          if (!tokens.has(fs)) off.add(`${fs}px ${el.tagName.toLowerCase()}.${[...el.classList].join('.')} "${n.textContent.trim().slice(0, 24)}"`);
        }
        return [...off];
      });
      assert.deepEqual(r, []);
    });
  });
}
