# KSPF Lead Generation Tools

Automated pipeline for finding, auditing, and reaching out to leads for KSPF studio.

## Quick Start (Full Automation)

```bash
cd tools/website-auditor
npm install

# Run full pipeline: scrape → extract contacts → audit → draft emails
node full-pipeline.js --query "fashion brand melbourne" --limit 10
```

**Output files:**
- `pipeline-audited.csv` — leads ranked by opportunity, with contact info + email drafts
- `pipeline-emails.json` — ready-to-send email drafts

---

## What's Available

### 1. Full Pipeline (recommended) ⭐
Scrapes Google Maps, extracts contact info, audits each site, drafts personalised outreach emails.

```bash
# Fresh scrape + full pipeline
node full-pipeline.js --query "architect melbourne" --limit 15

# Use existing leads
node full-pipeline.js --input my-leads.csv
```

### 2. Google Maps Scraper (standalone)
Just scrape businesses without auditing:

```bash
node scrape-maps-v2.js --query "art gallery melbourne" --limit 20
# Output: maps-leads-v2.csv
```

### 3. Simple Pipeline (audit only)
Audit a list of URLs you already have:

```bash
node simple-pipeline.js --input urls.csv
# Output: leads-ranked.csv
```

### 4. Claude `/lead-finder` Command
In Claude Code, use the slash command for AI-assisted lead finding:
```
/lead-finder digital agencies melbourne
```

---

## The Workflow

1. **Run the pipeline** with your target niche
2. **Review `pipeline-audited.csv`** — sorted by lead score (worst sites = best opportunities)
3. **Copy email drafts** from the CSV or `pipeline-emails.json`
4. **Send outreach** — personalised with specific issues found

---

## Lead Score Explained

Weighted toward issues KSPF can solve:
- **Accessibility: 35%** — core KSPF strength
- **Performance: 30%** — obvious pain point
- **Best Practices: 20%** — outdated tech signals
- **SEO: 15%** — secondary

| Score | Priority | Meaning |
|-------|----------|---------|
| 40+ | 🔥 High | Serious issues — strong lead |
| 25-40 | ⚡ Medium | Some issues — worth reviewing |
| <25 | ✓ Low | Site is decent — lower priority |

---

## Sample Outreach Template

> Hi [Name],
>
> I came across [Business] while researching Melbourne [category] businesses. Your brand caught my eye — [specific positive observation].
>
> I noticed your website could use some attention, particularly around [specific issue from audit — e.g., "mobile loading speed" or "accessibility for screen readers"]. These are things that directly impact how customers find and experience your brand online.
>
> I run a small design studio focused on helping Melbourne brands like yours. Would you be open to a quick chat about what an update might look like?
>
> [Your name]

---

## Brand Monitor

**What it is:** Automated discovery pipeline for finding new/launching brands that might need KSPF's design services. Monitors Instagram hashtags to surface early-stage businesses, then feeds their websites into the audit pipeline.

**Location:** `tools/brand-monitor/`

```bash
cd tools/brand-monitor
npm install

# See the recommended workflow
node monitor.js

# Search Melbourne brand hashtags
node instagram.js --preset

# Search specific hashtags
node instagram.js --hashtags "melbournebrand,indiebeauty,newbrandlaunch"

# Look up a business on the Australian Business Register
node abr-check.js --name "Alt Cosmetics"
```

### Brand Monitor Scripts

| Script | What it does |
|--------|-------------|
| `monitor.js` | Prints the recommended step-by-step workflow |
| `instagram.js` | Scrapes Instagram hashtags to find new brand accounts |
| `extract-profiles.js` | Visits Instagram profiles to extract bios, websites, follower counts |
| `pipeline.js` | Chains scrape → extract → audit into one command |
| `abr-check.js` | Verifies businesses against the Australian Business Register |

### Brand Monitor Workflow

1. **Find brands** — `node instagram.js --preset` scrapes Melbourne brand hashtags
2. **Review manually** — check found accounts for early-stage signals (small following, "launching soon", website in bio)
3. **Audit websites** — run promising sites through `../website-auditor`
4. **Outreach** — contact top-scored leads with a personalised pitch

> ⚠️ **Note:** Instagram scraping is fragile and against TOS. Use sparingly, and expect it to break over time. For reliable lead finding, use the `/lead-finder` Claude command instead — see [Claude `/lead-finder` Command](#4-claude-lead-finder-command) above.

### Other Sources for New Brands

Since the ABR doesn't publish a new-registrations feed, you can also find new businesses via:
- Local press — search "new store melbourne" or "brand launch"
- Industry newsletters — Ragtrader, Beauty Directory AU
- Crowdfunding — Kickstarter, Pozible for launching products
- LinkedIn — "Founder" + "Melbourne" + recent job changes

---

## Task Management

### Sync TASKS.md → GitHub Issues

```bash
# Preview what would be created
node tools/sync/sync-tasks-to-github.js

# Create the issues
node tools/sync/sync-tasks-to-github.js --create
```

Routes tasks automatically:
- Tasks mentioning "kspf.au" → `rkuskopf/kspf.studio-repo`
- All others → `rkuskopf/studio-os`

Requires GitHub CLI: `brew install gh && gh auth login`

---

## Files

```
tools/
├── README.md
├── sync-tasks-to-github.js   # ⭐ Sync TASKS.md → GitHub Issues
├── package.json
├── run.js                    # Master runner (maps/instagram commands)
├── website-auditor/
│   ├── full-pipeline.js      # ⭐ Full pipeline — scrape → audit → email
│   ├── simple-pipeline.js    # Audit a list of URLs
│   ├── scrape-maps-v2.js     # Google Maps scraper (stealth)
│   ├── audit.js              # Core Lighthouse auditor
│   └── pipeline-audited.csv  # Output
└── brand-monitor/
    ├── README.md             # Full usage docs
    ├── monitor.js            # ⭐ Prints recommended workflow
    ├── instagram.js          # Instagram hashtag scraper (fragile)
    ├── extract-profiles.js   # Profile → website extractor
    ├── abr-check.js          # Australian Business Register lookup
    └── pipeline.js           # Combined pipeline
```
