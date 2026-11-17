---
name: Barnett Architecture
description: Bold, photograph-first portfolio for a Madison, WI architecture practice — drawn like a set of construction documents, hung like an exhibit.
colors:
  sage-ground: "#e7ebe6"
  graphite: "#1b1e1c"
  pencil: "#5b625d"
  hairline: "#b9c0ba"
  third-lake: "#0d4b59"
  third-lake-light: "#8cc0cb"
  darkroom: "#121413"
  print-white: "#ffffff"
  error: "#8a1f11"
typography:
  display:
    fontFamily: "Spectral, 'Spectral Fallback', Georgia, serif"
    fontSize: "clamp(3.25rem, 9.5vw, 10rem)"
    fontWeight: 300
    lineHeight: 0.92
    letterSpacing: "-0.03em"
  headline:
    fontFamily: "Spectral, 'Spectral Fallback', Georgia, serif"
    fontSize: "clamp(2rem, 4.2vw, 3.75rem)"
    fontWeight: 300
    lineHeight: 1.02
    letterSpacing: "-0.02em"
  lead:
    fontFamily: "Spectral, 'Spectral Fallback', Georgia, serif"
    fontSize: "clamp(1.375rem, 2.1vw, 1.875rem)"
    fontWeight: 400
    lineHeight: 1.3
    letterSpacing: "-0.005em"
  body:
    fontFamily: "'Hanken Grotesk', 'Hanken Grotesk Fallback', system-ui, sans-serif"
    fontSize: "1.0625rem"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "0"
  label:
    fontFamily: "'Hanken Grotesk', 'Hanken Grotesk Fallback', system-ui, sans-serif"
    fontSize: "0.8125rem"
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: "0.08em"
rounded:
  none: "0px"
spacing:
  xs: "8px"
  sm: "16px"
  md: "32px"
  lg: "64px"
  xl: "120px"
  gutter: "clamp(20px, 4vw, 56px)"
components:
  button-primary:
    backgroundColor: "{colors.third-lake}"
    textColor: "{colors.print-white}"
    rounded: "{rounded.none}"
    padding: "18px 28px"
  button-primary-hover:
    backgroundColor: "{colors.graphite}"
    textColor: "{colors.print-white}"
  facet-chip:
    backgroundColor: "transparent"
    textColor: "{colors.graphite}"
    rounded: "{rounded.none}"
    padding: "8px 14px"
  facet-chip-active:
    backgroundColor: "{colors.graphite}"
    textColor: "{colors.sage-ground}"
  gallery-surface:
    backgroundColor: "{colors.darkroom}"
    textColor: "{colors.sage-ground}"
---
<!-- stardust:provenance writtenBy=stardust:direct mode=prep writtenAt=2026-11-17T17:20:00Z read=stardust/current/_brand-extraction.json,stardust/current/DESIGN.md,stardust/audit/barnettarchitecture-com/audit.json,stardust/taxonomy.json synthesized=palette,typography,components (rebrand mode; see stardust/direction.md § Divergence inputs) -->
<!-- stardust:amended by=coordinator (canon merge, hands-off) at=2026-11-17T20:00:00Z sections=Colors(error),Typography(labels uppercase, self-hosted fonts),Layout(drawing schedule, type chips, photo wall, runtime rebalance),Components(header, chips, gallery, lightbox, project/practice/form) source=stardust/canon/canon.css + approved prototypes -->

# Design — target

## Overview

A **bold, photograph-first** redesign. The work is hung like an exhibit — full-bleed
photographs, very large light serif titles, and dark "darkroom" walls for the
photography collections — and annotated like a set of construction documents:
hairline rules, dimension strings and small-caps labels that carry real project facts
(sector, type, location). The voice stays modest and plain-spoken; the boldness comes
from scale, cropping and contrast, never from decoration.

Two signature devices, both specific to an architecture practice:

