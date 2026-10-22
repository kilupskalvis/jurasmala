// Layout checks shared by the tests (ported from the mockup audit scripts in .plans/).

// In-flow text that overlaps other text, measured per line box. Call on a settled page
// (gotoSettled). Fixed and sticky layers and the opening stage are skipped: they overlap
// content by design and are checked by findStageOverlaps.
export function findTextOverlaps(page) {
  return page.evaluate(() => {
    const skip = (el) => {
      for (let e = el; e && e !== document.body; e = e.parentElement) {
        const cs = getComputedStyle(e);
        if (cs.position === 'fixed' || cs.position === 'sticky' || cs.display === 'none' || cs.visibility === 'hidden') return true;
        if (e.matches('.menu, .lightbox, .stage, [aria-hidden="true"]')) return true;
      }
      return false;
    };
    const boxes = [];
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    for (let n; (n = walker.nextNode());) {
      if (!n.textContent.trim()) continue;
      const el = n.parentElement;
      if (skip(el)) continue;
      const r = document.createRange();
      r.selectNodeContents(n);
      for (const rc of r.getClientRects()) {
        if (rc.width < 2 || rc.height < 2) continue;
        boxes.push({ el, text: n.textContent.trim().slice(0, 36), l: rc.left, r: rc.right, t: rc.top + scrollY, b: rc.bottom + scrollY });
      }
    }
    const name = (el) => `${el.tagName.toLowerCase()}${typeof el.className === 'string' && el.className ? '.' + el.className.trim().split(/\s+/).join('.') : ''}`;
    const out = new Set();
    for (let i = 0; i < boxes.length; i++) for (let j = i + 1; j < boxes.length; j++) {
      const a = boxes[i], b = boxes[j];
      if (a.el === b.el) continue;
      const ox = Math.min(a.r, b.r) - Math.max(a.l, b.l);
      const oy = Math.min(a.b, b.b) - Math.max(a.t, b.t);
      if (ox > 3 && oy > Math.min(a.b - a.t, b.b - b.t) * 0.3) out.add(`${name(a.el)} "${a.text}" x ${name(b.el)} "${b.text}"`);
    }
    return [...out];
  });
}

// Text running outside the viewport horizontally (swipe strips excluded), plus page-level
// horizontal scrolling.
export function findOverflow(page) {
  return page.evaluate(() => {
    const out = [];
    if (document.documentElement.scrollWidth > innerWidth + 1) out.push(`page scrolls sideways: ${document.documentElement.scrollWidth} > ${innerWidth}`);
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    for (let n; (n = walker.nextNode());) {
      if (!n.textContent.trim()) continue;
      const el = n.parentElement;
      if (el.closest('.strip, .menu, .lightbox, [aria-hidden="true"]') || getComputedStyle(el).visibility === 'hidden') continue;
      const r = document.createRange();
      r.selectNodeContents(n);
      for (const rc of r.getClientRects()) {
        if (rc.width < 2) continue;
        if (rc.left < -1 || rc.right > innerWidth + 1) out.push(`"${n.textContent.trim().slice(0, 36)}" spans ${Math.round(rc.left)}..${Math.round(rc.right)}`);
      }
    }
    return out;
  });
}

// Overlaps in the opening and in fixed/sticky layers while scrolling with real transitions.
// Call after a normal page.goto (not gotoSettled). Big display type counts its descender.
export async function findStageOverlaps(page, { step = 120 } = {}) {
  await page.waitForTimeout(2200);
  const total = await page.evaluate(() => document.documentElement.scrollHeight);
  const seen = new Set();
  for (let y = 0; y < total; y += step) {
    await page.evaluate((top) => scrollTo(0, top), y);
    await page.waitForTimeout(260);
    const hits = await page.evaluate(() => {
      const opacity = (el) => { let o = 1; for (let e = el; e; e = e.parentElement) o *= parseFloat(getComputedStyle(e).opacity); return o; };
      const hidden = (el) => { for (let e = el; e; e = e.parentElement) { const cs = getComputedStyle(e); if (cs.display === 'none' || cs.visibility === 'hidden' || e.matches?.('.menu, .lightbox')) return true; } return false; };
      const layer = (el) => { for (let e = el; e; e = e.parentElement) { const p = getComputedStyle(e).position; if (p === 'fixed' || p === 'sticky') return e; } return null; };
      const boxes = [];
      const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
      for (let n; (n = walker.nextNode());) {
        if (!n.textContent.trim()) continue;
        const el = n.parentElement;
        if (hidden(el) || opacity(el) < 0.05) continue;
        const r = document.createRange();
        r.selectNodeContents(n);
        const cs = getComputedStyle(el);
        const fs = parseFloat(cs.fontSize);
        const extra = fs > 40 ? Math.max(0, fs * 0.18 - (parseFloat(cs.paddingBottom) || 0)) : 0;
        for (const rc of r.getClientRects()) {
          if (rc.bottom < 0 || rc.top > innerHeight || rc.width < 2) continue;
          boxes.push({ el, layer: layer(el), text: n.textContent.trim().slice(0, 30), l: rc.left, r: rc.right, t: rc.top, b: rc.bottom + extra });
        }
      }
      const covers = (x) => x && getComputedStyle(x).backgroundColor !== 'rgba(0, 0, 0, 0)';
      const nm = (el) => `${el.tagName.toLowerCase()}.${[...el.classList].join('.')}`;
      const out = [];
      for (let i = 0; i < boxes.length; i++) for (let j = i + 1; j < boxes.length; j++) {
        const a = boxes[i], b = boxes[j];
        if (a.el === b.el || a.el.contains(b.el) || b.el.contains(a.el)) continue;
        if (!a.layer && !b.layer) continue;
        if (a.layer !== b.layer && (covers(a.layer) || covers(b.layer))) continue;
        const ox = Math.min(a.r, b.r) - Math.max(a.l, b.l);
        const oy = Math.min(a.b, b.b) - Math.max(a.t, b.t);
        if (ox > 2 && oy > 2) out.push(`${nm(a.el)} "${a.text}" x ${nm(b.el)} "${b.text}"`);
      }
      return out;
    });
    hits.forEach((h) => seen.add(h));
  }
  return [...seen];
}
