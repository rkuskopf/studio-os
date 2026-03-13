# ALT. Cosmetics — Mark Development Workshop
# How to use AI to go from 20 ideas to executed concepts today

**Status:** Active — use this doc to run your mark development session  
**Deadline:** ~20 March 2026  
**Where we are:** Three confirmed directions (A/B/C). Client preferences confirmed. Prompts written. Execution blocked.

---

## The actual problem (and the fix)

You're not blocked because you lack ideas. You're blocked because the jump from "AI generates an image" to "I have a usable mark" has never been clearly defined. This doc closes that gap.

**The pipeline is:**

```
Direction brief → Midjourney generates concepts → Pick strongest 2–3 per direction
→ Adobe Firefly Text to Vector cleans them up → Figma for composition/layout
→ One round of Illustrator for final vector cleanup (optional at this stage)
```

You already know Figma. Firefly Vector outputs actual SVGs. You don't need to draw in Illustrator to get through concept stage.

---

## What's already done (don't redo this)

- ✅ Three mark directions defined (A: Ancient/Carved, B: Victorian/Script, C: Architectural/Art Deco)
- ✅ Client preferences confirmed: abstract and flowing, structured container + organic interior, NOT rigid or masculine
- ✅ Sweet spot identified: structured oval/circle container + flowing letterforms inside (SRA SRA structure + Loewe fluidity)
- ✅ All Midjourney prompts written → `projects/alt-cosmetics-mj-prompts.md`
- ✅ Figma working file exists (see Key Assets in `alt-cosmetics.md`)

---

## Today's session plan (3–4 hours to get concept-ready)

### Hour 1 — Generate (Midjourney)

1. Open `projects/alt-cosmetics-mj-prompts.md`
2. Run all prompts in **GROUP B** (Victorian/Script) — this aligns most directly with what Anh liked (Loewe, JB monogram, flowing/abstract)
3. Run all prompts in **GROUP C** (Architectural/Art Deco) — SRA SRA is directly what she liked
4. Run **GROUP A** last — lower priority given her feedback, but still worth a pass

**How to run in parallel:** Open three Midjourney conversations simultaneously (or use `/imagine` in three separate Discord threads). Don't wait for one to finish before starting the next.

**What you're looking for after generation:**
- Pick the **1–2 strongest per direction** — not the prettiest, the one with the best *structure*
- Does the overall form read at small size? (mentally squint at it)
- Is there a container + interior relationship that feels right?
- Does it feel like it could be debossed/engraved? (minimal fine lines = more practical)

---

### Hour 2 — Refine with Adobe Firefly

**Why Firefly for this step (not just Midjourney):**
Firefly has two features that make it far better for mark refinement than Midjourney:
1. **Structure Reference** — upload your Midjourney output as structural reference, write a new prompt to clean it up, tighten the form
2. **Generate Vector** (Firefly for Illustrator) — outputs actual SVG/vector art, not a raster image. This means you skip the tracing step entirely.

**Firefly Text to Vector workflow:**

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
5. This gets you a cleaner, more logo-appropriate result

**Condensed prompts for Firefly (simpler than MJ):**

Direction B (Victorian/Script):
```
Victorian monogram, interlocking calligraphic letterforms A-L-T, organic flowing swash construction, fine line, black on white, suitable for debossing, no background
```

Direction C (Architectural/Cartouche):
```
Art deco oval seal mark, structured oval border, abstract flowing letterforms inside, fine line, luxury beauty brand, black on white, clean vector quality
```

Direction A (Ancient/Carved):
```
Ancient carved seal mark, archaic symbol, worn incised stone quality, oval form, black on white, flat logo, primitive elegance
```

---

### Hour 3 — Compose in Figma

This is where your skill set takes over. You don't need Illustrator for this stage.

**Setup:**
1. Create a new frame in your ALT. working Figma file: `1200×1200px`, white background
2. Import your best AI outputs (Firefly SVGs directly, or screenshots of MJ outputs)
3. For Firefly SVGs: drag the SVG file into Figma — it imports as editable vector paths

