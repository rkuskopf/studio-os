# ALT. Cosmetics — Mark Development Workshop
# How to use AI to go from 20 ideas to executed concepts today

**Status:** Active — use this doc to run your mark development session  
**Deadline:** ~20 March 2026  
**Where we are:** Three confirmed directions (A/B/C). Client preferences confirmed. Prompts written. Execution blocked.

---

## Why AI keeps producing the wrong thing (read this first)

The reference you're chasing — **Loewe's anagram** — is not an AI-generated mark. It is a geometric construction: three or four letters drawn from scratch on a grid, with consistent single-weight strokes, where letters share edges deliberately. There is no letterform tapering, no calligraphy, no organic loops.

When you put "interlocking letterforms" or "flowing monogram" into any AI image generator, it pattern-matches to the **calligraphic/script register** — swirling loops, variable weight, cursive curves. That's what produced the atom/swirl shape you got. That will keep happening regardless of how you tweak the prompt, because the construction logic you want (geometric grid, shared strokes, hard angles and consistent weight) is not describable in natural language in a way AI image models reliably understand.

**This is not a prompting problem. It's a method problem.**

There are two fundamentally different types of marks in play here. They require different tools:

| Type | Examples | How it's made | AI useful? |
|------|---------|---------------|-----------|
| **Geometric / constructed** | Loewe anagram, JB monogram, MB monogram | Built on a grid in Figma/Illustrator using pen tool + boolean ops | No — use as loose form inspiration only |
| **Calligraphic / organic** | Victorian monogram, Mauclot script, carved/incised marks | AI generation works here — MJ + Firefly will get you close | Yes |

Your three confirmed directions (A, B, C) split across these types:
- **Direction A** (Ancient/Carved) — calligraphic/organic register → AI generation works
- **Direction B** (Victorian/Script) — calligraphic/organic register → AI generation works
- **Direction C Loewe-style** (geometric monogram) — constructed register → Figma workflow, not AI generation
- **Direction C cartouche** (SRA SRA oval) — geometric but structured → AI generation works for overall form, not detail

**The fix: two parallel tracks, not one.**

---

## What's already done (don't redo this)

- ✅ Three mark directions defined (A: Ancient/Carved, B: Victorian/Script, C: Architectural/Art Deco)
- ✅ Client preferences confirmed: abstract and flowing, structured container + organic interior, NOT rigid or masculine
- ✅ Sweet spot: structured oval/circle container + flowing letterforms inside (SRA SRA structure + Loewe fluidity)
- ✅ All Midjourney prompts written → `projects/alt-cosmetics-mj-prompts.md`
- ✅ Figma working file exists (see Key Assets in `alt-cosmetics.md`)
- ✅ Now confirmed: Loewe-type geometric mark requires Figma construction, not AI generation

---

## Today's session plan (3–4 hours to get concept-ready)

There are now **two parallel tracks**. Run them at the same time where possible.

---

### TRACK 1 — AI generation (Directions A, B, C-cartouche)

#### Hour 1 — Generate (Midjourney)

1. Open `projects/alt-cosmetics-mj-prompts.md`
2. Run **GROUP B** (Victorian/Script) — calligraphic territory, MJ handles well
3. Run **GROUP C — C1/C2** (SRA SRA cartouche) — structured oval, MJ can give you a form to build from
4. Run **GROUP A** last — lower priority given her feedback, but worth a pass
5. **Do NOT run C3 in Midjourney** — see Track 2 below

**How to run in parallel:** Open three Midjourney conversations simultaneously (or use `/imagine` in three separate Discord threads). Don't wait for one to finish before starting the next.

**What you're looking for after generation:**
- Pick the **1–2 strongest per direction** — not the prettiest, the one with the best *structure*
- Does the overall form read at small size? (mentally squint at it)
- Does it feel like it could be debossed/engraved? (fewer fine lines = more practical for chrome hot-stamp)

#### Hour 2 — Vector cleanup with Firefly Text to Vector

*For the AI-generated results from Track 1 only.*

