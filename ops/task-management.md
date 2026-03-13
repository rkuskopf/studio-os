# Task Management — Tool Consolidation

Resolves the friction of using Google Tasks, Apple Reminders, Notes, and Google Drive as parallel, disconnected task systems.

---

## The Problem

Tasks are scattered across:
- **Google Tasks** — shows in Gmail sidebar, integrated with Google Calendar
- **Apple Reminders** — native iOS/macOS, Siri-compatible
- **Apple Notes** — quick capture, but becomes a graveyard of unsorted notes
- **Google Drive docs** — longer task lists and project notes living in Drive
- **TASKS.md** — the authoritative task board (this repo)
- **Asana** — client-facing project management

This creates duplication, missed tasks, and decision fatigue about where to put something.

---

## Recommended System (Minimum Friction)

### One capture point. One source of truth.

| Layer | Tool | Purpose |
|-------|------|---------|
| **Quick capture** | Apple Reminders (Siri / widget) | "Hey Siri, remind me to..." — frictionless capture in the moment |
| **Source of truth** | `TASKS.md` (this repo) | The actual task board — reviewed every Monday sprint planning |
| **Client projects** | Asana | Client-facing tasks, shared with clients if needed |
| **Reference / notes** | Google Drive | Long-form docs, briefs, proposals (not tasks) |

### The Flow

```plaintext
Idea / task appears
        ↓
Apple Reminders (quick capture, Siri or widget)
        ↓
Weekly migration (Monday sprint planning — 20 min)
  → Move from Reminders → TASKS.md
  → Archive completed items
  → Prioritise Up Next
        ↓
TASKS.md → GitHub Issues (automated via sync-tasks-to-github.js)
```

---

## What to Stop Using (and Why)

| Tool | Stop using for | Use instead |
|------|---------------|------------|
| **Google Tasks** | Task management | Reminders (better iOS integration) or TASKS.md |
| **Apple Notes as task lists** | Ongoing task lists | TASKS.md — notes become graveyards |
| **Google Drive docs as task lists** | Project tasks | `projects/` folder in this repo |
| **Asana for personal tasks** | Personal admin | `personal/README.md` |

**Keep Google Tasks for:** Calendar-integrated reminders where you want a task to appear on a specific calendar day. This is the one thing Google Tasks does better than alternatives.

---

## Migration Steps

1. **Clear Apple Notes task lists** — move any active tasks to TASKS.md or archive them
2. **Clear Google Tasks** — same: migrate active items or delete
3. **Set up Apple Reminders as default capture** — add widget to iPhone home screen
4. **Monday sprint ritual** — 20 min at start of sprint planning to migrate from Reminders → TASKS.md
5. **Stop adding tasks to Drive docs** — move project tasks to `projects/` folder

---

## Google Drive — Reference, Not Tasks

Google Drive is for:
- **Briefs and proposals** — client documents that need rich formatting
- **Finance** — SEA/DAVID folder, invoices, receipts
- **Design assets** — exported Figma frames, brand guidelines
- **Meeting notes** — if shared with clients

Google Drive is **not** for:
- Task lists (use TASKS.md)
- Project status tracking (use `projects/` folder)
- Reference that should live in this repo (use `ops/`, `people/` folders)

---

## Apple Notes — Capture, Then Sort

Apple Notes is fine for **temporary capture** — the shower thought, the idea in a meeting. But notes must be processed within 48 hours:

- **Is it a task?** → Add to Reminders, then TASKS.md on Monday
- **Is it reference?** → Move to the relevant markdown file in this repo
- **Is it a client note?** → Move to `projects/[client].md`
- **Is it personal?** → Move to `personal/README.md`
- **Is it none of these?** → Delete it.

---

## Calendar Integration

Google Calendar is the authoritative time schedule. Google Tasks can supplement it for time-specific task reminders.

**Recommended setup:**
- Keep the existing calendar structure (Sprint Planning, Deep Focus, Music Practice blocks)
- Use Google Tasks **only** for tasks with a specific due date that should appear on the calendar
- All other tasks live in TASKS.md without a calendar slot

---

## Summary

| When you want to... | Use |
|--------------------|-----|
| Capture a quick idea / task | Apple Reminders |
| Plan the week | `TASKS.md` (Monday sprint planning) |
| Track client project status | Asana |
| Store reference material | This repo (`ops/`, `projects/`, etc.) |
| Time-specific reminders | Google Tasks (calendar integration) |
| Long-form docs | Google Drive |
