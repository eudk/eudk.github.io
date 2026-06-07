(() => {
  const loader = document.getElementById('page-loader');
  if (!loader) return;

  const startedAt = performance.now();
  const minimumInitialMs = 650;

  function hideLoader() {
    const remaining = Math.max(0, minimumInitialMs - (performance.now() - startedAt));
    window.setTimeout(() => loader.classList.add('is-hidden'), remaining);
  }

  if (document.readyState === 'complete') {
    hideLoader();
  } else {
    window.addEventListener('load', hideLoader, { once: true });
  }

  window.addEventListener('pageshow', (event) => {
    if (event.persisted) loader.classList.add('is-hidden');
  });

  document.addEventListener('click', (event) => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) {
      return;
    }

    const link = event.target.closest('a[href]');
    if (!link || link.target === '_blank' || link.hasAttribute('download')) return;

    const destination = new URL(link.href, window.location.href);
    if (destination.origin !== window.location.origin) return;
    if (destination.href === window.location.href || destination.hash && destination.pathname === window.location.pathname) {
      return;
    }

    event.preventDefault();
    loader.classList.remove('is-hidden');
    loader.classList.add('is-leaving');
    window.setTimeout(() => {
      window.location.href = destination.href;
    }, 280);
  });
})();
