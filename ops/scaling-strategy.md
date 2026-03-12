# KSPF — Scaling Strategy

**Status:** Planning
**Created:** March 2026
**Source:** [Research report](https://docs.google.com/document/d/1OC5QkGrn4n-VRczZ0Dz6eQJ3QH6iAFTiWvrwQrZkUI0/edit?usp=sharing) + repo context

---

## The Goal

Scale KSPF from a solo studio rebuilding its client base into a consistently booked, higher-revenue operation — without burning out or losing quality. This is not about hiring a team tomorrow. It's about building the systems, visibility, and pipeline that let the studio punch above its weight.

The research report frames this clearly: the primary inhibitor to scaling is the **"founder bottleneck"** — where Rowan's individual labour is the sole engine of production. The path forward is transitioning from a **service-delivery mindset to a systems-design mindset**: working *on* the business, not just *in* it.

---

## Where We're Starting From

- Solo operator (Rowan). Skills across brand strategy, UX, web, packaging.
- Currently 1 active client (Alt Cosmetics). Revenue is thin.
- Lead gen tools exist but aren't in motion yet.
- kspf.au is live but UX case studies section is unfinished.
- Pinterest not set up. Direct outreach not started.
- Automation tools built (scraper, email drafter, Asana ↔ GitHub sync) but underused.
- David Carnegie (Holmesglen SEA) is a business support resource — not being maximised.
- studio-os repo is already functioning as a **RAG (Retrieval-Augmented Generation)** system for AI — a key asset as we scale agentic workflows.

---

## The Four Pillars (from the Research Report)

The report synthesises scaling into four pillars. All four apply directly to KSPF.

---

### Pillar 1 — Break the Founder Bottleneck (Systems)

**The core insight:** You are currently a technician having an entrepreneurial seizure (E-Myth — the moment a skilled person decides to start a business without the systems to run one). To scale, stop reinventing every project and start building repeatable systems.

**Key frameworks from the research:**
- **EOS (Traction)** — Six-component alignment: Vision, People, Data, Issues, Process, Traction. Consider a simplified version: define KSPF's 1-year Vision, 3 Rocks (priorities), and a weekly "Level 10" CEO review.
- **E-Myth / Clockwork** — Identify the **Queen Bee Role** (the function that drives the most value — for KSPF, this is *creative direction + strategy*) and protect it by delegating or automating everything else.
- **Built to Sell** — Build services that don't require Rowan to deliver them personally. Even if you stay solo, packageable services increase per-project value.
- **10x Is Easier Than 2x** — Radical prioritisation. What are the 3 things that would actually 10x KSPF? Drop the rest.

**Actions for KSPF:**
- [ ] Define KSPF's Queen Bee Role — what is the one thing only Rowan can do?
- [ ] Create SOPs for the repeatable parts of every project: onboarding, brief template, feedback rounds, handoff
- [ ] Build 3 core service packages with fixed scope + price (see Pillar 3)
- [ ] Schedule a weekly CEO block (strategy only, not delivery)
- [ ] Clear admin debt that's fragmenting focus: Wacom pen, Logic 12 issues, Dropbox → iCloud migration

---

### Pillar 2 — Communication as a Strategic Asset

**The core insight:** As you scale, your primary role shifts from *doing* to *communicating*. Your ability to write, pitch, and tell stories becomes your competitive moat.

**Key frameworks from the research:**
- **Tactical Empathy (Chris Voss)** — Use *Labelling* ("It seems like you're concerned about the timeline") and *Mirroring* (repeat the last 3 words) to build rapport and uncover what clients actually need. The goal is "That's Right" — not just "Yes."
- **The Hero's Journey** — In every pitch, position KSPF as the *Guide*, the client as the *Hero*, and their market problem as the *Antagonist*. Your service is the "magical tool." This is already embedded in how Alt Cosmetics has been approached — make it explicit.
- **Thought Leadership** — Become a Key Opinion Leader (KOL) through consistent, high-value, "bite-sized" content. Newsletters, Instagram, or even LinkedIn posts that demonstrate taste and strategic thinking.
- **Made to Stick (Heath)** — Brand messages that work are Simple, Unexpected, Concrete, Credible, Emotional, and tell a Story. Apply this to kspf.au copy and outreach.

**Actions for KSPF:**
- [ ] Rewrite kspf.au copy through the Hero's Journey lens — client as hero, KSPF as guide
- [ ] Write 3 outreach email templates using Voss's Tactical Empathy principles (label → mirror → calibrated question)
- [ ] Define KSPF's thought leadership angle — what unique POV does Rowan have about branding/design that no one else is saying?
- [ ] Start a minimal content cadence: 1 post/week that shares a taste-driven insight or behind-the-scenes process

---

### Pillar 3 — Visibility + Pipeline

**The core insight:** Market positioning matters more than volume. Don't compete on price — create a "Purple Cow" service offering so specific and remarkable that the right clients find you.

**Actions for KSPF:**
- [ ] Define KSPF's Purple Cow positioning — what is the niche KSPF owns? (Early-stage creative brands in fashion/beauty/lifestyle? "Whisper don't shout" brand identity? Chrome-and-restraint aesthetic?)
- [ ] Publish UX case studies section on kspf.au
- [ ] Finish and publish Alt Cosmetics case study when project wraps (~late March)
- [ ] Set up Pinterest business account (studio@kspf.au) and claim kspf.au
- [ ] Pin at least 5 portfolio pieces to start (Alt Cosmetics, AP-REPS, concept work)
- [ ] Action the fashion/art seed list — run through auditor, prioritise top 5 leads
- [ ] Reach out to ESS BEE / Steph — close the warm lead
- [ ] Check in with past clients: AP-REPS, Bally Cara — referral and repeat potential
- [ ] Set up a lightweight CRM — Airtable or upgraded tracking in `lead-generation.md`
- [ ] Activate referral channel: ask Anh to refer 1–2 contacts when Alt Cosmetics wraps
- [ ] Start direct outreach: 5 new contacts/week from April

**Service packages (to define):**
- **Brand Sprint** — strategy + identity, fixed scope, ~$4–6k
- **Web Rebuild** — audit + redesign + build, ~$5–10k
- **Brand + Web** — bundled, ~$8–15k
- **Monthly retainer** — ongoing brand support / creative direction / web maintenance, ~$1–2k/mo

---

### Pillar 4 — AI as a Force Multiplier (Agentic Communication)

**The core insight:** The research identifies AI agents not just as productivity tools but as *brand representatives*. studio-os is already the foundation of a RAG pipeline — the next step is building agents that can act on it.

**The Three-Layer Architecture (from the report):**

1. **System Prompts (The Rulebook)** — This is what CLAUDE.md and the skills in `.claude/commands/` already do. Expand and sharpen them. Use XML-style tagging, flexible heuristics, not brittle if-else logic.
2. **RAG (The Context)** — studio-os *is* the RAG database. Every markdown file is a document the AI can retrieve. Keeping these files accurate and structured is what makes agentic work reliable and hallucination-free.
3. **Fine-Tuning (The Brand Voice)** — Reverse-engineer KSPF's best written work (project briefs, client emails, kspf.au copy) to extract tone principles. Create a **Brand Voice Guide for AI** — a document of hard constraints (banned phrases, sentence length rules, vocabulary, tone examples) that keeps all AI outputs consistently on-brand.

**The C.R.E.A.T.E. Framework for KSPF prompts:**
- **C**haracter — "You are the creative director of KSPF, a Melbourne-based solo studio known for refined brand identity and understated visual language."
- **R**equest — state the task
- **E**xamples — always include 2–3 examples of the desired output style
- **A**dditions — tone: direct, considered, no jargon. Audience: solo founders, small creative brands.
- **T**ype of output — specify format (proposal, email, brief, social post)
- **E**xtras — include relevant context from studio-os files

**Classical Rhetoric (Ethos / Pathos / Logos) applied to AI:**
- **Ethos** — Consistency and authority. The AI should always reference Rowan's specific experience, case studies, and named clients (not generic claims).
- **Pathos** — Detect emotional cues in client briefs and outreach. AI should label and reflect back the client's emotional state in responses.
- **Logos** — Use chain-of-thought reasoning in proposals and briefs — show the *why* behind every creative decision.

**Actions for KSPF:**
- [ ] Create `ops/brand-voice.md` — KSPF's Brand Voice Guide for AI: banned phrases, tone rules, sentence length, vocabulary, examples of good vs. bad copy
- [ ] Sharpen CLAUDE.md with C.R.E.A.T.E. character definition and tone guardrails
- [ ] Build Askable workflow — `projects/askable.md` + SMS-to-task flow (recurring income stream)
- [ ] Set up Google Workspace skill (`@googleworkspace/cli`) for Claude access to Drive, Gmail, Calendar, Sheets
- [ ] Explore LangGraph or CrewAI for multi-step agentic workflows (e.g. lead research → draft → CRM update)
- [ ] "Red team" AI outputs — test prompts with hostile/edge-case inputs to ensure tone stays on-brand

---

## Melbourne-Specific Resources (from the Research Report)

The report specifically identifies Melbourne as a strong hub for scaling support:

| Resource | What | Why relevant |
|----------|------|-------------|
| [Scaling Solo](https://www.meetup.com/scalingsolo/) | Melbourne solopreneur community — freelancers, indie hackers, creators | Peer network, knowledge exchange, potential collaborators |
| [BlueRock Digital](https://www.bluerock.com.au/services/digital/marketing/) | Business advisory + digital marketing + financial support | Holistic growth planning for SMEs |
| [Federico Re](https://creativeentrepreneur.com.au/services/business-coaching-melbourne/) | Business coaching for creative entrepreneurs, NLP-based | Specifically for creative founders making commercial decisions |
| [The Melbourne Freelancer](https://www.themelbournefreelancer.com/about/) | Strategic partner for freelancers scaling courses/memberships, manages backend ops | Backend systems + operations support |
| [Melbourne Business Network (MBN)](https://mbn.org.au/) | Business growth specialists, networking, post-pandemic resources | Broader business network and growth advisors |
| David Carnegie / Holmesglen | Finance mentor (already engaged) | Existing relationship — maximise it |

**Immediate action:** Attend one Scaling Solo meetup. It's free, Melbourne-based, and designed exactly for where KSPF is right now.

---

## Revenue Targets

| Stage | Monthly Revenue | How |
|-------|----------------|-----|
| **Now** | ~$0–2k | 1 client project (Alt Cosmetics) |
| **90 days** | $5–8k/mo | 2 active projects + pipeline flowing |
| **6 months** | $10–15k/mo | 3 projects or 2 projects + 1 retainer |
| **12 months** | $15–20k/mo | Consistent pipeline, mix of project + retainer |

Research report benchmark: consistent, predictable income and 3–5x faster time-to-market through systematisation.

---

## Implementation Phases (from the Report)

The research recommends a staged approach — don't do all of this at once.

### Phase 1 — De-bottleneck (Now → April)
- Deliver Alt Cosmetics on time ← **this is the Queen Bee Role right now — protect this time above all else**
- Document Alt Cosmetics as a case study while delivering
- Write SOPs for onboarding, brief, feedback, and handoff
- Define service packages + one-page proposal template
- Clear admin debt (Logic, Wacom, Dropbox)

### Phase 2 — Visibility + Pipeline (April → May)
- Publish Alt Cosmetics case study
- Set up Pinterest + pin first 5 pieces
- Begin direct outreach: 5 contacts/week
- Check in with AP-REPS + Bally Cara
- Attend one Scaling Solo meetup

### Phase 3 — Systematise + AI (May → June)
- Publish UX case studies on kspf.au
- Create `ops/brand-voice.md` (Brand Voice Guide for AI)
- Build Askable workflow
- Set up lightweight CRM
- First retainer conversation with a past or current client
- Explore LangGraph/CrewAI for agentic lead-to-outreach automation

### Phase 4 — Review + Scale (June → September)
- Review what's working — double down
- Assess revenue against targets
- Explore whether a contractor/collaborator relationship makes sense
- Consider BlueRock or Federico Re for strategic advisory if revenue supports it

---

## Repo / Systems Scaling

The studio-os repo is the operating system for KSPF. Levelling it up is part of scaling:

- [ ] **`ops/brand-voice.md`** — KSPF Brand Voice Guide for AI (tone rules, banned phrases, vocabulary, examples)
- [ ] **`templates/` folder** — brief templates, proposal templates, case study capture frameworks, SOPs
- [ ] **Askable workflow** — `projects/askable.md`, optimise application language, SMS-to-task flow
- [ ] **CRM integration** — connect lead pipeline output to tracked CRM (Airtable or custom dashboard)
- [ ] **Weekly review automation** — improve sprint planning to auto-pull open tasks from GitHub Issues
- [ ] **Finance tracking** — replace MYOB with something lighter (Wave, FreshBooks, or a Google Sheet)
- [ ] **Google Workspace skill** — `@googleworkspace/cli` for Claude access to Drive, Gmail, Calendar, Sheets (see `SKILLS.md`)

---

## Key Risks

| Risk | Mitigation |
|------|-----------|
| Alt Cosmetics overruns → no time for biz dev | Time-box delivery, use Deep Focus for biz dev too |
| Pipeline runs dry after Alt Cosmetics | Start outreach NOW, not after delivery |
| Pricing too low → can't scale on volume | Package and raise rates after next project |
| Admin debt (Logic, Wacom, Dropbox) draining focus | Schedule an admin block this week to clear it |
| Building tools instead of using them | Enforce "use what's built" before building more |
| Staying in technician mode | Protect the CEO block — strategy is not optional |
| AI outputs drift off-brand | Build the Brand Bible first, then deploy agents |

---

## Reading List (from the Research Report)

For when there's bandwidth — these are the books the report synthesises:

**Scaling systems:** Traction (Wickman), The E-Myth (Gerber), Clockwork (Michalowicz), Built to Sell (Warrillow), Profit First (Michalowicz), 10x Is Easier Than 2x (Hardy)

**Communication + persuasion:** Never Split the Difference (Voss), Influence (Cialdini), Made to Stick (Heath), Resonate (Duarte), On Writing Well (Zinsser), Breakthrough Advertising (Schwartz)

**Market positioning:** Blue Ocean Strategy (Kim + Mauborgne), Purple Cow (Godin)

---

## Reference

- Research report: [Google Doc](https://docs.google.com/document/d/1OC5QkGrn4n-VRczZ0Dz6eQJ3QH6iAFTiWvrwQrZkUI0/edit?usp=sharing)
- Lead gen tools: `tools/` — `simple-pipeline.js`, `full-pipeline.js`
- Lead gen plan: `ops/lead-generation.md`
- Studio context: `ops/company.md`, `CLAUDE.md`
- Finance mentor: `people/david-carnegie.md`
