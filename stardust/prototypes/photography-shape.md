<!-- stardust:provenance
  writtenBy:        stardust:prototype/shape
  writtenAt:        2026-11-17T19:30:00Z
  page:             photography
  pageUrl:          https://www.barnettarchitecture.com/photography  (URL kept)
  againstDirection: stardust/direction.md (Active 2026-11-17T17:20:00Z)
  consumedBy:       impeccable:craft (new-work § 3 "whole surface inside an established world", precisely specified → concept-seed not run)
  mode:             prep (archetype: photo-hub), hands-off
  canon:            stardust/canon/* (home, first approval 2026-11-17T18:43:06Z)
  readArtifacts:
    - stardust/current/pages/photography.json
    - stardust/current/pages/copy-of-iowa-2022-exhbit.json (Fields of Vision)
    - stardust/current/pages/copy-of-minnesota.json (Iowa 2022 Exhibit)
    - stardust/current/_galleries.clean.json
    - stardust/.work/prototype/cdn-status.txt
    - stardust/taxonomy.json
    - DESIGN.md, DESIGN.json, PRODUCT.md, stardust/direction.md
    - stardust/canon/* ; stardust/prototypes/copy-of-iowa-shape.md (shared photo-wall + lightbox)
  stardustVersion:  0.32.1
-->
---
slug: photography
url: /photography
archetype: photo-hub
register: brand (impeccable mode: Experience)
surprise: low
dominantDimension: sequence/lead-then-index
fidelity: refined
---

# Page shape: photography (photo-hub archetype)

The captured hub is two uncaptioned photos (an Iowa field + a Mexico — Faces group), six empty H1s and
the photography paragraphs, with collections reachable only through the nav dropdown (screenshot
`photography.png`). Counts after excluding CDN 403s: Iowa 89 · Illinois 91 · Wisconsin 24 · Minnesota 8 ·
Mexico — Places 10 · Mexico — Faces 24 · Fields of Vision 2 · Iowa 2022 Exhibit 4 = **252**.

## Sections (in render order)

1. **site-header** — canon verbatim, `aria-current="page"` on Photography; over-media state (`body[data-hero=media]`).
2. **hero** (module `project-hero`) — full-bleed Iowa photograph 41 of 89 (`5c8b97_38d6a289…`, the captured
   hub's own lead image `photography.json#slots.heroPhotos[0]`), eager + fetchpriority high. H1 "Photography"
   bottom-left on the text-bound scrim; who-line beneath (outside the H1); caption dimension string
   "Iowa · Photograph 41 of 89" → `/photography/iowa#photo-41` (opens that frame in the gallery lightbox).
3. **intro** (side-rail, sage) — rail H2 "Composition, light and shadow" + facts "8 collections · 252 photographs";
   body = photography.json body[0–2] verbatim (camera sentence's double period fixed).
4. **selected-works** (module `collection-index`, slot `selected-works`, darkroom) — one frame per collection:
   highest-resolution landscape frame, titled preferred (none titled), never the collection's cover, ties →
   captured order. Hung 2-up at exhibit scale on the shared justified wall; small-caps label "Iowa · Midwest";
   every frame opens the shared `photo-lightbox` ("3 / 8"). Navigation is left to the next section.
5. **collections** (module `collection-index`, darkroom, joined) — H2 "Collections"; H3 dividers "Regions"
   (Iowa, Illinois, Wisconsin, Minnesota, Mexico — Places, Mexico — Faces; spans [5,4,3t][3t,3t,6]) and
   "Exhibits" (Fields of Vision, Iowa 2022 Exhibit; [7,5]); covers = the home teaser's frames; caption =
   title link + "<N> photographs · <kind>". Exhibit frames carry their captured note; the captured
   discoversma.com link closes the section with the captured sentence about exhibiting in Mexico.
6. **enquiry** + **site-footer** — canon verbatim.

## Layout / states / interaction

- Same breakpoints as canon (600 / 900) + the wall's fluid row height. Selected works: 2-up ≥ 1130px,
  1-up below. Collections: canon wall spans; < 600 Wisconsin solo (3:2), the tall pair 2-up.
- Lightbox as in copy-of-iowa-shape.md (no `#photo-N` hash on the hub; history entry on open).

## Data attributes

- `body[data-template="photo-hub"][data-hero="media"]`
- `section[data-section="hero"][data-module="project-hero"]`, `section[data-section="intro"][data-layout="side-rail"]`
- `section[data-section="selected-works"][data-layout="justified-wall"][data-items="8"][data-module="collection-index"][data-slot-role="selected-works"]`
- `section#collections[data-section="collections"][data-layout="grid"][data-items="8"][data-module="collection-index"]`
- `dialog[data-module="photo-lightbox"]`; canon enquiry / header / footer attributes.

## Unsourced content (placeholder list)

(none)

```yaml
_provenance:
  capturedSourceLineage:
    - { section: hero, origin: "photography.json#slots.heroPhotos[0] (also _galleries copy-of-iowa #44 → 41 of 89 after 403s)" }
    - { section: intro, origin: "photography.json#body[0..2]" }
    - { section: selected-works, origin: "direction.md § Curated photography 'lead Selected works sequence (one strongest frame per collection)'; frames from _galleries.clean.json" }
    - { section: collections, origin: "captured nav Photography▾ (8) + taxonomy.json#collections; exhibit notes from copy-of-iowa-2022-exhbit.json#slots.intro, copy-of-minnesota.json#slots.intro, photography.json#body[3..5]" }
  antiTemplatePass:
    - { pattern: hub-index, defaultReflex: "8-up same-size card grid", alternatives: ["8-up card grid", "drawing-schedule rows (canon move 3)", "canon collection-index salon wall grouped by kind"], picked: "collection-index salon wall, Regions / Exhibits dividers", rationale: "user asked for cards with cover, title, count; the canon's own collection-index frames are those cards; schedule rows would make 8 × 450px rows" }
    - { pattern: selected-works, defaultReflex: "carousel / slider", alternatives: ["horizontal scroll-snap strip", "second salon wall", "2-up exhibit-scale sequence opening a lightbox"], picked: "2-up sequence + lightbox", rationale: "a viewing sequence distinct from the navigational index (critique P1: two indistinguishable walls)" }
  substrateTransitions:
    default: sage-ground
    exceptions:
      - { section: "selected-works + collections", ground: darkroom, purpose: "colorReservations → module:collection-index selected-works" }
      - { section: site-footer, ground: graphite, purpose: "canon title block" }
  voiceClassification:
    - { section: hero, classification: captured-verbatim, copy: "Photography", source: "photography.json#slots.index-headline" }
    - { section: hero-who, classification: direction-authorized rewrite, copy: "Todd Barnett’s photographs of the backroads of the Midwest and the highlands of central Mexico", source: "photography.json#body[0] 'the highlands of central Mexico and the backroads of the Midwest' + team.json name" }
    - { section: hero-caption, classification: direction-authorized rewrite, copy: "Iowa · Photograph 41 of 89", source: "position computed from _galleries.clean.json minus 403s" }
    - { section: intro-h2, classification: direction-authorized rewrite, copy: "Composition, light and shadow", source: "photography.json#body[1] 'composition, light and shadow were a constant focus'" }
    - { section: intro-facts, classification: direction-authorized rewrite, copy: "8 collections · 252 photographs", source: "computed" }
    - { section: intro-body, classification: captured-verbatim, source: "photography.json#body[0..2]" }
    - { section: selected-lead, classification: direction-authorized chrome, copy: "One photograph from each of the 8 collections. Open any frame to see it full-size." }
    - { section: collections, classification: captured-verbatim, copy: "titles (taxonomy.json), counts (computed), kind labels (canon home teaser)", source: "'2024' from captured title 'Fields of Vision 2024 Exhibit'; 'Decorah, Iowa' from captured 'Impact Coffee, Decorah, IA'" }
    - { section: exhibit-notes, classification: captured-verbatim, copy: "Fields of Vision Exhibit, Analog Gallery, Urbana, IL. / These images formed the “Geometries and Views” exhibit at Impact Coffee in Decorah, Iowa. / Todd has exhibited his Mexico photography in the Midwest and the Midwest photography in Mexico.", source: "copy-of-iowa-2022-exhbit.json#slots.intro; photography.json#body[5] (light edit 'The Iowa 2022 link shares' → 'These images formed'); photography.json#body[3]" }
    - { section: external-links, classification: direction-authorized rewrite, copy: "Fields of Vision on immaterialbooks.com / Iowa Driftless Region photography exhibit, San Miguel de Allende", source: "link text derived from the captured URLs (immaterialbooks.com/fields-of-vision; discoversma.com/…/san-miguel-de-allende/…iowa-driftless-region-photography-exhibit…)" }
  canonDeviations: []
```
