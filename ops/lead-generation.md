# Lead Generation

## Target Client Profile
Who KSPF is going after — solo founders, small creative brands, fashion/beauty/lifestyle businesses that need brand identity, web, or packaging. Melbourne-based preferred but not required.

**Sweet spot client:**
- Early-stage brand or rebrand
- Cares about craft and visual culture
- Needs strategy + execution (not just execution)
- Companies with old sites with UX/ Accessibility issues or outdated tech
- Budget: $3k–$15k project range

---

## Current Status (20 March 2026)

- Lead sourcing and audit tooling are working.
- Seed list exists in `data/leads/pipeline-leads.csv` with 15 leads.
- Audited output exists in `data/leads/pipeline-audited.csv` with 14 audited leads dated 2026-03-12.
- `FME Apparel` is in the seed list but missing from the audited output.
- 8 audited leads already have email addresses captured. 6 still need contact research.
- Outreach drafts exist inside `pipeline-audited.csv`, but there is no confirmed send / reply tracking in the repo yet.
- Warm leads outside the audited CSV: `ESS BEE (Steph)` and referral potential via `Anh / Alt Cosmetics`.

---

## Source of Truth
| Need | File |
|------|------|
| Seed list / merged shortlist | `data/leads/pipeline-leads.csv` |
| Best current audited list + draft emails | `data/leads/pipeline-audited.csv` |
| Working CRM / next actions | `ops/crm.md` |
| Visual dashboard / read view | `ops/crm-dashboard.html` |
| Manual notes / strategy / channels | `ops/lead-generation.md` |
| Weekly context / warm lead reminders | `journal/2026-03-16.md` |

---

## Active Outreach
| Name / Studio | Type | Channel | Status | Last Contact |
|---------------|------|---------|--------|--------------|
| ESS BEE (Steph) | Warm lead | Email | Waiting on her email before follow-up | — |
| Style Magazines | Cold lead | Email | Descoped after recheck | Safari scroll-lock issue appears resolved |

---

## Pipeline
| Lead | Source | Stage | Notes |
|------|--------|-------|-------|
| Anh (Alt Cosmetics) | Direct | Active client | Referral potential when project wraps |
| ESS BEE (Steph) | Warm lead | Contact pending | Mentioned in weekly journal, not yet added to CSV pipeline |
| Style Magazines | Web research | Audited, then parked | Email and audit exist, but the original Safari bug appears resolved after recheck |
| Fashion / art shortlist | Website auditor | 14 / 15 audited | See `pipeline-audited.csv`; `FME Apparel` still missing from output |

---

## Seed Lists Generated

### Fashion & Art Organisations (March 2026)
CSV: `data/leads/fashion-art-leads.csv`
**Audited output:** `data/leads/pipeline-audited.csv`
**Note:** `data/leads/leads-ranked-fashion-art.csv` contains failed DNS runs and should not be treated as the current source of truth.

| Name | URL | Category |
|------|-----|----------|
| Alpha60 | alpha60.com.au | fashion |
| Kuwaii | kuwaii.com.au | fashion |
| FME Apparel | fmeapparel.com.au | fashion |
| Vow Studio | vowstudio.com.au | fashion |
| Sister Studios | sisterstudios.com.au | fashion |
| Ngali | ngali.com.au | fashion |
| Caves Collect | cavescollect.com | fashion |
| Style Magazines | stylemagazines.com.au | media |
| No Vacancy | no-vacancy.com.au | gallery |
| Outré Gallery | outregallery.com | gallery |
| Blindside | blindside.org.au | gallery |
| Seventh Gallery | seventhgallery.org | gallery |

