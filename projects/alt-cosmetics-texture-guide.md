# ALT. Cosmetics — Texture & Surface Quality Guide
## Organic / Rough / Hand-Engraved in Illustrator + Photoshop

*Tied to Direction A (Ancient/Carved/Archaeological) and the broader brand requirement for marks that feel hot-pressed, debossed, or incised onto a surface. Also applies wherever Direction B or C needs to feel hand-made rather than computer-generated.*

---

## The quality you're after

The target register: a mark that looks worn into a surface rather than printed onto it. Think Egyptian intaglio seal, Roman coin die, stone tablet inscription. Incised, not raised. The irregularity and imperfection **is** the luxury — it signals age, rarity, hand craft. Achieved in Illustrator (building the mark) then finished in Photoshop (applying the surface + embedding it).

---

## Part 1 — Illustrator: Building the mark with hand-engraved character

### 1.1 Start rough — draw with the Pencil tool (not the Pen tool)

The Pen tool gives you mathematically smooth curves. That's the enemy here. Use the **Pencil tool** instead with Fidelity set to **Smooth ~5–6** so it auto-corrects wobble slightly, but not so much that it kills the hand quality. Draw letterforms or the mark shape freehand — even if you're retracing a reference. The slight unevenness in your stroke paths is intentional.

> Shortcut: `N` for Pencil tool. Double-click the tool icon to set Fidelity.

### 1.2 Roughen the paths — Effect > Distort & Transform > Roughen

After drawing, select paths and go: **Effect → Distort & Transform → Roughen**

Settings for carved/incised register:
- **Size:** 0.3–0.8% (relative to object) — tiny. You're not distorting the shape, you're giving the edge micro-irregularity.
- **Detail:** 4–8/inch
- **Points:** Smooth (not Corner) — engraving has curved micro-variation, not jagged breaks
- Preview on while adjusting. The mark should still read clean at arm's length but feel textured close up.

This is the single most useful effect in Illustrator for this project.

### 1.3 Variable stroke weight — Width tool

Select your stroke paths and use the **Width tool** (`Shift + W`). Click and drag along the path to swell it at specific points. Hand-engraved lines are never perfectly uniform weight — they taper at entries and exits and swell through the arc of the cut. Even 1–2 subtle width variations on each stroke path will kill the computer-generated look.

### 1.4 Add micro-breaks to strokes — Stroke panel dashes

Where a path represents an engraved groove, you want it to look like the tool occasionally bit harder or lighter. Select the path, open the **Stroke panel**, check **Dashed Line** and set very long dash/gap values (e.g. Dash: 200pt, Gap: 1pt). This creates barely-perceptible breaks that read as surface variation, not dots.

Alternatively: use the **Eraser tool** with a pressure-sensitive setting to literally erase micro-sections of fill paths.

### 1.5 Texture brushes — Brush Libraries

Go to **Window → Brushes → Open Brush Library → Artistic → Artistic ChalkCharcoalPencil**

Apply `Charcoal — Feather` or `Chalk — Scribble` to your strokes. The brush will roughen the stroke edge to feel more like a drawn line than a vector path.

For a harder cut-tool feel: try **Artistic → Artistic Ink** → `Ink Spatter`.

> Important: after applying, go **Object → Expand Appearance** to lock the brush into actual paths before doing further edits.

### 1.6 Scribble effect for fill areas

For any solid filled shape that should feel hand-made: **Effect → Stylize → Scribble**

- **Angle:** ~45° (mimics engraving tool passes)
- **Path Overlap:** negative value (–3 to –6%) to keep lines tight inside the shape
- **Stroke Width:** 0.3–0.6pt
- **Curviness:** low (5–10%) — engraving is straight passes, not wavy
- **Spacing:** tight (1–3pt)

The result reads as a hatched engraved fill rather than a solid. Useful for seal backgrounds or interior fill areas on the mark.

