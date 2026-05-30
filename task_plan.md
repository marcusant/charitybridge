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

---

## 📝 Phase 6: Long-term Maintenance & Documentation Rules

### Task 6.1: Documentation & Translation Standards Enacted
*   **Description**: Define rules ensuring that any stack, codebase, or feature update triggers simultaneous updates to tracking documentation and all new code/comments remain strictly in English.
*   **Impacted Files**:
    *   `[MODIFY]` `rules.md` (Update rules guidelines)
    *   `[MODIFY]` `progress.md` (Log tracking updates)
    *   `[MODIFY]` `task_plan.md` (Integrate phase details)
*   **Specifications**:
    *   All visual elements, labels, code statements, comments, logs, and files must be in English.
    *   Keep documentation and action plans synchronous with the code to ensure zero tracking lag.

### Task 6.2: Staggered Micro-Animations for Ticket Details
*   **Description**: Improve visual interactivity when selecting open tickets in the volunteer portal by animating detail subsections sequentially rather than all at once.
*   **Impacted Files**:
    *   `[MODIFY]` `style.css` (Add staggered slideFadeIn animation definitions)
    *   `[MODIFY]` `app.js` (Inject stagger classes into selected ticket markup)
*   **Specifications**:
    *   Add `.stagger-item` and `.delay-1` to `.delay-6` classes using slideFadeIn animations.
    *   Apply classes to the categories, diagnosis, response list, matched skills, contact info box, and action button to animate them sequentially.

---

## 🗄️ Phase 7: SQLite Integration Enhancement

### Task 7.1: Multi-Table Schema with Migration System
*   **Description**: Replace single `tickets` table with a normalized relational schema including foreign key constraints, indices, and a versioned migration engine.
*   **Impacted Files**:
    *   `[MODIFY]` `app.js` (Schema definition, migration engine, seeding)
*   **Specifications**:
    *   Create `ngos` table: `id`, `name`, `country`, `email`, `created_at`.
    *   Create `volunteers` table: `id`, `name`, `role`, `color`, `match_score`, `skills`.
    *   Create `tickets` table with `ngo_id FK` and `claimed_by FK` references.
    *   Create `categories` table: `id`, `name`, `description`, `urgency`, `risk`, `keywords`.
    *   Add `PRAGMA user_version`-based migration engine (v1→v2 auto-migration of existing data).
    *   Add indices on `tickets(status)`, `tickets(urgency)`, `tickets(ngo_id)`, `tickets(issueType)`.

### Task 7.2: IndexedDB Persistence Layer
*   **Description**: Replace localStorage (5MB cap, synchronous, blocking) with IndexedDB for binary blob persistence.
*   **Impacted Files**:
    *   `[MODIFY]` `app.js` (idbStorage adapter, persistDb refactor, DB_INIT refactor)
*   **Specifications**:
    *   Implement IndexedDB storage adapter with `save()`, `load()`, `remove()` methods.
    *   Add 500ms debounce to `persistDb()` to prevent write amplification.
    *   IndexedDB-first loading in `DB_INIT` with localStorage fallback.
    *   Automatic localStorage-to-IndexedDB migration on first load (clear localStorage after success).

### Task 7.3: Data Model Expansion
*   **Description**: Extract hardcoded scenario data into relational tables and refactor ticket CRUD operations.
*   **Impacted Files**:
    *   `[MODIFY]` `app.js` (seedInitialData, addTicket, getStoredTickets, updateTicketClaim)
*   **Specifications**:
    *   Seed `categories` table from `scenarios` object with keyword lists.
    *   Seed `volunteers` table from scenario volunteer arrays.
    *   Refactor `addTicket()` to resolve/create NGO and use `ngo_id` FK.
    *   Update `getStoredTickets()` to use `LEFT JOIN ngos` and return backward-compatible shape.
    *   Update `updateTicketClaim()` to accept optional `volunteerId` and set `claimed_by` FK.

### Task 7.4: Error Handling & Reliability
*   **Description**: Add defensive error handling and health verification to all database operations.
*   **Impacted Files**:
    *   `[MODIFY]` `app.js` (all DB functions)
*   **Specifications**:
    *   Wrap `getStoredTickets`, `saveTicketsToStorage`, `addTicket`, `updateTicketClaim` in try/catch blocks.
    *   Log errors to console with `[DB]` prefix and return fallback values (empty arrays, void).
    *   Add `checkDbHealth()` function that runs `SELECT 1` after initialization.

---

## 🙋 Phase 8: Volunteer Registration Page

### Task 8.1: Database Schema Extension (v3 Migration)
*   **Description**: Extend the `volunteers` table with profile columns and add `claimed_by_email` to tickets.
*   **Impacted Files**:
    *   `[MODIFY]` `app.js` (migrateV2toV3, createFreshSchema)
*   **Specifications**:
    *   Add columns to volunteers: `email`, `country`, `bio`, `availability`, `experience_level`, `custom_skills`, `is_registered`.
    *   Add `claimed_by_email TEXT` to tickets table.
    *   Add unique index on `volunteers(email)` where email is not null.

### Task 8.2: Profile CRUD Functions
*   **Description**: Implement data access functions for volunteer profiles.
*   **Impacted Files**:
    *   `[MODIFY]` `app.js`
*   **Specifications**:
    *   `saveVolunteerProfile(profile)` — insert or update by email.
    *   `getVolunteerProfile(email)` — fetch profile with all fields.
    *   `getRegisteredVolunteers()` — list all registered volunteers.
    *   `getClaimedTicketsByEmail(email)` — fetch tickets claimed by a volunteer.

### Task 8.3: Session Management & Claim Integration
*   **Description**: Manage active volunteer session and link claims to volunteer identity.
*   **Impacted Files**:
    *   `[MODIFY]` `app.js`
*   **Specifications**:
    *   `setActiveVolunteer(email)`, `getActiveVolunteer()`, `clearActiveVolunteer()` using localStorage.
    *   Update `claimTicketFromModal()` to check for active session, store `claimed_by_email`, and show volunteer name in toast.

### Task 8.4: Registration Page HTML
*   **Description**: Create the volunteer registration and profile view page.
*   **Impacted Files**:
    *   `[NEW]` `register.html`
*   **Specifications**:
    *   Registration form: name, email, country select, experience level radio, availability radio, skills multi-select checkboxes, custom skills input, bio textarea.
    *   Profile view: avatar, name, email, country, experience, availability, bio, skills pills, claimed tickets list.
    *   Edit and Sign Out actions.
    *   Fill Example demo button.

### Task 8.5: CSS Styling
*   **Description**: Add styles for registration form and profile view.
*   **Impacted Files**:
    *   `[MODIFY]` `style.css`
*   **Specifications**:
    *   `.skill-pill-selectable` with checked state via `input:checked +` selector.
    *   `.profile-avatar-large`, `.profile-header`, `.profile-detail-grid`, `.profile-claims-list`.
    *   Dark mode support for all new elements.

### Task 8.6: Platform Navigation Integration
*   **Description**: Add links to the registration page from all portal headers and landing page.
*   **Impacted Files**:
    *   `[MODIFY]` `index.html`, `NGO Portal.html`, `volunteer.html`, `presentation.html`
*   **Specifications**:
    *   Add "Register as Volunteer" nav button to NGO Portal, Volunteer Portal, and Presentation headers.
    *   Add "My Profile" nav button to Volunteer Portal header.
    *   Add 4th splash card to landing page.
    *   Update `.splash-grid` to `auto-fit` layout for 4-card support.

