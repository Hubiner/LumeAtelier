/* global */ 'use strict';

const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ─── YEAR NO FOOTER ──────────────────────────────────────────────────────────
const footerYear = document.getElementById('footerYear');
if (footerYear) {
  footerYear.textContent = new Date().getFullYear();
}

// ─── HEADER: STICKY SCROLL EFFECT ────────────────────────────────────────────
const siteHeader = document.querySelector('.site-header');
if (siteHeader) {
  const onScroll = () => {
    siteHeader.classList.toggle('scrolled', window.scrollY > 48);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
}

// ─── HAMBURGER MENU ───────────────────────────────────────────────────────────
const hamburger   = document.getElementById('hamburger');
const mobileNav   = document.getElementById('mobileNav');
const navOverlay  = document.getElementById('navOverlay');

const openMobileNav = () => {
  hamburger.setAttribute('aria-expanded', 'true');
  mobileNav.classList.add('is-open');
  mobileNav.removeAttribute('aria-hidden');
  navOverlay.classList.add('is-visible');
  document.body.style.overflow = 'hidden';
};

const closeMobileNav = () => {
  hamburger.setAttribute('aria-expanded', 'false');
  mobileNav.classList.remove('is-open');
  mobileNav.setAttribute('aria-hidden', 'true');
  navOverlay.classList.remove('is-visible');
  document.body.style.overflow = '';
};

if (hamburger && mobileNav && navOverlay) {
  hamburger.addEventListener('click', () => {
    const isOpen = hamburger.getAttribute('aria-expanded') === 'true';
    isOpen ? closeMobileNav() : openMobileNav();
  });

  navOverlay.addEventListener('click', closeMobileNav);

  // Fechar com Escape
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && hamburger.getAttribute('aria-expanded') === 'true') {
      closeMobileNav();
      hamburger.focus();
    }
  });

  // Fechar ao clicar em link interno
  mobileNav.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', closeMobileNav);
  });
}

// ─── VAPOR CANVAS (HERO) ──────────────────────────────────────────────────────
const vaporCanvas = document.getElementById('vaporCanvas');

if (vaporCanvas && !prefersReducedMotion) {
  const context = vaporCanvas.getContext('2d');
  const particles = Array.from({ length: 22 }, () => ({
    x:     Math.random(),
    y:     Math.random(),
    size:  Math.random() * 30 + 14,
    speed: Math.random() * 0.0018 + 0.0007,
    drift: Math.random() * 0.0025 - 0.00125,
    alpha: Math.random() * 0.15 + 0.06,
  }));

  const resize = () => {
    vaporCanvas.width  = vaporCanvas.offsetWidth;
    vaporCanvas.height = vaporCanvas.offsetHeight;
  };

  const render = () => {
    context.clearRect(0, 0, vaporCanvas.width, vaporCanvas.height);
    particles.forEach((p) => {
      p.y -= p.speed;
      p.x += p.drift;

      if (p.y < -0.12) { p.y = 1.12; p.x = Math.random(); }

      const x = p.x * vaporCanvas.width;
      const y = p.y * vaporCanvas.height;
      const grad = context.createRadialGradient(x, y, 0, x, y, p.size);
      grad.addColorStop(0, `rgba(240, 228, 208, ${p.alpha})`);
      grad.addColorStop(1, 'rgba(240, 228, 208, 0)');
      context.fillStyle = grad;
      context.beginPath();
      context.arc(x, y, p.size, 0, Math.PI * 2);
      context.fill();
    });
    requestAnimationFrame(render);
  };

  window.addEventListener('resize', resize, { passive: true });
  resize();
  render();
}

// ─── STATUS BADGE (ABERTO / FECHADO) ─────────────────────────────────────────
const openBadge  = document.getElementById('openBadge');
const openStatus = document.getElementById('openStatus');
const openHours  = document.getElementById('openHours');

if (openBadge && openStatus && openHours) {
  const now            = new Date();
  const day            = now.getDay();                          // 0=Dom … 6=Sáb
  const currentMinutes = now.getHours() * 60 + now.getMinutes();
  const isServiceDay   = day >= 2 && day <= 6;                 // Ter–Sáb
  const isOpen         = isServiceDay
                         && currentMinutes >= 19 * 60
                         && currentMinutes <= 23 * 60 + 30;

  openHours.textContent  = 'Ter a Sáb · 19h às 23h30';
  openBadge.textContent  = isOpen ? 'Aberto agora' : 'Fechado';
  openBadge.classList.add(isOpen ? 'open' : 'closed');
  openStatus.textContent = isOpen
    ? 'Serviço em andamento — reservas e walk-ins limitados.'
    : 'Fora do horário de serviço. Reserve sua próxima experiência.';
}

// ─── MENU ORIGAMI ─────────────────────────────────────────────────────────────
document.querySelectorAll('.origami-trigger').forEach((trigger) => {
  trigger.addEventListener('click', () => {
    const card   = trigger.closest('.origami-card');
    const isOpen = trigger.getAttribute('aria-expanded') === 'true';

    // Fechar todos os outros
    document.querySelectorAll('.origami-card.is-open').forEach((c) => {
      if (c !== card) {
        c.classList.remove('is-open');
        c.querySelector('.origami-trigger').setAttribute('aria-expanded', 'false');
      }
    });

    trigger.setAttribute('aria-expanded', String(!isOpen));
    card.classList.toggle('is-open', !isOpen);
  });
});

