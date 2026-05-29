/**
 * Charity Bridge - Core Application Logic & State Management
 * 
 * Implements Local Storage synchronization, keyword-based AI auto-classification,
 * and handles UI logic for both NGO and Volunteer portals.
 */

// ==========================================================================
// 1. Diagnosis Database (Scenarios) & Initial Data
// ==========================================================================

const scenarios = {
  cybersecurity: {
    category: "Cybersecurity",
    urgency: "High",
    risk: "High",
    action: "Ticket Created",
    plan: [
      "Immediately change all admin and email account passwords.",
      "Enable Multi-Factor Authentication (MFA) on all accounts.",
      "Review recent login activity and revoke suspicious sessions.",
      "Notify your team and warn against phishing attempts.",
      "Contact your email provider's security team.",
      "Document the incident for compliance and reporting."
    ],
    skills: ["Cybersecurity", "Incident Response", "Microsoft 365 Admin", "Identity & Access Management"],
    ticketAlert: "This issue has been flagged as HIGH urgency. A ticket has been created and volunteers with cybersecurity expertise have been notified.",
    volunteers: [
      { name: "Sarah K.", role: "Cybersecurity Analyst", color: "#e53e3e", match: "98% match" },
      { name: "James T.", role: "Microsoft 365 Administrator", color: "#2b6cb0", match: "94% match" },
      { name: "Priya M.", role: "Incident Response Specialist", color: "#805ad5", match: "89% match" }
    ]
  },
  "it-infrastructure": {
    category: "IT Infrastructure",
    urgency: "Medium",
    risk: "Medium",
    action: "Ticket Created",
    plan: [
      "Identify which systems or services are affected.",
      "Check server logs for error messages or failures.",
      "Verify network connectivity and DNS settings.",
      "Restart affected services in a controlled manner.",
      "Notify stakeholders of potential downtime."
    ],
    skills: ["Network Administration", "Server Management", "Cloud Infrastructure", "Linux/Windows Admin"],
    ticketAlert: "This issue has been flagged as MEDIUM urgency. A ticket has been created and IT volunteers have been notified.",
    volunteers: [
      { name: "Carlos R.", role: "Network Engineer", color: "#2b6cb0", match: "95% match" },
      { name: "Aisha B.", role: "Cloud Infrastructure", color: "#38a169", match: "91% match" },
      { name: "Tom W.", role: "Systems Administrator", color: "#d69e2e", match: "85% match" }
    ]
  },
  finance: {
    category: "Finance & Accounting",
    urgency: "Medium",
    risk: "Medium",
    action: "Ticket Created",
    plan: [
      "Gather all relevant financial documents and records.",
      "Identify the specific discrepancy or compliance gap.",
      "Consult your internal finance policy documentation.",
      "Prepare a summary for the volunteer consultant.",
      "Check for relevant regulatory deadlines."
    ],
    skills: ["Nonprofit Accounting", "Grant Management", "Financial Compliance", "QuickBooks/Xero"],
    ticketAlert: "This issue has been flagged as MEDIUM urgency. A finance volunteer has been matched to your ticket.",
    volunteers: [
      { name: "Linda H.", role: "Nonprofit Accountant", color: "#38a169", match: "97% match" },
      { name: "David S.", role: "Grant Finance Specialist", color: "#2b6cb0", match: "90% match" }
    ]
  },
  software: {
    category: "Software / Applications",
    urgency: "Low",
    risk: "Low",
    action: "Self-Help Recommended",
    plan: [
      "Check the software vendor's status page for outages.",
      "Clear cache and cookies, then retry.",
      "Ensure the software is updated to the latest version.",
      "Review the self-help guide below before escalating."
    ],
    skills: ["Software Support", "CRM Administration", "Web Applications"],
    resource: {
      icon: "📖",
      title: "Software Troubleshooting Guide for Nonprofits",
      desc: "Step-by-step guide covering common software issues, updates, and vendor support contacts."
    }
  },
  communications: {
    category: "Communications & Marketing",
    urgency: "Low",
    risk: "Low",
    action: "Self-Help Recommended",
    plan: [
      "Define your target audience and key message.",
      "Review existing communication templates.",
      "Check the recommended guide for nonprofit comms best practices."
    ],
    skills: ["Communications", "Social Media", "Content Writing"],
    resource: {
      icon: "🎥",
      title: "Nonprofit Communications Starter Kit (Video)",
      desc: "25-min video walkthrough on building an effective nonprofit communications strategy."
    }
  },
  default: {
    category: "General Support",
    urgency: "Medium",
    risk: "Low",
    action: "Ticket Created",
    plan: [
      "Document the issue with as much detail as possible.",
      "Identify who in your team is affected.",
      "Check if any recent changes may have caused the issue.",
      "A volunteer will review your ticket and reach out within 48 hours."
    ],
    skills: ["General IT Support", "Project Management", "Nonprofit Operations"],
    ticketAlert: "Your request has been reviewed and a support ticket has been created. A volunteer will be matched shortly.",
    volunteers: [
      { name: "Emma P.", role: "Nonprofit Tech Generalist", color: "#805ad5", match: "88% match" },
      { name: "Noah J.", role: "Operations Consultant", color: "#2b6cb0", match: "82% match" }
    ]
  }
};

