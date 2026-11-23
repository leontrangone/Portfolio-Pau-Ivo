/* ==========================================================
   León Trangone — Portfolio de básquet
   Animaciones con GSAP + ScrollTrigger y scroll suave con Lenis.
   Si algo no carga (o si la persona prefiere menos movimiento),
   la página se muestra completa y quieta: nada queda escondido.
   ========================================================== */
(() => {
  'use strict';

  const d = document;
  const root = d.documentElement;
  const $ = (s, c = d) => c.querySelector(s);
  const $$ = (s, c = d) => Array.from(c.querySelectorAll(s));

  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const fine = matchMedia('(hover: hover) and (pointer: fine)').matches;

  /* ---------- sin motor de animación o con movimiento reducido ---------- */
  const hasLibs = !!(window.gsap && window.ScrollTrigger);
  if (!hasLibs || reduce) {
    root.classList.add('no-motion');
    const l = $('.loader'); if (l) l.remove();
    const replay = $('#replay'); if (replay) replay.hidden = true;
    simpleScrollTop();
    return;
  }

  gsap.registerPlugin(ScrollTrigger);
  ScrollTrigger.config({ ignoreMobileResize: true });

  /* ---------- scroll suave ---------- */
  let lenis = null;
  if (window.Lenis) {
    lenis = new Lenis({ lerp: 0.1, smoothWheel: true });
    lenis.on('scroll', ScrollTrigger.update);
    gsap.ticker.add((t) => lenis.raf(t * 1000));
    gsap.ticker.lagSmoothing(0);
  }

  /* anclas internas */
  $$('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (!id || id.length < 2) return;
      const target = $(id);
      if (!target) return;
      e.preventDefault();
      if (lenis) lenis.scrollTo(target, { offset: 0, duration: 1.5 });
      else target.scrollIntoView({ behavior: 'smooth' });
    });
  });
  const toTop = $('.to-top');
  if (toTop) toTop.addEventListener('click', () => {
    if (lenis) lenis.scrollTo(0, { duration: 1.6 });
    else window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ---------- utilidades de texto ---------- */
  function splitChars(el) {
    const text = el.textContent;
    el.textContent = '';
    const frag = d.createDocumentFragment();
    Array.from(text).forEach((ch) => {
      const mask = d.createElement('span');
      mask.className = 'char-mask';
      mask.setAttribute('aria-hidden', 'true');
      const c = d.createElement('span');
      c.className = 'char';
      c.textContent = ch;
      mask.appendChild(c);
      frag.appendChild(mask);
    });
    el.appendChild(frag);
    return $$('.char', el);
  }

  function splitWords(el) {
    const out = [];
    (function walk(node) {
      Array.from(node.childNodes).forEach((n) => {
        if (n.nodeType === 3) {
          const frag = d.createDocumentFragment();
          n.textContent.split(/(\s+)/).forEach((p) => {
            if (!p) return;
            if (/^\s+$/.test(p)) { frag.appendChild(d.createTextNode(p)); return; }
            const s = d.createElement('span');
            s.className = 'w';
            s.textContent = p;
            frag.appendChild(s);
            out.push(s);
          });
          n.replaceWith(frag);
        } else if (n.nodeType === 1) {
          walk(n);
        }
      });
    })(el);
    return out;
  }

  /* ---------- estados iniciales (se esconden desde JS, nunca desde CSS) ---------- */
  const loader = $('.loader');
  const heroTitle = $('.hero__title');
  const chars = heroTitle ? splitChars(heroTitle) : [];
  const drawn = $$('.hero__court .draw:not(.dash)');
  const dashed = $$('.hero__court .dash');

  gsap.set(chars, { yPercent: 118 });
  gsap.set(drawn, { strokeDasharray: 1, strokeDashoffset: 1 });
  gsap.set(dashed, { opacity: 0 });
  root.style.overflow = 'hidden';
  if (lenis) lenis.stop();

  /* ---------- pieza de arranque ---------- */
  function runLoader(onReveal) {
    if (!loader) { onReveal(); return; }
    const ball = $('.loader__ball');
    const shadow = $('.loader__shadow');
    const name = $('.loader__name');

    gsap.set(ball, { y: -230 });
    gsap.set(shadow, { scaleX: 0.3, opacity: 0.25 });
    gsap.set(name, { opacity: 0, y: 10 });

    const tl = gsap.timeline();
    tl.to(ball, { y: 0, duration: 0.5, ease: 'power2.in' })
      .to(shadow, { scaleX: 1, opacity: 1, duration: 0.5, ease: 'power2.in' }, 0)
      .to(ball, { scaleY: 0.78, scaleX: 1.14, duration: 0.07, ease: 'power1.out' })
      .to(ball, { scaleY: 1, scaleX: 1, y: -125, duration: 0.38, ease: 'power2.out' })
      .to(shadow, { scaleX: 0.6, opacity: 0.55, duration: 0.38, ease: 'power2.out' }, '<')
      .to(ball, { y: 0, duration: 0.38, ease: 'power2.in' })
      .to(shadow, { scaleX: 1, opacity: 1, duration: 0.38, ease: 'power2.in' }, '<')
      .to(ball, { scaleY: 0.86, scaleX: 1.08, duration: 0.06 })
      .to(ball, { scaleY: 1, scaleX: 1, y: -54, duration: 0.24, ease: 'power2.out' })
      .to(ball, { y: 0, duration: 0.24, ease: 'power2.in' })
      .to(name, { opacity: 1, y: 0, duration: 0.4 }, '-=0.15')
      .addLabel('curtain', '+=0.15')
      .to(loader, { yPercent: -100, duration: 0.9, ease: 'power4.inOut' }, 'curtain')
      .call(onReveal, null, 'curtain+=0.45')
      .call(() => loader.remove());
  }

  /* ---------- portada ---------- */
  function heroIn() {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl.to(drawn, { strokeDashoffset: 0, duration: 2.4, stagger: 0.1, ease: 'power2.inOut' }, 0)
      .to(dashed, { opacity: 1, duration: 1.2 }, 0.9)
      .to(chars, { yPercent: 0, duration: 1.1, stagger: 0.055, ease: 'power4.out' }, 0.1)
      .from('.eyebrow', { y: 20, opacity: 0, duration: 0.8 }, 0.3)
      .from('.hero__foot > *', { y: 24, opacity: 0, duration: 0.8, stagger: 0.1 }, 0.8)
      .from('.hero__ball', { scale: 0.4, rotation: -120, opacity: 0, duration: 1.4, ease: 'back.out(1.4)' }, 0.25);
  }

  gsap.to('.hero__ball svg', { rotation: 360, duration: 28, repeat: -1, ease: 'none' });
  gsap.to('.hero__ball svg', { y: 14, duration: 2.8, repeat: -1, yoyo: true, ease: 'sine.inOut' });

  const hero = $('.hero');
  if (fine && hero) {
    const bx = gsap.quickTo('.hero__ball', 'x', { duration: 1.1, ease: 'power3' });
    const by = gsap.quickTo('.hero__ball', 'y', { duration: 1.1, ease: 'power3' });
    hero.addEventListener('pointermove', (e) => {
      const r = hero.getBoundingClientRect();
      bx(((e.clientX - r.left) / r.width - 0.5) * -46);
      by(((e.clientY - r.top) / r.height - 0.5) * -34);
    });
  }
  gsap.to('.hero__court', {
    yPercent: 14, ease: 'none',
    scrollTrigger: { trigger: hero, start: 'top top', end: 'bottom top', scrub: true }
  });

  /* ---------- barra de progreso, header, pelota para volver arriba ---------- */
  gsap.to('.progress span', {
    scaleX: 1, ease: 'none',
    scrollTrigger: { start: 0, end: 'max', scrub: 0.2 }
  });
  const top = $('.top');
  const spin = toTop ? gsap.quickSetter($('svg', toTop), 'rotation', 'deg') : null;
  ScrollTrigger.create({
    start: 0, end: 'max',
    onUpdate(self) {
      const y = self.scroll();
      top.classList.toggle('is-scrolled', y > 40);
      if (toTop) {
        toTop.classList.toggle('is-on', y > innerHeight * 0.8);
        spin(y / 5);
      }
    }
  });

  /* ---------- cinta: se acelera con el scroll ---------- */
  const track = $('.marquee__track');
  const mqAnim = track && track.getAnimations ? track.getAnimations()[0] : null;
  if (mqAnim) {
    let boost = 1, rate = 1;
    ScrollTrigger.create({
      start: 0, end: 'max',
      onUpdate: (self) => { boost = Math.max(boost, 1 + Math.min(Math.abs(self.getVelocity()) / 450, 6)); }
    });
    gsap.ticker.add(() => {
      boost += (1 - boost) * 0.06;
      rate += (boost - rate) * 0.12;
      mqAnim.playbackRate = rate;
    });
  }

  /* ---------- historia: las palabras se prenden al scrollear ---------- */
  const storyText = $('[data-words]');
  if (storyText) {
    const words = splitWords(storyText);
    gsap.set(words, { opacity: 0.16 });
    gsap.to(words, {
      opacity: 1, stagger: 0.1, ease: 'none',
      scrollTrigger: { trigger: storyText, start: 'top 82%', end: 'bottom 58%', scrub: true }
    });
  }
  gsap.from('.story__label', {
    y: 30, opacity: 0, duration: 0.9, ease: 'power3.out',
    scrollTrigger: { trigger: '.story', start: 'top 75%' }
  });

  /* ---------- marcador: cuentan hasta su número ---------- */
  gsap.from('.stat', {
    y: 60, opacity: 0, duration: 0.9, stagger: 0.14, ease: 'power3.out',
    scrollTrigger: { trigger: '.stats__grid', start: 'top 82%' }
  });
  $$('[data-count]').forEach((el) => {
    const end = Number(el.dataset.count);
    const o = { v: 0 };
    el.textContent = '0';
    ScrollTrigger.create({
      trigger: el, start: 'top 88%', once: true,
      onEnter: () => gsap.to(o, {
        v: end, duration: 1.7, ease: 'power2.out',
        onUpdate: () => { el.textContent = Math.round(o.v); }
      })
    });
  });

  /* ---------- en cancha: scroll horizontal sobre el parquet ---------- */
  const mm = gsap.matchMedia();
  mm.add('(min-width: 900px)', () => {
    const gal = $('.gallery');
    const strip = $('.gallery__track');
    if (!gal || !strip) return;
    const dist = () => Math.max(0, strip.scrollWidth - root.clientWidth);

    const move = gsap.to(strip, {
      x: () => -dist(), ease: 'none',
      scrollTrigger: {
        trigger: gal, pin: true, scrub: 0.7, anticipatePin: 1,
        start: 'top top', end: () => '+=' + dist(), invalidateOnRefresh: true
      }
    });

    $$('.polaroid', gal).forEach((f) => {
      gsap.fromTo(f, { y: 70 }, {
        y: -24, ease: 'none',
        scrollTrigger: { trigger: f, containerAnimation: move, start: 'left right', end: 'right left', scrub: true }
      });
      const img = $('img', f);
      if (img) gsap.fromTo(img, { xPercent: -5, scale: 1.12 }, {
        xPercent: 5, ease: 'none',
        scrollTrigger: { trigger: f, containerAnimation: move, start: 'left right', end: 'right left', scrub: true }
      });
    });
  });
  mm.add('(max-width: 899px)', () => {
    $$('.gallery .panel, .gallery .polaroid').forEach((el) => {
      gsap.from(el, {
        y: 60, opacity: 0, duration: 0.9, ease: 'power3.out',
        scrollTrigger: { trigger: el, start: 'top 88%' }
      });
    });
  });

  /* ---------- valores ---------- */
  gsap.from('.values__head > *', {
    y: 40, opacity: 0, duration: 0.9, stagger: 0.12, ease: 'power3.out',
    scrollTrigger: { trigger: '.values__head', start: 'top 82%' }
  });
  gsap.from('.value', {
    y: 50, opacity: 0, duration: 0.8, stagger: 0.1, ease: 'power3.out',
    scrollTrigger: { trigger: '.values__list', start: 'top 82%' }
  });

  /* ---------- mi número: la camiseta gira y sigue al mouse ---------- */
  const stage = $('.number__stage');
  const jersey = $('.jersey');
  const tilt = $('.jersey__tilt');
  if (stage && jersey && tilt) {
    gsap.from(jersey, {
      rotationY: -75, y: 90, opacity: 0, duration: 1.4, ease: 'power3.out', transformPerspective: 900,
      scrollTrigger: { trigger: stage, start: 'top 75%' }
    });
    gsap.from('.number__copy > *', {
      y: 40, opacity: 0, duration: 0.9, stagger: 0.14, ease: 'power3.out',
      scrollTrigger: { trigger: '.number__copy', start: 'top 80%' }
    });
    gsap.fromTo('.number__bg', { y: -70 }, {
      y: 70, ease: 'none',
      scrollTrigger: { trigger: '.number', start: 'top bottom', end: 'bottom top', scrub: true }
    });
    if (fine) {
      const rx = gsap.quickTo(tilt, 'rotationX', { duration: 0.7, ease: 'power3' });
      const ry = gsap.quickTo(tilt, 'rotationY', { duration: 0.7, ease: 'power3' });
      stage.addEventListener('pointermove', (e) => {
        const r = stage.getBoundingClientRect();
        ry(((e.clientX - r.left) / r.width - 0.5) * 28);
        rx(-((e.clientY - r.top) / r.height - 0.5) * 20);
      });
      stage.addEventListener('pointerleave', () => { ry(0); rx(0); });
    }
  }

  /* ---------- final: el tiro entra limpio ---------- */
  const ballEl = $('#shotBall');
  const netEl = $('#net');
  const swish = $('#swish');
  const replay = $('#replay');
  if (ballEl && netEl && swish) {
    const s = { cx: 90, cy: 470, rot: 0 };
    const render = () => ballEl.setAttribute('transform', `translate(${s.cx} ${s.cy}) rotate(${s.rot}) translate(-35 -35)`);
    const arc = { t: 0 };
    render();
    gsap.set(swish, { opacity: 0 });

    const shot = gsap.timeline({ paused: true });
    shot
      .set(s, { cx: 90, cy: 470, rot: 0 })
      .call(render)
      .set(swish, { opacity: 0 })
      .set(arc, { t: 0 })
      .to(arc, {
        t: 1, duration: 1.2, ease: 'none',
        onUpdate() {
          s.cx = gsap.utils.interpolate(90, 770, arc.t);
          s.cy = gsap.utils.interpolate(470, 205, arc.t) - 4 * 300 * arc.t * (1 - arc.t);
          s.rot = arc.t * 540;
          render();
        }
      })
      .to(s, { cx: 778, cy: 485, rot: '+=200', duration: 0.55, ease: 'power2.in', onUpdate: render })
      .to(s, { cx: 760, cy: 392, duration: 0.34, ease: 'power2.out', onUpdate: render })
      .to(s, { cx: 742, cy: 485, duration: 0.34, ease: 'power2.in', onUpdate: render })
      .to(s, { cx: 728, cy: 442, duration: 0.2, ease: 'power2.out', onUpdate: render })
      .to(s, { cx: 716, cy: 485, duration: 0.2, ease: 'power2.in', onUpdate: render })
      .to(s, { cx: 600, rot: '-=320', duration: 1, ease: 'power1.out', onUpdate: render })
      .fromTo(netEl, { skewX: 0, scaleY: 1 }, {
        skewX: 6, scaleY: 1.05, svgOrigin: '770 207', duration: 0.1, repeat: 5, yoyo: true, ease: 'sine.inOut'
      }, 1.22)
      .fromTo(swish, { opacity: 0, scale: 0.6, svgOrigin: '740 130' }, {
        opacity: 1, scale: 1, duration: 0.45, ease: 'back.out(2.2)'
      }, 1.4);

    ScrollTrigger.create({
      trigger: '.outro', start: 'top 55%', once: true,
      onEnter: () => shot.play(0)
    });
    if (replay) replay.addEventListener('click', () => shot.restart());
  }

  /* ---------- cursor ---------- */
  if (fine) {
    const ring = $('.cursor');
    if (ring) {
      const xTo = gsap.quickTo(ring, 'x', { duration: 0.35, ease: 'power3' });
      const yTo = gsap.quickTo(ring, 'y', { duration: 0.35, ease: 'power3' });
      let seen = false;
      addEventListener('pointermove', (e) => {
        if (!seen) { seen = true; gsap.set(ring, { x: e.clientX, y: e.clientY }); }
        ring.classList.add('is-on');
        xTo(e.clientX); yTo(e.clientY);
      }, { passive: true });
      d.addEventListener('pointerleave', () => ring.classList.remove('is-on'));
      $$('a, button, [data-cursor]').forEach((el) => {
        el.addEventListener('pointerenter', () => ring.classList.add('is-big'));
        el.addEventListener('pointerleave', () => ring.classList.remove('is-big'));
      });
    }
  }

  /* ---------- arranque ---------- */
  const start = () => {
    runLoader(() => {
      root.style.overflow = '';
      if (lenis) lenis.start();
      heroIn();
    });
  };
  if (d.fonts && d.fonts.ready) {
    Promise.race([d.fonts.ready, new Promise((r) => setTimeout(r, 1500))]).then(start);
  } else {
    start();
  }
  if (d.fonts && d.fonts.ready) d.fonts.ready.then(() => ScrollTrigger.refresh());
  addEventListener('load', () => ScrollTrigger.refresh());

  /* con movimiento reducido: solo el botón de volver arriba */
  function simpleScrollTop() {
    const btn = $('.to-top');
    const bar = $('.top');
    if (btn) btn.addEventListener('click', () => window.scrollTo({ top: 0 }));
    const onScroll = () => {
      if (btn) btn.classList.toggle('is-on', window.scrollY > innerHeight * 0.8);
      if (bar) bar.classList.toggle('is-scrolled', window.scrollY > 40);
    };
    addEventListener('scroll', onScroll, { passive: true });
    onScroll();
  }
})();
