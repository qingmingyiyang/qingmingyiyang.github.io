/* Apply the system theme before rendering; the album keeps its manual switch. */
(() => {
  const root = document.documentElement;
  const systemTheme = window.matchMedia('(prefers-color-scheme: dark)');
  function syncInterface() {
    const dark = root.dataset.theme === 'dark';
    const button = document.getElementById('theme');
    if (button) {
      button.setAttribute('aria-pressed', String(dark));
      button.setAttribute('aria-label', dark ? '切换浅色模式' : '切换深色模式');
      button.textContent = dark ? '白天模式 ◑' : '夜晚模式 ◐';
    }
    document.querySelectorAll('meta[name="theme-color"]').forEach(meta => {
      meta.removeAttribute('media');
      meta.content = dark ? '#1d1c19' : '#faf9f5';
    });
  }
  function followSystem() {
    root.dataset.theme = systemTheme.matches ? 'dark' : 'light';
    syncInterface();
  }
  followSystem();
  systemTheme.addEventListener('change', followSystem);
  new MutationObserver(syncInterface).observe(root, {attributes:true, attributeFilter:['data-theme']});
  document.addEventListener('DOMContentLoaded', syncInterface, {once:true});
})();
