document.addEventListener('DOMContentLoaded', () => {

  // ── Menú móvil: panel + cierre con Escape ──────────────────────────────────
  const menuToggle = document.getElementById('menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');

  if (menuToggle && mobileMenu) {
    function openMenu() {
      mobileMenu.classList.remove('hidden');
      menuToggle.setAttribute('aria-expanded', 'true');
      menuToggle.setAttribute('aria-label', 'Cerrar menú');
    }

    function closeMenu() {
      mobileMenu.classList.add('hidden');
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.setAttribute('aria-label', 'Abrir menú');
    }

    menuToggle.addEventListener('click', () => {
      mobileMenu.classList.contains('hidden') ? openMenu() : closeMenu();
    });

    mobileMenu.querySelectorAll('a').forEach((link) =>
      link.addEventListener('click', closeMenu)
    );

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && !mobileMenu.classList.contains('hidden')) {
        closeMenu();
        menuToggle.focus();
      }
    });
  }

  // ── WhatsApp flotante: se oculta mientras el cotizador está a la vista ─────
  const waFloat = document.querySelector('.wa-float');
  const cotizador = document.getElementById('cotizar');

  if (waFloat && cotizador) {
    new IntersectionObserver(
      ([entry]) => waFloat.classList.toggle('is-oculto', entry.isIntersecting),
      { threshold: 0.15 }
    ).observe(cotizador);
  }

  // ── Nav activo por sección visible ─────────────────────────────────────────
  const sections  = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('.nav-links a[href^="#"]');

  if (sections.length && navLinks.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          navLinks.forEach((link) => {
            const active = link.getAttribute('href') === `#${entry.target.id}`;
            link.classList.toggle('is-active', active);
          });
        });
      },
      { rootMargin: '-25% 0px -65% 0px' }
    );

    sections.forEach((section) => observer.observe(section));
  }

});
