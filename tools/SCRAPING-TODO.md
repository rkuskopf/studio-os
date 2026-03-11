# Lead Scraping Automation — Technical Notes

## Status: Partially Working

**✅ Google Maps (v2):** `scrape-maps-v2.js` works with puppeteer-extra stealth plugin. Tested 2026-03-11.

**❌ Yellow Pages:** Cloudflare blocking all automated requests.

**✅ Claude web search:** `/lead-finder` slash command works reliably.

---

## Recommended Approaches

### 1. Google Maps Scraper v2 (works!)
```bash
cd tools/website-auditor
node scrape-maps-v2.js --query "beauty salon melbourne" --limit 10
node audit.js --input maps-leads-v2.csv
```
Uses stealth plugin to avoid bot detection. Opens a visible browser window.

### 2. Claude `/lead-finder` (always works)
```
# In a Claude Code session:
/lead-finder beauty salons
/lead-finder yoga studios fitzroy 30
```
No scraping needed — Claude searches the web directly.

```
# In a Claude Code session:
/lead-finder beauty salons
/lead-finder yoga studios fitzroy 30

# Then audit the results:
cd tools/website-auditor
node simple-pipeline.js --input leads.csv
```

---

## What Works

| Tool | Status | Notes |
|------|--------|-------|
| `scrape-maps-v2.js` | ✅ Working | Google Maps with stealth plugin (tested 2026-03-11) |
| `simple-pipeline.js` | ✅ Working | Audits a URL list with Lighthouse |
| `/lead-finder` slash command | ✅ Working | Claude web search → CSV |
| `claude-lead-finder.js` | ✅ Working | Manual version: generates prompts, parses responses |
| `extract-profiles.js` | ⚠️ Fragile | Extracts websites from Instagram usernames |

## What's Broken

| Tool | Issue | Fix |
|------|-------|-----|
| `scrape-maps.js` | Old version without stealth | Use `scrape-maps-v2.js` instead |
| `scrape-google.js` | Gets blocked | Use `/lead-finder` instead |
| `scrape-yellowpages.js` | Cloudflare blocking | No fix — use Google Maps or `/lead-finder` |

---

## If Claude-Based Search Isn't Enough

If you need higher volume or more structured data:

- **Google Places API** — $17 per 1,000 requests. Reliable, structured. Worth it for > 100 leads/month.
- **SerpAPI** — $50/mo. Handles Google scraping reliably.
- **Apify** — Pre-built scrapers for Yellow Pages, Instagram, etc.
- **Browser Use skill** — Install the `browser-use/claude-skill` to give Claude a real browser that navigates Google Maps like a human. No selector maintenance. See `SKILLS.md`.

---

## Notes

Scraping is an arms race. For a solo studio the ROI on maintaining custom scrapers is low. The Claude-assisted approach (web search → CSV → Lighthouse audit) covers the full workflow without any infrastructure to maintain.
