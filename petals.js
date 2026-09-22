// Fondo decorativo independiente del ramo: no captura clics ni bloquea el scroll.
(() => {
  const canvas = document.getElementById('petal-background');
  const ctx = canvas.getContext('2d');
  if (!ctx) return;
  const motion = matchMedia('(prefers-reduced-motion: reduce)');
  const pointer = { x: -1000, y: -1000, until: 0 };
  let width = 0, height = 0, petals = [], frame = 0, previous = 0;

  function makePetal(randomHeight = false) {
    return {
      x: Math.random() * width, y: randomHeight ? Math.random() * height : -25,
      size: 5 + Math.random() * 7, speed: 16 + Math.random() * 23,
      angle: Math.random() * Math.PI * 2, spin: (Math.random() - .5) * 1.2,
      phase: Math.random() * Math.PI * 2, vx: 0, vy: 0,
      flower: Math.random() < .22
    };
  }

  function drawPetal(p, time) {
    ctx.save();
    ctx.translate(p.x, p.y);
    ctx.rotate(p.angle);
    // Menos intensidad en el centro, donde están los textos y el personaje.
    const center = Math.abs(p.x - width / 2) < Math.min(width * .32, 260);
    ctx.globalAlpha = center ? .13 : .38;
    ctx.fillStyle = '#d9a52c';
    if (p.flower) {
      for (let i = 0; i < 5; i++) {
        ctx.rotate(Math.PI * 2 / 5);
        ctx.beginPath();
        ctx.ellipse(0, -p.size * .58, p.size * .32, p.size * .57, 0, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.fillStyle = '#947027';
      ctx.beginPath();ctx.arc(0, 0, p.size * .25, 0, Math.PI * 2);ctx.fill();
    } else {
      ctx.scale(.55 + Math.abs(Math.cos(time * .0007 + p.phase)) * .45, 1);
      ctx.beginPath();
      ctx.moveTo(0, -p.size);
      ctx.bezierCurveTo(p.size, -p.size * .6, p.size * .7, p.size * .65, 0, p.size);
      ctx.bezierCurveTo(-p.size * .7, p.size * .3, -p.size * .6, -p.size * .5, 0, -p.size);
      ctx.fill();
    }
    ctx.restore();
  }

  function paint(time) {
    const dt = previous ? Math.min((time - previous) / 1000, .04) : 0;
    previous = time;
    ctx.clearRect(0, 0, width, height);
    for (const p of petals) {
      if (!motion.matches) {
        if (time < pointer.until) {
          const dx = p.x - pointer.x, dy = p.y - pointer.y;
          const distance = Math.hypot(dx, dy);
          if (distance < 135) {
            const force = (1 - distance / 135) * 320 * dt;
            p.vx += dx / Math.max(distance, 1) * force;
            p.vy += dy / Math.max(distance, 1) * force;
          }
        }
        p.x += (Math.sin(time * .0005 + p.phase) * 12 + p.vx) * dt;
        p.y += (p.speed + p.vy) * dt;
        p.angle += p.spin * dt;
        p.vx *= Math.exp(-2 * dt);p.vy *= Math.exp(-2 * dt);
        if (p.y > height + 25 || p.y < -150) Object.assign(p, makePetal());
        if (p.x < -25) p.x = width + 20;
        if (p.x > width + 25) p.x = -20;
      }
      drawPetal(p, time);
    }
    if (!motion.matches && !document.hidden) frame = requestAnimationFrame(paint);
  }

  function restart() {
    cancelAnimationFrame(frame);previous = 0;
    if (!document.hidden) paint(performance.now());
  }
  function resize() {
    width = window.innerWidth;height = window.innerHeight;
    const ratio = Math.min(devicePixelRatio || 1, 2);
    canvas.width = Math.round(width * ratio);canvas.height = Math.round(height * ratio);
    ctx.setTransform(ratio, 0, 0, ratio, 0, 0);
    petals = Array.from({length: Math.min(65, Math.max(22, Math.round(width * height / 21000)))}, () => makePetal(true));
    restart();
  }
  function interact(event) {
    pointer.x = event.clientX;pointer.y = event.clientY;
    pointer.until = performance.now() + (event.pointerType === 'touch' ? 1100 : 450);
  }
  window.addEventListener('pointermove', interact, { passive: true });
  window.addEventListener('pointerdown', interact, { passive: true });
  window.addEventListener('resize', resize, { passive: true });
  document.addEventListener('visibilitychange', restart);
  motion.addEventListener('change', restart);
  resize();
})();