### 1.7 Image Trace from a scanned or photographed reference

If you have a Midjourney result you want to trace into a vector while keeping its roughness:

1. Increase contrast in Photoshop first (Levels → push blacks, pull whites)
2. Place in Illustrator → **Object → Image Trace → Make**
3. Settings: **Mode:** Black and White. **Threshold:** 130–150. **Paths:** 80%. **Corners:** 75%. **Noise:** 10px
4. Expand → Ungroup
5. Do **not** simplify the paths — the complexity is what gives it the hand-made quality

### 1.8 Grain texture fill using a symbol or pattern

Create a small organic texture tile (import a grain/stone PNG, embed it, Image Trace it) and use it as a **Pattern Fill** on shapes. Set the pattern to a small scale so it functions as surface noise within fills.

---

## Part 2 — Photoshop: Embedding the mark in a surface

This is where the mark stops looking like a graphic and starts looking like it belongs to a material. You're compositing your Illustrator vector onto a simulated carved/textured surface.

### 2.1 Your base texture — what to source

You need a **stone, clay, or aged material texture** as your base layer. Options:
- Photograph a flat stone surface yourself (best — original)
- Unsplash / Adobe Stock: search "marble texture flat", "rough stone flat lay", "plaster texture close up"
- Adobe Firefly: generate "flat rough limestone surface texture, macro photography, neutral grey, no objects"

Place as the bottom layer in your PSD. Convert to Smart Object so you can scale non-destructively.

### 2.2 Place the mark — as a Smart Object

Paste your Illustrator mark into Photoshop as a **Smart Object** (not rasterised). Keep it smart so you can edit the vector and see the result update. Name it `mark`.

Set the layer **Blending Mode to Multiply** and reduce Opacity to ~70–80%. This lets the stone texture show through the dark parts of the mark, immediately killing the flat-graphic look.

### 2.3 Layer Style — Bevel & Emboss for the incised quality

Double-click the mark layer → **Layer Style → Bevel and Emboss**

Settings for an incised/engraved look (the surface is pushed IN, not raised):
- **Style:** Inner Bevel
- **Technique:** Chisel Hard
- **Depth:** 60–120%
- **Direction:** **Down** ← critical. Down = incised/carved. Up = raised/embossed.
- **Size:** 2–4px
- **Soften:** 0–1px (keep it sharp — an engraved edge is crisp)
- **Angle:** ~135° (top-left light source — matches most reference stone photography)
- **Altitude:** 25–35°
- **Highlight Mode:** Screen, white, ~60% opacity
- **Shadow Mode:** Multiply, dark brown or grey, ~70% opacity

Add **Contour** (sub-option under Bevel & Emboss): choose `Ring` or `Ring Double` — this gives the inner wall of the carved groove more depth.

### 2.4 Displacement map — make the mark follow surface irregularities

This is what separates convincing from fake. The mark needs to bend slightly to follow the bumps in the stone, as if it was actually engraved into that specific piece of rock.

