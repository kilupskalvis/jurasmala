// Scroll stage: a pinned, full-screen sequence of photos. Scrolling moves through the frames;
// each frame slowly pushes in (or out) toward its own origin, and frames dissolve into each
// other through a drifting noise front with a thin band of mist, graded for dusk, with grain.
//
// Markup:
//   <section class="stage" data-stage>
//     <div class="stage-pin">
//       <div class="stage-media">
//         <img data-frame src="..." data-zoom="1 1.18" data-origin="0.5 0.6" alt="...">
//         ...
//       </div>
//       <div class="stage-shade"></div>
//       <div class="stage-caption" data-caption="0">...</div>
//     </div>
//   </section>
//
// Without WebGL (or with reduced motion) the <img> frames crossfade with CSS instead.
// The section exposes --p (0..1 progress) and fires 'stage:progress' events for extras.
(() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const MAX_TEX = innerWidth < 800 ? 1280 : 2048;

  const vert = 'attribute vec2 p; varying vec2 vUv; void main(){ vUv = p * 0.5 + 0.5; gl_Position = vec4(p, 0.0, 1.0); }';
  const frag = `
    precision highp float;
    varying vec2 vUv;
    uniform sampler2D uA, uB;
    uniform vec2 uSizeA, uSizeB, uOriginA, uOriginB, uRes;
    uniform float uMix, uZoomA, uZoomB, uTime, uWarm;

    float hash(vec2 p) { return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
    float noise(vec2 p) {
      vec2 i = floor(p), f = fract(p);
      vec2 u = f * f * (3.0 - 2.0 * f);
      return mix(mix(hash(i), hash(i + vec2(1, 0)), u.x), mix(hash(i + vec2(0, 1)), hash(i + vec2(1, 1)), u.x), u.y);
    }
    float fbm(vec2 p) { float v = 0.0, a = 0.5; for (int i = 0; i < 4; i++) { v += a * noise(p); p *= 2.03; a *= 0.5; } return v; }

    vec2 cover(vec2 uv, vec2 img) {
      float rc = uRes.x / uRes.y, ri = img.x / img.y;
      vec2 s = rc > ri ? vec2(1.0, ri / rc) : vec2(rc / ri, 1.0);
      return (uv - 0.5) * s + 0.5;
    }
    vec2 push(vec2 uv, float z, vec2 o) { return (uv - o) / z + o; }

    void main() {
      vec2 uv = vec2(vUv.x, 1.0 - vUv.y);
      float n = fbm(uv * vec2(2.4, 3.2) + vec2(uTime * 0.025, uTime * 0.01));
      // dissolve front sweeps upward from the bottom edge, broken up by the noise
      float front = uMix * 1.2 - 0.1;
      float field = n * 0.7 + (1.0 - uv.y) * 0.3;
      float t = smoothstep(field - 0.08, field + 0.08, front);
      float band = (1.0 - abs(t * 2.0 - 1.0)) * step(0.001, uMix) * step(uMix, 0.999);

      vec2 wob = vec2(n - 0.5, n - 0.5) * 0.025 * band;
      vec3 a = texture2D(uA, cover(push(uv, uZoomA, uOriginA) + wob, uSizeA)).rgb;
      vec3 b = texture2D(uB, cover(push(uv, uZoomB, uOriginB) - wob, uSizeB)).rgb;
      vec3 col = mix(a, b, t);

      // a thin band of sea mist where the front passes
      col = mix(col, vec3(0.88, 0.86, 0.80), band * 0.32);

      // dusk grade: cool, slightly green shadows, warm highlights
      float lum = dot(col, vec3(0.299, 0.587, 0.114));
      col = mix(col, col * vec3(0.84, 0.93, 0.90), smoothstep(0.5, 0.0, lum) * 0.55);
      col += vec3(0.06, 0.035, 0.0) * smoothstep(0.6, 1.0, lum) * uWarm;
      col = mix(vec3(lum), col, 0.9);

      float v = smoothstep(1.2, 0.3, length((uv - 0.5) * vec2(1.0, 1.3)));
      col *= mix(0.62, 1.0, v);
      col += (hash(uv * uRes + fract(uTime * 7.0) * 91.0) - 0.5) * 0.06;
      gl_FragColor = vec4(col, 1.0);
    }`;

  const clamp01 = (x) => Math.min(1, Math.max(0, x));
  const smooth = (a, b, x) => { const t = clamp01((x - a) / (b - a)); return t * t * (3 - 2 * t); };

  // the CSS shows a still opening until this class is set (styles.css)
  document.documentElement.classList.add('stage-on');

  document.querySelectorAll('[data-stage]').forEach((section) => {
    const media = section.querySelector('.stage-media');
    const frames = [...section.querySelectorAll('[data-frame]')];
    const captions = [...section.querySelectorAll('[data-caption]')];
    const n = frames.length;
    section.style.setProperty('--frames', n + 0.6);
    const cfg = frames.map((img) => {
      const [z0, z1] = (img.dataset.zoom || '1 1.12').split(' ').map(Number);
      const [ox, oy] = (img.dataset.origin || '0.5 0.5').split(' ').map(Number);
      return { z0, z1, ox, oy };
    });

    // Progress -> which pair of frames, how far through the dissolve, each frame's zoom
    const state = { i: 0, mix: 0, progress: 0 };
    const measure = () => {
      const r = section.getBoundingClientRect();
      const total = r.height - innerHeight;
      const p = total > 0 ? clamp01(-r.top / total) : 0;
      const pos = p * (n - 1);
      const i = Math.min(n - 2, Math.floor(pos));
      const f = pos - Math.max(0, i);
      state.progress = p;
      state.i = Math.max(0, i);
      state.mix = n > 1 ? smooth(0.42, 0.92, f) : 0;
      if (p >= 1) { state.i = n - 2; state.mix = 1; }
      section.style.setProperty('--p', p.toFixed(4));
      const active = n > 1 ? (state.mix > 0.5 ? state.i + 1 : state.i) : 0;
      captions.forEach((c) => c.classList.toggle('on', Number(c.dataset.caption) === active));
      frames.forEach((img, k) => img.classList.toggle('on', k === active));
      section.dispatchEvent(new CustomEvent('stage:progress', { detail: { p, active, pos } }));
    };
    const zoomOf = (k) => {
      // each frame pushes across the time it is on screen: from one step before to one after
      // (the first frame starts at rest at the top of the page, the last ends at rest)
      const pos = state.progress * (n - 1);
      const start = Math.max(0, k - 1), end = Math.min(n - 1, k + 1);
      const local = clamp01((pos - start) / (end - start));
      return cfg[k].z0 + (cfg[k].z1 - cfg[k].z0) * local;
    };

    let ticking = false;
    const onScroll = () => { if (!ticking) { ticking = true; requestAnimationFrame(() => { ticking = false; measure(); }); } };
    addEventListener('scroll', onScroll, { passive: true });
    addEventListener('resize', onScroll);
    measure();

    if (reduced) return;

    const build = () => {
      const canvas = document.createElement('canvas');
      canvas.setAttribute('aria-hidden', 'true');
      const gl = canvas.getContext('webgl', { antialias: false });
      if (!gl) return;
      const sh = (type, src) => { const s = gl.createShader(type); gl.shaderSource(s, src); gl.compileShader(s); if (!gl.getShaderParameter(s, gl.COMPILE_STATUS)) throw new Error(gl.getShaderInfoLog(s)); return s; };
      const prog = gl.createProgram();
      try { gl.attachShader(prog, sh(gl.VERTEX_SHADER, vert)); gl.attachShader(prog, sh(gl.FRAGMENT_SHADER, frag)); gl.linkProgram(prog); }
      catch (e) { console.warn('stage:', e); return; }
      gl.useProgram(prog);
      gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
      gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
      const loc = gl.getAttribLocation(prog, 'p');
      gl.enableVertexAttribArray(loc);
      gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
      const U = {};
      ['uA', 'uB', 'uSizeA', 'uSizeB', 'uOriginA', 'uOriginB', 'uRes', 'uMix', 'uZoomA', 'uZoomB', 'uTime', 'uWarm'].forEach((k) => { U[k] = gl.getUniformLocation(prog, k); });
      gl.uniform1i(U.uA, 0); gl.uniform1i(U.uB, 1);
      gl.uniform1f(U.uWarm, Number(section.dataset.warm || 1));

      // Downscale each photo once into a texture
      const textures = frames.map((img) => {
        const s = Math.min(1, MAX_TEX / img.naturalWidth);
        const c = document.createElement('canvas');
        c.width = Math.round(img.naturalWidth * s); c.height = Math.round(img.naturalHeight * s);
        c.getContext('2d').drawImage(img, 0, 0, c.width, c.height);
        const tex = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, tex);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGB, gl.RGB, gl.UNSIGNED_BYTE, c);
        return { tex, w: img.naturalWidth, h: img.naturalHeight };
      });
      // An upload can fail silently (out of memory); keep the plain photos then
      if (gl.getError() !== gl.NO_ERROR || gl.isContextLost()) return;

      const resize = () => {
        const dpr = Math.min(devicePixelRatio || 1, innerWidth < 800 ? 1 : 1.5);
        canvas.width = Math.round(media.clientWidth * dpr); canvas.height = Math.round(media.clientHeight * dpr);
        gl.viewport(0, 0, canvas.width, canvas.height);
        gl.uniform2f(U.uRes, canvas.width, canvas.height);
      };
      // If the GPU drops the context later, remove the canvas so the photo crossfade shows
      let lost = false;
      canvas.addEventListener('webglcontextlost', () => { lost = true; canvas.remove(); });
      media.appendChild(canvas);
      resize();
      addEventListener('resize', resize);

      let visible = true;
      new IntersectionObserver(([e]) => { visible = e.isIntersecting; }).observe(section);
      const t0 = performance.now();
      const draw = (now) => {
        if (lost) return;
        requestAnimationFrame(draw);
        if (!visible) return;
        const a = state.i, b = Math.min(n - 1, state.i + 1);
        gl.activeTexture(gl.TEXTURE0); gl.bindTexture(gl.TEXTURE_2D, textures[a].tex);
        gl.activeTexture(gl.TEXTURE1); gl.bindTexture(gl.TEXTURE_2D, textures[b].tex);
        gl.uniform2f(U.uSizeA, textures[a].w, textures[a].h);
        gl.uniform2f(U.uSizeB, textures[b].w, textures[b].h);
        gl.uniform2f(U.uOriginA, cfg[a].ox, cfg[a].oy);
        gl.uniform2f(U.uOriginB, cfg[b].ox, cfg[b].oy);
        gl.uniform1f(U.uZoomA, zoomOf(a));
        gl.uniform1f(U.uZoomB, zoomOf(b));
        gl.uniform1f(U.uMix, state.mix);
        gl.uniform1f(U.uTime, (now - t0) / 1000);
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        canvas.classList.add('on');
      };
      requestAnimationFrame(draw);
    };

    // Build after the page's load sequence, once every frame has decoded
    const ready = Promise.all(frames.map((img) => (img.complete && img.naturalWidth ? Promise.resolve() : new Promise((r) => { img.loading = 'eager'; img.addEventListener('load', r, { once: true }); }))));
    const loaded = new Promise((r) => (document.readyState === 'complete' ? r() : addEventListener('load', r, { once: true })));
    Promise.all([ready, loaded])
      .then(() => new Promise((r) => setTimeout(r, Number(section.dataset.delay || 1600))))
      .then(build);
  });
})();
