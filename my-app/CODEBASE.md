# AllergoExpress ImmunoLab — Codebase Documentation

## Overview

**AllergoExpress ImmunoLab** is a medical laboratory portal for a specialized allergy diagnostics clinic based in Almaty, Kazakhstan. The platform enables patients to order allergy tests online, track their test status, and securely access PDF results. Staff manage tests, upload results, and oversee all activity through a role-gated admin dashboard.

The company operates **16 branch locations across Almaty** and specializes in ELISA-based testing for allergic reactions to local anesthetics and antibiotics. Same-day results are issued for samples submitted before 12:00 noon.

- **Production domain:** `allergoexpressmed.com`
- **Contact:** allergoexpressmed@gmail.com / +7 707 566 88 99

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Language | TypeScript 5 |
| UI | React 19 + Tailwind CSS v4 + CSS Modules |
| ORM | Prisma 7 (prisma-client-js) |
| Database | PostgreSQL (via `@prisma/adapter-pg`) |
| Auth | Better Auth 1.4 |
| File Storage | Vercel Blob (private + public buckets) |
| Email | Resend (`no-reply@allergoexpressmed.com`) |
| PDF Generation | pdf-lib + @pdf-lib/fontkit |
| PDF Parsing | unpdf |
| Notifications | Meta WhatsApp Business API (Graph API v22.0) |
| Maps | React-Leaflet / Leaflet.js |
| i18n | next-intl (EN / RU / KK) |
| Forms | React Hook Form + Zod v4 |
| Toast UI | Sonner |
| Deployment | Vercel |
| Fonts | Geist Sans + Geist Mono (Google Fonts) |

---

## Repository Structure

```
my-app/
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
│   │   ├── login/              # Auth pages
│   │   ├── register/
│   │   ├── reset/
│   │   ├── forgot-password/
│   │   ├── verify-email/
│   │   ├── email-verified/
│   │   ├── components/         # Shared UI components (NavBar, NavAuth, etc.)
│   │   ├── generated/prisma/   # Auto-generated Prisma client (do not edit)
│   │   ├── layout.tsx          # Root layout (nav, footer, providers)
│   │   ├── page.tsx            # Home page
│   │   └── globals.css
│   ├── lib/
│   │   ├── auth.ts             # Better Auth server config
│   │   ├── auth-client.ts      # Better Auth browser client
│   │   ├── prisma.ts           # Prisma singleton
│   │   ├── email.ts            # Resend wrapper
│   │   ├── get-session.ts      # Server session helper
│   │   └── require-admin.ts    # Admin/Owner guard
│   ├── i18n/
│   │   └── request.ts          # next-intl locale resolution
│   └── messages/
│       └── en.json             # English translation strings (base locale)
├── public/
│   └── fonts/                  # Roboto-Regular.ttf, Roboto-Bold.ttf (used in PDF gen)
├── vercel.json                 # Cron job config
├── next.config.ts
├── prisma.config.ts
└── package.json
```

---

## Database Schema

Managed by Prisma. Database: PostgreSQL.

### Models

#### `User`
The central identity model for both patients and staff.

| Field | Type | Notes |
|---|---|---|
| `id` | String (cuid) | Primary key |
| `email` | String (unique) | Indexed |
| `emailVerified` | Boolean | Must be true to use the platform |
| `name` | String? | Optional display name |
| `age` | Int? | Optional |
| `isAdmin` | Boolean | Legacy flag; prefer `role` |
| `role` | Role enum | `BASIC`, `ADMIN`, or `OWNER` |
| `tests` | Test[] | Tests assigned to this patient |
| `sessions` | Session[] | Auth sessions |
| `accounts` | Account[] | OAuth accounts (Better Auth) |

#### `Test`
Represents a single lab test for a patient (registered or walk-in).

| Field | Type | Notes |
|---|---|---|
| `id` | String (cuid) | Primary key |
| `testCode` | String? (unique) | 8-digit numeric code used for public lookup |
| `name` | String | Test name (e.g., "Анализ") |
| `testedDay` | DateTime | Date of testing |
| `dob` | String? | Patient date of birth — used to verify identity on public search |
| `status` | TestStatus enum | `UPCOMING`, `CURRENT`, `PAST` |
| `location` | String? | Branch name |
| `resultUrl` | String? | Vercel Blob URL for uploaded PDF |
| `resultName` | String? | Original filename of the PDF |
| `uploadedAt` | DateTime? | When the result was uploaded (used for cron cleanup) |
| `walkinName` | String? | Name for walk-in patients (no account required) |
| `patientId` | String? | FK to `User` — null for walk-ins |

