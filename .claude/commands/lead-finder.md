# Lead Finder

Find potential KSPF clients — Melbourne small businesses with weak websites — using web search.

## What it does

Uses Claude's web search to find independent Melbourne businesses in a given category, then formats results ready to pipe into the website auditor (`simple-pipeline.js`).

This replaces the broken Google/Maps scrapers. No external tools, no API keys, no bot-blocking.

## How to use

Invoke with `/lead-finder` then specify a category (and optionally a count):

```
/lead-finder fashion brands
/lead-finder art organisations
/lead-finder digital agencies with potential "project spill over"
```

## Existing Lead Sheets (check for duplicates)

Two Google Sheets already contain leads. Always cross-reference against these before outputting new ones:

- **Sheet 1:** https://docs.google.com/spreadsheets/d/12WwcUV2G96sDgt7pAN39rb7jjJoZK3-Imqzbq9N9VZ4/edit?gid=0#gid=0
- **Sheet 2:** https://docs.google.com/spreadsheets/d/1X8Fjp5vqiCmtBgS9l1yvDI_GpG6JoT0sAIXNERvCLWw/edit?gid=1661990518#gid=1661990518

If the GWS (Google Workspace) MCP is available, read both sheets at the start and build a list of existing domains/URLs to exclude. If GWS is not available, ask Rowan to paste the existing business names or URLs so you can deduplicate manually.

## Steps Claude will follow

1. Ask (if not provided): what category of business? what suburb or area? how many leads (default 20)?
2. **Check existing sheets** — read Sheet 1 and Sheet 2 (via GWS MCP if available) and note existing business names/domains to avoid
3. Use web search to find independent Melbourne businesses in that category that have their own websites
4. Filter out: chains, franchises, large brands, social-media-only businesses, directories
5. **Deduplicate** — remove any business already in Sheet 1 or Sheet 2 (match by domain or business name)
6. For each new lead found, extract: business name, website URL, brief description
7. Output a CSV-ready list in this exact format (one per line):

```
url,name,category
https://www.example.com.au,Example Business,beauty
https://www.another.com.au,Another Business,beauty
```

8. Also output a quick summary:
   - How many businesses found vs how many were filtered as duplicates
   - Any that look especially promising (Instagram-heavy but weak web presence, obvious outdated design)
   - Suggested next step: `node tools/website-auditor/simple-pipeline.js --input leads.csv`

## Constraints

- Only businesses with a real website (not just Instagram or a Facebook page)
- Prefer independent, locally-owned businesses over chains
- Melbourne focus unless asked otherwise
- If web search returns sparse results for a niche, broaden to "Melbourne inner suburbs" or suggest adjacent categories
- Never output a lead that already exists in Sheet 1 or Sheet 2

## Context

These leads are for KSPF design studio outreach. The goal is to find businesses where the website is clearly underperforming — slow, inaccessible, visually outdated — so there's a genuine pain point to address in outreach.

After getting the CSV output, the next step is:
```bash
cd tools/website-auditor
node simple-pipeline.js --input leads.csv
```
This runs Lighthouse audits and outputs `leads-ranked.csv` sorted by lead score.
