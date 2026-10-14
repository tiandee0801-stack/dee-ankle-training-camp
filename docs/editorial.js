/* Every chapter is present in the document. JavaScript adds optional navigation. */
(() => {
  'use strict';
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
  let motionPaused = reducedMotion.matches;
  const motionButton = document.querySelector('#motion-toggle');
  const progressLine = document.querySelector('.reading-line');
  const navLinks = [...document.querySelectorAll('.desktop-nav a')];
  const navSections = navLinks.map(link => document.querySelector(link.hash));
  let scheduled = false;

  function updateScroll() {
    scheduled = false;
    const pageHeight = document.documentElement.scrollHeight - innerHeight;
    const progress = pageHeight > 0 ? Math.max(0, Math.min(1, scrollY / pageHeight)) : 0;
    progressLine.style.width = (progress * 100) + '%';
    let current = -1;
    navSections.forEach((section, i) => {
      if (section.getBoundingClientRect().top <= 150) current = i;
    });
    navLinks.forEach((link, i) => {
      if (i === current) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }
  function scheduleScroll() {
    if (!scheduled) { scheduled = true; requestAnimationFrame(updateScroll); }
  }
  function applyMotion() {
    document.body.classList.toggle('motion-paused', motionPaused);
    document.documentElement.classList.toggle('motion-paused', motionPaused);
    const label = motionPaused ? '开启页面动效' : '暂停页面动效';
    motionButton.setAttribute('aria-label', label);
    motionButton.setAttribute('title', label);
    motionButton.setAttribute('aria-pressed', String(motionPaused));
  }
  motionButton.addEventListener('click', () => { motionPaused = !motionPaused; applyMotion(); });
  reducedMotion.addEventListener('change', event => { motionPaused = event.matches; applyMotion(); });
  addEventListener('scroll', scheduleScroll, { passive:true });
  addEventListener('resize', scheduleScroll);
  addEventListener('load', scheduleScroll);
  applyMotion();
  scheduleScroll();

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
      if (moveFocus) tabs[selected].focus({ preventScroll:true });
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
    return { next:() => select(selected + 1), previous:() => select(selected - 1) };
  }

  const story = setupTabs('[data-story]', index => {
    document.querySelector('#story-counter').textContent = String(index + 1).padStart(2, '0') + ' / 03';
  });
  document.querySelector('#previous-story').addEventListener('click', story.previous);
  document.querySelector('#next-story').addEventListener('click', story.next);

  const stages = [
    { range:'01—02', title:'先认清起点', description:'先了解当前的医学限制，再学会观察身体反馈。知道从哪里开始，才知道如何向前。' },
    { range:'03—07', title:'重新找回基础', description:'从足趾与足底感知、保护期轻活动，到主动控制与下肢基础激活。在允许范围内重新认识身体。' },
    { range:'08—10', title:'把能力带回生活', description:'符合条件后，再进入承重适应、步态观察与生活阶段复测。把基础能力带回日常。' }
  ];
  setupTabs('[data-path]', index => {
    document.querySelector('#path-intro').textContent = stages[index].description;
    document.querySelector('#path-range').textContent = stages[index].range;
    document.querySelector('#path-stage').textContent = stages[index].title;
    document.querySelector('.path-body').dataset.stage = String(index);
    const panel = document.querySelector('#path-panel-' + index);
    if (!panel.querySelector('details[open]')) panel.querySelector('details').open = true;
  });
  setupTabs('[data-feedback]');
  setupTabs('[data-rhythm]', index => {
    const selectedDay = index === 0 ? 10 : 12;
    document.querySelectorAll('[data-day]').forEach(day => {
      day.classList.toggle('is-past', Number(day.dataset.day) < selectedDay);
      day.classList.toggle('is-current', Number(day.dataset.day) === selectedDay);
    });
  });

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
    if (target) { target.tabIndex = -1; target.focus({ preventScroll:true }); }
  }));
  menu.addEventListener('click', event => {
    if (event.target !== menu) return;
    const rect = menu.getBoundingClientRect();
    if (event.clientX < rect.left || event.clientX > rect.right || event.clientY < rect.top || event.clientY > rect.bottom) menu.close();
  });

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        if (!motionPaused) entry.target.classList.add('reveal-in');
        observer.unobserve(entry.target);
      });
    }, { threshold:.12 });
    document.querySelectorAll('.section-heading,.method-step,.daily-checklist,.camp-grid,.fit-card,.next-chapter-copy,.join-layout').forEach(element => observer.observe(element));
  }
})();
