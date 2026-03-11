# Tasks

## Up Next
- [ ] **Set up Pinterest business account (studio@kspf.au) + claim kspf.au — see `ops/lead-generation.md` for steps**
- [ ] **Build target outreach list (10–15 ideal clients)**
- [ ] Audit ALT. Cosmetics to understand the halucinations and inconsistiencies (particularly in the creative brief). No one should have access to a creative brief below V5.1. We need to put together a quesitonaire to get to the bottom of all unknowns and create a report for what needs to be done
- [x] **Automate TASKS.md → GitHub Issues** — syncing tasks to GitHub Issues via `tools/sync-tasks-to-github.js`. Routes kspf.au tasks to `kspf.studio-repo` automatically.
- [x] **Gmail draft sync for lead pipeline** — add Gmail API integration to `full-pipeline.js` so drafted emails appear in Gmail drafts ready to review/send. ✅ Working!
- [ ] **Askable**
 - [ ] we need to create an askable page in this repo with details on this ongoing income stream. we need to optimise my language when I apply for jobs. we also need to create a workflow for when I receive the job sms, I can drop it in here and it gets services.
 - [ ] Scrape UX case study source material and generate portfolio presentation — see `projects/ux-portfolio.md`. This is to be displayed on my askable researcher profile

## Future — Lead Gen & Sales Automation
- [ ] **CRM dashboard for leads/clients** — central place to track lead status, client updates, project history. Options: Notion database, Airtable, or custom dashboard. Should integrate with pipeline outputs.
- [ ] **Branding lead scraper** — find businesses that need branding (not just web). Ideas: scrape social media for DIY branding signals, look for businesses with inconsistent visual identity, or new business registrations. Research Instagram/LinkedIn scraping feasibility.
- [ ] **UX audit pitch template** — deep-dive accessibility/UX audit workflow for pitch decks. Create Lighthouse++ report with screenshots, WCAG checklist, heuristic evaluation. Auto-generate PDF or Notion doc from audit data.
- [ ] **Pitch deck automation** — template system for different pitch types (web redesign, branding, UX audit). Pull in audit data, screenshots, and talking points automatically.

## In Progress

**kspf.au**
- [ ] **Mobile Safari bug — screen locks** — reported 11 Mar. Reproduce on iOS Safari, identify trigger (scroll lock? fixed position element? JS scroll handler not cleaning up?). Check for `overflow: hidden` on body/html or `-webkit-overflow-scrolling` issues. Log as GitHub issue in `rkuskopf/kspf.studio-repo`.

**IT / Admin**
- [ ] Get Wacom Intuos Pro (PTH-451) tablet pen working — driver installed but not responding. Tablet works as trackpad, pen not recognised. Likely macOS Privacy & Security approval issue. Need to confirm macOS version and try clean reinstall. See GitHub issue.
- [ ] Heaps of issues with logic... updated to logic 12 the other day and now logic files aren't working
- [ ] **Migrate files from Dropbox to iCloud before deletion deadline — see `tasks/dropbox-icloud-migration.md`**



- [x] **Fix lead scraping automation** — replaced broken Google/Maps scrapers with `/lead-finder` Claude slash command. See `tools/SCRAPING-TODO.md` and `SKILLS.md`.
- [ ] **Set up Google Workspace (GWS) skill** — install `@googleworkspace/cli` to give Claude direct access to Drive, Gmail, Calendar, Sheets. See `SKILLS.md` for instructions.


## Backlog

- [ ] **Scrape UX case study source material and generate portfolio presentation — see `projects/ux-portfolio.md`**
- [ ] **Document Alt Cosmetics progress for case study (capture before project wraps)**
- [ ] **Add UX case studies section to kspf.au**
- [ ] **Write AP-REPS retrospective case study**
- [ ] **Direct outreach — 5 contacts/week (start April)**
- [ ] **Check in with past clients post-Alt Cosmetics delivery**

## Waiting / Blocked


## Done
