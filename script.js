/* ═══════════════════════════════════════════════
   SUCCESS GRAPHS — script.js
═══════════════════════════════════════════════ */

/* ══════════════════════════════════════
   1. STICKY NAVBAR
══════════════════════════════════════ */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 50);
});

/* ══════════════════════════════════════
   2. HAMBURGER MENU — right-side drawer
══════════════════════════════════════ */
const hamburger   = document.getElementById('hamburger');
const navLinks    = document.getElementById('navLinks');
const navBackdrop = document.getElementById('navBackdrop');

function openMenu() {
  hamburger.classList.add('open');
  navLinks.classList.add('open');
  if (navBackdrop) navBackdrop.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeMenu() {
  hamburger.classList.remove('open');
  navLinks.classList.remove('open');
  if (navBackdrop) navBackdrop.classList.remove('open');
  document.body.style.overflow = '';
}

hamburger.addEventListener('click', (e) => {
  e.stopPropagation();
  navLinks.classList.contains('open') ? closeMenu() : openMenu();
});
if (navBackdrop) navBackdrop.addEventListener('click', closeMenu);
navLinks.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
document.addEventListener('click', e => {
  if (!navbar.contains(e.target) && navLinks.classList.contains('open')) closeMenu();
});

/* ══════════════════════════════════════
   3. HERO DOT-FIELD
══════════════════════════════════════ */
function buildDotField() {
  const field = document.getElementById('dotField');
  if (!field) return;
  const W = window.innerWidth, H = window.innerHeight;
  const cols = Math.floor(W / 60), rows = Math.floor(H / 60);
  const total = cols * rows;
  const frag = document.createDocumentFragment();

  for (let i = 0; i < total; i++) {
    const dot = document.createElement('div');
    const x = (i % cols) * 60 + Math.random() * 30;
    const y = Math.floor(i / cols) * 60 + Math.random() * 30;
    const size = Math.random() > .93 ? 4 : 2;
    const opacity = (.05 + Math.random() * .2).toFixed(2);
    const dur = (3 + Math.random() * 5).toFixed(1);
    const delay = (Math.random() * 6).toFixed(1);

    Object.assign(dot.style, {
      position: 'absolute',
      left: x + 'px', top: y + 'px',
      width: size + 'px', height: size + 'px',
      borderRadius: '50%',
      background: Math.random() > .5 ? '#2cc597' : '#0d3059',
      opacity,
      animation: `dotPulse ${dur}s ${delay}s ease-in-out infinite`
    });
    frag.appendChild(dot);
  }
  field.appendChild(frag);
}
const styleTag = document.createElement('style');
styleTag.textContent = `
@keyframes dotPulse {
  0%, 100% { opacity: var(--op, .1); transform: scale(1); }
  50%       { opacity: calc(var(--op, .1) * 2.5); transform: scale(1.8); }
}`;
document.head.appendChild(styleTag);
buildDotField();

/* ══════════════════════════════════════
   4. SCROLL REVEAL
══════════════════════════════════════ */
const revealEls = document.querySelectorAll('.reveal, .fade-up');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) { e.target.classList.add('in'); revealObserver.unobserve(e.target); }
  });
}, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });

revealEls.forEach(el => revealObserver.observe(el));
setTimeout(() => {
  document.querySelectorAll('.hero .fade-up').forEach((el, i) => {
    setTimeout(() => el.classList.add('in'), i * 130);
  });
}, 200);

/* ══════════════════════════════════════
   5. COUNTER ANIMATION
══════════════════════════════════════ */
function animateCounter(el) {
  const target = parseInt(el.dataset.to, 10);
  const duration = 1600;
  const start = performance.now();
  const update = (now) => {
    const progress = Math.min((now - start) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 3);
    el.textContent = Math.floor(eased * target);
    if (progress < 1) requestAnimationFrame(update);
    else el.textContent = target;
  };
  requestAnimationFrame(update);
}
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) { animateCounter(e.target); counterObserver.unobserve(e.target); }
  });
}, { threshold: 0.5 });
document.querySelectorAll('.counter').forEach(el => counterObserver.observe(el));

/* ══════════════════════════════════════
   6. TESTIMONIAL MARQUEE
══════════════════════════════════════ */
const track = document.getElementById('marqueeTrack');
if (track) {
  const cards = Array.from(track.children);
  cards.forEach(card => { const clone = card.cloneNode(true); track.appendChild(clone); });
}

