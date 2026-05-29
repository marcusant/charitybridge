# 🤝 Charity Bridge

Charity Bridge is an elegant, highly accessible, and AI-powered dual-portal platform designed to coordinate, optimize, and streamline volunteer matching for nonprofit social groups.

It connects nonprofit organizations (NGOs) facing technical or operational challenges with skilled professional technical and business volunteers who can claim these tasks and donate their expertise.

---

## 📺 Live Portals & Features

The platform consists of four unified visual portals, fully styled using a central design system:

1. **🏠 Landing Splash Hub (`index.html`)**: The entry welcome hub directing users to either portal or the platform slide deck.
2. **🏢 Charity Support Portal (`NGO Portal.html`)**: Allows nonprofits to describe technical/operational issues. Leverages a local semantic AI keyword triage engine to predict categories and suggests a first-response action plan immediately, creating a support ticket if needed.
3. **🙋‍♂️ Volunteer Support Portal (`volunteer.html`)**: A statistics-driven volunteer dashboard featuring active claim counters, profile matching accuracy metrics, category filters, and detailed ticket analysis cards to claim tasks instantly.
4. **📺 Project Presentation (`presentation.html`)**: An interactive slide deck containing platform details, WCAG 2.1 Level AA accessibility standards, design tokens, and a live visual data lifecycle flowchart simulator.

---

## ⚡ Technical Highlights & Engineering Standards

- **Single Source of Truth (`style.css`)**: 100% of all UI layouts, card shapes, buttons, alert boxes, and transitions are loaded strictly from a single central stylesheet using custom HSL colors and flexible flexbox/grid metrics.
- **Local AI Triage (`app.js`)**: Real-time semantic keyword regex parsing predicts categories (Cybersecurity, IT Infrastructure, Finance, Software, Comms) instantly when the "Let AI decide" option is selected.
- **localStorage Database Sync**: Highly performant database simulation. Newly submitted tickets instantly prepend to the volunteer dashboard queue, and task claiming updates volunteer stats globally in real-time.
- **WCAG 2.1 AA A11y Standards**: Visually accessible hidden radio controls (`.sr-only`), strict keyboard focus outlines (`:focus-visible`), and descriptive `aria-label` tags wrapped on all visual elements.
- **Vercel & GitHub Deployment Ready**: Fully optimized with paths, configurations, and a custom `vercel.json` file to support clean URL routing (`cleanUrls: true`) in production.

---

## 🚀 Local Quickstart & Development

### 1. Host with Dev Server
To run a local static server, execute:
```bash
npx http-server -p 8080
```
Then open [http://localhost:8080](http://localhost:8080) in your browser.

### 2. File Verification
- Splash Entry Hub: `index.html`
- NGO Portal: `NGO Portal.html`
- Volunteer Portal: `volunteer.html`
- Platform Presentation: `presentation.html`

---

## 📦 Production Deployment

### GitHub & Vercel Publishing
1. Push the code repository to your GitHub.
2. Import the project in Vercel.
3. The platform will automatically deploy and clean URL routing will be active out-of-the-box using the configured `vercel.json` rules!
