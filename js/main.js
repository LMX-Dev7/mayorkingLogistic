document.addEventListener('DOMContentLoaded', () => {

  // ── Menú móvil: toggle panel + icono menu ↔ x ──────────────────────────────
  const menuToggle = document.getElementById('menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');

  if (menuToggle && mobileMenu) {
    const iconEl = menuToggle.querySelector('[data-lucide]');

    function openMenu() {
      mobileMenu.classList.remove('hidden');
      menuToggle.setAttribute('aria-expanded', 'true');
      menuToggle.setAttribute('aria-label', 'Cerrar menú');
      if (iconEl) { iconEl.setAttribute('data-lucide', 'x'); lucide.createIcons(); }
    }

    function closeMenu() {
      mobileMenu.classList.add('hidden');
      menuToggle.setAttribute('aria-expanded', 'false');
      menuToggle.setAttribute('aria-label', 'Abrir menú');
      if (iconEl) { iconEl.setAttribute('data-lucide', 'menu'); lucide.createIcons(); }
    }

    menuToggle.addEventListener('click', () => {
      mobileMenu.classList.contains('hidden') ? openMenu() : closeMenu();
    });

    mobileMenu.querySelectorAll('a').forEach((link) =>
      link.addEventListener('click', closeMenu)
    );
  }

  // ── Nav activo por sección visible ─────────────────────────────────────────
  const sections  = document.querySelectorAll('section[id]');
  const navLinks  = document.querySelectorAll('nav a[href^="#"]');

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
