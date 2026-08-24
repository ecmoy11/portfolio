/* =====================================================================
   Load screen — "eMMA mOYSTNER" fills with orange as the page loads.

   Canvas 2D. No library, no font file, no network. The wordmark below is
   the outline of the name set in Lima (Jen Wagner Co.), emitted as integer
   font units with y already flipped screen-down and the baseline at 0, so
   Path2D reads it directly. Lowercase e and m are Lima's quirky glyphs,
   everything else is its plain caps.

   Rules it follows, in order of how much they matter:
     1. It can only ever hide the site for a moment. The overlay is created
        BY this script, so if the file fails to load there is no overlay at
        all — the site just renders. A separate timer in index.html removes
        it regardless, and cannot be taken down with this file.
     2. The water level is the real load progress, not a fake timer. It
        steps on DOM ready, fonts ready and window load, and eases between.
     3. Once per session. A recruiter opening four case studies sees it on
        arrival and never again.
     4. Any click, key, scroll or touch skips it.
     5. prefers-reduced-motion gets no load screen at all.
   ===================================================================== */
(function () {
  'use strict';

  var MIN_MS   = 850;    // do not flash past on a warm cache
  var MAX_MS   = 2200;   // never hold the site longer than this
  var CREAM    = '#FAF8F5';
  var ORANGE   = '#E15304';
  var PEACH    = 'rgba(255,213,187,0.85)';
  var MUTED    = '#A8A49C';

  var MARK = { d: 'M30 -221Q30 -263 48 -306Q65 -350 96 -385Q74 -434 74 -483Q74 -550 102 -601Q131 -652 181 -680Q231 -708 295 -708Q358 -708 412 -688Q465 -669 519 -626L459 -559Q412 -593 375 -606Q338 -618 293 -618Q239 -618 206 -584Q174 -550 174 -483Q174 -465 177 -447Q231 -473 290 -473Q339 -473 378 -455Q418 -437 440 -408Q463 -379 463 -347Q463 -289 424 -255Q384 -221 312 -221Q271 -221 228 -243Q185 -265 151 -302Q130 -266 130 -221Q130 -153 181 -109Q232 -65 322 -65Q370 -65 410 -80Q449 -94 497 -133L555 -70Q498 -21 442 2Q385 25 322 25Q231 25 165 -9Q99 -43 64 -100Q30 -156 30 -221ZM316 -311Q339 -311 351 -320Q363 -328 363 -344Q363 -362 345 -372Q327 -383 290 -383Q248 -383 213 -364Q233 -339 260 -325Q286 -311 316 -311Z M1275 0H1175V-437L1000 0H910L735 -437V0H635V-700H734L955 -162L1176 -700H1275Z M2015 0H1915V-437L1740 0H1650L1475 -437V0H1375V-700H1474L1695 -162L1916 -700H2015Z M2325 -700H2421L2676 0H2573L2521 -148H2225L2173 0H2070ZM2489 -238 2373 -566 2257 -238Z M3024 -207 3021 -700H3121L3123 -396Q3160 -508 3208 -578Q3256 -647 3304 -678Q3353 -708 3397 -708Q3466 -708 3507 -662Q3548 -615 3564 -497H3572Q3638 -497 3676 -472Q3714 -448 3732 -390Q3750 -332 3750 -231V0H3650V-231Q3650 -304 3642 -342Q3634 -380 3618 -394Q3601 -407 3572 -407Q3574 -351 3574 -314Q3574 -200 3540 -148Q3505 -97 3438 -97Q3377 -97 3342 -136Q3308 -175 3308 -251Q3308 -340 3352 -398Q3396 -457 3469 -481Q3464 -540 3454 -570Q3445 -599 3430 -608Q3416 -618 3393 -618Q3353 -618 3300 -562Q3247 -507 3198 -369Q3148 -231 3125 0H3025Q3025 -8 3024 -52Q3024 -97 3024 -207ZM3438 -187Q3451 -187 3458 -196Q3466 -205 3470 -232Q3474 -260 3474 -314L3473 -387Q3408 -351 3408 -251Q3408 -216 3416 -202Q3423 -187 3438 -187Z M3815 -348Q3815 -522 3898 -615Q3980 -708 4133 -708Q4286 -708 4368 -615Q4451 -522 4451 -348Q4451 -174 4368 -80Q4286 13 4133 13Q3980 13 3898 -80Q3815 -174 3815 -348ZM4133 -77Q4236 -77 4291 -147Q4346 -217 4346 -348Q4346 -478 4291 -548Q4236 -618 4133 -618Q4030 -618 3975 -548Q3920 -478 3920 -348Q3920 -217 3975 -147Q4030 -77 4133 -77Z M4727 -264 4486 -700H4602L4776 -366L4952 -700H5068L4827 -264V0H4727Z M5088 -98 5150 -169Q5193 -126 5252 -102Q5310 -77 5371 -77Q5444 -77 5484 -104Q5523 -132 5523 -188Q5523 -221 5500 -244Q5478 -266 5444 -280Q5411 -295 5352 -315Q5277 -340 5230 -362Q5183 -385 5150 -426Q5116 -466 5116 -529Q5116 -615 5178 -662Q5239 -708 5353 -708Q5427 -708 5492 -680Q5556 -652 5595 -601L5523 -541Q5485 -577 5438 -598Q5392 -618 5346 -618Q5287 -618 5252 -596Q5217 -574 5217 -535Q5217 -500 5240 -476Q5263 -452 5298 -436Q5333 -421 5392 -401Q5467 -375 5513 -353Q5559 -331 5592 -291Q5624 -251 5624 -191Q5624 -92 5557 -40Q5490 13 5367 13Q5277 13 5204 -16Q5131 -45 5088 -98Z M5895 -610H5659V-700H6230V-610H5995V0H5895Z M6290 -700H6386L6718 -189V-700H6818V0H6722L6390 -511V0H6290Z M6918 -700H7369V-610H7018V-400H7330V-310H7018V-90H7369V0H6918Z M7858 -113Q7856 -154 7852 -192Q7846 -250 7816 -280Q7786 -310 7733 -310H7554V0H7454V-700H7777Q7870 -700 7920 -648Q7970 -597 7970 -502Q7970 -455 7946 -418Q7921 -382 7875 -362Q7914 -339 7932 -297Q7950 -255 7957 -192Q7961 -154 7963 -113Q7964 -102 7966 -66Q7969 -31 7974 0H7869Q7864 -31 7862 -66Q7859 -102 7858 -113ZM7758 -400Q7810 -400 7838 -426Q7865 -453 7865 -502Q7865 -554 7836 -582Q7808 -610 7755 -610H7554V-400Z', x0: 30, x1: 7974, top: -708, bot: 25 };

  /* ---- bail-outs, cheapest first ---------------------------------- */
  try {
    if (window.matchMedia && matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    if (sessionStorage.getItem('em-load-seen') === '1') return;
    sessionStorage.setItem('em-load-seen', '1');
  } catch (e) { /* private mode: show it, that is the safe direction */ }

  /* ---- the overlay. Built here, so a failed fetch means no overlay -- */
  var root = document.createElement('div');
  root.id = 'em-loadscreen';
  root.setAttribute('aria-hidden', 'true');
  root.style.cssText =
    'position:fixed;inset:0;z-index:2147483000;background:' + CREAM + ';' +
    'opacity:1;transition:opacity .55s ease;pointer-events:auto';
  var cv = document.createElement('canvas');
  cv.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;display:block';
  root.appendChild(cv);
  (document.body || document.documentElement).appendChild(root);

  var ctx = cv.getContext('2d');
  var path = new Path2D(MARK.d);
  var W = 0, H = 0, DPR = 1;

  function size() {
    DPR = Math.min(window.devicePixelRatio || 1, 2);
    W = window.innerWidth; H = window.innerHeight;
    cv.width = Math.round(W * DPR); cv.height = Math.round(H * DPR);
  }
  size();
  addEventListener('resize', size);

  /* ---- progress ---------------------------------------------------
     "Ready" here means the page is PRESENTABLE, not that every byte has
     landed. window.load waits on every image on the page including the ones
     three screens down, which is far more than this screen is covering for.
     So: markup parsed, webfonts resolved, and the images that are actually
     above the fold decoded. Anything below the fold keeps loading behind it.
     ------------------------------------------------------------------ */
  var shown = 0, started = performance.now(), last = started, done = false;
  var domOK = false, fontOK = false;

  if (document.readyState !== 'loading') domOK = true;
  else document.addEventListener('DOMContentLoaded', function () { domOK = true; });
  try {
    if (document.fonts) document.fonts.ready.then(function () { fontOK = true; });
    else fontOK = true;
  } catch (e) { fontOK = true; }

  function aboveFoldImages() {
    var imgs = document.images, seen = 0, ready = 0;
    for (var i = 0; i < imgs.length; i++) {
      var r = imgs[i].getBoundingClientRect();
      if (r.top > H * 1.15) continue;                 // below the fold, not our problem
      seen++; if (imgs[i].complete) ready++;
    }
    return seen === 0 ? 1 : ready / seen;
  }
  function truth(elapsed) {
    var p = 0.10;
    if (domOK)  p += 0.30;
    if (fontOK) p += 0.20;
    if (domOK)  p += 0.40 * aboveFoldImages();
    // a floor so a stalled resource still reads as movement toward the
    // hand-over MAX_MS guarantees. It lags well behind, so it never leads.
    return Math.max(p, Math.min(0.90, elapsed / (MAX_MS * 1.5)));
  }

  /* ---- drawing ---------------------------------------------------- */
  function waveY(x, level, amp, k1, k2, t) {
    return level + Math.sin(x * k1 + t) * amp + Math.sin(x * k2 - t * 1.37) * amp * 0.45;
  }
  function pourInto(x0, x1, floor, level, amp, k1, k2, t, step) {
    ctx.beginPath();
    ctx.moveTo(x0, floor);
    for (var x = x0; x <= x1; x += step) ctx.lineTo(x, waveY(x, level, amp, k1, k2, t));
    ctx.lineTo(x1, waveY(x1, level, amp, k1, k2, t));
    ctx.lineTo(x1, floor);
    ctx.closePath();
    ctx.fill();
  }
  function draw(p, t) {
    ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
    ctx.clearRect(0, 0, W, H);

    var gw = MARK.x1 - MARK.x0, gh = MARK.bot - MARK.top;
    var scale = Math.min((W * 0.84) / gw, (H * 0.30) / gh);
    var ox = (W - gw * scale) / 2 - MARK.x0 * scale;
    var oy = (H - gh * scale) / 2 - MARK.top * scale;

    var amp = gh * (0.012 + 0.052 * (1 - (p < 0.5 ? 4*p*p*p : 1 - Math.pow(-2*p+2, 3) / 2)));
    var level = MARK.bot + amp * 2 - p * (gh + amp * 4);
    var k1 = Math.PI * 2 / (gh * 1.7), k2 = Math.PI * 2 / (gh * 0.62);

    ctx.save();
    ctx.translate(ox, oy); ctx.scale(scale, scale);
    ctx.fillStyle = 'rgba(225,83,4,0.16)';          // the mark, waiting
    ctx.fill(path);
    ctx.clip(path);
    ctx.fillStyle = PEACH;                           // the shallower swell
    pourInto(MARK.x0 - 400, MARK.x1 + 400, MARK.bot + 2000,
             level - amp * 0.55, amp * 0.8, k2, k1, t * 1.9 + 2.1, gh / 40);
    ctx.fillStyle = ORANGE;
    pourInto(MARK.x0 - 400, MARK.x1 + 400, MARK.bot + 2000, level, amp, k1, k2, t * 1.5, gh / 60);
    ctx.restore();

    var fs = Math.max(9, Math.min(13, H * 0.019));
    ctx.font = '500 ' + fs + 'px "JetBrains Mono", ui-monospace, monospace';
    ctx.textAlign = 'right';
    ctx.fillStyle = MUTED;
    ctx.fillText('loading… ' + ('00' + Math.round(p * 100)).slice(-3) + ' %',
                 ox + MARK.x1 * scale, oy + MARK.bot * scale + fs * 2.4);
  }

  function frame(now) {
    if (done) return;
    var elapsed = now - started;
    // Frame-rate independent: a time-constant ease with a floor rate, so a
    // slow device gets the same pacing as a fast one rather than a longer wait.
    var dt = Math.min(0.1, (now - last) / 1000); last = now;
    var target = truth(elapsed);
    // wall-clock, not per-frame: closes ~99% of the gap each second, with a
    // floor of 0.8/s. A 20fps phone and a 120Hz laptop get the same pacing.
    shown = Math.min(target, shown + Math.max((target - shown) * (1 - Math.pow(0.01, dt)), dt * 0.8));
    if (target >= 1 && shown > 0.995) shown = 1;
    draw(Math.min(shown, 1), now / 1000);
    if ((shown >= 1 && elapsed > MIN_MS) || elapsed > MAX_MS) return finish();
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);

  /* ---- exit ------------------------------------------------------- */
  function finish() {
    if (done) return;
    done = true;
    setTimeout(function () {                          // a beat at full, then gone
      if (!root) return;                              // the failsafe got there first
      root.style.opacity = '0';
      setTimeout(remove, 560);
    }, 200);
  }
  function remove() {
    if (root && root.parentNode) root.parentNode.removeChild(root);
    root = null;
  }
  window.__emLoadRemove = remove;                     // the failsafe in index.html calls this

  /* ---- skip ------------------------------------------------------- */
  ['pointerdown', 'keydown', 'wheel', 'touchstart'].forEach(function (ev) {
    addEventListener(ev, function once() {
      ['pointerdown', 'keydown', 'wheel', 'touchstart'].forEach(function (e2) {
        removeEventListener(e2, once);
      });
      done = true;
      if (root) { root.style.transition = 'opacity .28s ease'; root.style.opacity = '0'; }
      setTimeout(remove, 320);
    }, { passive: true });
  });
})();
