/* ============================================================
   VISHESH TOMAR — INTERACTIVE 3D & MOTION ENGINE
   ============================================================ */

window.addEventListener('DOMContentLoaded', () => {
  initPreloader();
  initCustomCursor();
  initColorTrail();
  initParticles();
  initTypewriter();
  initScrollReveal();
  init3DTilt();
  initCounters();
  initNavbar();
});

/* ──────── PRELOADER LOGIC ──────── */
function initPreloader() {
  const preloader = document.getElementById('preloader');
  const progress = document.getElementById('pre-progress');
  const percent = document.getElementById('pre-percent');
  const status = document.getElementById('pre-status');
  
  const statusMessages = [
    "INITIALIZING CORE SYSTEMS...",
    "LOADING 3D ASSETS...",
    "INJECTING CHROMATIC MOTION...",
    "PREPARING DATA STRUCTURES...",
    "READY TO LAUNCH"
  ];
  
  let width = 0;
  const interval = setInterval(() => {
    width += Math.random() * 15;
    if (width >= 100) {
      width = 100;
      clearInterval(interval);
      setTimeout(() => {
        preloader.classList.add('loaded');
        setTimeout(() => preloader.remove(), 1500);
      }, 500);
    }
    
    progress.style.width = width + '%';
    percent.textContent = Math.floor(width) + '%';
    
    const msgIndex = Math.floor((width / 100) * statusMessages.length);
    status.textContent = statusMessages[Math.min(msgIndex, statusMessages.length - 1)];
  }, 150);
}

/* ──────── CUSTOM CURSOR ──────── */
function initCustomCursor() {
  const cursor = document.getElementById('cursor');
  const ring = document.getElementById('cursor-ring');
  
  let mouseX = 0, mouseY = 0;
  let ringX = 0, ringY = 0;
  
  window.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    
    cursor.style.transform = `translate(${mouseX}px, ${mouseY}px) translate(-50%, -50%)`;
  });
  
  function animate() {
    ringX += (mouseX - ringX) * 0.15;
    ringY += (mouseY - ringY) * 0.15;
    
    ring.style.transform = `translate(${ringX}px, ${ringY}px) translate(-50%, -50%)`;
    
    requestAnimationFrame(animate);
  }
  animate();
  
  // Hover effects
  const interactive = document.querySelectorAll('a, button, .tilt-card');
  interactive.forEach(el => {
    el.addEventListener('mouseenter', () => {
      cursor.style.width = '20px';
      cursor.style.height = '20px';
      ring.style.width = '70px';
      ring.style.height = '70px';
      ring.style.borderColor = 'var(--cyan)';
    });
    el.addEventListener('mouseleave', () => {
      cursor.style.width = '10px';
      cursor.style.height = '10px';
      ring.style.width = '40px';
      ring.style.height = '40px';
      ring.style.borderColor = 'rgba(255,255,255,0.3)';
    });
  });
}

/* ──────── COLOR TRAIL ──────── */
function initColorTrail() {
  const canvas = document.getElementById('trail-canvas');
  const ctx = canvas.getContext('2d');
  
  let width, height;
  let particles = [];
  
  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();
  
  let lastTrailTime = 0;
  window.addEventListener('mousemove', (e) => {
    const now = performance.now();
    if (now - lastTrailTime < 24) return; // throttle to approx 40fps for trail generation
    lastTrailTime = now;
    
    for (let i = 0; i < 2; i++) { // reduced from 3 to 2 particles
      particles.push({
        x: e.clientX,
        y: e.clientY,
        vx: (Math.random() - 0.5) * 2,
        vy: (Math.random() - 0.5) * 2,
        size: Math.random() * 5 + 2,
        color: `hsla(${Math.random() * 60 + 180}, 100%, 50%, 0.5)`,
        life: 1
      });
    }
  });
  
  function animate() {
    ctx.clearRect(0, 0, width, height);
    
    for (let i = particles.length - 1; i >= 0; i--) {
      const p = particles[i];
      p.x += p.vx;
      p.y += p.vy;
      p.life -= 0.02;
      
      if (p.life <= 0) {
        particles.splice(i, 1);
        continue;
      }
      
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size * p.life, 0, Math.PI * 2);
      ctx.fillStyle = p.color;
      ctx.globalAlpha = p.life;
      ctx.fill();
    }
    
    requestAnimationFrame(animate);
  }
  animate();
}