1. **Dimension-string rule** — a hairline with end ticks (`|—— Madison, WI · Addition ——|`)
   used for facts only: the project facts bar (as a chain dimension, one tick per fact), captions,
   counts and addresses. It always carries real data and is never an empty section divider
   (sections are divided by plain 1px graphite or hairline rules).
2. **The big idea** — each project's first narrative sentence set at lead size as its
   thesis, after the practice's own process copy ("This is where the 'big idea' is conceived").

## Colors

- `sage-ground` #e7ebe6 — page ground. A cool prairie-sage tint (hue 108°, S 11%), not cream.
- `graphite` #1b1e1c — text and rules (13.95:1 on sage).
- `pencil` #5b625d — secondary text, captions (5.20:1 on sage, 6.27:1 on white).
- `hairline` #b9c0ba — rules and dividers only; never text.
- `third-lake` #0d4b59 — the single accent (after Madison's Third Lake District, where
  Willy Street sits): links, primary CTA, active facet focus ring (8.04:1 on sage; white on it 9.69:1).
- `third-lake-light` #8cc0cb — accent on `darkroom` (9.26:1).
- `darkroom` #121413 — photography collection and lightbox ground (sage text 15.35:1).
- `print-white` #ffffff — button text, form-field grounds, the mats behind the hand-written notes on About;
  photographs are hung without mats.
- `error` #8a1f11 — form validation only (invalid field border, field error text; 7.6:1 on sage, 9.2:1 on white).
  Reserved: never decorative.

Accent dose: `third-lake` ≤ 5% of any screen; it is a pointer, not a field.

## Typography

- **Spectral 300/400** (display, headline, lead) — a reading serif used very large and
  light: project titles at up to 10rem with tight tracking, like titling on an exhibit wall.
- **Hanken Grotesk** (variable 300–700; 400/450/560/600 engaged) (body, UI, labels) — body at 17px/1.6
  (up from 13px); labels render **uppercase** (`text-transform: uppercase`, 13px, weight 600, +0.08em) — not
  `font-variant: small-caps` — for the didactic facts.
- Both families are self-hosted (latin woff2, SIL OFL 1.1) with metric-matched local fallbacks
  ('Spectral Fallback' from Georgia, 'Hanken Grotesk Fallback' from Arial) so the swap does not shift layout.
- Scale: 10rem / 3.75rem / 1.875rem / 1.0625rem / 0.8125rem — ratio ≈ 1.6 by role,
  fluid with clamp().
- One H1 per page: the page subject. The wordmark is a link, never a heading.

## Layout

- Fluid, full-bleed sections; text measure capped at 68ch; content shell max 1440px with
  `gutter` side padding; photographs may break the shell to the viewport edge.
- 12-column grid at ≥ 900px; single column below 600px; two breakpoints: 600px, 900px.
- Section rhythm: `xl` (120px) between major sections on desktop, `lg` (64px) on mobile.
- Project page: full-bleed hero photo (≥ 80vh) → giant title + dimension-string facts →
  big-idea lead + narrative in two columns → gallery sequence (alternating full-bleed /
  pairs) → next/previous project + enquiry band.
- **Drawing schedule** (every project index — home featured, listings, related projects): ruled rows
  separated by hairlines (graphite rule above the first and below the last), Spectral-light title
  bottom-aligned on the left with a stacked dimension string of sector · type · location beneath, a 3:2
  photograph on the right (above the text below 600px); the whole row is one link.
- Listings: the schedule read as a **list** or as a **grid** of 3:2 photographs (view toggle), with a ruled
  filter sheet of **type chips** (sector / project type / location / approach, with live counts) in a sticky side
  rail ≥ 900px and a disclosure below 600px; filters are query parameters (`?type=`, `?location=`, `?sector=`,
  `?approach=`, `?view=grid`) applied client-side over the static list — without JS every project is listed.
  The home carries a single entry row of type chips linking into the filtered index.