const initialMockTickets = [
  {
    id: "TKT-2026-87429",
    ngo: "Green Future Foundation",
    country: "United States",
    category: "Cybersecurity",
    issueType: "cybersecurity",
    urgency: "High",
    risk: "High",
    desc: "Our primary admin email account may have been hacked. We are receiving warning alerts about suspicious logins from unknown physical locations and some spam emails were sent without our authorization.",
    plan: scenarios.cybersecurity.plan,
    skills: scenarios.cybersecurity.skills,
    email: "contact@greenfuture.org",
    status: "Open",
    claimedBy: null
  },
  {
    id: "TKT-2026-42981",
    ngo: "Save The Oceans International",
    country: "Canada",
    category: "IT Infrastructure",
    issueType: "it-infrastructure",
    urgency: "Medium",
    risk: "Medium",
    desc: "Our regional office cloud database server keeps disconnecting. Staff members are unable to save donor records and retrieve reports during working hours.",
    plan: scenarios["it-infrastructure"].plan,
    skills: scenarios["it-infrastructure"].skills,
    email: "support@saveoceans.org",
    status: "Open",
    claimedBy: null
  },
  {
    id: "TKT-2026-11930",
    ngo: "Children Literacy Network",
    country: "United Kingdom",
    category: "Finance & Accounting",
    issueType: "finance",
    urgency: "Medium",
    risk: "Medium",
    desc: "We are migrating our donor accounting books from physical sheets into a digital bookkeeping software (Quickbooks/Xero) and require audit alignment compliance guidance.",
    plan: scenarios.finance.plan,
    skills: scenarios.finance.skills,
    email: "finance@childrenliteracy.net",
    status: "Open",
    claimedBy: null
  },
  {
    id: "TKT-2026-30219",
    ngo: "Urban Canopy Project",
    country: "Australia",
    category: "Software & CRM",
    issueType: "software",
    urgency: "Low",
    risk: "Low",
    desc: "We need assistance in organizing and bulk-importing contacts into our newsletter CRM platform. We have a CSV file but it has duplicate names.",
    plan: scenarios.software.plan,
    skills: scenarios.software.skills,
    email: "hello@urbancanopy.org",
    status: "Open",
    claimedBy: null
  }
];

// ==========================================================================
// 2. Shared Helper Functions & Local Storage Synchronization
// ==========================================================================

function getStoredTickets() {
  const stored = localStorage.getItem("charity_bridge_tickets");
  if (!stored) {
    localStorage.setItem("charity_bridge_tickets", JSON.stringify(initialMockTickets));
    return initialMockTickets;
  }
  return JSON.parse(stored);
}

function saveTicketsToStorage(ticketsList) {
  localStorage.setItem("charity_bridge_tickets", JSON.stringify(ticketsList));
}

function generateTicketId() {
  const prefix = "TKT";
  const year = new Date().getFullYear();
  const rand = Math.floor(10000 + Math.random() * 90000);
  return `${prefix}-${year}-${rand}`;
}

function getInitials(name) {
  return name.split(" ").map(n => n[0]).join("").toUpperCase();
}

// ==========================================================================
// 3. NGO Support Portal - Specific Logic
// ==========================================================================

