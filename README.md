# AI Media — Backend (Node.js): Auth, AI Orchestration & Social Scheduling

<div align="center">
  <img src="assets/backend-hero.png" alt="AI Media Backend Banner" width="780">
</div>

<div align="center">
  <img src="https://img.shields.io/badge/Runtime-Node.js-339933">
  <img src="https://img.shields.io/badge/Auth-Supabase-3ECF8E">
  <img src="https://img.shields.io/badge/AI-OpenAI-6E56CF">
  <img src="https://img.shields.io/badge/AI-Grok-111111">
  <img src="https://img.shields.io/badge/License-MIT-blue">
</div>

> **TL;DR**  
> The **AI Media Backend** handles **user auth via Supabase**, **talks to multiple AI models** to generate content, and **schedules/publishes** AI media to connected social accounts (e.g., X).  
> It exposes an API for the Swift/SwiftUI client, runs **multi-step model chains** (OpenAI, Grok), persists results, and manages **publish workflows**.  
> Status is delivered via **snapshot endpoints** (polling/history)—no WebSockets.

---

## 🎬 Demo / Docs

- **Product Demo (Frontend):** _add your video link here_  
- **Client App (SwiftUI) Repo:** _add link if separate_  
- **This Backend:** you’re here

> The video should show: Supabase login → create AI job → review assets → schedule/publish → view history.

---

## 🧠 What This Backend Does

- **Supabase Auth:** Orchestrates OAuth sign-in (including X where applicable), issues client sessions, and enforces per-user access.
- **Model Orchestration:** Chains multiple AI models (e.g., **OpenAI** + **Grok**) to generate drafts, refine copy, create image prompts, and perform moderation.
- **Job Lifecycle:** Queues, runs, and persists job states (queued → running → done/failed) with reproducible metadata.
- **Asset Persistence:** Stores text/image outputs and links them to posts, drafts, and schedules.
- **Scheduling & Publish:** Manages “publish now” and scheduled posts to social networks using user-granted scopes.
- **Status Snapshots:** Clients fetch job/post status through **HTTP endpoints**; history is the single source of truth.

---

## 🏗️ Architecture (High-Level)

**Clients:** Swift/SwiftUI  
**Backend:** Node.js (REST API + Orchestrator)  
**Core Services:** **Supabase** (Auth, Postgres, Storage), **OpenAI**, **Grok (xAI)**  
**Transport:** REST over HTTPS (no WebSockets)  
**Patterns:** Background jobs, idempotent publish, **snapshot-based status** (polling/history)

### Major Components

- **Auth & Accounts**
  - Supabase OAuth handoff.
  - Stores provider tokens securely; scope-aware access.
  - Enforces per-user isolation (RLS at the DB layer).

- **AI Orchestrator**
  - Configurable **model chains** (Draft → Refine → Image Prompt → Moderation).
  - Multi-provider calls (OpenAI + Grok) with result reconciliation.
  - Deterministic snapshots of inputs/outputs for auditability.

- **Jobs & Storage**
  - Durable job records (state, inputs, outputs, metrics).
  - Media persisted to storage with signed URL access.
  - Reusable assets for future campaigns.

- **Publishing**
  - “Publish now” and scheduled publish.
  - Provider-specific handlers (e.g., X media upload + post).
  - Records publish events, outcomes, and permalinks (when available).

---

## 🔄 Core Flows (Simplified)

1. **Login:** Client initiates OAuth → backend finalizes via Supabase → user session established.  
2. **Create Job:** Client submits content brief (prompt, brand voice, targets) → job stored as **queued**.  
3. **AI Chain:** Orchestrator runs steps across **OpenAI** + **Grok** → produces text plus image prompts (and optional images) → moderation checks.  
4. **Results:** Assets are linked to a draft/schedule; job marked **done** or **failed**.  
5. **Schedule/Publish:** Client requests publish; backend uploads media, posts to network, and saves the outcome.  
6. **History & Status:** Client polls job/post endpoints to read **status snapshots** and full history.

---

## 🧩 API Surface (Conceptual)

- **Auth / Session**
  - Session retrieval and token refresh (Supabase-backed).

- **Jobs**
  - Create content job (inputs: prompt, targets, model chain).
  - Get job by id (state + snapshots).
  - List jobs (filters by state/date).

- **Assets & Posts**
  - Attach generated assets to a draft.
  - Convert draft → schedule (timezone aware).
  - Convert draft → publish now.

- **Publishing**
  - Retrieve publish outcome (status, error, permalink).
  - Retry failed publish (idempotent).

> Exact routes and payloads are documented in the internal API reference.

---

## 🗂 Data Model (Conceptual)

- **users** — Supabase user reference; profile and preferences.  
- **social_accounts** — provider, scopes, encrypted tokens, linkage to user.  
- **content_jobs** — state, model chain config, inputs, outputs, metrics, timestamps.  
- **assets** — text bodies, image URLs, metadata; linked to jobs and posts.  
- **posts** — draft body, media links, schedule metadata, publish status/outcome.  
- **publish_events** — per-network results and permalinks.  

> Enforce **RLS** so users can only access their own rows. Use **signed URLs** for media access.

---

## 🔐 Security & Privacy

- **Least Privilege:** Request minimal provider scopes (profile, media upload, create post).  
- **Token Security:** Provider tokens encrypted at rest; rotation and revocation supported.  
- **Moderation:** Checks before publish; safe-content policies enforced.  
- **Compliance-Ready:** Audit trail for job/publish events; export user data on request.  
- **Transport & At Rest:** TLS in transit; encryption for storage and database.

---

## 🛡️ Reliability & Ops

- **Idempotency:** Job creation and publish flows guard against duplicates.  
- **Retry/Backoff:** External API calls use exponential backoff with jitter.  
- **Observability:** Structured logs and metrics for model calls, latencies, and publish outcomes.

---

## 🔗 Integrations

- **Supabase:** OAuth/Auth, Postgres (with RLS), Storage (media, JSON artifacts).  
- **OpenAI:** Draft/refine copy, image prompts, moderation.  
- **Grok (xAI):** Alternative/complementary reasoning and reconciliation.  
- **Socials (e.g., X):** Media upload + post creation via user-granted scopes.

---

## 🧭 Client Expectations

- The Swift/SwiftUI app:
  - Initiates OAuth flows (completed by backend via Supabase).  
  - Creates jobs with prompts and target networks.  
  - **Polls status endpoints** and reads history (no WebSockets).  
  - Triggers schedule/publish and displays outcomes/permalinks.

---

## 🗺️ Roadmap

- Multi-network publishing beyond X (Instagram, LinkedIn).  
- Prompt/version library and brand kits.  
- Team workspaces, roles, and approval flows.  
- A/B testing and analytics on publish outcomes.  
- Advanced moderation and policy packs per industry.

---

## 🔗 Links

- **Frontend (Swift/SwiftUI):** _add link here_  
- **Demo Video:** _add link here_

---

## 📄 License

MIT © You
