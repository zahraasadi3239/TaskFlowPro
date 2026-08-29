/* ========================================
   PROJECTS COMPONENT
======================================== */

import { dashboardData } from "../data/dashboardData.js";

/* ========================================
   CONSTANTS
======================================== */

const PROJECTS_SELECTOR = ".projects";
const GRID_SELECTOR = ".projects__grid";
const SHOW_ALL_SELECTOR = ".projects__button";

const MAX_VISIBLE_PROJECTS = 3;

/* ========================================
   STATE
======================================== */

let projectsElement = null;
let projectsGrid = null;
let showAllButton = null;

let showAllProjects = false;

/* ========================================
   INIT
======================================== */

export function initProjects() {
  projectsElement = document.querySelector(PROJECTS_SELECTOR);

  if (!projectsElement) {
    console.warn("Projects element was not found.");
    return;
  }

  projectsGrid = projectsElement.querySelector(GRID_SELECTOR);

  showAllButton = projectsElement.querySelector(SHOW_ALL_SELECTOR);

  if (!projectsGrid) {
    console.warn("Projects grid was not found.");
    return;
  }

  setupProjectsEvents();

  renderProjects();
}

/* ========================================
   EVENTS
======================================== */

function setupProjectsEvents() {
  showAllButton?.addEventListener("click", handleShowAllProjects);
}

/* ========================================
   SHOW ALL
======================================== */

function handleShowAllProjects(event) {
  event.preventDefault();

  showAllProjects = !showAllProjects;

  renderProjects();

  updateShowAllButton();
}

/* ========================================
   UPDATE BUTTON
======================================== */

function updateShowAllButton() {
  if (!showAllButton) {
    return;
  }

  showAllButton.textContent = showAllProjects ? "نمایش کمتر" : "مشاهده همه";
}

/* ========================================
   RENDER
======================================== */

function renderProjects() {
  if (!projectsGrid) {
    return;
  }

  projectsGrid.innerHTML = "";

  const projects = getVisibleProjects();

  if (projects.length === 0) {
    renderEmptyState();
    return;
  }

  const fragment = document.createDocumentFragment();

  projects.forEach((project) => {
    fragment.appendChild(createProjectElement(project));
  });

  projectsGrid.appendChild(fragment);
}

/* ========================================
   GET VISIBLE PROJECTS
======================================== */

function getVisibleProjects() {
  const projects = getActiveProjects();

  if (showAllProjects) {
    return projects;
  }

  return projects.slice(0, MAX_VISIBLE_PROJECTS);
}

/* ========================================
   GET ACTIVE PROJECTS
======================================== */

function getActiveProjects() {
  if (!Array.isArray(dashboardData.projects)) {
    return [];
  }

  return dashboardData.projects.filter(isActiveProject).sort(compareProjects);
}

/* ========================================
   CHECK ACTIVE PROJECT
======================================== */

function isActiveProject(project) {
  return project?.status?.key === "active";
}

/* ========================================
   SORT PROJECTS
======================================== */

function compareProjects(firstProject, secondProject) {
  const firstProgress = normalizeProgress(firstProject.progress);

  const secondProgress = normalizeProgress(secondProject.progress);

  return secondProgress - firstProgress;
}

/* ========================================
   CREATE PROJECT
======================================== */

function createProjectElement(project) {
  const article = document.createElement("article");

  article.className = "project-card";

  article.dataset.projectId = String(project.id);

  const header = createProjectHeader(project);

  const description = createProjectDescription(project);

  const progress = createProjectProgress(project);

  const footer = createProjectFooter(project);

  article.append(header, description, progress, footer);

  return article;
}

/* ========================================
   PROJECT HEADER
======================================== */

function createProjectHeader(project) {
  const header = document.createElement("div");

  header.className = "project-card__header";

  const title = document.createElement("h3");

  title.className = "project-card__title";

  title.textContent = project.name || "پروژه بدون نام";

  const status = document.createElement("span");

  status.className = `project-card__status project-card__status--${project.status?.key || "unknown"}`;

  status.textContent = project.status?.label || "نامشخص";

  header.append(title, status);

  return header;
}

/* ========================================
   DESCRIPTION
======================================== */

function createProjectDescription(project) {
  const description = document.createElement("p");

  description.className = "project-card__description";

  description.textContent =
    project.description || "توضیحی برای این پروژه ثبت نشده است.";

  return description;
}

/* ========================================
   PROGRESS
======================================== */

function createProjectProgress(project) {
  const wrapper = document.createElement("div");

  wrapper.className = "project-card__progress";

  const bar = document.createElement("div");

  bar.className = "project-card__progress-bar";

  const progress = normalizeProgress(project.progress);

  bar.style.width = `${progress}%`;

  bar.setAttribute("role", "progressbar");

  bar.setAttribute("aria-valuenow", String(progress));

  bar.setAttribute("aria-valuemin", "0");

  bar.setAttribute("aria-valuemax", "100");

  bar.setAttribute("aria-label", `پیشرفت پروژه ${project.name || ""}`);

  wrapper.appendChild(bar);

  return wrapper;
}

/* ========================================
   FOOTER
======================================== */

function createProjectFooter(project) {
  const footer = document.createElement("div");

  footer.className = "project-card__footer";

  const percent = document.createElement("span");

  percent.className = "project-card__percent";

  const progress = normalizeProgress(project.progress);

  percent.textContent = `${toPersianNumber(progress)}٪ انجام شده`;

  const deadline = document.createElement("span");

  deadline.className = "project-card__deadline";

  deadline.textContent = formatPersianDeadline(project.deadline);

  footer.append(percent, deadline);

  return footer;
}

/* ========================================
   EMPTY STATE
======================================== */

function renderEmptyState() {
  const empty = document.createElement("div");

  empty.className = "projects__empty";

  empty.textContent = "در حال حاضر پروژه فعالی وجود ندارد.";

  projectsGrid.appendChild(empty);
}

/* ========================================
   NORMALIZE PROGRESS
======================================== */

function normalizeProgress(progress) {
  const numericProgress = Number(progress);

  if (Number.isNaN(numericProgress)) {
    return 0;
  }

  return Math.min(100, Math.max(0, numericProgress));
}

/* ========================================
   FORMAT DEADLINE
======================================== */

function formatPersianDeadline(deadline) {
  if (!deadline) {
    return "بدون مهلت";
  }

  const parts = String(deadline).split("-");

  if (parts.length !== 3) {
    return String(deadline);
  }

  const [year, month, day] = parts;

  return `${toPersianNumber(day)} ${getPersianMonthName(month)}`;
}

/* ========================================
   PERSIAN MONTH
======================================== */

function getPersianMonthName(month) {
  const months = [
    "فروردین",
    "اردیبهشت",
    "خرداد",
    "تیر",
    "مرداد",
    "شهریور",
    "مهر",
    "آبان",
    "آذر",
    "دی",
    "بهمن",
    "اسفند",
  ];

  const index = Number(month) - 1;

  return months[index] || "";
}

/* ========================================
   PERSIAN NUMBER
======================================== */

function toPersianNumber(value) {
  const persianDigits = "۰۱۲۳۴۵۶۷۸۹";

  return String(value).replace(/\d/g, (digit) => persianDigits[digit]);
}
