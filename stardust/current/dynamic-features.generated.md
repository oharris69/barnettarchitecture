# Dynamic features — detected (2026-11-17T20:04:25.103Z)

Pages probed: /, /willy-street, /residential, /copy-of-iowa, /photography, /about, /process, /contact · settle 5000 ms · width 1440 · reach from 48/48 crawled pages

Evidence only. Every row must receive a disposition in `stardust/dynamic-features.md` (`dynamics-plan.mjs` drafts it).

| id | class | feature | pages | reach | evidence | hint |
|---|---|---|---|---|---|---|
| a-unknown-third-party-host-siteassets-parastorage-com | A API / personalisation / settings | unknown third-party host siteassets.parastorage.com | 8/8 |  | siteassets.parastorage.com | inspect |
| a-unknown-third-party-host-frog-wix-com | A API / personalisation / settings | unknown third-party host frog.wix.com | 8/8 |  | frog.wix.com | inspect |
| a-unknown-third-party-host-panorama-wixapps-net | A API / personalisation / settings | unknown third-party host panorama.wixapps.net | 8/8 |  | panorama.wixapps.net | inspect |
| a-unknown-third-party-host-visits-visitor-analytics-io | A API / personalisation / settings | unknown third-party host visits.visitor-analytics.io | 8/8 |  | visits.visitor-analytics.io | inspect |
| a-first-party-api-get-api-v1-access-tokens | A API / personalisation / settings | first-party API GET /_api/v1/access-tokens | 8/8 | 48/48 | GET /_api/v1/access-tokens → 200 | api |
| a-first-party-api-get-api-tag-manager-api-v1-tags-sites-uuid | A API / personalisation / settings | first-party API GET /_api/tag-manager/api/v1/tags/sites/{uuid} | 8/8 | 48/48 | GET /_api/tag-manager/api/v1/tags/sites/{uuid}?htmlsiteId,language,wixSite → 200 | api |
| a-cms-app-settings-object-datalayer | A API / personalisation / settings | CMS / app settings object dataLayer | 8/8 |  |  | settings |
| a-unknown-third-party-host-static-parastorage-com | A API / personalisation / settings | unknown third-party host static.parastorage.com | 1/8 |  | static.parastorage.com | inspect |
| f-form-comp-kf4prqpx-no-action-js-wired-4-fields | F form | form "comp-kf4prqpx" → no action (JS-wired) (4 fields) | 1/8 |  | text:name-*,email:email,text:subject,textarea:textarea_comp-kf4prqrn | forms |
| m-modal-trigger-aria-haspopup-span-content | M modal / interactive | modal trigger aria-haspopup → span:content | 5/8 | 240/48 | https://www.barnettarchitecture.com/about<br>https://www.barnettarchitecture.com/residential<br>https://www.barnettarchitecture.com/commercial | modal |
| m-modal-trigger-aria-haspopup-chrome-only-target-outside-dom | M modal / interactive | modal trigger aria-haspopup (chrome only) → target outside DOM at capture | 3/8 | 240/48 | https://www.barnettarchitecture.com/about<br>https://www.barnettarchitecture.com/residential<br>https://www.barnettarchitecture.com/commercial | chrome-interaction |
| t-unknown-third-party-host-static-wixstatic-com | T tag / consent | unknown third-party host static.wixstatic.com | 8/8 |  | static.wixstatic.com | inspect |
| t-unknown-third-party-host-browser-sentry-cdn-com | T tag / consent | unknown third-party host browser.sentry-cdn.com | 8/8 |  | browser.sentry-cdn.com | inspect |
| t-unknown-third-party-host-app-worker-visitor-analytics-io | T tag / consent | unknown third-party host app-worker.visitor-analytics.io | 8/8 |  | app-worker.visitor-analytics.io | inspect |
| t-tag-manager-google-tag-manager | T tag / consent | tag manager: Google Tag Manager | 8/8 |  | www.googletagmanager.com | tags |
| t-analytics-google-analytics-ads | T tag / consent | analytics: Google Analytics / Ads | 8/8 |  | www.google-analytics.com | tags |
| t-unknown-third-party-host-loadbalancer-visitor-analytics-io | T tag / consent | unknown third-party host loadbalancer.visitor-analytics.io | 8/8 |  | loadbalancer.visitor-analytics.io | inspect |
