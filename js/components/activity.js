import { dashboardData } from "../data/dashboardData.js";
import { save } from "../utils/storage.js";

/* ========================================
   CONSTANTS
======================================== */

const ACTIVITIES_STORAGE_KEY = "dashboard-activities";

const MAX_VISIBLE_ACTIVITIES = 5;

let isShowingAll = false;

let editingActivityId = null;

/* ========================================
   LOAD
======================================== */

export function loadActivities() {
  const savedActivities = localStorage.getItem(ACTIVITIES_STORAGE_KEY);

  if (!savedActivities) {
    saveActivities();
    return;
  }

  try {
    dashboardData.activities = JSON.parse(savedActivities);
  } catch (error) {
    console.error("Failed to load activities:", error);

    saveActivities();
  }
}

/* ========================================
   SAVE
======================================== */

function saveActivities() {
  save(ACTIVITIES_STORAGE_KEY, dashboardData.activities);
}

/* ========================================
   RENDER
======================================== */

export function renderActivity() {
  const activityList = document.querySelector(".activity__list");

  if (!activityList) {
    console.warn("Activity list was not found.");
    return;
  }

  activityList.innerHTML = "";

  const activities = isShowingAll
    ? dashboardData.activities
    : dashboardData.activities.slice(0, MAX_VISIBLE_ACTIVITIES);

  if (activities.length === 0) {
    renderEmptyState(activityList);
    updateMoreButton();
    return;
  }

  const fragment = document.createDocumentFragment();

  activities.forEach((activity) => {
    fragment.appendChild(createActivityElement(activity));
  });

  activityList.appendChild(fragment);

  updateMoreButton();
}

/* ========================================
   CREATE ELEMENT
======================================== */

function createActivityElement(activity) {
  const article = document.createElement("article");

  article.className = "activity-item";

  article.dataset.id = activity.id;

  article.innerHTML = `
    <div class="activity-item__content">

      <p class="activity-item__text">

        <strong>
          ${activity.user ?? "زهرا"}
        </strong>

        ${activity.action}

        <span class="activity-item__highlight">
          «${activity.target}»
        </span>

        ${activity.description ?? ""}

      </p>

      <span class="activity-item__time">
        ${activity.time ?? "همین الان"}
      </span>

    </div>

    <button
      class="activity-item__menu"
      type="button"
      aria-label="منوی فعالیت"
      aria-expanded="false"
    >
      ⋮
    </button>

    <div
      class="activity-item__dropdown"
      hidden
    >

      <button
        class="activity-item__dropdown-item"
        type="button"
        data-action="edit-activity"
      >
        ویرایش
      </button>

      <button
        class="
          activity-item__dropdown-item
          activity-item__dropdown-item--danger
        "
        type="button"
        data-action="delete-activity"
      >
        حذف
      </button>

    </div>
  `;

  return article;
}

/* ========================================
   EMPTY STATE
======================================== */

function renderEmptyState(activityList) {
  activityList.innerHTML = `
    <div class="activity__empty">

      <span class="activity__empty-icon">
        ✓
      </span>

      <p class="activity__empty-title">
        هنوز فعالیتی ثبت نشده است
      </p>

      <span class="activity__empty-text">
        فعالیت‌های جدید اینجا نمایش داده می‌شوند.
      </span>

    </div>
  `;
}

/* ========================================
   ADD ACTIVITY
======================================== */

export function addActivity({ action, target, description = "" }) {
  const activity = {
    id: Date.now(),

    user: "زهرا",

    avatar: "./assets/images/Front-End Developer.svg",

    avatarAlt: "زهرا",

    action,

    target,

    description,

    time: "همین الان",
  };

  dashboardData.activities.unshift(activity);

  saveActivities();

  renderActivity();
}

/* ========================================
   EDIT ACTIVITY
======================================== */

function editActivity(activityId, modal) {
  const activity = dashboardData.activities.find(
    (item) => item.id === activityId,
  );

  if (!activity) {
    console.warn("Activity not found:", activityId);

    return;
  }

  editingActivityId = activity.id;

  closeActivityDropdowns();

  modal.openActivityModal(activity, handleActivitySubmit);
}

/* ========================================
   HANDLE EDIT
======================================== */

