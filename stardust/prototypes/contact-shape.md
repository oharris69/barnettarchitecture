<!-- stardust:provenance
  writtenBy:        stardust:prototype/shape
  writtenAt:        2026-11-17T19:05:00Z
  page:             contact (form archetype)
  pageUrl:          https://www.barnettarchitecture.com/contact
  againstDirection: stardust/direction.md (Active 2026-11-17T17:20:00Z)
  consumedBy:       impeccable:craft
  mode:             prep wave 2 (canon diff mode), hands-off
  readArtifacts:    [stardust/current/pages/contact.json, about.json, stardust/taxonomy.json (facets.scope), stardust/current/_galleries.clean.json, stardust/audit/barnettarchitecture-com/audit.json (F-006, F-008, F-009), DESIGN.json metadata.organization, PRODUCT.md (no form backend)]
  stardustVersion:  0.32.1
-->
---
slug: contact
url: https://www.barnettarchitecture.com/contact → /contact
register: brand (task surface)
surprise: low
dominantDimension: typography/title-block NAP
fidelity: refined
---

# Page shape: contact

Captured /contact: wordmark H1, H2 "Please Contact Us", NAP (4 lines), one photograph (also in the Willy Street
gallery), a Wix form with unlabelled fields (audit F-009) and a low-contrast Send button (F-008).

## Sections (render order)
1. **site-header** (canon; not over media — sticky sage).
2. **contact** (new compound, split) — H1 "Contact" at exhibit scale; H2 "Please contact us"; email + phone as the
   canon `enquiry__lines`; street block; "Map of 118 North Breese Terrace" link (Google Maps search URL; link only,
   no embed). Right: `frame--tall` photo, caption dimension string "Willy Street · New home · Madison, WI" → project.
   `data-deviation`: form-first opening instead of a 100svh hero (task page).
3. **enquiry-form** (NEW module) — H2 "Tell us about your project" + about.json#body[5] s1; labelled fields: Name*,
   Email*, Phone (optional), Project location, Project type (taxonomy scope values + "Not sure yet"), Message*;
   PLACEHOLDER note; submit "Send by email". **No backend**: `data-placeholder="true"`, native `mailto:` post without
   JS; with JS inline validation + composed `mailto:?subject&body`, status announced.
4. **site-footer** (canon). No enquiry band: the page is the enquiry (deviation).

## Key states
Field default / hover / focus (2px Third Lake ring) / invalid (aria-invalid + message, `--color-error` #8a1f11 —
net-new token, proposed) / submitted (status line). Empty optional fields omitted from the composed email.

## JSON-LD
ContactPage (mainEntity → #organization) + ProfessionalService/LocalBusiness (DESIGN.json metadata) + BreadcrumbList.

## Unsourced content
`form#enquiry` — PLACEHOLDER · form backend (type other): dynamic feature not yet available.

```yaml
_provenance:
  capturedSourceLineage:
    - { section: contact, origin: "contact.json#headings + slots.nap; photo contact.json media (= willy-street gallery)" }
    - { section: enquiry-form, origin: "contact.json#slots.form (wix form name/email/subject/message) — rebuilt with labels per audit F-009; fields per wave-2 brief" }
  antiTemplatePass:
    - { pattern: contact-page, defaultReflex: "map embed + generic two-column form card", alternatives: ["map embed + form card", "hero photo then form", "title-block NAP first, photo as side frame, ruled form band"], picked: "title-block NAP first", rationale: "the facts are the CTA (canon enquiry-band language); no embed per brief" }
  surpriseMoves: []
  substrateTransitions: { default: sage-ground, exceptions: [{ section: site-footer, ground: graphite, purpose: "canon" }] }
  voiceClassification:
    - { section: contact, classification: captured-verbatim, copy: "Contact · Please contact us · NAP" }
    - { section: enquiry-form, classification: "direction-authorized chrome", copy: "heading, labels, button, note" }
  signatureElements: []
  typeScaleYields: []
```
