'use strict';

// Older resume and article links still lead to the relevant project.
const oldDestinations = {
  '#business': 'projects/ai-question-tool.html',
  '#exploration': 'projects/chriptmas-os.html',
  '#screenshots': 'projects/chriptmas-os.html#screenshots',
  '#meeting': 'projects/meeting-memories.html',
  '#meeting-screenshots': 'projects/meeting-memories.html#meeting-screenshots',
  '#research': 'experience.html#research',
  '#journey': 'experience.html',
  '#writing': 'notes.html',
  '#method': 'blog/working-with-ai.html',
  '#ai-native': 'blog/working-with-ai.html',
  '#about': '#experience',
  '#projects': '#works'
};
function resolveOlderLink() {
  if (document.body.dataset.page !== 'home') return;
  const next = oldDestinations[window.location.hash];
  if (next) window.location.replace(next);
}
resolveOlderLink();
window.addEventListener('hashchange', resolveOlderLink);

document.querySelectorAll('[data-gallery]').forEach(gallery => {
  const stage = gallery.querySelector('[data-screenshot]');
  const image = stage?.querySelector('img');
  const caption = gallery.querySelector('.gallery-caption');
  const choices = [...gallery.querySelectorAll('[data-gallery-thumb]')];
  if (!stage || !image || !caption) return;
  choices.forEach(choice => {
    choice.addEventListener('click', event => {
      if (event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      event.preventDefault();
      stage.href = choice.href;
      stage.dataset.title = choice.dataset.title;
      stage.dataset.caption = choice.dataset.caption;
      stage.setAttribute('aria-label', '放大查看' + choice.dataset.title);
      image.src = choice.href;
      image.alt = choice.querySelector('img').alt;
      caption.textContent = choice.dataset.caption;
      choices.forEach(item => item.setAttribute('aria-current', String(item === choice)));
    });
  });
});

// Only local overview sections are observed. Detail-page navigation uses URLs.
const overviewLinks = [...document.querySelectorAll('.site-header nav a[href^="#"]')];
const overviewSections = overviewLinks.map(link => document.getElementById(link.hash.slice(1)));
let readingFrame = 0;
function updateNavigation() {
  let active = -1;
  overviewSections.forEach((section, index) => {
    if (section && section.getBoundingClientRect().top < 160) active = index;
  });
  if (window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - 3) {
    active = overviewSections.findLastIndex(section => section !== null);
  }
  overviewLinks.forEach((link, index) => {
    if (index === active) link.setAttribute('aria-current', 'location');
    else link.removeAttribute('aria-current');
  });
  readingFrame = 0;
}
function queueNavigation() {
  if (!readingFrame) readingFrame = requestAnimationFrame(updateNavigation);
}
if (overviewLinks.length) {
  window.addEventListener('scroll', queueNavigation, {passive:true});
  window.addEventListener('resize', queueNavigation);
  window.addEventListener('load', queueNavigation);
  queueNavigation();
}
