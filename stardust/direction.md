<!-- stardust:provenance
  writtenBy: stardust:direct
  mode: prep
  writtenAt: 2026-11-17T17:20:00Z
  readArtifacts:
    - stardust/state.json
    - stardust/current/_brand-extraction.json
    - stardust/current/PRODUCT.md
    - stardust/current/_galleries.clean.json
    - stardust/audit/barnettarchitecture-com/audit.json
  synthesizedInputs: [taxonomy facet assignments (inferred from narratives), palette, type]
  stardustVersion: 0.10.0
-->
---
title: "use stardust aggressively to migrate barnettarchitecture.com with best practices for similar sites, SEO, GEO, taxonomy, images, curated photography section — Bold new look, hands-off"
resolvedAt: 2026-11-17T17:20:00Z
toolkitVersion: "v1.0 (stardust v2)"
schemaVersion: 1
---

# Active direction (2026-11-17T17:20:00Z)

HANDS-OFF ACTIVATED 2026-11-17T16:35Z — user answered "Hands-off, all pages". Every gate below auto-resolves; all quality gates run at full strength.

## Phrase

> please use stardust aggressively to migrate https://www.barnettarchitecture.com/ with best practices for similar sites, and suggested updates for SEO, GEO, taxonomy, and images, including curated photogrpahy section

Clarifying answers: **Direction = "Bold new look"** (a more distinctive, editorial redesign: stronger type, more dramatic full-bleed imagery and motion, keeping the content). **Pace = "Hands-off, all pages"**.

## Restatement

Re-platform the 48-page Wix portfolio onto Edge Delivery with a committed, distinctive brand-register redesign: photographs dominate at full bleed, titles become very large light serif, photography collections move onto dark gallery walls, and facts are annotated like construction drawings. Information architecture is reimagined around a filterable project index, a curated photography hub, and a Practice section, with clean URLs, redirects, structured data and crawlable copy for search and AI answer engines.

## Movements

- **register** — `brand` (inherited from `current/PRODUCT.md`)
- **expressive axis** — `restrained` → `committed` (moved by "Bold new look")
- **tone** — `neutral` → `serious-warm`, voice pinned modest (captured copy; hands-off assumption)
- **density** — `airy` (hands-off assumption: editorial, image-led portfolio with deep per-page imagery — the documented exception to the `balanced` default)
- **distinctiveness** — `familiar` → `distinctive` (moved by "Bold new look")
- **audience** — homeowners in Madison/Wisconsin + community boards + photography audience (hands-off assumption derived from captured narratives)
- **ia-fidelity** — `reimagined` (moved: taxonomy, new project index, photography hub, Practice grouping, testimonial merge)
- **motion** — `editorial` register (hands-off assumption from "dramatic … motion"; reduced-motion respected)
- **constraints** — no fabricated facts; every old URL redirects; WCAG 2.2 AA; no remote DA/EDS writes without an explicit user ask

## Gaps and questions

1. **Q:** How far should the redesign go? **A:** Bold new look.
2. **Q:** How to run it? **A:** Hands-off, all pages.

Named assumptions (hands-off): density airy; motion editorial; audience tuple as above; sector split of the old "Commercial" menu into commercial / community / recreation; testimonials merged into one page; contact form ships as email/phone + placeholder until a backend is chosen.

## Anchor references

- Olson Kundig — projects-first IA with type + location facets (in-toolbox)
- Bohlin Cywinski Jackson — Practice / Process grouping; facts + short narrative (in-toolbox)
- Aperture — photography collections as titled portfolios (off-toolbox, out-of-category)

## Anti-references

- Generic-2026-SaaS silhouette — guardrailed ("bold" is its most common trigger)
- Cream / archival editorial palette — guardrailed (ground is a cool sage tint)
- Stat-callout bar — no numbers exist to fill it; none invented
- Hero text on photo without scrim
- Architect-as-star self-promotion (captured anti-reference)

## Divergence inputs

- **mode** — Rebrand mode active — full divergence-seed roll. Mode A bypassed because the user declined the brand-faithful option ("Bold new look") and the captured surface is a Wix template default (Arial 400; magenta only on the active nav label).
- **seed** — `Barnett Architecture LLC|2026-11-17` MD5 `9bf4874d…` → rolled `1980s × Map engraving × Hospital discharge paperwork × monochrome-tint`; resolved `2025-now (reasoned) × Technical illustration (reasoned) × Museum didactic (reasoned) × monochrome-tint (deterministic)`
- **font deck** — swiss-modernist, substituted: Spectral (display/lead) + Hanken Grotesk (body/labels)
- **palette** — derived: sage-ground #e7ebe6, graphite #1b1e1c, pencil #5b625d, third-lake #0d4b59, darkroom #121413 (all text pairs ≥ 5.2:1)
- **anti-toolbox audit** — 1 hit (sticky nav, desktop only, justified); 3 off-toolbox moves (dimension-string facts bar, big-idea lead, darkroom walls); 1 removed (contour lines)

