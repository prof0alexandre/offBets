// js/script.js
// Lógica principal do site "Brasil Contra as Bets":
// validação do formulário, envio para o Firestore e pequenas interações de UI.

import { db } from "./firebase.js";
import {
  collection,
  addDoc,
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.12.2/firebase-firestore.js";

document.addEventListener("DOMContentLoaded", () => {
  initFormAssinatura();
  initScrollReveal();
});

/* ============================================================
   Formulário de assinatura -> coleção "assinatura" no Firestore
   Campos: nomeCompleto, email
   ============================================================ */
function initFormAssinatura() {
  const form = document.getElementById("formAssinatura");
  if (!form) return;

  const nomeInput = document.getElementById("nomeCompleto");
  const emailInput = document.getElementById("email");
  const btnAssinar = document.getElementById("btnAssinar");
  const btnText = btnAssinar.querySelector(".btn-text");
  const spinner = btnAssinar.querySelector(".spinner-border");
  const statusEl = document.getElementById("formStatus");

  const thankYouPanel = document.getElementById("thankYouPanel");
  const thankYouName = document.getElementById("thankYouName");
  const signupCardSub = document.getElementById("signupCardSub");
  const btnAssinarOutro = document.getElementById("btnAssinarOutro");

  // Ao clicar em "Assinar com outro nome", volta a exibir o formulário limpo
  if (btnAssinarOutro) {
    btnAssinarOutro.addEventListener("click", () => {
      exibirAgradecimento(false);
      nomeInput.focus();
    });
  }

  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  form.addEventListener("submit", async (event) => {
    event.preventDefault();
    event.stopPropagation();

    clearStatus();

    const nomeCompleto = nomeInput.value.trim();
    const email = emailInput.value.trim();

    let isValid = true;

    // Validação do nome
    if (nomeCompleto.length < 3) {
      nomeInput.classList.add("is-invalid");
      isValid = false;
    } else {
      nomeInput.classList.remove("is-invalid");
    }

    // Validação do e-mail
    if (!EMAIL_REGEX.test(email)) {
      emailInput.classList.add("is-invalid");
      isValid = false;
    } else {
      emailInput.classList.remove("is-invalid");
    }

    if (!isValid) {
      showStatus("Por favor, corrija os campos destacados antes de continuar.", "error");
      return;
    }

    setLoading(true);

    try {
      await addDoc(collection(db, "assinatura"), {
        nomeCompleto,
        email,
        criadoEm: serverTimestamp()
      });

      exibirAgradecimento(true, nomeCompleto);
      form.reset();
      nomeInput.classList.remove("is-invalid");
      emailInput.classList.remove("is-invalid");
    } catch (error) {
      console.error("Erro ao registrar assinatura:", error);
      showStatus(
        "Não foi possível registrar sua assinatura agora. Tente novamente em instantes.",
        "error"
      );
    } finally {
      setLoading(false);
    }
  });

  function setLoading(isLoading) {
    btnAssinar.disabled = isLoading;
    spinner.classList.toggle("d-none", !isLoading);
    btnText.textContent = isLoading ? "ENVIANDO..." : "QUERO ASSINAR";
  }

  function showStatus(message, type) {
    statusEl.textContent = message;
    statusEl.classList.remove("is-success", "is-error");
    statusEl.classList.add(type === "success" ? "is-success" : "is-error");
  }

  function clearStatus() {
    statusEl.textContent = "";
    statusEl.classList.remove("is-success", "is-error");
  }

  /**
   * Alterna entre o formulário e o painel de agradecimento personalizado.
   * @param {boolean} mostrar - true exibe o agradecimento, false volta ao formulário.
   * @param {string} [nome] - primeiro nome de quem assinou, usado na saudação.
   */
  function exibirAgradecimento(mostrar, nome) {
    if (mostrar) {
      const primeiroNome = (nome || "").trim().split(" ")[0] || "amigo";
      thankYouName.textContent = primeiroNome;

      form.classList.add("d-none");
      signupCardSub.classList.add("d-none");
      thankYouPanel.classList.remove("d-none");
      thankYouPanel.focus();
    } else {
      thankYouPanel.classList.add("d-none");
      form.classList.remove("d-none");
      signupCardSub.classList.remove("d-none");
      clearStatus();
    }
  }
}

/* ============================================================
   Revelação suave das seções ao rolar a página
   ============================================================ */
function initScrollReveal() {
  const revealEls = document.querySelectorAll(".reveal");
  if (!revealEls.length) return;

  if (!("IntersectionObserver" in window)) {
    revealEls.forEach((el) => el.classList.add("is-visible"));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  revealEls.forEach((el) => observer.observe(el));
}
