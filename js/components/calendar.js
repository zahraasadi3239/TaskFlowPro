/* ========================================
   CALENDAR COMPONENT
======================================== */

import { dashboardData } from "../data/dashboardData.js";

/* ========================================
   CONSTANTS
======================================== */

const CALENDAR_SELECTOR = ".calendar";
const DAYS_SELECTOR = ".calendar__days";
const TITLE_SELECTOR = ".calendar__title";

const PREVIOUS_MONTH_SELECTOR = '[aria-label="ماه قبل"]';

const NEXT_MONTH_SELECTOR = '[aria-label="ماه بعد"]';

const PERSIAN_DIGITS = "۰۱۲۳۴۵۶۷۸۹";

/* ========================================
   STATE
======================================== */

let currentDate = new Date();
let calendarElement = null;
let clockInterval = null;

/* ========================================
   INIT
======================================== */

export function initCalendar() {
  calendarElement = document.querySelector(CALENDAR_SELECTOR);

  if (!calendarElement) {
    console.warn("Calendar element was not found.");
    return;
  }

  const daysContainer = calendarElement.querySelector(DAYS_SELECTOR);

  const title = calendarElement.querySelector(TITLE_SELECTOR);

  if (!daysContainer || !title) {
    console.warn("Calendar structure is incomplete.");
    return;
  }

  setupCalendarEvents();

  renderCalendar();

  renderClock();

  startClock();

  console.log("Calendar initialized");
}

/* ========================================
   EVENTS
======================================== */

function setupCalendarEvents() {
  const previousButton = calendarElement.querySelector(PREVIOUS_MONTH_SELECTOR);

  const nextButton = calendarElement.querySelector(NEXT_MONTH_SELECTOR);

  previousButton?.addEventListener("click", handlePreviousMonth);

  nextButton?.addEventListener("click", handleNextMonth);
}

/* ========================================
   PREVIOUS MONTH
======================================== */

function handlePreviousMonth() {
  currentDate = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() - 1,
    1,
  );

  renderCalendar();
}

/* ========================================
   NEXT MONTH
======================================== */

function handleNextMonth() {
  currentDate = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    1,
  );

  renderCalendar();
}

/* ========================================
   RENDER CALENDAR
======================================== */

function renderCalendar() {
  const title = calendarElement.querySelector(TITLE_SELECTOR);

  const daysContainer = calendarElement.querySelector(DAYS_SELECTOR);

  if (!title || !daysContainer) {
    return;
  }

  const currentPersianDate = getPersianDate(currentDate);

  title.textContent = `${currentPersianDate.monthName} ${toPersianNumber(
    currentPersianDate.year,
  )}`;

  daysContainer.innerHTML = "";

  const fragment = document.createDocumentFragment();

  const firstDay = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1,
  );

  const lastDay = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0,
  );

  const firstDayIndex = getPersianWeekDayIndex(firstDay);

  /* ========================================
     PREVIOUS MONTH DAYS
  ======================================== */

  for (let index = 0; index < firstDayIndex; index++) {
    const date = new Date(firstDay);

    date.setDate(firstDay.getDate() - (firstDayIndex - index));

    fragment.appendChild(createDayElement(date, true));
  }

  /* ========================================
     CURRENT MONTH DAYS
  ======================================== */

  for (let day = 1; day <= lastDay.getDate(); day++) {
    const date = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day,
    );

    fragment.appendChild(createDayElement(date, false));
  }

  /* ========================================
     NEXT MONTH DAYS
  ======================================== */

  const totalDays = fragment.childNodes.length;

  const remainingDays = totalDays % 7;

  if (remainingDays !== 0) {
    const nextDays = 7 - remainingDays;

    for (let index = 1; index <= nextDays; index++) {
      const date = new Date(lastDay);

      date.setDate(lastDay.getDate() + index);

      fragment.appendChild(createDayElement(date, true));
    }
  }

  daysContainer.appendChild(fragment);
}

/* ========================================
   CREATE DAY
======================================== */

function createDayElement(date, isMuted) {
  const dayElement = document.createElement("div");

  dayElement.className = "calendar__day";

  if (isMuted) {
    dayElement.classList.add("calendar__day--muted");
  }

  const persianDate = getPersianDate(date);

  const dateKey = createDateKey(persianDate);

  /* ========================================
     TODAY
  ======================================== */

  if (isToday(date)) {
    dayElement.classList.add("calendar__day--today");
  }

  /* ========================================
     MEETINGS
  ======================================== */

  const meetings = getMeetingsForDate(dateKey);

  if (meetings.length > 0) {
    dayElement.classList.add("calendar__day--has-event");

    dayElement.dataset.date = dateKey;

    dayElement.title = createMeetingTooltip(meetings);
  }

  /* ========================================
     NUMBER
  ======================================== */

  const numberElement = document.createElement("span");

  numberElement.className = "calendar__number";

  numberElement.textContent = toPersianNumber(persianDate.day);

  dayElement.appendChild(numberElement);

  /* ========================================
     MEETING DOTS
  ======================================== */

  if (meetings.length > 0) {
    const dotsContainer = document.createElement("span");

    dotsContainer.className = "calendar__events";

    meetings.slice(0, 3).forEach((meeting) => {
      const dot = document.createElement("span");

      dot.className = `calendar__dot calendar__dot--${meeting.color}`;

      dot.setAttribute("aria-hidden", "true");

      dotsContainer.appendChild(dot);
    });

    dayElement.appendChild(dotsContainer);
  }

  /* ========================================
     CLICK
  ======================================== */

  dayElement.addEventListener("click", () => {
    handleDateSelection(dateKey, date);
  });

  return dayElement;
}

