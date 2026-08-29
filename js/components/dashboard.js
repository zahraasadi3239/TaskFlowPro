import { dashboardData } from "../data/dashboardData.js";
import { initTaskModal } from "./modal.js";
import { save, load } from "../utils/storage.js";
import { initAnalytics, refreshAnalytics } from "./analytics.js";
import {
  initActivity,
  loadActivities,
  renderActivity,
  addActivity,
} from "./activity.js";

const TASKS_STORAGE_KEY = "dashboard-tasks";
const ACTIVITY_USER = "زهرا";
/* ======================================== 
STORAGE
 ======================================== */

/* ========================================
   DASHBOARD INITIALIZATION
======================================== */

export function initDashboard() {
  console.log("Dashboard initialized");

  loadTasks();
  loadActivities();

  renderStats();
  renderTasks();
  renderActivity();

  const modal = initTaskModal();
  if (!modal) {
    return;
  }

  initTaskInteractions(modal);

  initActivity(modal);
  initAnalytics();
  document.addEventListener("task-modal-submit", handleTaskModalSubmit);
}

/* ========================================
   STATS
======================================== */

function renderStats() {
  const statsContainer = document.querySelector(".stats");

  if (!statsContainer) {
    console.warn("Stats container was not found.");
    return;
  }

  const { stats } = dashboardData;

  const statItems = [
    {
      number: stats.totalTasks,
      title: "کل وظایف",
      change: stats.changes.totalTasks,
    },

    {
      number: stats.completedTasks,
      title: "انجام شده",
      change: stats.changes.completedTasks,
    },

    {
      number: stats.inProgressTasks,
      title: "در حال انجام",
      change: stats.changes.inProgressTasks,
    },

    {
      number: stats.delayedTasks,
      title: "دارای تأخیر",
      change: stats.changes.delayedTasks,
    },
  ];

  const statCards = statsContainer.querySelectorAll(".stat-card");

  statCards.forEach((card, index) => {
    const data = statItems[index];

    if (!data) {
      return;
    }

    updateStatCard(card, data);
  });
}

function updateStatCard(card, data) {
  const numberElement = card.querySelector(".stat-card__number");
  const titleElement = card.querySelector(".stat-card__title");
  const changeElement = card.querySelector(".stat-card__change");

  if (numberElement) {
    numberElement.textContent = toPersianNumber(data.number);
  }

  if (titleElement) {
    titleElement.textContent = data.title;
  }

  if (changeElement) {
    updateChange(changeElement, data.change);
  }
}

function updateChange(element, change) {
  const isPositive = change >= 0;

  const arrow = isPositive ? "▲" : "▼";
  const absoluteChange = Math.abs(change);

  element.textContent = `${arrow} ${toPersianNumber(absoluteChange)}٪ نسبت به ماه قبل`;

  element.classList.toggle("stat-card__change--positive", isPositive);

  element.classList.toggle("stat-card__change--negative", !isPositive);
}
/* ========================================
   ACTIVITY
======================================== */

function loadTasks() {
  const storedTasks = load(TASKS_STORAGE_KEY);

  if (storedTasks !== null) {
    dashboardData.tasks = storedTasks;

    return;
  }

  saveTasks();
}

function saveTasks() {
  save(TASKS_STORAGE_KEY, dashboardData.tasks);
}

function initTaskInteractions(modal) {
  const taskList = document.querySelector(".task__list");

  const addTaskButton = document.querySelector('[data-action="add-task"]');

  if (!taskList) {
    console.warn("Task list was not found.");

    return;
  }

  taskList.addEventListener("change", handleTaskCheckbox);

  taskList.addEventListener("click", (event) => {
    handleTaskMenuClick(event, modal);
  });

  addTaskButton?.addEventListener("click", () => {
    modal.openModal();
  });
}
/* ========================================
   UPDATE TASK SUMMARY
======================================== */

function updateTaskSummary() {
  const subtitle = document.querySelector(".tasks__subtitle");

  if (!subtitle) {
    console.warn("Tasks subtitle was not found.");
    return;
  }

  const taskCount = dashboardData.tasks.length;

  subtitle.textContent = `${toPersianNumber(taskCount)} وظیفه برای امروز برنامه‌ریزی شده است.`;
}

/* ========================================
   TASKS
======================================== */
function renderTasks() {
  const taskList = document.querySelector(".task__list");

  if (!taskList) {
    console.warn("Task list was not found.");
    return;
  }

  taskList.innerHTML = "";

  if (dashboardData.tasks.length === 0) {
    taskList.innerHTML = `
      <div class="task__empty">
        <h3 class="task__empty-title">
          وظیفه‌ای وجود ندارد
        </h3>

        <p class="task__empty-text">
          هنوز هیچ وظیفه‌ای برای نمایش وجود ندارد.
        </p>
      </div>
    `;

    return;
  }

  const fragment = document.createDocumentFragment();

  dashboardData.tasks.forEach((task) => {
    const taskElement = createTaskElement(task);

    fragment.appendChild(taskElement);
  });

  taskList.appendChild(fragment);
}
/* ========================================
   PRIORITY
======================================== */

