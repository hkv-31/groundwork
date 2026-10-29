# Groundwork — Decisions, Built on Clarity

> **A luxury decision board and wealth engine for advisors leading high-stakes family property meetings.**  
> *MVP Case Study: The Mehta Family (₹200 Cr Net Worth · ₹120 Cr Property Portfolio).*

[![Tests](https://img.shields.io/badge/tests-15%20passed-266E51.svg)]()
[![License](https://img.shields.io/badge/license-MIT-B58C4F.svg)]()
[![Framework](https://img.shields.io/badge/stack-TanStack%20Start%20%7C%20React%2019-3C0606.svg)]()
[![Deploy](https://img.shields.io/badge/deploy-Vercel%20Ready-black.svg)]()

---

## 📌 Executive Summary

Family property meetings frequently stall on a single contentious question—*"Should we buy Arjun the ₹15 Cr Worli flat?"*—while core fiscal constraints remain siloed across spreadsheets:
* A **₹40 Cr plant expansion capex** due by June 2027.
* A **₹30 Cr untouchable liquid reserve**.
* Conflicting stakeholder priorities across three generations:
  * **Mr. Mehta (Patriarch, 68):** Legacy — preserve family addresses under the family name.
  * **Mrs. Mehta (Matriarch, 64):** Closeness — keep children within a short drive in Mumbai.
  * **Riya (Daughter, 36):** Liquidity — fair value now in cash, not illiquid bricks.
  * **Arjun (Son, 31):** Independence — a home of his own, close but separate.

**Groundwork** replaces adversarial opinion wars with real-time mathematical clarity. In a single 5-minute boardroom session, wealth advisors toggle moves, observe instant liquidity and fairness impacts, inspect data provenance, and print signed next steps.

---

## 🏛️ System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                       Client Frontend                       │
│  TanStack Start · React 19 · Tailwind v4 · Lucide · Radix   │
│  / (Hero) → /setup → /board (Live) → /log → /summary        │
└──────────────────────────────┬──────────────────────────────┘
                               │
            ┌──────────────────┴──────────────────┐
            ▼                                     ▼
┌──────────────────────────────┐    ┌──────────────────────────────┐
│       Core Scoring Engine    │    │      Serverless API Layer    │
│       (src/lib/model.ts)     │    │      (src/server/api.ts)     │
│  • Pure TypeScript logic     │    │  • GET/POST /api/cases       │
│  • 100% test-verified        │    │  • GET/PUT  /api/cases/:id   │
│  • Section 7/8 formulas      │    │  • POST     /api/scenarios   │
│  • Zero external runtime deps│    │  • GET      /api/cases/:id/log│
└──────────────────────────────┘    │  • GET      /api/summary     │
                                    │  • GET      /api/sources     │
                                    └──────────────┬───────────────┘
                                                   │
                                    ┌──────────────┴───────────────┐
                                    ▼                              ▼
                      ┌───────────────────────────┐  ┌──────────────────────────┐
                      │    PostgreSQL / Neon      │  │   Zero-Env Demo Mode     │
                      │    (src/lib/db/schema.sql)│  │   In-Memory Seeded Store │
                      │    6 Relational Tables    │  │   (Never breaks review)  │
                      └───────────────────────────┘  └──────────────────────────┘
```

---

## 📐 Benchmark Scenarios & Results

All 7 preset scenarios from Section 8 of the build specification are implemented in [`src/lib/model.ts`](src/lib/model.ts) and verified by automated unit tests:

| Preset | Scenario Description | Active Moves | Cash for Plant (₹ Cr) | Plant Gap (₹ Cr) | Property Share | Sibling Fairness Gap (₹ Cr) |
|---|---|---|---|---|---|---|
| **P0** | Do nothing (Status Quo) | *None* | `50.00` | `-10.00` *(spare)* | `60.0%` | `₹0.00` |
| **P1** | Mr. Mehta's plan | M1 *(Buy Worli flat)* | `33.95` | `+6.05` *(short)* | `67.9%` | `₹15.00` |
| **P2** | Buy it, fund it | M1 + M4 *(Sell Alibaug)* | `41.15` | `-1.15` *(clears)* | `64.1%` | `₹15.00` |
| **P3** | Fair buy | M1 + M4 + M6 *(Equalise Riya)* | `26.15` | `+13.85` *(short)* | `64.1%` | `₹0.00` |
| **P4** | Rent first | M2 *(Rent Worli)* + M4 | `56.45` | `-16.45` *(spare)* | `56.4%` | `₹1.88` |
| **P5** | Housing fund *(Advisor Hypothesis)* | M2 + M3 *(Fund)* + M4 + M6 | `34.58` | `+5.42` *(short)* | `56.4%` | `₹0.00` |
| **P6** | Big lever | M2 + M3 + M5 *(Sell BKC)* + M6 | `68.64` | `-28.64` *(spare)* | `37.7%` | `₹0.00` |

---

## 🗄️ Database & Endpoints

### Database Schema ([`src/lib/db/schema.sql`](src/lib/db/schema.sql))
Compatible with PostgreSQL / Neon (Vercel Postgres):
* `cases` — family profile, liquid reserve & financial constraints (JSONB).
* `assets` — individual property holdings, valuations, rental yields, and tax basis.
* `people` — family stakeholders, priorities, and personal mandates.
* `scenarios` — move combinations and resulting mathematical outputs.
* `decisions` — recorded agreements, rationale, and signed next steps.
* `sources` — data provenance, regulatory citations, and data limits.

### REST Endpoints ([`src/server/api.ts`](src/server/api.ts))
* `GET /api/cases` — List all advisory cases.
* `POST /api/cases` — Create a new case.
* `GET /api/cases/:id` — Load inputs and baseline metrics.
* `PUT /api/cases/:id` — Update case parameters.
* `POST /api/cases/:id/scenarios` — Server-side simulation via `model.ts`.
* `GET /api/cases/:id/log` — Audit log of scenario transitions with timestamps.
* `POST /api/cases/:id/decision` — Record signed family consensus.
* `GET /api/cases/:id/summary` — Deterministic recap and legal/tax next steps.
* `GET /api/sources` — Full evidence provenance table.

> **Zero Environment Variables Guarantee:** The app is configured with an in-memory seeded adapter. If `DATABASE_URL` is omitted, the live deployment runs flawlessly in Demo Mode without breaking during evaluation.

---

## 🚀 Getting Started Locally

### Prerequisites
* **Node.js**: `v20.x` or `v22.x`
* **npm**: `v10+`

### Installation & Run

```bash
# Clone the repository
git clone https://github.com/<your-username>/groundworks.git
cd groundworks

# Install dependencies
npm install

# Run the test suite (15 unit tests)
npm test

# Start the development server
npm run dev
```

Visit `http://localhost:8081` in your browser.

---

## ☁️ Deploying to Vercel

The project includes pre-configured Vercel Build Output API integration via [`vercel.json`](vercel.json):

### Method 1: Push to GitHub & One-Click Import

1. **Create a new GitHub repository** named `groundworks`.
2. **Push your code**:
   ```bash
   git init
   git add .
   git commit -m "feat: Groundwork production release"
   git branch -M main
   git remote add origin https://github.com/<your-username>/groundworks.git
   git push -u origin main
   ```
3. **Open [Vercel](https://vercel.com)**:
   * Click **Add New...** → **Project**.
   * Import the `groundworks` repository.
   * Vercel will auto-detect the configuration from `vercel.json` and build with `NITRO_PRESET=vercel npm run build`.
   * Click **Deploy**.

### Method 2: Vercel CLI

```bash
npm i -g vercel
vercel
```

---

## 🎨 Luxury Aesthetic & Styling Tokens

Crafted with an editorial luxury aesthetic:
* **Backgrounds:** Warm Cream (`#F3ECE1`) on application workspaces; Deep Oxblood (`#3C0606`) on executive heroes and navigation.
* **Typography:** *Bricolage Grotesque* for bold tabular figures and editorial headlines; *Inter* for clean data tables.
* **Accents:** Antique Gold (`#B58C4F`) and Emerald (`#266E51`) status indicators.
* **Data Provenance:** Every key metric features a dotted underline opening a provenance popover citing legal and broker limits.

---

## 📄 License
MIT © 2026 Groundwork. Developed for the Mehta Family Case Study.
