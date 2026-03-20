# Tasks

## Up Next
- [ ] **Set up Pinterest business account (studio@kspf.au) + claim kspf.au — see `ops/lead-generation.md` for steps**
- [ ] **Build target outreach list (10–15 ideal clients)**
- [ ] Audit ALT. Cosmetics to understand the halucinations and inconsistiencies (particularly in the creative brief). No one should have access to a creative brief below V5.1. We need to put together a quesitonaire to get to the bottom of all unknowns and create a report for what needs to be done
- [x] **Automate TASKS.md → GitHub Issues** — syncing tasks to GitHub Issues via `tools/sync/sync-tasks-to-github.js`. Routes kspf.au tasks to `kspf.studio-repo` automatically.
- [x] **Gmail draft sync for lead pipeline** — add Gmail API integration to `full-pipeline.js` so drafted emails appear in Gmail drafts ready to review/send. ✅ Working!
- [x] **Asana ↔ GitHub two-way sync** — `tools/sync/sync-asana-github.js` syncs tasks/issues between Asana and GitHub. Features:
  - ✅ Bidirectional sync (Asana → GitHub, GitHub → Asana)
  - ✅ Label-based routing: GitHub issues with specific labels route to different Asana projects (via `tools/sync/label-routing.json` or `LABEL_ROUTING` env var)
  - ✅ Subtask support: `--subtasks` flag syncs Asana subtasks as GitHub issues
  - ✅ Cross-repo mirroring for kspf.au issues
  - ✅ GitHub Actions workflow: `.github/workflows/asana-sync.yml`
- [ ] **Askable**
 - [ ] we need to create an askable page in this repo with details on this ongoing income stream. we need to optimise my language when I apply for jobs. we also need to create a workflow for when I receive the job sms, I can drop it in here and it gets services.
 - [ ] Scrape UX case study source material and generate portfolio presentation — see `clients/ux-portfolio.md`. This is to be displayed on my askable researcher profile

## Future — Lead Gen & Sales Automation
- [ ] **CRM dashboard for leads/clients** — central place to track lead status, client updates, project history. Options: Notion database, Airtable, or custom dashboard. Should integrate with pipeline outputs.
- [ ] **Branding lead scraper** — find businesses that need branding (not just web). Ideas: scrape social media for DIY branding signals, look for businesses with inconsistent visual identity, or new business registrations. Research Instagram/LinkedIn scraping feasibility.
- [ ] **UX audit pitch template** — deep-dive accessibility/UX audit workflow for pitch decks. Create Lighthouse++ report with screenshots, WCAG checklist, heuristic evaluation. Auto-generate PDF or Notion doc from audit data.
- [ ] **Pitch deck automation** — template system for different pitch types (web redesign, branding, UX audit). Pull in audit data, screenshots, and talking points automatically.

