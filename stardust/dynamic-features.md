<!-- stardust:provenance
  writtenBy:   stardust:dynamics (Phases 1–3, via prepare-migration Phase 4.5; hands-off)
  writtenAt:   2026-11-17T20:10:00Z
  read:        stardust/current/_dynamics.json (detect on 8 archetype URLs, reach 48/48 from extract), stardust/dynamics/dynamic-features.generated-plan.md (17 draft rows), stardust/prototypes/*-proposed.html, stardust/.work/migrate/final/*.html
  curated:     17 draft rows → 12 features (platform-internal Wix runtime rows merged; analytics rows merged; pro-gallery + listing filters added from the archetype builds, where the Wix pro-gallery is rendered from page JSON the detector does not see)
  handsOff:    every owner decision is a named assumption with an interim tier shipped; nothing is decided-out by assumption
-->
# Dynamic features — barnettarchitecture.com (Wix → static / Edge Delivery)

Summary: `dynamic surface: 12 findings · self 6 · owner batch 3 · host-bound 0 · listings 0 dynamic / 4 static`

## Listings contract

**Static — no query index.** `helix-query.yaml` (and `fstab.yaml`, `paths.json`) are retired on this project
(AGENTS.md § Outdated; config lives at tools.aem.live), so no listing reads `/query-index.json`. Every listing is
**authored rows in the document** (document-first, `reference/listings.md` § Block contract):

| listing | page(s) | rows | facets carried per row (data-attributes on the row, from `stardust/taxonomy.json`) |
|---|---|---|---|
| project index (filterable) | `/projects`, `/residential`, `/commercial` | 29 / 22 / 7 schedule rows | `data-sector`, `data-type` (scope list), `data-location`, `data-approach` (theme list) |
| featured schedule | `/` | 7 rows (taxonomy `featured: true`) | none (links only) |
| related projects | every `/projects/<name>` | 3 rows (same sector or location) | none |
| collection index | `/photography`, home darkroom wall, gallery sibling strips | 8 collections | photo counts as text |

When the owner adds a project, the rows are re-authored (or the listing pages re-migrated from `taxonomy.json`);
an index-backed listing is a later, owner-requested change (it needs a new index configuration at tools.aem.live).

## Features

| # | id | feature | class | reach | disposition | reproducibility | status | pattern | decision / owner | evidence |
|---|---|---|---|---|---|---|---|---|---|---|
| F1 | f-contact-form | Wix contact form "comp-kf4prqpx" (name, email, subject, message; JS-wired, no action) | F | 1/48 (`/contact`) | rebuild-native | needs-backend | interim | forms | **D1 form backend** (owner). Interim tier shipped: native form, inline validation, submit composes a `mailto:` to todd@barnettarchitecture.com (no JS: native `mailto:` post); note under the form says so. No data is stored or sent anywhere else. Not regulated-pii. | `_dynamics.json` f-form-comp-kf4prqpx; migrated `contact/index.html` `form#enquiry[data-dynamic=form][data-tier=interim-mailto]` |
| F2 | m-pro-gallery | Wix pro-gallery (8 collection pages + project galleries; items rendered from page JSON, expand-to-fullscreen viewer) | M | 37/48 | rebuild-native | self | done | modal-loader | — | static justified photo wall (`photo-collection`) / plates (`project-gallery`) + native `<dialog>` lightbox (`photo-lightbox`, keyboard, swipe, `#photo-n` deep links) + runtime row rebalance; full image lists from `stardust/current/_galleries.clean.json` (51 CDN-403 media excluded, `stardust/.work/prototype/cdn-status.txt`) |
| F3 | m-nav-dropdowns | Wix menu dropdowns (aria-haspopup → Projects: Residential / Commercial; Practice pages) | M | 48/48 | rebuild-native | self | done | chrome-interaction | — | canon header: Practice `<details>` disclosure, ≤ 640px `<button>` menu (no-JS fallback), sector links in the listing pages and footer (`_dynamics.json` m-modal-trigger-* rows merged) |
| F4 | l-listing-filters | Project index filters (type / location / sector / approach) + list / grid view | L | 3 pages (`/projects`, `/residential`, `/commercial`) | client-only | self | done | — | — | inline script over the authored rows; query params `?type= &location= &sector= &approach= &view=grid` (facet links from every project's facts bar land here); without JS every project is listed |
| F5 | d-wix-media-cdn | Photographs served by static.wixstatic.com (fill renditions 800/1600/2400) | D | 48/48 | data-fed | self | interim | off-origin-data | **D3 image hosting** (named assumption: rehost at rollout). Interim: the static bundle hot-links the Wix CDN renditions (`media-reconciliation.md`: cross-origin `<img>` kept as source URLs, no `createOptimizedPicture`). EDS rollout imports them into the media bus; must happen before the Wix plan is cancelled. | every migrated page; 51 media already 403 at capture and excluded |
| F6 | t-analytics | Analytics/tags on the Wix site: Google Tag Manager, Google Analytics/Ads (`dataLayer`), visitor-analytics.io (visits / app-worker / loadbalancer) | T | 48/48 | embed-passthrough | needs-business-decision | interim | consent-gated-tags | **D2 analytics on the new host** (owner: which tool, property ids, consent). Interim: **no tags shipped** on the migrated site (metadata-and-jsonld.md § Stripped); martech scaffold not generated (martech is opt-in). | `_dynamics.json` t-tag-manager-google-tag-manager, t-analytics-google-analytics-ads, t-unknown-*-visitor-analytics-io ×3, a-cms-app-settings-object-datalayer, a-unknown-third-party-host-visits-visitor-analytics-io |
| F7 | a-wix-thunderbolt | Wix Thunderbolt page data (`siteassets.parastorage.com/pages/pages/thunderbolt` JSON) and runtime bundles (`static.parastorage.com`) | A | 48/48 | static-snapshot | self | delivered-by-capture | — | — (platform-internal: it only rendered the page; the rendered content ships as static HTML) | reach endpoints in `_dynamics.json` |
| F8 | a-wix-platform-apis | Wix first-party platform APIs `/_api/v1/access-tokens`, `/_api/tag-manager/api/v1/tags/sites/{uuid}` | A | 48/48 | static-snapshot | self | delivered-by-capture | — | — (session/tag plumbing of the Wix runtime; no consumer on the migrated pages; tag decisions live in F6) | `_dynamics.json` a-first-party-api-* |
| F9 | t-wix-telemetry | Wix platform telemetry: frog.wix.com (BI events), panorama.wixapps.net (performance), browser.sentry-cdn.com (Wix's error monitoring) | T | 48/48 | static-snapshot | self | delivered-by-capture | — | — (Wix's own monitoring of its runtime, not site analytics; the static pages carry no runtime to monitor). If the owner wants error monitoring on the new host it joins D2. | `_dynamics.json` rows a-…frog, a-…panorama, t-…sentry |
| F10 | x-lightbox-history | Lightbox deep links and back-button close (`#photo-n`, history state) | M | 37/48 | rebuild-native | self | done | modal-loader | — | `photo-lightbox` script |
| F11 | x-filter-urls | Facet links from project facts bars and the home type-chip row into the filtered index | L | 30/48 | client-only | self | done | — | — | `/projects?type=…` links resolve to `projects/index.html?type=…` in the bundle |
| F12 | x-mailto-tel | Click-to-call / click-to-mail (NAP in footer, enquiry band, contact) | F | 48/48 | static-snapshot | self | done | — | — | `tel:+16082334538`, `mailto:todd@barnettarchitecture.com` |

Reconciled against the migrated output (`dynamics-plan.mjs --migrated stardust/migrated`, 2026-11-17): 3 draft rows already delivered by the bundle (gallery/lightbox, nav disclosure, listing filters) — matches F2–F4; nothing rescheduled.

Gate: every row has a disposition — **pass**. No `client-rendered` blank captures (0/8 probes), no search box, no regulated form, no locale tree.

## Decision batch

One message to the owner (hands-off: recorded, interim tiers shipped, run continues):

1. **D1 — Form backend (F1).** Choose where contact-form submissions go (e.g. a form service, an AEM forms
   endpoint, or email-only). Until then the form composes an email in the visitor's mail app. Needs: endpoint URL,
   spam protection choice, where replies are stored. Assumption recorded: `interim-mailto`.
2. **D2 — Analytics on the new host (F6, F9).** Choose whether to measure the new site (GA4, Adobe, a privacy-first
   tool, or none), the property ids, and whether a consent banner is required. Until then no tags ship.
   Assumption recorded: `none shipped`.
3. **D3 — Image hosting (F5).** Confirm the photographs move off the Wix CDN at rollout (EDS media bus), and keep
   the Wix account until rollout is live. Assumption recorded: `rehost at rollout` (self once rollout runs).

## Register (decided-out)

| feature | reason | production statement |
|---|---|---|
| — | none — nothing is decided-out (hands-off assumptions never decide out) | — |
