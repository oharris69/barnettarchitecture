<!-- stardust provenance: skill=stardust:dynamics · phase=plan draft · 2026-11-17T20:25:10.682Z · input stardust/current/_dynamics.json (8 pages, 17 findings) · reconciled against stardust/migrated -->
# Dynamic features — draft inventory (curate into `stardust/dynamic-features.md`)

One row per detected finding. Merge duplicates, drop noise, keep every axis honest. Columns: disposition = what we do · reproducibility = what it needs · status = where it stands (reference/triage.md).

| # | id | class | feature | pages | disposition | reproducibility | status | pattern | decision needed | notes |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 | a-unknown-third-party-host-siteassets-parastorage-com | A | unknown third-party host siteassets.parastorage.com | 8/8 | static-snapshot | needs-human-capture | pending | inspect | inspect the XHR, add a vendor row |  |
| 2 | a-unknown-third-party-host-frog-wix-com | A | unknown third-party host frog.wix.com | 8/8 | static-snapshot | needs-human-capture | pending | inspect | inspect the XHR, add a vendor row |  |
| 3 | a-unknown-third-party-host-panorama-wixapps-net | A | unknown third-party host panorama.wixapps.net | 8/8 | static-snapshot | needs-human-capture | pending | inspect | inspect the XHR, add a vendor row |  |
| 4 | a-unknown-third-party-host-visits-visitor-analytics-io | A | unknown third-party host visits.visitor-analytics.io | 8/8 | static-snapshot | needs-human-capture | pending | inspect | inspect the XHR, add a vendor row |  |
| 5 | a-first-party-api-get-api-v1-access-tokens | A | first-party API GET /_api/v1/access-tokens | 8/8 (reach 48/48) | data-fed | needs-business-decision | pending | off-origin-data | which tier for the target host; consumer on the migrated pages? |  |
| 6 | a-first-party-api-get-api-tag-manager-api-v1-tags-sites-uuid | A | first-party API GET /_api/tag-manager/api/v1/tags/sites/{uuid} | 8/8 (reach 48/48) | data-fed | needs-business-decision | pending | off-origin-data | which tier for the target host; consumer on the migrated pages? |  |
| 7 | a-cms-app-settings-object-datalayer | A | CMS / app settings object dataLayer | 8/8 | static-snapshot | self | pending | read-settings | — (keys name endpoints, ids, vendors) |  |
| 8 | a-unknown-third-party-host-static-parastorage-com | A | unknown third-party host static.parastorage.com | 1/8 | static-snapshot | needs-human-capture | pending | inspect | inspect the XHR, add a vendor row |  |
| 9 | f-form-comp-kf4prqpx-no-action-js-wired-4-fields | F | form "comp-kf4prqpx" → no action (JS-wired) (4 fields) | 1/8 | rebuild-native | needs-backend | pending | forms | production endpoint; interim capture ships now |  |
| 10 | m-modal-trigger-aria-haspopup-span-content | M | modal trigger aria-haspopup → span:content | 5/8 (reach 240/48) | rebuild-native | self | delivered-by-capture | modal-loader | none | output already carries "https://www.barnettarchitecture.com/abou" |
| 11 | m-modal-trigger-aria-haspopup-chrome-only-target-outside-dom | M | modal trigger aria-haspopup (chrome only) → target outside DOM at capture | 3/8 (reach 240/48) | rebuild-native | self | delivered-by-capture | chrome-interaction | none (the header contract is the spec) | output already carries "https://www.barnettarchitecture.com/abou" |
| 12 | t-unknown-third-party-host-static-wixstatic-com | T | unknown third-party host static.wixstatic.com | 8/8 | embed-passthrough | needs-business-decision | delivered-by-capture | consent-gated-tags | which tags run on the new host; property ids | output already carries "static.wixstatic.com" |
| 13 | t-unknown-third-party-host-browser-sentry-cdn-com | T | unknown third-party host browser.sentry-cdn.com | 8/8 | embed-passthrough | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 14 | t-unknown-third-party-host-app-worker-visitor-analytics-io | T | unknown third-party host app-worker.visitor-analytics.io | 8/8 | embed-passthrough | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 15 | t-tag-manager-google-tag-manager | T | tag manager: Google Tag Manager | 8/8 | embed-passthrough | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 16 | t-analytics-google-analytics-ads | T | analytics: Google Analytics / Ads | 8/8 | embed-passthrough | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |
| 17 | t-unknown-third-party-host-loadbalancer-visitor-analytics-io | T | unknown third-party host loadbalancer.visitor-analytics.io | 8/8 | embed-passthrough | needs-business-decision | pending | consent-gated-tags | which tags run on the new host; property ids |  |

## Triage

- **Ships autonomously (reproducibility `self`):** 1 row(s) — read-settings.
- **One owner decision batch:** 13 row(s) — inspect the XHR, add a vendor row · which tier for the target host; consumer on the migrated pages? · production endpoint; interim capture ships now · which tags run on the new host; property ids.
- **Already delivered by the capture pipeline:** 3 row(s) — no work.
- **Host-bound on the target:** 0 of 0 probed API paths — the off-origin data work.

## Phases

- **detect** — 6
- **tags** — 6
- **off-origin data** — 2
- **interactive** — 2
- **forms** — 1