## Future — Lead Finder Improvements
- [ ] **Duplicate detection across pipeline runs** — maintain a master leads list (all-time) and skip businesses we've already contacted. Add `contacted_date`, `response`, `status` fields. Prevents re-emailing the same leads.
- [ ] **Calendar/reminder integration** — after drafting outreach, auto-create follow-up reminders (e.g. "Follow up with X in 5 days"). Could use Google Calendar API or Apple Reminders.
- [ ] **Lead research enrichment** — before drafting emails, auto-research each business: recent news, founder names, social media presence, tech stack (BuiltWith). Make outreach more personalized.
- [ ] **Response tracking** — when a lead replies (or doesn't), update their status. Could use Gmail API to detect replies and auto-update the CRM/CSV.
- [ ] **A/B email templates** — test different outreach styles (direct/value-first vs. compliment/curiosity). Track open/response rates per template.
- [ ] **Industry-specific scrapers** — expand beyond Google Maps. Ideas: Yelp, Yellow Pages, industry directories (fashion weeks, design awards, startup lists). Each source = different lead quality.
- [ ] **Auto-prioritize by social signals** — rank leads higher if they have active Instagram, recent website updates, or press mentions. Signals = engaged business = more likely to respond.
- [ ] **Portfolio/case study auto-attach** — based on lead industry, auto-select relevant case studies to mention or attach. Fashion lead → ALT Cosmetics case study, etc.

## In Progress

**VCAT / Legal**
- [x] **VCAT overflow text** — Resolved by adding a continuation sheet. Final PDF: `VCAT_Application_Rowan_Kuskopf_v_Apple_FINAL.pdf` on Desktop (11 pages). Ready to print and submit.

**Mon — Website Build** *(~2 weeks, $750)*
- [x] **Kick-off meeting with Mon** — got brief, Figma file, logo, font. Awaiting video + domain.
- [ ] **Phase 1: Setup** — Framer project, breakpoints, font upload, colour vars, logo import
- [ ] **Phase 2: Components** — Nav/header, footer, test both breakpoints
- [ ] **Phase 3: Info page** — Desktop + mobile layout, links
- [ ] **Phase 4: Work page + CMS** — Project collection, template page, sidebar nav, dropdown (mobile)
- [ ] **Phase 5: Home page** — Video container (placeholder until Mon provides MP4)
- [ ] **Phase 6: Review 1** — Send preview link to Mon
- [ ] **Phase 7: Revisions** — Implement feedback (2 rounds included)
- [ ] **Phase 8: Launch** — Add video, connect domain, publish, send final invoice ($375)
- **Mon's to-dos:** Homepage video (MP4) + purchase domain (monstudios.com.au)

**ALT. Cosmetics**
- [ ] **Brand guidelines v2 (landscape format)** — new HTML file at `clients/alt-cosmetics/assets/brand-guidelines-v2.html`. Uses Aktiv Grotesk Extended. Removed unapproved tagline ("Beautiful because it works...") from all files and added to REJECTED in decision log. Next: add visual assets, integrate Figma exports, finalize typography/color specs.
- [ ] Audit ALT. Cosmetics to understand the hallucinations and inconsistencies (particularly in the creative brief). No one should have access to a creative brief below V5.1. We need to put together a questionnaire to get to the bottom of all unknowns and create a report for what needs to be done.

**kspf.au**
- [ ] **Mobile Safari bug — screen locks** — reported 11 Mar. Reproduce on iOS Safari, identify trigger (scroll lock? fixed position element? JS scroll handler not cleaning up?). Check for `overflow: hidden` on body/html or `-webkit-overflow-scrolling` issues. Log as GitHub issue in `rkuskopf/kspf.studio-repo`.

**IT / Admin**
- [ ] **Fix Google Drive MCP connection** — OAuth tokens exist in `claude_desktop_config.json` but no MCP server configured to use them. Previously worked — check if config was lost in a branch merge or reset. Need to add `mcpServers` section with google-drive server. Check git history for previous working config.
- [ ] Get Wacom Intuos Pro (PTH-451) tablet pen working — driver installed but not responding. Tablet works as trackpad, pen not recognised. Likely macOS Privacy & Security approval issue. Need to confirm macOS version and try clean reinstall. See GitHub issue.
- [ ] Heaps of issues with logic... updated to logic 12 the other day and now logic files aren't working
- [ ] **Migrate files from Dropbox to iCloud before deletion deadline — see `personal/dropbox-migration.md`**
- [ ] **Move studio-os repo out of iCloud** — git lock issues caused by iCloud sync. Move to `~/Developer/studio-os` and symlink or selectively sync only non-git files.

**Finance / Debt**
- [ ] **$1,000 owed to old landlord — due 04 April** — figure out how to get the money
- [x] **Pioneer Credit (Latitude) — request financial hardship** — Account #26020929. Dispute letter drafted and actioned. See `personal/latitude-pioneer-dispute.md`.
- [ ] **Probe Finance (Afterpay) — apply for hardship**



- [x] **Fix lead scraping automation** — replaced broken Google/Maps scrapers with `/lead-finder` Claude slash command. See `tools/SCRAPING-TODO.md` and `SKILLS.md`.
- [ ] **Set up Google Workspace (GWS) skill** — install `@googleworkspace/cli` to give Claude direct access to Drive, Gmail, Calendar, Sheets. See `SKILLS.md` for instructions.


## Backlog

- [ ] **humanising-ai-communication.md — complete repo integration** — File updated in `comms/`. Needs: proper GitHub issue created, linked to studio scaling strategy, development roadmap fleshed out. Add subjectivity/epistemic humility section.
- [ ] **Scrape UX case study source material and generate portfolio presentation — see `clients/ux-portfolio.md`**
- [ ] **Document Alt Cosmetics progress for case study (capture before project wraps)**
- [ ] **Add UX case studies section to kspf.au**
- [ ] **Write AP-REPS retrospective case study**
- [ ] **Direct outreach — 5 contacts/week (start April)**
- [ ] **Check in with past clients post-Alt Cosmetics delivery**

## Waiting / Blocked


## Done
