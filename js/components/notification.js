// import { notifications } from "../data/notificationData.js";

// export function initNotification() {
//   console.log("Notification initialized");

//   const notification = document.querySelector(".notification");
//   const notificationButton = document.querySelector(".header__notification");
//   const notificationList = document.querySelector(".notification__list");
//   const badge = document.querySelector(".header__badge");

//   console.log({
//     notifications,
//     notificationButton,
//     notificationList,
//     badge,
//   });

//   if (!notification || !notificationButton || !notificationList || !badge) {
//     console.log("Notification elements not found");
//     return;
//   }

//   renderNotifications(notificationList);
//   updateNotificationBadge(badge);

//   setupNotification(notification, notificationButton);
// }

// function setupNotification(notification, notificationButton) {
//   notificationButton.addEventListener("click", (event) => {
//     event.stopPropagation();
//     console.log("Notification initialized");
//     notification.classList.toggle("notification--open");
//   });

//   document.addEventListener("click", (event) => {
//     if (!notification.contains(event.target)) {
//       closeNotification(notification);
//     }
//   });

//   document.addEventListener("keydown", (event) => {
//     if (event.key === "Escape") {
//       closeNotification(notification);
//     }
//   });
// }

// function closeNotification(notification) {
//   notification.classList.remove("notification--open");
// }

// function renderNotifications(notificationList) {
//   notificationList.replaceChildren();

//   notifications?.forEach((notification) => {
//     const item = createNotificationItem(notification);

//     notificationList.appendChild(item);
//   });
// }

// function createNotificationItem(notification) {
//   const item = document.createElement("div");

//   item.classList.add("notification__item");

//   if (notification.unread) {
//     item.classList.add("notification__item--unread");
//   }

//   const iconContainer = document.createElement("div");
//   iconContainer.classList.add("notification__icon");

//   const icon = document.createElement("img");
//   icon.src = "./assets/icons/check.svg";
//   icon.alt = "";

//   const content = document.createElement("div");

//   const title = document.createElement("h4");
//   title.textContent = notification.title;

//   const time = document.createElement("span");
//   time.textContent = notification.time;

//   iconContainer.appendChild(icon);

//   content.appendChild(title);
//   content.appendChild(time);

//   item.appendChild(iconContainer);
//   item.appendChild(content);

//   return item;
// }

// function updateNotificationBadge(badge) {
//   const unreadCount = notifications.filter(
//     (notification) => notification.unread,
//   ).length;

//   badge.textContent = unreadCount;
//   badge.hidden = unreadCount === 0;
// }
///////////////
import { notifications as initialNotifications } from "../data/notificationData.js";
import { save, load } from "../utils/storage.js";

/* ========================================
   CONFIG
======================================== */

const STORAGE_KEY = "dashboard-notifications";

const SELECTORS = {
  notification: ".notification",
  button: ".header__notification",
  list: ".notification__list",
  badge: ".header__badge",
};

const ACTIONS = {
  markAllRead: "mark-all-read",
};

/* ========================================
   STATE
======================================== */

let notificationState = [];

/* ========================================
   INITIALIZATION
======================================== */

export function initNotification() {
  const notification = document.querySelector(SELECTORS.notification);

  const notificationButton = document.querySelector(SELECTORS.button);

  const notificationList = document.querySelector(SELECTORS.list);

  const badge = document.querySelector(SELECTORS.badge);

  if (!notification || !notificationButton || !notificationList || !badge) {
    return;
  }

  notificationState = loadNotifications();

  renderNotifications(notificationList, notificationState);

  updateNotificationBadge(badge, notificationState);

  setupNotificationEvents(
    notification,
    notificationButton,
    notificationList,
    badge,
  );
}

/* ========================================
   LOAD STATE
======================================== */

function loadNotifications() {
  const savedNotifications = load(STORAGE_KEY);

  if (Array.isArray(savedNotifications)) {
    return savedNotifications;
  }

  const initialState = initialNotifications.map((notification) => ({
    ...notification,
  }));

  save(STORAGE_KEY, initialState);

  return initialState;
}

/* ========================================
   EVENTS
======================================== */

