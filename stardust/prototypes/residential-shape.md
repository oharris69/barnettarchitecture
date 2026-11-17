<!-- stardust:provenance
  writtenBy:        stardust:prototype/shape
  writtenAt:        2026-11-17T19:10:00Z
  page:             residential → /residential  (same template: /commercial, NEW /projects)
  pageUrl:          https://www.barnettarchitecture.com/residential
  againstDirection: stardust/direction.md (Active 2026-11-17T17:20:00Z)
  consumedBy:       impeccable:craft (new-work § 3 "whole surface inside an established world"; concept-seed not run)
  mode:             prep (wave 2, canon consumer), hands-off
  readArtifacts:
    - stardust/current/pages/residential.json, commercial.json, about.json
    - stardust/current/_galleries.clean.json, stardust/.work/prototype/cdn-status.txt
    - stardust/taxonomy.json
    - stardust/canon/* ; DESIGN.md, DESIGN.json, PRODUCT.md
  stardustVersion:  0.32.1
-->
---
slug: residential
url: /residential
archetype: listing (builder stardust/.work/prototype/residential/build.mjs residential|commercial|projects)
register: brand
mode: operate-within-experience (find a comparable project)
surprise: low
dominantDimension: filterable drawing schedule
fidelity: refined
---

# Page shape: listing (Residential)

The captured /residential is a 7-photo slideshow with no text but an h6 credit "Photographs by Joe De Maio";
the 22 projects are reachable only through a dropdown (audit F-005). The redesign makes the page the index itself.

## Sections

1. **site-header** — canon verbatim (no over-media state: `body` has no `data-hero`).
2. **listing-head** (direction-authorized new) — H1 "Residential architecture" (taxonomy page title) at the canon
   hero-thesis scale; intro = two captured About sentences (about.json body[1] s1, body[4] s1 with "BA's" → "Our", the
   light edit home already uses); a dimension string "22 projects"; the captured credit "Photographs by Joe De Maio"
   (only where the captured page carries it — /commercial does not). `data-deviation`: opens on its H1 + index rather
   than a full-bleed photograph (canon move 1) — the index rows are the photographs and reach the first viewport ≥768px.
3. **project-index** (module `project-index`, filterable instance; net-new rendering `project-index-filterable`) —
   12-col: a sticky ruled **filter sheet** (cols 1–3) and the **index** (cols 4–12).
   - Facet groups Sector / Project type / Location / Approach from `taxonomy.json` with counts within the page's set;
     only values with ≥1 project; a group renders only when it has ≥2 values (on /residential the sector group drops).
   - Index bar: live count ("22 projects" → "Showing 6 of 22 projects"), "Clear filters", List | Grid toggle.
   - List view = canon schedule rows (title `heading-lg`, type · location dimension string, 3:2 photo in 4 of 12 cols).
   - Grid view = 3:2 frames, 3-up (2-up ≤899, 2-up compact ≤599), title + facts beneath.
   - Empty state with a "Show all" link.
4. **enquiry** — canon module. 5. **site-footer** — canon.

## Interaction model (progressive enhancement)

- No JS: chips are plain links (`?type=new-home`, …), every project is listed, toggle and Clear are hidden.
- JS: reads `?type=<scope>&location=<loc>&sector=<s>&approach=<theme>&view=grid` on load (home links to
  `/projects?type=<scope>`), filters in place (AND across groups, one value per group, click again to clear),
  pushState per chip, replaceState for the view, popstate restores. Counts recompute against the other active facets;
  zero-count chips get `aria-disabled` (dashed, inert). Unknown values are ignored. Each chip's href is rewritten to the
  URL it would produce, so open-in-new-tab works.
- ≤899px the filter sheet becomes one horizontally scrollable chip row per facet so the index stays near the top.

## Unsourced content

(none). "Showing n of N projects", "Clear filters", "List", "Grid", "No projects match these filters." are
direction-authorized chrome; counts derive from taxonomy.json.

```yaml
_provenance:
  capturedSourceLineage:
    - { section: listing-head, origin: "residential.json#headings[h6] (credit) + about.json#body[1,4] + taxonomy.json#pages[/residential].title" }
    - { section: project-index, origin: "captured nav dropdown Residential▾22 → taxonomy.json#projects[sector=residential]; covers from _galleries.clean.json (cover rule shared with the project archetype)" }
    - { section: enquiry, origin: "canon module enquiry-band" }
    - { section: site-header/site-footer, origin: "canon verbatim" }
  antiTemplatePass:
    - { pattern: index, defaultReflex: "uniform 3-col card grid with a filter dropdown", alternatives: ["card grid + select menus", "masonry wall", "ruled drawing schedule + chip filter sheet, grid as an alternate view"], picked: "schedule default, grid alternate", rationale: "canon move 3 (indexes are ruled schedules); DESIGN.md Layout § Listings asks for both views" }
    - { pattern: filters, defaultReflex: "select dropdowns / off-canvas filter drawer", alternatives: ["selects", "drawer", "visible chip sheet with counts in a sticky rail"], picked: "chip sheet", rationale: "PRODUCT principle 3; 4 facets × ≤7 values fit visibly; counts are real taxonomy data" }
  surpriseMoves: []
  substrateTransitions: { default: sage-ground, exceptions: [ { section: site-footer, ground: graphite, purpose: "canon title block" } ] }
  voiceClassification:
    - { section: listing-head, classification: captured-verbatim, copy: "Although stylistic examples range … raise the spirit. Our practice, particularly for residential, embraces “universal design” …", source: "about.json (BA's → Our)" }
    - { section: listing-head, classification: captured-verbatim, copy: "Photographs by Joe De Maio", source: "residential.json headings h6" }
    - { section: project-index, classification: captured-verbatim, source: "taxonomy titles + facet labels" }
  deviations:
    - { where: listing-head, what: "no full-bleed opening photograph", reason: "an index's subject is the set; rows carry the photographs into the first viewport" }
  canonIssuesObserved:
    - "header[data-nav-collapse=hamburger] { position: relative } (0,1,1) beats .site-header { position: sticky } (0,1,0): on non-hero pages the canon header is not sticky. Not patched (canon is law); reported."
```