- **Photo wall** (photography collections): **justified rows** — every photograph at its own ratio, uncropped;
  row height scales with the viewport (`--row-h`), frames grow in proportion to their ratio so a row shares one
  height, and `photo--feature` frames hang 1.45× (salon hang, bottom-aligned). Walls of ≤ 4 photographs and the
  hub's Selected works use the lead scale (2-up ≥ 1130px, one per row below).
- **Gallery rebalancing at runtime**: feature placement is composed at build time so walls end on ≥ 2 frames at
  the reference widths; a small script then re-measures the rows whenever the wall's width changes and, if the
  wall still ends on a lone frame, inserts a zero-height line break earlier so the last row holds two — or, when
  no placement works (an odd run of equal 2-up frames), lets the lone frame close the wall at full row width.
  A lone feature on phones is allowed by design.

## Elevation & Depth

Flat. No shadows. Depth comes from photographs and from the sage → darkroom ground change.
Lightbox: darkroom at 96% opacity.

## Shapes

Square corners everywhere (0px), echoing drawn plans. Hairline 1px rules; dimension-string
ticks 9px tall.

## Components

- **Header**: wordmark "Barnett Architecture" left (Spectral 400, 22px), nav right:
  Projects · Photography · Practice (disclosure: About, Process, Todd Barnett, Testimonials) · Contact.
  Sticky on every page; over full-bleed heroes it is transparent on its own darkroom scrim and, ≥ 900px,
  fixed until it settles to sage at the hero's end. The current page's link carries `aria-current="page"`
  and its section `aria-current="true"` (Projects on project/sector pages, Photography on collections).
  ≤ 640px the nav collapses behind a real `<button>` (Menu); without JS the links stay visible and wrap
  under the wordmark.
- **Facts bar** (dimension-string): sector · type · location; labels in small caps.
- **Schedule row** (replaces cards): see Layout § Drawing schedule; no card grid anywhere.
- **Facet / type chips**: square, hairline border, 40px (44px on touch); active (`aria-current="true"`) =
  graphite fill; unavailable combinations are dashed and inert; counts in tabular figures.
- **Gallery** (photography collections): darkroom ground, breadcrumb, giant Spectral title with the photo
  count in a dimension string, the justified photo wall, a strip of sibling collections. Captions only where a
  real title exists (captured Wix titles are placeholders, so most frames are uncaptioned; alt is
  "<Collection> — photograph n of N" until the owner supplies descriptions).
- **Lightbox**: a native `<dialog>` on the darkroom at 96%; Close / Previous / Next are buttons with a 3.5:1
  border; the count reads "3 / 9" visually and announces "Photo 3 of 9"; ←/→/Home/End/Esc and swipe; deep
  links `#photo-n`; only the next photograph is preloaded, at the width it will be drawn.
- **Project page extras**: chain-dimension facts bar (links into the filtered index), big-idea lead, plates
  (full-bleed / salon pairs, numbered "01 / 09"), previous / next pager, three related schedule rows.
- **Practice pages**: prose side-rail band, text schedule (ruled rows without photographs), chain dimension
  for the process stages, process steps (named, not numbered), FAQ, testimonial ledger (name and place in a
  sticky rail beside the full quote).
- **Enquiry form** (contact): labelled fields on print white, inline errors in `error`; until a form backend
  is chosen it composes an email (mailto) — the interim tier recorded in stardust/dynamic-features.md.
- **Enquiry band**: third-lake text link + phone/email, ends every project and listing.
- **Footer**: NAP (118 North Breese Terrace, Suite I, Madison, WI 53726 · 608-233-4538 ·
  todd@barnettarchitecture.com), sitemap columns, © year.

## Do's and Don'ts

- Do let one photograph own each viewport; crop decisively.
- Do put the page subject in the H1 and real facts in the dimension string.
- Do caption photographs with facts you have; leave untitled photos uncaptioned rather than invent.
- Don't use cream grounds, rounded cards, drop shadows, or stat bars.
- Don't overlay text on photographs without a scrim that brings it to ≥ 4.5:1.
- Don't use the accent as a background field.
