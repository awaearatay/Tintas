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
