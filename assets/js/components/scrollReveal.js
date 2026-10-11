/**
 * Micro-animações controladas de aparição ao scroll
 * Foco exclusivo em fotos e cards aparecendo na tela de forma suave
 */
export function initScrollReveal() {
  const elements = document.querySelectorAll('.reveal-on-scroll');
  if (!elements.length) return;

  // Fallback se IntersectionObserver não for suportado
  if (!('IntersectionObserver' in window)) {
    elements.forEach(el => el.classList.add('is-revealed'));
    return;
  }

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('is-revealed');
        obs.unobserve(entry.target); // Revela apenas uma vez para alta performance
      }
    });
  }, {
    root: null,
    rootMargin: '0px 0px -40px 0px',
    threshold: 0.15
  });

  elements.forEach(el => observer.observe(el));
}
