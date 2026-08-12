/* =====================================================================
   case-study.js  ·  shared behaviour for every case study page
   ---------------------------------------------------------------------
   Loaded by airline-2036, solace, coros, airbnb, gauge and capstone.
   Everything here is template-level. Anything bespoke to a single study
   (the COROS Final Designs layout editor, for one) stays inline on that
   page.
   ===================================================================== */
(function () {
  'use strict';

  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)');

  /* ---------------------------------------------------------------
     1 · Mobile nav
     The hamburger calls toggleMobileMenu() inline, so this has to be
     a global. Every case study page was calling it without ever
     defining it, which left the mobile menu dead.
     --------------------------------------------------------------- */
  window.toggleMobileMenu = function () {
    var btn = document.getElementById('mobile-menu-toggle');
    var overlay = document.getElementById('mobile-nav-overlay');
    if (!btn || !overlay) return;
    btn.classList.toggle('open');
    overlay.classList.toggle('open');
    document.body.style.overflow = overlay.classList.contains('open') ? 'hidden' : '';
  };

  /* close the overlay when a link inside it is followed */
  document.addEventListener('click', function (e) {
    var overlay = document.getElementById('mobile-nav-overlay');
    if (!overlay || !overlay.classList.contains('open')) return;
    if (e.target.closest('#mobile-nav-overlay a')) window.toggleMobileMenu();
  });

  /* ---------------------------------------------------------------
     2 · Nav shadow on scroll
     --------------------------------------------------------------- */
  var nav = document.getElementById('nav');
  function navState() {
    if (nav) nav.classList.toggle('scrolled', window.scrollY > 10);
  }

  /* ---------------------------------------------------------------
     3 · Drifting media columns
     Any .pcol inside a group marked [data-drift] moves at its own
     rate as the group crosses the viewport. This is what makes the
     sticky opener and the Final Designs finale feel alive without
     anything fading in or out.
     --------------------------------------------------------------- */
  var driftGroups = [].slice.call(document.querySelectorAll('[data-drift]'));

  /* A group marked data-drift-anchor="sticky" holds still until its own top
     reaches the point where its partner text column pins, then starts to
     drift. That keeps the first figure level with the section heading for the
     whole approach, which is the only moment the alignment is legible. The
     default centre-anchored behaviour is already in motion when you arrive. */
  function anchorOffset(group) {
    var partner = group.parentElement &&
      group.parentElement.querySelector('.cs-fd-text, [data-drift-partner]');
    if (!partner) return 0;
    var top = getComputedStyle(partner).top;
    var v = parseFloat(top);
    return isNaN(v) ? 0 : v;
  }

  function drift() {
    if (reduce.matches) return;
    driftGroups.forEach(function (group) {
      var r = group.getBoundingClientRect();
      if (r.bottom < -200 || r.top > window.innerHeight + 200) return;
      var t;
      if (group.getAttribute('data-drift-anchor') === 'sticky') {
        t = Math.max(0, (anchorOffset(group) - r.top) / window.innerHeight);
      } else {
        t = (window.innerHeight / 2 - (r.top + r.height / 2)) / window.innerHeight;
      }
      var amp = parseFloat(group.getAttribute('data-drift')) || 170;
      [].slice.call(group.querySelectorAll('.pcol')).forEach(function (c) {
        var rate = parseFloat(c.getAttribute('data-rate')) || 0;
        c.style.transform = 'translateY(' + (t * rate * amp).toFixed(1) + 'px)';
      });
    });
  }

  /* ---------------------------------------------------------------
     4 · Cursor tilt
     Lifted from the About hero photo. Applies to every .tiltwrap on
     the page, so a study only has to use the markup to get it.
     --------------------------------------------------------------- */
  /* ---------------------------------------------------------------
     7 · Before/after comparison slider
     Any [data-compare] block becomes draggable. Pointer events cover
     mouse, touch and pen in one path. Keyboard: arrows nudge, Home/End
     jump to either extreme, so it isn't mouse-only.
     --------------------------------------------------------------- */
  /* ---------------------------------------------------------------
     8 · Filmstrip + lightbox
     A filmstrip is a horizontally snapping row of frames. Clicking one
     opens the lightbox at full height, which is the only way tall
     screens with real content in them stay readable on the page.
     --------------------------------------------------------------- */
  function buildLightbox() {
    var lb = document.querySelector('.cs-lightbox');
    if (lb) return lb;
    lb = document.createElement('div');
    lb.className = 'cs-lightbox';
    lb.setAttribute('role', 'dialog');
    lb.setAttribute('aria-modal', 'true');
    lb.setAttribute('aria-label', 'Enlarged screen');
    lb.innerHTML =
      '<button class="cs-lightbox-btn is-close" aria-label="Close">&times;</button>' +
      '<button class="cs-lightbox-btn is-prev" aria-label="Previous">&#8249;</button>' +
      '<img alt="">' +
      '<video controls playsinline loop></video>' +
      '<button class="cs-lightbox-btn is-next" aria-label="Next">&#8250;</button>' +
      '<div class="cs-lightbox-cap"></div>';
    document.body.appendChild(lb);
    return lb;
  }

  function bindFilmstrips() {
    var strips = [].slice.call(document.querySelectorAll('.cs-filmstrip'));
    if (!strips.length) return;
    var lb = buildLightbox();
    var lbImg = lb.querySelector('img');
    var lbCap = lb.querySelector('.cs-lightbox-cap');
    var group = [], idx = 0, lastFocus = null;

    function show(i) {
      if (!group.length) return;
      idx = (i + group.length) % group.length;
      var f = group[idx];
      lbImg.src = f.getAttribute('data-full') || f.querySelector('img').src;
      lbImg.alt = f.querySelector('img').alt || '';
      lbCap.textContent = (f.getAttribute('data-caption') || '') +
        '   ' + (idx + 1) + ' / ' + group.length;
    }
    function open(frames, i) {
      group = frames; lastFocus = document.activeElement;
      show(i);
      lb.classList.add('is-open');
      document.body.classList.add('cs-lightbox-open');
      lb.querySelector('.is-close').focus();
    }
    function close() {
      lb.classList.remove('is-open');
      document.body.classList.remove('cs-lightbox-open');
      lbImg.removeAttribute('src');
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    }

    lb.querySelector('.is-close').addEventListener('click', close);
    lb.querySelector('.is-prev').addEventListener('click', function (e) { e.stopPropagation(); show(idx - 1); });
    lb.querySelector('.is-next').addEventListener('click', function (e) { e.stopPropagation(); show(idx + 1); });
    lb.addEventListener('click', function (e) { if (e.target === lb || e.target === lbImg) close(); });
    document.addEventListener('keydown', function (e) {
      if (!lb.classList.contains('is-open')) return;
      if (e.key === 'Escape') { e.preventDefault(); close(); }
      else if (e.key === 'ArrowLeft') { e.preventDefault(); show(idx - 1); }
      else if (e.key === 'ArrowRight') { e.preventDefault(); show(idx + 1); }
    });

    strips.forEach(function (strip) {
      if (strip.dataset.stripBound) return;
      strip.dataset.stripBound = '1';
      var frames = [].slice.call(strip.querySelectorAll('.cs-frame'));

      frames.forEach(function (f, i) {
        f.setAttribute('tabindex', '0');
        f.setAttribute('role', 'button');
        f.addEventListener('click', function () { open(frames, i); });
        f.addEventListener('keydown', function (e) {
          if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(frames, i); }
        });
      });

      var wrap = strip.closest('.cs-filmstrip-wrap');
      if (!wrap) return;
      var prev = wrap.querySelector('.cs-strip-btn.is-prev');
      var next = wrap.querySelector('.cs-strip-btn.is-next');
      if (!prev || !next) return;

      function step() {
        var f = strip.querySelector('.cs-frame');
        return f ? f.getBoundingClientRect().width + 20 : 210;
      }
      function sync() {
        var max = strip.scrollWidth - strip.clientWidth - 2;
        prev.disabled = strip.scrollLeft <= 2;
        next.disabled = strip.scrollLeft >= max;
      }
      prev.addEventListener('click', function () { strip.scrollBy({ left: -step() * 2, behavior: 'smooth' }); });
      next.addEventListener('click', function () { strip.scrollBy({ left: step() * 2, behavior: 'smooth' }); });
      strip.addEventListener('scroll', sync);
      window.addEventListener('resize', sync);
      sync();
    });
  }

  function bindCompare() {
    [].slice.call(document.querySelectorAll('[data-compare]')).forEach(function (box) {
      if (box.dataset.compareBound) return;
      box.dataset.compareBound = '1';

      var pct = parseFloat(box.dataset.compare) || 50;
      var dragging = false;

      function paint() {
        box.style.setProperty('--x', pct.toFixed(2) + '%');
        box.setAttribute('aria-valuenow', Math.round(pct));
      }
      function fromEvent(e) {
        var r = box.getBoundingClientRect();
        if (!r.width) return;
        pct = Math.max(0, Math.min(100, ((e.clientX - r.left) / r.width) * 100));
        paint();
      }

      box.setAttribute('role', 'slider');
      box.setAttribute('tabindex', '0');
      box.setAttribute('aria-valuemin', '0');
      box.setAttribute('aria-valuemax', '100');
      box.setAttribute('aria-label', box.dataset.compareLabel || 'Compare the two versions');
      paint();

      box.addEventListener('pointerdown', function (e) {
        dragging = true;
        if (box.setPointerCapture) { try { box.setPointerCapture(e.pointerId); } catch (err) {} }
        fromEvent(e);
      });
      box.addEventListener('pointermove', function (e) {
        if (!dragging) return;
        e.preventDefault();
        fromEvent(e);
      });
      ['pointerup', 'pointercancel'].forEach(function (evt) {
        box.addEventListener(evt, function () { dragging = false; });
      });

      box.addEventListener('keydown', function (e) {
        var step = e.shiftKey ? 10 : 3, hit = true;
        if (e.key === 'ArrowLeft' || e.key === 'ArrowDown') pct = Math.max(0, pct - step);
        else if (e.key === 'ArrowRight' || e.key === 'ArrowUp') pct = Math.min(100, pct + step);
        else if (e.key === 'Home') pct = 0;
        else if (e.key === 'End') pct = 100;
        else hit = false;
        if (hit) { e.preventDefault(); paint(); }
      });
    });
  }

  /* ---------------------------------------------------------------
     8b · Click any [data-zoom] figure to see it full size
     The filmstrip lightbox above only knows about .cs-filmstrip frames
     and only handles images. Solace's artefacts are wide diagrams and a
     screen recording sitting in a 567px media column, deliberately too
     small to read in place, so they need a way out. Any element carrying
     data-zoom becomes clickable; siblings inside the same data-zoom-group
     become the prev/next set. Opt-in, so no existing page changes.
     --------------------------------------------------------------- */
  function bindZoom() {
    var items = [].slice.call(document.querySelectorAll('[data-zoom]'));
    if (!items.length) return;

    var lb = buildLightbox();
    var lbImg = lb.querySelector('img');
    var lbVid = lb.querySelector('video');
    var lbCap = lb.querySelector('.cs-lightbox-cap');
    var group = [], idx = 0, lastFocus = null;

    function media(el) { return el.matches('img,video') ? el : el.querySelector('img,video'); }

    function show(i) {
      if (!group.length) return;
      idx = (i + group.length) % group.length;
      var m = media(group[idx]);
      var isVid = m.tagName === 'VIDEO';
      lbVid.pause();
      /* '' would fall back to the stylesheet, which hides the video by
         default. Set an explicit value on both. */
      lbImg.style.display = isVid ? 'none' : 'block';
      lbVid.style.display = isVid ? 'block' : 'none';
      if (isVid) {
        /* carry the source's dimensions over so the lightbox reserves the right
           box before metadata lands; an empty <video> otherwise defaults to
           300x150 and the frame jumps when it loads */
        if (m.getAttribute('width')) lbVid.width = m.getAttribute('width');
        if (m.getAttribute('height')) lbVid.height = m.getAttribute('height');
        lbVid.src = m.currentSrc || m.src;
        lbVid.play().catch(function(){});
      }
      else { lbImg.src = m.currentSrc || m.src; lbImg.alt = m.alt || ''; }
      var cap = group[idx].getAttribute('data-caption') || m.getAttribute('alt') ||
                m.getAttribute('aria-label') || '';
      lbCap.textContent = group.length > 1 ? cap + '   ' + (idx + 1) + ' / ' + group.length : cap;
      lb.querySelector('.is-prev').style.display = group.length > 1 ? '' : 'none';
      lb.querySelector('.is-next').style.display = group.length > 1 ? '' : 'none';
    }
    function open(frames, i) {
      group = frames; lastFocus = document.activeElement;
      show(i);
      lb.classList.add('is-open');
      document.body.classList.add('cs-lightbox-open');
      lb.querySelector('.is-close').focus();
    }
    function close() {
      lb.classList.remove('is-open');
      document.body.classList.remove('cs-lightbox-open');
      lbVid.pause(); lbVid.removeAttribute('src'); lbImg.removeAttribute('src');
      lbImg.style.display = 'block'; lbVid.style.display = 'none';
      if (lastFocus && lastFocus.focus) lastFocus.focus();
    }

    if (!lb.dataset.zoomBound) {
      lb.dataset.zoomBound = '1';
      lb.querySelector('.is-close').addEventListener('click', close);
      lb.querySelector('.is-prev').addEventListener('click', function (e) { e.stopPropagation(); show(idx - 1); });
      lb.querySelector('.is-next').addEventListener('click', function (e) { e.stopPropagation(); show(idx + 1); });
      /* clicking the backdrop closes; clicking the video itself must not, or
         you cannot touch its controls */
      lb.addEventListener('click', function (e) { if (e.target === lb || e.target === lbImg) close(); });
      document.addEventListener('keydown', function (e) {
        if (!lb.classList.contains('is-open')) return;
        if (e.key === 'Escape') { e.preventDefault(); close(); }
        else if (e.key === 'ArrowLeft') { e.preventDefault(); show(idx - 1); }
        else if (e.key === 'ArrowRight') { e.preventDefault(); show(idx + 1); }
      });
    }

    items.forEach(function (el) {
      if (el.dataset.zoomBound) return;
      el.dataset.zoomBound = '1';
      var g = el.getAttribute('data-zoom-group');
      var frames = g
        ? [].slice.call(document.querySelectorAll('[data-zoom-group="' + g + '"]'))
        : [el];
      el.setAttribute('tabindex', '0');
      el.setAttribute('role', 'button');
      if (!el.getAttribute('aria-label')) el.setAttribute('aria-label', 'Enlarge');
      el.addEventListener('click', function () { open(frames, frames.indexOf(el)); });
      el.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(frames, frames.indexOf(el)); }
      });
    });
  }

  function bindTilt() {
    if (reduce.matches) return;
    [].slice.call(document.querySelectorAll('.tiltwrap')).forEach(function (wrap) {
      if (wrap.dataset.tiltBound) return;
      var img = wrap.querySelector('.tilt');
      if (!img) return;
      wrap.dataset.tiltBound = '1';
      wrap.addEventListener('mousemove', function (e) {
        var rect = img.getBoundingClientRect();
        var dx = (e.clientX - (rect.left + rect.width / 2)) / (rect.width / 2);
        var dy = (e.clientY - (rect.top + rect.height / 2)) / (rect.height / 2);
        var rotY = Math.max(-5, Math.min(5, dx * 6));
        var rotX = Math.max(-5, Math.min(5, -dy * 6));
        img.style.transform = 'rotateX(' + rotX + 'deg) rotateY(' + rotY + 'deg)';
      });
      wrap.addEventListener('mouseleave', function () {
        img.style.transform = 'rotateX(0deg) rotateY(0deg)';
      });
    });
  }

  /* ---------------------------------------------------------------
     5 · Final Designs progressive disclosure
     Titles never move or fade. One body is open at a time, chosen by
     how far through the media canvas you are, so scrolling back up
     reopens the previous one. Clicking a title pins it, which is the
     escape hatch for anyone scrolling faster than they can read.
     --------------------------------------------------------------- */
  function bindFinalDesigns(fd) {
    var media = fd.querySelector('.cs-fd-media') || fd;
    var blocks = [].slice.call(fd.querySelectorAll('.cs-fd-block[data-fd-step]'));
    if (!blocks.length) return null;

    var narrow = window.matchMedia('(max-width:1100px)');
    var pinned = null;

    function mark(el, on) {
      el.classList.toggle('is-open', on);
      var lab = el.querySelector('.cs-section-label');
      if (lab) lab.setAttribute('aria-expanded', on ? 'true' : 'false');
    }
    function activate(i) { blocks.forEach(function (b, k) { mark(b, k === i); }); }
    function openAll() { blocks.forEach(function (b) { mark(b, true); }); }

    function current() {
      var r = media.getBoundingClientRect();
      if (!r.height) return 0;
      /* 0 when the canvas top reaches mid-screen, 1 at its bottom */
      var p = (window.innerHeight * 0.5 - r.top) / r.height;
      p = Math.max(0, Math.min(0.99999, p));
      return Math.floor(p * blocks.length);
    }

    function update() {
      if (reduce.matches || narrow.matches) { openAll(); return; }
      activate(pinned === null ? current() : pinned);
    }

    blocks.forEach(function (b, i) {
      var lab = b.querySelector('.cs-section-label');
      if (!lab) return;
      function toggle() {
        if (narrow.matches || reduce.matches) return;
        pinned = (pinned === i) ? null : i;  /* click the open one again to hand control back to scroll */
        update();
      }
      lab.addEventListener('click', toggle);
      lab.addEventListener('keydown', function (e) {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); }
      });
    });

    if (narrow.addEventListener) narrow.addEventListener('change', update);
    return update;
  }

  var fdUpdaters = [].slice.call(document.querySelectorAll('.cs-fd'))
    .map(bindFinalDesigns)
    .filter(Boolean);

  /* ---------------------------------------------------------------
     6 · One rAF loop for all of it
     --------------------------------------------------------------- */
  var pending = false;
  function frame() {
    drift();
    navState();
    fdUpdaters.forEach(function (fn) { fn(); });
    pending = false;
  }
  function onScroll() {
    if (pending) return;
    pending = true;
    requestAnimationFrame(frame);
  }

  document.addEventListener('scroll', onScroll, true);
  window.addEventListener('resize', onScroll);
  window.addEventListener('load', function () { bindTilt(); bindCompare(); bindFilmstrips(); bindZoom(); frame(); });

  bindTilt();
  bindCompare();
  bindFilmstrips();
  bindZoom();
  frame();
})();

/* ---------------------------------------------------------------------
   Connect dropdown. The nav markup calls toggleConnectDropdown() inline,
   the same way the hamburger calls toggleMobileMenu(), so it has to hang
   off window. index.html has its own copy; this is the case-study one.
   --------------------------------------------------------------------- */
window.toggleConnectDropdown = function (e) {
  if (e) { e.preventDefault(); e.stopPropagation(); }
  var dropdown = document.getElementById('connect-dropdown');
  if (dropdown) dropdown.classList.toggle('open');
};

document.addEventListener('click', function (e) {
  var dropdown = document.getElementById('connect-dropdown');
  if (dropdown && !e.target.closest('.nav-connect-wrap')) dropdown.classList.remove('open');
});
