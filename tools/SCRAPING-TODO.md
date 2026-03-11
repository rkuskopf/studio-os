# Lead Scraping Automation — Technical Notes

## Status: Resolved (use Claude-based approach)

The automated scrapers for Google Maps, Google Search, and Yellow Pages are **not working** and not worth maintaining. Use the Claude slash command instead.

**✅ Recommended approach:** Use the `/lead-finder` slash command in Claude Code. It uses Claude's built-in web search to find Melbourne businesses and outputs a CSV ready for auditing. No scraping, no bot-blocking, no selector maintenance.

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
| `simple-pipeline.js` | ✅ Working | Audits a URL list with Lighthouse |
| `/lead-finder` slash command | ✅ Working | Claude web search → CSV |
| `claude-lead-finder.js` | ✅ Working | Manual version: generates prompts, parses responses |
| `extract-profiles.js` | ⚠️ Fragile | Extracts websites from Instagram usernames |

## What's Broken (not maintained)

| Tool | Issue |
|------|-------|
| `scrape-maps.js` | Google Maps markup changes; bot detection |
| `scrape-google.js` | Gets blocked; returns 0 results |
| `scrape-yellowpages.js` | Selectors outdated; finds 0 results |

These files are kept for reference but should not be relied on.

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
