// Browser helpers for the tests: one Chromium per call, software WebGL so the opening's
// shader runs headless, and the page's errors and requests collected on the page object.
import { chromium } from 'playwright';

export async function withPage(opts, fn) {
  const { width = 1440, height = 900, reducedMotion, javaScriptEnabled = true, args = [], storage, isMobile } = opts;
  const browser = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', ...args] });
  try {
    const context = await browser.newContext({
      viewport: { width, height },
      reducedMotion: reducedMotion || 'no-preference',
      javaScriptEnabled,
      hasTouch: Boolean(isMobile),
      isMobile: Boolean(isMobile),
    });
    if (storage) {
      await context.addInitScript((entries) => {
        for (const [k, v] of Object.entries(entries)) localStorage.setItem(k, v);
      }, storage);
    }
    const page = await context.newPage();
    page.pageErrors = [];
    page.requests = [];
    page.on('pageerror', (e) => page.pageErrors.push(e.message));
    page.on('request', (r) => page.requests.push(r.url()));
    return await fn(page);
  } finally {
    await browser.close();
  }
}

// Navigate and bring the page to its settled state: no transitions, every reveal shown,
// load sequence finished. Returns the navigation response.
export async function gotoSettled(page, url) {
  const response = await page.goto(url, { waitUntil: 'networkidle' });
  await page.addStyleTag({
    content: '*,*::before,*::after{transition:none!important;animation:none!important}' +
      '.js [data-reveal-image] .ph,.js [data-load-item],.js [data-reveal]{opacity:1!important;transform:none!important;clip-path:none!important}',
  });
  await page.evaluate(() => document.documentElement.classList.add('is-loaded'));
  await page.waitForTimeout(300);
  return response;
}