// Fills in test data for demonstration and clears errors
function fillDemoData() {
  const charityNameEl = document.getElementById("charity-name");
  const problemEl = document.getElementById("problem");
  const issueTypeEl = document.getElementById("issue-type");
  const emailEl = document.getElementById("email");
  const urgencyEl = document.getElementById("u-high");

  if (charityNameEl) charityNameEl.value = "Green Future Foundation";
  if (problemEl) problemEl.value = "Our email account may have been hacked. We received alerts about suspicious login attempts from unknown locations and some spam emails were sent without our knowledge.";
  if (issueTypeEl) issueTypeEl.value = ""; // Let AI Decide
  if (emailEl) emailEl.value = "contact@greenfuture.org";
  if (urgencyEl) urgencyEl.checked = true;

  // Clear validation states
  const fields = ["charity-name", "problem"];
  fields.forEach(fieldId => {
    const el = document.getElementById(fieldId);
    if (el) {
      el.classList.remove("is-invalid");
      const errEl = document.getElementById(`error-${fieldId}`);
      if (errEl) {
        errEl.textContent = "";
        errEl.style.display = "none";
      }
    }
  });

  const urgencyErrEl = document.getElementById("error-urgency");
  if (urgencyErrEl) {
    urgencyErrEl.textContent = "";
    urgencyErrEl.style.display = "none";
  }
}

// Dynamic Keyword-Based Classifier (Local AI Simulation)
function classifyIssueTypeByContent(text) {
  const t = text.toLowerCase();
  
  if (/(hack|phish|security|leak|password|credential|compromise|cyber|safe|auth|spam|suspect)/i.test(t)) {
    return "cybersecurity";
  }
  if (/(server|network|internet|connection|router|wifi|dns|offline|slow|hardware|cloud|hosting)/i.test(t)) {
    return "it-infrastructure";
  }
  if (/(account|money|finance|invoice|tax|budget|quickbooks|xero|audit|ledger|bookkeeping|donation)/i.test(t)) {
    return "finance";
  }
  if (/(software|crm|newsletter|mailchimp|excel|spreadsheet|database|import|duplicate|data)/i.test(t)) {
    return "software";
  }
  if (/(marketing|social|content|design|video|logo|post|website|comms|write|flyer)/i.test(t)) {
    return "communications";
  }
  
  return "default";
}

