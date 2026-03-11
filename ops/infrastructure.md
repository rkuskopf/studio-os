# Infrastructure — GitHub Actions vs Projects vs Issues

A clear definition of how GitHub's tools are used in studio-os, and which tool is authoritative for each stream.

---

## The Three Streams

| Stream | Repo | Asana Project | Source of Truth |
|--------|------|---------------|----------------|
| **Business (KSPF)** | `rkuskopf/studio-os` | KSPF projects (CEO work, Lead Gen, kspf.au, etc.) | GitHub (`TASKS.md` + Issues) |
| **Music (Slowtides)** | `rkuskopf/north-star` *(not yet created)* | Slowtides Asana project *(to be created)* | GitHub (`north-star` repo) |
| **Personal** | `rkuskopf/studio-os` (personal/ folder) | Personal Admin Asana project | This repo (`personal/README.md`) |

---

## GitHub Tool Definitions

### GitHub Issues
**Use for:** Discrete, actionable work items that have a clear done state.

| Use | Don't use |
|-----|-----------|
| Bugs (e.g. kspf.au Safari scroll-lock) | Long-running strategic documents |
| Feature requests (e.g. add UX case studies section) | Reference material |
| Automations to build (e.g. sync TASKS.md → Issues) | Meeting notes |
| Client deliverables with a clear output | Ongoing backlog items without a due date |

**Labels in use:**
- `kspf.au` — Issues for the studio website repo
- `lead-gen` — Lead generation automation tasks
- `task` — General tasks synced from TASKS.md
- `music` — Slowtides / north-star tasks (when repo exists)
- `personal` — Personal admin tasks

### GitHub Projects
**Use for:** Kanban-style tracking of a group of issues across a workflow.

| When to use | Example |
|-------------|---------|
| Multi-step projects with stages | Alt Cosmetics delivery (Brief → Concepts → Presentation → Delivery) |
| Lead gen pipeline tracking | Lead → Audited → Contacted → Responded → Closed |
| Multi-issue features | kspf.au UX case studies section (multiple pages, each an issue) |

**Current Projects:**
- None active — create as needed for complex multi-issue work.
- Avoid creating a Project for every task. Only use when tracking status across stages matters.

### GitHub Actions
**Use for:** Automated workflows triggered by events (push, schedule, manual).

| Automation | Status | File |
|------------|--------|------|
| Sync TASKS.md → GitHub Issues | ✅ Set up | `tools/sync-tasks-to-github.js` |
| — | — | — |

**Potential future Actions:**
- Weekly reminder to update TASKS.md (cron job → opens draft issue)
- Auto-label issues based on keywords
- Notify on stale issues (no activity in 14 days)

> **Note:** GitHub Actions requires a workflow YAML file in `.github/workflows/`. For now, the sync script is run manually. A cron-based automation can be added later.

---

## Source of Truth — Confirmed

Where decisions live. If something is in two places, this table resolves the conflict.

| Area | Source of Truth | Secondary (read-only) |
|------|----------------|----------------------|
| **Active tasks** | `TASKS.md` | GitHub Issues (synced from TASKS.md) |
| **Client projects** | `projects/` folder | Asana (for client-facing task sharing) |
| **Studio context / memory** | `CLAUDE.md` | — |
| **Music projects** | `rkuskopf/north-star` repo | Asana Slowtides project |
| **Personal tasks** | `personal/README.md` | Google Tasks / Apple Reminders (see `task-management.md`) |
| **Finance** | Google Drive (SEA/DAVID folder) | — |
| **Lead pipeline** | `ops/lead-generation.md` | Spreadsheets (Google Sheets) |
| **Design files** | Figma + Google Drive | — |
| **Codebase (kspf.au)** | `rkuskopf/kspf.studio-repo` | — |

---

## Asana ↔ GitHub Sync Strategy

Asana is used for client-facing project management and daily task visibility. GitHub is the technical source of truth.

**Rule:** Tasks start in `TASKS.md`. Automation (`sync-tasks-to-github.js`) pushes them to GitHub Issues. Asana is updated manually for client-facing projects.

**The sync does NOT go Asana → GitHub.** Flow is:
```
TASKS.md → GitHub Issues (automated)
TASKS.md ← manually maintained
Asana ← manually updated for client-facing projects
```

**Future goal:** Explore if Asana tasks can be pulled into TASKS.md automatically via Asana API. Would close the loop.

---

## Figma Integration Strategy

Figma data (design concepts, components, frames) cannot be auto-synced in a meaningful way without paid API access or custom tooling. Current approach:

1. **Design concepts → GitHub Issues:** When a design direction needs feedback, export key frames as images and attach to a GitHub issue. Use issue comments for feedback threads.
2. **Figma → Google Slides:** For client presentations, export Figma frames to Slides. Link the Slides URL in the relevant project file (e.g. `projects/alt-cosmetics.md`).
3. **Design decisions → `projects/` file:** Document rationale and direction choices in the project markdown file, not in Figma comments.

> **Note:** Locking/unlocking Figma frames to control client access is not a native Figma feature. Use Figma's share settings (view-only link) to control visibility.
