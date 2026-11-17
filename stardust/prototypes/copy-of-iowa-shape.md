<!-- stardust:provenance
  writtenBy:        stardust:prototype/shape
  writtenAt:        2026-11-17T19:05:00Z
  page:             copy-of-iowa
  pageUrl:          https://www.barnettarchitecture.com/copy-of-iowa  (new URL /photography/iowa)
  againstDirection: stardust/direction.md (Active 2026-11-17T17:20:00Z)
  consumedBy:       impeccable:craft (new-work § 3 "whole surface inside an established world", precisely specified → concept-seed not run)
  mode:             prep (archetype: gallery — forked for all 8 collections), hands-off
  canon:            stardust/canon/* (home, first approval 2026-11-17T18:43:06Z)
  readArtifacts:
    - stardust/current/pages/copy-of-iowa.json
    - stardust/current/pages/photography.json
    - stardust/current/_galleries.clean.json
    - stardust/.work/prototype/cdn-status.txt
    - stardust/taxonomy.json
    - DESIGN.md
    - DESIGN.json (extensions.canon, modules, colorReservations, metadata)
    - PRODUCT.md
    - stardust/direction.md
    - stardust/canon/canon.css, header.html, footer.html, skip-link.html, nav-script.html, modules/*.html
  stardustVersion:  0.32.1
-->
---
slug: copy-of-iowa
url: /photography/iowa
archetype: gallery
register: brand (impeccable mode: Experience)
surprise: low
dominantDimension: composition/salon-justified-wall
fidelity: refined
---

# Page shape: copy-of-iowa (gallery archetype)

The captured page is a bare Wix pro-gallery: no H1 (only the wordmark), no copy, one broken image
in the static DOM (screenshot `copy-of-iowa.png`), 95 photos reachable only via the gallery JSON.
6 of the 95 now return 403 on the Wix CDN → **89 photographs**. **No photo carries a real title**:
the captured `title` fields are Wix placeholders ("-", "_", "=", ".") — so the page ships with
**zero captions** (the "47 titled" count in the task counted placeholder punctuation). The
generator still renders a caption for any future real title (`realTitle()` in
`.work/prototype/photography/data.mjs` rejects punctuation-only and camera-filename titles such as
Illinois' "IL 4-2021 DSC02120-bw1").

## Sections (in render order)

1. **skip-link + site-header** — canon verbatim (sage, sticky ≥641px, hamburger ≤640px). Not
   `data-hero="media"`: this page opens on the wall, not a single photograph (deviation 1).
2. **gallery-head** (module `photo-collection`, slots `title`, `intro`) — darkroom. Breadcrumb
   (Home / Photography / Iowa), H1 "Iowa" at display scale, facts dimension string
   "89 photographs · Midwest · Todd Barnett", intro (2 sentences, light edit of photography.json).
3. **gallery** (module `photo-collection`, slot `photos`) — darkroom wall of all 89 frames at their
   native ratios: justified flex rows (DESIGN.md § Components Gallery) with a salon rhythm (canon
   move 4): every 16 photos, frames 0 and 9 hang 1.8× larger, bottom-aligned with a partner, so
   desktop rows read [F n] [n n n] [n n n] [n F] [n n n] [n n n]; phones 2-up with features solo.
   Each frame is a link to its 2400w file (no-JS) and opens the lightbox (JS).
4. **lightbox** (module `photo-lightbox`) — `<dialog>` on darkroom 96%: collection label + Close
   top; photograph centred; Previous · "12 / 89" · Next bottom. Keys ←/→/Home/End/Esc, Tab trapped,
   focus returned to the opening frame, swipe on touch, `#photo-N` deep links, full-size image
   requested only on open (+ neighbours preloaded).
5. **more-collections** (module `collection-index`, siblings instance) — darkroom strip of the 7
   other collections (cover 3:2, title, count), "All collections" → /photography.
6. **enquiry** (module `enquiry-band`) — canon verbatim, sage (canon move 6).
7. **site-footer** — canon verbatim, graphite.

## Layout strategy

- Shell 1440 / gutter; wall inside the shell. Row height `clamp(96px, 19.5vw, 280px)`: 3-up at
  ≥1130px, 2-up 600–1129px and on phones; features 1.8×. Gap 24px (12px < 600px).
- Native aspect ratios via width/height attributes → zero layout shift; last row never stretched.
- Head: 12-col — breadcrumb + H1 + facts (cols 1–7), intro bottom-aligned (cols 8–12); stacks < 900.

## Key states

- Lightbox closed (default, no-JS complete) / open / image loading (fade in) / reduced motion
  (no fade). Image 403 → frame keeps its box on darkroom-tint (CDN-excluded photos never render).
- Small collections (2–4 photos) and large (89–91) use the same rhythm; a 2-photo wall is one
  [F n] row.

## Interaction model

- Frame hover: 1.02 scale (900ms, canon). Focus: 2px third-lake-light ring.
- Lightbox script ≤ 6 KB, vanilla, no dependencies; nav script canon verbatim.

## Data attributes

- `body[data-template="gallery"]`
- `section[data-section="gallery-head"][data-intent="say what this collection is"][data-layout="split"][data-module="photo-collection"]`
- `section[data-section="gallery"][data-intent="show the photographs"][data-layout="justified-wall"][data-items="89"][data-media="image"][data-module="photo-collection"][data-deviation]`
- `dialog[data-module="photo-lightbox"]`
- `section[data-section="more-collections"][data-intent="continue to a sibling collection"][data-layout="strip"][data-items="7"][data-module="collection-index"]`
- canon `enquiry`, `site-header`, `site-footer` attributes verbatim.

## Unsourced content (placeholder list)

(none) — counts are computed from the captured gallery minus 403s; kind labels are the canon home
teaser's; intro sentences are captured photography copy.

```yaml
_provenance:
  capturedSourceLineage:
    - { section: site-header, origin: "site-wide system-component (stardust/canon/header.html)" }
    - { section: gallery-head, origin: "pages/copy-of-iowa.json#slots.title 'Iowa' (H1; captured page had none — audit); intro from photography.json#body[0,2] (the collection page has no copy)" }
    - { section: gallery, origin: "_galleries.clean.json#pages.copy-of-iowa (95) minus 6 × 403 (cdn-status.txt) = 89, captured order" }
    - { section: lightbox, origin: "captured Wix pro-gallery 'press to zoom' expand mode (photography.json#ctas 'press to zoom'); DESIGN.md § Components Gallery 'keyboard-navigable lightbox'" }
    - { section: more-collections, origin: "captured nav Photography▾ (8 children) + taxonomy.json#collections new URLs" }
    - { section: enquiry, origin: "canon module enquiry-band (contact.json)" }
    - { section: site-footer, origin: "site-wide system-component (stardust/canon/footer.html)" }
  antiTemplatePass:
    - { pattern: gallery-grid, defaultReflex: "uniform square-cropped thumbnail grid / masonry", alternatives: ["uniform 3-col cropped grid", "masonry columns (breaks reading order)", "canon 12-col salon spans (crops to 3:2, fixed span pattern breaks on panoramas)", "justified native-ratio rows with salon-scale feature frames"], picked: "justified native-ratio rows + salon features", rationale: "photographs are the owner's exhibited work — never crop them; justified rows are DESIGN.md's gallery spec; feature frames carry canon move 4's salon hang; DOM order = visual order for the lightbox" }
    - { pattern: lightbox, defaultReflex: "third-party lightbox with thumbnails strip + zoom chrome", alternatives: ["library lightbox", "new page per photo", "native <dialog> with counter + prev/next text buttons"], picked: "native <dialog>", rationale: "≤6 KB, inert background for free, museum-didactic chrome (small caps counter)" }
    - { pattern: siblings, defaultReflex: "'You may also like' card carousel", alternatives: ["prev/next pair", "text list", "one-row cover strip with counts"], picked: "cover strip", rationale: "8 collections total — all siblings fit one row; counts are real data" }
  surpriseMoves: []
  substrateTransitions:
    default: sage-ground
    exceptions:
      - { section: "gallery-head + gallery + more-collections", ground: darkroom, purpose: "the collection wall (colorReservations #121413 → module:photo-collection)" }
      - { section: site-footer, ground: graphite, purpose: "canon title block" }
  voiceClassification:
    - { section: breadcrumb, classification: direction-authorized chrome, copy: "Home / Photography / Iowa" }
    - { section: gallery-head, classification: captured-verbatim, copy: "Iowa", source: "copy-of-iowa.json#slots.title" }
    - { section: facts, classification: direction-authorized rewrite, copy: "89 photographs · Midwest · Todd Barnett", source: "count computed (95 − 6 × 403); kind label from canon home teaser; photographer from photography.json#body[0] 'For Todd, photography is one'" }
    - { section: intro, classification: direction-authorized rewrite, copy: "The backroads of the Midwest are one of Todd’s favorite places to visit — for the palpable sense of history, hard work, and honesty of place. Images were taken using a Canon Elph or Sony A6300.", source: "photography.json#body[0] (two sentences merged, no new words of substance) + body[2] (double period fixed)" }
    - { section: gallery, classification: captured-verbatim, copy: "alt 'Iowa — photograph n of 89' (no titles captured)" }
    - { section: lightbox, classification: direction-authorized chrome, copy: "Close · Previous · Next · n / 89" }
    - { section: more-collections, classification: captured-verbatim, copy: "collection titles (taxonomy.json) + computed counts; heading 'More collections' chrome" }
  signatureElements: []
  canonDeviations:
    - { id: 1, move: "compositional move 1 (every page opens on one full-bleed photograph)", deviation: "gallery opens on the darkroom head + wall", reason: "the collection is the photograph — a hero crop would duplicate frame 1 and mis-crop panoramas; the first wall row is in the first viewport at every breakpoint" }
    - { id: 2, move: "compositional move 4 (salon-hung frames on a 12-col grid with varied spans)", deviation: "justified native-ratio flex rows with periodic 1.8× feature frames", reason: "DESIGN.md § Components Gallery specifies justified rows; the 12-col frame grid crops to 3:2 and its fixed spans break on 2–3:1 panoramas and on 2- to 91-photo collections" }
  forkRules:
    intro:
      midwest: "photography.json#body[0] backroads sentence (as above) + camera sentence"
      mexico: "The highlands of central Mexico are one of Todd’s favorite places to visit — for the color, beautiful architecture and warm people who embrace the land. + camera sentence"
      fields-of-vision-2024: "captured slots.intro: 'Fields of Vision Exhibit' · 'Analog Gallery Urbana, IL' · link immaterialbooks.com/fields-of-vision"
      iowa-2022-exhibit: "captured slots.intro: 'Geometries and Views' · 'Impact Coffee, Decorah, IA' + photography.json#body[5]"
    facts: "<N> photographs · <kind label> · Todd Barnett"
```

## Migrate requirements (from the finish review)

- **Wall ending at 600–1129px.** Feature placement is composed at build time (`build-gallery.mjs` simulates the
  wrap at 6 reference widths and moves features in the last 18 frames) so the wall ends on ≥ 2 frames at ≥ 1130px
  and on phones. For Iowa the 2-up/3-up parity cannot be met at 600–1129px; the EDS `photo-collection` block must
  measure its rows at runtime (and on resize) and rebalance so the last row holds ≥ 2 frames (a lone feature on
  phones stays allowed). Record in DESIGN.md § Gallery at canon merge.
- Alt text is the honest placeholder pattern "<Collection> — photograph n of N"; owner-supplied descriptions replace it.
