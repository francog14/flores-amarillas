// Los textos se editan directamente en index.html.
// La ilustración se guarda localmente para funcionar en GitHub Pages.
const canvas = document.getElementById('flowers');
const ctx = canvas.getContext('2d');
const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)');
const kitty = new Image();
let width = 0, height = 0, start = 0, frame = 0, opened = false;
const ease = x => 1 - Math.pow(1 - Math.max(0, Math.min(1, x)), 3);

// Coordenadas relativas a la ilustración: las flores quedan sobre los tallos,
// por debajo de la cara y por encima de las manos.
const blooms = [
  [.420, .482, .075, -.15], [.580, .483, .074, .16],
  [.373, .561, .075, -.25], [.625, .571, .075, .23],
  [.498, .543, .077, .06], [.500, .626, .070, -.08]
];

function drawBloom(x, y, radius, angle, progress) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(angle);
  ctx.lineJoin = 'round';
  // Cada pétalo se despliega desde el centro, con un pequeño desfase.
  for (let ring = 0; ring < 2; ring++) {
    for (let petal = 0; petal < 10; petal++) {
      const opening = ease((progress - ring * .09 - petal * .015) / .76);
      const length = radius * (.10 + .90 * opening) * (ring ? .84 : 1);
      const breadth = radius * (.035 + .22 * opening);
      ctx.save();
      ctx.rotate(petal * Math.PI / 5 + ring * Math.PI / 10);
      ctx.fillStyle = ring ? '#ffda50' : '#f4bc28';
      ctx.strokeStyle = '#75401b';
      ctx.lineWidth = Math.max(.8, radius * .035);
      ctx.beginPath();
      ctx.moveTo(-radius * .09, 0);
      ctx.bezierCurveTo(-breadth, -length * .48, -breadth, -length, 0, -length);
      ctx.bezierCurveTo(breadth, -length, breadth, -length * .48, radius * .09, 0);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      ctx.restore();
    }
  }
  const center = radius * (.13 + .14 * ease(progress));
  ctx.fillStyle = '#935627';
  ctx.strokeStyle = '#663819';
  ctx.lineWidth = Math.max(1, radius * .045);
  ctx.beginPath();
  ctx.ellipse(0, 0, center * 1.1, center * .88, -.2, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.fillStyle = '#cf9653';
  for (let seed = 0; seed < 16; seed++) {
    const a = seed * 2.4, d = Math.sqrt(seed / 16) * center * .75;
    ctx.beginPath();
    ctx.arc(Math.cos(a) * d, Math.sin(a) * d * .8, radius * .023, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.restore();
}

function render(now) {
  ctx.clearRect(0, 0, width, height);
  const elapsed = reducedMotion.matches ? 10 : (now - start) / 1000;
  const reveal = ease(elapsed / 1.4);
  if (kitty.complete && kitty.naturalWidth) {
    const size = Math.min(width - 24, height - 16, 480);
    const sway = reducedMotion.matches ? 0 : Math.sin(elapsed * 1.3) * .015;
    ctx.save();
    ctx.translate(width / 2, height / 2 + (1 - reveal) * 25);
    ctx.rotate(sway);
    ctx.scale(.94 + reveal * .06, .94 + reveal * .06);
    ctx.globalAlpha = reveal;
    ctx.drawImage(kitty, -size / 2, -size / 2, size, size);
    blooms.forEach(([x, y, radius, angle], index) => {
      const progress = Math.max(0, Math.min(1, (elapsed - .65 - index * .38) / 2.1));
      drawBloom((x - .5) * size, (y - .5) * size, radius * size, angle, progress);
    });
    ctx.restore();
  }
  if (!reducedMotion.matches) {
    const spread = Math.min(width * .88, 600);
    for (let i = 0; i < 17; i++) {
      const x = width / 2 + Math.sin(i * 127.1) * spread * .5 + Math.sin(now / 3000 + i) * 12;
      const y = height * (.12 + ((i * .137 + now * .000012) % .75));
      ctx.globalAlpha = (.18 + .18 * Math.sin(now / 1000 + i)) * reveal;
      ctx.fillStyle = '#d7b854';
      ctx.beginPath();
      ctx.arc(x, y, i % 3 === 0 ? 2 : 1, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.globalAlpha = 1;
    frame = requestAnimationFrame(render);
  }
}
function resize() {
  const rect = canvas.getBoundingClientRect();
  width = rect.width;
  height = rect.height;
  const dpr = Math.min(devicePixelRatio || 1, 2);
  canvas.width = Math.round(width * dpr);
  canvas.height = Math.round(height * dpr);
  ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  if (opened && reducedMotion.matches) render(performance.now());
}
function play() {
  cancelAnimationFrame(frame);
  start = performance.now();
  render(start);
}
kitty.addEventListener('load', () => { if (opened) play(); });
kitty.addEventListener('error', () => {
  canvas.hidden = true;
  document.getElementById('image-error').hidden = false;
});
kitty.src = 'assets/hello-kitty-tallos.png';
document.getElementById('open').addEventListener('click', () => {
  document.getElementById('welcome').hidden = true;
  document.getElementById('garden').hidden = false;
  opened = true;
  resize();
  play();
  const title = document.getElementById('garden-title');
  title.tabIndex = -1;
  title.focus({ preventScroll: true });
});
document.getElementById('replay').addEventListener('click', play);
new ResizeObserver(resize).observe(canvas);
reducedMotion.addEventListener('change', () => { if (opened) play(); });
document.addEventListener('visibilitychange', () => {
  cancelAnimationFrame(frame);
  if (!document.hidden && opened) render(performance.now());
});
