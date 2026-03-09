# ALT. Cosmetics — Midjourney Prompts
# v4 — Updated 09 March 2026
# Aligned to three confirmed mark directions: A (Ancient/Carved), B (Victorian/Script), C (Architectural/Art Deco/SRA SRA)

*Copy-paste ready.*

---

## How to use image references (web UI)

The MJ web UI (midjourney.com/imagine) has three drop zones in the prompt bar:

- **Image Prompts** — influences composition and elements. Use sparingly for marks.
- **Style References** ← use this one. Drag reference images directly here. Controls aesthetic/visual style.
- **Character References** — likeness matching. Not relevant for brand marks.

**Drag images straight into Style References** — no URL wrangling needed. Multiple images can be dropped in; MJ blends them.

**MJ Moodboards (left sidebar → "Moodboards"):** Build a moodboard inside MJ from any images you've generated or uploaded. You can then attach it directly to a prompt via Style References. This is the closest thing to "linking a moodboard" — keep one moodboard per direction (A, B, C).

**Pinterest:** Individual pin images work — right-click a pin → "Open image in new tab" → drag that tab's image into the Style References zone. Board URLs still don't work.

**Figma moodboard:** Export as PNG → drag into Style References. Simplest path.

**`--sw` values:**
- `--sw 100` — style reference has strong influence (recommended for mark ideation)
- `--sw 50` — style reference has light influence (text prompt dominates)

---

## Workflow

**Phase 1 — Direction finding (run first):**
Run one anchor prompt per direction: A1, B1, C1. Evaluate those ~12 images. Pick the strongest result in each direction.

**Phase 2 — Direction drilling (run second):**
Use `--seed [number]` from your strongest image to stay in that neighbourhood. Run A2–A4, B2–B4, C2–C4 only for the directions worth pursuing.

**Phase 3 — Wordmark (run alongside marks):**
Group 1 prompts give you typographic style references — not final assets. Set the actual "ALT." wordmark in Illustrator using Aktiv Grotesque. MJ cannot reliably render specific text.

**Phase 4 — 3D chrome mockups (after mark is confirmed):**
Groups 4A–4C only. Do not run these until a mark is confirmed and redrawn in Illustrator.

---

## GROUP A — Direction A: Ancient / Carved / Archaeological

*Goal: raw, stone-carved quality. Egyptian scarab seal, ancient intaglio gem, something found not made. Incised into the surface. All flat, black on white.*

**How to anchor this direction with `--sref`:**
Find a reference image of an Egyptian scarab seal, ancient intaglio gem, or Mesopotamian cylinder seal impression. Drag into MJ chat, get the URL, replace `[PASTE_SREF_URL_HERE]` below.

**A1 — Scarab / intaglio seal** *(anchor prompt — run first)*
```
logo mark design, ancient carved seal, intaglio gem quality, Egyptian scarab oval, incised stone mark, archaic symbol, primitive elegance, flat 2D, black on white, worn surface quality, beauty brand identity --sref [PASTE_SREF_URL_HERE] --sw 100 --ar 1:1 --style raw --v 6.1 --chaos 25 --no gradients, shading, drop shadow, 3D rendering, photographic, embossed, engraved, raised, dimensional, modern design, clean geometry, modern minimalism, celtic, knotwork
```

**A2 — Stone tablet fragment**
```
brand mark design, ancient stone tablet inscription, carved letterform fragment, archaeological artefact quality, raw incised mark, pre-modern seal, organic irregular edges, flat 2D, black on white, primitive hand-cut quality, luxury beauty --sref [PASTE_SREF_URL_HERE] --sw 100 --ar 1:1 --style raw --v 6.1 --chaos 25 --no gradients, shading, drop shadow, 3D rendering, photographic, embossed, raised, dimensional, modern design, clean geometry, celtic, knotwork
```

**A3 — Wax seal, archaeological register**
```
logo mark design, ancient wax seal impression, worn stamp quality, archaic carved symbol, stone or clay pressed mark, beauty brand, flat 2D, black on white, incised texture, looks like it could be 3000 years old, primitive authority --sref [PASTE_SREF_URL_HERE] --sw 100 --ar 1:1 --style raw --v 6.1 --chaos 25 --no gradients, shading, drop shadow, 3D rendering, photographic, embossed, raised, dimensional, modern, celtic, knotwork
```

