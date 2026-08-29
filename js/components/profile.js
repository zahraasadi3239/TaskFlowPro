// export function initProfile() {
//   const profile = document.querySelector(".profile");
//   const profileButton = document.querySelector(".header__profile");

//   if (!profile || !profileButton) {
//     return;
//   }

//   setupProfile(profile, profileButton);
// }

// function setupProfile(profile, profileButton) {
//   profileButton.addEventListener("click", (event) => {
//     event.stopPropagation();

//     const isOpen = toggleProfile(profile);

//     profileButton.setAttribute("aria-expanded", String(isOpen));
//   });

//   document.addEventListener("click", (event) => {
//     if (!profile.contains(event.target)) {
//       closeProfile(profile, profileButton);
//     }
//   });

//   document.addEventListener("keydown", (event) => {
//     if (event.key === "Escape") {
//       closeProfile(profile, profileButton);
//     }
//   });
// }

// function toggleProfile(profile) {
//   return profile.classList.toggle("profile--open");
// }

// function closeProfile(profile, profileButton) {
//   profile.classList.remove("profile--open");

//   profileButton.setAttribute("aria-expanded", "false");
// }
import { getCurrentUser, logout } from "../auth/auth.js";

const PROFILE_SELECTOR = ".profile";
const PROFILE_BUTTON_SELECTOR = ".header__profile";

export function initProfile() {
  const profile = document.querySelector(PROFILE_SELECTOR);

  if (!profile) {
    console.warn("Profile container not found.");

    return;
  }

  renderProfile(profile);

  setupProfileEvents(profile);
}

/* ========================================
   RENDER PROFILE
======================================== */

function renderProfile(profile) {
  const user = getCurrentUser();

  if (user) {
    renderUserProfile(profile, user);

    return;
  }

  renderGuestProfile(profile);
}

/* ========================================
   GUEST
======================================== */

function renderGuestProfile(profile) {
  profile.innerHTML = `
        <div class="profile__auth">

            <button
                type="button"
                class="profile__login"
                data-action="login"
            >
                ورود
            </button>

            <button
                type="button"
                class="profile__register"
                data-action="register"
            >
                ثبت‌نام
            </button>

        </div>
    `;
}

/* ========================================
   USER
======================================== */

function renderUserProfile(profile, user) {
  profile.innerHTML = `

        <div
            class="header__profile"
            role="button"
            tabindex="0"
            aria-expanded="false"
            aria-haspopup="true"
        >

            <div class="profile__avatar">

                <img
                    src="${escapeHTML(
                      user.avatar || "./assets/images/Front-End Developer.svg",
                    )}"
                    alt="${escapeHTML(user.name || "کاربر")}"
                >

                <span
                    class="profile__online"
                    aria-label="آنلاین"
                    title="آنلاین"
                ></span>

            </div>


            <div class="profile__info">

                <h3>
                    ${escapeHTML(user.name || "کاربر")}
                </h3>

                <p>
                    ${escapeHTML(user.role || "Front-End Developer")}
                </p>

            </div>

        </div>


        <div
            class="profile__dropdown"
            role="menu"
        >

            <a
                href="#"
                data-action="profile"
                role="menuitem"
            >
                پروفایل
            </a>


            <a
                href="#"
                data-action="settings"
                role="menuitem"
            >
                تنظیمات
            </a>


            <a
                href="#"
                data-action="edit-profile"
                role="menuitem"
            >
                ویرایش حساب
            </a>


            <button
                type="button"
                data-action="logout"
                class="profile__logout"
                role="menuitem"
            >
                خروج
            </button>

        </div>
    `;
}

/* ========================================
   EVENTS
======================================== */

function setupProfileEvents(profile) {
  profile.addEventListener("click", (event) => {
    const actionElement = event.target.closest("[data-action]");

    if (actionElement) {
      handleAction(actionElement, profile, event);

      return;
    }

    const profileButton = event.target.closest(PROFILE_BUTTON_SELECTOR);

    if (!profileButton) {
      return;
    }

    event.stopPropagation();

    toggleProfile(profile, profileButton);
  });

  profile.addEventListener("keydown", (event) => {
    const profileButton = event.target.closest(PROFILE_BUTTON_SELECTOR);

    if (!profileButton) {
      return;
    }

    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();

      toggleProfile(profile, profileButton);
    }
  });

  document.addEventListener("click", (event) => {
    if (!profile.contains(event.target)) {
      closeProfile(profile);
    }
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") {
      closeProfile(profile);
    }
  });

  /*
   * Authentication state changed
   */

  document.addEventListener("auth:changed", () => {
    renderProfile(profile);
  });
}

/* ========================================
   ACTIONS
======================================== */

function handleAction(element, profile, event) {
  const action = element.dataset.action;

  if (action === "login") {
    event.preventDefault();

    openAuth("login");

    return;
  }

  if (action === "register") {
    event.preventDefault();

    openAuth("register");

    return;
  }

  if (action === "logout") {
    event.preventDefault();

    closeProfile(profile);

    logout();

    return;
  }

  if (
    action === "profile" ||
    action === "settings" ||
    action === "edit-profile"
  ) {
    event.preventDefault();

    closeProfile(profile);
  }
}

/* ========================================
   TOGGLE
======================================== */

function toggleProfile(profile, profileButton) {
  const isOpen = profile.classList.toggle("profile--open");

  profileButton.setAttribute("aria-expanded", String(isOpen));
}

/* ========================================
   CLOSE
======================================== */

function closeProfile(profile) {
  if (!profile) {
    return;
  }

  profile.classList.remove("profile--open");

  const profileButton = profile.querySelector(PROFILE_BUTTON_SELECTOR);

  if (profileButton) {
    profileButton.setAttribute("aria-expanded", "false");
  }
}

/* ========================================
   AUTH MODAL
======================================== */

function openAuth(mode) {
  document.dispatchEvent(
    new CustomEvent("auth:open", {
      detail: {
        mode,
      },
    }),
  );
}

/* ========================================
   ESCAPE HTML
======================================== */

function escapeHTML(value) {
  return String(value ?? "")
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}
