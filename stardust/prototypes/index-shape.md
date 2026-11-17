<!-- stardust:provenance
  writtenBy:        stardust:prototype/shape
  writtenAt:        2026-11-17T17:58:00Z
  page:             index
  pageUrl:          https://www.barnettarchitecture.com/
  againstDirection: stardust/direction.md (Active 2026-11-17T17:20:00Z)
  consumedBy:       impeccable:craft
  mode:             prep (canon-author), hands-off
  readArtifacts:
    - stardust/current/pages/index.json
    - stardust/current/pages/about.json
    - stardust/current/pages/team.json
    - stardust/current/pages/contact.json
    - stardust/current/pages/photography.json
    - stardust/current/pages/copy-of-testimonials.json
    - stardust/current/_galleries.clean.json
    - stardust/current/_brand-extraction.json
    - stardust/audit/barnettarchitecture-com/audit.json
    - stardust/taxonomy.json
    - DESIGN.md
    - DESIGN.json
    - PRODUCT.md
    - stardust/direction.md
  stardustVersion:  0.32.1
-->
---
slug: index
url: https://www.barnettarchitecture.com/
register: brand
surprise: medium
dominantDimension: composition/drawing-schedule-index
fidelity: refined
---

# Page shape: index (home, canon-author)

The captured home is an uncaptioned 9-slide carousel with zero body text and the wordmark
as its only H1 (audit F-002, F-003, F-021). The redesign keeps the one thing it does well —
it opens on a photograph — and replaces everything else with facts people and machines can quote.

## Sections (in render order)

1. **skip-link + site-header** (system-component `site-header`, module `site-header`) —
   wordmark "Barnett Architecture" (link, never a heading) left; nav right: Projects ·
   Photography · Practice (disclosure: About, Process, Todd Barnett, Testimonials) · Contact,
   all to the NEW URLs in `taxonomy.json`. On this page the header floats transparent over the
   hero on its own top scrim; on desktop it is fixed and settles to sage + graphite at the hero's
   end (CSS scroll timeline; no-support fallback = scrolls away with the hero). ≤640px: stock
   hamburger collapse, not sticky.
2. **hero** (module `project-hero`, home instance) — full-bleed Willy Street photograph
   (`5c8b97_f3ad8f…`, 4368×2912 — `_brand-extraction.json#voice.heroImage`, also
   `defaultOgImage`), 100svh. H1 docked bottom-left on a bottom scrim (≥0.6 darkroom
   behind every glyph → ≥4.5:1 regardless of pixels): small-caps line "Barnett Architecture ·
   Architectural practice in Madison, Wisconsin" + display line "Projects meant to “fit” the
   client". Bottom-right: the photo's caption as a dimension string — "Willy Street · New home ·
   Madison, WI" linking to `/projects/willy-street`. No CTA pair.
3. **intro** (direction-authorized new, GEO) — 95-word crawlable introduction composed only from
   About/Team/Contact sentences (see Voice). Left rail: label "The practice" + dimension string
   "Madison, WI · Est. 2007". Right: lead-size first two sentences, body-size remainder.
4. **featured** (module `project-index`, home instance: featured, no facets) — "Selected projects"
   as a **drawing schedule**: 7 ruled rows (taxonomy `featured: true`), each a single link:
   sheet number (01–07) · title in Spectral light · dimension-string facts (sector · type ·
   location from taxonomy) · photograph 3:2. Head carries "All 29 projects" → `/projects`.
5. **testimonial** (direction-authorized new; content from `copy-of-testimonials.json`) — one quote
   verbatim, hung as wall text at headline scale; attribution "JFH and KG · Madison, WI" in a
   dimension string; link "Read the testimonials" → `/testimonials`.
6. **principles** (module `principles`) — "How we work": four items from About copy — Fit the
   client · The Charrette · Green design · Universal design — on a 2×2 hairline sheet, with
   "About the practice" → `/about` and "The process" → `/about/process`.
7. **photography** (module `collection-index`, home teaser) — darkroom wall. H2 "Photography" +
   one verbatim lead sentence from the photography page; one frame per collection (8), salon-hung
   on a 12-col grid with varied spans; regions/portraits first, then the two exhibits; each frame a
   link to `/photography/<name>` with title + kind label. "All collections" → `/photography`.
8. **enquiry** (module `enquiry-band`) — heading "Please contact us" (captured /contact H2,
   sentence case), the services sentence from About, then the email and phone as large links and
   the street address.
9. **site-footer** (system-component `site-footer`, module `site-footer`) — graphite ground:
   wordmark, `<address>` NAP, sitemap columns (Projects / Photography / Practice / Contact), ©.
   The captured "© 2015 by Barnett Architecture LLC" and unlinked Twitter/Facebook icons are dropped
   (audit F-024; DESIGN.json module note).

## Layout strategy

- Shell max 1440px (`containerMaxWidth`), `gutter` side padding; photographs break the shell.
  The captured 980px Wix canvas is not inherited (DESIGN.json breakpoints note) — flagged here
  per token-contract § Sizing `--max-width`.
