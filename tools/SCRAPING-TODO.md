# Lead Scraping Automation — Technical Debt

## Status: Needs Work

The automated scrapers for Google Maps, Google Search, and Yellow Pages are currently **not working** due to:
1. Changed HTML markup / selectors
2. Bot detection / blocking
3. JavaScript-heavy pages that don't render properly

## What Works Now
- `simple-pipeline.js` — audits a manually-curated list of URLs ✅
- `extract-profiles.js` — extracts websites from Instagram usernames (fragile but works sometimes)

## What Needs Fixing

### 1. Yellow Pages Scraper (`scrape-yellowpages.js`)
- **Issue:** Selectors are outdated, finds 0 results
- **Fix needed:** Inspect current yellowpages.com.au markup, update selectors
- **Test URL:** https://www.yellowpages.com.au/find/florists/melbourne-vic

### 2. Google Maps Scraper (`scrape-maps.js`)
- **Issue:** Can't extract website URLs from business pages
- **Fix needed:** Google Maps markup changes frequently; may need Playwright instead of Puppeteer
- **Alternative:** Use Google Places API (requires API key, has costs)

### 3. Google Search Scraper (`scrape-google.js`)
- **Issue:** Gets blocked or returns 0 results
- **Fix needed:** Better bot evasion, or use SerpAPI/ScraperAPI (paid)

## Alternative Approaches to Explore

### A. Claude Web Search Integration
Use Claude's web search capability to find businesses, then extract URLs from the response.
- Pros: No scraping needed, handles markup changes automatically
- Cons: Rate limits, less structured output

### B. Paid APIs
- **Google Places API** — $17 per 1000 requests, reliable
- **SerpAPI** — $50/mo, handles Google scraping
- **Apify** — pre-built scrapers for Yellow Pages, Instagram, etc.

### C. Browser Extension Approach
Build a simple Chrome extension that:
1. User browses Google Maps / Yellow Pages normally
2. Extension extracts business URLs from the page
3. Exports to CSV for auditing

### D. Manual + AI Hybrid
1. Ask Claude/ChatGPT: "List 30 Melbourne beauty salons with their website URLs"
2. Claude searches and returns structured data
3. Pipe into the auditor

## Tasks

- [ ] Debug Yellow Pages scraper — inspect current markup
- [ ] Test Playwright instead of Puppeteer for Google Maps
- [ ] Research Google Places API pricing for KSPF volume
- [ ] Build Claude-assisted lead finder (see `claude-lead-finder.js`)
- [ ] Consider Apify for reliable scraping
- [ ] **Automate tasks → GitHub Issues** — research syncing TASKS.md to GitHub Issues (gh CLI, GitHub Actions, or VS Code extension). Route kspf.au-related tasks to that repo automatically.

## Notes

Scraping is an arms race. Sites constantly update their markup and bot detection. For a solo studio, the ROI on maintaining scrapers may be low compared to:
1. Manual research (10-20 mins/week)
2. Paid APIs when needed
3. AI-assisted research
