// Mobile nav toggle
const navToggle = document.getElementById('nav-toggle');
const mainNav = document.getElementById('main-nav');

if (navToggle && mainNav) {
  navToggle.addEventListener('click', () => {
    mainNav.classList.toggle('open');
    // toggle aria-expanded for accessibility
    const expanded = navToggle.getAttribute('aria-expanded') === 'true';
    navToggle.setAttribute('aria-expanded', String(!expanded));
    navToggle.classList.toggle('active');
  });

  // Close nav when a link is clicked
  mainNav.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      mainNav.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
      navToggle.classList.remove('active');
    });
  });
}

// --- Theme toggle (persist in localStorage) ---
const themeToggle = document.getElementById('theme-toggle');
const root = document.documentElement;

function applyTheme(theme) {
  if (theme === 'dark') root.setAttribute('data-theme', 'dark');
  else root.removeAttribute('data-theme');
}

function getPreferredTheme() {
  const saved = localStorage.getItem('theme');
  if (saved) return saved;
  // fallback to system
  const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
  return prefersDark ? 'dark' : 'light';
}

// initialize theme on load
applyTheme(getPreferredTheme());

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const current = root.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    const next = current === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    localStorage.setItem('theme', next);
  });
}

// Set current year in footer
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Smooth scroll fallback for browsers without CSS smooth behavior
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (!href || href === '#') return;
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      const top = target.getBoundingClientRect().top + window.pageYOffset - 16;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  });
});

// --- Initialize AOS (Animate On Scroll) ---
document.addEventListener('DOMContentLoaded', () => {
  AOS.init({
    duration: 800,
    easing: 'ease-out',
    once: true,
    offset: 100
  });

  // header scrolled state
  const header = document.querySelector('.site-header');
  function onScroll(){
    if(window.scrollY > 24) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  }
  onScroll();
  window.addEventListener('scroll', onScroll, {passive:true});

  // --- Active nav link highlight based on visible section ---
  const sections = Array.from(document.querySelectorAll('main section[id]'));
  const navLinks = Array.from(document.querySelectorAll('.main-nav a'));

  const sectionObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      const id = entry.target.id;
      const link = document.querySelector('.main-nav a[href="#' + id + '"]');
      if (entry.isIntersecting) {
        navLinks.forEach(l => l.classList.remove('active'));
        if (link) link.classList.add('active');
      }
    });
  }, { rootMargin: '-30% 0px -55% 0px', threshold: 0 });

  sections.forEach(s => sectionObserver.observe(s));

  // --- Animated cursor (desktop only) ---
  const cursorEl = document.querySelector('.custom-cursor');
  const isCoarse = window.matchMedia && window.matchMedia('(pointer: coarse)').matches;
  if (cursorEl && !isCoarse) {
    let x = 0, y = 0, tx = 0, ty = 0;
    let rafId;

    const render = () => {
      tx += (x - tx) * 0.18;
      ty += (y - ty) * 0.18;
      cursorEl.style.transform = `translate(${tx}px, ${ty}px)`;
      rafId = requestAnimationFrame(render);
    };

    const show = () => {
      cursorEl.classList.add('visible');
      document.body.classList.add('has-custom-cursor');
      if (!rafId) rafId = requestAnimationFrame(render);
    };

    const hide = () => {
      cursorEl.classList.remove('visible', 'down');
      document.body.classList.remove('has-custom-cursor');
      if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
    };

    window.addEventListener('mousemove', (e) => {
      x = e.clientX;
      y = e.clientY;
      show();
    }, { passive: true });

    window.addEventListener('mousedown', () => cursorEl.classList.add('down'));
    window.addEventListener('mouseup', () => cursorEl.classList.remove('down'));
    window.addEventListener('mouseleave', hide);
  }
});

// --- Simple typing loop for the subtitle (non-blocking, accessible) ---
(function(){
  const el = document.getElementById('typed');
  if(!el) return;
  const phrases = ['IT Technical Support', 'Web Developer', 'System Admin'];
  let idx = 0, char = 0, forward = true;

  function tick(){
    const current = phrases[idx];
    if(forward){
      char++;
      el.textContent = current.slice(0,char);
      if(char === current.length){
        forward = false;
        setTimeout(tick, 900);
        return;
      }
    } else {
      char--;
      el.textContent = current.slice(0,char);
      if(char === 0){
        forward = true;
        idx = (idx + 1) % phrases.length;
      }
    }
    setTimeout(tick, forward ? 60 : 26);
  }
  // start with a small delay
  setTimeout(tick, 700);
})();

// --- Particle Network Background Animation ---
(function() {
  const canvas = document.getElementById('particle-canvas');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  let particles = [];
  let animationId;
  
  // Set canvas size
  function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);
  
  // Particle class
  class Particle {
    constructor() {
      this.x = Math.random() * canvas.width;
      this.y = Math.random() * canvas.height;
      this.vx = (Math.random() - 0.5) * 0.5;
      this.vy = (Math.random() - 0.5) * 0.5;
      this.radius = Math.random() * 2 + 1;
    }
    
    update() {
      this.x += this.vx;
      this.y += this.vy;
      
      // Wrap around edges
      if (this.x < 0) this.x = canvas.width;
      if (this.x > canvas.width) this.x = 0;
      if (this.y < 0) this.y = canvas.height;
      if (this.y > canvas.height) this.y = 0;
    }
    
    draw() {
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fillStyle = 'rgba(31, 41, 51, 0.5)';
      ctx.fill();
    }
  }
  
  // Create particles
  function init() {
    particles = [];
    const particleCount = Math.min(Math.floor((canvas.width * canvas.height) / 15000), 100);
    for (let i = 0; i < particleCount; i++) {
      particles.push(new Particle());
    }
  }
  
  // Draw lines between nearby particles
  function drawConnections() {
    const maxDistance = 120;
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const dx = particles[i].x - particles[j].x;
        const dy = particles[i].y - particles[j].y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        if (distance < maxDistance) {
          const opacity = (1 - distance / maxDistance) * 0.3;
          ctx.beginPath();
          ctx.moveTo(particles[i].x, particles[i].y);
          ctx.lineTo(particles[j].x, particles[j].y);
          ctx.strokeStyle = `rgba(31, 41, 51, ${opacity})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }
  }
  
  // Animation loop
  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    particles.forEach(particle => {
      particle.update();
      particle.draw();
    });
    
    drawConnections();
    
    animationId = requestAnimationFrame(animate);
  }
  
  // Start animation
  init();
  animate();
  
  // Reinitialize on resize
  window.addEventListener('resize', () => {
    init();
  });
})();
