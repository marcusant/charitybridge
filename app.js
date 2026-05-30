/**
 * Charity Bridge - Core Application Logic & State Management
 *
 * Implements SQLite (sql.js WASM) with IndexedDB persistence,
 * keyword-based AI auto-classification, and handles UI logic for both
 * NGO and Volunteer portals.
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
      icon: "\ud83d\udcd6",
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
      icon: "\ud83d\udfa5",
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
// 2. SQLite Database Engine (IndexedDB persistence + schema migrations)
// ==========================================================================

let db = null;
const DB_KEY = "charity_bridge_db";
const CURRENT_SCHEMA_VERSION = 3;

// IndexedDB Storage Adapter
const idbStorage = {
  DB_NAME: "CharityBridgeStorage",
  STORE_NAME: "db_backups",

  _getStore(mode) {
    return new Promise((resolve, reject) => {
      const req = indexedDB.open(this.DB_NAME, 1);
      req.onupgradeneeded = () => req.result.createObjectStore(this.STORE_NAME);
      req.onerror = () => reject(req.error);
      req.onsuccess = () => {
        const tx = req.result.transaction(this.STORE_NAME, mode);
        resolve(tx.objectStore(this.STORE_NAME));
      };
    });
  },

  async save(uint8Array) {
    const store = await this._getStore("readwrite");
    return new Promise((resolve, reject) => {
      const req = store.put(uint8Array, "sqlite_db");
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  },

  async load() {
    const store = await this._getStore("readonly");
    return new Promise((resolve, reject) => {
      const req = store.get("sqlite_db");
      req.onsuccess = () => resolve(req.result || null);
      req.onerror = () => reject(req.error);
    });
  },

  async remove() {
    const store = await this._getStore("readwrite");
    return new Promise((resolve, reject) => {
      const req = store.delete("sqlite_db");
      req.onsuccess = () => resolve();
      req.onerror = () => reject(req.error);
    });
  }
};

// Debounced persistence (500ms)
let persistTimer = null;
function persistDb() {
  clearTimeout(persistTimer);
  persistTimer = setTimeout(async () => {
    try {
      const data = db.export();
      await idbStorage.save(data);
    } catch (e) {
      console.error("[DB] Failed to persist database:", e);
      try {
        const data = db.export();
        let binary = "";
        for (let i = 0; i < data.length; i++) binary += String.fromCharCode(data[i]);
        localStorage.setItem(DB_KEY, btoa(binary));
      } catch (fallbackErr) {
        console.error("[DB] localStorage fallback also failed:", fallbackErr);
      }
    }
  }, 500);
}

function runMigrations() {
  const versionResult = db.exec("PRAGMA user_version");
  const currentVersion = versionResult[0]?.values[0][0] ?? 0;

  if (currentVersion >= CURRENT_SCHEMA_VERSION) return;

  db.run("BEGIN TRANSACTION");

  try {
    if (currentVersion < 2) {
      migrateV1toV2();
    }
    if (currentVersion < 3) {
      migrateV2toV3();
    }

    db.run("PRAGMA user_version = " + CURRENT_SCHEMA_VERSION);
    db.run("COMMIT");
  } catch (e) {
    db.run("ROLLBACK");
    console.error("[DB] Migration failed:", e);
    throw e;
  }
}

function migrateV1toV2() {
  db.run(`CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    urgency TEXT,
    risk TEXT,
    keywords TEXT
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS volunteers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    role TEXT,
    color TEXT,
    match_score TEXT,
    skills TEXT
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS ngos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    country TEXT,
    email TEXT,
    created_at TEXT DEFAULT (datetime('now'))
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS tickets_new (
    id TEXT PRIMARY KEY,
    ngo_id INTEGER REFERENCES ngos(id),
    category TEXT,
    issueType TEXT,
    urgency TEXT,
    risk TEXT,
    description TEXT,
    plan TEXT,
    skills TEXT,
    status TEXT DEFAULT 'Open',
    claimed_by INTEGER REFERENCES volunteers(id),
    created_at TEXT DEFAULT (datetime('now'))
  )`);

  // Migrate existing ticket data
  const existing = db.exec("SELECT * FROM tickets");
  if (existing.length && existing[0].values.length) {
    const ngoMap = {};
    for (const row of existing[0].values) {
      const ngoName = row[2];
      const country = row[3];
      const email = row[11];

      if (!ngoMap[ngoName]) {
        db.run("INSERT INTO ngos (name, country, email) VALUES (?, ?, ?)", [ngoName, country, email]);
        const ngoIdResult = db.exec("SELECT last_insert_rowid()");
        ngoMap[ngoName] = ngoIdResult[0].values[0][0];
      }

      db.run(`INSERT INTO tickets_new (id, ngo_id, category, issueType, urgency, risk, description, plan, skills, status, claimed_by)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NULL)`,
        [row[1], ngoMap[ngoName], row[4], row[5], row[6], row[7], row[8], row[9], row[10], row[12]]);
    }

    db.run("DROP TABLE tickets");
    db.run("ALTER TABLE tickets_new RENAME TO tickets");
  } else {
    db.run("DROP TABLE IF EXISTS tickets");
    db.run("ALTER TABLE tickets_new RENAME TO tickets");
  }

  db.run("CREATE INDEX IF NOT EXISTS idx_tickets_status ON tickets(status)");
  db.run("CREATE INDEX IF NOT EXISTS idx_tickets_urgency ON tickets(urgency)");
  db.run("CREATE INDEX IF NOT EXISTS idx_tickets_ngo_id ON tickets(ngo_id)");
  db.run("CREATE INDEX IF NOT EXISTS idx_tickets_issue_type ON tickets(issueType)");

  // Seed categories
  const categoryKeywords = {
    cybersecurity: "hack,phish,security,leak,password,credential,compromise,cyber,auth,spam,suspect",
    "it-infrastructure": "server,network,internet,connection,router,wifi,dns,offline,slow,hardware,cloud,hosting",
    finance: "account,money,finance,invoice,tax,budget,quickbooks,xero,audit,ledger,bookkeeping,donation",
    software: "software,crm,newsletter,mailchimp,excel,spreadsheet,database,import,duplicate,data",
    communications: "marketing,social,content,design,video,logo,post,website,comms,write,flyer"
  };

  const catInsert = db.prepare("INSERT OR IGNORE INTO categories (name, description, urgency, risk, keywords) VALUES (?, ?, ?, ?, ?)");
  for (const [key, scenario] of Object.entries(scenarios)) {
    if (key === "default") continue;
    catInsert.run([scenario.category, key, scenario.urgency, scenario.risk, categoryKeywords[key] || ""]);
  }
  catInsert.free();

  // Seed volunteers
  const volInsert = db.prepare("INSERT INTO volunteers (name, role, color, match_score, skills) VALUES (?, ?, ?, ?, ?)");
  for (const scenario of Object.values(scenarios)) {
    if (!scenario.volunteers) continue;
    for (const v of scenario.volunteers) {
      volInsert.run([v.name, v.role, v.color, v.match, JSON.stringify(scenario.skills)]);
    }
  }
  volInsert.free();
}

function migrateV2toV3() {
  // Extend volunteers table with profile columns
  const volCols = db.exec("PRAGMA table_info(volunteers)");
  const existingCols = volCols.length ? volCols[0].values.map(r => r[1]) : [];

  if (!existingCols.includes("email")) {
    db.run("ALTER TABLE volunteers ADD COLUMN email TEXT");
  }
  if (!existingCols.includes("country")) {
    db.run("ALTER TABLE volunteers ADD COLUMN country TEXT");
  }
  if (!existingCols.includes("bio")) {
    db.run("ALTER TABLE volunteers ADD COLUMN bio TEXT");
  }
  if (!existingCols.includes("availability")) {
    db.run("ALTER TABLE volunteers ADD COLUMN availability TEXT");
  }
  if (!existingCols.includes("experience_level")) {
    db.run("ALTER TABLE volunteers ADD COLUMN experience_level TEXT");
  }
  if (!existingCols.includes("custom_skills")) {
    db.run("ALTER TABLE volunteers ADD COLUMN custom_skills TEXT");
  }
  if (!existingCols.includes("is_registered")) {
    db.run("ALTER TABLE volunteers ADD COLUMN is_registered INTEGER DEFAULT 0");
  }

  // Add claimed_by_email to tickets if not present
  const ticketCols = db.exec("PRAGMA table_info(tickets)");
  const existingTicketCols = ticketCols.length ? ticketCols[0].values.map(r => r[1]) : [];
  if (!existingTicketCols.includes("claimed_by_email")) {
    db.run("ALTER TABLE tickets ADD COLUMN claimed_by_email TEXT");
  }
  if (!existingTicketCols.includes("claimed_hours")) {
    db.run("ALTER TABLE tickets ADD COLUMN claimed_hours INTEGER");
  }

  // Add unique index on volunteer email for registered volunteers
  db.run("CREATE UNIQUE INDEX IF NOT EXISTS idx_volunteers_email ON volunteers(email) WHERE email IS NOT NULL");
}

function createFreshSchema() {
  db.run(`CREATE TABLE IF NOT EXISTS categories (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL UNIQUE,
    description TEXT,
    urgency TEXT,
    risk TEXT,
    keywords TEXT
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS volunteers (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    role TEXT,
    color TEXT,
    match_score TEXT,
    skills TEXT,
    email TEXT,
    country TEXT,
    bio TEXT,
    availability TEXT,
    experience_level TEXT,
    custom_skills TEXT,
    is_registered INTEGER DEFAULT 0
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS ngos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    country TEXT,
    email TEXT,
    created_at TEXT DEFAULT (datetime('now'))
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS tickets (
    id TEXT PRIMARY KEY,
    ngo_id INTEGER REFERENCES ngos(id),
    category TEXT,
    issueType TEXT,
    urgency TEXT,
    risk TEXT,
    description TEXT,
    plan TEXT,
    skills TEXT,
    status TEXT DEFAULT 'Open',
    claimed_by INTEGER REFERENCES volunteers(id),
    claimed_by_email TEXT,
    claimed_hours INTEGER,
    created_at TEXT DEFAULT (datetime('now'))
  )`);

  db.run("CREATE INDEX IF NOT EXISTS idx_tickets_status ON tickets(status)");
  db.run("CREATE INDEX IF NOT EXISTS idx_tickets_urgency ON tickets(urgency)");
  db.run("CREATE INDEX IF NOT EXISTS idx_tickets_ngo_id ON tickets(ngo_id)");
  db.run("CREATE INDEX IF NOT EXISTS idx_tickets_issue_type ON tickets(issueType)");

  db.run("PRAGMA user_version = " + CURRENT_SCHEMA_VERSION);
}

function seedInitialData() {
  // Seed categories
  const categoryKeywords = {
    cybersecurity: "hack,phish,security,leak,password,credential,compromise,cyber,auth,spam,suspect",
    "it-infrastructure": "server,network,internet,connection,router,wifi,dns,offline,slow,hardware,cloud,hosting",
    finance: "account,money,finance,invoice,tax,budget,quickbooks,xero,audit,ledger,bookkeeping,donation",
    software: "software,crm,newsletter,mailchimp,excel,spreadsheet,database,import,duplicate,data",
    communications: "marketing,social,content,design,video,logo,post,website,comms,write,flyer"
  };

  const catInsert = db.prepare("INSERT OR IGNORE INTO categories (name, description, urgency, risk, keywords) VALUES (?, ?, ?, ?, ?)");
  for (const [key, scenario] of Object.entries(scenarios)) {
    if (key === "default") continue;
    catInsert.run([scenario.category, key, scenario.urgency, scenario.risk, categoryKeywords[key] || ""]);
  }
  catInsert.free();

  // Seed volunteers
  const volInsert = db.prepare("INSERT INTO volunteers (name, role, color, match_score, skills) VALUES (?, ?, ?, ?, ?)");
  for (const scenario of Object.values(scenarios)) {
    if (!scenario.volunteers) continue;
    for (const v of scenario.volunteers) {
      volInsert.run([v.name, v.role, v.color, v.match, JSON.stringify(scenario.skills)]);
    }
  }
  volInsert.free();

  // Seed initial tickets
  const ngoInsert = db.prepare("INSERT OR IGNORE INTO ngos (name, country, email) VALUES (?, ?, ?)");
  const ticketInsert = db.prepare(`INSERT OR IGNORE INTO tickets
    (id, ngo_id, category, issueType, urgency, risk, description, plan, skills, status)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);

  initialMockTickets.forEach(t => {
    ngoInsert.run([t.ngo, t.country, t.email]);
    const ngoResult = db.exec("SELECT id FROM ngos WHERE name = ?", [t.ngo]);
    const ngoId = ngoResult[0]?.values[0]?.[0];
    ticketInsert.run([t.id, ngoId, t.category, t.issueType, t.urgency, t.risk,
                      t.desc, JSON.stringify(t.plan), JSON.stringify(t.skills), t.status]);
  });

  ngoInsert.free();
  ticketInsert.free();
}

// DB Health Check
function checkDbHealth() {
  try {
    db.exec("SELECT 1");
    return true;
  } catch (e) {
    console.error("[DB] Health check failed:", e);
    return false;
  }
}

// Async DB initialization with IndexedDB-first loading
const dbReady = (async () => {
  try {
    const SQL = await initSqlJs({
      locateFile: file => `https://cdnjs.cloudflare.com/ajax/libs/sql.js/1.10.3/${file}`
    });

    let loaded = false;

    // Try IndexedDB first
    try {
      const idbData = await idbStorage.load();
      if (idbData) {
        db = new SQL.Database(idbData);
        loaded = true;
      }
    } catch (e) {
      console.warn("[DB] IndexedDB load failed, trying localStorage:", e);
    }

    // Fall back to localStorage
    if (!loaded) {
      const saved = localStorage.getItem(DB_KEY);
      if (saved) {
        const binary = atob(saved);
        const bytes = new Uint8Array(binary.length);
        for (let i = 0; i < binary.length; i++) bytes[i] = binary.charCodeAt(i);
        db = new SQL.Database(bytes);
        loaded = true;
        // Migrate to IndexedDB and clear localStorage
        try {
          await idbStorage.save(db.export());
          localStorage.removeItem(DB_KEY);
        } catch (e) {
          console.warn("[DB] Failed to migrate localStorage to IndexedDB:", e);
        }
      }
    }

    // Fresh database
    if (!loaded) {
      db = new SQL.Database();
      createFreshSchema();
    }

    // Run schema migrations
    runMigrations();

    // Seed data if empty
    const count = db.exec("SELECT COUNT(*) FROM tickets");
    if (!count.length || count[0].values[0][0] === 0) {
      seedInitialData();
    }

    persistDb();

    if (!checkDbHealth()) {
      console.error("[DB] Database initialized but health check failed");
    }
  } catch (e) {
    console.error("[DB] Critical initialization error:", e);
  }
})();

async function getStoredTickets() {
  await dbReady;
  try {
    const result = db.exec(`
      SELECT t.id, n.name, n.country, t.category, t.issueType, t.urgency, t.risk,
             t.description, t.plan, t.skills, n.email, t.status, t.claimed_by
      FROM tickets t
      LEFT JOIN ngos n ON t.ngo_id = n.id
      ORDER BY t.rowid DESC
    `);
    if (!result.length) return [];
    return result[0].values.map(r => ({
      id: r[0], ngo: r[1] || "", country: r[2] || "", category: r[3],
      issueType: r[4], urgency: r[5], risk: r[6],
      desc: r[7],
      plan: JSON.parse(r[8] || "[]"),
      skills: JSON.parse(r[9] || "[]"),
      email: r[10] || "", status: r[11], claimedBy: r[12]
    }));
  } catch (e) {
    console.error("[DB] Error fetching tickets:", e);
    return [];
  }
}

async function saveTicketsToStorage(ticketsList) {
  await dbReady;
  try {
    db.run("DELETE FROM tickets");
    const insert = db.prepare(`INSERT INTO tickets
      (id, ngo_id, category, issueType, urgency, risk, description, plan, skills, status, claimed_by)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`);
    ticketsList.forEach(t => {
      // Resolve ngo_id
      let ngoId = null;
      if (t.ngo) {
        const ngoResult = db.exec("SELECT id FROM ngos WHERE name = ?", [t.ngo]);
        if (ngoResult.length && ngoResult[0].values.length) {
          ngoId = ngoResult[0].values[0][0];
        } else {
          db.run("INSERT INTO ngos (name, country, email) VALUES (?, ?, ?)", [t.ngo, t.country || "", t.email || ""]);
          const newNgoResult = db.exec("SELECT last_insert_rowid()");
          ngoId = newNgoResult[0].values[0][0];
        }
      }
      insert.run([t.id, ngoId, t.category, t.issueType, t.urgency, t.risk,
                  t.desc, JSON.stringify(t.plan || []), JSON.stringify(t.skills || []),
                  t.status, t.claimedBy || null]);
    });
    insert.free();
    persistDb();
  } catch (e) {
    console.error("[DB] Error saving tickets:", e);
  }
}

async function addTicket(ticket) {
  await dbReady;
  try {
    // Resolve or create NGO
    let ngoId = null;
    if (ticket.ngo) {
      const existing = db.exec("SELECT id FROM ngos WHERE name = ?", [ticket.ngo]);
      if (existing.length && existing[0].values.length) {
        ngoId = existing[0].values[0][0];
      } else {
        db.run("INSERT INTO ngos (name, country, email) VALUES (?, ?, ?)",
          [ticket.ngo, ticket.country || "", ticket.email || ""]);
        const ngoIdResult = db.exec("SELECT last_insert_rowid()");
        ngoId = ngoIdResult[0].values[0][0];
      }
    }

    db.run(`INSERT INTO tickets
      (id, ngo_id, category, issueType, urgency, risk, description, plan, skills, status)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [ticket.id, ngoId, ticket.category, ticket.issueType,
       ticket.urgency, ticket.risk, ticket.desc,
       JSON.stringify(ticket.plan || []), JSON.stringify(ticket.skills || []),
       ticket.status]);
    persistDb();
  } catch (e) {
    console.error("[DB] Error adding ticket:", e);
  }
}

async function updateTicketClaim(id, volunteerId) {
  await dbReady;
  try {
    if (volunteerId) {
      db.run("UPDATE tickets SET status = 'Claimed', claimed_by = ? WHERE id = ?", [volunteerId, id]);
    } else {
      db.run("UPDATE tickets SET status = 'Claimed' WHERE id = ?", [id]);
    }
    persistDb();
  } catch (e) {
    console.error("[DB] Error updating ticket claim:", e);
  }
}

function generateTicketId() {
  const prefix = "TKT";
  const year = new Date().getFullYear();
  const rand = Math.floor(10000 + Math.random() * 90000);
  return `${prefix}-${year}-${rand}`;
}

// ==========================================================================
// 3. Volunteer Profile CRUD & Session Management
// ==========================================================================

async function saveVolunteerProfile(profile) {
  await dbReady;
  try {
    // Check if volunteer with this email already exists
    const existing = db.exec("SELECT id FROM volunteers WHERE email = ?", [profile.email]);
    if (existing.length && existing[0].values.length) {
      // Update existing profile
      db.run(`UPDATE volunteers SET name = ?, country = ?, bio = ?, availability = ?,
        experience_level = ?, custom_skills = ?, skills = ?, is_registered = 1 WHERE email = ?`,
        [profile.name, profile.country || "", profile.bio || "",
         profile.availability || "", profile.experience_level || "",
         JSON.stringify(profile.custom_skills || []), JSON.stringify(profile.skills || []),
         profile.email]);
      persistDb();
      return existing[0].values[0][0];
    } else {
      // Insert new registered volunteer
      db.run(`INSERT INTO volunteers (name, email, country, bio, availability, experience_level,
        custom_skills, skills, is_registered) VALUES (?, ?, ?, ?, ?, ?, ?, ?, 1)`,
        [profile.name, profile.email, profile.country || "", profile.bio || "",
         profile.availability || "", profile.experience_level || "",
         JSON.stringify(profile.custom_skills || []), JSON.stringify(profile.skills || [])]);
      const idResult = db.exec("SELECT last_insert_rowid()");
      persistDb();
      return idResult[0].values[0][0];
    }
  } catch (e) {
    console.error("[DB] Error saving volunteer profile:", e);
    return null;
  }
}

async function getVolunteerProfile(email) {
  await dbReady;
  try {
    const result = db.exec(`SELECT id, name, role, color, match_score, skills, email, country,
      bio, availability, experience_level, custom_skills, is_registered
      FROM volunteers WHERE email = ?`, [email]);
    if (!result.length || !result[0].values.length) return null;
    const r = result[0].values[0];
    return {
      id: r[0], name: r[1], role: r[2], color: r[3], matchScore: r[4],
      skills: JSON.parse(r[5] || "[]"), email: r[6], country: r[7],
      bio: r[8], availability: r[9], experienceLevel: r[10],
      customSkills: JSON.parse(r[11] || "[]"), isRegistered: r[12]
    };
  } catch (e) {
    console.error("[DB] Error fetching volunteer profile:", e);
    return null;
  }
}

async function getRegisteredVolunteers() {
  await dbReady;
  try {
    const result = db.exec(`SELECT id, name, email, country, bio, availability,
      experience_level, custom_skills, skills FROM volunteers WHERE is_registered = 1
      ORDER BY name ASC`);
    if (!result.length) return [];
    return result[0].values.map(r => ({
      id: r[0], name: r[1], email: r[2], country: r[3], bio: r[4],
      availability: r[5], experienceLevel: r[6],
      customSkills: JSON.parse(r[7] || "[]"), skills: JSON.parse(r[8] || "[]")
    }));
  } catch (e) {
    console.error("[DB] Error fetching registered volunteers:", e);
    return [];
  }
}

async function getClaimedTicketsByEmail(email) {
  await dbReady;
  try {
    const result = db.exec(`
      SELECT t.id, n.name, n.country, t.category, t.issueType, t.urgency, t.risk,
             t.description, t.plan, t.skills, n.email, t.status, t.claimed_hours
      FROM tickets t
      LEFT JOIN ngos n ON t.ngo_id = n.id
      WHERE t.claimed_by_email = ?
      ORDER BY t.rowid DESC
    `, [email]);
    if (!result.length) return [];
    return result[0].values.map(r => ({
      id: r[0], ngo: r[1] || "", country: r[2] || "", category: r[3],
      issueType: r[4], urgency: r[5], risk: r[6], desc: r[7],
      plan: JSON.parse(r[8] || "[]"), skills: JSON.parse(r[9] || "[]"),
      email: r[10] || "", status: r[11], hours: r[12] || 0
    }));
  } catch (e) {
    console.error("[DB] Error fetching claimed tickets:", e);
    return [];
  }
}

// Session Management
const VOLUNTEER_SESSION_KEY = "charity_bridge_active_volunteer";

function setActiveVolunteer(email) {
  localStorage.setItem(VOLUNTEER_SESSION_KEY, email);
}

function getActiveVolunteer() {
  return localStorage.getItem(VOLUNTEER_SESSION_KEY);
}

function clearActiveVolunteer() {
  localStorage.removeItem(VOLUNTEER_SESSION_KEY);
}

// Profile Rendering Helpers
function getInitials(name) {
  return name.split(" ").map(n => n[0]).join("").toUpperCase();
}

function renderVolunteerBadge(profile) {
  if (!profile) return "";
  const initials = getInitials(profile.name);
  const color = profile.color || "#00008F";
  return `
    <div class="volunteer-card" style="cursor: default;">
      <div class="volunteer-avatar" style="background:${color}">${initials}</div>
      <div class="volunteer-info">
        <h5>${profile.name}</h5>
        <p>${profile.experienceLevel || profile.role || "Volunteer"} ${profile.country ? "\u2022 " + profile.country : ""}</p>
      </div>
      ${profile.experienceLevel ? `<span class="volunteer-match">${profile.experienceLevel}</span>` : ""}
    </div>
  `;
}

function renderProfileCard(profile, claimedTickets) {
  const skillsToShow = [...(profile.skills || []), ...(profile.customSkills || [])];
  const experienceLabels = { beginner: "Beginner", intermediate: "Intermediate", expert: "Expert" };

  return `
    <div class="profile-header">
      <div class="profile-avatar-large" style="background: ${profile.color || "var(--color-primary)"}">
        ${getInitials(profile.name)}
      </div>
      <div class="profile-info">
        <h3 class="profile-name">${profile.name}</h3>
        <p class="profile-email">${profile.email}</p>
        ${profile.country ? `<p class="profile-country">\ud83d\udccd ${profile.country}</p>` : ""}
      </div>
    </div>

    <div class="profile-detail-grid">
      ${profile.experienceLevel ? `
        <div class="profile-detail-item">
          <span class="profile-detail-label">Experience</span>
          <span class="profile-detail-value">${experienceLabels[profile.experienceLevel] || profile.experienceLevel}</span>
        </div>
      ` : ""}
    </div>

    ${profile.bio ? `
      <div class="profile-bio">
        <span class="profile-detail-label">About</span>
        <p>${profile.bio}</p>
      </div>
    ` : ""}

    ${skillsToShow.length ? `
      <div class="profile-skills">
        <span class="profile-detail-label">Skills</span>
        <div class="skills-list">
          ${skillsToShow.map(s => `<span class="skill-pill"><span role="img" aria-label="wrench">\ud83d\udd27</span> ${s}</span>`).join("")}
        </div>
      </div>
    ` : ""}

    <div class="profile-claims">
      <span class="profile-detail-label">My Claimed Tickets</span>
      ${claimedTickets.length ? `
        <div class="profile-claims-list">
          ${claimedTickets.map(t => `
            <div class="profile-claim-item">
              <div class="profile-claim-header">
                <span class="profile-claim-ngo">${t.ngo}</span>
                <div style="display:flex; align-items:center; gap:6px;">
                  ${t.hours ? `<span class="profile-claim-hours">${t.hours}h</span>` : ""}
                  <span class="tag tag-category" style="padding:2px 8px; font-size:11px;">${t.category}</span>
                </div>
              </div>
              <p class="profile-claim-desc">${t.desc.substring(0, 100)}${t.desc.length > 100 ? "..." : ""}</p>
            </div>
          `).join("")}
        </div>
      ` : `
        <p class="profile-no-claims">No tickets claimed yet. Visit the <a href="volunteer.html">Volunteer Portal</a> to browse and claim tickets.</p>
      `}
    </div>
  `;
}

// ==========================================================================
// 4. NGO Support Portal - Specific Logic
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
  btnText.innerHTML = "Analyzing\u2026";

  document.getElementById("ai-results").style.display = "none";
  document.getElementById("results-divider").style.display = "none";
  document.getElementById("selfhelp-section").style.display = "none";
  document.getElementById("ticket-section").style.display = "none";

  setTimeout(async () => {
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
      <div class="tag tag-category"><span role="img" aria-label="label">\ud83c\udff7\ufe0f</span> ${data.category}</div>
      <div class="tag tag-urgency"><span role="img" aria-label="voltage spark">\u26a1</span> Urgency: ${displayUrgency}</div>
      <div class="tag tag-risk"><span role="img" aria-label="shield">\ud83d\udee1\ufe0f</span> Risk: ${data.risk}</div>
      <div class="tag tag-action">${needsTicket ? '<span role="img" aria-label="ticket">\ud83c\udfab</span> Ticket Required' : '<span role="img" aria-label="books">\ud83d\udcda</span> Self-Help Sufficient'}</div>
    `;

    const planList = document.getElementById("response-plan-list");
    planList.innerHTML = data.plan.map(step => `<li>${step}</li>`).join("");

    const skillsList = document.getElementById("skills-list");
    skillsList.innerHTML = data.skills.map(s =>
      `<span class="skill-pill"><span role="img" aria-label="wrench">\ud83d\udd27</span> ${s}</span>`
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

      // SQLITE PERSISTENCE: Save the ticket to the SQLite database
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
        status: "Open"
      };

      await addTicket(newTicket);

    } else {
      const res = data.resource || {
        icon: "\ud83d\udcd6",
        title: "General Nonprofit Support Guide",
        desc: "Covers common operational challenges faced by nonprofits."
      };

      const resourceIconMap = { "\ud83d\udcd6": "book", "\ud83d\udfa5": "video camera" };
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
    btnText.innerHTML = `<span role="img" aria-label="magnifying glass">\ud83d\udd0d</span> Analyze Request`;

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

// Urgency colour map
const URGENCY_COLORS = {
  high:     { bg: 'var(--color-danger-bg)',   color: 'var(--color-danger-text)',   border: 'var(--color-danger-border)' },
  medium:   { bg: 'var(--color-warning-bg)',  color: 'var(--color-warning-text)',  border: 'var(--color-warning-border)' },
  low:      { bg: 'var(--color-success-bg)',  color: 'var(--color-success-text)',  border: 'var(--color-success-border)' },
  critical: { bg: 'var(--color-critical-bg)', color: 'var(--color-critical-text)', border: 'var(--color-critical-border)' },
};

// Renders the ticket feed cards
async function renderTicketFeed() {
  const feedContainer = document.getElementById("ticket-feed-container");
  if (!feedContainer) return;

  const searchText = (document.getElementById("ticket-search")?.value ?? "").toLowerCase().trim();
  const currentTickets = await getStoredTickets();

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
        <div style="font-size:40px; margin-bottom:12px;">\ud83d\udd0d</div>
        <p style="font-size:14px;">No tickets found matching your filter. Try a different search or category.</p>
      </div>
    `;
    return;
  }

  feedContainer.innerHTML = filtered.map((t, index) => {
    const uc = URGENCY_COLORS[t.urgency.toLowerCase()] || URGENCY_COLORS.medium;
    const statusBadge = t.status === "Claimed"
      ? `<span class="ticket-status" style="background:var(--color-primary-light); color:var(--color-primary-dark); border-color:var(--color-primary-border);">\u2713 Claimed</span>`
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
            <div class="ticket-feed-meta">\ud83d\udccd ${t.country} &nbsp;\u2022&nbsp; ${t.id}</div>
          </div>
          ${statusBadge}
        </div>
        <p class="ticket-feed-desc">${t.desc}</p>
        <div class="ticket-feed-tags">
          <span class="tag tag-category" style="padding:4px 10px; font-size:11px;"><span role="img" aria-label="tag">\ud83c\udff7\ufe0f</span> ${t.category}</span>
          <span style="display:inline-flex; align-items:center; gap:5px; padding:4px 10px; border-radius:var(--radius-sm); font-size:11px; font-weight:700; background:${uc.bg}; color:${uc.color}; border:1px solid ${uc.border};">\u26a1 ${t.urgency}</span>
        </div>
        <div style="margin-top:4px; font-size:12px; color:var(--color-primary); font-weight:600; display:flex; align-items:center; gap:4px;">
          <span>View full details & claim</span> <span>\u2192</span>
        </div>
      </div>
    `;
  }).join("");
}

async function setCategoryFilter(category) {
  currentCategory = category;
  document.querySelectorAll("#filter-pills .filter-btn").forEach((btn, i) => {
    const map = { all:0, cybersecurity:1, "it-infrastructure":2, finance:3, software:4, communications:5 };
    btn.classList.toggle("active", i === (map[category] ?? 0));
  });
  await renderTicketFeed();
}

async function filterTickets() { await renderTicketFeed(); }

// Open ticket modal
async function selectTicket(id) {
  const currentTickets = await getStoredTickets();
  const ticket = currentTickets.find(t => t.id === id);
  if (!ticket) return;

  activeTicketId = id;

  const uc = URGENCY_COLORS[ticket.urgency.toLowerCase()] || URGENCY_COLORS.medium;
  const isClaimed = ticket.status === "Claimed";

  // Populate modal fields
  document.getElementById("modal-tags").innerHTML = `
    <span class="tag tag-category" style="display:inline-flex; font-size:12px; padding:4px 12px;">
      <span role="img" aria-label="tag">\ud83c\udff7\ufe0f</span> ${ticket.category}
    </span>
    <span style="display:inline-flex; align-items:center; gap:5px; padding:4px 12px; border-radius:var(--radius-full); font-size:12px; font-weight:700; background:${uc.bg}; color:${uc.color}; border:1px solid ${uc.border};">
      \u26a1 ${ticket.urgency} Urgency
    </span>
  `;

  document.getElementById("modal-ngo-name").textContent = ticket.ngo;
  document.getElementById("modal-meta").innerHTML =
    `\ud83d\udccd ${ticket.country} &nbsp;\u2022&nbsp; ID: <strong>${ticket.id}</strong>`;

  document.getElementById("modal-desc").textContent = ticket.desc;

  document.getElementById("modal-plan").innerHTML =
    ticket.plan.map(p => `<li>${p}</li>`).join("");

  document.getElementById("modal-skills").innerHTML =
    ticket.skills.map(s => `<span class="skill-pill"><span role="img" aria-label="wrench">\ud83d\udd27</span> ${s}</span>`).join("");

  const emailLink = document.getElementById("modal-email-link");
  emailLink.href = `mailto:${ticket.email}`;
  emailLink.textContent = ticket.email;

  const statusEl = document.getElementById("modal-status-text");
  statusEl.textContent = `\u25cf ${ticket.status}`;
  statusEl.style.color = isClaimed ? "var(--color-primary-dark)" : "var(--color-success-text)";

  const claimBtn = document.getElementById("modal-claim-btn");
  const hoursSection = document.getElementById("modal-hours-section");
  if (isClaimed) {
    claimBtn.disabled = true;
    claimBtn.innerHTML = `<span role="img" aria-label="check">\u2713</span> Ticket Already Claimed`;
    claimBtn.style.background = "var(--border-color)";
    claimBtn.style.color = "var(--color-text-muted)";
    claimBtn.style.cursor = "not-allowed";
    claimBtn.style.boxShadow = "none";
    if (hoursSection) hoursSection.style.display = "none";
  } else {
    claimBtn.disabled = false;
    claimBtn.innerHTML = `\ud83e\udd1d Claim Ticket &amp; Contact Charity`;
    claimBtn.style.background = "";
    claimBtn.style.color = "";
    claimBtn.style.cursor = "";
    claimBtn.style.boxShadow = "";
    if (hoursSection) {
      hoursSection.style.display = "block";
      resetHoursSelection();
    }
  }

  // Reset stagger animations by re-triggering them
  document.querySelectorAll("#ticket-modal-dialog .stagger-item").forEach(el => {
    el.style.animation = "none";
    void el.offsetWidth; // force reflow
    el.style.animation = "";
  });

  // Open the modal
  const overlay = document.getElementById("ticket-modal-overlay");
  overlay.classList.remove("is-closing");
  overlay.classList.add("is-open");
  document.body.style.overflow = "hidden"; // prevent page scroll while modal is open
  document.getElementById("modal-close-btn").focus();
}

// Close ticket modal (with exit animation)
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

// Hours Selection Functions
function selectHours(hours) {
  const hiddenInput = document.getElementById("modal-hours-value");
  const customInput = document.getElementById("modal-hours-custom");
  if (hiddenInput) hiddenInput.value = hours;
  if (customInput) customInput.value = "";

  document.querySelectorAll(".hours-btn").forEach(btn => {
    btn.classList.toggle("active", Number(btn.dataset.hours) === hours);
  });
}

function selectCustomHours(value) {
  const hiddenInput = document.getElementById("modal-hours-value");
  const hours = parseInt(value);
  if (hiddenInput && hours > 0) hiddenInput.value = hours;

  document.querySelectorAll(".hours-btn").forEach(btn => btn.classList.remove("active"));
}

function resetHoursSelection() {
  const hiddenInput = document.getElementById("modal-hours-value");
  const customInput = document.getElementById("modal-hours-custom");
  if (hiddenInput) hiddenInput.value = "4";
  if (customInput) customInput.value = "";

  document.querySelectorAll(".hours-btn").forEach(btn => {
    btn.classList.toggle("active", Number(btn.dataset.hours) === 4);
  });
}

// Claim ticket from modal
async function claimTicketFromModal() {
  if (!activeTicketId) return;
  const id = activeTicketId;

  // Get hours value
  const hoursInput = document.getElementById("modal-hours-value");
  const hours = hoursInput ? parseInt(hoursInput.value) || 4 : 4;

  // Check for active volunteer session
  const activeEmail = getActiveVolunteer();
  let volunteerName = null;

  if (activeEmail) {
    const profile = await getVolunteerProfile(activeEmail);
    if (profile) {
      volunteerName = profile.name;
      await updateTicketClaim(id, profile.id);
      // Store email and hours on ticket
      await dbReady;
      try {
        db.run("UPDATE tickets SET claimed_by_email = ?, claimed_hours = ? WHERE id = ?", [activeEmail, hours, id]);
        persistDb();
      } catch (e) {
        console.error("[DB] Error setting claim data:", e);
      }
    } else {
      await updateTicketClaim(id);
    }
  } else {
    await updateTicketClaim(id);
  }

  // Refresh modal to show claimed state
  await selectTicket(id);

  // Refresh feed card badge
  await renderTicketFeed();

  // Update stat counter
  const allTickets = await getStoredTickets();
  const claimedCount = allTickets.filter(t => t.status === "Claimed").length;
  const statEl = document.getElementById("active-claims-count");
  if (statEl) statEl.textContent = `${claimedCount} Ticket${claimedCount !== 1 ? "s" : ""}`;

  // Toast notification
  const toast = document.createElement("div");
  toast.setAttribute("role", "status");
  toast.setAttribute("aria-live", "polite");
  const toastMsg = volunteerName
    ? `\u2705 Ticket claimed by ${volunteerName} (${hours}h)! You can now contact the charity.`
    : `\u2705 Ticket claimed (${hours}h)! You can now contact the charity.`;
  toast.innerHTML = toastMsg;
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
async function claimTicket(id) {
  activeTicketId = id;
  await claimTicketFromModal();
}

// Initialize volunteer portal on page load
document.addEventListener("DOMContentLoaded", async () => {
  if (!document.getElementById("ticket-feed-container")) return;

  await dbReady;
  await renderTicketFeed();

  // Sync claimed count stat
  const allTickets = await getStoredTickets();
  const claimedCount = allTickets.filter(t => t.status === "Claimed").length;
  const statEl = document.getElementById("active-claims-count");
  if (statEl) statEl.textContent = `${claimedCount} Ticket${claimedCount !== 1 ? "s" : ""}`;
});

// ==========================================================================
// 5. Volunteer Registration Page - Specific Logic
// ==========================================================================

async function registerVolunteer() {
  const nameEl = document.getElementById("reg-name");
  const emailEl = document.getElementById("reg-email");
  const countryEl = document.getElementById("reg-country");
  const bioEl = document.getElementById("reg-bio");

  // Get selected experience level
  const expRadio = document.querySelector('input[name="experience"]:checked');

  // Get selected skills
  const skillCheckboxes = document.querySelectorAll('input[name="skills"]:checked');
  const selectedSkills = Array.from(skillCheckboxes).map(cb => cb.value);

  // Get custom skills
  const customSkillsEl = document.getElementById("reg-custom-skills");
  const customSkillsText = customSkillsEl ? customSkillsEl.value.trim() : "";
  const customSkills = customSkillsText ? customSkillsText.split(",").map(s => s.trim()).filter(Boolean) : [];

  // Reset errors
  ["reg-name", "reg-email"].forEach(fieldId => {
    const el = document.getElementById(fieldId);
    if (el) el.classList.remove("is-invalid");
    const err = document.getElementById(`error-${fieldId}`);
    if (err) { err.textContent = ""; err.style.display = "none"; }
  });

  let isValid = true;
  let firstInvalidEl = null;

  if (!nameEl.value.trim()) {
    nameEl.classList.add("is-invalid");
    const err = document.getElementById("error-reg-name");
    err.textContent = "Full name is required.";
    err.style.display = "block";
    isValid = false;
    firstInvalidEl = nameEl;
  }

  if (!emailEl.value.trim()) {
    emailEl.classList.add("is-invalid");
    const err = document.getElementById("error-reg-email");
    err.textContent = "Email address is required.";
    err.style.display = "block";
    isValid = false;
    if (!firstInvalidEl) firstInvalidEl = emailEl;
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailEl.value.trim())) {
    emailEl.classList.add("is-invalid");
    const err = document.getElementById("error-reg-email");
    err.textContent = "Please enter a valid email address.";
    err.style.display = "block";
    isValid = false;
    if (!firstInvalidEl) firstInvalidEl = emailEl;
  }

  if (!isValid) {
    if (firstInvalidEl) firstInvalidEl.focus();
    return;
  }

  const profile = {
    name: nameEl.value.trim(),
    email: emailEl.value.trim(),
    country: countryEl ? countryEl.value : "",
    bio: bioEl ? bioEl.value.trim() : "",
    experienceLevel: expRadio ? expRadio.value : "",
    skills: selectedSkills,
    customSkills: customSkills
  };

  const btn = document.getElementById("register-btn");
  const spinner = document.getElementById("reg-spinner");
  const btnText = document.getElementById("reg-btn-text");
  btn.disabled = true;
  spinner.style.display = "block";
  btnText.textContent = "Saving...";

  const volunteerId = await saveVolunteerProfile(profile);

  if (volunteerId) {
    setActiveVolunteer(profile.email);
    await showProfileView(profile.email);
  }

  btn.disabled = false;
  spinner.style.display = "none";
  btnText.textContent = "Register & Save Profile";
}

async function showProfileView(email) {
  const profile = await getVolunteerProfile(email);
  if (!profile) return;

  const claimedTickets = await getClaimedTicketsByEmail(email);

  const formSection = document.getElementById("registration-form-section");
  const profileSection = document.getElementById("profile-view-section");
  const profileContent = document.getElementById("profile-content");

  if (formSection) formSection.style.display = "none";
  if (profileSection) profileSection.style.display = "block";
  if (profileContent) profileContent.innerHTML = renderProfileCard(profile, claimedTickets);

  // Update header badge
  const headerBadge = document.getElementById("volunteer-session-badge");
  if (headerBadge) {
    headerBadge.innerHTML = `
      <div class="volunteer-avatar" style="width:28px; height:28px; font-size:11px; background:${profile.color || "var(--color-primary)"}">
        ${getInitials(profile.name)}
      </div>
      <span style="font-size:13px; font-weight:600; color:white;">${profile.name}</span>
    `;
    headerBadge.style.display = "flex";
  }
}

function editProfile() {
  const formSection = document.getElementById("registration-form-section");
  const profileSection = document.getElementById("profile-view-section");

  if (formSection) formSection.style.display = "block";
  if (profileSection) profileSection.style.display = "none";

  // Pre-fill form with existing data
  const email = getActiveVolunteer();
  if (email) {
    getVolunteerProfile(email).then(profile => {
      if (!profile) return;
      const nameEl = document.getElementById("reg-name");
      const emailEl = document.getElementById("reg-email");
      const countryEl = document.getElementById("reg-country");
      const bioEl = document.getElementById("reg-bio");
      const customSkillsEl = document.getElementById("reg-custom-skills");

      if (nameEl) nameEl.value = profile.name;
      if (emailEl) emailEl.value = profile.email;
      if (countryEl) countryEl.value = profile.country || "";
      if (bioEl) bioEl.value = profile.bio || "";
      if (customSkillsEl) customSkillsEl.value = (profile.customSkills || []).join(", ");

      // Set experience level
      if (profile.experienceLevel) {
        const expRadio = document.querySelector(`input[name="experience"][value="${profile.experienceLevel}"]`);
        if (expRadio) expRadio.checked = true;
      }

      // Set skills checkboxes
      document.querySelectorAll('input[name="skills"]').forEach(cb => {
        cb.checked = (profile.skills || []).includes(cb.value);
      });
    });
  }
}

function logoutVolunteer() {
  clearActiveVolunteer();
  const formSection = document.getElementById("registration-form-section");
  const profileSection = document.getElementById("profile-view-section");
  const headerBadge = document.getElementById("volunteer-session-badge");

  if (formSection) formSection.style.display = "block";
  if (profileSection) profileSection.style.display = "none";
  if (headerBadge) headerBadge.style.display = "none";

  // Clear form
  const nameEl = document.getElementById("reg-name");
  const emailEl = document.getElementById("reg-email");
  const bioEl = document.getElementById("reg-bio");
  const customSkillsEl = document.getElementById("reg-custom-skills");
  if (nameEl) nameEl.value = "";
  if (emailEl) emailEl.value = "";
  if (bioEl) bioEl.value = "";
  if (customSkillsEl) customSkillsEl.value = "";
  document.querySelectorAll('input[name="skills"]').forEach(cb => cb.checked = false);
  document.querySelectorAll('input[name="experience"]').forEach(r => r.checked = false);
}

function fillRegistrationDemo() {
  const nameEl = document.getElementById("reg-name");
  const emailEl = document.getElementById("reg-email");
  const countryEl = document.getElementById("reg-country");
  const bioEl = document.getElementById("reg-bio");
  const customSkillsEl = document.getElementById("reg-custom-skills");

  if (nameEl) nameEl.value = "Alex Johnson";
  if (emailEl) emailEl.value = "alex.johnson@example.com";
  if (countryEl) countryEl.value = "United States";
  if (bioEl) bioEl.value = "Senior IT consultant with 10 years of experience in nonprofit technology. Passionate about using tech for social impact.";
  if (customSkillsEl) customSkillsEl.value = "DevOps, AWS, Docker";

  // Set experience level
  const expRadio = document.querySelector('input[name="experience"][value="expert"]');
  if (expRadio) expRadio.checked = true;

  // Set skills checkboxes
  document.querySelectorAll('input[name="skills"]').forEach(cb => {
    cb.checked = ["cybersecurity", "it-infrastructure", "software"].includes(cb.value);
  });

  // Clear validation states
  ["reg-name", "reg-email"].forEach(fieldId => {
    const el = document.getElementById(fieldId);
    if (el) el.classList.remove("is-invalid");
    const err = document.getElementById(`error-${fieldId}`);
    if (err) { err.textContent = ""; err.style.display = "none"; }
  });
}

// Register page initialization
document.addEventListener("DOMContentLoaded", async () => {
  if (!document.getElementById("registration-form-section")) return;

  await dbReady;

  // Check for existing session
  const activeEmail = getActiveVolunteer();
  if (activeEmail) {
    const profile = await getVolunteerProfile(activeEmail);
    if (profile && profile.isRegistered) {
      await showProfileView(activeEmail);
      return;
    }
  }

  // Real-time error clearing
  const nameEl = document.getElementById("reg-name");
  const emailEl = document.getElementById("reg-email");

  if (nameEl) {
    nameEl.addEventListener("input", function() {
      this.classList.remove("is-invalid");
      const err = document.getElementById("error-reg-name");
      if (err) { err.textContent = ""; err.style.display = "none"; }
    });
  }

  if (emailEl) {
    emailEl.addEventListener("input", function() {
      this.classList.remove("is-invalid");
      const err = document.getElementById("error-reg-email");
      if (err) { err.textContent = ""; err.style.display = "none"; }
    });
  }

  // Initialize availability slider
});

// ==========================================================================
// 7. Presentation Slides & Interactive Simulation Logic
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
      highlightNode('node-ngo', '\ud83c\udfe2 NGO Form filled & submitted...');
    } else if (step === 2) {
      highlightArrow('arrow-1');
    } else if (step === 3) {
      highlightNode('node-ai', '\u2728 AI scans keywords & categorizes incident...');
    } else if (step === 4) {
      highlightArrow('arrow-2');
    } else if (step === 5) {
      highlightNode('node-db', '\ud83d\udcbe Ticket saved to SQLite database (IndexedDB)...');
    } else if (step === 6) {
      highlightArrow('arrow-3');
    } else if (step === 7) {
      highlightNode('node-vol', '\ud83d\ude4b\u200d\u2642\ufe0f Volunteer feed updated! Claim action triggers sync...');
    } else {
      clearInterval(simInterval);
      simBtn.disabled = false;
      if (statusText) statusText.textContent = '\u2705 Simulation run completed successfully! Portal databases are synchronized.';
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
