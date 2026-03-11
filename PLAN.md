# Studio-OS — Strategic Plan

**Last updated:** March 2026
**Owner:** Rowan Kuskopf

This is the master plan for turning the three-stream studio-os into a connected, low-friction operating system. It answers: **what needs to happen, in what order, and how does everything connect.**

---

## Architecture: How Everything Connects

This is the full picture of the system and the "connective tissue" between all tools.

```
┌─────────────────────────────────────────────────────────────────┐
│                         CAPTURE LAYER                           │
│  Apple Reminders (quick)  │  Asana (client/project)  │  Notes  │
└───────────────┬─────────────────────┬───────────────────────────┘
                │                     │
                ▼                     ▼
┌───────────────────────────────────────────────────────────────┐
│                    SOURCE OF TRUTH LAYER                      │
│                                                               │
│  TASKS.md (studio-os repo)          rkuskopf/north-star      │
│  └─ Stream 1: KSPF tasks            └─ Stream 2: Music       │
│  └─ Stream 3: Personal tasks                                  │
└───────────┬───────────────────────────────┬───────────────────┘
            │                               │
            ▼                               ▼
┌───────────────────────┐     ┌─────────────────────────────┐
│   GitHub Issues       │     │   north-star Issues         │
│   (studio-os repo)    │     │   (music tasks)             │
└───────────────────────┘     └─────────────────────────────┘
            │
            ▼
┌───────────────────────────────────────────────────────────────┐
│                    EXECUTION LAYER                            │
│                                                               │
│  Figma          Google Drive        Asana                    │
│  (design)       (briefs/assets)     (client-facing PM)       │
│      │               │                   │                   │
│      └───────────────┴───────────────────┘                   │
│                       │                                       │
│                  Google Calendar                              │
│                  (time + deadlines)                           │
└───────────────────────────────────────────────────────────────┘
            │
            ▼
┌───────────────────────────────────────────────────────────────┐
│                    AI LAYER (Claude)                          │
│  Reads: TASKS.md, CLAUDE.md, project files                   │
│  Writes: emails, plans, copy, code, automation scripts       │
│  Connects via: MCP servers (GitHub, Google Workspace)        │
└───────────────────────────────────────────────────────────────┘
```

---

## The Connections — How Each Tool Talks to Others

### Figma → Everything

Figma is a silo. It doesn't natively connect to GitHub or Asana in a useful way. Here is how to bridge it:

| From | To | How |
|------|----|-----|
| Figma frame / concept | GitHub Issue | Export PNG → attach to Issue. Use issue comments for feedback. |
| Figma frame / concept | Asana task | Export PNG → attach to Asana task as an image. |
| Figma → client presentation | Google Slides | Export frames → import into Slides. Link Slides URL in `projects/alt-cosmetics.md`. |
| Figma → developer handoff | Claude | Screenshot/export frame → paste into Claude with prompt from `ops/automation-map.md`. |

**Practical rule:** Figma is where design lives. GitHub/Asana is where decisions and feedback live. Export the key frame(s) and attach — don't try to sync Figma automatically.

---

### Asana → GitHub

Already partially set up. The full connection:

| Direction | Method | Status |
|-----------|--------|--------|
| TASKS.md → GitHub Issues | `tools/sync-tasks-to-github.js` | ✅ Working |
| Asana task → GitHub Issue | Asana's native GitHub integration (connect from Asana settings) | ⬜ To set up |
| GitHub Issue → Asana | Not needed — Asana is client-facing only | — |

**To connect Asana to GitHub:**
1. In Asana → Settings → Apps → GitHub
2. Connect your GitHub account
3. In a task, type `#` to link a GitHub issue
4. This creates a two-way reference (not a sync — just a link)

**For north-star:** Set up a separate Asana project for Slowtides, then connect it to `rkuskopf/north-star` via the same Asana GitHub integration. Each Asana project links to a different repo independently.

---

### Asana → Google Calendar

Asana's native Google Calendar sync:

1. In Asana → My Profile Settings → Calendar Sync
2. Enable "Sync tasks to Google Calendar"
3. Tasks with due dates appear as Calendar events automatically
4. **Filter:** Only sync tasks assigned to you (not whole team)

**Result:** Any Asana task with a due date shows up in Google Calendar. No manual copying.

---

### Google Drive → GitHub / Claude

