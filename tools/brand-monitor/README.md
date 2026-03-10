# KSPF Brand Monitor

Automated tools for discovering new brands and early-stage businesses that might need design/web services.

## Tools

### 1. Instagram Hashtag Monitor (`instagram.js`)

Scrapes Instagram hashtags to find new/launching brands.

```bash
cd tools/brand-monitor
npm install

# Search default hashtags (Melbourne fashion/beauty)
node instagram.js

# Search specific hashtag
node instagram.js --hashtag melbournebrand

# Search multiple hashtags
node instagram.js --hashtags "indiebeauty,smallbatchbeauty,newbrandlaunch"
```

**Default hashtags monitored:**
- #melbournebrand, #melbournefashion, #melbournebeauty
- #australianbrand, #australianmade, #melbournemade
- #indiebeauty, #smallbatchbeauty, #cleanbeautyau
- #newbrandlaunch, #brandlaunch

**Output:** `instagram-leads.csv` with usernames to review manually.

⚠️ **Note:** Instagram actively blocks scrapers. This tool may require adjustment over time. Use sparingly.

### 2. ABR Business Lookup (`abr-check.js`)

Verify businesses found elsewhere against the Australian Business Register.

```bash
# Look up a single business
node abr-check.js --name "Alt Cosmetics"

# Look up multiple businesses from CSV
node abr-check.js --input businesses.csv
```

### 3. Combined Workflow (`monitor.js`)

Shows the recommended workflow for using these tools together.

```bash
node monitor.js
```

## Recommended Workflow

1. **Weekly:** Run Instagram scraper on target hashtags
2. **Review:** Manually check found accounts for:
   - Early-stage signals (small following, "launching soon" in bio)
   - Website link in bio
   - Product/service fit for KSPF
3. **Audit:** Run promising websites through `../website-auditor`
4. **Outreach:** Contact top-scored leads with personalised pitch

## Finding New Businesses — Other Sources

Since the ABR doesn't publish new registrations, use these sources:

- **Instagram hashtags** — this tool
- **Local press** — search "new store melbourne" or "brand launch"
- **Industry newsletters** — Ragtrader, Beauty Directory AU
- **Crowdfunding** — Kickstarter, Pozible for launching products
- **Shopping centres** — tenant announcements (Chadstone, Emporium)
- **Facebook groups** — Melbourne small business communities
- **LinkedIn** — "Founder" + "Melbourne" + recent job changes

## Integration with Website Auditor

```bash
# After finding Instagram leads, extract websites and audit them:
cd ../website-auditor
node audit.js --input websites.csv --output leads-ranked.csv
```

## Scheduling (Optional)

To run automatically, add to crontab:

```bash
# Run Instagram scraper weekly on Monday at 9am
0 9 * * 1 cd /path/to/tools/brand-monitor && node instagram.js >> /tmp/brand-monitor.log 2>&1
```

Or use macOS launchd for more reliable scheduling.
