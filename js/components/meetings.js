/* ========================================
   MEETINGS COMPONENT
======================================== */

import { dashboardData } from "../data/dashboardData.js";

/* ========================================
   CONSTANTS
======================================== */

const MEETINGS_SELECTOR = ".meetings";
const LIST_SELECTOR = ".meetings__list";
const SHOW_ALL_SELECTOR = ".meetings__link";

const PERSIAN_DIGITS = "۰۱۲۳۴۵۶۷۸۹";

/* ========================================
   STATE
======================================== */

let meetingsElement = null;
let meetingsList = null;

let selectedDate = null;
let showAllMeetings = false;

/* ========================================
   INIT
======================================== */

export function initMeetings() {
  meetingsElement = document.querySelector(MEETINGS_SELECTOR);

  if (!meetingsElement) {
    console.warn("Meetings element was not found.");

    return;
  }

  meetingsList = meetingsElement.querySelector(LIST_SELECTOR);

  if (!meetingsList) {
    console.warn("Meetings list was not found.");

    return;
  }

  setupMeetingEvents();

  renderMeetings();

  console.log("Meetings initialized");
}

/* ========================================
   EVENTS
======================================== */

function setupMeetingEvents() {
  document.addEventListener(
    "calendar:date-selected",
    handleCalendarDateSelected,
  );

  const showAllLink = meetingsElement.querySelector(SHOW_ALL_SELECTOR);

  showAllLink?.addEventListener("click", handleShowAllMeetings);
}

/* ========================================
   CALENDAR DATE SELECTED
======================================== */

function handleCalendarDateSelected(event) {
  const date = event.detail?.date;

  if (!date) {
    return;
  }

  selectedDate = date;

  showAllMeetings = false;

  updateShowAllLabel();

  renderMeetings();
}

/* ========================================
   SHOW ALL
======================================== */

function handleShowAllMeetings(event) {
  event.preventDefault();

  showAllMeetings = !showAllMeetings;

  selectedDate = null;

  updateShowAllLabel();

  renderMeetings();
}

/* ========================================
   UPDATE LINK
======================================== */

function updateShowAllLabel() {
  const showAllLink = meetingsElement?.querySelector(SHOW_ALL_SELECTOR);

  if (!showAllLink) {
    return;
  }

  showAllLink.textContent = showAllMeetings ? "جلسات پیش رو" : "مشاهده همه";
}

/* ========================================
   RENDER
======================================== */

function renderMeetings() {
  if (!meetingsList) {
    return;
  }

  meetingsList.innerHTML = "";

  let meetings = [];

  /* ========================================
     SELECTED DATE
  ======================================== */

  if (selectedDate) {
    meetings = getMeetingsForSelectedDate(selectedDate);
  } else if (showAllMeetings) {
    /* ========================================
     ALL
  ======================================== */
    meetings = getAllMeetings();
  } else {
    /* ========================================
     UPCOMING
  ======================================== */
    meetings = getUpcomingMeetings();
  }

  /* ========================================
     EMPTY STATE
  ======================================== */

  if (meetings.length === 0) {
    renderEmptyState(meetingsList, selectedDate, showAllMeetings);

    return;
  }

  /* ========================================
     RENDER CARDS
  ======================================== */

  const fragment = document.createDocumentFragment();

  meetings.forEach((meeting) => {
    fragment.appendChild(createMeetingElement(meeting));
  });

  meetingsList.appendChild(fragment);
}

/* ========================================
   UPCOMING MEETINGS
======================================== */

function getUpcomingMeetings() {
  const now = getCurrentPersianDateTime();

  return [...dashboardData.meetings]
    .filter((meeting) => createMeetingDateTimeKey(meeting) >= now)
    .sort(compareMeetings);
}

/* ========================================
   ALL MEETINGS
======================================== */

function getAllMeetings() {
  return [...dashboardData.meetings].sort(compareMeetings);
}

/* ========================================
   SELECTED DATE
======================================== */

function getMeetingsForSelectedDate(date) {
  return dashboardData.meetings
    .filter((meeting) => meeting.date === date)
    .sort(compareMeetings);
}

/* ========================================
   COMPARE
======================================== */

function compareMeetings(firstMeeting, secondMeeting) {
  return createMeetingDateTimeKey(firstMeeting).localeCompare(
    createMeetingDateTimeKey(secondMeeting),
  );
}

