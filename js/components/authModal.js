import { login } from "../auth/auth.js";

const SELECTORS = {
  modal: ".auth-modal",
  form: ".auth-modal__form",
};

const ACTIONS = {
  close: "auth-close",
  switchMode: "auth-switch",
};

export function initAuthModal() {
  const modal = document.querySelector(SELECTORS.modal);

  if (!modal) {
    console.warn("Auth modal element not found.");
    return;
  }

  renderModal(modal);
  setupAuthModal(modal);
}

/* ========================================
   RENDER MODAL
======================================== */

function renderModal(modal) {
  modal.innerHTML = `
    <div class="auth-modal__backdrop"></div>

    <div
      class="auth-modal__dialog"
      role="dialog"
      aria-modal="true"
      aria-labelledby="auth-modal-title"
    >

      <button
        type="button"
        class="auth-modal__close"
        data-action="${ACTIONS.close}"
        aria-label="بستن"
      >
        ×
      </button>


      <div class="auth-modal__header">

        <div class="auth-modal__icon">
          ✓
        </div>

        <h2
          id="auth-modal-title"
          class="auth-modal__title"
        >
          ورود به حساب
        </h2>

        <p class="auth-modal__description">
          برای ادامه وارد حساب خود شوید.
        </p>

      </div>


      <form
        class="auth-modal__form"
        novalidate
      >

        <div
          class="auth-modal__field auth-modal__name-field"
          data-auth-name
          hidden
        >

          <label
            class="auth-modal__label"
            for="auth-name"
          >
            نام و نام خانوادگی
          </label>

          <input
            class="auth-modal__input"
            id="auth-name"
            name="name"
            type="text"
            autocomplete="name"
            placeholder="نام و نام خانوادگی"
          >

        </div>


        <div class="auth-modal__field">

          <label
            class="auth-modal__label"
            for="auth-email"
          >
            ایمیل
          </label>

          <input
            class="auth-modal__input"
            id="auth-email"
            name="email"
            type="email"
            autocomplete="email"
            placeholder="example@email.com"
          >

        </div>


        <div class="auth-modal__field">

          <label
            class="auth-modal__label"
            for="auth-password"
          >
            رمز عبور
          </label>

          <input
            class="auth-modal__input"
            id="auth-password"
            name="password"
            type="password"
            autocomplete="current-password"
            placeholder="رمز عبور"
          >

        </div>


        <p
          class="auth-modal__error"
          aria-live="polite"
          hidden
        ></p>


        <button
          type="submit"
          class="auth-modal__submit"
        >
          ورود
        </button>


        <button
          type="button"
          class="auth-modal__switch"
          data-action="${ACTIONS.switchMode}"
        >
          حساب ندارید؟ ثبت‌نام کنید
        </button>

      </form>

    </div>
  `;
}

/* ========================================
   EVENTS
======================================== */

function setupAuthModal(modal) {
  const form = modal.querySelector(SELECTORS.form);

  if (!form) {
    console.warn("Auth form could not be created.");
    return;
  }

  form.addEventListener("submit", (event) => {
    handleSubmit(event, modal, form);
  });

  modal.addEventListener("click", (event) => {
    const actionElement = event.target.closest("[data-action]");

    if (actionElement) {
      const action = actionElement.dataset.action;

      if (action === ACTIONS.close) {
        closeAuthModal(modal);
        return;
      }

      if (action === ACTIONS.switchMode) {
        const currentMode = modal.dataset.mode || "login";

        const nextMode = currentMode === "login" ? "register" : "login";

        openAuthModal(modal, nextMode);
        return;
      }
    }

    if (event.target.classList.contains("auth-modal__backdrop")) {
      closeAuthModal(modal);
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && isModalOpen(modal)) {
      closeAuthModal(modal);
    }
  });

  document.addEventListener("auth:open", (event) => {
    const mode = event.detail?.mode || "login";

    openAuthModal(modal, mode);
  });
}

/* ========================================
   SUBMIT
======================================== */

