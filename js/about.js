document.addEventListener('DOMContentLoaded', () => {
  // Ensure scrolling works (especially on phones)
  document.documentElement.style.overflowY = 'auto';
  document.documentElement.style.overflowX = 'hidden';
  document.body.style.overflowY = 'auto';
  document.body.style.overflowX = 'hidden';
  document.body.style.webkitOverflowScrolling = 'touch';
});
