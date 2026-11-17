<!-- stardust:provenance
  writtenBy:        stardust:prototype/shape
  writtenAt:        2026-11-17T19:05:00Z
  page:             willy-street → /projects/willy-street
  pageUrl:          https://www.barnettarchitecture.com/willy-street
  againstDirection: stardust/direction.md (Active 2026-11-17T17:20:00Z)
  consumedBy:       impeccable:craft (new-work § 3 "whole surface inside an established world" — world + structure pinned; concept-seed not run)
  mode:             prep (wave 2, canon consumer), hands-off
  readArtifacts:
    - stardust/current/pages/willy-street.json
    - stardust/current/_galleries.clean.json
    - stardust/.work/prototype/cdn-status.txt
    - stardust/taxonomy.json
    - stardust/canon/* (canon.css, header, footer, skip-link, nav-script, modules/*)
    - stardust/canon/pending/copy-of-iowa.css (photo-lightbox module, reused)
    - DESIGN.md, DESIGN.json (extensions.canon, modules, metadata), PRODUCT.md
  stardustVersion:  0.32.1
-->
---
slug: willy-street
url: /projects/willy-street
archetype: project (forked for all 29 projects; builder stardust/.work/prototype/willy-street/build.mjs <name>)
register: brand
mode: experience
surprise: low
dominantDimension: photograph-first case study annotated like a drawing set
fidelity: refined
---

# Page shape: project (Willy Street)

The captured page is a Wix template: wordmark H1, client type + location as loose text, four
narrative paragraphs and a 9-photo slider with no captions. The redesign keeps every word and
photograph and gives them an order: photo → name → facts → idea → story → photographs → neighbours.
Everything is slot-driven so the same template renders the other 28 projects.

## Sections (in render order)

1. **skip-link + site-header** — canon verbatim (`header.html`); over-media state via `body[data-hero="media"]`.
2. **hero** (module `project-hero`, project instance) — full-bleed cover photo (rule: first non-403 landscape ≥1600w,
   else first ≥1600w, else first landscape, else first → Willy `5c8b97_06c3d2…` 4368×2912), eager + fetchpriority=high.
   H1 = project title only, at `display` (clamp 3.25–10rem). Bottom-right: visible breadcrumb (Projects / Residential)
   as the canon caption dimension string. Scrim bound to the text block (canon).
3. **facts** (module `project-hero` slot `facts`; net-new rendering `factbar`) — a chain dimension: one hairline with a
   tick at every fact boundary; `<dl>` of Sector · Project type · Location · Client (`slots.clientType`, omitted when it
   repeats the title) · Approach (taxonomy theme, when present). Sector/type/location/approach values link to the
   listing filters (`/residential`, `/projects?type=`, `?location=`, `?approach=`).
4. **big-idea** (module `big-idea`) — first sentence of the narrative verbatim at `headline` scale (the thesis); the rest
   of the narrative verbatim in a 68ch column offset to cols 6–12.
5. **gallery** (module `project-gallery`) — H2 "Photographs" + count (9). Sequence alternates full-bleed plates and
   salon-hung pairs: full slots take the next landscape; pairs take the next two (spans 5/5, 7/5, 6/6 by orientation);
   the hero photograph closes the sequence instead of repeating straight after the hero. Natural aspect, no Wix crop.
   Each plate is a link to the full-size photograph (no-JS fallback) and opens the shared `photo-lightbox` module
   (darkroom 96%, prev/next, ←/→, Home/End, Esc, focus trap, swipe, `#photo-n` deep link).
6. **project-pager** (net-new `project-pager`) — previous / next project in taxonomy order (wraps), two ruled cells:
   title at `heading-lg`, direction label, facts dimension string.
7. **related-projects** (module `project-index`, canon schedule rows) — 3 projects sharing sector or location
   (score: sector 2, location 1, each shared type 2, each shared approach 1; prev/next excluded; ties by taxonomy distance).
8. **enquiry** (module `enquiry-band`) — canon verbatim.
9. **site-footer** — canon verbatim.

## Layout strategy

Canon shell (1440 max, gutter), 12-col ≥600 / 1-col <600, 120/64 section rhythm. Full-bleed moments: hero and the
gallery's full plates (photographs only — canon move "photographs may break the shell"). Sage ground throughout;
darkroom only inside the lightbox; graphite footer.

## Key states

Header over-media → settled (≥900, scroll timeline). Lightbox closed/open, image loading (fade in, reserved aspect
box). Photo 403s are excluded at build time. No-JS: every plate opens the photograph; the dialog never opens.

## Data attributes

`body[data-template="project"][data-hero="media"]`; sections carry `data-section/intent/layout` +
`data-module` (`project-hero`, `big-idea`, `project-gallery`, `project-index`, `enquiry-band`, `photo-lightbox`) and
`data-slot` (`image`, `title`, `facts`, `lead`, `narrative`, `photos`, `cards`, `heading`, `email`, `phone`).

## Unsourced content (placeholder list)

(none). Headings "Photographs", "Related projects", "More projects" (visually hidden), "Project facts" (hidden),
direction labels and dt labels are direction-authorized chrome; facet labels come from `taxonomy.json`.

```yaml
_provenance:
  capturedSourceLineage:
    - { section: site-header, origin: "site-wide system-component — stardust/canon/header.html (verbatim)" }
    - { section: hero, origin: "pages/willy-street.json#slots.gallery (cover rule) + slots.title; captured H1 was the wordmark (audit F-002)" }
    - { section: facts, origin: "pages/willy-street.json#slots.clientType/location + taxonomy.json#projects[willy-street] (sector, scope, location, theme)" }
    - { section: big-idea, origin: "pages/willy-street.json#slots.narrative (4 paragraphs, verbatim; first sentence lifted as lead)" }
    - { section: gallery, origin: "_galleries.clean.json#willy-street (9 photos, 0 excluded as 403)" }
    - { section: project-pager, origin: "direction-authorized new — PRODUCT.md principle 3 'every project links to its neighbors'; taxonomy order" }
    - { section: related-projects, origin: "direction-authorized new — same principle; taxonomy facets" }
    - { section: enquiry, origin: "canon module enquiry-band (contact.json)" }
    - { section: site-footer, origin: "canon footer.html (verbatim)" }
  antiTemplatePass:
    - { pattern: project-hero, defaultReflex: "photo with centered title + subtitle + CTA", alternatives: ["split photo/text", "title above photo on sage", "full-bleed photo with title docked bottom-left + breadcrumb caption"], picked: "full-bleed, docked title", rationale: "canon move 1; Experience mode — the building leads" }
    - { pattern: facts, defaultReflex: "icon + label stat row", alternatives: ["sidebar spec table", "inline dot-separated line", "chain dimension across the shell"], picked: "chain dimension", rationale: "DESIGN.md signature device 1, extended from a single dimension string to a chained one so each fact gets its own measured segment" }
    - { pattern: gallery, defaultReflex: "uniform 3-col thumbnail grid or slider", alternatives: ["slider (captured)", "justified rows", "alternating full-bleed plates and salon pairs"], picked: "alternating plates/pairs", rationale: "DESIGN.md Layout § Project page; portraits are paired so no portrait is blown to full width" }
    - { pattern: next-project, defaultReflex: "two arrow buttons", alternatives: ["arrow buttons", "photo cards", "ruled two-cell pager with titles at index scale"], picked: "ruled pager", rationale: "drawing-schedule vocabulary; titles carry the link" }
  surpriseMoves: []
  substrateTransitions: { default: sage-ground, exceptions: [ { section: lightbox, ground: darkroom, purpose: "photograph viewer (DESIGN.md Elevation: darkroom 96%)" }, { section: site-footer, ground: graphite, purpose: "canon title block" } ] }
  voiceClassification:
    - { section: hero, classification: captured-verbatim, copy: "Willy Street", source: "slots.title" }
    - { section: facts, classification: captured-verbatim, source: "slots.clientType 'Private Residence', slots.location; taxonomy labels" }
    - { section: big-idea, classification: captured-verbatim, source: "slots.narrative[0..3]" }
    - { section: gallery, classification: direction-authorized chrome, copy: "Photographs · 9 photographs", source: "count of non-403 photos" }
    - { section: alt-text, classification: direction-authorized rewrite, copy: "Willy Street — photograph n of 9", source: "brief rule: captured titles here are camera names ('March #09 jpeg') and are not used" }
    - { section: project-pager, classification: captured-verbatim, source: "taxonomy titles + labels; 'Previous project / Next project' chrome" }
  signatureElements:
    - { kind: hero-photograph, capturedSource: "captured project slider (first frame)", mechanism: "single full-bleed responsive <img>", fallback: "darkroom ground + bound scrim" }
  typeScaleYields: []
```
