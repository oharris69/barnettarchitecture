<!-- stardust:provenance writtenBy=stardust:direct mode=prep writtenAt=2026-11-17T17:20:00Z read=stardust/current/PRODUCT.md,stardust/current/pages/*.json,stardust/audit/barnettarchitecture-com/audit.json synthesized=Users,Product Principles authored=user phrase + 'Bold new look' + 'Hands-off' answers -->
# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

<!-- _provenance: inferred — basis: project narratives address homeowners and community boards; photography pages address exhibit visitors -->

- **Homeowners in Madison and greater Wisconsin** (also Illinois) weighing a renovation, addition, kitchen or new home, who want to see comparable work near them: same neighborhood, same era of house, same problem.
- **Community and non-profit boards** (swim clubs, neighborhood centers, congregations) commissioning a study or facility.
- **Photography audiences**: exhibit visitors and peers looking at Todd Barnett's Midwest and central-Mexico work.
- **AI answer engines and search** that need crawlable facts (who, where, since when, what kind of work) to recommend the practice.

## Product Purpose

Win well-fitted commissions for a Madison architecture practice by showing 29 projects and ~300 photographs as convincingly as the work deserves. Scope: portfolio, practice, photography, contact; no e-commerce, no blog.

## Positioning

"Projects are meant to 'fit' the client, not serve as a pedestal for the architect" — a sole-proprietor practice (est. 2007) with no house style, a Charrette process, green and universal design as defaults, and a principal who is also an exhibiting photographer.

## Capabilities and Constraints

- AEM Edge Delivery Services (Document Authoring); static, no form backend yet: contact ships as email + phone links with a form placeholder until a backend is chosen.
- Content facts only from the captured site. No project years, budgets, awards or client names are captured — none may be invented.
- Every old Wix URL must 301 to its new clean URL (`stardust/taxonomy.json`).
- WCAG 2.2 AA; Core Web Vitals "good" on mobile.

## Brand Commitments

- Register: `brand`.
- Personality: **bold in presentation, modest in voice** — confident scale and cropping; plain, precise, first-person-plural copy.
- Anti-references: architect-as-star self-promotion; the Generic-2026-SaaS silhouette (giant sans hero + two-button CTA pair + stat bar); cream "archival editorial" grounds; collage-maximalism; stat-callout bars.

## Evidence on Hand

- Copy: `stardust/current/pages/*.json` (about, process, team, 29 project narratives, contact NAP, testimonials 2007–present and 1990–2006).
- Photographs: `stardust/current/_galleries.clean.json` (155 project photos, 298 collection photos; most untitled).
- Audit: `stardust/audit/barnettarchitecture-com/audit.json` (score 37/100; 32 findings).
- Absences that must not be fabricated: project years, awards, client names, team beyond Todd Barnett, photo captions for untitled images, social accounts.

## Product Principles

1. **Lead with the work.** Every page opens on a photograph or a project; text earns its place by adding facts.
2. **Say who, where and what in words.** Page subject in the H1, facts in a dimension string and in JSON-LD, so people and machines can quote it.
3. **Let people find their project.** Filter by sector, type and location; every project links to its neighbors.
4. **Keep the voice the client's.** Modest, specific sentences from the practice's own copy; no superlatives.
5. **Fast and accessible by default.** Universal design applies to the website too.

## Accessibility & Inclusion

WCAG 2.2 AA minimum: 17px body, ≥ 4.5:1 text contrast (palette verified), descriptive alt text on every content image (from captured titles/descriptions or project + sequence context, never invented detail), keyboard lightbox, reduced-motion respected, labelled form fields.
