# KSPF Lead Generation Tools

Automated pipeline for finding and qualifying leads for KSPF studio.

## Quick Start

```bash
# Install dependencies
cd tools/website-auditor && npm install
cd ../brand-monitor && npm install

# Run a demo audit
cd ../website-auditor
node simple-pipeline.js --demo
```

## The Practical Workflow

**Reality check:** Google Maps and Instagram actively block automated scraping. The most reliable workflow is:

1. **Manually build a seed list** (10-20 mins)
2. **Automatically audit those sites** (runs in background)
3. **Review ranked leads** (5 mins)
4. **Personalised outreach** based on specific issues found

### Step 1: Build Your Seed List

Create a CSV file `my-leads.csv`:
```csv
url,name,category
https://www.example-salon.com.au,Example Salon,beauty
https://www.example-florist.com.au,Example Florist,florist
```

**Where to find URLs:**
- Google search: "fashion boutique melbourne" → copy URLs
- Instagram: browse #melbournebrand, click profiles, copy website links
- Yellow Pages / TrueLocal (browse, don't scrape)
- Ask ChatGPT: "List 20 Melbourne indie beauty brands with websites"
- Shopping centre websites (tenant lists)

### Step 2: Audit the Sites

```bash
cd tools/website-auditor
node simple-pipeline.js --input my-leads.csv
```

This runs Lighthouse audits and outputs `leads-ranked.csv` with:
- **Lead Score** (0-100) — higher = worse site = better lead
- Performance, Accessibility, Best Practices, SEO scores
- Assessment summary

### Step 3: Review & Outreach

Open the CSV, sort by leadScore. Top leads have the worst sites — real pain points you can solve.

Research each before outreach:
- Check their Instagram (follower count, activity)
- Read their About page
- Note specific issues from the audit

---

## Commands Reference

### Simple Pipeline (recommended)
```bash
node simple-pipeline.js --demo              # Test with sample businesses
node simple-pipeline.js --input urls.csv    # Audit your list
node simple-pipeline.js --input urls.csv --limit 10  # First 10 only
```

### Direct Auditor
```bash
node audit.js --input urls.csv --output results.csv
```

### Instagram Profile Extractor
If you have Instagram usernames, extract their website URLs:
```bash
cd ../brand-monitor
node extract-profiles.js --users "brand1,brand2,brand3"
# Outputs: websites-to-audit.csv
```

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

## Files

```
tools/
├── README.md
├── package.json
├── run.js                    # Master runner (maps/instagram commands)
├── website-auditor/
│   ├── simple-pipeline.js    # ⭐ Main tool — audit a list of URLs
│   ├── audit.js              # Core Lighthouse auditor
│   ├── scrape-maps.js        # Google Maps (often blocked)
│   ├── scrape-google.js      # Google Search (often blocked)
│   └── leads-ranked.csv      # Output
└── brand-monitor/
    ├── instagram.js          # Instagram hashtag scraper (fragile)
    ├── extract-profiles.js   # Profile → website extractor
    └── pipeline.js           # Combined pipeline
```
