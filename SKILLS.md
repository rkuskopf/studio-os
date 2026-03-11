# KSPF — Claude Agent Skills

A guide to what Claude skills and slash commands are available in this repo, which ones to add, and how they help KSPF workflows.

---

## Already Installed (Slash Commands)

These are custom slash commands in `.claude/commands/`. Invoke them in any Claude Code session in this repo.

| Command | What it does |
|---------|-------------|
| `/sprint-plan` | Monday sprint planning — reads TASKS.md + client files, produces a weekly plan |
| `/weekly-review` | End-of-week review — summarises what shipped vs what was planned |
| `/client-update` | Drafts a client progress email in KSPF tone |
| `/finance-prep` | Walks through David Carnegie's 6 finance metrics before a Webex check-in |
| `/new-project` | Sets up a new project file + adds tasks + updates CLAUDE.md |
| `/lead-finder` | **New** — Uses web search to find Melbourne business leads, deduplicates against two existing lead sheets (replaces broken Google scraper) |

---

## Recommended Skills to Add

These are third-party Claude Code skills from the wider ecosystem. Install them once and they're available in every session.

### 1. Google Workspace (GWS) — Priority: High

**Why it matters for KSPF:** The Google Drive automations that were attempted previously (syncing week plans, reading Drive files) didn't work because Claude didn't have direct API access to Google. This skill fixes that.

**What it unlocks:**
- Read/update Google Sheets directly (client trackers, finance metrics)
- Draft and send Gmail from `studio@kspf.au`
- Create Calendar events from task notes
- Read/update Google Docs (briefs, proposals)
- Check Drive for recently modified files without manual browsing

**Install:**
```bash
npm install -g @googleworkspace/cli
gws mcp -s drive,gmail,calendar,sheets,docs
```

**In Claude:** Once the MCP server is running, Claude can call Drive/Gmail/Sheets APIs directly in conversation.

---

### 2. Browser Use — Priority: Medium

**Why it matters for KSPF:** The Google Maps and Yellow Pages scrapers are broken because they use static Puppeteer selectors that go stale. Browser Use gives Claude a real browser that navigates like a human — no selector maintenance needed.

**What it unlocks:**
- Scrape business listings from Google Maps, Yellow Pages, TrueLocal without selectors
- Check that a client's staged website works end-to-end before delivery
- Extract Instagram bio links for lead gen (fragile with static tools)
- Verify deployed kspf.au changes actually render correctly

**Install:**
```bash
npx skills add browser-use/claude-skill
```

**Invoke in Claude:** Describe what you want to browse and Claude navigates it.

---

### 3. Frontend Design — Priority: Medium

**Why it matters for KSPF:** When using Claude to generate UI components for kspf.au or client sites, the default output is generic (Inter font, purple gradient, grid cards). This skill breaks that pattern.

**What it unlocks:**
- Bold, distinctive typography choices
- Purposeful colour palettes instead of safe defaults
- Animations that feel intentional
- Components that look like a senior designer reviewed them

**Install:**
```bash
npx skills add anthropics/claude-code-skill frontend-design
```

**Invoke in Claude:** `/frontend-design` then describe what you want to build.

---

### 4. Code Reviewer (Simplify) — Priority: Low–Medium

**Why it matters for KSPF:** When Claude writes scripts (like the lead gen tools), they sometimes accumulate technical debt. This skill runs a review pass before presenting code.

**What it unlocks:**
- Catches duplicated logic before it's committed
- Flags functions doing too much
- Suggests utility extractions
- Runs automatically after any implementation

**Install:**
```bash
npx skills add anthropics/claude-code-skill simplify
```

**Configure in CLAUDE.md:** Add a `## Code Review Standards` section to auto-trigger it.

---

### 5. Excalidraw Diagram Generator — Priority: Low

**Why it matters for KSPF:** Useful for architecture diagrams when building client proposals or documenting the studio-os repo structure visually.

**Install:**
```bash
npx skills add https://github.com/coleam00/excalidraw-diagram-skill --skill excalidraw-diagram
```

---

## Skills NOT Recommended for KSPF (right now)

| Skill | Why skip |
|-------|----------|
| **Remotion** | Video production — not in current KSPF workflow |
| **PlanetScale** | Database tooling — no database in KSPF stack |
| **Shannon (pentesting)** | Security testing — no production app to test |
| **Valyu** | Specialised research data (SEC filings, PubMed) — not relevant |
| **Antigravity Awesome Skills** | 1,234 skills is overkill for a solo studio. Use targeted skills instead. |

---

## Current Automation Status

| Workflow | Status | How |
|----------|--------|-----|
| Sprint planning | ✅ Working | `/sprint-plan` slash command |
| Weekly review | ✅ Working | `/weekly-review` slash command |
| Client update emails | ✅ Working | `/client-update` slash command |
| Finance prep | ✅ Working | `/finance-prep` slash command |
| New project setup | ✅ Working | `/new-project` slash command |
| Lead finding | ✅ Working | `/lead-finder` slash command (web search) |
| Website auditing | ✅ Working | `tools/website-auditor/simple-pipeline.js` |
| Google Drive integration | ❌ Not set up | Install GWS skill (see above) |
| Google Maps scraping | ❌ Broken | Use `/lead-finder` instead |
| Google Search scraping | ❌ Broken | Use `/lead-finder` instead |
| Gmail draft sync | ✅ Working | `full-pipeline.js` Step 5 — see `gmail-draft.js --setup` |
| TASKS.md → GitHub Issues | ❌ Not set up | See below |

---

## TASKS.md → GitHub Issues Sync

One task that keeps appearing: auto-syncing TASKS.md to GitHub Issues.

**Simplest approach (no extra tools):**
Use the existing `gh` CLI in a session-start hook or manual command:

```bash
# Extract unchecked tasks and create GitHub issues
grep "^- \[ \]" TASKS.md | while read -r task; do
  title="${task#- [ ] }"
  gh issue create --title "$title" --label "task" --repo rkuskopf/studio-os
done
```

**Better approach:** Add a `/sync-tasks` slash command that reads TASKS.md and uses the GitHub MCP to create/update issues. This is a good candidate for a future slash command.

---

## Installing Skills: Quick Reference

```bash
# Google Workspace (recommended first)
npm install -g @googleworkspace/cli
gws mcp -s drive,gmail,calendar,sheets

# Browser Use
npx skills add browser-use/claude-skill

# Frontend Design
npx skills add anthropics/claude-code-skill frontend-design

# Code Reviewer
npx skills add anthropics/claude-code-skill simplify
```

Skills are installed globally and available in all Claude Code sessions once the MCP server is running.