#### `Order`
Stores submitted test orders from the public order flow.

| Field | Type | Notes |
|---|---|---|
| `id` | String (cuid) | Primary key |
| `name` | String | Patient name |
| `phone` | String | Contact number |
| `branch` | String | Selected branch |
| `listType` | String | Type of test panel selected |
| `express` | Boolean | Express processing flag |
| `total` | Int | Total cost in KZT |
| `count` | Int | Number of tests ordered |
| `pdfUrl` | String | Publicly-accessible Vercel Blob URL for the order PDF |

#### `Session`, `Account`, `Verification`
Managed automatically by Better Auth. Do not modify directly.

### Enums

```
TestStatus: UPCOMING | CURRENT | PAST
Role:       BASIC | ADMIN | OWNER
```

---

## Authentication & Authorization

### Provider
**Better Auth** (`better-auth`) with a Prisma PostgreSQL adapter.

### Auth Flow
1. User registers with email + password.
2. A verification email is sent automatically on sign-up via Resend.
3. User must verify email before accessing protected features.
4. On verification, they are auto-signed in and redirected to `/verified`.
5. Password reset is also handled via email link.

### Email Sending
All transactional emails go through `src/lib/email.ts` using the Resend SDK.
- **From:** `no-reply@allergoexpressmed.com`
- Verification email subject: `"Verify your email / Подтвердить почту"`
- Reset email subject: `"Reset your password / "`

### Role System
Three roles are defined:

| Role | Access |
|---|---|
| `BASIC` | Patient — can view their own tests and results |
| `ADMIN` | Lab staff — full test/patient management, result uploads |
| `OWNER` | Owner — all ADMIN rights + admin management, system stats |

**Server guard:** `src/lib/require-admin.ts` — returns `{ ok: false }` if the current session user is not ADMIN or OWNER. Used in all protected API routes.

**Trusted origin:** `https://www.allergoexpressmed.com`

---

## API Routes

All routes are under `src/app/api/`. Most use `export const runtime = "nodejs"`.

### Tests

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/api/tests` | Admin | Create a new test. Requires `testCode` (8 digits, unique), `testedDay`, and either `patientId` or `walkinName`. |
| GET | `/api/tests/[id]` | Admin | Get single test by ID |
| PATCH | `/api/tests/[id]` | Admin | Update test name, location, or status |
| DELETE | `/api/tests/[id]` | Admin | Delete test |
| GET | `/api/tests/[id]/status` | Patient (own) | Get test status for the account page |

### Results (PDFs)

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/api/tests/[id]/result` | Admin | Upload a PDF result to Vercel Blob (private). Max 10 MB. Stores `resultUrl`, `resultName`, `uploadedAt` on the test. |
| GET | `/api/results/[id]` | Patient (own) | Streams the private Vercel Blob PDF to the patient. Enforces ownership check — patients can only access their own results. |
| GET | `/api/tests/[id]/result/view` | Admin | Admin view of the result PDF |

### Public Search

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/api/search?code=&dob=` | None | Public test code lookup. Requires 8-digit code. If DOB is stored on the test, it must be provided and must match. Returns `requiresDob: true` if DOB is needed but not supplied. |
| GET | `/api/search/result` | None | (Secondary result endpoint) |

### Patients

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/api/patients?q=` | Admin | Search patients (by name/email). Returns up to 25. |
| POST | `/api/patients` | Admin | Create a patient account manually. |
| GET | `/api/patients/[id]` | Admin | Get a patient by ID |
| PATCH | `/api/patients/[id]` | Admin | Update patient info |
| DELETE | `/api/patients/[id]` | Admin | Delete patient |

### Orders

| Method | Path | Auth | Description |
|---|---|---|---|
| POST | `/api/orders` | None (public) | Creates a test order. Generates a formatted PDF using `pdf-lib` with Roboto fonts, uploads it to Vercel Blob (public bucket, `ORDER_BLOB_READ_WRITE_TOKEN`), saves to DB, and sends a WhatsApp notification to the lab. |

