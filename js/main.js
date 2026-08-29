import { initDashboard } from "./components/dashboard.js";
import { initNotification } from "./components/notification.js";

import { initSearch } from "./components/search.js";
import { initSidebar } from "./components/sidebar.js";
import { initTheme } from "./components/theme.js";
import { initCalendar } from "./components/calendar.js";
import { initMeetings } from "./components/meetings.js";
import { initProjects } from "./components/projects.js";
import { initTeam } from "./components/team.js";
import { initAnalytics } from "./components/analytics.js";
import { initAuthModal } from "./components/authModal.js";
import { initProfile } from "./components/profile.js";

console.log("main.js loaded");

document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM loaded");

  initSidebar();

  initTheme();

  console.log("Theme initialized");

  initNotification();

  initProfile();

  initSearch();

  initCalendar();

  initMeetings();
  initProjects();
  initTeam();
  // initAnalytics();
  initDashboard();
  initAuthModal();
});