/* ========================================
   GET MEETINGS FOR DATE
======================================== */

function getMeetingsForDate(dateKey) {
  return dashboardData.meetings.filter((meeting) => meeting.date === dateKey);
}

/* ========================================
   DATE SELECTION
======================================== */

function handleDateSelection(dateKey, date) {
  document.querySelectorAll(".calendar__day--selected").forEach((day) => {
    day.classList.remove("calendar__day--selected");
  });

  const selectedDay = [...document.querySelectorAll(".calendar__day")].find(
    (day) => day.dataset.date === dateKey,
  );

  selectedDay?.classList.add("calendar__day--selected");

  document.dispatchEvent(
    new CustomEvent("calendar:date-selected", {
      detail: {
        date: dateKey,
        nativeDate: date,
      },
    }),
  );
}

/* ========================================
   MEETING TOOLTIP
======================================== */

function createMeetingTooltip(meetings) {
  return meetings
    .map(
      (meeting) => `${meeting.title} • ${toPersianNumber(meeting.startTime)}`,
    )
    .join("\n");
}

/* ========================================
   DATE KEY
======================================== */

function createDateKey(date) {
  const year = String(date.year).padStart(4, "0");

  const month = String(date.month).padStart(2, "0");

  const day = String(date.day).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

/* ========================================
   GET PERSIAN DATE
======================================== */

function getPersianDate(date) {
  const formatter = new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
    year: "numeric",
    month: "numeric",
    day: "numeric",
  });

  const parts = formatter.formatToParts(date);

  let day = "";
  let month = "";
  let year = "";

  parts.forEach((part) => {
    if (part.type === "day") {
      day = normalizePersianDigits(part.value);
    }

    if (part.type === "month") {
      month = normalizePersianDigits(part.value);
    }

    if (part.type === "year") {
      year = normalizePersianDigits(part.value);
    }
  });

  return {
    day: Number(day),
    month: Number(month),
    year: Number(year),

    monthName: new Intl.DateTimeFormat("fa-IR-u-ca-persian", {
      month: "long",
    }).format(date),
  };
}

/* ========================================
   NORMALIZE DIGITS
======================================== */

function normalizePersianDigits(value) {
  return String(value).replace(/[۰-۹]/g, (digit) =>
    String(PERSIAN_DIGITS.indexOf(digit)),
  );
}

/* ========================================
   WEEK DAY
======================================== */

function getPersianWeekDayIndex(date) {
  return (date.getDay() + 1) % 7;
}

/* ========================================
   TODAY
======================================== */

function isToday(date) {
  const today = new Date();

  return (
    date.getFullYear() === today.getFullYear() &&
    date.getMonth() === today.getMonth() &&
    date.getDate() === today.getDate()
  );
}

/* ========================================
   CLOCK
======================================== */

function startClock() {
  if (clockInterval) {
    clearInterval(clockInterval);
  }

  clockInterval = setInterval(() => {
    renderClock();
  }, 1000);
}

/* ========================================
   RENDER CLOCK
======================================== */

function renderClock() {
  if (!calendarElement) {
    return;
  }

  let clockElement = calendarElement.querySelector(".calendar__clock");

  if (!clockElement) {
    clockElement = createClockElement();

    const header = calendarElement.querySelector(".calendar__header");

    header?.insertAdjacentElement("afterend", clockElement);
  }

  const now = new Date();

  const hours = String(now.getHours()).padStart(2, "0");

  const minutes = String(now.getMinutes()).padStart(2, "0");

  const seconds = String(now.getSeconds()).padStart(2, "0");

  const today = getPersianDate(now);

  const dateElement = clockElement.querySelector(".calendar__clock-date");

  const timeElement = clockElement.querySelector(".calendar__clock-time");

  if (dateElement) {
    dateElement.textContent = `${toPersianNumber(
      today.day,
    )} ${today.monthName} ${toPersianNumber(today.year)}`;
  }

  if (timeElement) {
    timeElement.textContent = `${toPersianNumber(hours)}:${toPersianNumber(
      minutes,
    )}:${toPersianNumber(seconds)}`;
  }
}

/* ========================================
   CREATE CLOCK
======================================== */

function createClockElement() {
  const clock = document.createElement("div");

  clock.className = "calendar__clock";

  clock.innerHTML = `
    <div class="calendar__clock-info">
      <span class="calendar__clock-label">
        امروز
      </span>

      <span class="calendar__clock-date"></span>
    </div>

    <time
      class="calendar__clock-time"
      dir="ltr"
      aria-label="ساعت فعلی"
    ></time>
  `;

  return clock;
}

/* ========================================
   PERSIAN NUMBER
======================================== */

function toPersianNumber(value) {
  return String(value).replace(/\d/g, (digit) => PERSIAN_DIGITS[digit]);
}
