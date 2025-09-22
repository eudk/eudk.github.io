document.addEventListener('DOMContentLoaded', () => {
    // --- Mobile Redirect for Projects Link ---
    // This code checks if the user is on a mobile device.
    const isMobile = /Mobi|Android/i.test(navigator.userAgent);
    const projectsLink = document.getElementById('projects-link');
    
    if (isMobile && projectsLink) {
        projectsLink.href = "https://github.com/eudk"; 
        projectsLink.target = "_blank"; 
        projectsLink.rel = "noopener noreferrer"; 
    }

    // --- Typewriter Effect Logic ---
    const typewriterTextElement = document.getElementById('typewriter-text');
    if (typewriterTextElement) {
    const phrases = [
  "IT security student DK .",
  "Learning governance, risk and compliance.",
  "Hands-on with threat modeling and vuln management.",
  "Building small tools to automate tasks.",
  "Getting into cloud security and infrastructure as code.",
  "Open for internship opportunities."
];
        let phraseIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        
        function typeWriter() {
            const currentPhrase = phrases[phraseIndex];
            let typeSpeed = 70;
            if (isDeleting) {
                typeSpeed = 40;
                typewriterTextElement.textContent = currentPhrase.substring(0, charIndex - 1);
                charIndex--;
            } else {
                typewriterTextElement.textContent = currentPhrase.substring(0, charIndex + 1);
                charIndex++;
            }
            if (!isDeleting && charIndex === currentPhrase.length) {
                isDeleting = true;
                typeSpeed = 2000;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                phraseIndex = (phraseIndex + 1) % phrases.length;
                typeSpeed = 500;
            }
            setTimeout(typeWriter, typeSpeed);
        }
        if (phrases.length > 0) {
            typeWriter();
        }
    }

    // --- Formspree Success Message Handler ---
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('submission') && urlParams.get('submission') === 'success') {
        const successBanner = document.getElementById('success-banner');
        if (successBanner) {
            successBanner.classList.add('show');
            setTimeout(() => {
                successBanner.classList.remove('show');
            }, 5000); // Hide banner after 5 seconds
        }
    }
});

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

// --- Accessible Modal & Form Logic ---
const openModalBtn = document.getElementById('open-contact-modal');
const closeModalBtn = document.getElementById('close-contact-modal');
const modalOverlay = document.getElementById('contact-modal-overlay');
const consentCheckbox = document.getElementById('consent');
const submitButton = document.querySelector('#contact-form button[type="submit"]');
function updateSubmitButtonState() {
     submitButton.disabled = !consentCheckbox.checked;
}
consentCheckbox.addEventListener('change', updateSubmitButtonState);
openModalBtn.addEventListener('click', (e) => {
    e.preventDefault();
    modalOverlay.classList.add('show');
    consentCheckbox.checked = false;
    updateSubmitButtonState();
});
const closeModal = () => {
    modalOverlay.classList.remove('show');
};
closeModalBtn.addEventListener('click', closeModal);
modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
});
document.addEventListener('keydown', (e) => {
    if (e.key === "Escape" && modalOverlay.classList.contains('show')) closeModal();
});
updateSubmitButtonState();

