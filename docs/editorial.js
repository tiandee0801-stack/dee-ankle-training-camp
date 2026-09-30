/* The content works without JavaScript; motion and navigation are enhancements. */
(() => {
  'use strict';
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let motionPaused = reducedMotion.matches;
  const motionButton = document.querySelector('#motion-toggle');
  const hero = document.querySelector('.hero');
  const heroImage = document.querySelector('.hero-image');
  const nextPhoto = document.querySelector('.next-chapter-photo');
  const nextImage = nextPhoto.querySelector('img');
  const progressLine = document.querySelector('.reading-line');
  let scheduled = false;

  function updateScroll() {
    scheduled = false;
    const pageHeight = document.documentElement.scrollHeight - innerHeight;
    progressLine.style.width = (pageHeight > 0 ? Math.max(0, Math.min(100, scrollY / pageHeight * 100)) : 0) + '%';
    if (motionPaused || innerWidth < 761) {
      heroImage.style.transform = '';
      nextImage.style.transform = '';
      return;
    }
    const h = hero.getBoundingClientRect();
    if (h.bottom > 0 && h.top < innerHeight) {
      const amount = Math.max(0, Math.min(1, -h.top / h.height));
      heroImage.style.transform = 'translateY(' + (amount * 12).toFixed(2) + 'px)';
    }
    const n = nextPhoto.getBoundingClientRect();
    if (n.bottom > 0 && n.top < innerHeight) {
      const offset = Math.max(-20, Math.min(20, (innerHeight / 2 - n.top - n.height / 2) * .05));
      nextImage.style.transform = 'scale(1.07) translateY(' + offset.toFixed(2) + 'px)';
    }
  }
  function scheduleScroll() { if (!scheduled) { scheduled = true; requestAnimationFrame(updateScroll); } }
  function applyMotion() {
    document.body.classList.toggle('motion-paused', motionPaused);
    const label = motionPaused ? '开启页面动效' : '暂停页面动效';
    motionButton.setAttribute('aria-label', label);
    motionButton.setAttribute('title', label);
    motionButton.setAttribute('aria-pressed', String(motionPaused));
    updateScroll();
  }
  motionButton.addEventListener('click', () => { motionPaused = !motionPaused; applyMotion(); });
  reducedMotion.addEventListener('change', e => { motionPaused = e.matches; applyMotion(); });
  addEventListener('scroll', scheduleScroll, { passive: true });
  addEventListener('resize', scheduleScroll);
  addEventListener('load', scheduleScroll);
  applyMotion();

  function setupTabs(selector, onChange) {
    const tabs = [...document.querySelectorAll(selector)];
    const panels = tabs.map(tab => document.getElementById(tab.getAttribute('aria-controls')));
    let selected = 0;
    function select(index, moveFocus = false) {
      selected = (index + tabs.length) % tabs.length;
      tabs.forEach((tab, i) => {
        const active = i === selected;
        tab.setAttribute('aria-selected', String(active));
        tab.tabIndex = active ? 0 : -1;
        panels[i].hidden = !active;
        panels[i].tabIndex = 0;
      });
      if (moveFocus) tabs[selected].focus();
      onChange?.(selected);
      scheduleScroll();
    }
    tabs.forEach((tab, i) => {
      tab.addEventListener('click', () => select(i));
      tab.addEventListener('keydown', event => {
        let next;
        if (event.key === 'ArrowRight') next = i + 1;
        if (event.key === 'ArrowLeft') next = i - 1;
        if (event.key === 'Home') next = 0;
        if (event.key === 'End') next = tabs.length - 1;
        if (next !== undefined) { event.preventDefault(); select(next, true); }
      });
    });
    select(0);
    return { next: () => select(selected + 1), previous: () => select(selected - 1) };
  }
  const story = setupTabs('[data-story]', i => {
    document.querySelector('#story-counter').textContent = String(i + 1).padStart(2, '0') + ' / 03';
  });
  document.querySelector('#previous-story').addEventListener('click', story.previous);
  document.querySelector('#next-story').addEventListener('click', story.next);
  const pathDescriptions = [
    '先了解当前的医学限制，再学会观察身体反馈。知道从哪里开始，才知道如何向前。',
    '从足趾与足底感知、保护期轻活动，到主动控制与下肢基础激活。在允许范围内重新认识身体。',
    '符合条件后，再进入承重适应、步态观察与生活阶段复测。把基础能力带回日常。'
  ];
  setupTabs('[data-path]', i => { document.querySelector('#path-intro').textContent = pathDescriptions[i]; });
  setupTabs('[data-feedback]');

  const menu = document.querySelector('#chapter-menu');
  const menuButton = document.querySelector('#menu-toggle');
  menuButton.addEventListener('click', () => {
    menu.showModal();
    menuButton.setAttribute('aria-expanded', 'true');
    document.body.classList.add('menu-open');
  });
  document.querySelector('#menu-close').addEventListener('click', () => menu.close());
  menu.addEventListener('close', () => {
    menuButton.setAttribute('aria-expanded', 'false');
    document.body.classList.remove('menu-open');
  });
  menu.querySelectorAll('a').forEach(link => link.addEventListener('click', () => {
    menu.close();
    const target = document.querySelector(link.getAttribute('href'));
    if (target) { target.tabIndex = -1; target.focus({ preventScroll: true }); }
  }));
  menu.addEventListener('click', e => {
    if (e.target !== menu) return;
    const rect = menu.getBoundingClientRect();
    if (e.clientX < rect.left || e.clientX > rect.right || e.clientY < rect.top || e.clientY > rect.bottom) menu.close();
  });

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        if (!motionPaused) entry.target.classList.add('reveal-in');
        observer.unobserve(entry.target);
      });
    }, { threshold: .12 });
    document.querySelectorAll('.section-heading,.method-step,.daily-checklist,.camp-grid,.fit-card,.next-chapter-copy,.join-layout').forEach(el => observer.observe(el));
  }
})();
