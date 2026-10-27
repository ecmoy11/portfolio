/* =====================================================================
   Load screen — "EMMA MOYSTNER" fills with orange as the page loads.

   Canvas 2D. No library, no font file, no network. The wordmark below is
   the outline of the name set in Lima (Jen Wagner Co.), emitted as integer
   font units with y already flipped screen-down and the baseline at 0, so
   Path2D reads it directly. All caps: Lima's plain E and M (Oct 2026;
   the earlier version used its quirky lowercase e and m as initials).

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

  var MARK = { d: 'M30 -700H481V-610H130V-400H442V-310H130V-90H481V0H30Z M1206 0H1106V-437L931 0H841L666 -437V0H566V-700H665L886 -162L1107 -700H1206Z M1946 0H1846V-437L1671 0H1581L1406 -437V0H1306V-700H1405L1626 -162L1847 -700H1946Z M2256 -700H2352L2607 0H2504L2452 -148H2156L2104 0H2001ZM2420 -238 2304 -566 2188 -238Z M3592 0H3492V-437L3317 0H3227L3052 -437V0H2952V-700H3051L3272 -162L3493 -700H3592Z M3657 -348Q3657 -522 3740 -615Q3822 -708 3975 -708Q4128 -708 4210 -615Q4293 -522 4293 -348Q4293 -174 4210 -80Q4128 13 3975 13Q3822 13 3740 -80Q3657 -174 3657 -348ZM3975 -77Q4078 -77 4133 -147Q4188 -217 4188 -348Q4188 -478 4133 -548Q4078 -618 3975 -618Q3872 -618 3817 -548Q3762 -478 3762 -348Q3762 -217 3817 -147Q3872 -77 3975 -77Z M4569 -264 4328 -700H4444L4618 -366L4794 -700H4910L4669 -264V0H4569Z M4930 -98 4992 -169Q5035 -126 5094 -102Q5152 -77 5213 -77Q5286 -77 5326 -104Q5365 -132 5365 -188Q5365 -221 5342 -244Q5320 -266 5286 -280Q5253 -295 5194 -315Q5119 -340 5072 -362Q5025 -385 4992 -426Q4958 -466 4958 -529Q4958 -615 5020 -662Q5081 -708 5195 -708Q5269 -708 5334 -680Q5398 -652 5437 -601L5365 -541Q5327 -577 5280 -598Q5234 -618 5188 -618Q5129 -618 5094 -596Q5059 -574 5059 -535Q5059 -500 5082 -476Q5105 -452 5140 -436Q5175 -421 5234 -401Q5309 -375 5355 -353Q5401 -331 5434 -291Q5466 -251 5466 -191Q5466 -92 5399 -40Q5332 13 5209 13Q5119 13 5046 -16Q4973 -45 4930 -98Z M5737 -610H5501V-700H6072V-610H5837V0H5737Z M6132 -700H6228L6560 -189V-700H6660V0H6564L6232 -511V0H6132Z M6760 -700H7211V-610H6860V-400H7172V-310H6860V-90H7211V0H6760Z M7700 -113Q7698 -154 7694 -192Q7688 -250 7658 -280Q7628 -310 7575 -310H7396V0H7296V-700H7619Q7712 -700 7762 -648Q7812 -597 7812 -502Q7812 -455 7788 -418Q7763 -382 7717 -362Q7756 -339 7774 -297Q7792 -255 7799 -192Q7803 -154 7805 -113Q7806 -102 7808 -66Q7811 -31 7816 0H7711Q7706 -31 7704 -66Q7701 -102 7700 -113ZM7600 -400Q7652 -400 7680 -426Q7707 -453 7707 -502Q7707 -554 7678 -582Q7650 -610 7597 -610H7396V-400Z', x0: 30, x1: 7816, top: -708, bot: 13 };

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
