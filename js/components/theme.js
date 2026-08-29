import { save, load } from "../utils/storage.js";

export function initTheme() {
  const themeButton = document.querySelector(".header__theme-btn");

  if (!themeButton) return;

  const savedTheme = load("theme") || "light";

  applyTheme(savedTheme);

  themeButton.addEventListener("click", () => {
    const currentTheme = document.documentElement.dataset.theme;

    const nextTheme = currentTheme === "dark" ? "light" : "dark";

    applyTheme(nextTheme);

    save("theme", nextTheme);
  });
}

function applyTheme(theme) {
  document.documentElement.dataset.theme = theme;
}
