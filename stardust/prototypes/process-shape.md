<!-- stardust:provenance
  writtenBy:        stardust:prototype/shape
  writtenAt:        2026-11-17T19:05:00Z
  page:             process (type static; new URL /about/process)
  pageUrl:          https://www.barnettarchitecture.com/process
  againstDirection: stardust/direction.md (Active 2026-11-17T17:20:00Z)
  consumedBy:       impeccable:craft
  mode:             prep wave 2 (canon diff mode), hands-off
  readArtifacts:    [stardust/current/pages/process.json, about.json, copy-of-testimonials.json, stardust/canon/*, DESIGN.md, DESIGN.json, PRODUCT.md, stardust/direction.md § GEO]
  stardustVersion:  0.32.1
-->
---
slug: process
url: https://www.barnettarchitecture.com/process → /about/process
register: brand
surprise: medium
dominantDimension: composition/chain-dimension sequence + ruled phase sheets
fidelity: refined
---

# Page shape: process

Captured /process: six phase headings, nine paragraphs, the About photograph. Direction: FAQPage JSON-LD with answers
composed of captured sentences only (direction.md § Taxonomy/SEO/GEO).

## Sections (render order)
1. **site-header** (canon; `aria-current` on Process).
2. **hero** (`project-hero`) — the Ridgewood graphic design plan (captured on copy-of-testimonials, 8625×7433, title
   "RIDGEWOOD GRAPHIC DESIGN PLAN") — a real drawing for the page about drawing; H1 "From pre-design to construction"
   + who line; caption "Ridgewood · Graphic design plan". The captured IMG_0087 already opens /about.
3. **process-steps** (NEW module) — H2 "Six phases"; chain-dimension index (6 named segments → anchors); one ruled
   sheet per phase: sticky phase name (H3) left, body right (lead = first captured sentence). Schematic Design's
   deliverables sentence in a labelled aside; the four delivery systems as `dl.systems` (verbatim clauses, leading
   verb dropped). **Named, never numbered** (canon declined decorative sheet numbers).
4. **faq** (NEW module) — 10 questions; every answer sentence captured (process.json / about.json); visible, no
   accordion; FAQPage JSON-LD mirrors the visible text.
5. **enquiry** (canon) → **site-footer** (canon).

## Layout / states
Phase sheet: name 4 cols (sticky ≥900) / body 8 cols; stacked <900; chain vertical <900. Static; anchors only.

## Unsourced content
(none). Logged edits: "BA" → "Barnett Architecture" in FAQ answers; universal-design trim (as canon home).

```yaml
_provenance:
  capturedSourceLineage:
    - { section: hero, origin: "copy-of-testimonials.json#slots.photos[0] (drawing); H1 from process.json phase headings" }
    - { section: process-steps, origin: "process.json#body (all 6 phases, all paragraphs)" }
    - { section: faq, origin: "direction-authorized new (direction.md: FAQPage on Process) — process.json + about.json sentences" }
  antiTemplatePass:
    - { pattern: process-timeline, defaultReflex: "numbered icon timeline / 01-06 cards", alternatives: ["numbered cards", "accordion of phases", "chain dimension index + ruled phase sheets"], picked: "chain dimension + sheets", rationale: "running dimensions are how a drawing states consecutive spans; names carry order without decorative numerals" }
    - { pattern: faq, defaultReflex: "accordion FAQ", alternatives: ["accordion", "two-column Q/A cards", "open ruled Q/A list on the principles hairline"], picked: "open ruled list", rationale: "answers stay visible for readers and answer engines; matches principles" }
  surpriseMoves:
    - { move: "chain-dimension sequence index", bank: "typographic substitution", replaces: "numbered timeline" }
  substrateTransitions: { default: sage-ground, exceptions: [{ section: site-footer, ground: graphite, purpose: "canon" }] }
  voiceClassification:
    - { section: hero, classification: direction-authorized rewrite, copy: "From pre-design to construction" }
    - { section: process-steps, classification: captured-verbatim, note: "'Six phases' heading = captured count (chrome)" }
    - { section: faq, classification: "captured-verbatim answers (logged edits); questions = chrome" }
  signatureElements:
    - { kind: hero-photograph, capturedSource: "copy-of-testimonials.json#slots.photos[0]", mechanism: "responsive <img> eager", fallback: "darkroom ground + scrim" }
  typeScaleYields: []
```
