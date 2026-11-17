# stardust journal — barnettarchitecture.com

## 2026-11-17 — extract --prep, audit, direct --prep (hands-off)

**Prompt:** "use stardust aggressively to migrate https://www.barnettarchitecture.com/ with best practices for similar sites, and suggested updates for SEO, GEO, taxonomy, and images, including curated photography section". Answers: Bold new look; Hands-off, all pages.

**Done:** 48/48 pages captured live (Wix). Named deviation: gallery-harvest read full Wix gallery data from page JSON (155 project photos, 298 collection photos). Audit: 37/100, 32 findings (no meta descriptions, wordmark H1 everywhere, copy-of-* slugs, empty home, NAP only on /contact, no CTA, 13px body, empty alt, TBT ~1.9s mobile). Direction: rebrand mode — sage/graphite/third-lake/darkroom, Spectral + Hanken Grotesk, dimension-string facts, big-idea lead, darkroom photo walls. Taxonomy + 38 redirects in stardust/taxonomy.json (suggested; owner review).

**Open:** facet assignments need owner review; contact form backend undecided (interim: email/phone); project years/awards absent — not to be invented. No commits made (user has not asked).

## plan — index shape brief authored (2026-11-17)

**Done:** `stardust/prototypes/index-shape.md` (canon-author, surprise medium, dominantDimension composition/drawing-schedule-index). Sections: header · full-bleed Willy Street hero with wall-label H1 · 95-word GEO intro from About/Team/Contact · featured projects as a drawing schedule (7 rows) · verbatim JFH and KG quote · principles 2×2 sheet · darkroom photography wall (8 frames) · enquiry · graphite footer. Brief validators: lineage 9/9, anti-template 5 patterns, substrate exceptions 2, voice classified, unsourced none.
**Found:** 49 of 521 captured Wix media now return 403 (Iowa 2022 Exhibit 23/27, Mexico — Places 14/24, Iowa 6, Wisconsin 2 …) — list at `stardust/.work/prototype/cdn-status.txt`; later gallery archetypes must filter on it.

## render — index-proposed.html via impeccable craft (2026-11-17)

**Done:** `stardust/prototypes/index-proposed.html` built from `stardust/.work/prototype/index.src.html` (scratch builder `build.mjs` expands responsive Wix `<img>` tags + inlines the captured favicon). impeccable new-work: world and structure brief-pinned, concept-seed not run (recorded in the direction-contract comment). Validation at 1440/768/390/360: 0 console errors, 0 failed requests, 0 overflow, 1 H1, no heading skips, 16/16 images loaded with alt, LCP eager + fetchpriority=high, nav open/Escape/close OK, keyboard reaches every control; mobile-nav fixture clean; burger source order OK; detector [].
**Fixed in pass 2:** Practice disclosure overflowed right at 768 (right-aligned); email wrapped at 1440 (size + column).

## critique — dual-agent critique + audit on index-proposed.html (2026-11-17)

**Done:** critique A (design review) + B (detector/browser overlay) in isolated sub-agents, audit in a third. Merged: 2 P1 (focus rings 1.21:1 / 1.91:1) fixed; 6 P2 — 5 fixed (scrim bound to text block, schedule 6/6 + CTA in head, duplicate services line, facet-chip entry row, wall orphan), 1 declined (sheet numbers: craft-floor ban); font fallback deferred to assets prep. Detector CLI 0; overlay 25 hits all false positives (gradient underline idiom). Vision gate pass.

## audit — technical audit (2026-11-17)

**Done:** contrast recomputed per line box over the scrims (worst case 6.15:1 header, 7.96:1 thesis); LCP eager+high; no JS-hidden state; JSON-LD parses; all 16 Wix URLs 200.

## adapt — viewport adaptation (2026-11-17)

**Done:** 9 @media rules (380/599/640/899/900, pointer:coarse, short-landscape, reduced-motion); fixed 28px overflow at 320 (burger label visually hidden ≤380). No overflow 1920→320; mobile-nav fixture clean; burger source order OK. Final screenshots in stardust/validation/index/.

## motion — editorial register layered as index-cinematic.html (2026-11-17)

**Done:** Phase 2.4 via `stardust/.work/prototype/build-cinematic.mjs`: Lenis staged into stardust/prototypes/, canonical runtime embedded verbatim with editorial animConfig (parallax 10vh, slide 24px, stagger 0.18, trigger 1.0), noscript + reduced-motion overrides, 7 `[data-anim]` (one per band) + hero `[data-parallax]`. Static `index-proposed.html` untouched and remains the migrate source.

## motion-validation — Passes 1–6 on index-cinematic.html (2026-11-17)

**Done:** 8 probe positions × 5 viewports clean (0 hidden, 0 overlaps); every reveal ≥0.95 at reading position; reduced-motion and no-JS complete; Lenis ok, no scroll-jack; register-match ok; cliff 7/80. **Fixed:** runtime peer-index stagger left the 7th schedule row hidden → one reveal per band; trigger 0.85→1.0 so nothing waits hidden in the bottom 15% of the viewport.

