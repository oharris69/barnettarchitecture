<!-- stardust:provenance writtenBy=stardust:extract mode=prep writtenAt=2026-11-17 source=https://www.barnettarchitecture.com read=stardust/current/pages/*.json synthesized=Users,Positioning,Product Principles (inferred from captured copy) authored=none -->
# Product

<!-- impeccable:product-schema 1 -->

## Platform

web — a 48-page Wix brochure/portfolio site (`static.wixstatic.com` media, `parastorage` runtime, Wix pro-gallery slideshows on every project page).

## Users

_provenance: inferred — basis: project copy addresses homeowners ("young couple", "empty-nesters", "retired couple") and neighborhood/non-profit boards (swim clubs, Wil-Mar Center, Quaker Meeting House)._

- Homeowners in Madison and greater Wisconsin (also Illinois, New York) planning a renovation, addition, kitchen or new home.
- Community / non-profit boards (swim clubs, neighborhood centers, congregations) commissioning studies and facilities.
- Peers, press and exhibition visitors interested in Todd Barnett's photography of the Midwest and central Mexico.

## Product Purpose

Show the work of Barnett Architecture LLC — a design-focused sole-proprietor practice founded in 2007 by architect Todd Barnett in Madison, WI — so prospective clients understand the approach and get in touch (`contact`: 118 North Breese Terrace Suite I, Madison, WI 53726-4133 · todd@barnettarchitecture.com · 608-233-4538).

## Positioning

"Projects are meant to 'fit' the client, not serve as a pedestal for the architect" (`about`). No house style; a collaborative Charrette process; green design and universal design; traditional to modern.

## Capabilities and Constraints

- 29 project case studies (22 residential, 7 commercial/civic), each a slideshow + short narrative (client type, city, goals).
- 8 photography collections (Iowa, Illinois, Wisconsin, Minnesota, Mexico places/faces, Iowa 2022 exhibit, Fields of Vision 2024 exhibit).
- Process (5 phases), About, Team (one principal), two testimonial archives (1990–2006, 2007–current), contact.
- Constraints observed: Wix slugs (`copy-of-*`, `/blank`) unrelated to content; no meta descriptions; every page's H1 is the firm name; home has no text.

## Brand Commitments

- Register: `brand` (portfolio / marketing).
- Observed personality: modest, craft-minded, client-first, Midwestern, quietly modern.
- Observed anti-references: architect-as-star self-promotion ("not a pedestal for the architect").

## Evidence on Hand

- `stardust/current/pages/*.json` + `*.html` (48 live captures, Playwright, waitMode medium).
- `stardust/current/assets/screenshots/*.png`.
- `stardust/current/_galleries.json` (full gallery data harvested from Wix page JSON — named deviation, see `stardust/direction.md`).
- `stardust/current/_crawl-log.json`.

## Product Principles

_provenance: inferred from `about` and `process` copy._

1. The client and the site lead; the architecture follows.
2. One clear idea per project.
3. Green by orientation, massing and size first, systems second.
4. Design for all ages and abilities (universal design).

## Accessibility & Inclusion

Universal design is an explicit practice commitment (`about`). The current site has empty alt text on gallery images and decorative H1s, which contradicts it.