**A4 — Abstract / dissolved**
```
logo mark design, ancient carved abstract symbol, dissolved letterform, incised stone surface, archaeological fragment, beauty brand mark, flat 2D, black on white, worn, primitive, no readable letters, pure mark quality --sref [PASTE_SREF_URL_HERE] --sw 100 --ar 1:1 --style raw --v 6.1 --chaos 25 --no gradients, shading, drop shadow, 3D rendering, photographic, embossed, raised, dimensional, modern, celtic, knotwork
```

---

## GROUP B — Direction B: Victorian / Script / Medieval

*Goal: ornate calligraphic construction, fine line, Victorian penmanship register. Mauclot monogram sheet is the primary reference — interlocking looped letterforms, weight variation, fluid curves.*

**How to anchor this direction with `--sref`:**
Upload your Mauclot monogram sheet reference to MJ chat, get the URL, replace `[PASTE_SREF_URL_HERE]` below. This will do more than any text rewrite.

**B1 — Victorian monogram, Mauclot register** *(anchor prompt — run first)*
```
logo mark design, Victorian monogram, calligraphic interlocking letterforms, Mauclot penmanship style, ornate swash construction, weight variation, fluid curves, heritage script quality, beauty brand, flat 2D, black on white, fine line --sref [PASTE_SREF_URL_HERE] --sw 100 --ar 1:1 --style raw --v 6.1 --chaos 25 --no gradients, shading, drop shadow, 3D rendering, photographic, embossed, raised, dimensional, geometric shapes, modern, celtic, knotwork
```

**B2 — Medieval manuscript initial**
```
brand mark design, medieval illuminated manuscript initial, ornate calligraphic letter, fine line decorative construction, heritage penmanship register, beauty brand identity, flat 2D, black on white, fluid stroke weight, historically rooted --sref [PASTE_SREF_URL_HERE] --sw 100 --ar 1:1 --style raw --v 6.1 --chaos 25 --no gradients, shading, drop shadow, 3D rendering, photographic, embossed, raised, dimensional, geometric shapes, modern minimalism, celtic, knotwork
```

**B3 — Victorian wax seal, script interior**
```
logo mark design, Victorian style wax seal, calligraphic script interior, ornate swash letterforms inside oval frame, fine line quality, heritage beauty brand, flat 2D, black on white, penmanship tradition --sref [PASTE_SREF_URL_HERE] --sw 100 --ar 1:1 --style raw --v 6.1 --chaos 25 --no gradients, shading, drop shadow, 3D rendering, photographic, embossed, raised, dimensional, art deco, geometric construction, celtic, knotwork
```

**B4 — Abstract / dissolved**
```
logo mark design, Victorian calligraphic abstract mark, dissolved ornate letterform, fine line swash construction, beauty brand, flat 2D, black on white, no readable letters, pure calligraphic mark quality, Victorian penmanship register --sref [PASTE_SREF_URL_HERE] --sw 100 --ar 1:1 --style raw --v 6.1 --chaos 25 --no gradients, shading, drop shadow, 3D rendering, photographic, embossed, raised, dimensional, geometric, modern, celtic, knotwork
```

---

## GROUP C — Direction C: Architectural / Art Deco / SRA SRA

*Goal: formal oval cartouche, letters or elements positioned as separate structured elements within a frame. SRA SRA territory — letters at compass points inside a double-ring oval with ornamental centrepiece.*

**How to anchor this direction with `--sref`:**
Upload your SRA SRA reference image to MJ chat, get the URL, replace `[PASTE_SREF_URL_HERE]` below.

**C1 — SRA SRA oval cartouche** *(anchor prompt — run first)*
```
logo mark design, formal oval cartouche, letters positioned at compass points inside double-ring border, architectural composition, ornamental centrepiece, SRA SRA register, art deco oval seal, beauty brand, flat 2D, black on white, structured, geometric --sref [PASTE_SREF_URL_HERE] --sw 100 --ar 1:1 --style raw --v 6.1 --chaos 25 --no gradients, shading, drop shadow, 3D rendering, photographic, embossed, raised, dimensional, calligraphy, script, celtic, knotwork
```

**C2 — Art deco architectural seal**
```
brand mark design, art deco oval seal, formal architectural frame, letters as positioned elements, double ring border, geometric interior centrepiece, luxury beauty brand, flat 2D, black on white, structured composition, authoritative --sref [PASTE_SREF_URL_HERE] --sw 100 --ar 1:1 --style raw --v 6.1 --chaos 25 --no gradients, shading, drop shadow, 3D rendering, photographic, embossed, raised, dimensional, calligraphy, script, celtic, knotwork
```