## approval — index approved (hands-off) + canon write-back (2026-11-17)

**Done:** gates clean (critique/audit 0 open P0/P1; adapt clean 1920–320; motion validation clean; impeccable finish review 5/5 material fixes resolved, "remaining: clear"). State index → prototyped → approved (approvedBy hands-off). Fold-back: n/a (single variant). Canon written: stardust/canon/{header,footer,skip-link,nav-script}.html, canon.css (compound CSS only, smoke-rendered standalone without overflow), modules/{project-hero,project-index,testimonial-list,principles,collection-index,enquiry-band,site-header,site-footer}.html; DESIGN.json.extensions.canon (pinned, 7 compositionalMoves, file shas, history) — no other DESIGN.json bytes changed.
**Not done (by constraint):** impeccable documenter (DESIGN.md is owned by stardust direct; only the DESIGN.json canon block may be written). DESIGN.md wording gaps for a later direct pass: labels render uppercase not small-caps; dimension string not used as section divider; drawing schedule / salon wall / facet-chip row undocumented; print-white mats unused. modules[].canonicalRendering left untouched — renderings referenced from extensions.canon.files.modules instead.

## 2026-11-17 — prototype --prep (hands-off, 2 waves)

**Done:** home approved first (canon-author: header/footer/canon.css/8 modules/7 compositional moves). Wave 2 in parallel: willy-street (project) + residential (listing; also renders /commercial and new /projects), copy-of-iowa (gallery) + photography (photo-hub), about + process (FAQ, process-steps) + contact (form placeholder → mailto). All approved hands-off after gates. Named deviation (concurrency): wave-2 agents wrote net-new CSS to stardust/canon/pending/<slug>.css instead of editing canon.css; coordinator merges.

**Findings:** 51 Wix media 403 (stale gallery entries; excluded). No photo has a real title (Wix placeholder punctuation / camera filenames) → no captions; alt = "<subject> — photograph n of N" pending owner descriptions. 1990–2006 testimonials = Potter Design Group era (captured footnote). Team page also lists Sarah Canon.

**Owner review:** headlines "No house style" / "From pre-design to construction" are rewrites; "Photographs by Joe De Maio" credit scope; "[He/She]" template text in one testimonial; facet assignments.


## canon merge — pending sheets merged, canon defects fixed (2026-11-17)

**Done:** `stardust/canon/canon.css` now carries tokens (+ `--color-error #8a1f11`), self-hosted `@font-face`, base resets, chrome and every archetype's classes (7 pending sheets merged by `.work/migrate/canon-merge.mjs`; lightbox from copy-of-iowa.css; home intro restored; pending archived in `.work/migrate/canon-merge/`). Fixed: sticky header (stock rule now `:where()`), nav `aria-current` (page/true; Practice group `.is-current`), `<button>` burger with no-JS fallback (`canon/head-script.html`), scrim on the darkroom token, lightbox border 3.5:1 + "Photo n of N" + next-only preload, runtime photo-wall rebalance (`photography/wall-balance.js`). Builders now share `.work/prototype/chrome.mjs`; all 10 approved prototypes + 33 forks re-rendered. DESIGN.json (colors.error, reservation, canon files/shas/history), DESIGN.md prose, direction.md named deviation.
**Verified:** pixel diff vs pre-merge at 1440/390 — 0 px except the nav underline (row 59) and gallery/hub phones gaining the canon ≤599 header/section padding their shell had omitted; Playwright 10/10 clean (console, overflow, H1, menu open/close, no-JS nav, sticky).

## assets — monogram favicon + self-hosted fonts (2026-11-17)