function handleActivitySubmit({ id, activity: formData }) {
  const activity = dashboardData.activities.find((item) => item.id === id);

  if (!activity) {
    console.warn("Activity not found:", id);

    return;
  }

  activity.target = formData.target;

  activity.description = formData.description;

  saveActivities();

  editingActivityId = null;

  renderActivity();
}

/* ========================================
   DELETE
======================================== */

function requestDeleteActivity(activityId, modal) {
  const activity = dashboardData.activities.find(
    (item) => item.id === activityId,
  );

  if (!activity) {
    return;
  }

  closeActivityDropdowns();

  modal.openDeleteConfirm({
    title: "حذف فعالیت",

    message: `آیا از حذف فعالیت «${activity.target}» مطمئن هستید؟`,

    onConfirm() {
      deleteActivity(activityId);
    },
  });
}

/* ========================================
   DELETE ACTIVITY
======================================== */

function deleteActivity(activityId) {
  const index = dashboardData.activities.findIndex(
    (activity) => activity.id === activityId,
  );

  if (index === -1) {
    return;
  }

  dashboardData.activities.splice(index, 1);

  saveActivities();

  renderActivity();
}

/* ========================================
   CLICK
======================================== */

function handleActivityClick(event, modal) {
  /* ========================================
     EDIT
  ======================================== */

  const editButton = event.target.closest('[data-action="edit-activity"]');

  if (editButton) {
    const item = editButton.closest(".activity-item");

    if (!item) {
      return;
    }

    const id = Number(item.dataset.id);

    editActivity(id, modal);

    return;
  }

  /* ========================================
     DELETE
  ======================================== */

  const deleteButton = event.target.closest('[data-action="delete-activity"]');

  if (deleteButton) {
    const item = deleteButton.closest(".activity-item");

    if (!item) {
      return;
    }

    const id = Number(item.dataset.id);

    requestDeleteActivity(id, modal);

    return;
  }

  /* ========================================
     MENU
  ======================================== */

  const menuButton = event.target.closest(".activity-item__menu");

  if (menuButton) {
    toggleActivityDropdown(menuButton);
  }
}

/* ========================================
   TOGGLE DROPDOWN
======================================== */

function toggleActivityDropdown(menuButton) {
  const item = menuButton.closest(".activity-item");

  if (!item) {
    return;
  }

  const dropdown = item.querySelector(".activity-item__dropdown");

  if (!dropdown) {
    return;
  }

  const isOpen = !dropdown.hidden;

  closeActivityDropdowns();

  if (isOpen) {
    return;
  }

  dropdown.hidden = false;

  item.classList.add("activity-item--menu-open");

  menuButton.setAttribute("aria-expanded", "true");
}

/* ========================================
   CLOSE DROPDOWNS
======================================== */

function closeActivityDropdowns() {
  const dropdowns = document.querySelectorAll(".activity-item__dropdown");

  dropdowns.forEach((dropdown) => {
    dropdown.hidden = true;

    const item = dropdown.closest(".activity-item");

    if (!item) {
      return;
    }

    item.classList.remove("activity-item--menu-open");

    item
      .querySelector(".activity-item__menu")
      ?.setAttribute("aria-expanded", "false");
  });
}

/* ========================================
   OUTSIDE CLICK
======================================== */

function handleDocumentClick(event) {
  if (!event.target.closest(".activity-item")) {
    closeActivityDropdowns();
  }
}

/* ========================================
   MORE BUTTON
======================================== */

function updateMoreButton() {
  const moreButton = document.querySelector(".activity__more");

  if (!moreButton) {
    return;
  }

  const hasMore = dashboardData.activities.length > MAX_VISIBLE_ACTIVITIES;

  if (!hasMore) {
    moreButton.hidden = true;
    return;
  }

  moreButton.hidden = false;

  moreButton.textContent = isShowingAll ? "نمایش کمتر" : "مشاهده همه";
}

/* ========================================
   MORE CLICK
======================================== */

function handleMoreClick() {
  isShowingAll = !isShowingAll;

  closeActivityDropdowns();

  renderActivity();
}

/* ========================================
   INIT
======================================== */

export function initActivity(modal) {
  const activityList = document.querySelector(".activity__list");

  const moreButton = document.querySelector(".activity__more");

  if (activityList) {
    activityList.addEventListener("click", (event) => {
      handleActivityClick(event, modal);
    });
  }

  moreButton?.addEventListener("click", handleMoreClick);

  document.addEventListener("click", handleDocumentClick);
}
