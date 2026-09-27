document.addEventListener("DOMContentLoaded", () => {
  const year = document.getElementById("year");
  const openButton = document.getElementById("open-contact");
  const closeButton = document.getElementById("close-contact");
  const overlay = document.getElementById("contact-overlay");
  const consent = document.getElementById("consent");
  const sendButton = document.getElementById("send-button");
  const emailInput = document.getElementById("email");

  if (year) year.textContent = new Date().getFullYear();

  function updateSendState() {
    if (!sendButton || !consent) return;
    sendButton.disabled = !consent.checked;
  }

  function setContactHash() {
    const url = new URL(window.location.href);
    if (url.hash !== "#contact") {
      url.hash = "contact";
      history.replaceState(null, "", url.toString());
    }
  }

  function clearContactHash() {
    const url = new URL(window.location.href);
    if (url.hash === "#contact") {
      url.hash = "";
      history.replaceState(null, "", url.pathname + url.search);
    }
  }

  function openContact() {
    if (!overlay) return;
    overlay.classList.add("is-open");
    overlay.setAttribute("aria-hidden", "false");
    document.body.classList.add("modal-open");
    if (consent) consent.checked = false;
    updateSendState();
    setContactHash();
    window.setTimeout(() => emailInput?.focus(), 60);
  }

  function closeContact() {
    if (!overlay) return;
    overlay.classList.remove("is-open");
    overlay.setAttribute("aria-hidden", "true");
    document.body.classList.remove("modal-open");
    clearContactHash();
    openButton?.focus();
  }

  openButton?.addEventListener("click", openContact);
  closeButton?.addEventListener("click", closeContact);
  consent?.addEventListener("change", updateSendState);

  overlay?.addEventListener("click", (event) => {
    if (event.target === overlay) closeContact();
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && overlay?.classList.contains("is-open")) {
      closeContact();
    }
  });

  window.addEventListener("hashchange", () => {
    if (window.location.hash === "#contact") {
      openContact();
    } else if (overlay?.classList.contains("is-open")) {
      closeContact();
    }
  });

  if (window.location.hash === "#contact") openContact();
  updateSendState();
});