**Done:** "BA" monogram (Spectral 400 outlines → SVG paths, graphite on sage): `migrated/assets/favicon.svg`, favicon-32/512, apple-touch-icon (180), icon-192/512, site.webmanifest. Fonts: Spectral 300/400/300 italic + Hanken Grotesk variable 300–700, latin woff2 (SIL OFL 1.1) in `migrated/assets/fonts/`; metric-matched fallbacks computed over captured About copy (Arimo/Gelasio stand-ins for Arial/Georgia). Font preloads dropped (CORS-blocked on file://).

## detect, classify, triage — dynamic surface gate (2026-11-17)

**Done:** `dynamics-detect.mjs` on 8 archetype URLs (17 findings, reach 48/48) → `dynamics-plan.mjs` → curated `stardust/dynamic-features.md` + `-plan.md`: 12 features · self 6 · owner batch 3 · host-bound 0 · listings 0 dynamic / 4 static (no index: helix-query.yaml retired). Decisions named, interim tiers shipped: D1 form backend (mailto), D2 analytics on the new host (none shipped), D3 image hosting (Wix CDN until rollout). Nothing decided-out.

## plan, render, assets, state-and-report — migrate (2026-11-17)

**Done:** 48 pages into `stardust/migrated/` at the NEW URLs (named deviation: new-url migrate layout): 10 Path A (approved), 37 Path A′ (28 projects, commercial, /projects, 7 collections, todd-barnett, testimonials), 1 Path B (404). Plugin driver on a derived state, 11 recorded units (`stardust/migrate/progress.json`); canon linked as `assets/canon.css`; sidecars carry url-remap / source-transform / dynamic-dependency / recomposed / owner-review entries and content-count + validation gates. Sitewide: robots.txt, sitemap.xml (47 URLs, 494 image entries), llms.txt (hand-written), redirects.csv (41 × 301). State: 48 pages → migrated (the two testimonial era pages as merged redirects); `state.json.migrate` written.
**Verified:** `_validation.json` 48/48 pass (1440 + 390 + no-JS: 0 console errors, 0 failed requests, 0 overflow, one H1, alt everywhere, 0 broken images; 1,778 internal refs resolve). Flows: `?type=` filter, lightbox count/announce/Esc, form validation. Plugin fixtures pagemap-audit / file-protocol-audit exit 1 on 130 findings that are all query-string facet links (fixtures strip `#` not `?`) — 0 other findings.
**Owner review:** "[He/She]" testimonial kept verbatim (sidecar owner-review); About copy in first person ("BA" → "we/our"); contact form is mailto until D1; analytics D2; Wix CDN images until rollout (D3).

## 2026-11-17 — EDS conversion (local only)

**Done:** block contract (stardust/.work/eds/block-contract.md); blocks hero, facts, big-idea, gallery(+wall, dialog lightbox), project-index(+filters, related), pager, collection-index(+selected, strip), testimonials(+ledger), principles, process-steps, faq, contact-form (mailto interim), breadcrumbs, header, footer; styles with self-hosted Spectral + Hanken Grotesk; JSON-LD built in scripts.js from metadata (no JSON in cells). Content: 48 pages + nav/footer/fragments/enquiry generated by tools/importer (8 templates, 14 parsers) with run-bulk-import from the migrated static site — 48/48 success. llms.txt, robots.txt, sitemap.xml at repo root. Lint clean. Preview verification: 10 key templates clean at 1440/390.

**Not done (needs explicit ask):** DA upload / preview / publish; redirects sheet upload (stardust/migrated/redirects.csv, 41 × 301); no git commit.

## 2026-11-17 — Houzz profile added as a source (user-supplied)

**Prompt:** additional context: Houzz profile (houzz.com … barnett-architecture-llc-pfvwus-pf~914672624). User chose to show visibly: Best of Houzz awards, Houzz rating, areas served + services (not cost range or license).

**Done (direct local edits to content/about, contact, footer .plain.html — re-running the importer would overwrite them):** About gains a fuller services sentence, "Areas we serve" (14 towns) and "Recognition" (Best of Houzz Service 2014/2016/2018; 4.8/5 from 17 reviews; Houzz link); Contact gains the service-area line; footer gains the awards/rating link on every page. scripts.js organization JSON-LD: City areaServed, award, sameAs Houzz, wider knowsAbout. llms.txt and DESIGN.json metadata updated. No aggregateRating markup (self-serving reviews ineligible for rich results).

**Open:** "structural engineering" is listed on Houzz — owner to confirm it belongs on the site. Houzz project names (St. Paul House, Owen Drive, Donges Bay, Breese Kitchen, Box House) map uncertainly to site projects (Box House = old /box-house "Push-Pull"); not merged. Review texts were not accessible.

## 2026-11-17 — Testimonials grouping reviewed

Considered decade sections; 15 of 66 testimonials are undated (3 in 2007–present, 12 in 1990–2006) and source order is not strictly chronological, so decades would need guesswork. User chose: keep the two sections. Open for owner: three quotes dated 2006 sit in the 2007–present list without a Potter Design Group tag — confirm firm attribution.

2026-11-17 — Tagged the three 2006–07 quotes in the 2007–present section (Wisconsin Fertility Institute; AP, Madison; JY and EY, Urbana) as Potter Design Group at the user's request (direct .plain.html edit).

## 2026-11-17 — DA upload + preview (explicit user ask)

Uploaded all 51 content documents (48 pages + nav, footer, fragments/enquiry) to DA oharris69/barnettarchitecture and previewed them (no publish). DA source == local content on 51/51; delivered .plain.html: 51/51 HTTP 200, one H1 per page, 671 images ingested to the media bus (two transient about:error fixed by re-preview). Redirects: 41 rows uploaded as DA sheet /redirects.json and previewed; /copy-of-folded-roof-2 → 301 /projects/potter-studio verified. Code NOT pushed: preview renders with the boilerplate code on GitHub main until the code is committed and pushed.