// ─── LUPA (GALERIA) ───────────────────────────────────────────────────────────
document.querySelectorAll('.dish-card').forEach((card) => {
  const media  = card.querySelector('.dish-media');
  const loupe  = card.querySelector('.loupe');
  const image  = card.dataset.image;

  if (!media || !loupe) return;

  loupe.style.backgroundImage = `url(${image})`;

  media.addEventListener('pointermove', (event) => {
    const rect     = media.getBoundingClientRect();
    const x        = event.clientX - rect.left;
    const y        = event.clientY - rect.top;
    const xPercent = (x / rect.width)  * 100;
    const yPercent = (y / rect.height) * 100;
    const half     = loupe.offsetWidth / 2;

    loupe.style.opacity           = '1';
    loupe.style.left              = `${x - half}px`;
    loupe.style.top               = `${y - half}px`;
    loupe.style.backgroundPosition = `${xPercent}% ${yPercent}%`;
  });

  media.addEventListener('pointerleave', () => {
    loupe.style.opacity = '0';
  });
});

// ─── MAPA DE MESAS ────────────────────────────────────────────────────────────
const tableTooltip      = document.getElementById('tableTooltip');
const selectedTableInput = document.getElementById('selectedTable');

document.querySelectorAll('.table').forEach((table) => {
  const showTooltip = () => {
    const rect       = table.getBoundingClientRect();
    const parentRect = table.parentElement.getBoundingClientRect();
    tableTooltip.textContent  = `${table.dataset.table} · ${table.dataset.capacity} · ${table.dataset.status}`;
    tableTooltip.style.left   = `${rect.left - parentRect.left - 8}px`;
    tableTooltip.style.top    = `${rect.top  - parentRect.top - 52}px`;
    tableTooltip.classList.add('show');
    tableTooltip.removeAttribute('aria-hidden');
  };

  const hideTooltip = () => {
    tableTooltip.classList.remove('show');
    tableTooltip.setAttribute('aria-hidden', 'true');
  };

  table.addEventListener('pointerenter', showTooltip);
  table.addEventListener('focus',        showTooltip);
  table.addEventListener('pointerleave', hideTooltip);
  table.addEventListener('blur',         hideTooltip);

  table.addEventListener('click', () => {
    if (table.classList.contains('occupied')) {
      if (selectedTableInput) {
        selectedTableInput.value = `${table.dataset.table} — indisponível no momento`;
      }
      return;
    }
    document.querySelectorAll('.table').forEach((t) => t.classList.remove('selected'));
    table.classList.add('selected');
    if (selectedTableInput) {
      selectedTableInput.value = `${table.dataset.table} · ${table.dataset.capacity}`;
    }
  });
});

// ─── FORMULÁRIO DE RESERVA ────────────────────────────────────────────────────
const reserveBtn      = document.getElementById('reserveBtn');
const reserveForm     = document.getElementById('reserveForm');
const formFeedback    = document.getElementById('formFeedback');

if (reserveBtn && reserveForm && formFeedback) {
  reserveBtn.addEventListener('click', () => {
    const name  = document.getElementById('guestName')?.value.trim();
    const date  = document.getElementById('guestDate')?.value;
    const table = selectedTableInput?.value;

    if (!name) {
      formFeedback.textContent = 'Por favor, informe seu nome.';
      formFeedback.className   = 'form-feedback error';
      document.getElementById('guestName')?.focus();
      return;
    }

    if (!date) {
      formFeedback.textContent = 'Por favor, selecione uma data.';
      formFeedback.className   = 'form-feedback error';
      document.getElementById('guestDate')?.focus();
      return;
    }

    if (!table || table === 'Escolha uma mesa disponível') {
      formFeedback.textContent = 'Selecione uma mesa disponível no mapa.';
      formFeedback.className   = 'form-feedback error';
      return;
    }

    // Simula envio
    reserveBtn.disabled      = true;
    reserveBtn.textContent   = 'Enviando…';

    setTimeout(() => {
      formFeedback.textContent = '✓ Solicitação recebida! Entraremos em contato em breve.';
      formFeedback.className   = 'form-feedback';
      reserveBtn.textContent   = 'Solicitação enviada';
      reserveForm.reset();
      if (selectedTableInput) selectedTableInput.value = 'Escolha uma mesa disponível';
      document.querySelectorAll('.table').forEach((t) => t.classList.remove('selected'));
    }, 900);
  });
}

// ─── TYPEWRITER (COM INTERSECTIONOBSERVER) ────────────────────────────────────
const typewriterElements = Array.from(document.querySelectorAll('.typewriter'));

if (typewriterElements.length) {
  const typeText = (element, text, delay = 0) => {
    if (prefersReducedMotion) {
      element.textContent = text;
      return;
    }

    let index = 0;
    const start = () => {
      if (index <= text.length) {
        element.textContent = text.slice(0, index);
        index += 1;
        setTimeout(start, 24);
      }
    };
    setTimeout(start, delay);
  };

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, i) => {
          if (entry.isIntersecting) {
            const el   = entry.target;
            const text = el.dataset.text || '';
            typeText(el, text, i * 800);  // delay escalonado entre os dois
            observer.unobserve(el);
          }
        });
      },
      { threshold: 0.4 }
    );

    typewriterElements.forEach((el) => observer.observe(el));
  } else {
    // Fallback sem IntersectionObserver
    typewriterElements.forEach((el, i) => {
      typeText(el, el.dataset.text || '', i * 800);
    });
  }
}
