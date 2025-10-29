# PLM OpenSource (Community Edition)

AI-assisted Product Lifecycle Management with gates across Product → Engineering → Platform.

This repo is the open, self-hostable core of the workflow engine we're building at Nuvio. It helps teams move from "incoming opportunity" to "ready for delivery" with clarity, approvals, and traceability.

---

## What it does

### 🔁 Standardized intake to delivery
- Capture an opportunity or request.
- Generate the initial epic/story structure (e.g. Jira-ready).
- Track status through Product, Engineering, and Platform.
- Enforce explicit handoffs / approvals so nothing gets thrown over the wall.

### 📄 AI Assist
- Drafts documents like PDD (Product Design Doc) and SDD (Solution Design Doc).
- Summarizes context so the next team doesn't have to start cold.
- Surfaces compliance flags (SOX / GxP style) so you don't forget critical checks.

### ♻ Reuse / Reference
- Lets Engineering look for similar past projects instead of reinventing.
- Lets Platform plan infra impact early (Do we need a new server / account / automation user?).

### 🧩 Why this is useful
Most orgs do this in slides, Notion pages, and random Jira tickets. Things get lost, compliance shows up late, and teams argue about "who owns what". This tool forces that process into something consistent and reviewable.

---

## Tech stack (high level)

- React / Next.js-style app, deployable on Vercel or locally
- Basic single-tenant local install
- Placeholder AI calls (no vendor keys committed here)

The commercial SaaS version (private) adds:
- Multi-tenant orgs / user management
- SSO / RBAC / audit trail
- Billing and usage limits
- Advanced analytics and compliance dashboards

Those are **not** in this repo.

---

## Getting started (local dev)

### 1. Clone

```bash
git clone https://github.com/arrocitosenpai/PLM-OpenSource-m5.git
cd PLM-OpenSource-m5