### Owner / Admin Management

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/api/owner/admins` | Owner | List all admins |
| POST | `/api/owner/admins` | Owner | Promote an existing user to ADMIN or OWNER by email |
| PATCH | `/api/owner/admins/[id]` | Owner | Change an admin's role |
| DELETE | `/api/owner/admins/[id]` | Owner | Demote/remove an admin |

### System

| Method | Path | Auth | Description |
|---|---|---|---|
| GET | `/api/health` | None | Health check |
| GET | `/api/cron/cleanup-results` | Cron secret | Automated blob cleanup (see Cron section) |
| POST | `/api/parse-pdf` | — | Parse a PDF using `unpdf` |
| GET | `/api/check-verified` | — | Check email verification status |
| GET/POST | `/api/locale` | — | Read/write locale cookie |
| ANY | `/api/auth/[...all]` | — | Better Auth catch-all handler |

---

## File Storage (Vercel Blob)

Two logical buckets are used:

| Use | Access | Env Token | Path Pattern |
|---|---|---|---|
| Test result PDFs | **Private** | Default `BLOB_READ_WRITE_TOKEN` | `tests/{testId}/{timestamp}_{filename}` |
| Order PDFs | **Public** | `ORDER_BLOB_READ_WRITE_TOKEN` | `orders/{timestamp}_{patientName}.pdf` |

- Private blobs are streamed server-side through the API route (`/api/results/[id]`) — the Blob URL is never exposed to the browser.
- Public order PDFs are sent directly via WhatsApp and accessible by URL.

### Cron Cleanup
Vercel cron runs **daily at 02:00 UTC** (`"0 2 * * *"` in `vercel.json`).

`GET /api/cron/cleanup-results` (authenticated via `Authorization: Bearer {CRON_SECRET}`):
- Finds all tests with `uploadedAt` older than 30 days that still have a `resultUrl`.
- Deletes the blob from Vercel storage.
- Clears `resultUrl`, `resultName`, and `uploadedAt` on the test record.
- Returns `{ deleted, failed, checkedAt }`.

---

## Order Flow & PDF Generation

When a patient submits an order (`POST /api/orders`):

1. Input is validated and sanitized (smart quotes stripped, strings trimmed).
2. A PDF is generated in-memory using **pdf-lib**:
   - A4 page (595 × 842 pt), 48 pt margins.
   - Green header bar with lab name and date.
   - Patient info block (name, phone, branch).
   - Express badge if applicable.
   - Itemized test table with alternating row shading.
   - Total cost footer.
   - Multi-page support via `checkNewPage()`.
   - Custom fonts: Roboto Regular + Bold loaded from `public/fonts/`.
3. PDF is uploaded to Vercel Blob (public access) using `ORDER_BLOB_READ_WRITE_TOKEN`.
4. Order is saved to the `Order` table in the database.
5. A WhatsApp notification is sent to the lab number via the **Meta Graph API v22.0**:
   - Step 1: Sends the `hello_world` template (required for sandbox/business verification).
   - Step 2: Sends the order PDF as a document with a caption summary.

---

## WhatsApp Integration

Uses the Meta WhatsApp Business API.

**Environment variables required:**
- `META_WHATSAPP_TOKEN` — Bearer token for Graph API
- `META_PHONE_NUMBER_ID` — The sending phone number's ID
- `LAB_WHATSAPP_NUMBER` — The lab's receiving WhatsApp number (international format)

If any of these are missing, the WhatsApp send is silently skipped (warning logged).

The Owner dashboard has a **WhatsApp Settings** tab to update the lab number via `/api/owner/whatsapp`.

---

## Internationalization (i18n)

Built with **next-intl**.

- Locale is stored in a cookie: `NEXT_LOCALE`.
- Default locale: `en`.
- Supported locales: `en`, `ru`, `kk` (English, Russian, Kazakh).
- Translation files live in `src/messages/`.
- All UI strings (nav, pages, admin panels, status labels) are driven from these files.
- The `LanguageSelector` component in the navbar writes the locale cookie and reloads the page.
- Server components use `getTranslations()` from `next-intl/server`; client components receive pre-fetched `ui` props.

---

## Dashboards

### Admin Dashboard (`/admin`)
Accessible to users with `role: ADMIN` or `role: OWNER`.

**Tabs:**
- **Tests** (`AdminTestsClient`) — Searchable/filterable table of all tests. Supports inline edit (name, branch, status) and delete with confirmation modals.
- **Upload** (`AdminUploadClient`) — Upload a PDF result to a specific test. Patient search with autocomplete, test code lookup, file input with drag-drop.

### Owner Dashboard (`/owner`)
Accessible to users with `role: OWNER` only.

**Tabs:**
- **Overview** — Stats cards: total patients, tests, upcoming tests, orders, admins.
- **Patients** — Expandable patient list with all their tests and result links.
- **Orders** — Order history with search, express badge, PDF download.
- **Admins** — Add/remove admins by email, change roles (ADMIN ↔ OWNER).
- **WhatsApp** — Update the lab's receiving WhatsApp number.

The sidebar adjusts its height dynamically as the page scrolls to stay visible above the footer.

---

## Patient-Facing Features

### Account Page (`/account`)
Shows the logged-in patient's tests grouped by status:
- **Upcoming** — Scheduled tests not yet started.
- **Current** — Test currently in progress (awaiting results).
- **Past** — Completed tests. Shows "View Results" button if a PDF has been uploaded.

Patients can only view their own results. Results are fetched through `/api/results/[id]` which enforces `patientId === user.id`.

### Public Search (`/search`)
No login required. Patients enter their 8-digit test code.
- If the test has a `dob` stored, the patient must also provide their date of birth to verify identity.
- Returns test name, date, status, branch, and result availability.

### Order Flow (`/orders`)
Public-facing order form. Patients select:
- Their name and phone number
- A branch location
- A test panel type (allergen list)
- Express option (faster turnaround)

On submit: generates and uploads an order PDF, saves to DB, and notifies the lab via WhatsApp.

---

## Branch Network

16 branch locations in Almaty and surrounding area, defined in `src/app/contact/branches.ts` as `{ lat, lng, phone }` coordinates. Rendered on the contact page using **React-Leaflet**. All branches share the same phone: `+7 707 566 8899`.

Notable locations include the main branch on Shagabutdinova 132 and branches in partner clinics (Tau Sunkar MC, New Med MC, Comfort Clinic, and others).

---

## Environment Variables

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string |
| `BETTER_AUTH_URL` | Base URL for Better Auth (e.g., `https://allergoexpressmed.com`) |
| `BETTER_AUTH_SECRET` | Secret for Better Auth token signing |
| `RESEND_API_KEY` | Resend email API key |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob token for private result PDFs |
| `ORDER_BLOB_READ_WRITE_TOKEN` | Vercel Blob token for public order PDFs |
| `CRON_SECRET` | Secret for authenticating Vercel cron requests |
| `META_WHATSAPP_TOKEN` | Meta Graph API bearer token |
| `META_PHONE_NUMBER_ID` | WhatsApp Business sending phone ID |
| `LAB_WHATSAPP_NUMBER` | Lab's WhatsApp receiving number (e.g., `+77075668899`) |

