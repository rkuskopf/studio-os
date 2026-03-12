# KSPF — Scaling Strategy

**Status:** Planning
**Created:** March 2026
**Source:** Research report (Rowan) + repo context

---

## The Goal

Scale KSPF from a solo studio rebuilding its client base into a consistently booked, higher-revenue operation — without burning out or losing quality. This is not about hiring a team tomorrow. It's about building the systems, visibility, and pipeline that let the studio punch above its weight.

---

## Where We're Starting From

- Solo operator (Rowan). Skills across brand strategy, UX, web, packaging.
- Currently 1 active client (Alt Cosmetics). Revenue is thin.
- Lead gen tools exist but aren't in motion yet.
- kspf.au is live but UX case studies section is unfinished.
- Pinterest not set up. Direct outreach not started.
- Automation tools built (scraper, email drafter, Asana ↔ GitHub sync) but underused.
- David Carnegie (Holmesglen SEA) is a business support resource — not being maximised.

---

## The Four Levers

Scaling a solo studio comes down to four things:

1. **Visibility** — People need to find you or hear about you
2. **Pipeline** — A steady flow of warm leads, not panic-hunting when a project ends
3. **Conversion** — Turning interest into signed work efficiently
4. **Capacity** — Delivering more without doing more hours

---

## Lever 1 — Visibility

### What's missing
- UX case studies aren't published → kspf.au doesn't show the full range of skills
- Pinterest doesn't exist yet → missing a compounding passive discovery channel
- Alt Cosmetics work isn't documented for case study use
- No consistent content output

### Actions
- [ ] Publish UX case studies section on kspf.au (current blocker: design + narrative)
- [ ] Finish and publish Alt Cosmetics case study when project wraps (~late March)
- [ ] Set up Pinterest business account (studio@kspf.au) and claim kspf.au
- [ ] Pin at least 5 portfolio pieces to start (Alt Cosmetics, AP-REPS, any concept work)
- [ ] Define a minimal content cadence — even 1 post/week is better than silence
- [ ] Add Concept Projects to kspf.au as a portfolio section

---

## Lever 2 — Pipeline

### What's missing
- No active outreach happening
- No CRM — leads live in spreadsheets and are not tracked properly
- The seed list in `lead-generation.md` has been built but not audited or actioned
- Warm lead (ESS BEE / Steph) is sitting idle

### Actions
- [ ] Action the fashion/art seed list — run through auditor, prioritise top 5 leads
- [ ] Build a target outreach list: 10–15 ideal clients (see `lead-generation.md` profile)
- [ ] Reach out to ESS BEE / Steph — close the warm lead
- [ ] Check in with past clients: AP-REPS, Bally Cara — referral and repeat potential
- [ ] Set up a lightweight CRM — even an Airtable base or upgraded tracking in `lead-generation.md`
- [ ] Activate referral channel: ask Anh to refer 1–2 contacts when Alt Cosmetics wraps
- [ ] Start direct outreach: 5 new contacts/week from April

---

## Lever 3 — Conversion

### What's missing
- No pitch deck or proposal template — every pitch is being reinvented
- No pricing structure documented — hard to say yes/no quickly
- No clear service packages — clients don't know what to buy

### Actions
- [ ] Define 3 core service packages with clear scope and price ranges:
  - **Brand Sprint** — strategy + identity, fixed scope, ~$4–6k
  - **Web Rebuild** — audit + redesign + build, ~$5–10k
  - **Brand + Web** — bundled, ~$8–15k
- [ ] Write a pitch deck template for each package (pull from audit data, screenshots)
- [ ] Write a one-page proposal template — scope, deliverables, timeline, price
- [ ] Add a "Work with us" page or section to kspf.au with clear entry points

---

## Lever 4 — Capacity

### What's missing
- No recurring income (everything is project-based)
- No retainer or ongoing offering
- Alt Cosmetics is taking all bandwidth — no bandwidth left for new biz dev
- Logic issues, Wacom tablet not working, Dropbox migration pending — admin debt draining time

### Actions
- [ ] Clear admin debt: Wacom pen, Logic 12 issues, Dropbox → iCloud migration
- [ ] Define a retainer offering: e.g. monthly brand support, content direction, or web maintenance
- [ ] Build proposal/brief templates to reduce project startup overhead
- [ ] Explore Askable as a recurring income stream during quiet project periods
- [ ] Schedule a dedicated CEO block each week (strategy, not delivery)

---

## Revenue Targets

| Stage | Monthly Revenue | How |
|-------|----------------|-----|
| **Now** | ~$0–2k | 1 client project (Alt Cosmetics) |
| **90 days** | $5–8k/mo | 2 active projects + pipeline flowing |
| **6 months** | $10–15k/mo | 3 projects or 2 projects + 1 retainer |
| **12 months** | $15–20k/mo | Consistent pipeline, mix of project + retainer |

---

## 90-Day Sprint (March–May 2026)

### March
- Deliver Alt Cosmetics identity (due ~20 Mar) ← most important thing right now
- Document Alt Cosmetics work as you go (case study capture)
- Set up Pinterest + pin first 5 pieces
- Action top 5 leads from seed list

### April
- Publish Alt Cosmetics case study
- Begin direct outreach: 5 contacts/week
- Check in with AP-REPS + Bally Cara
- Define service packages + write pitch template

### May
- Publish UX case studies on kspf.au
- Review pipeline: what's working, what's not
- First retainer conversation with a past or current client
- Assess revenue and adjust targets

---

## Repo / Systems Scaling

Beyond the business, the studio-os repo itself can be levelled up:

- [ ] **Askable workflow** — create `projects/askable.md`, optimise application language, build SMS-to-task flow for incoming jobs
- [ ] **CRM integration** — connect lead pipeline output to a tracked CRM (Airtable or custom dashboard)
- [ ] **Project templates** — add a `templates/` folder with brief templates, proposal templates, and case study capture frameworks
- [ ] **Weekly review automation** — improve sprint planning to auto-pull open tasks from GitHub Issues
- [ ] **Finance tracking** — replace MYOB with something lighter (Wave, FreshBooks, or a Google Sheet with formula tracking)
- [ ] **Google Workspace skill** — install `@googleworkspace/cli` for Claude access to Drive, Gmail, Calendar, Sheets (see `SKILLS.md`)

---

## Key Risks

| Risk | Mitigation |
|------|-----------|
| Alt Cosmetics overruns → no time for biz dev | Time-box delivery, use Deep Focus for biz dev too |
| Pipeline runs dry after Alt Cosmetics | Start outreach NOW, not after delivery |
| Pricing too low → can't scale on volume | Package and raise rates after next project |
| Admin debt (Logic, Wacom, Dropbox) draining focus | Schedule an admin block this week to clear it |
| Building tools instead of using them | Enforce "use what's built" before building more |

---

## Reference

- Research report: [Google Doc](https://docs.google.com/document/d/1OC5QkGrn4n-VRczZ0Dz6eQJ3QH6iAFTiWvrwQrZkUI0/edit?usp=drivesdk)
- Lead gen tools: `tools/` — `simple-pipeline.js`, `full-pipeline.js`
- Lead gen plan: `ops/lead-generation.md`
- Studio context: `ops/company.md`, `CLAUDE.md`
- Finance mentor: `people/david-carnegie.md`