**C3 — Geometric shared-stroke monogram**
```
logo mark design, geometric monogram, letters sharing strokes, unified flat graphic form, single consistent line weight, high contrast, no ornament, no container, pure letterform architecture, art deco Bauhaus lineage, beauty brand, black on white, flat 2D --sref [PASTE_SREF_URL_HERE] --sw 100 --ar 1:1 --style raw --v 6.1 --chaos 25 --no gradients, shading, drop shadow, 3D rendering, photographic, embossed, raised, dimensional, calligraphy, ornament, frame, oval, celtic, knotwork
```

**C4 — Abstract / dissolved**
```
logo mark design, abstract art deco oval mark, dissolved geometric elements inside formal cartouche frame, no readable letters, architectural composition, double ring border, beauty brand, flat 2D, black on white, structured abstract quality --sref [PASTE_SREF_URL_HERE] --sw 100 --ar 1:1 --style raw --v 6.1 --chaos 25 --no gradients, shading, drop shadow, 3D rendering, photographic, embossed, raised, dimensional, calligraphy, script, celtic, knotwork
```

---

## GROUP 1 — Typographic Style Reference

> **Note:** MJ cannot reliably render specific text. These prompts are for typographic style and editorial register — not final wordmark assets. Once you have a direction you like, set "ALT." in Aktiv Grotesque in Illustrator and apply the weight/tracking/spacing that matches the reference output.

**1A — Extended, wide tracking**
```
typographic wordmark aesthetic, all caps extended sans-serif, wide letter-spacing, editorial fashion brand, monochrome black on white, flat 2D, restrained minimal, luxury beauty, Prada-adjacent editorial register --ar 3:1 --style raw --v 6.1 --chaos 15 --no decorative elements, illustration, icons, gradients, shading
```

**1B — Period as a design element**
```
typographic wordmark aesthetic, all caps extended sans-serif, oversized full stop anchoring the composition, wide tracking, editorial, monochrome, minimal luxury beauty brand register, flat 2D --ar 3:1 --style raw --v 6.1 --chaos 15 --no icons, illustration, gradients, shading, drop shadow
```

**1C — Bold, high contrast**
```
typographic wordmark aesthetic, bold condensed sans-serif, all caps, tight tracking, stark black on white, fashion-editorial, high contrast, luxury cosmetics, Alaïa-adjacent register, flat 2D --ar 3:1 --style raw --v 6.1 --chaos 15 --no gradients, shading, drop shadow, decoration
```

---

## GROUP 4 — 3D Chrome Tube Mockups (AFTER mark is confirmed — chrome only)

*Only run these once a mark direction has been chosen and redrawn in Illustrator. These are presentation renders, not mark development.*

**4A — Chrome tube, minimal**
```
cosmetic serum tube product mockup, chrome metallic finish, minimalist label, wordmark in white hot-stamp quality, all caps extended sans-serif, white studio background, editorial beauty photography, luxury, clean, high contrast, product shot --ar 2:3 --style raw --v 6.1 --no busy background, props, flowers, matte finish
```

**4B — Chrome with secondary packaging**
```
luxury cosmetics product flatlay, chrome serum tube and minimal outer packaging, silver and white, editorial fashion photography, clean white background, considered composition, premium beauty brand, reflective chrome --ar 4:5 --style raw --v 6.1 --no clutter, flowers, props, matte finish
```

**4C — Chrome, contextual counter shot**
```
luxury cosmetics chrome serum tube on bathroom counter, editorial beauty photography, warm neutral stone surface, reflective chrome tube, white studio, morning light quality, product photography --ar 4:5 --style raw --v 6.1 --no flowers, props, clutter, matte finish
```

---

## Variation tips

If a result is close but not quite right, use `--seed [number from that image]` to stay in that neighbourhood. Drop `--chaos` to 5 when drilling a specific result.

**To push Direction A further:** add `ancient Egyptian intaglio` or `pre-Columbian seal` or `Mesopotamian cylinder seal`
**To push Direction B further:** add `copperplate engraving` or `Victorian penmanship` or `Spencerian script`
**To push Direction C further:** add `art deco medallion` or `Bauhaus monogram` or `constructivist emblem`
**To push chrome materiality in mockups:** add `polished aluminium` or `mirror finish` or `chrome cosmetics`

---

## After Midjourney — Illustrator steps

1. Screenshot 2–3 strongest results per direction
2. Import as reference layer in Illustrator, opacity ~30%
3. Redraw from scratch using rectangles/paths — do not trace
4. Test at small sizes (20px) — if it breaks it's not working
5. Set wordmark in Aktiv Grotesque — do not source type from MJ output
6. Present as 3 distinct directions, not variations of one