/* ──────── HERO PARTICLES ──────── */
function initParticles() {
  const canvas = document.getElementById('particles-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  
  let width, height, particlesArr = [];
  const count = 40; // reduced from 100 for better performance
  
  function resize() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
  }
  window.addEventListener('resize', resize);
  resize();
  
  class Particle {
    constructor() {
      this.init();
    }
    init() {
      this.x = Math.random() * width;
      this.y = Math.random() * height;
      this.vx = (Math.random() - 0.5) * 0.5;
      this.vy = (Math.random() - 0.5) * 0.5;
      this.size = Math.random() * 2;
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;
      
      if (this.x < 0 || this.x > width) this.vx *= -1;
      if (this.y < 0 || this.y > height) this.vy *= -1;
    }
    draw() {
      ctx.fillStyle = 'rgba(0, 242, 255, 0.3)';
      ctx.beginPath();
      ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
      ctx.fill();
    }
  }
  
  for (let i = 0; i < count; i++) particlesArr.push(new Particle());
  
  function animate() {
    ctx.clearRect(0, 0, width, height);
    particlesArr.forEach(p => {
      p.update();
      p.draw();
    });
    
    // Connect particles
    for (let i = 0; i < count; i++) {
      for (let j = i + 1; j < count; j++) {
        const dx = particlesArr[i].x - particlesArr[j].x;
        const dy = particlesArr[i].y - particlesArr[j].y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        
        if (dist < 150) {
          ctx.strokeStyle = `rgba(0, 242, 255, ${0.1 * (1 - dist/150)})`;
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(particlesArr[i].x, particlesArr[i].y);
          ctx.lineTo(particlesArr[j].x, particlesArr[j].y);
          ctx.stroke();
        }
      }
    }
    
    requestAnimationFrame(animate);
  }
  animate();
}

/* ──────── TYPEWRITER ──────── */
function initTypewriter() {
  const el = document.getElementById('typewriter');
  const strings = [
    "Computer Science Engineer",
    "Data Science Enthusiast",
    "Machine Learning Explorer",
    "DSA Practitioner",
    "Problem Solver"
  ];
  
  let currentStringIndex = 0;
  let currentCharIndex = 0;
  let isDeleting = false;
  
  const glitchChars = '!<>-_\\/[]{}—=+*^?#________';

  function type() {
    const fullText = strings[currentStringIndex];
    let displayText = fullText.substring(0, currentCharIndex);
    
    // Add glitch effect
    if (Math.random() > 0.92) {
      const gChar = glitchChars[Math.floor(Math.random() * glitchChars.length)];
      displayText = (displayText.length > 0 ? displayText.substring(0, displayText.length - 1) : "") + gChar;
    }

    el.textContent = displayText;
    
    if (isDeleting) {
      currentCharIndex--;
    } else {
      currentCharIndex++;
    }
    
    let typeSpeed = isDeleting ? 40 : 80;
    
    if (!isDeleting && currentCharIndex === fullText.length + 1) {
      isDeleting = true;
      typeSpeed = 2000; // Pause at end
    } else if (isDeleting && currentCharIndex === 0) {
      isDeleting = false;
      currentStringIndex = (currentStringIndex + 1) % strings.length;
      typeSpeed = 500; // Pause at start
    }
    
    setTimeout(type, typeSpeed);
  }
  type();
}

