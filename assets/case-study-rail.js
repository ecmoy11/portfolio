/* ================= rail scroll-spy =================
   Tracks which section owns the reading position rather than which one is
   merely visible: the active link is the last section whose top has passed
   the trigger line. That keeps a tall section active for its full length
   instead of flickering to the next one the moment it peeks in. */
(function(){
  var links = [].slice.call(document.querySelectorAll('.csr-jump a'));
  if (!links.length) return;
  var secs = links.map(function(a){ return document.querySelector(a.getAttribute('href')); });

  function trigger(){ return Math.min(160, window.innerHeight * 0.22); }

  var raf = null;
  function spy(){
    raf = null;
    var line = trigger(), best = 0;
    secs.forEach(function(s, i){
      if (s && s.getBoundingClientRect().top - line <= 0) best = i;
    });
    /* bottom of the page always lights the last item, even if it is short */
    if (window.innerHeight + window.scrollY >= document.body.scrollHeight - 40) best = links.length - 1;
    links.forEach(function(a, i){ a.classList.toggle('is-active', i === best); });
  }
  function queue(){ if (raf === null) raf = requestAnimationFrame(spy); }

  window.addEventListener('scroll', queue, {passive:true});
  window.addEventListener('resize', queue);
  spy();

  /* smooth scroll that respects the sticky nav, and does not leave a hash behind */
  links.forEach(function(a){
    a.addEventListener('click', function(e){
      var t = document.querySelector(a.getAttribute('href'));
      if (!t) return;
      e.preventDefault();
      var top = t.getBoundingClientRect().top + window.scrollY - (window.innerWidth <= 900 ? 150 : 120);
      window.scrollTo({top: top, behavior: 'smooth'});
    });
  });
})();