1. Duplicate your stone texture layer → **Image → Desaturate**
2. **Filter → Blur → Gaussian Blur** → 3–5px (softens the displacement so it's subtle)
3. **File → Save As** → save as `displacement.psd` (must be a .psd, not a PNG)
4. Select your mark layer → **Filter → Distort → Displace**
5. **Horizontal Scale:** 3–5 · **Vertical Scale:** 3–5 · Stretch to Fit · Repeat Edge Pixels
6. Choose your `displacement.psd` when prompted

The mark will now warp subtly to follow the stone surface. Exactly as if it were carved in.

### 2.5 Texture overlay on the mark itself

The mark's fill should look like it's made of the same material as the surround — not a perfectly smooth ink layer dropped on top.

1. Create a new layer above the mark layer → **Blending Mode: Overlay**
2. Clip it to the mark layer (`Alt + click` between layers)
3. **Filter → Render → Clouds** (Foreground: black, Background: white)
4. **Filter → Noise → Add Noise** → Amount 8–12%, Gaussian, Monochromatic
5. Reduce Opacity to 30–50%

This adds micro surface variation to the mark fill — it stops reading as flat vector black and starts reading as pigment or cut material.

### 2.6 Dodge & Burn — adding depth by hand

Use a **Curves adjustment layer** clipped to the mark, or paint directly with the Dodge/Burn tools at very low exposure (5–8%) on a separate layer set to Overlay or Soft Light.

- **Burn (darken):** the deepest parts of the carved groove — centre of strokes, interior corners
- **Dodge (lighten):** the top edges of the incised path — where light catches the cut lip

This is the detail that makes it feel hand-cut. Spend 10–15 minutes here with a soft round brush on a large brush size, low pressure. Work intuitively — if it looks symmetric it's wrong.

### 2.7 Film grain — the final flattener

Once the mark is composited and looking right, flatten the effect with grain:

1. New layer at the top of the stack → fill with 50% grey → **Blending Mode: Soft Light**
2. **Filter → Noise → Add Noise** → Amount 4–8%, Gaussian, Monochromatic
3. Optional: **Filter → Other → High Pass** at 0.5px before setting blend mode, for a sharper grain

Grain unifies the mark with the stone background — they look like they've been in the same environment. Also softens any remaining hard digital edges.

### 2.8 Smart Sharpen on the composite

Before presenting: **Filter → Sharpen → Smart Sharpen** → Amount 40–70%, Radius 0.5–1px, Remove: Lens Blur. This brings back fine edge detail that softening steps may have blurred. Apply to a flattened or stamped visible layer (`Cmd + Alt + Shift + E`).

---

## Part 3 — Working process (order of operations)

1. **Illustrator:** Build/refine the mark shape with Roughen effect, Width tool variation, pencil-drawn paths where needed. Export as PDF or SVG.
2. **Photoshop:** Bring in stone texture as base. Place mark as Smart Object.
3. Set mark layer to Multiply mode.
4. Apply Bevel & Emboss (incised settings above).
5. Create and apply displacement map.
6. Clip texture overlay to mark.
7. Dodge & Burn for hand depth.
8. Add grain layer.
9. Smart Sharpen final composite.
10. Export a clean version (no mock surface) alongside the textured version — you'll need both for presentation.

---

## Part 4 — Quick reference: key settings

| Goal | Tool / Effect | Key settings |
|------|--------------|--------------|
| Rough path edges | Effect → Roughen | Size 0.3–0.8%, Smooth, 4–8/inch |
| Variable stroke weight | Width tool (`⇧W`) | Drag to swell, taper at path ends |
| Engraved mark feel | Bevel & Emboss | Direction: Down, Chisel Hard, 2–4px |
| Mark follows surface | Displace filter | 3–5px, displacement.psd from stone layer |
| Unified surface look | Grain layer (Soft Light) | 4–8% Noise, Monochromatic |
| Hand-drawn paths | Pencil tool | Fidelity 5–6 (Smooth) |
| Fill texture | Scribble effect | 45°, tight spacing, low curviness |

---

## Part 5 — Resource references

- **Stone textures:** [Unsplash](https://unsplash.com) — search "limestone flat", "granite close up", "rough plaster"
- **Adobe Firefly:** "rough aged limestone surface, macro, flat, neutral grey, no objects, photorealistic"
- **Illustrator brush packs:** [Retro Supply Co.](https://www.retrosupply.co) — Engraver's kit and Letterpress brushes are directly relevant
- **Photoshop actions:** [Spoon Graphics](https://blog.spoongraphics.co.uk) — engraved/letterpress actions available free
- **Reference images for displacement:** any high-contrast macro stone photograph works — contrast and sharpness matter, colour doesn't

---

*This guide is internal — for use during the Alt Cosmetics mark development process. Revisit and refine as direction is confirmed with Anh.*
