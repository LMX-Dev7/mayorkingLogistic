document.addEventListener('DOMContentLoaded', () => {

  // Con IntersectionObserver se activan las apariciones y el botón flotante; sin él todo queda visible
  const hasObserver = 'IntersectionObserver' in window;
  if (hasObserver) document.documentElement.classList.add('js');

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

  // ── Aparición al hacer scroll ──────────────────────────────────────────────
  // Sin JS o sin IntersectionObserver todo queda visible; con JS se oculta y se revela una vez.
  const revealSelectors = ['.section-head', '.step', '.svc-card', '.review', '.why-photo', '.why-copy', '.quote-info', '.quote-form'];
  const revealTargets = Array.from(document.querySelectorAll(revealSelectors.join(',')));

  if (hasObserver && revealTargets.length) {
    revealTargets.forEach((el) => {
      const siblings = Array.from(el.parentElement.children).filter((c) => revealTargets.includes(c));
      el.style.setProperty('--i', Math.min(siblings.indexOf(el), 5));
      el.setAttribute('data-reveal', '');
    });

    const revealObserver = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target;
          revealObserver.unobserve(el);
          el.classList.add('is-in');
          // Al terminar, se libera el elemento para que recupere sus propios hover/transiciones
          const delay = Number(el.style.getPropertyValue('--i') || 0) * 60;
          setTimeout(() => {
            el.removeAttribute('data-reveal');
            el.classList.remove('is-in');
            el.style.removeProperty('--i');
          }, 500 + delay + 100);
        });
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.08 }
    );

    revealTargets.forEach((el) => revealObserver.observe(el));
  }

  // ── WhatsApp flotante: se oculta mientras el hero o el cotizador están a la vista
  // (ahí ya hay un botón de WhatsApp y el flotante taparía contenido)
  const waFloat = document.querySelector('.wa-float');
  const zonasConCta = ['hero', 'cotizar'].map((id) => document.getElementById(id)).filter(Boolean);

  if (hasObserver && waFloat && zonasConCta.length) {
    const visibles = new Set();
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) visibles.add(entry.target.id);
          else visibles.delete(entry.target.id);
        });
        waFloat.classList.toggle('is-visible', visibles.size === 0);
      },
      { threshold: 0.15 }
    );
    zonasConCta.forEach((zona) => observer.observe(zona));
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