/* ──────── SCROLL REVEAL ──────── */
function initScrollReveal() {
  const reveals = document.querySelectorAll('.reveal, .reveal-hero');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        entry.target.classList.add('active'); // consolidate both classes
        if (entry.target.classList.contains('reveal-hero')) {
          entry.target.style.opacity = '1';
          entry.target.style.transform = 'translateY(0)';
          entry.target.style.transition = '0.8s cubic-bezier(0.2, 1, 0.3, 1)';
        }
      }
    });
  }, { threshold: 0.1 });
  
  reveals.forEach(el => observer.observe(el));
}

/* ──────── 3D TILT ──────── */
function init3DTilt() {
  const cards = document.querySelectorAll('.tilt-card');
  
  cards.forEach(card => {
    let rect = null;

    card.addEventListener('mouseenter', () => {
      rect = card.getBoundingClientRect();
      // Disable transition while moving to prevent "buffering" lag
      card.style.transition = 'none';
    });

    card.addEventListener('mousemove', (e) => {
      if (!rect) {
        rect = card.getBoundingClientRect();
      }
      
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      // Increased divisor from 10 to 30 for smoother, subtle rotation
      const rotateX = (centerY - y) / 30;
      const rotateY = (x - centerX) / 30;
      
      requestAnimationFrame(() => {
        // Reduced scale slightly from 1.05 to 1.02 to prevent re-hover flicker
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        
        // Update glow
        const glow = card.querySelector('.acard-glow, .sc-glow, .pc-glow, .tlc-glow, .cc-glow, .ec-glow, .ac-glow');
        if (glow) {
          glow.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(255,255,255,0.1) 0%, transparent 80%)`;
        }
      });
    });
    
    card.addEventListener('mouseleave', () => {
      rect = null;
      // Re-enable transition for smooth return to center
      card.style.transition = 'transform 0.6s cubic-bezier(0.2, 1, 0.3, 1)';
      requestAnimationFrame(() => {
        card.style.transform = `perspective(1000px) rotateX(0) rotateY(0) scale3d(1, 1, 1)`;
      });
    });
  });
}

/* ──────── HERO 3D CARD ──────── */
function initHero3D() {
  const wrap = document.getElementById('hero-3d-wrap');
  const card = document.getElementById('hero-card');
  if (!wrap || !card) return;
  
  wrap.addEventListener('mouseenter', () => {
    card.style.transition = 'none';
  });

  window.addEventListener('mousemove', (e) => {
    const rect = wrap.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    
    // Increased divisor from 15 to 30
    const rotateX = (centerY - y) / 30;
    const rotateY = (x - centerX) / 30;
    
    requestAnimationFrame(() => {
      card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
      
      const img = card.querySelector('.hc-profile-img');
      if (img) {
        img.style.transform = `translateX(${rotateY * 0.3}px) translateY(${-rotateX * 0.3}px) scale(1.1)`;
      }
      
      const shine = card.querySelector('.hc-shine');
      if (shine) {
        shine.style.background = `radial-gradient(circle at ${x}px ${y}px, rgba(255,255,255,0.08) 0%, transparent 60%)`;
      }
    });
  });

  wrap.addEventListener('mouseleave', () => {
    card.style.transition = 'transform 0.6s cubic-bezier(0.2, 1, 0.3, 1)';
    card.style.transform = `rotateX(0deg) rotateY(0deg)`;
    const img = card.querySelector('.hc-profile-img');
    if (img) img.style.transform = `translateX(0) translateY(0) scale(1)`;
  });
}

/* ──────── COUNTERS ──────── */
function initCounters() {
  const counters = document.querySelectorAll('.st-num, .count-up');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = +entry.target.getAttribute('data-target');
        let current = 0;
        const increment = target / 50;
        
        const update = () => {
          current += increment;
          if (current < target) {
            entry.target.textContent = Math.ceil(current);
            setTimeout(update, 20);
          } else {
            entry.target.textContent = target;
          }
        };
        update();
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 1 });
  
  counters.forEach(c => observer.observe(c));
}

/* ──────── NAVBAR ──────── */
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const navToggle = document.getElementById('nav-toggle');
  const navLinks = document.getElementById('nav-links');
  
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  });
  
  navToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    navToggle.classList.toggle('active');
  });
}

