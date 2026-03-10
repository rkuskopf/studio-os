# KSPF Website Auditor

Automatically audit websites for UX, accessibility, and performance issues to find potential leads.

## Setup

```bash
cd tools/website-auditor
npm install
```

## Usage

### Audit a list of URLs

Create a CSV file with columns: `url`, `name`, `category`

```bash
npm run audit -- --input my-urls.csv --output leads.csv
```

### Run with sample URLs

```bash
npm run audit -- --sample
```

### Limit number of audits

```bash
npm run audit -- --input urls.csv --limit 10
```

## Output

The tool outputs a CSV with:
- **Lead Score** (0-100) — higher = worse site = better lead
- Individual scores for Performance, Accessibility, Best Practices, SEO
- Assessment summary with key issues
- Sorted by lead score (best leads first)

## Lead Score Weighting

- Accessibility: 35% (your core strength)
- Performance: 30% (slow sites are obvious pain points)
- Best Practices: 20% (outdated tech)
- SEO: 15% (secondary concern)

## Finding URLs to Audit

Good sources for Melbourne fashion/beauty/lifestyle businesses:
- Google Maps searches ("fashion boutique melbourne")
- Instagram location tags
- Business directories (Yellow Pages, TrueLocal)
- Industry associations (Australian Fashion Council members)
- Shopping centre tenant lists (Chadstone, Emporium)

Export URLs to a CSV and run through the auditor.
