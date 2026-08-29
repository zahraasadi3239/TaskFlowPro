import { dashboardData } from "../data/dashboardData.js";
import { normalizeText } from "../utils/search-utils.js";

export function initSearch() {
  console.log("Search initialized");

  /* ========================================
       SEARCH ELEMENTS
    ======================================== */

  const searchInput = document.querySelector(".header__search-input");

  const searchResults = document.querySelector(".header__search-results");

  const searchContainer = document.querySelector(".header__search");

  /* ========================================
       SAFETY CHECK
    ======================================== */

  if (!searchInput || !searchResults || !searchContainer) {
    console.warn("Search elements were not found.");

    return;
  }

  let activeIndex = -1;

  /* ========================================
       SEARCH INDEX
    ======================================== */

  const searchIndex = createSearchIndex();

  function createSearchIndex() {
    return [
      ...dashboardData.tasks.map((task) => ({
        id: `task-${task.id}`,
        type: "task",
        typeLabel: "وظیفه",
        title: task.title,
        description: `${task.priority} · ${task.status}`,
      })),

      ...dashboardData.projects.map((project) => ({
        id: `project-${project.id}`,
        type: "project",
        typeLabel: "پروژه",
        title: project.name,
        description: project.description,
      })),

      ...dashboardData.team.map((member) => ({
        id: `member-${member.id}`,
        type: "member",
        typeLabel: "عضو تیم",
        title: member.name,
        description: member.job,
      })),

      ...dashboardData.meetings.map((meeting) => ({
        id: `meeting-${meeting.id}`,
        type: "meeting",
        typeLabel: "جلسه",
        title: meeting.title,
        description: meeting.time,
      })),
    ];
  }

  /* ========================================
       SEARCH ENGINE
    ======================================== */

  function search(query) {
    return searchIndex

      .map((item) => {
        const title = normalizeText(item.title);

        const description = normalizeText(item.description);

        let score = 0;

        /* Exact match */

        if (title === query) {
          score += 100;
        }

        /* Starts with */

        if (title.startsWith(query)) {
          score += 50;
        }

        /* Contains */

        if (title.includes(query)) {
          score += 25;
        }

        /* Description */

        if (description.includes(query)) {
          score += 10;
        }

        return {
          ...item,
          score,
        };
      })

      .filter((item) => item.score > 0)

      .sort((a, b) => b.score - a.score);
  }

  /* ========================================
       INPUT
    ======================================== */

  searchInput.addEventListener("input", handleSearchInput);

  function handleSearchInput(event) {
    const query = normalizeText(event.target.value);

    activeIndex = -1;

    if (!query) {
      closeResults();

      return;
    }

    const results = search(query);

    renderResults(results);
  }

  /* ========================================
       RENDER RESULTS
    ======================================== */

  function renderResults(results, query) {
    searchResults.innerHTML = "";

    searchResults.hidden = false;

    searchInput.setAttribute("aria-expanded", "true");

    if (results.length === 0) {
      renderEmptyState();

      return;
    }

    const fragment = document.createDocumentFragment();

    results.forEach((result, index) => {
      const element = createResult(result, index);

      fragment.appendChild(element);
    });

    searchResults.appendChild(fragment);
  }

  /* ========================================
       CREATE RESULT
    ======================================== */

  function createResult(result, index) {
    const button = document.createElement("button");

    button.type = "button";

    button.className = "header__search-result";

    button.dataset.id = result.id;

    button.dataset.type = result.type;

    button.dataset.title = result.title;

    button.dataset.index = index;

    button.setAttribute("role", "option");

    button.innerHTML = `
            <span class="header__search-result-content">
            <strong class="header__search-result-title">
                    ${result.title}
                </strong>

                <span class="header__search-result-description">
                    ${result.description}
                </span>

            </span>

            <span class="header__search-result-type">
                ${result.typeLabel}
            </span>
        `;

    return button;
  }
  function highlightMatch(text, query) {
    if (!query) {
      return text;
    }

    const normalizedText = normalizeText(text);

    const normalizedQuery = normalizeText(query);

    const index = normalizedText.indexOf(normalizedQuery);

    if (index === -1) {
      return text;
    }

    const matchedText = text.slice(index, index + query.length);

    return `
        ${text.slice(0, index)}
        <mark class="header__search-highlight">
            ${matchedText}
        </mark>
        ${text.slice(index + query.length)}
    `;
  }

  /* ========================================
       EMPTY STATE
    ======================================== */

  function renderEmptyState() {
    searchResults.innerHTML = `
            <div class="header__search-empty">
                نتیجه‌ای برای جستجوی شما پیدا نشد.
            </div>
        `;
  }

  /* ========================================
       KEYBOARD NAVIGATION
    ======================================== */

  searchInput.addEventListener("keydown", handleKeyboardNavigation);

  function handleKeyboardNavigation(event) {
    const results = getResultElements();

    if (!results.length) {
      if (event.key === "Escape") {
        closeResults();
      }

      return;
    }

    switch (event.key) {
      case "ArrowDown":
        event.preventDefault();

        activeIndex++;

        if (activeIndex >= results.length) {
          activeIndex = 0;
        }

        updateActiveResult(results);

        break;

      case "ArrowUp":
        event.preventDefault();

        activeIndex--;

        if (activeIndex < 0) {
          activeIndex = results.length - 1;
        }

        updateActiveResult(results);

        break;

      case "Enter":
        event.preventDefault();

        if (activeIndex >= 0) {
          selectResult(results[activeIndex]);
        }

        break;

      case "Escape":
        closeResults();

        break;
    }
  }

  function getResultElements() {
    return [...searchResults.querySelectorAll(".header__search-result")];
  }

  function updateActiveResult(results) {
    results.forEach((result, index) => {
      const isActive = index === activeIndex;

      result.classList.toggle("header__search-result--active", isActive);

      result.setAttribute("aria-selected", String(isActive));
    });
  }

  /* ========================================
       CLICK RESULT
    ======================================== */

  searchResults.addEventListener("click", handleResultClick);

  function handleResultClick(event) {
    const result = event.target.closest(".header__search-result");

    if (!result) {
      return;
    }

    selectResult(result);
  }

  /* ========================================
       SELECT RESULT
    ======================================== */

  function selectResult(result) {
    const type = result.dataset.type;

    const id = result.dataset.id;

    const title = result.dataset.title;

    console.log("Selected search result:", {
      type,
      id,
      title,
    });

    navigateToResult(type, title);

    closeResults();
  }

  /* ========================================
       NAVIGATE TO RESULT
    ======================================== */

  function navigateToResult(type, title) {
    const target = findTargetElement(type, title);

    if (!target) {
      console.warn("Search target was not found:", {
        type,
        title,
      });

      return;
    }

    target.scrollIntoView({
      behavior: "smooth",
      block: "center",
    });

    highlightTarget(target);
  }

  /* ========================================
       FIND TARGET ELEMENT
    ======================================== */

  function findTargetElement(type, title) {
    const normalizedTitle = normalizeText(title);

    let selector;

    switch (type) {
      case "task":
        selector = ".task";
        break;

      case "project":
        selector = ".project-card";
        break;

      case "member":
        selector = ".member";
        break;

      case "meeting":
        selector = ".meeting-card";
        break;

      default:
        return null;
    }

    const elements = document.querySelectorAll(selector);

    return (
      [...elements].find((element) => {
        const titleElement = getTitleElement(type, element);

        if (!titleElement) {
          return false;
        }

        return normalizeText(titleElement.textContent) === normalizedTitle;
      }) || null
    );
  }

  /* ========================================
       GET TITLE ELEMENT
    ======================================== */

  function getTitleElement(type, element) {
    switch (type) {
      case "task":
        return element.querySelector(".task__title");

      case "project":
        return element.querySelector(".project-card__title");

      case "member":
        return element.querySelector(".member__name");

      case "meeting":
        return element.querySelector(".meeting-card__title");

      default:
        return null;
    }
  }

  /* ========================================
       HIGHLIGHT TARGET
    ======================================== */

  function highlightTarget(target) {
    target.classList.remove("search-target--highlight");

    void target.offsetWidth;

    target.classList.add("search-target--highlight");

    setTimeout(() => {
      target.classList.remove("search-target--highlight");
    }, 1800);
  }

  /* ========================================
       CLOSE RESULTS
    ======================================== */

  function closeResults() {
    searchResults.hidden = true;

    searchResults.innerHTML = "";

    searchInput.setAttribute("aria-expanded", "false");

    activeIndex = -1;
  }

  /* ========================================
       CLICK OUTSIDE
    ======================================== */

  document.addEventListener("click", handleOutsideClick);

  function handleOutsideClick(event) {
    if (!searchContainer.contains(event.target)) {
      closeResults();
    }
  }

  /* ========================================
       CTRL + K
    ======================================== */

  document.addEventListener("keydown", handleSearchShortcut);

  function handleSearchShortcut(event) {
    const isShortcut = event.ctrlKey && event.key.toLowerCase() === "k";

    if (!isShortcut) {
      return;
    }

    event.preventDefault();

    searchInput.focus();

    searchInput.select();
  }
}