Option A — Direct from prompt (fastest):
1. Go to [firefly.adobe.com](https://firefly.adobe.com) → **Text to Vector**
2. Use a condensed version of your best-performing Midjourney prompt
3. Set **Content type:** Logo
4. Generate 4 variations → pick strongest → refine with follow-up prompt

Option B — Midjourney concept → Firefly cleanup (most controlled):
1. Take your strongest Midjourney result
2. Go to Firefly → **Text to Image** → click **Structure Reference** → upload the MJ image
3. Write a refined prompt that describes the *shape quality* you want
4. Lower the structure reference strength to ~50–60% so it guides form without copying exactly

**Condensed prompts for Firefly Text to Vector:**

Direction B (Victorian/Script):
```
Victorian monogram, interlocking calligraphic letterforms A-L-T, organic flowing swash construction, fine line, black on white, suitable for debossing, no background, logo mark
```

Direction C — cartouche only (not geometric monogram):
```
Art deco oval seal, structured oval border, abstract interior elements, fine line, luxury beauty brand, black on white, clean vector, logo mark
```

Direction A (Ancient/Carved):
```
Ancient carved seal mark, archaic symbol, worn incised stone quality, oval form, black on white, flat logo, primitive elegance, logo mark
```

---

### TRACK 2 — Figma construction (Loewe-style geometric monogram)

**This is the track that produces the Loewe-type result. This cannot be done with AI generation.**

The good news: this is entirely achievable in Figma. You don't need Illustrator. The Loewe anagram is built from basic geometric shapes — rectangles, circles, lines — with the Pen tool. No calligraphic skill required. The skill needed is spatial reasoning and patience, both of which you have.

**Estimated time: 45–90 minutes for a first pass. 30 minutes if you have a clear form in mind.**

#### Step 1 — Set up the construction grid in Figma (~5 min)

1. Create a new frame: `600×600px`, white background
2. Enable **Layout Grid** (in the right panel): set to Grid, 20px squares
3. This is your construction surface. Everything snaps to the grid.
4. Draw a `480×480px` square in the center — this is the mark boundary. Set fill to none, stroke to light grey. This is your reference container, not part of the mark.

#### Step 2 — Decide on your letter arrangement (~10 min)

You have three letters: **A, L, T**. Unlike Loewe (4 letters, perfect 2×2), you need a 3-letter composition. Options to try:

- **Triangle arrangement**: L top-left, T top-right, A centered bottom — balanced, like a monogram crest
- **Horizontal row**: L | A | T — letters side-by-side, sharing the dividing stroke between them
- **Stacked**: A on top (two diagonal strokes), L bottom-left, T bottom-right sharing A's base stroke

Pick one. Don't design all three — pick one and execute it.

**Recommended starting point:** Triangle arrangement. It creates a contained mark that reads as a single unit, and the diagonal strokes of A bridge the two sides naturally.

#### Step 3 — Draw each letter geometrically (~30 min)

Key rules for the Loewe register:
- **Single consistent stroke weight** — 24–28px throughout. Every stroke is the same weight.
- **No font** — draw the letters yourself with the Pen tool (P) or as shapes
- **Geometric construction only** — straight lines, right angles, circles for curves. No freehand.
- **Round stroke caps** — set in the stroke panel (this is what gives the Loewe mark its quality)

**Letter construction notes for ALT:**

*The A:*
- Two diagonal lines meeting at a peak (approx 60° angle)
- One horizontal crossbar at the midpoint
- Leave the bottom open (no base stroke) — this allows L and T to connect

*The L:*
- One vertical stroke going down
- One horizontal stroke going right at the base
- The vertical should align with the A's left diagonal

*The T:*
- One vertical stroke going down
- One horizontal stroke across the top
- The vertical should align with the A's right diagonal
- The T's top horizontal and the A's peak can share space — the horizontal bar of the T at top creates a visual echo of the A crossbar

#### Step 4 — Create shared strokes (~15 min)

This is what makes it a *monogram* rather than three separate letters:

- Where the A's left leg meets the L's top: they share a point or a short stroke. Extend the A's leg slightly so it meets the top of the L's vertical exactly.
- Where the A's right leg meets the T's top: extend A's right diagonal to meet T's top horizontal
- Where letters share a dividing line: delete the duplicate stroke. One line, serving both letters.

**In Figma:** Select both touching paths → right-click → **Flatten** → then use the **Pen tool** to click on any unwanted anchor points (extra nodes at the junction) and delete them with the Delete key to get a clean shared edge.

#### Step 5 — Test and evaluate (~10 min)

- Group everything, then scale to **24px** (this is approximate tube deboss size)
- Scale to **48px** — does it read?
- Check inverted: white strokes on black background (the actual hot-stamp use case)
- The test: does it look like a mark, not like three letters sitting next to each other?

#### Step 6 — Export as SVG for the concept presentation

- Select the mark group → **File → Export** → SVG
- Import into your concept presentation Figma file

---

### Hour 3 — Compose both tracks in Figma

This is where your skill set takes over.

**Setup:**
1. In your ALT. working Figma file, create a new section: **Mark Directions**
2. One frame per direction: `1200×1200px`, white background

**What to do per direction:**
- Mark in isolation at full size (black on white, square crop)
- Mark reversed (white on black) — this is the chrome tube use case
- Mark + wordmark lockup (Aktiv Grotesk Extended "ALT." below or beside)
- Mark at small scale (simulate 8–10mm at screen resolution — approx 30×30px crop)

**For Firefly SVGs that need cleanup:**
- Delete individual nodes you don't want (Figma handles this)
- Use **Union** or **Subtract** to clean up overlapping shapes
- Scale proportionally

#### Hour 4 — Build the concept presentation

Present three directions with 2 mark options each maximum:

**Per direction, show:**
- Mark in isolation (black on white, square crop)
- Mark reversed (white on black)
- Mark + wordmark lockup (horizontal or vertical)
- Mark small (simulated tube deboss size)

**Don't over-present.** Three directions, two marks each, is six decisions. Keep it tight. Use Figma's presentation mode or export as PDF.

---

## Using AI to support the Figma construction (not replace it)

Even for the geometric track, AI has a supporting role:

**What AI can do for the geometric direction:**
- Generate abstract geometric FORMS as shape inspiration (not letterform reference) — use this to explore what the overall composition silhouette could feel like before committing to construction
- Generate texture and surface quality reference for how a debossed/engraved mark looks on chrome (use for the presentation mockup context)
- Generate decorative ornamental elements (small diamond separators, thin rule details) that could complement the mark

**MJ prompts for geometric form inspiration (NOT mark generation):**
```
abstract geometric mark, three unified flat shapes, grid-based construction, shared edges, consistent single stroke weight, negative space within form, black on white, flat 2D, minimal, luxury --ar 1:1 --style raw --v 6.1 --no calligraphy, swash, organic curves, gradients
```
```
Bauhaus geometric monogram, letters as pure geometric forms, shared strokes, architectural construction, single weight line, abstract, luxury beauty brand, flat black on white --ar 1:1 --style raw --v 6.1 --no calligraphy, loops, script, gradients
```

Use these as *loose form reference* — take the overall silhouette or a spatial relationship you like, then construct your actual mark from scratch in Figma using that as a guide.

---

## The Illustrator question

You don't need to master Illustrator to get through concept presentation. Here's where it actually matters:

| Stage | Tool | Why |
|-------|------|-----|
| Concept generation (calligraphic) | Midjourney + Firefly | Speed, quantity, reference |
| Concept construction (geometric) | **Figma** ← your skill | Pen tool + boolean ops is enough |
| Vector output (calligraphic) | Firefly Text to Vector | Clean SVGs without drawing |
| Composition + layout | **Figma** | You already know this |
| Concept presentation | **Figma** | Same file, export PDF |
| **Final production file** | Illustrator | This comes later — after direction is approved |
| Supplier-ready artwork | Illustrator | Only needed for print files |

The Illustrator requirement is real — but it's at the *end*, not the *beginning*. For concept development, Figma + Firefly SVGs is a legitimate professional workflow.

---

## Adobe Firefly "Workflows" (what you found)

If you're seeing "Workflows" in Firefly, this is the **Firefly Workflows** feature in Adobe's Creative Cloud desktop app or Firefly for Enterprise. It lets you set up multi-step generation pipelines — e.g., generate concept → apply style reference → output to specific format.

For this project, the most useful Firefly features:

| Feature | Where | What it does |
|---------|-------|--------------|
| **Text to Vector** | firefly.adobe.com | Generates SVG directly from prompt |
| **Structure Reference** | Text to Image / Text to Vector | Upload reference image to guide shape |
| **Style Reference** | Text to Image | Upload mood/style references to define aesthetic |
| **Generative Fill** (Photoshop) | Photoshop | Fill/extend/modify raster images |
| **Text to Image** | firefly.adobe.com | Standard image generation with Adobe IP protection |
| **Generate Similar** | In-app | Once you have a result you like, generate variations |

**For mark development specifically:** Start with **Text to Vector**. It's the only AI tool that directly outputs production-usable vector art without a tracing step.

---

## Compiling your reference material

You already have references scattered across Figma, Pinterest, and Drive. Here's a fast way to consolidate without losing the session to admin:

**Don't reorganise references right now.** That's a different task. Instead:

For today's session, use three things:
1. **The three confirmed reference marks** Anh said she liked: SRA SRA, Loewe, JB monogram — screenshot or save these to your desktop as `ref-sraSRA.png`, `ref-loewe.png`, `ref-jb.png`
2. These become your **Structure Reference uploads** in Firefly
3. That's enough to run a productive generation session

After concepts are presented and a direction is approved — *then* organise the full reference library.

---

## If this session still doesn't produce a mark you're happy with

That's not failure. The problem might be one of these:

**Option A — The brief is fighting itself.** Anh likes SRA SRA (structured) and Loewe (fluid/geometric) — these are different construction types. If you can't reconcile them in one mark, that's a conversation to have with Anh at presentation, not a design problem to solve alone. Present both directions, let her choose.

**Option B — You're over-filtering.** At concept stage, a mark doesn't need to be finished — it needs to communicate direction. A rough first-pass Figma construction that captures the right *register* is a valid concept to present alongside a direction description.

**Option C — Scope the mark differently.** If the mark is still blocking at end of session, present the wordmark (Aktiv Grotesk Extended "ALT.") as the primary mark — it already works and is confirmed — and position the secondary mark as a phase 2 refinement once packaging details are locked. This is a defensible professional position given the client-side blockers. The wordmark IS the identity at this stage.

---

## Quick reference: what each tool is best for

| Tool | Strength | Use for this project |
|------|----------|---------------------|
| **Midjourney** | Wide exploration, aesthetic quality | Directions A, B, C-cartouche — calligraphic/organic territory |
| **Adobe Firefly Text to Vector** | SVG output, IP-safe, Adobe integrated | Clean up best MJ calligraphic results → SVG |
| **Figma** | Layout, construction, presentation | Geometric monogram construction + all composition + presentation |
| **Vectorizer.ai** | Raster → vector conversion | Last resort if Firefly Text to Vector misses |
| **Illustrator** | Production-grade vectors, export | Only needed for final print-ready files |
| **Photoshop** | Texture, surface quality mockups | Chrome tube mockups — later |

---

## Links

- Figma working file: https://www.figma.com/design/rvJZnrqjpW5zkOM9u80xZl/ALT.-COSMETICS-%7C-Identity-and-packaging
- Midjourney prompts: `projects/alt-cosmetics-mj-prompts.md`
- Adobe Firefly: https://firefly.adobe.com
- Vectorizer.ai: https://vectorizer.ai
- Identity references (Drive): https://drive.google.com/drive/folders/1fAx_tn0dimGJ69Y4N9vL6GmT_LwBrc8J