> ⚠️ Cross-check against existing sheets before outreach:
> - [Built with leads](https://docs.google.com/spreadsheets/d/12WwcUV2G96sDgt7pAN39rb7jjJoZK3-Imqzbq9N9VZ4/)
> - [Potential leads](https://docs.google.com/spreadsheets/d/1X8Fjp5vqiCmtBgS9l1yvDI_GpG6JoT0sAIXNERvCLWw/)

---

## Referral Sources to Nurture
- **Anh** — salon + fashion network (beauty, cosmetics, indie fashion brands)
- Past clients — AP-REPS, Bally Cara (check in post-project)

---

## Channels
| Channel | Status | Notes |
|---------|--------|-------|
| kspf.au | Live | Landing + visual folio. UX case studies to add. |
| Pinterest | Not set up | See setup guide below |
| Instagram | — | Tied to content calendar |
| Direct outreach | Prepared, not started | Audited list + draft emails exist, but no send cadence or reply tracking yet |
| Referrals | Passive | Activate after Alt Cosmetics delivery |

---

## Automation Tools

Located in `tools/` folder. See `tools/README.md` for full documentation.

### Quick Start
```bash
cd tools/website-auditor
npm install
node simple-pipeline.js --demo  # Test run
```

### Practical Workflow

1. **Build seed list** (manual, 10-20 mins)
   - Google: "fashion boutique melbourne" → copy URLs
   - Instagram: browse #melbournebrand → copy website links from bios
   - ChatGPT: "List 20 Melbourne indie beauty brands with websites"
   - Save as CSV: `url,name,category`

2. **Audit sites** (automated)
   ```bash
   node simple-pipeline.js --input my-leads.csv
   ```

3. **Review output** (`leads-ranked.csv`)
   - Sort by Lead Score (higher = worse site = better lead)
   - Score 40+ = high priority (serious UX/accessibility issues)
   - Score 25-40 = medium priority

4. **Personalised outreach**
   - Reference specific issues from audit
   - Track in Active Outreach table above

### Lead Score Weights
- Accessibility: 35% (core strength)
- Performance: 30% (obvious pain point)
- Best Practices: 20% (outdated tech)
- SEO: 15%

Higher score = worse site = better lead.

### Instagram Profile Extractor
If you have Instagram usernames, extract their website URLs:
```bash
cd tools/brand-monitor
npm install
node extract-profiles.js --users "brand1,brand2,brand3"
# Then audit the output:
cd ../website-auditor
node simple-pipeline.js --input ../brand-monitor/websites-to-audit.csv
```

> **Note:** Fully automated scraping (Google Maps, Instagram hashtags) is blocked by those platforms. The manual seed list + automated audit workflow is more reliable.

**Default hashtags:** #melbournebrand, #melbournefashion, #melbournebeauty, #indiebeauty, #smallbatchbeauty, #newbrandlaunch, #australianmade

### Workflow
1. Run Instagram scraper weekly → find new brand accounts
2. Manually review accounts, extract website URLs
3. Run websites through auditor → get ranked lead list
4. Personalise outreach based on specific issues found

---

## Case Studies (planned)
| Project | Status | Publish date |
|---------|--------|--------------|
| Alt Cosmetics | In progress — capture as you go | ~Late March 2026 |
| AP-REPS | Could write retrospectively | — |
| UX case studies for kspf.au | Planned | — |

---

## Pinterest Setup Guide

Pinterest works well for brand, packaging, and visual identity work — people search for references and discover studios organically over time. Low effort once set up.

### Steps

**1. Create a Business Account**
- Go to pinterest.com.au → sign up → select "Business account"
- Use studio@kspf.au
- Name: KSPF or Rowan Kuskopf — Studio
- Website: kspf.au

**2. Claim your website**
- In Settings → Claim → enter kspf.au
- Pinterest will give you a meta tag or HTML file to add to your site
- Add it to your site's `<head>` in your custom code
- Once verified, your pins link back to kspf.au with attribution

**3. Set up boards**
Start with 3–5 focused boards:
- **Brand Identity** — your own work + references
- **Packaging Design** — your work + strong references
- **Web & Digital** — kspf.au work + custom web builds
- **Visual References** — mood boards, aesthetic inspiration (draws traffic)
- **Typography** — always performs well on Pinterest

**4. Pin your work**
- Export key frames from Alt Cosmetics, AP-REPS, etc. as clean images (1:1 or 2:3 ratio works best)
- Write a short description with searchable terms: e.g. "Brand identity for indie cosmetics brand. Chrome packaging, minimalist typography. Melbourne."
- Link each pin back to kspf.au or the relevant case study page

**5. Pin regularly (loosely)**
- 3–5 pins per week is enough to build traction
- Mix your own work with saved reference images
- It compounds slowly — don't expect fast results, but it's passive once running

**6. Enable Rich Pins (optional but good)**
- Rich Pins pull metadata from your site automatically
- Validate at developers.pinterest.com/tools/url-debugger

---

## 90-Day Plan (from March 2026)

**March**
- [ ] Finish and publish kspf.au UX case study section
- [ ] Set up Pinterest account + claim kspf.au
- [ ] Document Alt Cosmetics in progress (screenshots, rationale)
- [ ] Build target outreach list (10–15 names)

**April**
- [ ] Publish Alt Cosmetics case study
- [ ] Begin direct outreach (5 contacts/week)
- [ ] Pin Alt Cosmetics work to Pinterest
- [ ] Check in with past clients (AP-REPS, Bally Cara)

**May**
- [ ] Review what's working — double down
- [ ] Add UX case studies to kspf.au
- [ ] Assess pipeline and adjust outreach targets
