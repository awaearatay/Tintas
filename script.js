const swatches = document.querySelectorAll('.swatches button');
const colorPreview = document.querySelector('.paint-brush');
const colorLabel = document.querySelector('.color-label b');
swatches.forEach((button) => {
  button.addEventListener('click', () => {
    colorPreview.style.backgroundColor = button.style.getPropertyValue('--swatch');
    colorLabel.textContent = button.dataset.name;
  });
});
const menuButton = document.querySelector('.menu-button');
const menu = document.querySelector('#menu');
menuButton.addEventListener('click', () => {
  const closed = menu.classList.toggle('closed');
  menuButton.setAttribute('aria-expanded', String(!closed));
});

const carousel = document.querySelector('.product-carousel');
if (carousel) {
  const slides = [...carousel.querySelectorAll('.product-slide')];
  const track = carousel.querySelector('.product-track');
  const dots = carousel.querySelector('.product-dots');
  const count = document.querySelector('.product-count');
  const pauseButton = carousel.querySelector('.product-pause');
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let current = 0;
  let paused = reducedMotion.matches;
  let timer;
  function show(index) {
    current = (index + slides.length) % slides.length;
    track.style.transform = `translateX(-${current * 100}%)`;
    slides.forEach((slide, i) => { slide.inert = i !== current; slide.setAttribute('aria-hidden', String(i !== current)); });
    [...dots.children].forEach((dot, i) => dot.setAttribute('aria-current', String(i === current)));
    count.textContent = `${current + 1} / ${slides.length}`;
  }
  function schedule() { clearInterval(timer); if (!paused) timer = setInterval(() => show(current + 1), 5000); }
  slides.forEach((slide, i) => { const dot = document.createElement('button'); dot.type = 'button'; dot.setAttribute('aria-label', `Mostrar produto ${i + 1}`); dot.addEventListener('click', () => { show(i); schedule(); }); dots.appendChild(dot); });
  carousel.querySelector('.product-prev').addEventListener('click', () => { show(current - 1); schedule(); });
  carousel.querySelector('.product-next').addEventListener('click', () => { show(current + 1); schedule(); });
  pauseButton.addEventListener('click', () => { paused = !paused; pauseButton.textContent = paused ? 'Reproduzir' : 'Pausar'; pauseButton.setAttribute('aria-pressed', String(paused)); schedule(); });
  if (paused) { pauseButton.textContent = 'Reproduzir'; pauseButton.setAttribute('aria-pressed', 'true'); }
  show(0); schedule();
}
