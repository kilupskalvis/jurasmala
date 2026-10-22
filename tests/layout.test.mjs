import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { startServer } from './helpers/server.mjs';
import { withPage, gotoSettled } from './helpers/browser.mjs';
import { findTextOverlaps, findOverflow } from './helpers/overlaps.mjs';

let server;
before(async () => { server = await startServer(); });
after(() => server.close());

for (const [width, height] of [[1920, 1080], [1440, 900], [1280, 800], [1024, 768]]) {
  test(`no overlaps or overflow on desktop ${width}x${height}`, async () => {
    await withPage({ width, height }, async (page) => {
      await gotoSettled(page, server.url + '/');
      assert.deepEqual(await findTextOverlaps(page), []);
      assert.deepEqual(await findOverflow(page), []);
    });
  });
}