// Analyzes the NGO request and generates a diagnosis
function analyzeRequest() {
  const charityNameEl = document.getElementById("charity-name");
  const problemEl = document.getElementById("problem");
  const countryEl = document.getElementById("country");
  const emailEl = document.getElementById("email");
  const urgencyRadio = document.querySelector('input[name="urgency"]:checked');

  // Reset errors
  const fields = ["charity-name", "problem"];
  fields.forEach(fieldId => {
    const el = document.getElementById(fieldId);
    if (el) el.classList.remove("is-invalid");
    const errEl = document.getElementById(`error-${fieldId}`);
    if (errEl) {
      errEl.textContent = "";
      errEl.style.display = "none";
    }
  });

  const urgencyErrEl = document.getElementById("error-urgency");
  if (urgencyErrEl) {
    urgencyErrEl.textContent = "";
    urgencyErrEl.style.display = "none";
  }

  let isValid = true;
  let firstInvalidEl = null;

  if (!charityNameEl.value.trim()) {
    charityNameEl.classList.add("is-invalid");
    const err = document.getElementById("error-charity-name");
    err.textContent = "Charity name is required.";
    err.style.display = "block";
    isValid = false;
    firstInvalidEl = charityNameEl;
  }

  if (!problemEl.value.trim()) {
    problemEl.classList.add("is-invalid");
    const err = document.getElementById("error-problem");
    err.textContent = "Please describe the problem your organization is facing.";
    err.style.display = "block";
    isValid = false;
    if (!firstInvalidEl) firstInvalidEl = problemEl;
  }

  if (!urgencyRadio) {
    const err = document.getElementById("error-urgency");
    err.textContent = "Please select an urgency level.";
    err.style.display = "block";
    isValid = false;
  }

  if (!isValid) {
    if (firstInvalidEl) firstInvalidEl.focus();
    return;
  }

  const btn = document.getElementById("analyze-btn");
  const spinner = document.getElementById("btn-spinner");
  const btnText = document.getElementById("btn-text");

  btn.disabled = true;
  spinner.style.display = "block";
  btnText.innerHTML = "Analyzing…";

  document.getElementById("ai-results").style.display = "none";
  document.getElementById("results-divider").style.display = "none";
  document.getElementById("selfhelp-section").style.display = "none";
  document.getElementById("ticket-section").style.display = "none";

  setTimeout(() => {
    const rawIssueType = document.getElementById("issue-type").value;
    const problemText = problemEl.value.trim();
    
    // Intelligent semantic classification if configured to "Let AI Decide"
    const issueType = rawIssueType || classifyIssueTypeByContent(problemText);
    const urgency = urgencyRadio.value;
    const data = scenarios[issueType] || scenarios["default"];

    const urgencyMap = { low: "Low", medium: "Medium", high: "High", critical: "Critical" };
    const displayUrgency = urgencyMap[urgency];

    const needsTicket = (urgency === "medium" || urgency === "high" || urgency === "critical");

    const tagsRow = document.getElementById("tags-row");
    tagsRow.innerHTML = `
      <div class="tag tag-category"><span role="img" aria-label="label">🏷️</span> ${data.category}</div>
      <div class="tag tag-urgency"><span role="img" aria-label="voltage spark">⚡</span> Urgency: ${displayUrgency}</div>
      <div class="tag tag-risk"><span role="img" aria-label="shield">🛡️</span> Risk: ${data.risk}</div>
      <div class="tag tag-action">${needsTicket ? '<span role="img" aria-label="ticket">🎫</span> Ticket Required' : '<span role="img" aria-label="books">📚</span> Self-Help Sufficient'}</div>
    `;

    const planList = document.getElementById("response-plan-list");
    planList.innerHTML = data.plan.map(step => `<li>${step}</li>`).join("");

    const skillsList = document.getElementById("skills-list");
    skillsList.innerHTML = data.skills.map(s =>
      `<span class="skill-pill"><span role="img" aria-label="wrench">🔧</span> ${s}</span>`
    ).join("");

    if (needsTicket) {
      const ticketData = scenarios[issueType]?.volunteers ? scenarios[issueType] : scenarios["default"];
      const newTicketId = generateTicketId();

      document.getElementById("ticket-alert-text").textContent =
        ticketData.ticketAlert || `This issue has been flagged as ${displayUrgency} urgency. A ticket has been created.`;

      document.getElementById("ticket-id-value").textContent = newTicketId;

      const volList = document.getElementById("volunteer-list");
      const vols = ticketData.volunteers || scenarios["default"].volunteers;
      volList.innerHTML = vols.map((v, index) => `
        <div class="volunteer-card" style="animation-delay: ${index * 0.12}s">
          <div class="volunteer-avatar" style="background:${v.color}">
            ${getInitials(v.name)}
          </div>
          <div class="volunteer-info">
            <h5>${v.name}</h5>
            <p>${v.role}</p>
          </div>
          <span class="volunteer-match">${v.match}</span>
        </div>
      `).join("");

      document.getElementById("ticket-section").style.display = "block";

      // LOCAL PERSISTENCE (Task 4.3): Save the ticket in localStorage to synchronize with volunteers
      const countryText = countryEl.options[countryEl.selectedIndex].text;
      const newTicket = {
        id: newTicketId,
        ngo: charityNameEl.value.trim(),
        country: countryText,
        category: data.category,
        issueType: issueType,
        urgency: displayUrgency,
        risk: data.risk,
        desc: problemText,
        plan: data.plan,
        skills: data.skills,
        email: emailEl.value.trim() || "contact@yourcharity.org",
        status: "Open",
        claimedBy: null
      };

      const storedTickets = getStoredTickets();
      storedTickets.unshift(newTicket); // Insere no início do feed
      saveTicketsToStorage(storedTickets);

    } else {
      const res = data.resource || {
        icon: "📖",
        title: "General Nonprofit Support Guide",
        desc: "Covers common operational challenges faced by nonprofits."
      };

      const resourceIconMap = { "📖": "book", "🎥": "video camera" };
      const resourceLabel = resourceIconMap[res.icon] || "resource icon";
      document.getElementById("resource-icon").innerHTML = `<span role="img" aria-label="${resourceLabel}">${res.icon}</span>`;
      document.getElementById("resource-title").textContent = res.title;
      document.getElementById("resource-desc").textContent = res.desc;

      document.getElementById("selfhelp-section").style.display = "block";
    }

    document.getElementById("results-divider").style.display = "block";
    document.getElementById("ai-results").style.display = "block";
    document.getElementById("ai-results").scrollIntoView({ behavior: "smooth", block: "start" });

    btn.disabled = false;
    spinner.style.display = "none";
    btnText.innerHTML = `<span role="img" aria-label="magnifying glass">🔍</span> Analyze Request`;

  }, 1800);
}

