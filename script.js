
document.addEventListener('DOMContentLoaded', () => {
  const body = document.body;
  const header = document.querySelector('[data-header]');
  const menuButton = document.querySelector('[data-menu-button]');
  const menu = document.querySelector('[data-menu]');
  const submenuButtons = document.querySelectorAll('[data-submenu-button]');

  const updateHeaderState = () => {
    if (!header) return;
    header.classList.toggle('is-scrolled', window.scrollY > 10);
  };

  updateHeaderState();
  window.addEventListener('scroll', updateHeaderState, { passive: true });

  const closeSubmenus = (exceptItem = null) => {
    submenuButtons.forEach((button) => {
      const parentItem = button.closest('.nav-item-has-children');
      if (!parentItem || parentItem === exceptItem) return;
      button.setAttribute('aria-expanded', 'false');
      parentItem.classList.remove('is-open');
    });
  };

  const closeMenu = () => {
    if (!menuButton || !menu) return;
    menuButton.setAttribute('aria-expanded', 'false');
    menu.classList.remove('is-open');
    body.classList.remove('menu-open');
    closeSubmenus();
  };

  if (menuButton && menu) {
    menuButton.addEventListener('click', () => {
      const expanded = menuButton.getAttribute('aria-expanded') === 'true';
      menuButton.setAttribute('aria-expanded', String(!expanded));
      menu.classList.toggle('is-open', !expanded);
      body.classList.toggle('menu-open', !expanded);
    });

    document.addEventListener('click', (event) => {
      if (window.innerWidth <= 900 && menu.classList.contains('is-open') && !menu.contains(event.target) && !menuButton.contains(event.target)) {
        closeMenu();
      }

      if (!event.target.closest('.nav-item-has-children')) {
        closeSubmenus();
      }
    });
  }

  submenuButtons.forEach((button) => {
    const parentItem = button.closest('.nav-item-has-children');
    if (!parentItem) return;
    button.addEventListener('click', (event) => {
      event.preventDefault();
      event.stopPropagation();
      const expanded = button.getAttribute('aria-expanded') === 'true';
      closeSubmenus(parentItem);
      button.setAttribute('aria-expanded', String(!expanded));
      parentItem.classList.toggle('is-open', !expanded);
    });
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 900) {
      closeMenu();
    }
  });

  document.querySelectorAll('.nav-menu a, .nav-actions a').forEach((link) => {
    link.addEventListener('click', () => {
      if (window.innerWidth <= 900) {
        closeMenu();
      }
    });
  });

  const path = window.location.pathname.split('/').pop() || 'index.html';
  const allLinks = document.querySelectorAll('a[href]');
  allLinks.forEach((link) => {
    const href = link.getAttribute('href');
    if (!href || href.startsWith('http') || href.startsWith('mailto:') || href.startsWith('tel:') || href.startsWith('#')) return;
    if (href === path) {
      if (link.classList.contains('nav-link') || link.closest('.dropdown-menu') || link.closest('.subnav-card') || link.closest('.toc-card')) {
        link.setAttribute('aria-current', 'page');
      }
    }
  });

  const groupMap = {
    'energieberatung.html': 'energie',
    'sanierungsfahrplan.html': 'energie',
    'energieausweise.html': 'energie',
    'Heizlastberechnungen inkl. h. Abgl..html': 'energie',
    'baudenkmale.html': 'energie',
    'baubegleitung.html': 'energie',
    'foerdermittel.html': 'energie',
    'statik.html': 'statik',
    'statik-wohnbau.html': 'statik',
    'statik-gewerbebau.html': 'statik',
    'statik-oeffentlich.html': 'statik',
    'statik-bestand.html': 'statik',
    'kontakt.html': 'kontakt'
  };

  const activeGroup = groupMap[path];
  if (activeGroup) {
    const activeItem = document.querySelector(`[data-nav-group="${activeGroup}"]`);
    if (activeItem) {
      activeItem.classList.add('is-active');
    }
  }

  document.querySelectorAll('[data-current-year]').forEach((node) => {
    node.textContent = new Date().getFullYear();
  });
});
