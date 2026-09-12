'use strict';
document.querySelectorAll('[data-tabset]').forEach(group => {
  const tabs = [...group.querySelectorAll('[role="tab"]')];
  const select = selected => {
    tabs.forEach(tab => {
      const active = tab === selected;
      tab.setAttribute('aria-selected', String(active));
      tab.tabIndex = active ? 0 : -1;
      const panel = document.getElementById(tab.dataset.tab);
      if (panel) panel.hidden = !active;
    });
  };
  tabs.forEach((tab, index) => {
    tab.addEventListener('click', () => select(tab));
    tab.addEventListener('keydown', event => {
      let next;
      if (event.key === 'ArrowRight') next = (index + 1) % tabs.length;
      else if (event.key === 'ArrowLeft') next = (index + tabs.length - 1) % tabs.length;
      else if (event.key === 'Home') next = 0;
      else if (event.key === 'End') next = tabs.length - 1;
      else return;
      event.preventDefault(); tabs[next].focus(); select(tabs[next]);
    });
  });
});
const progress = document.querySelector('.reading-progress');
const navLinks = [...document.querySelectorAll('.site-header nav a')];
const chapters = navLinks.map(link => document.querySelector(link.getAttribute('href')));
let framePending = false;
function updateReadingPosition() {
  const total = document.documentElement.scrollHeight - window.innerHeight;
  if (progress) progress.style.transform = `scaleX(${total > 0 ? Math.min(1, Math.max(0, window.scrollY / total)) : 0})`;
  let active = -1;
  chapters.forEach((chapter, index) => { if (chapter && chapter.getBoundingClientRect().top <= 180) active = index; });
  navLinks.forEach((link, index) => { if (index === active) link.setAttribute('aria-current','location'); else link.removeAttribute('aria-current'); });
  framePending = false;
}
function queueReadingUpdate() { if (!framePending) { framePending = true; requestAnimationFrame(updateReadingPosition); } }
window.addEventListener('scroll',queueReadingUpdate,{passive:true});
window.addEventListener('resize',queueReadingUpdate);
window.addEventListener('load',queueReadingUpdate);
document.querySelectorAll('details').forEach(item => item.addEventListener('toggle',queueReadingUpdate));
queueReadingUpdate();
