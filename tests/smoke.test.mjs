import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { startServer } from './helpers/server.mjs';
import { withPage } from './helpers/browser.mjs';

let server;
before(async () => { server = await startServer(); });
after(() => server.close());

test('home page loads without errors', async () => {
  await withPage({}, async (page) => {
    const res = await page.goto(server.url + '/', { waitUntil: 'networkidle' });
    assert.equal(res.status(), 200);
    assert.deepEqual(page.pageErrors, []);
    assert.match(await page.title(), /Jūrasmala/);
  });
});

test('unknown path returns 404 page', async () => {
  await withPage({}, async (page) => {
    const res = await page.goto(server.url + '/nav-tadas-lapas', { waitUntil: 'load' });
    assert.equal(res.status(), 404);
    assert.match(await page.textContent('body'), /Lapa nav atrasta/);
  });
});
