const slides = [...document.querySelectorAll('.slide')];
const current = document.getElementById('current');
const dots = document.getElementById('dots');
const prev = document.getElementById('prev');
const next = document.getElementById('next');
let index = 0;
let animating = false;

slides.forEach((_, i) => {
  const dot = document.createElement('button');
  dot.className = 'dot' + (i === 0 ? ' active' : '');
  dot.title = `Diapositiva ${i + 1}`;
  dot.addEventListener('click', () => goToSlide(i));
  dots.appendChild(dot);
});

function updateUI() {
  current.textContent = index + 1;
  [...dots.children].forEach((d, i) => d.classList.toggle('active', i === index));
  prev.disabled = index === 0;
  next.disabled = index === slides.length - 1;
  prev.style.opacity = index === 0 ? '.35' : '1';
  next.style.opacity = index === slides.length - 1 ? '.35' : '1';
}

function goToSlide(target) {
  if (target < 0 || target >= slides.length || target === index || animating) return;
  animating = true;
  const old = index;
  index = target;
  slides[old].classList.remove('active');
  slides[old].classList.add('prev');
  slides[index].classList.remove('prev');
  slides[index].classList.add('active');
  updateUI();
  setTimeout(() => {
    slides[old].classList.remove('prev');
    animating = false;
  }, 700);
}

function nextSlide() { if (index < slides.length - 1) goToSlide(index + 1); }
function prevSlide() { if (index > 0) goToSlide(index - 1); }

next.addEventListener('click', nextSlide);
prev.addEventListener('click', prevSlide);

document.addEventListener('keydown', e => {
  if (['ArrowRight','PageDown',' '].includes(e.key)) {
    e.preventDefault(); nextSlide();
  } else if (['ArrowLeft','PageUp'].includes(e.key)) {
    e.preventDefault(); prevSlide();
  } else if (e.key === 'Home') {
    e.preventDefault(); goToSlide(0);
  } else if (e.key === 'End') {
    e.preventDefault(); goToSlide(slides.length - 1);
  } else if (e.key.toLowerCase() === 'f') {
    toggleFullscreen();
  }
});

document.getElementById('fullscreen').addEventListener('click', toggleFullscreen);

function toggleFullscreen() {
  if (!document.fullscreenElement) {
    document.documentElement.requestFullscreen?.();
  } else {
    document.exitFullscreen?.();
  }
}

let touchStartX = 0;
document.addEventListener('touchstart', e => touchStartX = e.changedTouches[0].screenX, {passive:true});
document.addEventListener('touchend', e => {
  const diff = e.changedTouches[0].screenX - touchStartX;
  if (Math.abs(diff) > 50) diff < 0 ? nextSlide() : prevSlide();
}, {passive:true});

updateUI();
