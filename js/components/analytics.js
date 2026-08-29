import { dashboardData } from "../data/dashboardData.js";

/* ========================================
   ANALYTICS STATE
======================================== */

let analyticsInitialized = false;

/* ========================================
   ANALYTICS INITIALIZATION
======================================== */

export function initAnalytics() {
  if (analyticsInitialized) {
    refreshAnalytics();
    return;
  }

  analyticsInitialized = true;

  console.log("Analytics initialized");

  refreshAnalytics();
}

/* ========================================
   REFRESH ALL ANALYTICS
======================================== */

export function refreshAnalytics() {
  normalizeTasks();

  renderProjectPerformance();
  renderTaskProgress();
  renderTaskStatus();
}

/* ========================================
   NORMALIZE TASKS
======================================== */

function normalizeTasks() {
  if (!Array.isArray(dashboardData.tasks)) {
    dashboardData.tasks = [];
  }

  dashboardData.tasks.forEach((task) => {
    task.completed = task.completed === true;

    if (!task.status || !task.status.key) {
      task.status = createStatus(task.completed);
    }

    if (task.completed) {
      task.status = createStatus(true);
    } else if (task.status.key === "completed") {
      task.status = createStatus(false);
    }

    task.statusKey = task.status.key;
  });
}

/* ========================================
   STATUS FACTORY
======================================== */

function createStatus(completed) {
  return completed
    ? {
        key: "completed",
        label: "انجام شده",
      }
    : {
        key: "progress",
        label: "در حال انجام",
      };
}

/* ========================================
   PROJECT PERFORMANCE
   LINE CHART
======================================== */
function renderProjectPerformance() {
  const chart = document.querySelector(".line-chart");
  const pointsContainer = document.querySelector(".line-chart__points");

  if (!chart || !pointsContainer) {
    console.warn("Project performance chart was not found.");
    return;
  }

  const projects = Array.isArray(dashboardData.projects)
    ? dashboardData.projects
    : [];

  pointsContainer.replaceChildren();

  if (projects.length === 0) {
    return;
  }

  /* ========================================
     SVG
  ======================================== */

  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");

  svg.classList.add("line-chart__svg");

  svg.setAttribute("viewBox", "0 0 100 100");
  svg.setAttribute("preserveAspectRatio", "none");
  svg.setAttribute("aria-hidden", "true");

  /* ========================================
     CALCULATE POINTS
  ======================================== */

  const maxPoints = Math.max(projects.length - 1, 1);

  const chartPoints = projects.map((project, index) => {
    const progress = clamp(getProjectProgress(project), 0, 100);

    /*
     * جایگاه نقطه با RIGHT
     *
     * پروژه اول → 10% از راست
     * پروژه آخر → 90% از راست
     */

    const rightPosition =
      projects.length === 1 ? 50 : 10 + (index / maxPoints) * 80;

    /*
     * SVG از LEFT محاسبه می‌کند.
     *
     * بنابراین باید RIGHT را
     * به X تبدیل کنیم.
     */

    const x = 100 - rightPosition;

    /*
     * SVG از بالا محاسبه می‌کند.
     *
     * progress:
     * 100 → بالا
     * 0   → پایین
     */

    const y = 100 - progress;

    return {
      project,
      progress,
      rightPosition,
      x,
      y,
    };
  });

  /* ========================================
     DRAW LINE
  ======================================== */

  if (chartPoints.length > 1) {
    const polyline = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "polyline",
    );

    polyline.classList.add("line-chart__line");

    polyline.setAttribute(
      "points",
      chartPoints.map((point) => `${point.x},${point.y}`).join(" "),
    );

    svg.appendChild(polyline);
  }

  pointsContainer.appendChild(svg);

  /* ========================================
     CREATE POINTS
  ======================================== */

  chartPoints.forEach(({ project, progress, rightPosition }) => {
    const point = document.createElement("button");

    point.type = "button";

    point.className = "point";

    point.dataset.projectId = project.id;

    /*
     * نقطه با RIGHT
     */

    point.style.right = `${rightPosition}%`;

    point.style.bottom = `${progress}%`;

    point.title = `${project.name}: ${toPersianNumber(progress)}٪`;

    point.setAttribute(
      "aria-label",
      `${project.name}، پیشرفت ${progress} درصد`,
    );

    pointsContainer.appendChild(point);
  });
}

