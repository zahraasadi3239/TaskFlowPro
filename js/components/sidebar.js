import { save, load } from "../utils/storage.js";

export function initSidebar() {
  const sidebar = document.querySelector(".sidebar");
  const menuButton = document.querySelector(".header__menu-btn");
  const links = document.querySelectorAll(".sidebar__link");

  if (!sidebar || !menuButton) return;

  setupActiveLinks(links);
  setupCollapse(sidebar, menuButton);
}

function setupCollapse(sidebar, menuButton) {
  const isCollapsed = load("sidebar-collapsed");

  if (isCollapsed) {
    sidebar.classList.add("sidebar--collapsed");
  }

  menuButton.addEventListener("click", () => {
    sidebar.classList.toggle("sidebar--collapsed");

    save("sidebar-collapsed", sidebar.classList.contains("sidebar--collapsed"));
  });
}

function setupActiveLinks(links) {
  links.forEach((link) => {
    link.addEventListener("click", () => {
      links.forEach((item) => {
        item.classList.remove("sidebar__link--active");
      });

      link.classList.add("sidebar__link--active");
    });
  });
}