function createPriority(key) {
  const priorities = {
    high: {
      key: "high",
      label: "اولویت زیاد",
    },

    medium: {
      key: "medium",
      label: "اولویت متوسط",
    },

    low: {
      key: "low",
      label: "اولویت کم",
    },
  };

  return priorities[key] || priorities.medium;
}

/* ========================================
   CREATE TASK ELEMENT
======================================== */

function createTaskElement(task) {
  const article = document.createElement("article");

  article.className = `task task--${task.status.key}`;

  /*
        این id برای پیدا کردن Task
        هنگام Edit / Delete / Checkbox
    */

  article.dataset.id = task.id;

  article.innerHTML = `
        <div class="task__left">

            <label class="task__checkbox">

                <input
                    type="checkbox"
                    ${task.completed ? "checked" : ""}
                />

                <span class="task__checkmark">

                    <img
                        src="./assets/icons/check.svg"
                        alt="check"
                    />

                </span>

            </label>


            <div class="task__content">

                <h3 class="task__title">
                    ${task.title}
                </h3>


                <div class="task__badges">

                    <span
                        class="task__priority task__priority--${task.priority.key}"
                    >
                        ${task.priority.label}
                    </span>


                    <span
                        class="task__status task__status--${task.status.key}"
                    >
                        ${task.status.label}
                    </span>

                </div>

            </div>

        </div>


        <div class="task__right">

            <div class="task__meta">

                <span class="task__date">
                    ${task.date}
                </span>

                <img
                    src="${task.avatar}"
                    class="task__avatar"
                    alt="${task.avatarAlt}"
                />

            </div>

        </div>


        <button
            class="task__menu"
            type="button"
            aria-label="منوی وظیفه"
            aria-expanded="false"
        >

            <img
                src="./assets/icons/ellipsis.svg"
                alt="منو"
            />

        </button>


        <div class="task__dropdown" hidden>

            <button
                class="task__dropdown-item"
                type="button"
                data-action="edit-task"
            >
                ویرایش
            </button>


            <button
                class="task__dropdown-item task__dropdown-item--danger"
                type="button"
                data-action="delete-task"
            >
                حذف
            </button>

        </div>
    `;

  return article;
}

/* ========================================
   PERSIAN NUMBER
======================================== */

function toPersianNumber(value) {
  return String(value).replace(/\d/g, (digit) => "۰۱۲۳۴۵۶۷۸۹"[digit]);
}

/* ========================================
   TASK INTERACTIONS
======================================== */

// function initTaskInteractions(taskModal) {
//   const taskList = document.querySelector(".task__list");

//   const addTaskButton = document.querySelector('[data-action="add-task"]');

//   const taskForm = document.querySelector(".task-modal__form");

//   if (!taskList) {
//     console.warn("Task list was not found.");
//     return;
//   }

//   /*
//         Checkbox
//     */

//   taskList.addEventListener("change", handleTaskCheckbox);

//   /*
//         سه‌نقطه + ویرایش + حذف
//     */

//   taskList.addEventListener("click", (event) => {
//     handleTaskMenuClick(event, taskModal);
//   });

//   /*
//         افزودن Task
//     */

//   if (addTaskButton && taskModal) {
//     addTaskButton.addEventListener("click", () => {
//       taskModal.openModal();
//     });
//   }

//   /*
//         Submit فرم
//     */

//   if (taskForm && taskModal) {
//     taskForm.addEventListener("submit", (event) => {
//       handleTaskSubmit(event, taskModal);
//     });
//   }
// }

/* ========================================
   TASK MENU
======================================== */

function handleTaskMenuClick(event, modal) {
  /* ========================================
     MENU
  ======================================== */

  const menuButton = event.target.closest(".task__menu");

  if (menuButton) {
    const taskElement = menuButton.closest(".task");

    if (!taskElement) {
      return;
    }

    const dropdown = taskElement.querySelector(".task__dropdown");

    if (!dropdown) {
      return;
    }

    closeAllTaskDropdowns(dropdown);

    dropdown.hidden = !dropdown.hidden;

    menuButton.setAttribute("aria-expanded", String(!dropdown.hidden));

    return;
  }

  /* ========================================
     EDIT
  ======================================== */

  const editButton = event.target.closest('[data-action="edit-task"]');

  if (editButton) {
    const taskElement = editButton.closest(".task");

    if (!taskElement) {
      return;
    }

    const taskId = Number(taskElement.dataset.id);

    const task = dashboardData.tasks.find(
      (item) => String(item.id) === String(taskId),
    );

    if (!task) {
      return;
    }

    closeAllTaskDropdowns();

    modal.openEditModal(task);

    return;
  }

  /* ========================================
     DELETE
  ======================================== */

  const deleteButton = event.target.closest('[data-action="delete-task"]');

  if (deleteButton) {
    const taskElement = deleteButton.closest(".task");

    if (!taskElement) {
      return;
    }

    const taskId = Number(taskElement.dataset.id);

    closeAllTaskDropdowns();

    requestDeleteTask(taskId, modal);
  }
}
/* ========================================
   CLOSE ALL DROPDOWNS
======================================== */