/* ========================================
   PROJECT PROGRESS
======================================== */

function getProjectProgress(project) {
  const tasks = Array.isArray(dashboardData.tasks) ? dashboardData.tasks : [];

  const projectTasks = tasks.filter(
    (task) =>
      task.projectId != null && String(task.projectId) === String(project.id),
  );

  /*
   * اگر پروژه Task داشته باشد،
   * progress از Taskها محاسبه می‌شود.
   */

  if (projectTasks.length > 0) {
    const completedTasks = projectTasks.filter(
      (task) => task.completed === true,
    ).length;

    return Math.round((completedTasks / projectTasks.length) * 100);
  }

  /*
   * اگر Task مرتبط نداشت،
   * progress اولیه پروژه استفاده می‌شود.
   */

  const projectProgress = Number(project.progress);

  return Number.isFinite(projectProgress) ? clamp(projectProgress, 0, 100) : 0;
}

/* ========================================
   TASK PROGRESS
   BAR CHART
======================================== */

function renderTaskProgress() {
  const barsContainer = document.querySelector(".chart-placeholder__bars");

  if (!barsContainer) {
    console.warn("Task progress bars container was not found.");
    return;
  }

  barsContainer.replaceChildren();

  const tasks = Array.isArray(dashboardData.tasks) ? dashboardData.tasks : [];

  const completedTasks = tasks.filter((task) => task.completed === true).length;

  const inProgressTasks = tasks.filter(
    (task) => task.completed !== true && task.status?.key === "progress",
  ).length;

  const delayedTasks = tasks.filter(
    (task) =>
      task.completed !== true && ["late", "delayed"].includes(task.status?.key),
  ).length;

  const groups = [
    {
      key: "completed",
      label: "انجام شده",
      value: completedTasks,
    },
    {
      key: "progress",
      label: "در حال انجام",
      value: inProgressTasks,
    },
    {
      key: "late",
      label: "دارای تأخیر",
      value: delayedTasks,
    },
  ];

  const maxValue = Math.max(...groups.map((group) => group.value), 1);

  groups.forEach((group) => {
    const wrapper = document.createElement("div");

    wrapper.className = "analytics-bar";

    const value = document.createElement("strong");

    value.className = "analytics-bar__value";

    value.textContent = toPersianNumber(group.value);

    const bar = document.createElement("span");

    bar.className = `analytics-bar__fill analytics-bar__fill--${group.key}`;

    const height = group.value === 0 ? 0 : (group.value / maxValue) * 100;

    bar.style.height = `${height}%`;

    const label = document.createElement("small");

    label.className = "analytics-bar__label";

    label.textContent = group.label;

    wrapper.appendChild(value);
    wrapper.appendChild(bar);
    wrapper.appendChild(label);

    barsContainer.appendChild(wrapper);
  });
}

/* ========================================
   TASK COMPLETION
   DONUT
======================================== */

function renderTaskStatus() {
  const donut = document.querySelector(".donut__circle");
  const valueElement = document.querySelector(".donut__value");

  if (!donut || !valueElement) {
    console.warn("Task status donut was not found.");
    return;
  }

  const tasks = Array.isArray(dashboardData.tasks) ? dashboardData.tasks : [];

  const totalTasks = tasks.length;

  const completedTasks = tasks.filter((task) => task.completed === true).length;

  const completionRate =
    totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);

  const safeRate = clamp(completionRate, 0, 100);

  valueElement.textContent = `${toPersianNumber(safeRate)}٪`;

  donut.style.setProperty("--progress", `${safeRate}%`);

  donut.setAttribute("aria-valuenow", String(safeRate));

  donut.setAttribute("aria-label", `نرخ تکمیل وظایف ${safeRate} درصد`);
}

/* ========================================
   UTILITIES
======================================== */

function clamp(value, min, max) {
  const number = Number(value);

  if (!Number.isFinite(number)) {
    return min;
  }

  return Math.min(Math.max(number, min), max);
}

function toPersianNumber(value) {
  return String(value).replace(/\d/g, (digit) => "۰۱۲۳۴۵۶۷۸۹"[digit]);
}