// Real-time error clearing in NGO Portal
document.addEventListener("DOMContentLoaded", () => {
  const charityNameEl = document.getElementById("charity-name");
  const problemEl = document.getElementById("problem");

  if (charityNameEl) {
    charityNameEl.addEventListener("input", function() {
      this.classList.remove("is-invalid");
      const err = document.getElementById("error-charity-name");
      if (err) {
        err.textContent = "";
        err.style.display = "none";
      }
    });
  }

  if (problemEl) {
    problemEl.addEventListener("input", function() {
      this.classList.remove("is-invalid");
      const err = document.getElementById("error-problem");
      if (err) {
        err.textContent = "";
        err.style.display = "none";
      }
    });
  }

  document.querySelectorAll('input[name="urgency"]').forEach(el => {
    el.addEventListener("change", function() {
      const err = document.getElementById("error-urgency");
      if (err) {
        err.textContent = "";
        err.style.display = "none";
      }
    });
  });
});

// ==========================================================================
// 4. Volunteer Portal - Specific Logic
// ==========================================================================

let currentCategory = "all";
let activeTicketId   = null;  // currently open ticket in modal

// ── Urgency colour map ────────────────────────────────────────────────────────
const URGENCY_COLORS = {
  high:     { bg: 'var(--color-danger-bg)',   color: 'var(--color-danger-text)',   border: 'var(--color-danger-border)' },
  medium:   { bg: 'var(--color-warning-bg)',  color: 'var(--color-warning-text)',  border: 'var(--color-warning-border)' },
  low:      { bg: 'var(--color-success-bg)',  color: 'var(--color-success-text)',  border: 'var(--color-success-border)' },
  critical: { bg: 'var(--color-critical-bg)', color: 'var(--color-critical-text)', border: 'var(--color-critical-border)' },
};

// ── Renders the ticket feed cards ─────────────────────────────────────────────
function renderTicketFeed() {
  const feedContainer = document.getElementById("ticket-feed-container");
  if (!feedContainer) return;

  const searchText = (document.getElementById("ticket-search")?.value ?? "").toLowerCase().trim();
  const currentTickets = getStoredTickets();

  const filtered = currentTickets.filter(t => {
    const matchesCategory = (currentCategory === "all" || t.issueType === currentCategory);
    const matchesSearch   = (
      t.ngo.toLowerCase().includes(searchText)      ||
      t.desc.toLowerCase().includes(searchText)     ||
      t.category.toLowerCase().includes(searchText) ||
      t.skills.some(s => s.toLowerCase().includes(searchText))
    );
    return matchesCategory && matchesSearch;
  });

  // Update count badge
  const badge = document.getElementById("ticket-count-badge");
  if (badge) badge.textContent = filtered.length > 0 ? filtered.length : "";

  if (filtered.length === 0) {
    feedContainer.innerHTML = `
      <div style="grid-column:1/-1; text-align:center; padding:48px 24px; color:var(--color-text-muted); background:white; border:1px dashed var(--border-color); border-radius:var(--radius-md);">
        <div style="font-size:40px; margin-bottom:12px;">🔍</div>
        <p style="font-size:14px;">No tickets found matching your filter. Try a different search or category.</p>
      </div>
    `;
    return;
  }

  feedContainer.innerHTML = filtered.map((t, index) => {
    const uc = URGENCY_COLORS[t.urgency.toLowerCase()] || URGENCY_COLORS.medium;
    const statusBadge = t.status === "Claimed"
      ? `<span class="ticket-status" style="background:var(--color-primary-light); color:var(--color-primary-dark); border-color:var(--color-primary-border);">✓ Claimed</span>`
      : `<span class="ticket-status"><span class="status-dot"></span> Open</span>`;

    return `
      <div
        class="ticket-feed-card"
        data-ticket-id="${t.id}"
        style="animation-delay: ${index * 0.08}s; cursor:pointer;"
        onclick="selectTicket('${t.id}')"
        role="button"
        tabindex="0"
        onkeydown="if(event.key==='Enter'||event.key===' ')selectTicket('${t.id}')"
        aria-label="Open details for ${t.ngo} ticket"
      >
        <div class="ticket-feed-header">
          <div>
            <div class="ticket-feed-ngo">${t.ngo}</div>
            <div class="ticket-feed-meta">📍 ${t.country} &nbsp;•&nbsp; ${t.id}</div>
          </div>
          ${statusBadge}
        </div>
        <p class="ticket-feed-desc">${t.desc}</p>
        <div class="ticket-feed-tags">
          <span class="tag tag-category" style="padding:4px 10px; font-size:11px;"><span role="img" aria-label="tag">🏷️</span> ${t.category}</span>
          <span style="display:inline-flex; align-items:center; gap:5px; padding:4px 10px; border-radius:var(--radius-sm); font-size:11px; font-weight:700; background:${uc.bg}; color:${uc.color}; border:1px solid ${uc.border};">⚡ ${t.urgency}</span>
        </div>
        <div style="margin-top:4px; font-size:12px; color:var(--color-primary); font-weight:600; display:flex; align-items:center; gap:4px;">
          <span>View full details & claim</span> <span>→</span>
        </div>
      </div>
    `;
  }).join("");
}