- 12-col grid ≥900px; 600–899 simplified 6-col; <600 single column. Mobile hamburger ≤640px.
- Section rhythm 120px desktop / 64px mobile. Text measure ≤68ch.
- Featured rows: number 1 col · text 6 cols · photo 5 cols; <900px photo stacks above text.
- Photography wall spans per row: [5,4,3] [3,3,6] [7,5].

## Key states

- Default only (static page). Header: over-media state (scroll 0) and settled state (past hero,
  desktop). Mobile nav: closed / open. Practice disclosure: closed / open.
- Image failure: frames keep their aspect box on a darkroom/hairline tint so the layout holds
  (49 of 521 captured Wix media 403 today — none of the frames picked here).

## Interaction model

- Nav: Practice uses native `<details>`; mobile panel = stock checkbox hamburger + ≤10-line script
  (aria-expanded sync, Enter/Space on the label, Escape closes panel and any open disclosure).
- Every featured row and photography frame is one link (title is the accessible name).
- Hover: image scale 1.02 (900ms), underline draw-in on text links. Focus: 2px third-lake
  ring (third-lake-light on dark grounds).
- Motion: static file carries no reveal motion. Phase 2.4 layers the `editorial` register in
  `index-cinematic.html` (long opacity fades, ≤10vh hero parallax, no translate on text beyond
  DESIGN.json's 24px title rise).

## Data attributes

- `body[data-template="landing"][data-hero="media"]`
- `header[data-section="site-header"][data-intent="navigate"][data-layout="edge-to-edge"][data-module="site-header"][data-canon][data-nav-collapse="hamburger"]`
- `section[data-section="hero"][data-intent="emotional hook + say who, where, what"][data-layout="full-bleed"][data-media="image"][data-module="project-hero"]`
- `section[data-section="intro"][data-intent="crawlable practice facts (GEO)"][data-layout="side-rail"]`
- `section[data-section="featured-projects"][data-intent="lead with the work"][data-layout="stack"][data-items="7"][data-module="project-index"][data-fragment="project-card"][data-fragment-role="reuse"][data-fragment-source="/projects"]`
- `section[data-section="testimonial"][data-intent="build trust"][data-layout="contained"][data-module="testimonial-list"]`
- `section[data-section="principles"][data-intent="explain the practice"][data-layout="grid"][data-items="4"][data-module="principles"]`
- `section[data-section="photography"][data-intent="curated photography teaser"][data-layout="grid"][data-items="8"][data-media="image"][data-module="collection-index"]`
- `section[data-section="enquiry"][data-intent="drive action"][data-layout="contained"][data-module="enquiry-band"]`
- `footer[data-section="site-footer"][data-intent="navigate + NAP"][data-layout="grid"][data-module="site-footer"][data-canon]`

Slots: `data-slot` on `wordmark`, `nav`, `image`, `title`, `facts`, `cards`, `quote`,
`attribution`, `items`, `collections`, `heading`, `email`, `phone`, `nap`, `sitemap`, `copyright`
per DESIGN.json module slot names. The intro has no module (bespoke to home).

## Unsourced content (placeholder list)

(none) — every literal on the page traces to captured copy, taxonomy facts, DESIGN.json
metadata or a direction-authorized label. No stats, years, awards or captions are invented;
photos are uncaptioned beyond the project/collection facts we hold.

## Open questions for craft

- Collection frames show no photo counts on home: 49 captured media now 403 on the Wix CDN
  (Iowa 2022 Exhibit 23/27, Mexico — Places 14/24), so captured counts would overstate what
  the hub can show. Counts are left to the photography hub archetype.
- Small originals (Green Ribbon 1024w, designCraft 1000w, Folded Roof 1500w) cap their srcset at
  the original width rather than requesting upscaled 1600/2400 renditions.

```yaml
_provenance:
  capturedSourceLineage:
    - { section: site-header, origin: "site-wide system-component (carried from _brand-extraction.json#systemComponents[id=site-header]); 7-item dropdown nav re-grouped per DESIGN.json iaPriorities + taxonomy.json new URLs" }
    - { section: hero, origin: "consolidates captured carousel pages/index.json#slots.photos (9 slides) into one frame: _brand-extraction.json#voice.heroImage (Willy Street); H1 replaces captured wordmark H1 (audit F-002)" }
    - { section: intro, origin: "direction-authorized new — direction.md § GEO 'home gets a crawlable 80–150-word introduction composed from About copy'; sentences from about.json#body[0,1,5], team.json#body[5], contact.json#slots.nap" }
    - { section: featured-projects, origin: "derived from captured nav dropdowns (Residential▾22, Commercial▾7) + taxonomy.json#projects[featured]; photos from _galleries.clean.json per project" }
    - { section: testimonial, origin: "direction-authorized new placement — copy-of-testimonials.json#body (JFH and KG paragraph), verbatim excerpt" }
    - { section: principles, origin: "module principles — about.json#body[0,1,2,3,4] (fit the client / Charrette / green design / universal design)" }
    - { section: photography, origin: "derived from captured nav Photography▾(8) + taxonomy.json#collections; one frame per collection from _galleries.clean.json; lead sentence photography.json#slots.intro[0]" }
    - { section: enquiry, origin: "direction-authorized new (audit F-006 no CTA anywhere); copy from contact.json (H2 + NAP) and about.json#body[5]" }
    - { section: site-footer, origin: "site-wide system-component (carried from _brand-extraction.json#systemComponents[id=site-footer]); template junk dropped, NAP added (audit F-004, F-024)" }
  antiTemplatePass:
    - { pattern: hero, defaultReflex: "centered-stack hero with two-button CTA pair over photo", alternatives: ["split 5/7 photo + type panel", "type-only hero with photo below", "full-bleed photo with bottom-docked wall label + caption dimension string"], picked: "full-bleed photo, bottom-docked wall label, caption as facts", rationale: "captured home opens on a full-bleed photo carousel; keep the photograph, make it a single exhibited frame with a didactic label (museum-didactic register) instead of slides" }
    - { pattern: project-cards, defaultReflex: "3-up image-card grid", alternatives: ["3-up card grid", "alternating zig-zag plates", "drawing-schedule ledger of ruled rows with sheet numbers + dimension-string facts"], picked: "drawing-schedule ledger", rationale: "DESIGN.md names list view as the typographic substitution for the index; sheet numbers and dimension strings are the construction-document device; card grid is the universal silhouette" }
    - { pattern: principles, defaultReflex: "4-up icon feature cards", alternatives: ["4-up icon cards", "accordion", "2×2 hairline sheet with numbered cells"], picked: "2×2 hairline sheet", rationale: "plan-grid hairlines echo drawn sheets; no icons exist in the brand; copy is long enough to need two-column cells" }
    - { pattern: collection-teaser, defaultReflex: "5-up image-card grid as category nav / carousel", alternatives: ["horizontal scroll strip", "uniform 4×2 grid", "salon-hung wall of varied spans on darkroom"], picked: "salon-hung darkroom wall", rationale: "owner exhibits photographs (Fields of Vision 2024, Iowa 2022); an exhibit wall is the brand's own medium" }
    - { pattern: cta-band, defaultReflex: "accent-colour CTA band with button pair", alternatives: ["accent-field band", "sticky contact bar", "large typographic email/phone on sage"], picked: "typographic enquiry on sage", rationale: "accent ≤5% rule; the contact facts themselves are the CTA" }
  surpriseMoves:
    - { move: "document-shape substitution: project index as a drawing schedule (sheet numbers, ruled rows)", bank: "divergence-toolkit § Non-template move bank — typographic substitution", replaces: "card-grid cliché" }
  substrateTransitions:
    default: sage-ground
    exceptions:
      - { section: photography, ground: darkroom, purpose: "the darkroom wall — photography is the owner's exhibited practice (colorReservations: collection-index selected-works)" }
      - { section: site-footer, ground: graphite, purpose: "closes every page as a solid title block carrying NAP" }
  voiceClassification:
    - { section: site-header, classification: direction-authorized rewrite, copy: "Projects · Photography · Practice · About · Process · Todd Barnett · Testimonials · Contact", source: "DESIGN.md § Components Header; taxonomy.json#pages titles" }
    - { section: hero, classification: direction-authorized rewrite, copy: "Barnett Architecture · Architectural practice in Madison, Wisconsin / Projects meant to “fit” the client", source: "about.json#body[0] 'Projects are meant to “fit” the client'; contact.json NAP; direction.md 'page subject in the H1'" }
    - { section: hero-caption, classification: captured-verbatim, copy: "Willy Street · New home · Madison, WI", source: "willy-street.json#slots.title/location; taxonomy scope label" }
    - { section: intro, classification: direction-authorized rewrite, source: "about.json#body[0,1,5], team.json#body[5] — light edits only (BA→we, Madison→Madison, Wisconsin)" }
    - { section: featured-projects, classification: captured-verbatim, source: "taxonomy.json titles + facet labels; heading 'Selected projects' direction-authorized chrome" }
    - { section: testimonial, classification: captured-verbatim, copy: "We couldn’t be happier with the house. Not only does it look great and is extremely functional, but it feels like it was meant for the site.", source: "copy-of-testimonials.json#body (JFH and KG, Madison, WI)" }
    - { section: principles, classification: direction-authorized rewrite, source: "about.json#body[0–4], trimmed; item titles are labels (direction-authorized chrome)" }
    - { section: photography, classification: captured-verbatim, copy: "Two of Todd’s favorite places to visit are the highlands of central Mexico and the backroads of the Midwest.", source: "photography.json#slots.intro[0]; titles from taxonomy.json#collections" }
    - { section: enquiry, classification: captured-verbatim, source: "contact.json H2 'Please Contact Us' + NAP; about.json#body[5] first sentence" }
    - { section: site-footer, classification: captured-verbatim, source: "contact.json NAP; DESIGN.json metadata.organization" }
  signatureElements:
    - { kind: hero-photograph, capturedSource: "pages/index.json#slots.photos (full-width slideshow)", mechanism: "single full-bleed responsive <img> (800/1600/2400w), eager + fetchpriority=high", fallback: "darkroom ground behind the image box; scrim keeps text ≥4.5:1" }
  typeScaleYields: []
```
