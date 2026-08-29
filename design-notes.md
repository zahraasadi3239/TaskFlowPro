# TaskFlowPro — Design Notes

## Sidebar Design Specification

### Purpose

The sidebar provides the primary navigation for the TaskFlowPro dashboard.

Its main responsibilities are:

* Providing quick access to dashboard sections
* Showing the currently active section
* Supporting collapsed and expanded states
* Maintaining a consistent RTL layout
* Providing access to secondary navigation items
* Providing an upgrade/promotion area when available

---

## Width

### Expanded

```text
260px
```

The expanded sidebar uses:

```css
var(--sidebar-width)
```

### Collapsed

```text
80px
```

The collapsed sidebar uses:

```css
var(--sidebar-collapsed-width)
```

The width transition should be smooth and should not cause unexpected layout shifts.

---

## Height

The sidebar occupies the available viewport height.

```css
height: 100vh;
```

The sidebar remains positioned relative to the page layout and supports vertical scrolling when its content exceeds the available height.

---

## Padding

The sidebar uses the project's spacing tokens instead of arbitrary spacing values.

Primary padding:

```css
var(--space-6)
```

Smaller internal spacing should use the existing spacing scale:

```css
var(--space-2)
var(--space-3)
var(--space-4)
var(--space-5)
var(--space-6)
```

---

## Background

The sidebar uses the surface color token:

```css
var(--color-surface)
```

This allows the sidebar to automatically adapt to the active theme.

No hard-coded light or dark background color should be used inside sidebar components.

---

## Shadow

The sidebar should use the project's existing shadow system when a shadow is required.

Preferred token:

```css
var(--shadow-sm)
```

The sidebar should not introduce a new shadow value unless there is a specific design requirement.

---

## Sections

The sidebar is organized into logical sections.

Typical sections include:

1. Brand / Logo
2. Primary Navigation
3. Secondary Navigation
4. Upgrade Card
5. User or utility area, when applicable

Each section should have clear visual separation without unnecessary borders or excessive spacing.

---

## Navigation

Navigation items should:

* Be easy to identify
* Have a consistent height
* Use the project's spacing tokens
* Use the project's typography tokens
* Support keyboard navigation
* Work correctly in RTL layout
* Provide clear hover and active states

Navigation items should use semantic links or buttons depending on their behavior.

---

## Active State

The active navigation item clearly identifies the current dashboard section.

The active state should use the primary color system:

```css
var(--color-primary)
var(--color-primary-light)
```

The active state should provide sufficient contrast between:

* Icon
* Text
* Background

The active state must remain visually clear in both light and dark themes.

---

## Hover State

Navigation items should provide visual feedback on hover.

Hover behavior should use:

```css
var(--color-surface-hover)
```

and the project's transition token:

```css
var(--transition-fast)
```

Hover effects should remain subtle and should not cause layout shifts.

---

## Upgrade Card

The upgrade card is an optional promotional component located inside the sidebar.

Its purpose is to provide information about premium features or an upgrade action.

The component should:

* Match the overall dashboard design
* Use existing design tokens
* Maintain readable typography
* Provide a clear call-to-action
* Remain accessible
* Adapt appropriately to the active theme

The upgrade card should not introduce unrelated colors or spacing values without a clear design reason.

---

## Accessibility

The sidebar must remain accessible across keyboard, mouse, and assistive technologies.

Requirements:

* Navigation must be keyboard accessible.
* Interactive elements must have meaningful accessible names.
* The active navigation item should be programmatically identifiable where appropriate.
* Icons must not be the only way to communicate meaning.
* Sufficient color contrast must be maintained.
* Focus states must remain visible.
* Collapsed navigation must not make important information inaccessible.
* Buttons must use `<button>` elements when performing actions.
* Navigation destinations should use `<a>` elements when appropriate.
* The sidebar should remain usable on smaller screens.

---

## Design Token Rules

The sidebar should use the project's centralized design tokens whenever possible.

Examples:

```css
var(--color-primary)
var(--color-surface)
var(--color-background)
var(--color-text)
var(--color-text-secondary)
var(--color-border)
var(--space-4)
var(--space-6)
var(--radius-md)
var(--radius-lg)
var(--shadow-sm)
var(--transition-fast)
var(--transition-normal)
```

Avoid introducing duplicate values when an appropriate design token already exists.

---

## RTL Considerations

TaskFlowPro is designed primarily for Persian RTL interfaces.

The sidebar must respect:

```html
<html lang="fa" dir="rtl">
```

Layout decisions should therefore use logical CSS properties where appropriate.

Preferred examples:

```css
margin-inline
padding-inline
border-inline
inset-inline
```

instead of unnecessarily relying on physical left/right properties.

---

## Responsive Behavior

The sidebar must remain usable across desktop, tablet, and mobile screen sizes.

On smaller screens, the sidebar may switch to a compact or overlay behavior depending on the application's responsive architecture.

Responsive changes should preserve:

* Navigation accessibility
* Active state
* Keyboard accessibility
* Theme compatibility
* Visual consistency
