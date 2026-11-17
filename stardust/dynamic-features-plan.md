<!-- stardust:provenance
  writtenBy:  stardust:dynamics (Phase 3 plan; hands-off)
  writtenAt:  2026-11-17T20:10:00Z
  read:       stardust/dynamic-features.md, stardust/dynamics/dynamic-features.generated-plan.json
-->
# Dynamic features — plan

Static first, then wire. Every row already degrades to a working static page in `stardust/migrated/`;
the phases below only replace an interim tier with the owner's choice.

| phase | rows | deliverable | authoring contract | verification | owner decision | effort |
|---|---|---|---|---|---|---|
| 0 — static (done in migrate) | F2 F3 F4 F7 F8 F9 F10 F11 F12 | galleries + lightbox, nav, filters, mailto/tel — all in the static bundle | gallery = ordered images with `data-w`/`data-h`; listing rows carry `data-sector/type/location/approach`; no index | `stardust/migrated/_validation.json` (1440 + 390, file://); lightbox + filter flows in the archetype gates | — | done |
| 1 — form (interim shipped) | F1 | native form → `mailto:` compose; on D1: POST to the chosen endpoint, same fields, success / error states in `role=status` | form block keeps label/field markup; endpoint read from block config, never hard-coded | submit empty → 3 inline errors + focus; valid → endpoint 2xx (or mailto compose in interim) at 1440 + 360 | **D1 form backend** | S (after D1) |
| 2 — images (rollout) | F5 | photographs imported into the EDS media bus by `rollout`; `<picture>` from EDS renditions | images stay authored in document order with alt | rollout media-reconcile: 0 off-origin images, 0 broken | **D3** (confirm; default rehost) | M (bulk, scripted) |
| 3 — analytics (on request) | F6 (F9) | `$stardust dynamics --martech` scaffold, all routes disabled until ids + consent are supplied | tags only via the martech contract, consent-gated | parity row: tag fires only after consent | **D2 analytics** | S (after D2) |

Parity (`stardust/dynamics/parity.json`) is written at rollout B2/D2 against the published origin; the
static bundle has no origin to replay against yet.
