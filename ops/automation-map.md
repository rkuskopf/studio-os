# Automation Map

A map of all automation triggers, AI prompt patterns, and the Asana→GitHub sync setup for the studio-os ecosystem.

---

## Automation Inventory

| Automation | Trigger | What it does | Status | Location |
|------------|---------|--------------|--------|----------|
| TASKS.md → GitHub Issues | Manual (run script) | Syncs unchecked tasks from `TASKS.md` to GitHub Issues | ✅ Working | `tools/sync-tasks-to-github.js` |
| Lead finding | `/lead-finder` slash command | Web search for Melbourne businesses, deduplicates against existing sheets | ✅ Working | `.claude/commands/lead-finder.md` |
| Website auditing | `node simple-pipeline.js` | Lighthouse audit + lead scoring + Gmail draft | ✅ Working | `tools/website-auditor/` |
| Gmail draft sync | `full-pipeline.js` Step 5 | Creates draft emails in Gmail ready to review | ✅ Working | `tools/website-auditor/full-pipeline.js` |
| Sprint planning | `/sprint-plan` slash command | Weekly plan from TASKS.md + client files | ✅ Working | `.claude/commands/sprint-plan.md` |
| Google Workspace | — | Read/write Drive, Gmail, Calendar, Sheets | ❌ Not set up | Install `@googleworkspace/cli` |

---

## Asana → GitHub Sync — Trigger Map

When to run the sync and what it creates:

| Trigger | Action | GitHub output |
|---------|--------|---------------|
| New task added to TASKS.md | Run `tools/sync-tasks-to-github.js` | New Issue in `rkuskopf/studio-os` |
| kspf.au task added | Same — script detects `kspf.au` context | New Issue in `rkuskopf/kspf.studio-repo` |
| Task completed in TASKS.md | Mark `- [x]` in TASKS.md | Script skips completed tasks (closed manually in Issues) |

**To run manually:**
```bash
cd tools && node sync-tasks-to-github.js
```

**Future:** Automate via GitHub Actions cron (weekly) or session-start hook.

---

## AI Prompt Chart

A reference guide for getting consistent, high-quality output from AI (Claude) across common KSPF tasks. Use these patterns to reduce iteration time.

### Design Concepts

**For generating presentation copy:**
```
You are a senior brand strategist writing for KSPF, a Melbourne creative studio.
Client: [Client name]. Project: [Project type].
Tone: [refer to brand positioning — e.g. "quiet luxury", "direct, confident"].
Task: Write [specific output] in [format].
Keep it concise. No filler. Studio voice = decisive, considered, not verbose.
```

**For creative brief review:**
```
Review this creative brief for [Project]. Flag: (1) any unclear scope, (2) missing decisions, (3) assumptions that need client confirmation. Output as a numbered list.
[Paste brief]
```

### Lead Generation

**For personalised outreach emails:**
```
Write a short, direct outreach email from KSPF (kspf.au) to [Business name].
Their website issue: [specific finding from audit — e.g. "mobile navigation breaks on iPhone", "no accessible alt text on product images"].
Tone: professional, specific, not salesy. Lead with the problem, offer help, one clear CTA.
Keep it under 150 words.
```

**For lead research:**
```
Research [Business name] ([URL]). Tell me: (1) what they do, (2) who their likely audience is, (3) one thing about their brand or site that suggests they'd care about design quality. Keep it brief — this is for personalising an outreach email.
```

### Client Communication

**For project updates:**
```
Write a brief project update email for [Client name] re: [Project].
Progress this week: [what happened].
Next steps: [what's coming].
Tone: warm but professional, like a trusted advisor. No corporate filler.
```

**For feedback requests:**
```
Write a short message to [Client name] asking for feedback on [Deliverable].
Context: [what they're reviewing, what decision is needed].
Make it easy for them to respond — give them a clear question, not an open canvas.
```

### Planning

**For sprint planning:**
→ Use `/sprint-plan` slash command. It reads TASKS.md + client files automatically.

**For strategy thinking:**
```
I'm working on [problem/decision]. Here's what I know: [context].
Help me think through: (1) the key variables, (2) the trade-offs, (3) a recommended next action.
Be direct. I don't need a long preamble.
```

---

## Google Drive → Script Pipeline (Proposed)

A planned automation to scrape important content from Google Drive and generate structured outputs.

**Concept:**
1. Use Google Workspace MCP (once installed) to read Drive files
2. Extract key content (briefs, proposals, meeting notes)
3. Feed into Claude prompt → generate: scripts, presentation outlines, plans

**Status:** Not implemented. Requires Google Workspace MCP setup first.
**Prerequisite:** `npm install -g @googleworkspace/cli && gws mcp -s drive,gmail,calendar,sheets`

---

## Design-to-Development Transition Automation

A cost-effective alternative to high-cost tools like Zeplin or Supernova for design-to-dev handoff.

**Current approach (manual):**
1. Figma → export assets (SVG, PNG, component specs)
2. Document specs in project markdown file
3. Reference in GitHub Issues for development tasks

**Proposed automation (using Claude):**
1. Screenshot or export Figma frames
2. Paste into Claude with prompt: "Convert this design to clean HTML/CSS. Match the layout exactly. Use semantic HTML. CSS variables for colours and type."
3. Review and integrate output into codebase

**Cost:** $0 additional — uses existing Claude subscription.
**Quality note:** Works well for static layouts, less reliable for complex interactive states. Always review output before committing.