function setCategoryFilter(category) {
  currentCategory = category;
  document.querySelectorAll("#filter-pills .filter-btn").forEach((btn, i) => {
    const map = { all:0, cybersecurity:1, "it-infrastructure":2, finance:3, software:4, communications:5 };
    btn.classList.toggle("active", i === (map[category] ?? 0));
  });
  renderTicketFeed();
}

function filterTickets() { renderTicketFeed(); }

// ── Open ticket modal ─────────────────────────────────────────────────────────
function selectTicket(id) {
  const currentTickets = getStoredTickets();
  const ticket = currentTickets.find(t => t.id === id);
  if (!ticket) return;

  activeTicketId = id;

  const uc = URGENCY_COLORS[ticket.urgency.toLowerCase()] || URGENCY_COLORS.medium;
  const isClaimed = ticket.status === "Claimed";

  // ── Populate modal fields ──────────────────────────────────────────────────
  document.getElementById("modal-tags").innerHTML = `
    <span class="tag tag-category" style="display:inline-flex; font-size:12px; padding:4px 12px;">
      <span role="img" aria-label="tag">🏷️</span> ${ticket.category}
    </span>
    <span style="display:inline-flex; align-items:center; gap:5px; padding:4px 12px; border-radius:var(--radius-full); font-size:12px; font-weight:700; background:${uc.bg}; color:${uc.color}; border:1px solid ${uc.border};">
      ⚡ ${ticket.urgency} Urgency
    </span>
  `;

  document.getElementById("modal-ngo-name").textContent = ticket.ngo;
  document.getElementById("modal-meta").innerHTML =
    `📍 ${ticket.country} &nbsp;•&nbsp; ID: <strong>${ticket.id}</strong>`;

  document.getElementById("modal-desc").textContent = ticket.desc;

  document.getElementById("modal-plan").innerHTML =
    ticket.plan.map(p => `<li>${p}</li>`).join("");

  document.getElementById("modal-skills").innerHTML =
    ticket.skills.map(s => `<span class="skill-pill"><span role="img" aria-label="wrench">🔧</span> ${s}</span>`).join("");

  const emailLink = document.getElementById("modal-email-link");
  emailLink.href = `mailto:${ticket.email}`;
  emailLink.textContent = ticket.email;

  const statusEl = document.getElementById("modal-status-text");
  statusEl.textContent = `● ${ticket.status}`;
  statusEl.style.color = isClaimed ? "var(--color-primary-dark)" : "var(--color-success-text)";

  const claimBtn = document.getElementById("modal-claim-btn");
  if (isClaimed) {
    claimBtn.disabled = true;
    claimBtn.innerHTML = `<span role="img" aria-label="check">✓</span> Ticket Already Claimed`;
    claimBtn.style.background = "var(--border-color)";
    claimBtn.style.color = "var(--color-text-muted)";
    claimBtn.style.cursor = "not-allowed";
    claimBtn.style.boxShadow = "none";
  } else {
    claimBtn.disabled = false;
    claimBtn.innerHTML = `🤝 Claim Ticket &amp; Contact Charity`;
    claimBtn.style.background = "";
    claimBtn.style.color = "";
    claimBtn.style.cursor = "";
    claimBtn.style.boxShadow = "";
  }

  // ── Reset stagger animations by re-triggering them ─────────────────────────
  document.querySelectorAll("#ticket-modal-dialog .stagger-item").forEach(el => {
    el.style.animation = "none";
    void el.offsetWidth; // force reflow
    el.style.animation = "";
  });

  // ── Open the modal ─────────────────────────────────────────────────────────
  const overlay = document.getElementById("ticket-modal-overlay");
  overlay.classList.remove("is-closing");
  overlay.classList.add("is-open");
  document.body.style.overflow = "hidden"; // prevent page scroll while modal is open
  document.getElementById("modal-close-btn").focus();
}

