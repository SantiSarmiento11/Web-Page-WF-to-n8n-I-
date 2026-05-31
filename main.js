/* main.js – Shared across both pages */

// ── Nav scroll effect ──
const navbar = document.getElementById('navbar');
if (navbar) {
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 20);
  });
}

// ── Scroll-reveal (IntersectionObserver) ──
const revealEls = document.querySelectorAll('.animate-reveal');
if (revealEls.length) {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        // stagger siblings inside same parent
        const siblings = [...e.target.parentElement.querySelectorAll('.animate-reveal:not(.visible)')];
        const idx = siblings.indexOf(e.target);
        e.target.style.transitionDelay = `${idx * 80}ms`;
        e.target.classList.add('visible');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });
  revealEls.forEach(el => observer.observe(el));
}

// ── Hide scroll hint after scroll ──
const scrollHint = document.getElementById('scroll-hint');
if (scrollHint) {
  window.addEventListener('scroll', () => {
    if (window.scrollY > 60) scrollHint.style.opacity = '0';
    else scrollHint.style.opacity = '1';
  });
}