function setupNotificationEvents(
  notification,
  notificationButton,
  notificationList,
  badge,
) {
  /* ================================
     Toggle Notification
  ================================ */

  notificationButton.addEventListener("click", (event) => {
    event.stopPropagation();

    const isOpen = notification.classList.toggle("notification--open");

    notificationButton.setAttribute("aria-expanded", String(isOpen));
  });

  /* ================================
     Notification Item Click
  ================================ */

  notificationList.addEventListener("click", (event) => {
    const item = event.target.closest(".notification__item");

    if (!item) {
      return;
    }

    const notificationId = Number(item.dataset.id);

    markNotificationAsRead(notificationId);

    renderNotifications(notificationList, notificationState);

    updateNotificationBadge(badge, notificationState);
  });

  /* ================================
     Actions
  ================================ */

  notification.addEventListener("click", (event) => {
    const actionElement = event.target.closest("[data-action]");

    if (!actionElement) {
      return;
    }

    handleAction(actionElement, notificationList, badge, event);
  });

  /* ================================
     Click Outside
  ================================ */

  document.addEventListener("click", (event) => {
    if (!notification.contains(event.target)) {
      closeNotification(notification, notificationButton);
    }
  });

  /* ================================
     Escape
  ================================ */

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") {
      return;
    }

    closeNotification(notification, notificationButton);
  });
}

/* ========================================
   ACTION HANDLER
======================================== */

function handleAction(actionElement, notificationList, badge, event) {
  const action = actionElement.dataset.action;

  switch (action) {
    case ACTIONS.markAllRead:
      event.preventDefault();

      markAllNotificationsAsRead();

      renderNotifications(notificationList, notificationState);

      updateNotificationBadge(badge, notificationState);

      break;

    default:
      break;
  }
}

/* ========================================
   READ ONE NOTIFICATION
======================================== */

function markNotificationAsRead(notificationId) {
  const notification = notificationState.find(
    (item) => item.id === notificationId,
  );

  if (!notification) {
    return;
  }

  if (!notification.unread) {
    return;
  }

  notification.unread = false;

  saveNotifications();
}

/* ========================================
   READ ALL
======================================== */

function markAllNotificationsAsRead() {
  let hasChanges = false;

  notificationState.forEach((notification) => {
    if (notification.unread) {
      notification.unread = false;

      hasChanges = true;
    }
  });

  if (!hasChanges) {
    return;
  }

  saveNotifications();
}

/* ========================================
   SAVE STATE
======================================== */

function saveNotifications() {
  save(STORAGE_KEY, notificationState);
}

/* ========================================
   RENDER
======================================== */

function renderNotifications(notificationList, notificationData) {
  notificationList.replaceChildren();

  if (!notificationData.length) {
    renderEmptyState(notificationList);

    return;
  }

  notificationData.forEach((notification) => {
    const item = createNotificationItem(notification);

    notificationList.appendChild(item);
  });
}

/* ========================================
   CREATE NOTIFICATION ITEM
======================================== */

function createNotificationItem(notification) {
  const item = document.createElement("div");

  item.classList.add("notification__item");

  item.dataset.id = String(notification.id);

  if (notification.unread) {
    item.classList.add("notification__item--unread");
  }

  const iconContainer = document.createElement("div");

  iconContainer.classList.add("notification__icon");

  const icon = document.createElement("img");

  icon.src = "./assets/icons/check.svg";

  icon.alt = "";

  const content = document.createElement("div");

  const title = document.createElement("h4");

  title.textContent = notification.title;

  const time = document.createElement("span");

  time.textContent = notification.time;

  iconContainer.appendChild(icon);

  content.appendChild(title);

  content.appendChild(time);

  item.appendChild(iconContainer);

  item.appendChild(content);

  return item;
}

/* ========================================
   BADGE
======================================== */

function updateNotificationBadge(badge, notificationData) {
  const unreadCount = notificationData.filter(
    (notification) => notification.unread,
  ).length;

  badge.textContent = String(unreadCount);

  badge.hidden = unreadCount === 0;
}

/* ========================================
   EMPTY STATE
======================================== */

function renderEmptyState(notificationList) {
  const emptyState = document.createElement("div");

  emptyState.classList.add("notification__empty");

  emptyState.textContent = "اعلان جدیدی وجود ندارد";

  notificationList.appendChild(emptyState);
}

/* ========================================
   CLOSE
======================================== */

function closeNotification(notification, notificationButton) {
  notification.classList.remove("notification--open");

  notificationButton.setAttribute("aria-expanded", "false");
}