/* ========================================
   MEETING DATE/TIME KEY
======================================== */

function createMeetingDateTimeKey(meeting) {
  return `${meeting.date} ${meeting.startTime}`;
}

/* ========================================
   CURRENT PERSIAN DATE/TIME
======================================== */

function getCurrentPersianDateTime() {
  const now = new Date();

  const formatter = new Intl.DateTimeFormat("en-US-u-ca-persian", {
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  });

  const parts = formatter.formatToParts(now);

  let year;
  let month;
  let day;
  let hour;
  let minute;

  parts.forEach((part) => {
    if (part.type === "year") {
      year = part.value;
    }

    if (part.type === "month") {
      month = part.value;
    }

    if (part.type === "day") {
      day = part.value;
    }

    if (part.type === "hour") {
      hour = part.value;
    }

    if (part.type === "minute") {
      minute = part.value;
    }
  });

  /*
   * بعضی مرورگرها در ساعت 24 مقدار 24
   * برمی‌گردانند.
   */

  if (hour === "24") {
    hour = "00";
  }

  return `${year}-${month}-${day} ${hour}:${minute}`;
}

/* ========================================
   CREATE MEETING
======================================== */

function createMeetingElement(meeting) {
  const article = document.createElement("article");

  article.className = "meeting-card";

  article.dataset.meetingId = meeting.id;

  /* ========================================
     ACCENT
  ======================================== */

  const accent = document.createElement("span");

  accent.className = `meeting-card__accent meeting-card__accent--${meeting.color}`;

  /* ========================================
     CONTENT
  ======================================== */

  const content = document.createElement("div");

  content.className = "meeting-card__content";

  /* ========================================
     TITLE
  ======================================== */

  const title = document.createElement("h3");

  title.className = "meeting-card__title";

  title.textContent = meeting.title;

  /* ========================================
     TIME
  ======================================== */

  const time = createMeetingTime(meeting);

  /* ========================================
     FOOTER
  ======================================== */

  const footer = createMeetingFooter(meeting);

  content.append(title, time, footer);

  article.append(accent, content);

  return article;
}

/* ========================================
   CREATE TIME
======================================== */

function createMeetingTime(meeting) {
  const wrapper = document.createElement("div");

  wrapper.className = "meeting-card__time";

  const icon = document.createElement("img");

  icon.src = "./assets/icons/clock-3.svg";

  icon.alt = "ساعت";

  icon.className = "meeting-card__icon";

  const time = document.createElement("span");

  time.textContent = `${toPersianNumber(meeting.startTime)} - ${toPersianNumber(
    meeting.endTime,
  )}`;

  wrapper.append(icon, time);

  return wrapper;
}

/* ========================================
   CREATE FOOTER
======================================== */

function createMeetingFooter(meeting) {
  const footer = document.createElement("div");

  footer.className = "meeting-card__footer";

  /* ========================================
     AVATARS
  ======================================== */

  const avatars = document.createElement("div");

  avatars.className = "meeting-card__avatars";

  meeting.participants.forEach((participant) => {
    const image = document.createElement("img");

    image.src = participant.avatar;

    image.alt = participant.name;

    image.title = `${participant.name} - ${participant.role}`;

    avatars.appendChild(image);
  });

  /* ========================================
     STATUS
  ======================================== */

  const status = document.createElement("span");

  status.className = `meeting-card__status meeting-card__status--${meeting.type}`;

  status.textContent = meeting.typeLabel;

  footer.append(avatars, status);

  return footer;
}

/* ========================================
   EMPTY STATE
======================================== */

function renderEmptyState(container, selectedDate, showAll) {
  const empty = document.createElement("p");

  empty.className = "meetings__empty";

  if (selectedDate) {
    empty.textContent = "در این روز جلسه‌ای وجود ندارد.";
  } else if (showAll) {
    empty.textContent = "جلسه‌ای برای نمایش وجود ندارد.";
  } else {
    empty.textContent = "جلسه پیش‌رو وجود ندارد.";
  }

  container.appendChild(empty);
}

/* ========================================
   PERSIAN NUMBER
======================================== */

function toPersianNumber(value) {
  return String(value).replace(/\d/g, (digit) => PERSIAN_DIGITS[digit]);
}
