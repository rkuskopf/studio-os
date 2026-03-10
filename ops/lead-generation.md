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

## Active Outreach
| Name / Studio | Type | Channel | Status | Last Contact |
|---------------|------|---------|--------|--------------|
| — | — | — | — | — |

---

## Pipeline
| Lead | Source | Stage | Notes |
|------|--------|-------|-------|
| Anh (Alt Cosmetics) | Direct | Active client | Referral potential when project wraps |

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
| Direct outreach | Not started | Priority for next 90 days |
| Referrals | Passive | Activate after Alt Cosmetics delivery |

---

## Automation Tools

Two tools in `tools/` folder for automated lead discovery:

### 1. Website Auditor (`tools/website-auditor/`)
Runs Lighthouse audits on a list of URLs, scores them by UX/accessibility issues, outputs ranked leads.

```bash
cd tools/website-auditor
npm install
node audit.js --input urls.csv --output leads.csv
```

**Lead scoring weights:**
- Accessibility: 35% (core strength)
- Performance: 30% (obvious pain point)
- Best Practices: 20% (outdated tech)
- SEO: 15%

Higher score = worse site = better lead.

### 2. Brand Monitor (`tools/brand-monitor/`)
Monitors Instagram hashtags and verifies businesses via ABR lookup.

```bash
cd tools/brand-monitor
npm install

# Instagram hashtag scraping
node instagram.js --hashtags "melbournebrand,indiebeauty"

# ABR business verification
node abr-check.js --name "Business Name"
```

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
