# 📜 Development Rules and Guidelines - Charity Bridge

This document gathers the standards, best practices, and mandatory quality requirements for the development of the **Charity Bridge** project. Any code modification must strictly adhere to these guidelines to ensure that the platform is accessible, performant, and easy to maintain.

> [!IMPORTANT]
> * **Strict English Policy**: All user interface content (display text, labels, buttons, error messages, placeholders, simulated feedback, and accessibility descriptions) and all written code (including comments, logs, and development files) must be implemented **strictly in English (en)**.
> * **Synchronous Documentation Updates**: Any codebase alteration, feature update, or technology stack change must be immediately and synchronously updated across the project tracking files: `task_plan.md`, `progress.md`, and `rules.md`.

---

## ♿ 1. Accessibility (WCAG 2.1 Level AA)

Accessibility is not optional. The application must be fully navigable and understandable by anyone, including those using assistive technologies.

*   **Keyboard Navigation**:
    *   **Prohibited**: Using `display: none` or `visibility: hidden` on real focusable elements (like radio or checkbox inputs) for styling purposes, as this removes them from the focus tree.
    *   **Solution**: To visually hide radio buttons while maintaining accessibility, use the visual hiding technique (class `.sr-only` or similar):
        ```css
        .sr-only {
          position: absolute;
          width: 1px;
          height: 1px;
          padding: 0;
          margin: -1px;
          overflow: hidden;
          clip: rect(0, 0, 0, 0);
          white-space: nowrap;
          border: 0;
        }
        ```
    *   Modified interactive elements must have clear focus styles for the `:focus-visible` state.
*   **Emojis and Icons**:
    *   All emojis inserted directly into the HTML must be wrapped in a `<span>` element containing the attributes `role="img"` and `aria-label="short description in English"`.
    *   *Correct example*: `<span role="img" aria-label="handshake">🤝</span>`
*   **HTML5 Semantics**:
    *   Use appropriate structural elements: `<header>`, `<main>`, `<section>`, `<footer>`, `<nav>`, and `<aside>`.
    *   Forms must group logically related controls with `<fieldset>` and provide a legend with `<legend>`.
*   **Color Contrast**:
    *   Ensure a contrast ratio of at least **4.5:1** for normal text and **3:1** for large text relative to the background.

---

## 🎨 2. Style and Design (CSS)

The interface must convey a professional, modern, and reliable image.

*   **Modularity and Single Source of Truth**:
    *   All CSS must be centralized in a single external file (`style.css`), prohibiting the use of internal `<style>` blocks in HTML pages.
    *   All visual identity (such as colors, layouts, button structures, cards, and alerts) must reside strictly in this unified file. Any new pages (such as `volunteer.html`) must import and reuse standard classes from `style.css`, ensuring visual consistency and ease of maintenance in a single place.
*   **CSS Variables (Custom Properties)**:
    *   Standard colors, fonts, borders, and spacings must be defined as variables in the `:root` pseudo-class to ensure consistency and facilitate future Dark Mode scaling.
*   **Responsive Design (Mobile-First)**:
    *   Build flexible layouts using CSS Grid and Flexbox.
    *   Do not use fixed pixel widths (`px`) for main containers; prefer percentages (`%`), `max-width`, or dynamic units (`rem`, `vw`).
*   **Fluid Interactions**:
    *   Interactive buttons, links, and cards must have smooth transitions (`transition: all 0.2s ease`) for `:hover`, `:active`, and `:focus` states.

---

## ⚙️ 3. Logic and Code Architecture (JavaScript)

Script code must be clean, modular, and free of redundancies.

*   **Separation of Concerns**:
    *   All JavaScript logic must be moved to an external file (`app.js`).
*   **Do Not Pollute Global Scope**:
    *   Encapsulate application logic in modules or use structures that limit the global scope.
*   **Form Validation**:
    *   **Prohibited**: Using native `alert()` for mandatory field validation.
    *   **Solution**: Implement inline feedback messages directly below the affected inputs and style visual validation classes.
*   **Local Persistence**:
    *   Use `SQLite (sql.js WASM)` with `IndexedDB` binary persistence as the primary local database. Actions taken on the NGO portal (such as creating a ticket) instantly reflect on the volunteer portal via shared relational tables.
    *   `localStorage` is retained as a fallback storage mechanism only.
*   **Verification Links**:
    *   **Mandatory**: At the end of each response involving the creation or modification of visible files (HTML pages), the AI assistant must provide absolute clickable links in the `file:///` format to allow the user to immediately test and verify the result locally.

---

## 🚀 4. Publishing Guidelines (GitHub & Vercel)

To ensure that the application can be built, published to GitHub, and hosted successfully on Vercel without resource loading failures:

*   **Strict Relative Paths**:
    *   **Prohibited**: Using local absolute routes (such as `file:///C:/dev/...`) or local disk paths in the web app code.
    *   **Solution**: All links (`href`), script loads (`src`), and asset imports must use relative paths (e.g., `style.css`, `app.js`, `volunteer.html`).
*   **Default Entry Point (`index.html`)**:
    *   Vercel and GitHub Pages search for an `index.html` file in the root directory to serve as the public landing page.
    *   We must maintain a unified `index.html` file acting as a welcoming central landing splash hub connecting all three views of the ecosystem.
*   **Browser State Management**:
    *   Data persistence will continue utilizing `localStorage`. We must ensure compatibility within secure HTTPS contexts required in production.
*   **Clean URLs via vercel.json**:
    *   Configure a `vercel.json` file to manage clean URLs, eliminating the need to display `.html` extensions in the final production address bar.

---

## 📝 5. Documentation Maintenance & Tracking

To ensure that the project state and engineering choices remain perfectly aligned:
* **Tracking Synchronicity**: Whenever any part of the application code, technology stack, features, or assets are modified or updated, the accompanying tracking documents (`task_plan.md`, `progress.md`, and `rules.md` themselves) must be updated synchronously to reflect those changes.
* **Written Standard**: Absolutely everything written from now on in the application, repository, or documentation must be in English.

---

## 📊 6. Commit Checklist

Before finalizing any task and closing the activity, verify:
1. [ ] Is the HTML valid and free of structural syntax errors?
2. [ ] Is it possible to fill the form and trigger all functions using **only** the keyboard (`Tab`, `Space`, `Enter`, `Arrows`)?
3. [ ] Do all emojis have `aria-label` and `role="img"` attributes?
4. [ ] Is the CSS in a separate file and using `:root` variables?
5. [ ] Does the layout remain readable and visually sound in mobile resolutions (e.g., 375px)?
6. [ ] Are there any remaining `alert()` calls in the code?
7. [ ] Do all internal links and file references use relative paths compatible with Vercel deployment?
8. [ ] Have `task_plan.md`, `progress.md`, and `rules.md` been updated to match any modifications made during this task?
