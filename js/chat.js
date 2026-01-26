const chatEl = document.getElementById('chat');
const formEl = document.getElementById('chat-form');
const inputEl = document.getElementById('chat-input');

const CONTACT_FORM = '/#contact';
const CONTACT_LINKEDIN = 'https://linkedin.com/in/eudk';
const STATUS_URL = 'https://status.eudk.dev/';

const qa = [
  {
    q: 'What have you worked on recently?',
    a:
      'Highlights:\n' +
      '- Portfolio improvements (privacy, status, UX)\n' +
      '- GitHub stats page integration\n' +
      '- Practical security learning + small automation tooling\n'
  },
  {
    q: 'What’s your focus in IT security?',
    a:
      'Focus areas:\n' +
      '- Governance, risk & compliance (GRC)\n' +
      '- Security fundamentals + practical case work\n' +
      '- Automation where it makes sense\n'
  },
  {
    q: 'What tools do you use?',
    a:
      'Typical tooling:\n' +
      '- Git/GitHub, VS Code\n' +
      '- Kali + common security utilities\n' +
      '- Burp / ZAP / Nmap / Wireshark\n' +
      '- Docker + basic CI workflows\n'
  },
  {
    q: 'Do you have a GitHub overview?',
    a:
      'Yes — there’s an overview page with activity + language stats.\n' +
      'If you found it, it’s meant as a deeper “about” layer.\n'
  },
  {
    q: 'How do you think about privacy on your site?',
    a:
      'Simple and explicit:\n' +
      '- Minimal data collection\n' +
      '- Clear privacy notice\n' +
      '- No dark-pattern tracking\n'
  },
  {
    q: 'What kind of projects do you build?',
    a:
      'Mostly small, focused builds:\n' +
      '- Automation utilities\n' +
      '- Frontend experiments\n' +
      '- Security-related demos where appropriate\n'
  },
  {
    q: 'What’s your approach to learning security?',
    a:
      'Practical-first:\n' +
      '- Learn fundamentals\n' +
      '- Apply them in labs/cases\n' +
      '- Write down outcomes and tighten the process\n'
  },
  {
    q: 'What’s your background before IT security?',
    a:
      'AP Computer Science background + hands-on building.\n' +
      'That helps with systems, networking, and writing small tools.\n'
  },
  {
    q: 'How can I contact you?',
    a:
      `Contact options:\n- Form: ${CONTACT_FORM}\n- LinkedIn: ${CONTACT_LINKEDIN}\n`
  },
  {
    q: 'Where can I see site status?',
    a:
      `Check status here: ${STATUS_URL}\n`
  }
];

function normalize(s) {
  return (s || '').trim().toLowerCase().replace(/\s+/g, ' ');
}

function appendMessage(role, text, metaLabel) {
  const msg = document.createElement('div');
  msg.className = `msg ${role}`;

  const bubble = document.createElement('div');
  bubble.className = 'bubble';

  const meta = document.createElement('div');
  meta.className = 'meta';
  meta.textContent = metaLabel;

  const body = document.createElement('div');
  body.className = 'text';

  // allow plain text + preserve newlines
  body.textContent = text;

  bubble.appendChild(meta);
  bubble.appendChild(body);
  msg.appendChild(bubble);
  chatEl.appendChild(msg);
  chatEl.scrollTop = chatEl.scrollHeight;
}

function appendTyping() {
  const msg = document.createElement('div');
  msg.className = 'msg assistant';
  msg.id = 'typing-msg';

  const bubble = document.createElement('div');
  bubble.className = 'bubble';

  const meta = document.createElement('div');
  meta.className = 'meta';
  meta.textContent = 'Demo Assistant';

  const body = document.createElement('div');
  body.className = 'text';

  const typing = document.createElement('span');
  typing.className = 'typing';
  typing.innerHTML = '<span class="dotty"></span><span class="dotty"></span><span class="dotty"></span>';

  body.appendChild(typing);
  bubble.appendChild(meta);
  bubble.appendChild(body);
  msg.appendChild(bubble);

  chatEl.appendChild(msg);
  chatEl.scrollTop = chatEl.scrollHeight;
}

function removeTyping() {
  const t = document.getElementById('typing-msg');
  if (t) t.remove();
}

function isExactSuggested(question) {
  const n = normalize(question);
  return qa.some((item) => normalize(item.q) === n);
}

function answerFor(question) {
  const n = normalize(question);
  const exact = qa.find((item) => normalize(item.q) === n);
  if (exact) return exact.a;

  return (
    'This is a demo currently being built.\n\n' +
    'For questions or contact:\n' +
    `- Form: ${CONTACT_FORM}\n` +
    `- LinkedIn: ${CONTACT_LINKEDIN}\n\n` +
    `If you want to check uptime:\n- Status: ${STATUS_URL}\n`
  );
}

function handleAsk(q, source = 'typed') {
  const question = (q || '').trim();
  if (!question) return;

  appendMessage('user', question, 'You');

  appendTyping();

  const reply = answerFor(question);

  const base = source === 'chip' ? 260 : 420;
  const delay = Math.min(900, base + Math.min(28, question.length) * 12);

  window.setTimeout(() => {
    removeTyping();
    appendMessage('assistant', reply, 'Demo Assistant');
  }, delay);
}

document.querySelectorAll('.chip').forEach((btn) => {
  btn.addEventListener('click', () => {
    handleAsk(btn.getAttribute('data-q'), 'chip');
  });
});

formEl.addEventListener('submit', (e) => {
  e.preventDefault();
  handleAsk(inputEl.value, 'typed');
  inputEl.value = '';
  inputEl.focus();
});