/* ══════════════════════════════════════
   7. ACTIVE NAV LINK ON SCROLL
   CHANGE 3: color is now green (set in CSS),
   not light/faded white
══════════════════════════════════════ */
const sections   = document.querySelectorAll('section[id]');
const navAnchors = document.querySelectorAll('.nav-link');

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      const id = e.target.id;
      navAnchors.forEach(a => {
        a.classList.toggle('active', a.getAttribute('href') === '#' + id);
      });
    }
  });
}, { threshold: 0.4 });
sections.forEach(s => sectionObserver.observe(s));

/* ══════════════════════════════════════
   8. CONTACT FORM → WHATSAPP
   CHANGE 1: Form sends message to WhatsApp
   Fields: Full Name, Country, Subject, Message
══════════════════════════════════════ */
const WHATSAPP_NUMBER = '923331115156'; // without + sign

const form      = document.getElementById('contactForm');
const submitBtn = document.getElementById('submitBtn');
const statusDiv = document.getElementById('formStatus');

function showStatus(msg, type) {
  if (!statusDiv) return;
  statusDiv.textContent = msg;
  statusDiv.className = 'form-status ' + type;
  if (type === 'success') {
    setTimeout(() => { statusDiv.textContent = ''; statusDiv.className = 'form-status'; }, 6000);
  }
}

function highlightError(input) {
  input.style.borderColor = '#ff6b6b';
  input.style.boxShadow   = '0 0 0 3px rgba(255,107,107,.15)';
}
function clearError(input) {
  input.style.borderColor = '';
  input.style.boxShadow   = '';
}

if (form) {
  // Clear error styling on input/change
  form.querySelectorAll('input, textarea, select').forEach(field => {
    field.addEventListener('input',  () => { if (field.value.trim()) clearError(field); });
    field.addEventListener('change', () => { if (field.value.trim()) clearError(field); });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    showStatus('', '');

    const nameField    = form.querySelector('[name="user_name"]');
    const countryField = form.querySelector('[name="user_country"]');
    const subjectField = form.querySelector('[name="subject"]');
    const msgField     = form.querySelector('[name="message"]');

    const name    = nameField    ? nameField.value.trim()    : '';
    const country = countryField ? countryField.value.trim() : '';
    const subject = subjectField ? subjectField.value.trim() : '';
    const message = msgField     ? msgField.value.trim()     : '';

    // Validate
    let hasError = false;
    if (!name)    { highlightError(nameField);    hasError = true; }
    if (!country) { highlightError(countryField); hasError = true; }
    if (!subject) { highlightError(subjectField); hasError = true; }
    if (!message) { highlightError(msgField);     hasError = true; }

    if (hasError) {
      showStatus('⚠ Please fill in all fields.', 'error');
      return;
    }

    // Build WhatsApp message
    const waMessage = [
      '👋 *New Inquiry — Success Graphs*',
      '',
      '👤 *Name:* ' + name,
      '🌍 *Country:* ' + country,
      '📌 *Subject:* ' + subject,
      '',
      '💬 *Message:*',
      message,
      '',
      '─────────────────────',
      'Sent via successgraphs.com'
    ].join('\n');

    const waURL = 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(waMessage);

    // Open WhatsApp in new tab
    window.open(waURL, '_blank');

    showStatus('✓ Opening WhatsApp with your message…', 'success');
    form.reset();
  });
}

/* ══════════════════════════════════════
   9. SMOOTH SCROLL
══════════════════════════════════════ */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (!target) return;
    e.preventDefault();
    const offset = 72;
    const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
    window.scrollTo({ top, behavior: 'smooth' });
  });
});

/* ══════════════════════════════════════
   10. PARALLAX PULSE RINGS
══════════════════════════════════════ */
const heroSection = document.querySelector('.hero');
const pulseOrigin = document.querySelector('.pulse-origin');
if (heroSection && pulseOrigin) {
  heroSection.addEventListener('mousemove', (e) => {
    const rx = (e.clientX / window.innerWidth  - .5) * 30;
    const ry = (e.clientY / window.innerHeight - .5) * 20;
    pulseOrigin.style.transform = `translate(calc(50% + ${rx}px), calc(-50% + ${ry}px))`;
  });
}

/* ══════════════════════════════════════
   11. BACK TO TOP BUTTON
   CHANGE 2: Arrow button → scrolls to top
══════════════════════════════════════ */
const backToTopBtn = document.getElementById('backToTop');

if (backToTopBtn) {
  // Show button after scrolling 400px
  window.addEventListener('scroll', () => {
    backToTopBtn.classList.toggle('visible', window.scrollY > 400);
  });

  backToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}
