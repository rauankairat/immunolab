"use client";
import { useEffect, useRef, useState } from "react";
import styles from "./page.module.css";

const sections = [
  { id: "overview", label: "Overview" },
  { id: "tech-stack", label: "Tech Stack" },
  { id: "structure", label: "Repository Structure" },
  { id: "database", label: "Database Schema" },
  { id: "auth", label: "Auth & Authorization" },
  { id: "api", label: "API Routes" },
  { id: "storage", label: "File Storage & Cron" },
  { id: "orders", label: "Order Flow & PDF" },
  { id: "whatsapp", label: "WhatsApp Integration" },
  { id: "i18n", label: "Internationalization" },
  { id: "dashboards", label: "Dashboards" },
  { id: "patient", label: "Patient Features" },
  { id: "branches", label: "Branch Network" },
  { id: "env", label: "Environment Variables" },
  { id: "deployment", label: "Deployment" },
  { id: "patterns", label: "Key Patterns" },
];

export default function DocsClient() {
  const [active, setActive] = useState("overview");
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setActive(entry.target.id);
          }
        }
      },
      { rootMargin: "-20% 0px -75% 0px" }
    );
    const headings = contentRef.current?.querySelectorAll("h2[id]") ?? [];
    headings.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  function scrollTo(id: string) {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <div className={styles.shell}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <div className={styles.sidebarInner}>
          <p className={styles.sidebarHeading}>On this page</p>
          <nav>
            {sections.map((s) => (
              <button
                key={s.id}
                className={`${styles.sidebarLink} ${active === s.id ? styles.sidebarLinkActive : ""}`}
                onClick={() => scrollTo(s.id)}
              >
                {s.label}
              </button>
            ))}
          </nav>
        </div>
      </aside>

      {/* Content */}
      <main className={styles.content} ref={contentRef}>
        <div className={styles.header}>
          <span className={styles.badge}>Internal</span>
          <h1 className={styles.title}>Codebase Documentation</h1>
          <p className={styles.subtitle}>
            AllergoExpress ImmunoLab — medical laboratory portal for allergy diagnostics in Almaty, Kazakhstan.
          </p>
        </div>

        {/* ── Overview ── */}
        <section>
          <h2 id="overview" className={styles.sectionTitle}>Overview</h2>
          <p>
            <strong>AllergoExpress ImmunoLab</strong> is a full-stack medical portal that allows patients to order allergy tests,
            track test status, and securely access PDF results. Lab staff manage tests, upload results, and oversee activity
            through a role-gated dashboard.
          </p>
          <div className={styles.infoGrid}>
            <div className={styles.infoCard}>
              <span className={styles.infoLabel}>Production</span>
              <span className={styles.infoValue}>allergoexpressmed.com</span>
            </div>
            <div className={styles.infoCard}>
              <span className={styles.infoLabel}>Contact</span>
              <span className={styles.infoValue}>allergoexpressmed@gmail.com</span>
            </div>
            <div className={styles.infoCard}>
              <span className={styles.infoLabel}>Phone</span>
              <span className={styles.infoValue}>+7 707 566 88 99</span>
            </div>
            <div className={styles.infoCard}>
              <span className={styles.infoLabel}>Branches</span>
              <span className={styles.infoValue}>16 locations in Almaty</span>
            </div>
          </div>
          <p>
            The clinic specializes in <strong>ELISA-based testing</strong> for allergic reactions to local anesthetics and antibiotics.
            Same-day results are issued for samples submitted before 12:00 noon.
          </p>
        </section>

        <hr className={styles.divider} />

        {/* ── Tech Stack ── */}
        <section>
          <h2 id="tech-stack" className={styles.sectionTitle}>Tech Stack</h2>
          <table className={styles.table}>
            <thead>
              <tr><th>Layer</th><th>Technology</th></tr>
            </thead>
            <tbody>
              {[
                ["Framework", "Next.js 16 (App Router)"],
                ["Language", "TypeScript 5"],
                ["UI", "React 19 + Tailwind CSS v4 + CSS Modules"],
                ["ORM", "Prisma 7 (prisma-client-js)"],
                ["Database", "PostgreSQL (via @prisma/adapter-pg)"],
                ["Auth", "Better Auth 1.4"],
                ["File Storage", "Vercel Blob (private + public buckets)"],
                ["Email", "Resend (no-reply@allergoexpressmed.com)"],
                ["PDF Generation", "pdf-lib + @pdf-lib/fontkit"],
                ["PDF Parsing", "unpdf"],
                ["Notifications", "Meta WhatsApp Business API (Graph API v22.0)"],
                ["Maps", "React-Leaflet / Leaflet.js"],
                ["i18n", "next-intl (EN / RU / KK)"],
                ["Forms", "React Hook Form + Zod v4"],
                ["Toast UI", "Sonner"],
                ["Deployment", "Vercel"],
                ["Fonts", "Geist Sans + Geist Mono (Google Fonts)"],
              ].map(([layer, tech]) => (
                <tr key={layer}><td>{layer}</td><td><code className={styles.inlineCode}>{tech}</code></td></tr>
              ))}
            </tbody>
          </table>
        </section>

        <hr className={styles.divider} />

        {/* ── Structure ── */}
        <section>
          <h2 id="structure" className={styles.sectionTitle}>Repository Structure</h2>
          <pre className={styles.codeBlock}>{`my-app/
├── prisma/
│   └── schema.prisma           # Database schema
├── src/
│   ├── app/                    # Next.js App Router pages & API routes
│   │   ├── api/                # All API route handlers
│   │   ├── admin/              # Admin dashboard pages & components
│   │   ├── owner/              # Owner dashboard pages & components
│   │   ├── account/            # Patient account page
│   │   ├── search/             # Public test result search
│   │   ├── orders/             # Test order flow
│   │   ├── contact/            # Branch map + contact info
│   │   ├── about/              # About the lab page
│   │   ├── team/               # Team page
│   │   ├── posts/              # Blog/news posts page
│   │   ├── login/ register/ reset/ forgot-password/
│   │   ├── verify-email/ email-verified/
│   │   ├── components/         # Shared UI (NavBar, NavAuth, etc.)
│   │   ├── layout.tsx          # Root layout (nav, footer, providers)
│   │   └── page.tsx            # Home page
│   ├── lib/
│   │   ├── auth.ts             # Better Auth server config
│   │   ├── auth-client.ts      # Better Auth browser client
│   │   ├── prisma.ts           # Prisma singleton
│   │   ├── email.ts            # Resend wrapper
│   │   ├── get-session.ts      # Server session helper
│   │   └── require-admin.ts    # Admin/Owner guard
│   ├── i18n/request.ts
│   └── messages/en.json        # English translation strings
├── public/fonts/               # Roboto-Regular.ttf, Roboto-Bold.ttf
├── vercel.json                 # Cron job config
├── next.config.ts
└── package.json`}</pre>
        </section>

        <hr className={styles.divider} />

        {/* ── Database ── */}
        <section>
          <h2 id="database" className={styles.sectionTitle}>Database Schema</h2>
          <p>Managed by Prisma. Database: PostgreSQL.</p>

          <h3 className={styles.subTitle}>User</h3>
          <p>The central identity model for both patients and staff.</p>
          <table className={styles.table}>
            <thead><tr><th>Field</th><th>Type</th><th>Notes</th></tr></thead>
            <tbody>
              {[
                ["id", "String (cuid)", "Primary key"],
                ["email", "String (unique)", "Indexed"],
                ["emailVerified", "Boolean", "Must be true to use the platform"],
                ["name", "String?", "Optional display name"],
                ["age", "Int?", "Optional"],
                ["isAdmin", "Boolean", "Legacy flag; prefer role"],
                ["role", "Role enum", "BASIC, ADMIN, or OWNER"],
                ["tests", "Test[]", "Tests assigned to this patient"],
                ["sessions", "Session[]", "Auth sessions"],
                ["accounts", "Account[]", "OAuth accounts (Better Auth)"],
              ].map(([f, t, n]) => (
                <tr key={f}><td><code className={styles.inlineCode}>{f}</code></td><td><code className={styles.inlineCode}>{t}</code></td><td>{n}</td></tr>
              ))}
            </tbody>
          </table>

          <h3 className={styles.subTitle}>Test</h3>
          <p>Represents a single lab test for a patient (registered or walk-in).</p>
          <table className={styles.table}>
            <thead><tr><th>Field</th><th>Type</th><th>Notes</th></tr></thead>
            <tbody>
              {[
                ["id", "String (cuid)", "Primary key"],
                ["testCode", "String? (unique)", "8-digit numeric code for public lookup"],
                ["name", "String", 'Test name (e.g., "Анализ")'],
                ["testedDay", "DateTime", "Date of testing"],
                ["dob", "String?", "Patient DOB — used to verify identity on public search"],
                ["status", "TestStatus enum", "UPCOMING, CURRENT, PAST"],
                ["location", "String?", "Branch name"],
                ["resultUrl", "String?", "Vercel Blob URL for uploaded PDF"],
                ["resultName", "String?", "Original filename of the PDF"],
                ["uploadedAt", "DateTime?", "When the result was uploaded (used for cron cleanup)"],
                ["walkinName", "String?", "Name for walk-in patients (no account required)"],
                ["patientId", "String?", "FK to User — null for walk-ins"],
              ].map(([f, t, n]) => (
                <tr key={f}><td><code className={styles.inlineCode}>{f}</code></td><td><code className={styles.inlineCode}>{t}</code></td><td>{n}</td></tr>
              ))}
            </tbody>
          </table>

          <h3 className={styles.subTitle}>Order</h3>
          <table className={styles.table}>
            <thead><tr><th>Field</th><th>Type</th><th>Notes</th></tr></thead>
            <tbody>
              {[
                ["id", "String (cuid)", "Primary key"],
                ["name", "String", "Patient name"],
                ["phone", "String", "Contact number"],
                ["branch", "String", "Selected branch"],
                ["listType", "String", "Type of test panel selected"],
                ["express", "Boolean", "Express processing flag"],
                ["total", "Int", "Total cost in KZT"],
                ["count", "Int", "Number of tests ordered"],
                ["pdfUrl", "String", "Publicly-accessible Vercel Blob URL for the order PDF"],
              ].map(([f, t, n]) => (
                <tr key={f}><td><code className={styles.inlineCode}>{f}</code></td><td><code className={styles.inlineCode}>{t}</code></td><td>{n}</td></tr>
              ))}
            </tbody>
          </table>

          <h3 className={styles.subTitle}>Enums</h3>
          <pre className={styles.codeBlock}>{`TestStatus: UPCOMING | CURRENT | PAST
Role:       BASIC | ADMIN | OWNER`}</pre>
        </section>

        <hr className={styles.divider} />

        {/* ── Auth ── */}
        <section>
          <h2 id="auth" className={styles.sectionTitle}>Auth & Authorization</h2>

          <p>
            Built with <strong>Better Auth</strong> using a Prisma PostgreSQL adapter.
          </p>

          <h3 className={styles.subTitle}>Auth Flow</h3>
          <ol className={styles.orderedList}>
            <li>User registers with email + password.</li>
            <li>A verification email is sent automatically on sign-up via Resend.</li>
            <li>User must verify email before accessing protected features.</li>
            <li>On verification, they are auto-signed in and redirected to <code className={styles.inlineCode}>/verified</code>.</li>
            <li>Password reset is handled via email link.</li>
          </ol>

          <h3 className={styles.subTitle}>Email Sending</h3>
          <p>All transactional emails go through <code className={styles.inlineCode}>src/lib/email.ts</code> using the Resend SDK.</p>
          <ul className={styles.list}>
            <li><strong>From:</strong> <code className={styles.inlineCode}>no-reply@allergoexpressmed.com</code></li>
            <li>Verification subject: <code className={styles.inlineCode}>"Verify your email / Подтвердить почту"</code></li>
            <li>Reset subject: <code className={styles.inlineCode}>"Reset your password"</code></li>
          </ul>

          <h3 className={styles.subTitle}>Role System</h3>
          <table className={styles.table}>
            <thead><tr><th>Role</th><th>Access</th></tr></thead>
            <tbody>
              <tr><td><code className={styles.inlineCode}>BASIC</code></td><td>Patient — can view their own tests and results</td></tr>
              <tr><td><code className={styles.inlineCode}>ADMIN</code></td><td>Lab staff — full test/patient management, result uploads</td></tr>
              <tr><td><code className={styles.inlineCode}>OWNER</code></td><td>Owner — all ADMIN rights + admin management, system stats</td></tr>
            </tbody>
          </table>
          <p>
            Server guard: <code className={styles.inlineCode}>src/lib/require-admin.ts</code> — returns <code className={styles.inlineCode}>{`{ ok: false }`}</code> if the current session user is not ADMIN or OWNER.
          </p>
        </section>

        <hr className={styles.divider} />

        {/* ── API Routes ── */}
        <section>
          <h2 id="api" className={styles.sectionTitle}>API Routes</h2>
          <p>All routes are under <code className={styles.inlineCode}>src/app/api/</code>. Most use <code className={styles.inlineCode}>export const runtime = "nodejs"</code>.</p>

          <h3 className={styles.subTitle}>Tests</h3>
          <table className={styles.table}>
            <thead><tr><th>Method</th><th>Path</th><th>Auth</th><th>Description</th></tr></thead>
            <tbody>
              {[
                ["POST", "/api/tests", "Admin", "Create a new test. Requires testCode (8 digits, unique), testedDay, and either patientId or walkinName."],
                ["GET", "/api/tests/[id]", "Admin", "Get single test by ID"],
                ["PATCH", "/api/tests/[id]", "Admin", "Update test name, location, or status"],
                ["DELETE", "/api/tests/[id]", "Admin", "Delete test"],
                ["GET", "/api/tests/[id]/status", "Patient (own)", "Get test status for the account page"],
              ].map(([m, p, a, d]) => (
                <tr key={p + m}><td><code className={styles.inlineCode}>{m}</code></td><td><code className={styles.inlineCode}>{p}</code></td><td>{a}</td><td>{d}</td></tr>
              ))}
            </tbody>
          </table>

          <h3 className={styles.subTitle}>Results (PDFs)</h3>
          <table className={styles.table}>
            <thead><tr><th>Method</th><th>Path</th><th>Auth</th><th>Description</th></tr></thead>
            <tbody>
              {[
                ["POST", "/api/tests/[id]/result", "Admin", "Upload PDF result to Vercel Blob (private). Max 10 MB."],
                ["GET", "/api/results/[id]", "Patient (own)", "Streams private Blob PDF. Enforces ownership check."],
                ["GET", "/api/tests/[id]/result/view", "Admin", "Admin view of the result PDF"],
              ].map(([m, p, a, d]) => (
                <tr key={p + m}><td><code className={styles.inlineCode}>{m}</code></td><td><code className={styles.inlineCode}>{p}</code></td><td>{a}</td><td>{d}</td></tr>
              ))}
            </tbody>
          </table>

          <h3 className={styles.subTitle}>Public Search</h3>
          <table className={styles.table}>
            <thead><tr><th>Method</th><th>Path</th><th>Auth</th><th>Description</th></tr></thead>
            <tbody>
              <tr><td><code className={styles.inlineCode}>GET</code></td><td><code className={styles.inlineCode}>/api/search?code=&dob=</code></td><td>None</td><td>Public test code lookup. Returns requiresDob: true if DOB is needed but not supplied.</td></tr>
            </tbody>
          </table>

          <h3 className={styles.subTitle}>Patients</h3>
          <table className={styles.table}>
            <thead><tr><th>Method</th><th>Path</th><th>Auth</th><th>Description</th></tr></thead>
            <tbody>
              {[
                ["GET", "/api/patients?q=", "Admin", "Search patients (by name/email). Returns up to 25."],
                ["POST", "/api/patients", "Admin", "Create a patient account manually."],
                ["GET", "/api/patients/[id]", "Admin", "Get a patient by ID"],
                ["PATCH", "/api/patients/[id]", "Admin", "Update patient info"],
                ["DELETE", "/api/patients/[id]", "Admin", "Delete patient"],
              ].map(([m, p, a, d]) => (
                <tr key={p + m}><td><code className={styles.inlineCode}>{m}</code></td><td><code className={styles.inlineCode}>{p}</code></td><td>{a}</td><td>{d}</td></tr>
              ))}
            </tbody>
          </table>

          <h3 className={styles.subTitle}>Orders</h3>
          <table className={styles.table}>
            <thead><tr><th>Method</th><th>Path</th><th>Auth</th><th>Description</th></tr></thead>
            <tbody>
              <tr><td><code className={styles.inlineCode}>POST</code></td><td><code className={styles.inlineCode}>/api/orders</code></td><td>None (public)</td><td>Creates a test order. Generates a PDF, uploads to Blob, saves to DB, sends WhatsApp notification.</td></tr>
            </tbody>
          </table>

          <h3 className={styles.subTitle}>Owner / Admin Management</h3>
          <table className={styles.table}>
            <thead><tr><th>Method</th><th>Path</th><th>Auth</th><th>Description</th></tr></thead>
            <tbody>
              {[
                ["GET", "/api/owner/admins", "Owner", "List all admins"],
                ["POST", "/api/owner/admins", "Owner", "Promote an existing user to ADMIN or OWNER by email"],
                ["PATCH", "/api/owner/admins/[id]", "Owner", "Change an admin's role"],
                ["DELETE", "/api/owner/admins/[id]", "Owner", "Demote/remove an admin"],
              ].map(([m, p, a, d]) => (
                <tr key={p + m}><td><code className={styles.inlineCode}>{m}</code></td><td><code className={styles.inlineCode}>{p}</code></td><td>{a}</td><td>{d}</td></tr>
              ))}
            </tbody>
          </table>

          <h3 className={styles.subTitle}>System</h3>
          <table className={styles.table}>
            <thead><tr><th>Method</th><th>Path</th><th>Auth</th><th>Description</th></tr></thead>
            <tbody>
              {[
                ["GET", "/api/health", "None", "Health check"],
                ["GET", "/api/cron/cleanup-results", "Cron secret", "Automated blob cleanup"],
                ["POST", "/api/parse-pdf", "—", "Parse a PDF using unpdf"],
                ["GET", "/api/check-verified", "—", "Check email verification status"],
                ["GET/POST", "/api/locale", "—", "Read/write locale cookie"],
                ["ANY", "/api/auth/[...all]", "—", "Better Auth catch-all handler"],
              ].map(([m, p, a, d]) => (
                <tr key={p + m}><td><code className={styles.inlineCode}>{m}</code></td><td><code className={styles.inlineCode}>{p}</code></td><td>{a}</td><td>{d}</td></tr>
              ))}
            </tbody>
          </table>
        </section>

        <hr className={styles.divider} />

        {/* ── Storage ── */}
        <section>
          <h2 id="storage" className={styles.sectionTitle}>File Storage & Cron</h2>

          <p>Two logical buckets are used in Vercel Blob:</p>
          <table className={styles.table}>
            <thead><tr><th>Use</th><th>Access</th><th>Env Token</th><th>Path Pattern</th></tr></thead>
            <tbody>
              <tr>
                <td>Test result PDFs</td>
                <td><span className={styles.badgePill}>Private</span></td>
                <td><code className={styles.inlineCode}>BLOB_READ_WRITE_TOKEN</code></td>
                <td><code className={styles.inlineCode}>tests/{"{testId}"}/{"{timestamp}"}_{"{filename}"}</code></td>
              </tr>
              <tr>
                <td>Order PDFs</td>
                <td><span className={`${styles.badgePill} ${styles.badgePillGreen}`}>Public</span></td>
                <td><code className={styles.inlineCode}>ORDER_BLOB_READ_WRITE_TOKEN</code></td>
                <td><code className={styles.inlineCode}>orders/{"{timestamp}"}_{"{patientName}"}.pdf</code></td>
              </tr>
            </tbody>
          </table>
          <ul className={styles.list}>
            <li>Private blobs are streamed server-side through <code className={styles.inlineCode}>/api/results/[id]</code> — the Blob URL is never exposed to the browser.</li>
            <li>Public order PDFs are sent directly via WhatsApp and accessible by URL.</li>
          </ul>

          <h3 className={styles.subTitle}>Cron Cleanup</h3>
          <p>
            Vercel cron runs <strong>daily at 02:00 UTC</strong> (<code className={styles.inlineCode}>"0 2 * * *"</code> in <code className={styles.inlineCode}>vercel.json</code>).
          </p>
          <p>
            <code className={styles.inlineCode}>GET /api/cron/cleanup-results</code> (authenticated via <code className={styles.inlineCode}>Authorization: Bearer {"{CRON_SECRET}"}</code>):
          </p>
          <ul className={styles.list}>
            <li>Finds all tests with <code className={styles.inlineCode}>uploadedAt</code> older than 30 days that still have a <code className={styles.inlineCode}>resultUrl</code>.</li>
            <li>Deletes the blob from Vercel storage.</li>
            <li>Clears <code className={styles.inlineCode}>resultUrl</code>, <code className={styles.inlineCode}>resultName</code>, and <code className={styles.inlineCode}>uploadedAt</code> on the test record.</li>
            <li>Returns <code className={styles.inlineCode}>{`{ deleted, failed, checkedAt }`}</code>.</li>
          </ul>
        </section>

        <hr className={styles.divider} />

        {/* ── Orders ── */}
        <section>
          <h2 id="orders" className={styles.sectionTitle}>Order Flow & PDF Generation</h2>
          <p>When a patient submits an order (<code className={styles.inlineCode}>POST /api/orders</code>):</p>
          <ol className={styles.orderedList}>
            <li>Input is validated and sanitized (smart quotes stripped, strings trimmed).</li>
            <li>A PDF is generated in-memory using <strong>pdf-lib</strong>:
              <ul className={styles.list} style={{ marginTop: "8px" }}>
                <li>A4 page (595 × 842 pt), 48 pt margins.</li>
                <li>Green header bar with lab name and date.</li>
                <li>Patient info block (name, phone, branch).</li>
                <li>Express badge if applicable.</li>
                <li>Itemized test table with alternating row shading.</li>
                <li>Total cost footer.</li>
                <li>Multi-page support via <code className={styles.inlineCode}>checkNewPage()</code>.</li>
                <li>Custom fonts: Roboto Regular + Bold loaded from <code className={styles.inlineCode}>public/fonts/</code>.</li>
              </ul>
            </li>
            <li>PDF is uploaded to Vercel Blob (public access) using <code className={styles.inlineCode}>ORDER_BLOB_READ_WRITE_TOKEN</code>.</li>
            <li>Order is saved to the <code className={styles.inlineCode}>Order</code> table in the database.</li>
            <li>A WhatsApp notification is sent to the lab number via Meta Graph API v22.0:
              <ul className={styles.list} style={{ marginTop: "8px" }}>
                <li>Step 1: Sends the <code className={styles.inlineCode}>hello_world</code> template (required for sandbox/business verification).</li>
                <li>Step 2: Sends the order PDF as a document with a caption summary.</li>
              </ul>
            </li>
          </ol>
        </section>

        <hr className={styles.divider} />

        {/* ── WhatsApp ── */}
        <section>
          <h2 id="whatsapp" className={styles.sectionTitle}>WhatsApp Integration</h2>
          <p>Uses the Meta WhatsApp Business API.</p>
          <h3 className={styles.subTitle}>Required Environment Variables</h3>
          <ul className={styles.list}>
            <li><code className={styles.inlineCode}>META_WHATSAPP_TOKEN</code> — Bearer token for Graph API</li>
            <li><code className={styles.inlineCode}>META_PHONE_NUMBER_ID</code> — The sending phone number's ID</li>
            <li><code className={styles.inlineCode}>LAB_WHATSAPP_NUMBER</code> — Lab's receiving WhatsApp number (international format)</li>
          </ul>
          <p>If any of these are missing, the WhatsApp send is silently skipped (warning logged).</p>
          <p>The Owner dashboard has a <strong>WhatsApp Settings</strong> tab to update the lab number via <code className={styles.inlineCode}>/api/owner/whatsapp</code>.</p>
        </section>

        <hr className={styles.divider} />

        {/* ── i18n ── */}
        <section>
          <h2 id="i18n" className={styles.sectionTitle}>Internationalization</h2>
          <p>Built with <strong>next-intl</strong>.</p>
          <ul className={styles.list}>
            <li>Locale is stored in a cookie: <code className={styles.inlineCode}>NEXT_LOCALE</code>.</li>
            <li>Default locale: <code className={styles.inlineCode}>en</code>.</li>
            <li>Supported locales: <code className={styles.inlineCode}>en</code>, <code className={styles.inlineCode}>ru</code>, <code className={styles.inlineCode}>kk</code> (English, Russian, Kazakh).</li>
            <li>Translation files live in <code className={styles.inlineCode}>src/messages/</code>.</li>
            <li>Server components use <code className={styles.inlineCode}>getTranslations()</code> from <code className={styles.inlineCode}>next-intl/server</code>; client components receive pre-fetched <code className={styles.inlineCode}>ui</code> props.</li>
            <li>The <code className={styles.inlineCode}>LanguageSelector</code> component in the navbar writes the locale cookie and reloads the page.</li>
          </ul>
        </section>

        <hr className={styles.divider} />

        {/* ── Dashboards ── */}
        <section>
          <h2 id="dashboards" className={styles.sectionTitle}>Dashboards</h2>

          <h3 className={styles.subTitle}>Admin Dashboard <code className={styles.inlineCode}>/admin</code></h3>
          <p>Accessible to users with <code className={styles.inlineCode}>role: ADMIN</code> or <code className={styles.inlineCode}>role: OWNER</code>.</p>
          <ul className={styles.list}>
            <li><strong>Tests</strong> (<code className={styles.inlineCode}>AdminTestsClient</code>) — Searchable/filterable table of all tests. Supports inline edit and delete with confirmation modals.</li>
            <li><strong>Upload</strong> (<code className={styles.inlineCode}>AdminUploadClient</code>) — Upload a PDF result to a specific test. Patient search with autocomplete, test code lookup, file input with drag-drop.</li>
          </ul>

          <h3 className={styles.subTitle}>Owner Dashboard <code className={styles.inlineCode}>/owner</code></h3>
          <p>Accessible to users with <code className={styles.inlineCode}>role: OWNER</code> only.</p>
          <ul className={styles.list}>
            <li><strong>Overview</strong> — Stats cards: total patients, tests, upcoming tests, orders, admins.</li>
            <li><strong>Patients</strong> — Expandable patient list with all their tests and result links.</li>
            <li><strong>Orders</strong> — Order history with search, express badge, PDF download.</li>
            <li><strong>Admins</strong> — Add/remove admins by email, change roles (ADMIN ↔ OWNER).</li>
            <li><strong>WhatsApp</strong> — Update the lab's receiving WhatsApp number.</li>
          </ul>
          <p>The sidebar adjusts its height dynamically as the page scrolls to stay visible above the footer.</p>
        </section>

        <hr className={styles.divider} />

        {/* ── Patient ── */}
        <section>
          <h2 id="patient" className={styles.sectionTitle}>Patient Features</h2>

          <h3 className={styles.subTitle}>Account Page <code className={styles.inlineCode}>/account</code></h3>
          <p>Shows the logged-in patient's tests grouped by status:</p>
          <ul className={styles.list}>
            <li><strong>Upcoming</strong> — Scheduled tests not yet started.</li>
            <li><strong>Current</strong> — Test currently in progress (awaiting results).</li>
            <li><strong>Past</strong> — Completed tests. Shows "View Results" button if a PDF has been uploaded.</li>
          </ul>
          <p>Patients can only view their own results. Results are fetched through <code className={styles.inlineCode}>/api/results/[id]</code> which enforces <code className={styles.inlineCode}>patientId === user.id</code>.</p>

          <h3 className={styles.subTitle}>Public Search <code className={styles.inlineCode}>/search</code></h3>
          <p>No login required. Patients enter their 8-digit test code. If the test has a <code className={styles.inlineCode}>dob</code> stored, the patient must also provide their date of birth to verify identity.</p>

          <h3 className={styles.subTitle}>Order Flow <code className={styles.inlineCode}>/orders</code></h3>
          <p>Public-facing order form. Patients select a branch location, test panel type, and optional express processing. On submit: generates and uploads an order PDF, saves to DB, and notifies the lab via WhatsApp.</p>
        </section>

        <hr className={styles.divider} />

        {/* ── Branches ── */}
        <section>
          <h2 id="branches" className={styles.sectionTitle}>Branch Network</h2>
          <p>
            16 branch locations in Almaty and surrounding area, defined in <code className={styles.inlineCode}>src/app/contact/branches.ts</code> as <code className={styles.inlineCode}>{`{ lat, lng, phone }`}</code> coordinates.
            Rendered on the contact page using <strong>React-Leaflet</strong>.
          </p>
          <p>All branches share the same phone: <strong>+7 707 566 8899</strong>. Notable locations include the main branch on Shagabutdinova 132 and branches in partner clinics (Tau Sunkar MC, New Med MC, Comfort Clinic, and others).</p>
        </section>

        <hr className={styles.divider} />

        {/* ── Env ── */}
        <section>
          <h2 id="env" className={styles.sectionTitle}>Environment Variables</h2>
          <table className={styles.table}>
            <thead><tr><th>Variable</th><th>Purpose</th></tr></thead>
            <tbody>
              {[
                ["DATABASE_URL", "PostgreSQL connection string"],
                ["BETTER_AUTH_URL", "Base URL for Better Auth (e.g., https://allergoexpressmed.com)"],
                ["BETTER_AUTH_SECRET", "Secret for Better Auth token signing"],
                ["RESEND_API_KEY", "Resend email API key"],
                ["BLOB_READ_WRITE_TOKEN", "Vercel Blob token for private result PDFs"],
                ["ORDER_BLOB_READ_WRITE_TOKEN", "Vercel Blob token for public order PDFs"],
                ["CRON_SECRET", "Secret for authenticating Vercel cron requests"],
                ["META_WHATSAPP_TOKEN", "Meta Graph API bearer token"],
                ["META_PHONE_NUMBER_ID", "WhatsApp Business sending phone ID"],
                ["LAB_WHATSAPP_NUMBER", "Lab's WhatsApp receiving number (e.g., +77075668899)"],
              ].map(([k, v]) => (
                <tr key={k}><td><code className={styles.inlineCode}>{k}</code></td><td>{v}</td></tr>
              ))}
            </tbody>
          </table>
        </section>

        <hr className={styles.divider} />

        {/* ── Deployment ── */}
        <section>
          <h2 id="deployment" className={styles.sectionTitle}>Deployment</h2>
          <p>Hosted on <strong>Vercel</strong>.</p>
          <ul className={styles.list}>
            <li><code className={styles.inlineCode}>next build</code> generates a standard Next.js build.</li>
            <li>All API routes run as serverless functions with <code className={styles.inlineCode}>runtime = "nodejs"</code>.</li>
            <li>Cron is configured in <code className={styles.inlineCode}>vercel.json</code> — Vercel invokes the cleanup endpoint on schedule.</li>
            <li>The Prisma client is generated to <code className={styles.inlineCode}>src/app/generated/prisma</code> and includes WASM edge-compatible builds alongside the standard Node.js client.</li>
            <li><code className={styles.inlineCode}>export const dynamic = "force-dynamic"</code> is set on the root layout to prevent static caching of session-dependent nav state.</li>
          </ul>
        </section>

        <hr className={styles.divider} />

        {/* ── Patterns ── */}
        <section>
          <h2 id="patterns" className={styles.sectionTitle}>Key Patterns</h2>
          <ul className={styles.list}>
            <li>
              <strong>Server Components by default.</strong> Client components are explicitly marked <code className={styles.inlineCode}>"use client"</code> and named with a <code className={styles.inlineCode}>Client</code> suffix (e.g., <code className={styles.inlineCode}>AdminTestsClient</code>, <code className={styles.inlineCode}>SearchClient</code>).
            </li>
            <li>
              <strong>UI props pattern.</strong> Server pages fetch translations and pass them as a <code className={styles.inlineCode}>ui</code> prop object to client components. This keeps all i18n logic server-side.
            </li>
            <li>
              <strong>Admin guard.</strong> All admin API routes call <code className={styles.inlineCode}>requireAdmin()</code> as the first thing — returns early with 401 if the session is missing or the user is BASIC.
            </li>
            <li>
              <strong>CSS Modules.</strong> All component styles use co-located <code className={styles.inlineCode}>.module.css</code> files. Global styles are minimal (<code className={styles.inlineCode}>globals.css</code>).
            </li>
            <li>
              <strong>Prisma select.</strong> Queries use explicit <code className={styles.inlineCode}>select</code> objects rather than returning full records to minimize data exposure.
            </li>
            <li>
              <strong>Error handling.</strong> API routes catch errors and return structured <code className={styles.inlineCode}>{`{ error, code, message }`}</code> JSON with appropriate HTTP status codes. Prisma error code <code className={styles.inlineCode}>P2025</code> (record not found) is handled explicitly.
            </li>
            <li>
              <strong>Input sanitization.</strong> The orders route strips Unicode smart quotes and dashes before embedding text in the generated PDF to prevent rendering artifacts.
            </li>
          </ul>
        </section>

        <div className={styles.footer}>
          <p>Last updated: June 2026 · AllergoExpress ImmunoLab internal documentation</p>
        </div>
      </main>
    </div>
  );
}
