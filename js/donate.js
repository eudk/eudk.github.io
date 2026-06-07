(() => {
  const canvas = document.getElementById('matrix-canvas');
  const context = canvas?.getContext('2d');
  if (!canvas || !context) return;

  let frameId = null;
  let drops = [];

  function resize() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    drops = Array(Math.ceil(canvas.width / 14)).fill(1);
  }

  function draw() {
    context.fillStyle = 'rgba(248, 248, 250, .08)';
    context.fillRect(0, 0, canvas.width, canvas.height);
    context.fillStyle = '#e8e8ed';
    context.font = '14px Arial';

    drops.forEach((drop, index) => {
      context.fillText(Math.random() > .5 ? '0' : '1', index * 14, drop * 14);
      drops[index] = drop * 14 > canvas.height && Math.random() > .99 ? 0 : drop + 1;
    });

    frameId = window.requestAnimationFrame(draw);
  }

  resize();
  if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) draw();

  window.addEventListener('resize', () => {
    if (frameId) window.cancelAnimationFrame(frameId);
    resize();
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      draw();
    }
  });
})();
