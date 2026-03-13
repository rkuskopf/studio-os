# ALT. Cosmetics — Concept 1: Organic Monogram
# Production Workflow
# Updated: March 2026

**Goal:** Create a fluid, organic monogram mark — letters (A, L, T, or a combined form) entwined with botanical elements. Reference: [Figma node 24-203](https://www.figma.com/design/rvJZnrqjpW5zkOM9u80xZl/ALT.-COSMETICS-%7C-Identity-and-packaging?node-id=24-203&t=1dVS95InZLuGVRa1-1).

**End deliverable:** Clean black vector on white artboard in Illustrator. Scalable to 20px without falling apart.

---

## Overview

This is a three-stage process:

1. **Generate** — Use Nano Banana (primary) and Firefly (secondary) to rapidly explore organic monogram directions
2. **Evaluate** — Screenshot the strongest 2–3 results per tool and compare
3. **Vectorise** — Import best result into Illustrator as reference layer, redraw from scratch as clean paths

Do not trace. Do not use Image Trace. Redraw by hand using the Pen tool. The AI output is a structural reference only.

---

## Stage 1A — Nano Banana (Primary AI Tool)

Nano Banana uses Google's Gemini image model and handles flat 2D letterforms far better than Midjourney. Use it first.

**Where:** [nano-banana.ai](https://www.nano-banana.ai) or [nanobananaweb.com](https://nanobananaweb.com/logo)

**How to use:**
1. Open Nano Banana and select the image generation interface (not the logo-specific tool — the general image generator gives more control)
2. Paste one of the prompts below
3. Generate 4–6 variations per prompt
4. Screenshot the strongest 1–2 results

**Prompts — run these in order:**

**NB-1 — Letters entwined with botanical stems**
```
flat 2D vector logo mark, organic botanical monogram, the letters A L T woven into fine-line plant stems and tendrils, flowing stroke weight, delicate line, luxury beauty brand, black ink on white background, no fill, no colour, no gradients, no shadows, no 3D
```

**NB-2 — Seedhead emerging from letterforms**
```
flat 2D logo mark design, monogram mark for a luxury beauty brand, organic botanical illustration style, letterforms entwined with seedhead and fine plant stems, flowing natural curves, black on white, minimal, fine line, no geometric shapes, no gradients, no 3D
```

**NB-3 — Loose wreath construction**
```
flat 2D illustration, organic monogram mark, interlocking letters inside a loose open botanical wreath, fine stems and leaves, natural asymmetric composition, luxury cosmetics brand identity, black line art on white, no fill, no colour, no gradients
```

**NB-4 — Push toward abstract (use if letters are too literal)**
```
flat 2D abstract mark, organic botanical letterform, letters partially dissolved into plant forms, flowing natural lines, beauty brand logo mark, black ink on white, fine line botanical illustration style, no geometric shapes, no colour, no gradients
```

**Refine tip:** If a result is close, describe what you want to change and generate again. E.g. "same as above but more delicate, thinner lines, more open space between elements."

**Output to save:** Screenshot top 2 results → save to [Identity folder on Drive](https://drive.google.com/drive/folders/1fAx_tn0dimGJ69Y4N9vL6GmT_LwBrc8J?usp=drive_link) under `Direction D — Organic Monogram`

---

## Stage 1B — Adobe Firefly (Secondary AI Tool)

Use Firefly for a second pass with different outputs. Firefly's Text to Image handles painterly and illustrative styles well — useful for the fine-line botanical register.

**Where:** [firefly.adobe.com](https://firefly.adobe.com) → Text to Image

**How to use with the Figma reference:**

Firefly Text to Image does not accept URL references directly. To use the Figma design as a structural reference:

1. Open the Figma link: [node 24-203](https://www.figma.com/design/rvJZnrqjpW5zkOM9u80xZl/ALT.-COSMETICS-%7C-Identity-and-packaging?node-id=24-203&t=1dVS95InZLuGVRa1-1)
2. Take a screenshot of the monogram
3. In Firefly, select **Text to Image** → click the **Style Reference** icon (image icon in the prompt bar) → upload your screenshot
4. Set style reference strength to **medium** (50–60%) — high enough to guide structure, low enough to let the prompt drive it
5. Enter your text prompt below
6. Generate 4 variations

**Prompts:**

**FF-1**
```
organic monogram mark, flat 2D botanical illustration, interlocking letterforms entwined with fine plant stems and tendrils, black on white, luxury beauty brand, no gradients, no colour, fine line art
```

**FF-2 (if FF-1 is too painterly — add this to the prompt)**
```
vector illustration style, clean black line art, flat graphic, no texture, no shading
```

**Note on Firefly vs Illustrator AI:** The generative AI inside Illustrator (Text to Vector Graphic) currently does not support uploading a reference image directly — this is a known limitation. The workaround is to use **Firefly on the web** instead, which does support reference images via the Style Reference field. Do not waste time trying to make Illustrator AI accept a reference image — it can't yet. Use the web app.

**Output to save:** Screenshot top 1–2 results → save alongside Nano Banana outputs in Drive

---

## Stage 2 — Evaluate and Choose

Lay all outputs (Nano Banana + Firefly) side by side. Pick the **one** that:
- Has the right feeling (organic, fluid, botanical — not stiff)
- Holds up as a shape even if the letterforms are unclear
- Could credibly be debossed onto a chrome tube at ~30mm diameter

Do not try to combine multiple AI outputs. Pick one, commit to it as a structural starting point.

---

## Stage 3 — Redraw in Illustrator

This is the real work. The AI output is a sketch, not a final mark.

**Setup:**
1. Place the chosen AI screenshot on a locked layer at ~25% opacity
2. Create a new layer above it
3. Set stroke: 1pt black. Fill: none.
4. Use the **Pen tool** or **Pencil tool** (smooth) to trace the forms

**Redraw approach — organic monogram:**
- Start with the primary letterform (the most legible one) — draw it as a single continuous path if possible
- Add botanical elements (stems, tendrils) as separate paths that interweave with the letter path
- Use the **Width Tool (Shift+W)** to add stroke weight variation — thicker at curves, thinner at tips. This is what makes it feel hand-drawn rather than digital.
- Use **Object → Expand Appearance** once you're happy to convert strokes to filled paths

**Quality check (do this before calling it done):**
- Zoom out to 50px equivalent — does the mark still read as a form?
- Apply to a dark background — does it hold?
- Export as PNG at 20px × 20px — is it still recognisable?

**File naming:** `ALT-mark-concept-D-organic-v1.ai`

---

## Stage 4 — Present alongside other directions

Once vectorised, present Direction D in the same format as Directions A, B, C:
- Black mark on white artboard
- White mark on black artboard
- All four directions side by side at the same scale

Do not apply to the chrome tube mockup until Anh has chosen a direction.

---

## Time estimate

| Stage | Estimated time |
|-------|---------------|
| Nano Banana generation + review | 30–45 min |
| Firefly generation + review | 20–30 min |
| Evaluate + choose one | 10 min |
| Illustrator redraw (v1) | 1.5–2 hrs |
| **Total** | **~3–3.5 hrs** |
