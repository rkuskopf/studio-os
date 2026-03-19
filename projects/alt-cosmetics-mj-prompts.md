# ALT. Cosmetics — Midjourney Prompts
# v3 — Updated 13 March 2026
# Directions updated: D (Baroque Cartouche), E (Ferronnerie/Wrought Iron) added from Friday exploration
# Note on Anagram/Loewe direction: DO NOT USE MIDJOURNEY. See Group F note below.
# Previous: A (Ancient/Carved), B (Victorian/Script), C (Architectural/Art Deco/SRA SRA)

*Copy-paste ready. Run GROUP A, B, and C in parallel to generate wide coverage across all three directions before committing to any one.*

**Workflow:**
1. Run Groups A, B, C to generate 2D mark directions across all three territories → pick strongest 1–2 per direction
2. Run Group 1 (wordmark) to explore typographic lockups alongside
3. Groups 4–5 (3D chrome tube mockups) come later, once mark is confirmed — chrome finish only

---

## Getting 2D assets ready — Plan + Firefly prompts

*Three assets from Figma need to be converted into clean, usable 2D vector elements before logo design can proceed. This section explains the workflow for each one and provides Adobe Firefly prompts to assist.*

---

### Asset 1 — 2D vectors of lace
[Figma frame: node 32-19](https://www.figma.com/design/rvJZnrqjpW5zkOM9u80xZl/ALT.-COSMETICS-%7C-Identity-and-packaging?node-id=32-19&t=1dVS95InZLuGVRa1-4)

**What it is:** Lace/textile pattern elements intended for use as a decorative motif in the logo or supporting brand assets.

**Plan:**
1. Export the lace frame from Figma at 2× or 4× as a high-res PNG (File → Export, no background)
2. Open in Adobe Illustrator → Object → Image Trace → Preset: "High Fidelity Photo" or "Black and White Logo"
3. Expand the trace → Ungroup → Delete any background fills, keep only the lace paths
4. Simplify paths (Object → Path → Simplify) to reduce anchor points without losing detail
5. Test at small sizes (logo scale, ~30–50px) — if lace dissolves it may need to be redrawn more selectively
6. Save as `.svg` and `.ai` — ready for logo layout

**If the source Figma frame is not clean enough to trace directly, use Firefly first:**

**Firefly — Text to Image (use as trace reference):**
```
flat 2D lace pattern, botanical fine line, delicate textile lace motif, high contrast, pure black on white background, isolated, no shadows, no gradients, suitable for vectorisation, beauty brand decorative element, editorial luxury, Victorian needle lace
```

```
close-up flat lace textile detail, black on white, fine thread construction, delicate open weave, ornate floral lace, isolated single motif suitable for logo use, no background, high contrast, vector-ready
```

**Firefly — Generative Fill (Photoshop, if cleaning up an existing Asana/Figma export):**
- Select any muddy or low-contrast areas → Generative Fill → prompt: `clean high contrast lace detail, black on white, fine thread, no background`

---

### Asset 2 — Ornamental elements for 2D logo design
[Figma frame: node 32-24](https://www.figma.com/design/rvJZnrqjpW5zkOM9u80xZl/ALT.-COSMETICS-%7C-Identity-and-packaging?node-id=32-24&t=1dVS95InZLuGVRa1-4)

**What it is:** Decorative ornament elements (flourishes, dividers, borders, centrepiece motifs) to be used as raw material for the 2D logo layout.

**Plan:**
1. Export each ornament element from Figma individually as SVG (right-click frame → Copy as SVG, or export panel)
2. Paste into Illustrator — if they are already vectors in Figma they will come through clean
3. If they came through as raster: Image Trace as above, then Expand + clean paths
4. Build a small library of individual ornament elements — each on its own artboard, black on white
5. These become the ingredient set for logo composition: combine with letterforms in logo layout files

**If generating new ornament elements with Firefly:**

**Firefly — Text to Image:**
```
single decorative ornament, Victorian divider flourish, black on white, flat 2D, isolated, symmetrical, fine line, ornate but restrained, suitable for logo use, beauty brand, no background, high contrast
```

```
art deco ornamental centrepiece, geometric floral motif, formal symmetry, black on white, flat vector quality, isolated, luxury cosmetics brand element, no shading, no gradients, suitable for embossing or hot stamp
```

```
heritage border element, thin line ornamental rule, Victorian penmanship flourish, calligraphic swash, isolated on white, flat 2D, black ink quality, fine line, no background
```

**Firefly — Text to Vector (Illustrator beta, if available):**
- Open Illustrator → Window → Text to Vector → type prompt: `Victorian ornamental flourish, symmetrical, fine line, black, suitable for logo use`
- This outputs a native Illustrator vector — no tracing step needed

---

### Asset 3 — Turn 3D renders into flat 2D versions ready for logo
[Figma frame: node 52-120](https://www.figma.com/design/rvJZnrqjpW5zkOM9u80xZl/ALT.-COSMETICS-%7C-Identity-and-packaging?node-id=52-120&t=1dVS95InZLuGVRa1-4)

**What it is:** 3D rendered mark concepts (likely Midjourney outputs shown on a chrome tube) that need to be extracted and redrawn as clean, scalable flat 2D vectors — the actual logo files.

**This is the most important step in the current workflow.** The 3D renders are ideation material, not final assets. The logo mark must be a clean vector.

**Plan:**
1. Export each 3D render from Figma as a PNG at 4× resolution
2. Open in Illustrator — place as a reference layer, lock it, reduce opacity to 25–35%
3. On a new layer above: manually redraw the core mark shape using the Pen tool — paths and rectangles only, no tracing
4. Strip everything back to the essential form — no chrome, no tube, no shadows, just the flat mark
5. Work in pure black on white. Single colour. No gradients
6. Test at 20px — if it holds it's logo-ready. If it falls apart, simplify further
7. Export as `.svg`, `.eps`, and `.pdf` — one artboard per mark direction

**If using Firefly to generate a flat reference before redrawing:**

**Firefly — Text to Image (for each mark direction):**

*Direction A (Ancient/Carved):*
```
flat 2D logo mark, ancient carved intaglio seal, Egyptian scarab oval, incised stone quality, black on white, no 3D, no chrome, no shadows, no gradients, pure flat vector-ready form, luxury beauty brand
```

*Direction B (Victorian/Script):*
```
flat 2D logo mark, Victorian monogram, calligraphic interlocking letterforms, fine line ornate construction, black on white, no 3D, no chrome, no shadows, pure flat vector-ready form, luxury beauty brand
```

*Direction C (Architectural/Art Deco):*
```
flat 2D logo mark, art deco oval cartouche, letters at compass points inside double ring border, geometric interior motif, black on white, no 3D, no chrome, no shadows, pure flat vector-ready form, luxury beauty brand
```

**Firefly — Remove Background + flatten (Photoshop, before bringing into Illustrator):**
1. Open 3D render in Photoshop → Remove Background (one click in Properties panel)
2. Desaturate → Levels adjustment to force high contrast (black mark, white ground)
3. Export as clean PNG → bring into Illustrator as trace reference

---

### Summary: Which tool for which task

| Asset | Recommended tool | Notes |
|-------|-----------------|-------|
| Lace vectors (32-19) | Illustrator Image Trace | Use Firefly only if source is too low-res or muddy |
| Ornamental elements (32-24) | Export SVG direct from Figma | Use Firefly Text to Vector if generating new ornaments |
| 3D renders → flat 2D (52-120) | Manual redraw in Illustrator | Never trace 3D renders — always redraw. Firefly useful for generating a flattened reference first |

---

---

## GROUP A — Direction A: Ancient / Carved / Archaeological

*Goal: raw, stone-carved quality. Think Egyptian scarab seal, ancient intaglio gem, something found not made. Incised into the surface. All flat, black on white — no 3D, no gradients.*

**A1 — Scarab / intaglio seal**
```
logo mark design, ancient carved seal, intaglio gem quality, Egyptian scarab oval, incised stone mark, archaic symbol, primitive elegance, flat 2D, black on white, worn surface quality, beauty brand identity, no modern design --ar 1:1 --style raw --v 6.1 --no gradients, shadows, clean geometry, modern minimalism, celtic, knotwork
```

**A2 — Stone tablet fragment**
```
brand mark design, ancient stone tablet inscription, carved letterform fragment, archaeological artefact quality, raw incised mark, pre-modern seal, organic irregular edges, flat 2D, black on white, primitive hand-cut quality, luxury beauty --ar 1:1 --style raw --v 6.1 --no modern design, gradients, shadows, clean geometry, celtic, knotwork
```

**A3 — Wax seal, archaeological register**
```
logo mark design, ancient wax seal impression, worn stamp quality, archaic carved symbol, stone or clay pressed mark, beauty brand, flat 2D, black on white, incised texture, looks like it could be 3000 years old, primitive authority --ar 1:1 --style raw --v 6.1 --no gradients, 3D, shadows, modern, celtic, knotwork
```

**A4 — Abstract / dissolved (legibility axis: abstract end)**
```
logo mark design, ancient carved abstract symbol, dissolved letterform, incised stone surface, archaeological fragment, beauty brand mark, flat 2D, black on white, worn, primitive, no readable letters, pure mark quality --ar 1:1 --style raw --v 6.1 --no gradients, shadows, modern, celtic, knotwork
```

---

## GROUP B — Direction B: Victorian / Script / Medieval

*Goal: ornate calligraphic construction, fine line, Victorian penmanship register. Mauclot monogram sheet is the primary reference — interlocking looped letterforms, weight variation, fluid curves. NOT architectural, NOT geometric. Decorative but considered.*

**B1 — Victorian monogram, Mauclot register**
```
logo mark design, Victorian monogram, calligraphic interlocking letterforms, Mauclot penmanship style, ornate swash construction, weight variation, fluid curves, heritage script quality, beauty brand, flat 2D, black on white, fine line, no geometric shapes --ar 1:1 --style raw --v 6.1 --no gradients, shadows, geometric, modern, celtic, knotwork
```

**B2 — Medieval manuscript initial**
```
brand mark design, medieval illuminated manuscript initial, ornate calligraphic letter, fine line decorative construction, heritage penmanship register, beauty brand identity, flat 2D, black on white, fluid stroke weight, historically rooted --ar 1:1 --style raw --v 6.1 --no gradients, shadows, geometric shapes, modern minimalism, celtic, knotwork
```

**B3 — Victorian wax seal, script interior**
```
logo mark design, Victorian style wax seal, calligraphic script interior, ornate swash letterforms inside oval frame, fine line quality, heritage beauty brand, flat 2D, black on white, penmanship tradition, not geometric --ar 1:1 --style raw --v 6.1 --no gradients, shadows, art deco, geometric construction, celtic, knotwork
```

**B4 — Abstract / dissolved (legibility axis: abstract end)**
```
logo mark design, Victorian calligraphic abstract mark, dissolved ornate letterform, fine line swash construction, beauty brand, flat 2D, black on white, no readable letters, pure calligraphic mark quality, Victorian penmanship register --ar 1:1 --style raw --v 6.1 --no gradients, shadows, geometric, modern, celtic, knotwork
```

---

## GROUP C — Direction C: Architectural / Art Deco / SRA SRA

*Goal: formal oval cartouche, letters or elements positioned as separate structured elements within a frame. SRA SRA territory — letters at compass points inside a double-ring oval with ornamental centrepiece. Art deco lineage. Also: geometric shared-stroke monogram construction.*

**C1 — SRA SRA oval cartouche**
```
logo mark design, formal oval cartouche, letters positioned at compass points inside double-ring border, architectural composition, ornamental centrepiece, SRA SRA register, art deco oval seal, beauty brand, flat 2D, black on white, structured, geometric --ar 1:1 --style raw --v 6.1 --no gradients, shadows, calligraphy, script, celtic, knotwork
```

**C2 — Art deco architectural seal**
```
brand mark design, art deco oval seal, formal architectural frame, letters as positioned elements, double ring border, geometric interior centrepiece, luxury beauty brand, flat 2D, black on white, structured composition, authoritative --ar 1:1 --style raw --v 6.1 --no gradients, shadows, calligraphy, script, celtic, knotwork
```

**C3 — Geometric shared-stroke monogram**
```
logo mark design, geometric monogram, letters sharing strokes, unified flat graphic form, single consistent line weight, high contrast, no ornament, no container, pure letterform architecture, art deco Bauhaus lineage, beauty brand, black on white, flat 2D --ar 1:1 --style raw --v 6.1 --no gradients, shadows, calligraphy, ornament, frame, oval, celtic, knotwork
```

**C4 — Abstract / dissolved (legibility axis: abstract end)**
```
logo mark design, abstract art deco oval mark, dissolved geometric elements inside formal cartouche frame, no readable letters, architectural composition, double ring border, beauty brand, flat 2D, black on white, structured abstract quality --ar 1:1 --style raw --v 6.1 --no gradients, shadows, calligraphy, script, celtic, knotwork
```

---

## GROUP D — Direction D: Baroque Cartouche / Ornamental Badge

*From Friday exploration. Goal: ornate oval or shield frame around the A letterform. "An emblem, a badge, recognising history, recognising the future." Contrast of decorative frame + restrained interior. Light touch — think 2D engraving quality, not 3D emboss.*

**D1 — Oval Baroque cartouche, engraving quality**
```
brand mark design, ornate Baroque oval cartouche, Rococo scrollwork border, elegant escutcheon frame, italic letter A centered inside, luxury beauty brand, flat 2D, black on white, fine line engraving quality, heritage mark, thin strokes --ar 1:1 --style raw --v 6.1 --no gradients, shadows, 3D embossing, modern minimalism, colour
```

**D2 — Heraldic shield / crest form**
```
brand mark design, minimalist heraldic shield crest, escutcheon form, crown and flourish ornaments, letter A as central element, luxury cosmetics brand, flat 2D, black on white, fine line weight, engraved quality, architectural groundedness, heritage --ar 2:3 --style raw --v 6.1 --no gradients, shadows, 3D, modern geometry, colour
```

**D3 — Rectangular Art Deco cartouche**
```
logo mark design, Art Deco rectangular label frame, double-rule border, architectural corner ornaments, letter A centered, restrained interior, premium beauty brand, flat 2D, black on white, geometric and decorative simultaneously, thin engraving lines --ar 2:3 --style raw --v 6.1 --no gradients, shadows, 3D, script, colour
```

**D4 — Cartouche, abstracted / no letterform**
```
brand mark design, ornate oval cartouche frame, Baroque scrollwork border, abstract interior symbol (no letters), luxury beauty brand, flat 2D, black on white, fine line engraving quality, emblem quality --ar 1:1 --style raw --v 6.1 --no gradients, shadows, 3D, letters, text, colour
```

**MJ image prompt tip for D:** Upload one of your Pinterest cartouche references as an image prompt with `--iw 0.8` — use it to give structure, let the text prompt refine the finish to 2D/flat.

---

## GROUP E — Direction E: Ferronnerie / Wrought Iron Letterform

*From Friday exploration. Goal: letter A built from curving wrought iron lines — acanthus scrollwork, botanical terminals, the ferronnerie d'art style. "Drawing an A diagram using this style of lines. curved. almost like a window iron." Can also be the A inside an iron oval frame.*

**E1 — Ferronnerie A letterform**
```
logo mark design, wrought iron letterform letter A, ferronnerie d'art style, acanthus scroll terminals at feet and crossbar, botanical ironwork curves, Art Nouveau wrought iron letter, flat 2D, black on white, fine line weight, handcrafted metal quality, beauty brand --ar 1:1 --style raw --v 6.1 --no gradients, shadows, 3D, geometric, modern, colour
```

**E2 — A inside iron oval frame**
```
brand mark design, letter A inside ornate wrought iron oval frame, ferronnerie acanthus scroll border, botanical ironwork surround, Art Nouveau metalwork badge, luxury beauty brand, flat 2D, black on white, fine line engraving quality --ar 1:1 --style raw --v 6.1 --no gradients, shadows, 3D, colour
```

**E3 — Wrought iron rosette / medallion (no letter)**
```
brand mark design, wrought iron rosette medallion, ferronnerie d'art, symmetrical cross form with acanthus scroll arms, botanical iron ornament, flat 2D, black on white, fine decorative line weight, standalone ornamental mark, beauty brand --ar 1:1 --style raw --v 6.1 --no gradients, shadows, 3D, letters, text, colour
```

**E4 — Art Deco window grille-inspired mark**
```
logo mark design, Art Deco window grille pattern abstracted as brand mark, geometric iron latticework, symmetrical floral terminals, architectural ornament quality, luxury beauty brand, flat 2D, black on white, fine line, structural and decorative simultaneously --ar 1:1 --style raw --v 6.1 --no gradients, shadows, 3D, colour
```

---

## GROUP F — ⚠️ Anagram / Loewe-Style Reflected Monogram

**DO NOT USE MIDJOURNEY FOR THIS DIRECTION.**

AI consistently misinterprets the reflected monogram construction — it produces atomic/orbital shapes or abstract blobs rather than the interlocking calligraphic letterform that makes the Loewe technique work.

**The correct approach is Illustrator — 20–30 minutes:**
1. Draw one arm: a single flowing calligraphic stroke representing the right diagonal of "A" (from apex to bottom-right foot). Use the Pen tool or start from a calligraphic font character.
2. Select the arm → Object → Transform → **Reflect → Vertical → Copy** (this gives you the left arm = the full A)
3. Select both arms → Object → Transform → **Reflect → Horizontal → Copy** (this gives you the inverted A below)
4. Adjust where they overlap at the top (apex) and at the crossbar
5. Vary stroke weight for calligraphic quality (Width Tool or a calligraphic brush)
6. Done

**Starting point:** Use Aktiv Grotesk Extended as a skeleton — type "A", convert to outlines, delete fill/add stroke, then run the reflect steps above. The geometric skeleton of that typeface will produce a clean result.

**Reference file:** See `mark-concepts/alt-mark-concepts.html` — Concept 01B (4-fold reflection) and 01C (rotational) are SVG sketches you can open in Illustrator as a starting point.

---

## GROUP 1 — Typographic Wordmark (run alongside mark groups)

**1A — Extended, wide tracking**
```
typographic logo design, wordmark only, text "ALT.", extended sans-serif, all caps, wide letter-spacing, editorial fashion brand, monochrome black on white, flat 2D, no shadows, no gradients, restrained minimal, luxury beauty, Prada-adjacent --ar 3:1 --style raw --v 6.1 --no decorative elements, illustration, icons
```

**1B — The period as a design element**
```
typographic logo design, wordmark "ALT" with oversized full stop period mark, extended sans-serif, all caps, wide tracking, the period anchors the composition, editorial, monochrome, minimal luxury beauty brand, flat --ar 3:1 --style raw --v 6.1 --no icons, illustration, gradients
```

**1C — Bold, high contrast**
```
typographic logo design, wordmark only, text "ALT.", bold condensed sans-serif, all caps, tight tracking, stark black on white, fashion-editorial, high contrast, luxury cosmetics, Alaïa-adjacent, flat 2D --ar 3:1 --style raw --v 6.1 --no gradients, shadows, decoration
```

---

## GROUP 4 — 3D Chrome Tube Mockups (AFTER mark is confirmed — chrome only)

*Only run these once a mark direction has been chosen and refined in Illustrator. These are presentation/context renders, not mark development.*

**4A — Chrome tube, minimal**
```
cosmetic serum tube product mockup, chrome metallic finish, minimalist label, "ALT." wordmark in white hot-stamp quality, all caps extended sans-serif, white studio background, editorial beauty photography, luxury, clean, high contrast, product shot --ar 2:3 --style raw --v 6.1 --no busy background, props, flowers, matte finish
```

**4B — Chrome with secondary packaging**
```
luxury cosmetics product flatlay, chrome serum tube and minimal outer packaging, silver and white, "ALT." wordmark, editorial fashion photography, clean white background, considered composition, premium beauty brand, reflective chrome --ar 4:5 --style raw --v 6.1 --no clutter, flowers, props, matte finish
```

**4C — Chrome, contextual counter shot**
```
luxury cosmetics chrome serum tube on bathroom counter, editorial beauty photography, warm neutral stone surface, "ALT." wordmark, reflective chrome tube, white studio, morning light quality, product photography --ar 4:5 --style raw --v 6.1 --no flowers, props, clutter, matte finish
```

---

## Variation tips

If a result is close but not quite right, use `--seed [number from that image]` to stay in that neighbourhood.

**To push Direction A further:** add `ancient Egyptian intaglio` or `pre-Columbian seal` or `Mesopotamian cylinder seal`
**To push Direction B further:** add `copperplate engraving` or `Victorian penmanship` or `Spencerian script`
**To push Direction C further:** add `art deco medallion` or `Bauhaus monogram` or `constructivist emblem`
**To push chrome materiality in mockups:** add `polished aluminium` or `mirror finish` or `chrome cosmetics`
**To warm up any result:** add `warm lighting` or `linen texture background` or `stone surface`

---

## Image Prompt pairings (for structure + surface quality simultaneously)

Use `--iw 1.5` when images should strongly guide structure.
Use `--iw 0.5` when text prompt should dominate and image is just surface/mood reference.

Paste Pinterest image URLs directly into MJ Image Prompts field — no download needed.

---

## After Midjourney — Illustrator steps

1. Screenshot 2–3 strongest results per direction
2. Import as reference layer in Illustrator, opacity ~30%
3. Redraw from scratch using rectangles/paths — do not trace
4. Test at small sizes (20px) — if it breaks it's not working
5. Present as 3 distinct directions, not variations of one
