<!-- stardust:provenance
  writtenBy:        stardust:prototype/shape
  writtenAt:        2026-11-17T19:05:00Z
  page:             about (static archetype; siblings team → /about/todd-barnett, testimonials → /testimonials)
  pageUrl:          https://www.barnettarchitecture.com/about
  againstDirection: stardust/direction.md (Active 2026-11-17T17:20:00Z)
  consumedBy:       impeccable:craft
  mode:             prep wave 2 (canon diff mode), hands-off
  readArtifacts:    [stardust/current/pages/about.json, team.json, testimonials.json, copy-of-testimonials.json, copy-of-barnett-architecture.json, stardust/canon/*, stardust/prototypes/index-proposed.html, index-shape.md, DESIGN.md, DESIGN.json, PRODUCT.md, stardust/taxonomy.json, stardust/current/_galleries.clean.json, stardust/.work/prototype/cdn-status.txt]
  stardustVersion:  0.32.1
-->
---
slug: about
url: https://www.barnettarchitecture.com/about → /about
register: brand
surprise: low
dominantDimension: typography/side-rail reading bands on the canon sheet
fidelity: refined
---

# Page shape: about (static archetype)

Captured /about: wordmark H1, H2 "About Us", six paragraphs, one photograph (IMG_0087, window detail).
The redesign is the drawing set's title sheet: who, since when, how, in that order.

## Sections (render order)
1. **skip-link + site-header** (canon, verbatim; `aria-current` on About).
2. **hero** (module `project-hero`, about instance) — full-bleed IMG_0087 (2205×2978, srcset capped at 2205), H1
   "No house style" + who line "About Barnett Architecture, a full-service, design-focused architectural practice in
   Madison, Wisconsin"; caption dimension string "Madison, WI · Est. 2007" (photo itself uncaptioned).
3. **practice** (new compound `prose`, side-rail) — H2 "The practice", dim "Full-service · Design-focused";
   about.json#body[0] (lead = first two sentences) + body[1] sentence 1.
4. **principles** (canon module) — "How we work": One clear idea (body[1] s2) · The Charrette (body[2] full) ·
   Green design (body[3] full) · Universal design (body[4]); links → /about/process, /about/todd-barnett.
5. **services** (prose + new `chain`) — body[5] verbatim; chain dimension of its own stages
   (Programming · Concept design · Full building plans · Construction administration); link → /about/process.
6. **practice-index** (canon `schedule` + new `schedule--text`) — ruled rows: Process (captured phase names),
   Todd Barnett, Architect (team.json#body[1] s1), Testimonials (T.S. quote, count dimension string).
7. **enquiry** (canon module) → **site-footer** (canon).

## Siblings rendered by this archetype
- **/about/todd-barnett** (team.json): hero = captured /team photo (same image as the Willy Street gallery frame →
  caption links /projects/willy-street); prose bands for Todd and Sarah Canon; `schedule--text` for the three groups
  (split from team.json#body[2] at its semicolons); JSON-LD ProfilePage + Person.
- **/testimonials** (merges both era pages; anchors #2007-present, #1990-2006 per taxonomy.json): type-led `opening`
  (H1 + period chips), `notes` wall (the hub's three handwritten notes, uncropped), two `testimonial-list` **ledger**
  sections (44 + 22 entries, full text). 1990–2006 asterisks become the label "Potter Design Group" because the
  captured footnote reads "*Clients of Todd Barnett while at Potter Design Group".

## Layout strategy
12-col ≥900 (rail 4 / body 8, measure 68ch), stacked <900; section rhythm 120/64. Ledger: attribution sticky in the
rail ≥900, stacked above the quote <900. Chain: horizontal segments ≥900, vertical ticked line <900.

## Key states / interaction
Static; nav per canon. Ledger period chips are in-page anchors (scroll-margin under the sticky header). No JS added.

## Data attributes
`body[data-template="static"][data-hero="media"]` (testimonials: no `data-hero`); sections carry
data-section/intent/layout; modules `project-hero`, `principles`, `testimonial-list[data-variant="ledger"]`, `enquiry-band`.

## Unsourced content
(none) — testimonials carries one owner-review flag on a captured paragraph containing "[He/She]".

```yaml
_provenance:
  capturedSourceLineage:
    - { section: hero, origin: "about.json#slots.photos[0] + body[0] (who/where); H1 replaces wordmark H1" }
    - { section: practice, origin: "about.json#body[0,1]" }
    - { section: principles, origin: "module principles — about.json#body[1–4]" }
    - { section: services, origin: "about.json#body[5]" }
    - { section: practice-index, origin: "direction-authorized new (Practice grouping, direction.md ia-fidelity reimagined); process.json headings, team.json#body[1], copy-of-testimonials.json" }
    - { section: enquiry, origin: "canon enquiry-band (contact.json)" }
  antiTemplatePass:
    - { pattern: about-hero, defaultReflex: "team photo + mission statement centered", alternatives: ["type-only title sheet", "split photo/text", "canon full-bleed photo with docked wall label"], picked: "canon full-bleed", rationale: "canon move 1; captured page owns one photograph" }
    - { pattern: values, defaultReflex: "4-up icon value cards", alternatives: ["icon cards", "accordion", "canon 2×2 hairline sheet"], picked: "canon principles", rationale: "canon module, no icons in brand" }
    - { pattern: services-list, defaultReflex: "bulleted services grid", alternatives: ["bullets", "numbered steps", "chain dimension of stages"], picked: "chain dimension", rationale: "a running dimension is the drawing-set notation for consecutive spans; carries only captured stage names" }
    - { pattern: testimonials-long, defaultReflex: "carousel of trimmed quotes / masonry cards", alternatives: ["carousel", "card masonry", "ledger: full letters, sticky attribution rail, period anchors"], picked: "ledger", rationale: "66 long letters; full text is the proof; ruled ledger matches the schedule language" }
  surpriseMoves:
    - { move: "chain dimension (consecutive ticked segments) as the sequence device", bank: "typographic substitution", replaces: "numbered step icons" }
  substrateTransitions: { default: sage-ground, exceptions: [{ section: site-footer, ground: graphite, purpose: "canon title block" }] }
  voiceClassification:
    - { section: hero, classification: direction-authorized rewrite, copy: "No house style", source: "about.json#body[0] 'BA does not employ a distinct architectural style'" }
    - { section: practice/principles, classification: direction-authorized rewrite, source: "BA → we; universal-design sentence trimmed as canon home" }
    - { section: services/practice-index/testimonials, classification: captured-verbatim }
    - { section: headings, classification: direction-authorized chrome, copy: "The practice · How we work · Services · More about the practice · Three groups Todd started" }
  signatureElements:
    - { kind: hero-photograph, capturedSource: "about.json#slots.photos[0]", mechanism: "responsive <img>, eager + fetchpriority=high", fallback: "darkroom ground; scrim ≥0.74 behind text" }
  typeScaleYields: []
```
