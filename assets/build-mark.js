/* =====================================================================
   BUILD MARK · adaptive ink
   ---------------------------------------------------------------------
   The hero band is one photo (mosaic-desert.webp) painted `cover`, so what
   sits under the bottom-right corner changes with the viewport. Emma, on
   gauge: full screen puts the mark on the pale sky and it needs to be
   black; narrower puts it on the red rock and it needs to be white.

   So: work out which pixels of the source image actually land under the
   mark, average their luminance, and pick the ink. Recomputed on resize.
   Everything degrades to the CSS default (white) if anything here is
   unavailable — no image, no canvas, a tainted read.

   Why not pure CSS. `mix-blend-mode:difference` adapts on its own but
   returns the inverse HUE, so the mark would go cyan over orange rock. A
   masked `backdrop-filter:invert()` would paint the pixel mosaic's noise
   into the letterforms. Both lose the clean two-colour mark.
   ===================================================================== */
(function () {
  var mark = document.querySelector('.csr-hero-mark');
  var hero = document.querySelector('.csr-hero');
  if (!mark || !hero || !window.requestAnimationFrame) return;

  var LIGHT_ON = 0.54;   // above this the backdrop is light -> ink goes dark
  var LIGHT_OFF = 0.46;  // below this it returns to white. The gap is
                         // hysteresis, so dragging a window edge across the
                         // boundary doesn't strobe the mark.
  var img = null;

  function bgUrl() {
    var m = /url\(["']?([^"')]+)["']?\)/.exec(getComputedStyle(hero).backgroundImage || '');
    return m ? m[1] : null;
  }

  /* the ::before scrim on .csr-hero--system lightens everything under it,
     so composite it in before judging */
  function scrim() {
    var c = getComputedStyle(hero, '::before').backgroundColor || '';
    var m = /rgba?\(\s*([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)(?:[,/\s]+([\d.]+))?/.exec(c);
    if (!m) return null;
    var a = m[4] === undefined ? 1 : parseFloat(m[4]);
    if (!a) return null;
    return { r: +m[1], g: +m[2], b: +m[3], a: a };
  }

  /* a background-position token -> px offset within the free space */
  function offset(token, free) {
    if (/%$/.test(token)) return free * (parseFloat(token) / 100);
    if (/px$/.test(token)) return parseFloat(token);
    return free / 2;
  }

  function measure() {
    var cs = getComputedStyle(hero);
    if (cs.backgroundSize !== 'cover') return null;

    var hb = hero.getBoundingClientRect();
    var mb = mark.getBoundingClientRect();
    if (!hb.width || !hb.height || !img.naturalWidth) return null;

    // replicate background-size:cover
    var scale = Math.max(hb.width / img.naturalWidth, hb.height / img.naturalHeight);
    var drawW = img.naturalWidth * scale, drawH = img.naturalHeight * scale;

    var pos = (cs.backgroundPosition || '50% 50%').split(/\s+/);
    var ox = offset(pos[0], hb.width - drawW);
    var oy = offset(pos[1] === undefined ? '50%' : pos[1], hb.height - drawH);

    // the mark's box in hero space, padded so we judge the neighbourhood
    // rather than a few stray pixels
    var pad = 6;
    var bx = mb.left - hb.left - pad, by = mb.top - hb.top - pad;
    var bw = mb.width + pad * 2, bh = mb.height + pad * 2;

    // -> source-image space
    var sx = (bx - ox) / scale, sy = (by - oy) / scale;
    var sw = bw / scale, sh = bh / scale;

    // clamp inside the bitmap
    sx = Math.max(0, Math.min(sx, img.naturalWidth - 1));
    sy = Math.max(0, Math.min(sy, img.naturalHeight - 1));
    sw = Math.max(1, Math.min(sw, img.naturalWidth - sx));
    sh = Math.max(1, Math.min(sh, img.naturalHeight - sy));

    var N = 16, cv = document.createElement('canvas');
    cv.width = cv.height = N;
    var ctx = cv.getContext('2d', { willReadFrequently: true });
    if (!ctx) return null;
    var px;
    try {
      ctx.drawImage(img, sx, sy, sw, sh, 0, 0, N, N);
      px = ctx.getImageData(0, 0, N, N).data;
    } catch (e) {
      return null;               // tainted canvas; keep the CSS default
    }

    var sc = scrim(), sum = 0;
    for (var i = 0; i < px.length; i += 4) {
      var r = px[i], g = px[i + 1], b = px[i + 2];
      if (sc) {
        r = r * (1 - sc.a) + sc.r * sc.a;
        g = g * (1 - sc.a) + sc.g * sc.a;
        b = b * (1 - sc.a) + sc.b * sc.a;
      }
      sum += (0.2126 * r + 0.7152 * g + 0.0722 * b) / 255;
    }
    return sum / (N * N);
  }

  function apply() {
    var L = measure();
    if (L === null) return;
    var isLight = mark.classList.contains('on-light');
    if (!isLight && L > LIGHT_ON) mark.classList.add('on-light');
    else if (isLight && L < LIGHT_OFF) mark.classList.remove('on-light');
    mark.dataset.luma = L.toFixed(3);   // handy when checking this by hand
  }

  var queued = false;
  function schedule() {
    if (queued) return;
    queued = true;
    requestAnimationFrame(function () { queued = false; apply(); });
  }

  var src = bgUrl();
  if (!src) return;
  img = new Image();
  img.decoding = 'async';
  img.onload = schedule;
  img.src = src;
  if (img.complete && img.naturalWidth) schedule();

  addEventListener('resize', schedule);
  addEventListener('load', schedule);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(schedule);
})();
