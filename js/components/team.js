/* ========================================
   TEAM COMPONENT
======================================== */

import { dashboardData } from "../data/dashboardData.js";

/* ========================================
   CONSTANTS
======================================== */

const TEAM_SELECTOR = ".team";
const LIST_SELECTOR = ".team__list";
const TOGGLE_SELECTOR = '[data-action="toggle-team"]';

const INITIAL_VISIBLE_COUNT = 4;

/* ========================================
   STATE
======================================== */

let teamElement = null;
let teamList = null;
let toggleButton = null;

let showAllMembers = false;

/* ========================================
   INIT
======================================== */

export function initTeam() {
  teamElement = document.querySelector(TEAM_SELECTOR);

  if (!teamElement) {
    console.warn("Team element was not found.");
    return;
  }

  teamList = teamElement.querySelector(LIST_SELECTOR);
  toggleButton = teamElement.querySelector(TOGGLE_SELECTOR);

  if (!teamList) {
    console.warn("Team list was not found.");
    return;
  }

  setupTeamEvents();

  renderTeam();
}

/* ========================================
   EVENTS
======================================== */

function setupTeamEvents() {
  toggleButton?.addEventListener("click", handleToggleTeam);
}

/* ========================================
   TOGGLE TEAM
======================================== */

function handleToggleTeam() {
  showAllMembers = !showAllMembers;

  renderTeam();
}

/* ========================================
   RENDER TEAM
======================================== */

function renderTeam() {
  if (!teamList) {
    return;
  }

  teamList.innerHTML = "";

  const members = getMembersToRender();

  if (members.length === 0) {
    renderEmptyState();

    updateToggleButton(0);

    return;
  }

  const fragment = document.createDocumentFragment();

  members.forEach((member) => {
    fragment.appendChild(createMemberElement(member));
  });

  teamList.appendChild(fragment);

  updateToggleButton(getTeamMembers().length);
}

/* ========================================
   GET TEAM MEMBERS
======================================== */

function getTeamMembers() {
  if (!Array.isArray(dashboardData.team)) {
    return [];
  }
  console.table(dashboardData.team);
  return [...dashboardData.team];
}

/* ========================================
   GET MEMBERS TO RENDER
======================================== */

function getMembersToRender() {
  const members = getTeamMembers();

  if (showAllMembers) {
    return members;
  }

  return members.slice(0, INITIAL_VISIBLE_COUNT);
}

/* ========================================
   CREATE MEMBER
======================================== */

function createMemberElement(member) {
  const article = document.createElement("article");

  article.className = "member";

  article.dataset.memberId = String(member.id);

  const info = createMemberInfo(member);

  const status = createMemberStatus(member);

  article.append(info, status);

  return article;
}

/* ========================================
   CREATE MEMBER INFO
======================================== */

function createMemberInfo(member) {
  const info = document.createElement("div");

  info.className = "member__info";

  const avatar = document.createElement("img");

  avatar.className = "member__avatar";

  avatar.src = member.avatar || getDefaultAvatar(member.job);

  avatar.alt = member.name || "عضو تیم";

  avatar.loading = "lazy";

  const content = document.createElement("div");

  content.className = "member__content";

  const name = document.createElement("h3");

  name.className = "member__name";

  name.textContent = member.name || "عضو بدون نام";

  const job = document.createElement("p");

  job.className = "member__job";

  job.textContent = member.job || "سمت ثبت نشده";

  content.append(name, job);

  info.append(avatar, content);

  return info;
}

/* ========================================
   CREATE MEMBER STATUS
======================================== */

function createMemberStatus(member) {
  const statusKey = normalizeStatus(member.status);

  const status = document.createElement("span");

  status.className = `member__status member__status--${statusKey}`;

  const dot = document.createElement("span");

  dot.className = "member__dot";

  dot.setAttribute("aria-hidden", "true");

  const label = document.createElement("span");

  label.className = "member__status-label";

  label.textContent = getStatusLabel(statusKey, member.status);
  status.append(dot, label);

  return status;
}

/* ========================================
   NORMALIZE STATUS
======================================== */

function normalizeStatus(status) {
  if (!status) {
    return "offline";
  }

  /*
   * Team status structure:
   *
   * {
   *   key: "online",
   *   label: "آنلاین"
   * }
   */

  if (typeof status === "object") {
    return normalizeStatus(status.key);
  }

  const statusMap = {
    online: "online",
    offline: "offline",
    busy: "busy",

    آنلاین: "online",
    آفلاین: "offline",
    مشغول: "busy",
  };

  return statusMap[String(status).trim()] || "offline";
}

/* ========================================
   STATUS LABEL
======================================== */

function getStatusLabel(statusKey, originalStatus) {
  if (originalStatus?.label) {
    return originalStatus.label;
  }

  const labels = {
    online: "آنلاین",
    offline: "آفلاین",
    busy: "مشغول",
  };

  return labels[statusKey] || "آفلاین";
}

/* ========================================
   DEFAULT AVATAR
======================================== */

function getDefaultAvatar(job) {
  const jobText = String(job || "").toLowerCase();

  if (jobText.includes("front")) {
    return "./assets/images/Front-End Developer.svg";
  }

  if (jobText.includes("back")) {
    return "./assets/images/Back-End Developer.svg";
  }

  if (jobText.includes("designer")) {
    return "./assets/images/UI Designer.svg";
  }

  if (jobText.includes("product")) {
    return "./assets/images/Product Manager.svg";
  }

  return "./assets/images/Front-End Developer.svg";
}

/* ========================================
   TOGGLE BUTTON
======================================== */

function updateToggleButton(totalMembers) {
  if (!toggleButton) {
    return;
  }

  const shouldShowToggle = totalMembers > INITIAL_VISIBLE_COUNT;

  toggleButton.hidden = !shouldShowToggle;

  if (!shouldShowToggle) {
    return;
  }

  toggleButton.textContent = showAllMembers ? "نمایش کمتر" : "مشاهده همه";

  toggleButton.setAttribute("aria-expanded", String(showAllMembers));
}

/* ========================================
   EMPTY STATE
======================================== */

function renderEmptyState() {
  const empty = document.createElement("p");

  empty.className = "team__empty";

  empty.textContent = "در حال حاضر عضوی برای نمایش وجود ندارد.";

  teamList.appendChild(empty);
}
