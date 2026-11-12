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
  const track = carousel.querySelector('.product-track');
  const slides = [...track.querySelectorAll('.product-slide')];
  const dots = carousel.querySelector('.product-dots');
  const count = document.querySelector('.product-count');
  const pauseButton = carousel.querySelector('.product-pause');
  const firstClone = slides[0].cloneNode(true);
  const lastClone = slides[slides.length - 1].cloneNode(true);
  [firstClone, lastClone].forEach(clone => {
    clone.inert = true;
    clone.setAttribute('aria-hidden', 'true');
  });
  track.prepend(lastClone);
  track.append(firstClone);
  let position = 1;
  let moving = false;
  let paused = false;
  let timer;
  let finishTimer;
  let touchX = null;
  function paint(animate = true) {
    track.classList.toggle('is-resetting', !animate);
    track.style.transform = `translate3d(-${position * 100}%, 0, 0)`;
    const selected = (position - 1 + slides.length) % slides.length;
    slides.forEach((slide, i) => {
      slide.inert = i !== selected;
      slide.setAttribute('aria-hidden', String(i !== selected));
    });
    [...dots.children].forEach((dot, i) => dot.setAttribute('aria-current', String(i === selected)));
    count.textContent = `${selected + 1} / ${slides.length}`;
  }
  function settle() {
    if (!moving) return;
    clearTimeout(finishTimer);
    if (position === 0) position = slides.length;
    if (position === slides.length + 1) position = 1;
    paint(false);
    void track.offsetWidth;
    moving = false;
  }
  function moveTo(next) {
    if (moving || next === position) return;
    position = next;
    moving = true;
    paint(true);
    finishTimer = setTimeout(settle, 2200);
  }
  function schedule() {
    clearInterval(timer);
    if (!paused) timer = setInterval(() => moveTo(position + 1), 4000);
  }
  track.addEventListener('transitionend', event => {
    if (event.target === track && event.propertyName === 'transform') settle();
  });
  slides.forEach((slide, i) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.setAttribute('aria-label', `Mostrar produto ${i + 1}`);
    dot.addEventListener('click', () => { moveTo(i + 1); schedule(); });
    dots.appendChild(dot);
  });
  carousel.querySelector('.product-prev').addEventListener('click', () => { moveTo(position - 1); schedule(); });
  carousel.querySelector('.product-next').addEventListener('click', () => { moveTo(position + 1); schedule(); });
  pauseButton.addEventListener('click', () => {
    paused = !paused;
    pauseButton.textContent = paused ? 'Reproduzir' : 'Pausar';
    pauseButton.setAttribute('aria-pressed', String(paused));
    schedule();
  });
  carousel.addEventListener('touchstart', event => { touchX = event.changedTouches[0].clientX; }, { passive: true });
  carousel.addEventListener('touchend', event => {
    if (touchX === null) return;
    const delta = event.changedTouches[0].clientX - touchX;
    touchX = null;
    if (Math.abs(delta) > 45) { moveTo(position + (delta < 0 ? 1 : -1)); schedule(); }
  }, { passive: true });
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) clearInterval(timer);
    else { settle(); schedule(); }
  });
  paint(false);
  schedule();
}
