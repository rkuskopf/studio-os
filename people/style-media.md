# Style Media

**Website:** stylemedia.com.au / stylemagazines.com.au
**Type:** Digital magazine / media company — fashion, culture, lifestyle
**Location:** Melbourne, AU

## Contacts
| Name | Role | Email |
|------|------|-------|
| Kiri | (unknown — likely editorial or digital lead) | kiri@stylemedia.com.au |
| Charlie | (unknown — likely digital/dev) | charlie@stylemedia.com.au |

---

## Site Audit (March 2026)

Audited via Lighthouse (mobile):

| Metric | Score | Notes |
|--------|-------|-------|
| Performance | 39/100 | Slow — large images, heavy third-party scripts |
| Best Practices | 54/100 | Outdated tech — deprecated APIs, missing security headers |
| Accessibility | ~70 | Estimated — nav contrast, touch target sizing |
| SEO | — | Not flagged |

**Known bug:** Scroll-lock on mobile Safari — page freezes mid-scroll. Likely a conflict between sticky nav logic and Safari's scroll-container handling (a known iOS 15+ edge case with `overflow: hidden` or `-webkit-overflow-scrolling`).

**Other flags:**
- Slow load on mobile (39/100) — impacts bounce rate and reader drop-off on article pages
- Best practices at 54/100 — likely deprecated JS APIs and/or missing HTTPS security headers (Cloudflare doesn't fix everything at the app layer)
- Possible touch target sizing issues given the editorial layout density

**Lead score:** 35 (medium priority)

---

## Outreach

**Status:** Email drafted — ready to send

**Channel:** Email (cold)

**Last contact:** —

---

## Email Draft

**To:** kiri@stylemedia.com.au
**CC:** charlie@stylemedia.com.au
**Subject:** Bug on Style's mobile site

---

Hi Kiri,

Hope this doesn't come out of nowhere — I've been a reader for a while and ended up on the Style digital edition recently. Noticed something that bugged me enough to reach out.

There's a scroll-lock issue on mobile Safari — the page freezes mid-scroll and stops letting you progress through the article. It's the kind of thing that's easy to miss in QA but pretty disorienting when you hit it as a reader.

While I was poking around I also noticed the site's loading pretty heavily on mobile — around 39/100 on Google's performance metrics — and there are a few other technical flags (outdated API usage, some missing security headers) that tend to quietly chip away at rankings and reader experience over time. Nothing catastrophic, just worth knowing about.

I run a small studio (kspf.au) that does brand and web work for independent creative businesses. I'm not pitching a rebuild — I just noticed the issues and thought you'd want a heads up.

Happy to record a quick Loom showing exactly where the scroll bug kicks in if that'd help your dev team troubleshoot faster.

Rowan
KSPF Studio | kspf.au

---

*Notes: Keep tone warm, not salesy. The Loom offer is the CTA — it's useful and low-commitment. Don't over-explain the bugs or use jargon like "cognitive ergonomics" or "session depth". No need to mention job title.*
