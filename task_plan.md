# 📋 Detailed Task Plan - Charity Bridge

This document divides the platform action plan into specific development tasks, indicating the impacted files, complexity level, and technical acceptance criteria.

---

## 🎯 Phase 1: Foundation, Accessibility, and Modularization

### Task 1.1: Design System Extraction and Creation (CSS)
*   **Description**: Create a unified external CSS file to remove all inline styles and centralize design variables.
*   **Impacted Files**:
    *   `[NEW]` `style.css` (Stylesheet creation)
    *   `[MODIFY]` `NGO Portal.html` (Removal of the internal `<style>` tag and inclusion of `<link>`)
*   **Specifications**:
    *   Define `:root` CSS custom variables for color palette, typography scales, transitions, and spacings.
    *   Implement the `.sr-only` class for visually accessible off-screen hiding.
    *   Maintain and polish the existing responsive layout grid.

### Task 1.2: Semantic HTML & Accessibility Adjustments (a11y)
*   **Description**: Adapt the HTML DOM to comply with accessibility standards and modern structures.
*   **Impacted Files**:
    *   `[MODIFY]` `NGO Portal.html`
*   **Specifications**:
    *   Wrap main content container in a structural `<main>` element.
    *   Group urgency choice radio triggers inside a proper `<fieldset>` with `<legend>`.
    *   Replace inaccessible `display: none` radio button styles with an off-screen `.sr-only` setup, adjusting focus ring styling under `:focus-visible` on the labels.
    *   Wrap all graphical emojis across the DOM inside a `<span role="img" aria-label="...">` tag with clear English labels.

### Task 1.3: SEO and Metadata Optimizations
*   **Description**: Add structural tags to `<head>` for optimal search engine crawling and visual social sharing cards.
*   **Impacted Files**:
    *   `[MODIFY]` `NGO Portal.html`
*   **Specifications**:
    *   Inject custom descriptive `<meta name="description">`.
    *   Add essential Open Graph tags (`og:title`, `og:description`, `og:image`).

---

## 🎨 Phase 2: UI/UX Refinement and Form Validation

### Task 2.1: Inline Form Validation (JS)
*   **Description**: Replace legacy blocking browser `alert()` triggers with visual inline error banners under individual inputs.
*   **Impacted Files**:
    *   `[MODIFY]` `NGO Portal.html`
*   **Specifications**:
    *   Create error container spans `<span class="error-message">` beneath obligatory fields.
    *   Upon form submission, visually highlight invalid fields, focus dynamically on the first failing input, and block execution.
    *   Wipe error indicators instantly upon input event triggers as the user starts typing.

### Task 2.2: Demo Trigger Implementation (Auto-Fill)
*   **Description**: Avoid permanent hardcoded placeholder input data. Provide placeholders and a clean demo button.
*   **Impacted Files**:
    *   `[MODIFY]` `NGO Portal.html`
*   **Specifications**:
    *   Wipe default hardcoded values from initial form text fields and textareas.
    *   Provide a sleek, premium "✨ Fill Example" button.
    *   Hook up dynamic mock inputs upon button click.

### Task 2.3: CSS Transitions and Hover Micro-animations
*   **Description**: Integrate micro-interactions to breathe life into the platform.
*   **Impacted Files**:
    *   `[MODIFY]` `style.css`
*   **Specifications**:
    *   Add smooth translations on hover (`transform: translateY(-4px)`) for cards.
    *   Polish pulse status animations on tickets.
    *   Introduce stagger animations on ticket lists.

---

## 👥 Phase 3: Volunteer Portal (`volunteer.html`)

### Task 3.1: Structural Redesign of Volunteer Interface
*   **Description**: Transform the cloned page copy into an interactive dashboard tailored for volunteers.
*   **Impacted Files**:
    *   `[MODIFY]` `volunteer.html` (Overwrite identical clone)
*   **Specifications**:
    *   Replace registration elements with a clean statistics dashboard (Hours Contributed, Active Claims, Profile Accuracy).

### Task 3.2: Ticket Queue Feed and Filters
*   **Description**: Render active open tickets with dynamic category filters and keyword searches.
*   **Impacted Files**:
    *   `[MODIFY]` `volunteer.html`
*   **Specifications**:
    *   List open tickets displaying NGO name, category tags, urgency pill highlights, and summaries.
    *   Provide horizontal category selection filter pills (e.g. Cybersecurity, IT Infrastructure, Finance).
    *   Configure text input search filters.

### Task 3.3: Ticket Details Card and Task Claiming
*   **Description**: Allow volunteers to view detailed AI analysis, suggested responses, and claim the task.
*   **Impacted Files**:
    *   `[MODIFY]` `volunteer.html`
*   **Specifications**:
    *   Build an expand details pane rendering AI suggested response guides, matching volunteer skills, and NGO email addresses.
    *   Add a prominent "Claim Ticket" action button.
    *   Enable claiming workflows, changing ticket status dynamically and incrementing statistic metrics.

---

## 🧠 Phase 4: Local AI Engine and Storage Integration

### Task 4.1: Extraction and Creation of Unified Dynamic Logic (JS)
*   **Description**: Move all script segments to a single unlinked external script.
*   **Impacted Files**:
    *   `[NEW]` `app.js`
    *   `[MODIFY]` `NGO Portal.html` (Wipe script tag, import `app.js`)
    *   `[MODIFY]` `volunteer.html` (Import `app.js`)

### Task 4.2: Content-Based Dynamic AI Classifier
*   **Description**: Create a semantic regex keyword triage engine to predict categories dynamically when the "Let AI decide" option is active.
*   **Impacted Files**:
    *   `[MODIFY]` `app.js`
*   **Specifications**:
    *   Scan inputs for keyword clusters (e.g. "hacked", "phishing" assign to Cybersecurity).
    *   Auto-select predicted category and render response plans.

### Task 4.3: Real-time Cross-Portal localStorage Synchronization
*   **Description**: Bind ticket submissions and status updates dynamically across client tabs.
*   **Impacted Files**:
    *   `[MODIFY]` `app.js`
*   **Specifications**:
    *   Push new NGO ticket objects into a shared `charity_bridge_tickets` local array upon creation.
    *   Synchronize stats counters and disabled claim states instantly.

---

## 🚀 Phase 5: GitHub Integration & Vercel Deployment

### Task 5.1: Landing Splash Hub Creation (`index.html`)
*   **Description**: Build a premium entrance splash portal linking all visual vistas of the ecosystem, supporting server entry requirements.
*   **Impacted Files**:
    *   `[NEW]` `index.html`
*   **Specifications**:
    *   Develop a glassmorphic dashboard hub linking to: NGO Portal, Volunteer Dashboard, and Slides presentation.

### Task 5.2: Vercel Route Configuration (`vercel.json`)
*   **Description**: Establish server rewrites supporting clean URLs.
*   **Impacted Files**:
    *   `[NEW]` `vercel.json`
*   **Specifications**:
    *   Enable `cleanUrls: true` at the root.

### Task 5.3: Git Repository Setup & Deploy
*   **Description**: Initialize local git tracking, compile staged files, and push to GitHub linked to automated Vercel deploys.
*   **Impacted Files**:
    *   Create `.gitignore`.
