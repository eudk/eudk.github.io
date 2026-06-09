document.addEventListener('DOMContentLoaded', () => {
  // --- Helpers: desktop vs phone ---
  const isMobileUA = /Mobi|Android/i.test(navigator.userAgent);
  const isDesktopPointer = window.matchMedia && window.matchMedia('(pointer: fine)').matches;
  const isDesktop = !isMobileUA && isDesktopPointer;

  const i18n = {
    da: {
      btn_github: 'GitHub',
      btn_linkedin: 'LinkedIn',
      btn_projects: 'Projekter',
      btn_contact: 'Kontakt',

      modal_title: 'Kontakt',
      modal_subtitle_prefix: 'Skriv her eller via',
      modal_subtitle_suffix: ' for at kontakte mig.',
      label_email: 'Din e-mail',
      label_message: 'Besked',
      ph_email: 'navn@eksempel.dk',
      ph_message: 'Skriv din besked...',

      consent_prefix: 'Jeg accepterer, at mine data håndteres som beskrevet i',
      privacy_notice: 'Privatlivspolitikken',
      consent_suffix: '.',

      btn_send: 'Send',

      footer_privacy: 'Privatliv',
      footer_status: 'Status',

      phrases: [
        "Nyuddannet udvikler",
        "Datamatiker og PBA i IT-sikkerhed",
        "Bygger software, værktøjer og eksperimenter",
        "Interesseret i AI-agenter og sikkerhed",
        "Fokus på adgangskontrol og governance",
        "Projekter, GitHub og portfolio"
      ]
    },
    en: {
      btn_github: 'GitHub',
      btn_linkedin: 'LinkedIn',
      btn_projects: 'Projects',
      btn_contact: 'Contact',

      modal_title: 'Contact',
      modal_subtitle_prefix: 'Reach out here or via',
      modal_subtitle_suffix: ' to get in touch.',
      label_email: 'Your email',
      label_message: 'Message',
      ph_email: 'name@example.com',
      ph_message: 'Write your message...',

      consent_prefix: 'I consent to my data being handled as described in the',
      privacy_notice: 'Privacy Notice',
      consent_suffix: '.',

      btn_send: 'Send',

      footer_privacy: 'Privacy',
      footer_status: 'Status',

      phrases: [
        "Graduate Developer",
        "Background in Software Development and IT Security",
        "Building software, tools and experiments",
        "Interested in AI agents and system design",
        "Focused on access control and security architecture",
        "Projects, GitHub and portfolio"
      ]
    }
  };

  function setText(key, value) {
    const el = document.querySelector(`[data-i18n="${key}"]`);
    if (!el) return;

    const icon = el.querySelector('i');
    if (icon) {
      [...el.childNodes].forEach(n => {
        if (n.nodeType === Node.TEXT_NODE) el.removeChild(n);
      });
      el.appendChild(document.createTextNode(' ' + value));
    } else {
      el.textContent = value;
    }
  }

  function applyLanguage(lang) {
    const dict = i18n[lang] || i18n.da;
    document.documentElement.lang = lang;

    Object.keys(dict).forEach((k) => {
      if (k === 'phrases') return;
      if (typeof dict[k] === 'string') setText(k, dict[k]);
    });

    document.querySelectorAll('[data-i18n-placeholder]').forEach((el) => {
      const k = el.getAttribute('data-i18n-placeholder');
      if (dict[k]) el.setAttribute('placeholder', dict[k]);
    });

    return dict.phrases;
  }

  const typewriterTextElement = document.getElementById('typewriter-text');
  let phrases = [];
  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  const langToggle = document.getElementById('check');
  const savedLang = localStorage.getItem('siteLang');
  const initialLang = (savedLang === 'en') ? 'en' : 'da';

  if (langToggle) langToggle.checked = (initialLang === 'en');
  phrases = applyLanguage(initialLang);

  if (langToggle) {
    langToggle.addEventListener('change', () => {
      const lang = langToggle.checked ? 'en' : 'da';
      localStorage.setItem('siteLang', lang);
      phrases = applyLanguage(lang);
      phraseIndex = 0;
      charIndex = 0;
      isDeleting = false;
      if (typewriterTextElement) typewriterTextElement.textContent = '';
    });
  }

  function typeWriter() {
    if (!typewriterTextElement || phrases.length === 0) return;

    const currentPhrase = phrases[phraseIndex] || '';
    let typeSpeed = isDeleting ? 45 : 68;

    if (isDeleting) {
      charIndex = Math.max(0, charIndex - 1);
    } else {
      charIndex = Math.min(currentPhrase.length, charIndex + 1);
    }

    typewriterTextElement.textContent = currentPhrase.slice(0, charIndex);

    if (!isDeleting && charIndex === currentPhrase.length) {
      isDeleting = true;
      typeSpeed = 1800;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      typeSpeed = 420;
    }

    window.setTimeout(typeWriter, typeSpeed);
  }

  typeWriter();

  // --- Modal & Form Logic + #contact hash ---
  const openModalBtn = document.getElementById('open-contact-modal');
  const closeModalBtn = document.getElementById('close-contact-modal');
  const modalOverlay = document.getElementById('contact-modal-overlay');
  const consentCheckbox = document.getElementById('consent');
  const submitButton = document.querySelector('#contact-form button[type="submit"]');

  function updateSubmitButtonState() {
    if (!submitButton || !consentCheckbox) return;
    submitButton.disabled = !consentCheckbox.checked;
  }

  function setHashContact() {
    // Avoid scroll jump: replace state instead of assigning location.hash
    const url = new URL(window.location.href);
    if (url.hash !== '#contact') {
      url.hash = 'contact';
      history.replaceState(null, '', url.toString());
    }
  }

  function clearHashContact() {
    const url = new URL(window.location.href);
    if (url.hash === '#contact') {
      url.hash = '';
      history.replaceState(null, '', url.toString());
    }
  }

  function openContactModal() {
    if (!modalOverlay) return;
    modalOverlay.classList.add('show');
    if (consentCheckbox) consentCheckbox.checked = false;
    updateSubmitButtonState();
    setHashContact();
  }

  function closeContactModal() {
    if (!modalOverlay) return;
    modalOverlay.classList.remove('show');
    clearHashContact();
  }

  if (consentCheckbox) consentCheckbox.addEventListener('change', updateSubmitButtonState);

  if (openModalBtn) {
    openModalBtn.addEventListener('click', (e) => {
      e.preventDefault();
      openContactModal();
    });
  }

  if (closeModalBtn) closeModalBtn.addEventListener('click', closeContactModal);

  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) closeContactModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === "Escape" && modalOverlay && modalOverlay.classList.contains('show')) {
      closeContactModal();
    }
  });

  // If you land on /#contact, open it automatically
  if (window.location.hash === '#contact') {
    openContactModal();
  }

  // Handle back/forward when hash changes
  window.addEventListener('hashchange', () => {
    if (window.location.hash === '#contact') openContactModal();
    else if (modalOverlay && modalOverlay.classList.contains('show')) closeContactModal();
  });

  updateSubmitButtonState();

  // --- Eyes follow cursor (desktop only) ---
  const eyes = document.querySelector('.profile-eyes');
  if (eyes && isDesktop) {
    const maxMove = 5; // subtle for small eyes
    const setPupil = (x, y) => {
      eyes.style.setProperty('--pupil-x', `${x}px`);
      eyes.style.setProperty('--pupil-y', `${y}px`);
    };

    const handlePoint = (clientX, clientY) => {
      const { innerWidth, innerHeight } = window;
      const nx = (clientX / innerWidth - 0.5) * 2;
      const ny = (clientY / innerHeight - 0.5) * 2;
      setPupil(nx * maxMove, ny * maxMove);
    };

    document.addEventListener('mousemove', (e) => handlePoint(e.clientX, e.clientY), { passive: true });
    setPupil(0, 0);
  } else if (eyes) {
    eyes.style.display = 'none';
  }

  const profileWrap = document.getElementById('profile-wrap');
  if (profileWrap && isDesktop) {
    let clicks = 0;
    let resetTimer = null;

    profileWrap.style.cursor = 'pointer';
    profileWrap.title = '...';

    profileWrap.addEventListener('click', (e) => {
      e.preventDefault();

      clicks += 1;

      // reset if user pauses too long
      if (resetTimer) clearTimeout(resetTimer);
      resetTimer = setTimeout(() => { clicks = 0; }, 2000);

      if (clicks >= 5) {
        clicks = 0;
        window.open('https://blog.eudk.dev/', '_blank', 'noopener,noreferrer');
      }
    });
    
  }
});
document.getElementById('year').textContent = new Date().getFullYear();

// --- Matrix canvas ---
const canvas = document.getElementById('matrix-canvas');
const ctx = canvas.getContext('2d');
let animationFrameId;

function setupCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  const columns = canvas.width / 14;
  const drops = [];
  for (let x = 0; x < columns; x++) drops[x] = 1;
  return { drops };
}

let { drops } = setupCanvas();

function draw() {
  ctx.fillStyle = 'rgba(248, 248, 250, 0.08)';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = '#e8e8ed';
  ctx.font = '14px arial';

  for (let i = 0; i < drops.length; i++) {
    const text = Math.random() > 0.5 ? '0' : '1';
    ctx.fillText(text, i * 14, drops[i] * 14);

    if (drops[i] * 14 > canvas.height && Math.random() > 0.99) drops[i] = 0;
    drops[i]++;
  }
}

function animate() {
  draw();
  animationFrameId = requestAnimationFrame(animate);
}

if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
  animate();
}

window.addEventListener('resize', () => {
  if (animationFrameId) {
    cancelAnimationFrame(animationFrameId);
    ({ drops } = setupCanvas());
    animate();
  }
});