## Taxonomy, URLs, SEO and GEO decisions

- Facets: sector (residential 22 · commercial 1 · community 3 · recreation 3), project type (new home, addition, renovation, kitchen, outdoor, multi-unit, master plan & study), location (7), approach (green design, universal design, historic context). Assignments in `stardust/taxonomy.json` with a basis quote each — **suggested, owner review recommended**.
- URLs: projects → `/projects/<name>`, collections → `/photography/<name>`, `/process` → `/about/process`, `/team` → `/about/todd-barnett`; `/residential`, `/commercial`, `/photography`, `/about`, `/contact`, `/testimonials` keep their URLs. New `/projects` index. 38 redirects.
- Titles: `{subject} — {type}, {location} | Barnett Architecture`; unique meta descriptions from captured copy; one H1 per page.
- JSON-LD: `ProfessionalService` + `LocalBusiness` site-wide (NAP from /contact); `CreativeWork`/`Place` + `ImageGallery` per project; `ImageGallery` per collection; `BreadcrumbList`; `FAQPage` on Process (answers composed of captured sentences only).
- GEO: home gets a crawlable 80–150-word introduction composed from About copy; hand-written `llms.txt` replacing the Wix one; NAP in the footer of every page.
- Images: responsive `<picture>` with widths up to 2400px; alt text from captured titles or "<project> — photograph <n> of <N>" (no invented detail); lazy-load below the fold, eager + fetchpriority high on the hero only.
- Curated photography: hub with a lead "Selected works" sequence (one strongest frame per collection), collection cards with photo counts, exhibits grouped separately; collections on darkroom walls with lightbox.

## Named deviations

- **gallery-harvest** (`stardust/.work/extract/gallery-harvest.mjs` → `stardust/current/_galleries.json`): supplements extract Phase 2 — Wix pro-gallery items are not in the settled DOM, so the full image lists were read from the page-JSON network responses during a live Playwright render of each page. Replaces nothing; adds the media the crawler could not see.
- **canon merge** (`stardust/.work/migrate/canon-merge.mjs` → `stardust/canon/canon.css`): coordinator merge of the seven wave-2 `stardust/canon/pending/*.css` sheets into canon (deduped; lightbox from copy-of-iowa.css, not the older willy-street copy; the home intro side-rail restored), which now also carries the `:root` tokens, self-hosted `@font-face` rules and base resets. Canon defects fixed in the same pass: sticky header beaten by the stock `header[data-nav-collapse]` rule (now `:where()`), nav `aria-current`, a real `<button>` burger with a no-JS fallback (`head-script.html` + `html.js`), the header scrim on the darkroom token, lightbox button border 3.5:1 / "Photo n of N" count / next-only preload; `--color-error #8a1f11` adopted; runtime photo-wall rebalance added (finish-review migrate requirement). Every approved prototype re-rendered from its builder; pixel-diffed against the pre-merge renders (archived in `stardust/.work/migrate/canon-merge/`, `prototypes-before/`). Replaces the pending sheets; adds nothing to content.
- **new-url migrate layout** (`stardust/.work/migrate/prep-sources.mjs` + `run-units.mjs` → `stardust/migrated/`): migrate writes every page at its NEW URL from `stardust/taxonomy.json` (e.g. `projects/willy-street/index.html`) instead of the skill's URL-literal (source-URL) rule, because the IA is reimagined (`iaFidelity: reimagined`); the plugin driver runs on a derived state (`stardust/.work/migrate/state.json`, pages at their new URLs + the new `/projects` and `/404.html`), and every changed Wix URL is a 301 in `stardust/migrated/redirects.csv` (41 rows; the two testimonial era pages redirect to `/testimonials#…`). Replaces the URL-literal output paths; adds no content.

## Command sequence (proposed)

1. `$stardust direct --prep` (this) — tokens, taxonomy, modules, metadata
2. `$stardust prototype --prep` — archetypes: home (canon author), project (folded-roof), listing (projects), gallery (copy-of-iowa), photography hub, static (about/process), form (contact) — each via `$impeccable shape` → `craft` → `critique` → `audit` → `adapt` → `polish`
3. assets prep (favicon variants — the Wix favicon is generic, so a monogram favicon is generated from the wordmark; fonts self-hosted)
4. dynamics gate (contact form, galleries, Wix analytics)
5. `$stardust migrate` — all pages
6. `$stardust rollout` — EDS blocks + local content (DA upload only on explicit user ask)

## User confirmation

> Hands-off (question answer, 2026-11-17)

## Pages in scope

All 48 extracted pages (+ new `/projects` index; testimonial era pages merged into `/testimonials`).
