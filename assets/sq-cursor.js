/* Square cursor. One file, every page: <script src="assets/sq-cursor.js" defer></script>
   Desktop mice only. Touch, pen and reduced-motion keep the system cursor.
   Brings its own CSS and markup so a page needs nothing else. */
(function () {
  if (window.__sqCursor) return;
  window.__sqCursor = true;
  var fine = window.matchMedia('(hover: hover) and (pointer: fine)');
  var calm = window.matchMedia('(prefers-reduced-motion: reduce)');
  if (!fine.matches || calm.matches) return;

  var css =
    'html.has-sq-cursor,html.has-sq-cursor *{cursor:none !important;}' +
    '.sq-cursor{position:fixed;top:0;left:0;z-index:2147483000;pointer-events:none;' +
      'display:flex;align-items:center;gap:10px;opacity:0;transition:opacity .2s ease-out;will-change:transform;}' +
    '.sq-cursor.is-on{opacity:1;}' +
    '.sq-dot{width:8px;height:8px;flex-shrink:0;background:var(--orange,#E15304);' +
      'transition:width .12s ease-out,height .12s ease-out;}' +
    '.sq-cursor.is-text .sq-dot{width:2px;height:20px;}' +
    '.sq-label{font-family:var(--font-mono,"JetBrains Mono",monospace);font-size:12px;font-weight:500;' +
      'letter-spacing:.12em;text-transform:uppercase;color:var(--orange,#E15304);white-space:nowrap;' +
      'opacity:0;transform:translateX(-4px);transition:opacity .15s ease-out,transform .15s ease-out;}' +
    '.sq-cursor.is-label .sq-label{opacity:1;transform:none;}' +
    /* over an orange surface the square (and its label) go white */
    '.sq-cursor.on-orange .sq-dot{background:#fff;}' +
    '.sq-cursor.on-orange .sq-label{color:#fff;}';

  function init() {
    var style = document.createElement('style');
    style.id = 'sq-cursor-css';
    style.textContent = css;
    document.head.appendChild(style);

    var el = document.createElement('div');
    el.className = 'sq-cursor';
    el.setAttribute('aria-hidden', 'true');
    el.innerHTML = '<span class="sq-dot"></span><span class="sq-label"></span>';
    document.body.appendChild(el);
    var label = el.querySelector('.sq-label');
    document.documentElement.classList.add('has-sq-cursor');

    var TEXT = 'h1,h2,h3,h4,p,li,blockquote,figcaption,.hero-eyebrow';
    var LINK = 'a,button,[role="button"],input,select,textarea,label,summary';
    /* the system cursor used to carry these hints; the label carries them now */
    var LABELS = [
      ['.work-tile', 'View project'],
      ['.cs-compare', 'Drag'],
      ['.gx-tile', 'Expand'],
      ['[data-zoom],.cs-frame,.cs-ab-shot', 'Zoom']
    ];

    /* Orange = the first opaque background found walking up from the element under
       the pointer is close to the brand orange. Canvas/video/images can't be read this
       way, so anything painted orange can opt in with data-cursor="light". */
    function isOrange(c) {
      var m = c && c.match(/rgba?\(([\d.]+),\s*([\d.]+),\s*([\d.]+)(?:,\s*([\d.]+))?/);
      if (!m) return null;                       // not a colour we can read
      if (m[4] !== undefined && +m[4] < 0.5) return null;  // see-through, keep walking
      var r = +m[1], g = +m[2], b = +m[3];
      return r > 190 && g > 50 && g < 140 && b < 70;   // #E15304 and its hover shades
    }
    var lastT = null, lastOrange = false;
    function overOrange(t) {
      if (t === lastT) return lastOrange;
      lastT = t;
      for (var n = t; n && n.nodeType === 1; n = n.parentElement) {
        if (n.closest && n.getAttribute('data-cursor') === 'light') return (lastOrange = true);
        var v = isOrange(getComputedStyle(n).backgroundColor);
        if (v !== null) return (lastOrange = v);
      }
      return (lastOrange = false);
    }

    window.addEventListener('mousemove', function (e) {
      el.style.transform = 'translate(' + (e.clientX - 4) + 'px,' + (e.clientY - 4) + 'px)';
      el.classList.add('is-on');
      var t = e.target;
      if (!t || !t.closest) return;
      var text = '';
      /* any element can name its own label, e.g. data-cursor-label="Coming soon" */
      var own = t.closest('[data-cursor-label]');
      if (own) text = own.getAttribute('data-cursor-label');
      else for (var i = 0; i < LABELS.length; i++) {
        if (t.closest(LABELS[i][0])) { text = LABELS[i][1]; break; }
      }
      if (text) label.textContent = text;
      el.classList.toggle('is-label', !!text);
      el.classList.toggle('is-text', !t.closest(LINK) && !!t.closest(TEXT));
      el.classList.toggle('on-orange', overOrange(t));
    }, { passive: true });
    /* hover states change backgrounds without the target changing */
    document.addEventListener('mouseover', function () { lastT = null; }, { passive: true });
    document.addEventListener('transitionend', function () { lastT = null; }, { passive: true });

    /* an iframe gets its own system cursor; don't leave the square parked at its edge */
    document.addEventListener('mouseover', function (e) {
      if (e.target && e.target.tagName === 'IFRAME') el.classList.remove('is-on');
    });
    document.addEventListener('mouseleave', function () { el.classList.remove('is-on'); });
    window.addEventListener('blur', function () { el.classList.remove('is-on'); });
  }

  if (document.body) init();
  else document.addEventListener('DOMContentLoaded', init);
})();
