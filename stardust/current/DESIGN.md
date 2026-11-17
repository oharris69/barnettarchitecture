---
colors:
  text: "#1e2f3b"
  heading: "#000000"
  background: "#ffffff"
  accent: "#ea04b8"
  surface: "#999999"
typography:
  heading: { family: "Arial", weight: 400, sizes: { h1: 28px, h2: 24px, h6: 18px } }
  body: { family: "Arial", weight: 400, size: 13px }
rounded: { none: 0 }
spacing: { canvas: 980px, gutter: "fixed Wix absolute positioning" }
components:
  header: "text wordmark + dropdown nav"
  slideshow: "Wix pro-gallery, boxed, ~650px wide"
  footer: "copyright + social icons"
---
<!-- stardust:provenance writtenBy=stardust:extract mode=prep writtenAt=2026-11-17 read=stardust/current/_computed-styles.json,_brand-extraction.json synthesized=none (descriptive) -->

# Design — current state (descriptive)

## Overview

A 2015-era Wix template: a fixed 980px canvas centered on white, absolute-positioned
elements, one typeface (Arial 400) at an ad-hoc scale (28 / 24 / 18 / 13). The only
color besides navy-black text is a hot magenta used for the active navigation label.
Imagery carries the whole site; there are no radii, shadows, gradients or motion.

## Colors

- Text `#1e2f3b` (792 uses) and heading `#000000` (407) on `#ffffff` background.
- Accent `#ea04b8`: active nav label only (48 occurrences, one per page).
- No reserved semantic colors.

## Typography

- Arial for everything, weight 400 only. The H1 on all 48 pages is the wordmark
  "Barnett Architecture LLC" at 28px; page titles are not marked up as headings.
- Body copy at 13px — below current legibility norms (16px+).

## Layout

- Header: wordmark left, nav right, both inside 980px.
- Project pages: slideshow (left, ~650×460) + narrative column (right, ~280px).
- Listing pages (Residential, Commercial): single slideshow, no index of projects —
  projects are reachable only through the dropdown nav.
- Photography collections: large Wix grid/slideshow galleries.

## Components

Header dropdown nav (7 top-level, 39 children), slideshow gallery, footer with
unlinked social icons, contact form (Wix forms).

## Do's and Don'ts (observed)

- Do: let photographs dominate.
- Don't (observed problems): 13px body; every page sharing one H1; navigation-only
  discoverability; magenta accent unrelated to the work.