---

## Deployment

Hosted on **Vercel**.

- `next build` generates a standard Next.js build.
- All API routes run as serverless functions with `runtime = "nodejs"`.
- Cron is configured in `vercel.json` — Vercel invokes the cleanup endpoint on schedule.
- The Prisma client is generated to `src/app/generated/prisma` and includes WASM edge-compatible builds alongside the standard Node.js client.
- `export const dynamic = "force-dynamic"` is set on the root layout to prevent static caching of session-dependent nav state.

---

## Key Patterns & Conventions

- **Server Components by default.** Client components are explicitly marked `"use client"` and named with a `Client` suffix (e.g., `AdminTestsClient`, `SearchClient`).
- **UI props pattern.** Server pages fetch translations and pass them as a `ui` prop object to client components. This keeps all i18n logic server-side.
- **Admin guard.** All admin API routes call `requireAdmin()` as the first thing — returns early with 401 if the session is missing or the user is BASIC.
- **CSS Modules.** All component styles use co-located `.module.css` files. Global styles are minimal (`globals.css`).
- **Prisma select.** Queries use explicit `select` objects rather than returning full records to minimize data exposure.
- **Error handling.** API routes catch errors and return structured `{ error, code, message }` JSON with appropriate HTTP status codes. Prisma error code `P2025` (record not found) is handled explicitly in result upload.
- **Input sanitization.** The orders route strips Unicode smart quotes and dashes before embedding text in the generated PDF to prevent rendering artifacts.