Google Drive doesn't natively connect to GitHub. Options:

| Need | How |
|------|-----|
| Reference a Drive file from a GitHub Issue/task | Paste the Drive URL into the issue/task body |
| Pull Drive content into Claude | Use Google Workspace MCP (see SKILLS.md for install instructions) |
| Scrape Drive for "important content" | Once GWS MCP is installed: ask Claude "read my Drive folder X and summarise" |

**Priority action:** Install the Google Workspace MCP. This is the single unlock that lets Claude read/write Drive, Gmail, Calendar, and Sheets directly. See `SKILLS.md`.

---

### Google Tasks / Apple Reminders → TASKS.md

Covered in detail in `ops/task-management.md`. Short version:

- **Apple Reminders** = quick capture (voice, widget)
- **TASKS.md** = source of truth, reviewed every Monday
- **Google Tasks** = only for calendar-pinned reminders
- Migrate everything else into TASKS.md during Monday sprint planning

---

## Phase Plan — Next 3 Months

### Phase 1: Foundation (March 9–31, 2026) — Get the system working
*Goal: No more tasks falling through the cracks. One place to look.*

- [ ] **Connect Asana → Google Calendar** (15 min — Asana Settings → Calendar Sync)
- [ ] **Connect Asana → GitHub** (15 min — Asana Settings → GitHub integration → link studio-os repo)
- [ ] **Clear capture tools** — migrate Apple Notes / Google Tasks lists into TASKS.md
- [ ] **Set Apple Reminders as capture default** — add widget to iPhone home screen
- [ ] **Deliver Alt Cosmetics** — identity by Friday, March 13. Full delivery by March 20, 2026.
- [ ] **Install Google Workspace MCP** — unlocks Drive/Gmail/Calendar from Claude. See SKILLS.md.
- [ ] **Finish north-star migration** — push remaining content to `rkuskopf/north-star`

### Phase 2: Automate (April 2026) — Remove the manual steps
*Goal: Monday sprint planning takes 20 min, not 60. Outreach pipeline is running.*

- [ ] **Automate TASKS.md → GitHub Issues** via GitHub Actions cron (weekly). Currently manual.
- [ ] **Set up Slowtides Asana project** → connect to `rkuskopf/north-star` via Asana GitHub integration
- [ ] **Publish Alt Cosmetics case study** on kspf.au
- [ ] **Begin direct outreach** — 5 contacts/week using `tools/website-auditor/` pipeline
- [ ] **Set up Pinterest** — business account, claim kspf.au. Steps in `ops/lead-generation.md`.
- [ ] **Figma → GitHub Issue workflow** — export key frames → attach to Issues for feedback
- [ ] **Start Slowtides practice routine** — `music/practice-routine.md`. Week A: keys technique.

### Phase 3: Build (May 2026) — Compound the systems
*Goal: KSPF engine is running passively. Music is moving forward. Personal is stable.*

- [ ] **kspf.au UX case studies section** — design + narrative
- [ ] **Slowtides release plan** — first single target date, platform setup (Spotify, Bandcamp)
- [ ] **CRM for leads** — track lead status, outreach history, follow-ups
- [ ] **Askable certification** — complete + optimise profile language
- [ ] **Review all three streams** — what's working, what isn't, what to double down on

---

## What to Do This Week (March 9–14, 2026)

1. **Alt Cosmetics identity** — this is the only thing that matters until Friday, March 13
2. **Connect Asana → Google Calendar** (15 min) — do this before your next sprint planning
3. **Clear Apple Notes task lists** → migrate to TASKS.md

Everything else waits until Alt Cosmetics is delivered.

---

## Open Questions (to resolve)

| Question | Where to find the answer |
|----------|--------------------------|
| Should Slowtides have its own Asana *workspace* or just a *project*? | One workspace is fine — Asana projects in the same workspace can link to different GitHub repos. No need to separate workspaces. |
| How to control which Figma frames clients can see? | Use Figma share settings (view-only link). Create a separate "Client View" page in your Figma file with only approved frames. |
| Best way to scrape Notion / Drive for content? | Google Workspace MCP (once installed) handles Drive. For Notion: export pages as markdown and commit to this repo. |
| Is Claude the right tool or should I use something cheaper? | Claude via MCP is the most cost-effective approach for this stack. No additional tooling needed — the MCP servers are the connection layer. |
