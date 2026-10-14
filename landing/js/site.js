const hero = document.querySelector('.hero-video');
const heroControl = document.querySelector('.hero-video-control');
const heroControlIcon = document.querySelector('.hero-control-icon');
const testimonialVideos = [...document.querySelectorAll('.testi-video video')];
let heroPausedByTestimonial = false;

function updateHeroControl() {
  if (!heroControl || !hero) return;
  const paused = hero.paused;
  heroControlIcon.textContent = paused ? '▶' : '❚❚';
  heroControl.setAttribute('aria-label', paused ? 'Reproducir video' : 'Pausar video');
  heroControl.setAttribute('aria-pressed', String(!paused));
  // El control solo se muestra si el video está pausado. Al reproducirse desaparece.
  heroControl.classList.toggle('hero-control-hidden', !paused);
}

function startHero() {
  if (!hero || heroPausedByTestimonial) return;
  hero.volume = 1;
  // Intento directo con audio. Si el navegador lo bloquea, el botón Play queda visible.
  hero.muted = false;
  hero.defaultMuted = false;
  hero.play().then(() => {
    hero.volume = 1;
    updateHeroControl();
  }).catch(() => {
    updateHeroControl();
  });
}

if (hero) {
  // Carga y reproducción automática apenas el navegador tenga datos suficientes.
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startHero, { once: true });
  } else {
    startHero();
  }
  hero.addEventListener('loadedmetadata', startHero, { once: true });
  hero.addEventListener('canplay', startHero, { once: true });
  hero.addEventListener('play', () => {
    heroPausedByTestimonial = false;
    updateHeroControl();
  });
  hero.addEventListener('pause', updateHeroControl);
  hero.addEventListener('playing', updateHeroControl);
  updateHeroControl();
}

if (heroControl && hero) {
  heroControl.addEventListener('click', (event) => {
    event.preventDefault();
    event.stopPropagation();
    if (hero.paused) {
      heroPausedByTestimonial = false;
      hero.muted = false;
      hero.volume = 1;
      hero.play().catch(() => {
        // Si el navegador exige una interacción adicional, este mismo clic ya cuenta.
        hero.muted = true;
        hero.play().then(() => { hero.muted = false; }).catch(() => {});
      });
    } else {
      hero.pause();
    }
    updateHeroControl();
  });
}

// Al iniciar un testimonio, el principal se pausa y solo queda activo el testimonio elegido.
testimonialVideos.forEach((video) => {
  video.addEventListener('play', () => {
    heroPausedByTestimonial = true;
    if (hero && !hero.paused) hero.pause();
    testimonialVideos.forEach((other) => {
      if (other !== video && !other.paused) other.pause();
    });
  });
});

document.querySelectorAll('[data-cta]').forEach(a =>
  a.addEventListener('click', () => {
    try { localStorage.setItem('cta_click', new Date().toISOString()); } catch (e) {}
  })
);

// Iconos de play de los testimonios: desaparecen mientras el video se reproduce.
function bindPlayOverlay(video, overlay) {
  if (!video || !overlay) return;
  const hide = () => overlay.classList.add('video-play-hidden');
  const show = () => overlay.classList.remove('video-play-hidden');
  video.addEventListener('play', hide);
  video.addEventListener('playing', hide);
  video.addEventListener('pause', show);
  video.addEventListener('ended', show);
  if (!video.paused) hide();
}

document.querySelectorAll('.testi-video').forEach(wrap => {
  bindPlayOverlay(wrap.querySelector('video'), wrap.querySelector('.testi-play'));
});