**What to do in Figma:**
- Try the mark at three sizes: 24px, 48px, and 200px. Anything that falls apart at 24px is too complex.
- Pair each mark draft with the wordmark (Aktiv Grotesk Extended, all caps "ALT.") — vertical and horizontal arrangements
- Check it inverted (white mark on black) — it will be hot-stamped on chrome, so this is the actual use case
- Use Figma's **flatten** function to treat SVG paths as shapes — you can nudge, simplify, or combine paths without Illustrator

**For Firefly SVGs that need cleanup:**
- Delete individual nodes you don't want (Figma handles this)
- Use **Union** or **Subtract** to clean up overlapping shapes
- Scale proportionally — check for minimum 5mm reproducibility at small scale

---

### Hour 4 — Build the concept presentation

Present three directions with 2–3 mark options each:

**Per direction, show:**
- Mark in isolation (black on white, square crop)
- Mark reversed (white on black)
- Mark + wordmark lockup (horizontal)
- Mark small (simulated tube deboss size — approximately 8–10mm equivalent)

**Don't over-present.** Three directions, two marks each, is six decisions. Keep it tight. Use Figma's presentation mode or export as PDF.

---

## The Illustrator question

You don't need to master Illustrator to get through concept presentation. Here's where it actually matters:

| Stage | Tool | Why |
|-------|------|-----|
| Concept generation | Midjourney + Firefly | Speed, quantity, reference |
| Vector output | Firefly Vector or Vectorizer.ai | Clean SVGs without drawing |
| Composition + layout | **Figma** ← your skill | You already know this |
| Concept presentation | **Figma** | Same file, export PDF |
| **Final production file** | Illustrator | This comes later — after direction is approved |
| Supplier-ready artwork | Illustrator | Only needed for print files |

The Illustrator requirement is real — but it's at the *end*, not the *beginning*. For concept development, Figma + Firefly SVGs is a legitimate professional workflow. If the direction is approved and you need clean Illustrator files for print, that's a defined, contained task (and the AI-generated vector gives you a head start).

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

**Option A — The brief is fighting itself.** Anh likes SRA SRA (structured) and Loewe (fluid) — these are genuinely opposite registers. If you can't reconcile them in one mark, that's a conversation to have with Anh at presentation, not a design problem to solve alone. Present both directions, let her choose.

**Option B — You're over-filtering.** At concept stage, a mark doesn't need to be finished — it needs to communicate direction. A rough AI output that captures the right *feeling* is a valid concept to present alongside a direction description.

**Option C — Scope the mark differently.** If the mark is still blocking at end of session, present the wordmark (Aktiv Grotesk Extended "ALT.") as the primary mark — it already works and is confirmed — and position the secondary mark as a phase 2 refinement once packaging details are locked. This is a defensible professional position given the client-side blockers.

---

## Quick reference: what each tool is best for

| Tool | Strength | Use for this project |
|------|----------|---------------------|
| **Midjourney** | Wide exploration, variety, aesthetic quality | Generate initial concepts across directions |
| **Adobe Firefly** | Vector output, IP-safe, Adobe integrated | Clean up best MJ results, generate final SVGs |
| **Figma** | Layout, composition, presentation | Combine elements, build presentation, check sizes |
| **Vectorizer.ai** | Raster → vector conversion | Last resort if Firefly Vector misses |
| **Illustrator** | Production-grade vectors, export | Only needed for final print-ready files |
| **Photoshop** | Texture, surface quality mockups | Chrome tube mockups — later |

---

## Links

- Figma working file: https://www.figma.com/design/rvJZnrqjpW5zkOM9u80xZl/ALT.-COSMETICS-%7C-Identity-and-packaging
- Midjourney prompts: `projects/alt-cosmetics-mj-prompts.md`
- Adobe Firefly: https://firefly.adobe.com
- Vectorizer.ai: https://vectorizer.ai
- Identity references (Drive): https://drive.google.com/drive/folders/1fAx_tn0dimGJ69Y4N9vL6GmT_LwBrc8J