// ── Close ticket modal (with exit animation) ───────────────────────────────────
function closeTicketModal() {
  const overlay = document.getElementById("ticket-modal-overlay");
  if (!overlay || !overlay.classList.contains("is-open")) return;

  overlay.classList.add("is-closing");
  overlay.addEventListener("animationend", () => {
    overlay.classList.remove("is-open", "is-closing");
    document.body.style.overflow = "";
    activeTicketId = null;
  }, { once: true });
}

// Close on backdrop click (not on dialog itself)
function handleModalOverlayClick(event) {
  if (event.target === document.getElementById("ticket-modal-overlay")) {
    closeTicketModal();
  }
}

// Close on ESC key
document.addEventListener("keydown", e => {
  if (e.key === "Escape") closeTicketModal();
});

// ── Claim ticket from modal ────────────────────────────────────────────────────
function claimTicketFromModal() {
  if (!activeTicketId) return;
  const id = activeTicketId;

  const currentTickets = getStoredTickets();
  const idx = currentTickets.findIndex(t => t.id === id);
  if (idx === -1) return;

  currentTickets[idx].status = "Claimed";
  saveTicketsToStorage(currentTickets);

  // Refresh modal to show claimed state
  selectTicket(id);

  // Refresh feed card badge
  renderTicketFeed();

  // Update stat counter
  const claimedCount = currentTickets.filter(t => t.status === "Claimed").length;
  const statEl = document.getElementById("active-claims-count");
  if (statEl) statEl.textContent = `${claimedCount} Ticket${claimedCount !== 1 ? "s" : ""}`;

  // Toast notification
  const toast = document.createElement("div");
  toast.setAttribute("role", "status");
  toast.setAttribute("aria-live", "polite");
  toast.innerHTML = `✅ Ticket claimed! You can now contact the charity directly.`;
  Object.assign(toast.style, {
    position: "fixed", bottom: "24px", right: "24px",
    background: "var(--bg-header-start)", color: "white",
    padding: "16px 24px", borderRadius: "var(--radius-md)",
    boxShadow: "var(--shadow-lg)", fontFamily: "var(--font-family-body)",
    fontSize: "14px", fontWeight: "600", zIndex: "1100",
    animation: "slideDown 0.35s cubic-bezier(0.16, 1, 0.3, 1) both",
    maxWidth: "340px",
  });
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 4000);
}

// Legacy alias so old claimTicket(id) calls still work if present
function claimTicket(id) {
  activeTicketId = id;
  claimTicketFromModal();
}

// ── Initialize volunteer portal on page load ───────────────────────────────────
document.addEventListener("DOMContentLoaded", () => {
  if (!document.getElementById("ticket-feed-container")) return;

  renderTicketFeed();

  // Sync claimed count stat
  const claimedCount = getStoredTickets().filter(t => t.status === "Claimed").length;
  const statEl = document.getElementById("active-claims-count");
  if (statEl) statEl.textContent = `${claimedCount} Ticket${claimedCount !== 1 ? "s" : ""}`;
});

// ==========================================================================
// 5. Presentation Slides & Interactive Simulation Logic
// ==========================================================================

let currentSlide = 1;
const totalSlides = 6;

