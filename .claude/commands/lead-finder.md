# Lead Finder

Find potential KSPF clients — Melbourne small businesses with weak websites — using web search.

## What it does

Uses Claude's web search to find independent Melbourne businesses in a given category, then formats results ready to pipe into the website auditor (`simple-pipeline.js`).

This replaces the broken Google/Maps scrapers. No external tools, no API keys, no bot-blocking.

## How to use

Invoke with `/lead-finder` then specify a category (and optionally a count):

```
/lead-finder beauty salons
/lead-finder florists 30
/lead-finder yoga studios fitzroy
```

## Steps Claude will follow

1. Ask (if not provided): what category of business? what suburb or area? how many leads (default 20)?
2. Use web search to find independent Melbourne businesses in that category that have their own websites
3. Filter out: chains, franchises, large brands, social-media-only businesses, directories
4. For each business found, extract: business name, website URL, brief description
5. Output a CSV-ready list in this exact format (one per line):

```
url,name,category
https://www.example.com.au,Example Business,beauty
https://www.another.com.au,Another Business,beauty
```

6. Also output a quick summary:
   - How many businesses found
   - Any that look especially promising (Instagram-heavy but weak web presence, obvious outdated design)
   - Suggested next step: `node tools/website-auditor/simple-pipeline.js --input leads.csv`

## Constraints

- Only businesses with a real website (not just Instagram or a Facebook page)
- Prefer independent, locally-owned businesses over chains
- Melbourne focus unless asked otherwise
- If web search returns sparse results for a niche, broaden to "Melbourne inner suburbs" or suggest adjacent categories

## Context

These leads are for KSPF design studio outreach. The goal is to find businesses where the website is clearly underperforming — slow, inaccessible, visually outdated — so there's a genuine pain point to address in outreach.

After getting the CSV output, the next step is:
```bash
cd tools/website-auditor
node simple-pipeline.js --input leads.csv
```
This runs Lighthouse audits and outputs `leads-ranked.csv` sorted by lead score.