function handleSubmit(event, modal, form) {
  event.preventDefault();

  const mode = modal.dataset.mode || "login";

  const formData = new FormData(form);

  const name = String(formData.get("name") || "").trim();

  const email = String(formData.get("email") || "").trim();

  const password = String(formData.get("password") || "").trim();

  /* Validation */

  if (mode === "register" && !name) {
    showFormError(form, "لطفاً نام و نام خانوادگی خود را وارد کنید.");

    return;
  }

  if (!email) {
    showFormError(form, "لطفاً ایمیل خود را وارد کنید.");

    return;
  }

  if (!isValidEmail(email)) {
    showFormError(form, "لطفاً یک ایمیل معتبر وارد کنید.");

    return;
  }

  if (!password) {
    showFormError(form, "لطفاً رمز عبور خود را وارد کنید.");

    return;
  }

  if (password.length < 6) {
    showFormError(form, "رمز عبور باید حداقل ۶ کاراکتر باشد.");

    return;
  }

  /* Create user */

  const user = {
    id: crypto.randomUUID(),

    name: mode === "register" ? name : "کاربر",

    email,

    role: "Front-End Developer",

    avatar: "./assets/images/Front-End Developer.svg",
  };

  login(user);

  /* Notify profile */

  document.dispatchEvent(new CustomEvent("auth:changed"));

  clearForm(form);
  closeAuthModal(modal);
}

/* ========================================
   OPEN
======================================== */

function openAuthModal(modal, mode) {
  modal.dataset.mode = mode;

  updateModalMode(modal, mode);

  clearFormError(modal);

  modal.classList.add("auth-modal--open");

  modal.setAttribute("aria-hidden", "false");

  document.body.classList.add("auth-modal-open");

  const firstInput = modal.querySelector(
    ".auth-modal__form input:not([hidden])",
  );

  if (firstInput) {
    requestAnimationFrame(() => {
      firstInput.focus();
    });
  }
}

/* ========================================
   MODE
======================================== */

function updateModalMode(modal, mode) {
  const title = modal.querySelector(".auth-modal__title");

  const description = modal.querySelector(".auth-modal__description");

  const submitButton = modal.querySelector(".auth-modal__submit");

  const switchButton = modal.querySelector(".auth-modal__switch");

  const nameField = modal.querySelector("[data-auth-name]");

  if (mode === "register") {
    title.textContent = "ایجاد حساب";

    description.textContent = "برای ساخت حساب اطلاعات خود را وارد کنید.";

    submitButton.textContent = "ثبت‌نام";

    switchButton.textContent = "حساب دارید؟ وارد شوید";

    nameField.hidden = false;

    return;
  }

  title.textContent = "ورود به حساب";

  description.textContent = "برای ادامه وارد حساب خود شوید.";

  submitButton.textContent = "ورود";

  switchButton.textContent = "حساب ندارید؟ ثبت‌نام کنید";

  nameField.hidden = true;
}

/* ========================================
   CLOSE
======================================== */

function closeAuthModal(modal) {
  modal.classList.remove("auth-modal--open");

  modal.setAttribute("aria-hidden", "true");

  document.body.classList.remove("auth-modal-open");

  const form = modal.querySelector(SELECTORS.form);

  clearForm(form);
  clearFormError(modal);
}

/* ========================================
   ERROR
======================================== */

function showFormError(form, message) {
  const error = form.querySelector(".auth-modal__error");

  if (!error) {
    return;
  }

  error.textContent = message;
  error.hidden = false;
}

function clearFormError(modal) {
  const error = modal.querySelector(".auth-modal__error");

  if (!error) {
    return;
  }

  error.textContent = "";
  error.hidden = true;
}

/* ========================================
   FORM
======================================== */

function clearForm(form) {
  if (!form) {
    return;
  }

  form.reset();
}

/* ========================================
   EMAIL
======================================== */

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/* ========================================
   STATE
======================================== */

function isModalOpen(modal) {
  return modal.classList.contains("auth-modal--open");
}
