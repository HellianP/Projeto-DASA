/**
 * Componente de Navegação Mobile & Interações de Header
 */

export function initMobileNav() {
  const toggleBtn = document.getElementById('mobile-menu-toggle');
  const navMenu = document.getElementById('main-nav');
  const backdrop = document.getElementById('nav-backdrop');
  const navLinks = document.querySelectorAll('.nav-link, .nav-cta-btn');

  if (!toggleBtn || !navMenu) return;

  function openMenu() {
    toggleBtn.classList.add('is-active');
    toggleBtn.setAttribute('aria-expanded', 'true');
    navMenu.classList.add('is-open');
    if (backdrop) backdrop.classList.add('is-visible');
    document.body.classList.add('no-scroll');
  }

  function closeMenu() {
    toggleBtn.classList.remove('is-active');
    toggleBtn.setAttribute('aria-expanded', 'false');
    navMenu.classList.remove('is-open');
    if (backdrop) backdrop.classList.remove('is-visible');
    document.body.classList.remove('no-scroll');
  }

  toggleBtn.addEventListener('click', () => {
    const isOpen = navMenu.classList.contains('is-open');
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  if (backdrop) {
    backdrop.addEventListener('click', closeMenu);
  }

  // Fecha o menu ao clicar em qualquer link
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeMenu();
    });
  });

  // Highlight do link ativo ao rolar
  const sections = document.querySelectorAll('section[id]');
  window.addEventListener('scroll', () => {
    const scrollY = window.pageYOffset;

    sections.forEach(current => {
      const sectionHeight = current.offsetHeight;
      const sectionTop = current.offsetTop - 120;
      const sectionId = current.getAttribute('id');
      const targetLink = document.querySelector(`.nav-link[href*="${sectionId}"]`);

      if (targetLink) {
        if (scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
          targetLink.classList.add('active');
        } else {
          targetLink.classList.remove('active');
        }
      }
    });
  }, { passive: true });
}
