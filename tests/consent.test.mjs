import { test, before, after } from 'node:test';
import assert from 'node:assert/strict';
import { startServer } from './helpers/server.mjs';
import { withPage } from './helpers/browser.mjs';

let server;
before(async () => { server = await startServer(); });
after(() => server.close());
const PIXEL = /connect\.facebook\.net\/en_US\/fbevents\.js/;
const pixelRequested = (page) => page.requests.some((u) => PIXEL.test(u));

test('banner on first visit', async () => {
  await withPage({}, async (page) => {
    await page.goto(server.url + '/', { waitUntil: 'load' });
    assert.ok(await page.isVisible('#consentBanner'));
  });
});

test('accept loads the pixel', async () => {
  await withPage({}, async (page) => {
    await page.goto(server.url + '/', { waitUntil: 'load' });
    assert.equal(pixelRequested(page), false, 'not before consent');
    await page.click('#consentAccept');
    await page.waitForTimeout(800);
    assert.ok(pixelRequested(page));
    assert.equal(await page.isVisible('#consentBanner'), false);
    assert.equal(await page.evaluate(() => localStorage.getItem('cookie-consent')), 'accepted');
  });
});

test('decline does not', async () => {
  await withPage({}, async (page) => {
    await page.goto(server.url + '/', { waitUntil: 'load' });
    await page.click('#consentDecline');
    await page.waitForTimeout(800);
    assert.equal(pixelRequested(page), false);
    assert.equal(await page.isVisible('#consentBanner'), false);
    assert.equal(await page.evaluate(() => localStorage.getItem('cookie-consent')), 'essential');
  });
});

test('remembered choice', async () => {
  await withPage({ storage: { 'cookie-consent': 'accepted' } }, async (page) => {
    await page.goto(server.url + '/', { waitUntil: 'load' });
    await page.waitForTimeout(500);
    assert.equal(await page.isVisible('#consentBanner'), false);
    assert.ok(pixelRequested(page));
  });
});

test('map loads without consent', async () => {
  await withPage({}, async (page) => {
    await page.goto(server.url + '/', { waitUntil: 'load' });
    const src = await page.$eval('.map iframe', (f) => f.getAttribute('src'));
    assert.match(src, /^https:\/\/www\.google\.com\/maps\/embed/);
  });
});