function changeSlide(direction) {
  const newSlide = currentSlide + direction;
  if (newSlide < 1 || newSlide > totalSlides) return;
  
  // Hide current active slide
  const activeSlideEl = document.querySelector(`.slide.active`);
  if (activeSlideEl) activeSlideEl.classList.remove('active');
  
  // Show new active slide
  currentSlide = newSlide;
  const targetSlideEl = document.getElementById(`slide-${currentSlide}`);
  if (targetSlideEl) targetSlideEl.classList.add('active');
  
  // Update indicators
  updateSlideIndicators();
}

function updateSlideIndicators() {
  const progressFill = document.getElementById('progress-fill');
  const counterText = document.getElementById('slide-counter-text');
  const prevBtn = document.getElementById('prev-btn');
  const nextBtn = document.getElementById('next-btn');
  
  if (progressFill) {
    const percentage = (currentSlide / totalSlides) * 100;
    progressFill.style.width = `${percentage}%`;
  }
  
  if (counterText) {
    counterText.textContent = `Slide ${currentSlide} of ${totalSlides}`;
  }
  
  if (prevBtn) {
    prevBtn.disabled = (currentSlide === 1);
  }
  
  if (nextBtn) {
    nextBtn.disabled = (currentSlide === totalSlides);
  }
}

// Flowchart Simulation Run
let simInterval = null;
function startFlowchartSimulation() {
  const simBtn = document.getElementById('sim-btn');
  const statusBox = document.getElementById('sim-status-box');
  const statusText = document.getElementById('sim-status-text');
  
  if (!simBtn) return;
  
  // Reset all flowchart classes
  const nodes = ['node-ngo', 'node-ai', 'node-db', 'node-vol'];
  const arrows = ['arrow-1', 'arrow-2', 'arrow-3'];
  
  nodes.forEach(n => {
    const el = document.getElementById(n);
    if (el) {
      el.style.boxShadow = 'var(--shadow-sm)';
      el.style.transform = 'scale(1)';
    }
  });
  
  arrows.forEach(a => {
    const el = document.getElementById(a);
    if (el) el.style.color = 'var(--color-text-muted)';
  });
  
  simBtn.disabled = true;
  if (statusBox) statusBox.style.display = 'block';
  if (statusText) statusText.textContent = 'Preparing request simulation...';
  
  let step = 0;
  
  if (simInterval) clearInterval(simInterval);
  
  simInterval = setInterval(() => {
    step++;
    
    if (step === 1) {
      highlightNode('node-ngo', '🏢 NGO Form filled & submitted...');
    } else if (step === 2) {
      highlightArrow('arrow-1');
    } else if (step === 3) {
      highlightNode('node-ai', '✨ AI scans keywords & categorizes incident...');
    } else if (step === 4) {
      highlightArrow('arrow-2');
    } else if (step === 5) {
      highlightNode('node-db', '💾 Ticket saved instantly in localStorage database...');
    } else if (step === 6) {
      highlightArrow('arrow-3');
    } else if (step === 7) {
      highlightNode('node-vol', '🙋‍♂️ Volunteer feed updated! Claim action triggers sync...');
    } else {
      clearInterval(simInterval);
      simBtn.disabled = false;
      if (statusText) statusText.textContent = '✅ Simulation run completed successfully! Portal databases are synchronized.';
    }
  }, 1000);
}

function highlightNode(nodeId, message) {
  const el = document.getElementById(nodeId);
  const statusText = document.getElementById('sim-status-text');
  if (el) {
    el.style.transform = 'scale(1.08)';
    el.style.boxShadow = '0 0 15px rgba(59, 130, 246, 0.4)';
  }
  if (statusText) statusText.textContent = message;
}

function highlightArrow(arrowId) {
  const el = document.getElementById(arrowId);
  if (el) {
    el.style.color = 'var(--color-primary)';
  }
}

// Bind to window to ensure global availability (for inline HTML click bindings)
window.changeSlide = changeSlide;
window.startFlowchartSimulation = startFlowchartSimulation;

// Handle Keyboard navigation for slides
document.addEventListener('keydown', (event) => {
  if (!document.querySelector('.slide-deck')) return;
  
  if (event.key === 'ArrowRight') {
    changeSlide(1);
  } else if (event.key === 'ArrowLeft') {
    changeSlide(-1);
  }
});

// Presentation initializer on page load
document.addEventListener("DOMContentLoaded", () => {
  if (document.querySelector(".slide-deck")) {
    updateSlideIndicators();
  }
});

