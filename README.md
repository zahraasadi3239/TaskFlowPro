# TaskFlowPro

> A modern RTL task management dashboard built with HTML, CSS, and Vanilla JavaScript.

TaskFlowPro is a responsive Persian RTL dashboard designed to demonstrate modern front-end development practices, component-based UI organization, reusable design tokens, interactive JavaScript features, and responsive dashboard layouts.

The project was built with a focus on clean UI, maintainable code, accessibility, and a production-oriented front-end structure.

---

## ✨ Features

### Dashboard

* Responsive RTL dashboard
* Statistics cards
* Task management
* Activity feed
* Calendar
* Meetings
* Projects
* Team members
* Analytics section

### Task Management

* Display task information
* Task status
* Task priority
* Task metadata
* Task completion
* Add new tasks
* Task actions
* Task dropdown menu
* Empty state handling

### Navigation

* Responsive Sidebar
* Collapsed Sidebar
* Persistent Sidebar state
* Active navigation state
* Hover interactions

### Header

* Search
* Keyboard shortcut for search
* Notifications
* Notification badge
* User profile menu
* Theme switcher

### Theme

* Light theme
* Dark theme
* CSS custom properties
* Centralized design tokens
* Theme-aware components

### Calendar

* Monthly calendar UI
* Current day indication
* Active day state
* Event indicators
* Previous/next navigation

### Analytics

* Line chart visualization
* Analytics bars
* Progress visualization
* Donut/progress chart
* Responsive analytics layout

### Responsive Design

The dashboard adapts to:

* Desktop
* Laptop
* Tablet
* Mobile

The responsive layout uses CSS Grid, Flexbox, media queries, and reusable spacing tokens.

---

## 🛠️ Technologies

* HTML5
* CSS3
* Vanilla JavaScript
* CSS Custom Properties
* CSS Grid
* Flexbox
* Responsive Design
* LocalStorage
* ES Modules

No front-end framework is required.

---

## 🎨 Design System

TaskFlowPro uses a centralized CSS token system.

Examples:

```css
--color-primary
--color-background
--color-surface
--color-text
--color-text-secondary
--color-border

--space-1
--space-2
--space-3
--space-4
--space-5
--space-6

--radius-sm
--radius-md
--radius-lg

--shadow-sm
--shadow-md
--shadow-lg

--transition-fast
--transition-normal
```

This approach makes the UI easier to maintain and keeps the visual language consistent throughout the application.

---

## 📁 Project Structure

```text
TaskFlowPro/
│
├── assets/
│   ├── icons/
│   ├── images/
│   └── fonts/
│
├── css/
│   ├── base/
│   │   ├── variables.css
│   │   ├── themes.css
│   │   ├── reset.css
│   │   └── typography.css
│   │
│   ├── layout/
│   │
│   ├── components/
│   │
│   ├── pages/
│   │
│   └── responsive/
│
├── js/
│   ├── components/
│   ├── data/
│   ├── utils/
│   └── main.js
│
├── index.html
├── design-notes.md
├── README.md
├── .gitignore
└── ...
```

> The exact folder structure may evolve as the project continues to be refined.

---

## ⚙️ JavaScript Architecture

The JavaScript code is organized into focused modules.

Examples include:

```text
dashboard.js
notification.js
profile.js
search.js
sidebar.js
theme.js
calendar.js
meetings.js
```

Each module is responsible for a specific feature rather than placing all application logic inside one JavaScript file.

The application entry point initializes the required features after the DOM is ready.

---

## 💾 Local Storage

TaskFlowPro uses browser `localStorage` for selected client-side preferences and application state.

Examples include:

* Sidebar collapsed state
* Theme preference
* Authentication-related client state

No backend service is required for the current dashboard implementation.

---

## 🌙 Dark Mode

Dark mode is implemented using a data attribute:

```html
<html data-theme="dark">
```

Theme-specific variables are defined separately from the main design tokens.

Example:

```css
[data-theme="dark"] {
    --color-background: #0F172A;
    --color-surface: #1E293B;
    --color-text: #F8FAFC;
}
```

This allows components to automatically adapt without duplicating component styles.

---

## 📱 Responsive Strategy

The project uses a mobile-first-friendly responsive structure based on:

* CSS Grid
* Flexbox
* Flexible widths
* CSS custom properties
* Media queries

Major dashboard layouts collapse progressively as the viewport becomes smaller.

---

## ♿ Accessibility

Accessibility considerations include:

* Keyboard interaction
* Visible focus states
* Semantic HTML
* Descriptive labels
* Accessible interactive elements
* Appropriate image alternative text
* Escape-key interactions for overlays/dropdowns where applicable

Accessibility will continue to be improved as the project evolves.

---

## 🚀 Getting Started

Clone the repository:

```bash
git clone <repository-url>
```

Move into the project:

```bash
cd TaskFlowPro
```

Then open:

```text
index.html
```

in a browser.

If using VS Code, running the project with Live Server is recommended for local development.

---

## 🌐 Deployment

TaskFlowPro is designed to be deployable as a static front-end application.

The project can be deployed using platforms such as:

* Vercel
* GitHub Pages
* Netlify

---

## 📌 Project Status

**Status: Completed — Portfolio Ready**

The main dashboard UI and interactive features have been implemented.

Final deployment and repository configuration are the remaining release steps.

---

## 🔮 Future Improvements

Potential future improvements include:

* Backend API integration
* Persistent database storage
* User authentication with a real backend
* Advanced task filtering
* Drag & drop task management
* Real-time notifications
* More advanced analytics
* TypeScript migration
* React/Next.js version
* Automated testing

---

## 👩‍💻 Author

**Zahra Asadi**

Front-End Developer

Focused on building modern, responsive, and maintainable web applications with a strong interest in JavaScript, React, Next.js, and modern front-end architecture.

---

## 📄 License

This project is created for educational and portfolio purposes.

```
```