function closeAllTaskDropdowns(except = null) {
  const dropdowns = document.querySelectorAll(".task__dropdown");

  dropdowns.forEach((dropdown) => {
    if (dropdown === except) {
      return;
    }

    dropdown.hidden = true;

    const task = dropdown.closest(".task");

    if (!task) {
      return;
    }

    task.querySelector(".task__menu")?.setAttribute("aria-expanded", "false");
  });
}

/* ========================================
   DELETE TASK
======================================== */
function requestDeleteTask(taskId, modal) {
  const task = dashboardData.tasks.find((item) => item.id === taskId);

  if (!task) {
    return;
  }

  modal.openDeleteConfirm({
    title: "حذف وظیفه",

    message: `آیا از حذف وظیفه «${task.title}» مطمئن هستید؟`,

    onConfirm() {
      deleteTask(taskId);
    },
  });
}
function deleteTask(taskId) {
  const index = dashboardData.tasks.findIndex(
    (task) => String(task.id) === String(taskId),
  );

  if (index === -1) {
    return;
  }

  const task = dashboardData.tasks.find(
    (item) => String(item.id) === String(taskId),
  );

  dashboardData.tasks.splice(index, 1);

  saveTasks();
  refreshAnalytics();
  addActivity({
    action: "وظیفه",
    target: task.title,
    description: "را حذف کرد.",
  });

  renderTasks();
}
/* ========================================
   TASK CHECKBOX
======================================== */

function handleTaskCheckbox(event) {
  const checkbox = event.target.closest(".task__checkbox input");

  if (!checkbox) {
    return;
  }

  const taskElement = checkbox.closest(".task");

  if (!taskElement) {
    return;
  }

  const taskId = taskElement.dataset.id;

  const task = dashboardData.tasks.find(
    (item) => String(item.id) === String(taskId),
  );

  if (!task) {
    console.warn("Task not found:", taskId);
    return;
  }

  task.completed = checkbox.checked;

  updateTaskStatus(task);

  saveTasks();

  /*
   * تمام Dashboardهای وابسته به Task
   * بعد از تغییر باید دوباره محاسبه شوند.
   */

  renderStats();

  refreshAnalytics();

  addActivity({
    action: "وضعیت وظیفه",

    target: task.title,

    description: task.completed
      ? "به «انجام شده» تغییر کرد."
      : "به «در حال انجام» تغییر کرد.",
  });
}
/* ========================================
   UPDATE TASK STATUS
======================================== */
function updateTaskStatus(task) {
  if (task.completed) {
    task.status = {
      key: "completed",
      label: "انجام شده",
    };
  } else {
    task.status = {
      key: "progress",
      label: "در حال انجام",
    };
  }

  task.statusKey = task.status.key;

  const taskElement = document.querySelector(`.task[data-id="${task.id}"]`);

  if (!taskElement) {
    return;
  }

  taskElement.className = `task task--${task.status.key}`;

  const statusElement = taskElement.querySelector(".task__status");

  if (statusElement) {
    statusElement.className = `task__status task__status--${task.status.key}`;

    statusElement.textContent = task.status.label;
  }
}

/* ========================================
   TASK FORM
======================================== */

function handleTaskModalSubmit(event) {
  const { mode, taskId, title, priority } = event.detail;

  /* ========================================
     EDIT
  ======================================== */

  if (mode === "edit") {
    const task = dashboardData.tasks.find((item) => item.id === taskId);

    if (!task) {
      console.warn("Task not found:", taskId);

      return;
    }

    const oldTitle = task.title;

    task.title = title;

    task.priority = createPriority(priority);

    saveTasks();
    refreshAnalytics();
    addActivity({
      action: "وظیفه",
      target: task.title,
      description: "را ویرایش کرد.",
    });

    renderTasks();

    return;
  }

  /* ========================================
     ADD
  ======================================== */

  const newTask = {
    id: Date.now(),

    title,

    priority: createPriority(priority),

    projectId: null,

    status: {
      key: "progress",
      label: "در حال انجام",
    },

    completed: false,

    date: "امروز",

    assignee: "زهرا",

    avatar: "./assets/images/Front-End Developer.svg",

    avatarAlt: "زهرا",
  };

  dashboardData.tasks.push(newTask);

  saveTasks();
  refreshAnalytics();
  addActivity({
    action: "وظیفه",
    target: newTask.title,
    description: "را ایجاد کرد.",
  });

  renderTasks();
}
/* ========================================
   RESET TASK FORM
======================================== */

function resetTaskForm(titleInput) {
  titleInput.value = "";

  const priorityInput = document.querySelector("#task-priority");

  if (priorityInput) {
    priorityInput.value = "high";
  }
}
