# Nationwide Homepage Migration Report

**Source:** https://www.nationwide.com/
**Scope:** Homepage only
**Date:** 2026-04-14

---

## Task 1: Page Structure Analysis

Scraped the Nationwide homepage and identified **10 content sections** from the source HTML and visual screenshot.

### Sections Identified

| # | Section | Layout | Background |
|---|---------|--------|------------|
| 1 | Hero Banner | Two-column: text/CTAs left, image right | Vibrant blue (#0047bb) |
| 2 | Tri-Promo Quick Actions | Three equal columns with icons | White |
| 3 | 90 Years Promo | Heading + three icon columns | Light gray (#f4f4f5) |
| 4 | Member CTA Banner | Horizontal: icon + text + button | Dark navy (#141b4d) |
| 5 | Image Tiles (2-tile) | 8:4 grid — large + medium tile | White |
| 6 | Image Tiles (3-tile) | 8:4 grid — large + two stacked small | White |
| 7 | About / Mission Text | Centered single-column text | White |
| 8 | Business CTA Banner | Horizontal: icon + text + link | Dark navy (#141b4d) |
| 9 | Mobile App Promo | Two-column: features + QR code | Vibrant blue (#0047bb) |
| 10 | Disclaimer | Full-width small text | White |

### Artifacts Produced

- `migration-work/metadata.json` — Page metadata, paths, image mapping
- `migration-work/screenshot.png` — Full-page visual reference
- `migration-work/cleaned.html` — Sanitized source HTML (scripts/styles removed)
- `migration-work/images/` — 17 downloaded images
- `migration-work/page-structure.json` — Section boundaries and content sequences

---

## Task 2: Authoring Analysis

Determined how each section should be authored in EDS — as default content (plain text/headings/links) or as a block.

### Authoring Decisions

| # | Section | Decision | Block Variant |
|---|---------|----------|---------------|
| 1 | Hero Banner | Block | `hero-homepage` |
| 2 | Quick Actions | Block | `cards-action` |
| 3 | 90 Years Promo (heading) | Default content | — |
| 3 | 90 Years Promo (columns) | Block | `columns-promo` |
| 4 | Member CTA Banner | Default content | — |
| 5 | Image Tiles (2-tile) | Block | `cards-tiles` |
| 6 | Image Tiles (3-tile) | Block | `cards-tiles` (reused) |
| 7 | About / Mission Text | Default content | — |
| 8 | Business CTA Banner | Default content | — |
| 9 | Mobile App Promo | Block | `columns-highlight` |
| 10 | Disclaimer | Default content | — |

**Summary:** 5 blocks, 5 default content sections, 5 unique variants created.

### Block Variants Created

| Variant | Base Block | Purpose |
|---------|-----------|---------|
| `hero-homepage` | hero | Blue background hero with image and CTA links |
| `cards-action` | cards | Icon-led action cards with heading, description, CTA |
| `cards-tiles` | cards | Image tiles with overlay heading links |
| `columns-promo` | columns | Icon + heading + description + CTA promotional columns |
| `columns-highlight` | columns | Two-column layout on colored background |

Each variant includes `.js`, `.css`, and `metadata.json` in `blocks/{variant}/`.

### Key Simplifications

- **Interactive quote form** (dropdown + ZIP code) → Static hero with CTA links
- **Dropdown-based action cards** → Icon cards linking to external tools
- **Dynamic agent search** → Direct link to agent finder

### Artifacts Produced

- `migration-work/authoring-analysis.json` — All authoring decisions with variant block names

---

## Task 3: Design System Extraction

Extracted the global design system from nationwide.com and applied it to `styles/styles.css`.

### Color Palette

| Token | Value | Usage |
|-------|-------|-------|
| `--color-blue-vibrant` | `#0047bb` | Primary brand blue, links, CTAs |
| `--color-blue-dark` | `#141b4d` | Dark navy sections, button text |
| `--color-blue-light` | `#8cc8e9` | Primary button backgrounds |
| `--color-gray-pale` | `#f4f4f5` | Light section backgrounds |
| `--text-color` | `#222` | Body text |
| `--link-color` | `#0047bb` | Link color |

### Typography

| Element | Original Font | EDS Equivalent | Weights |
|---------|--------------|----------------|---------|
| Body | Gotham (nw-primary) | Inter | 400, 500, 700 |
| Headings | Tiempos Headline (nw-secondary) | Source Serif 4 | 600 |

### Heading Sizes

| Level | Mobile | Desktop |
|-------|--------|---------|
| H1 | 32px | 36px |
| H2 | 28px | 32px |
| H3 | 24px | 28px |
| H4 | 20px | 24px |

### Button Variants

| Variant | Background | Text | Border |
|---------|-----------|------|--------|
| Primary | `#8cc8e9` (light blue) | `#141b4d` (dark navy) | Transparent |
| Secondary (hollow) | Transparent | `#0047bb` | 1px solid `#0047bb` |
| Light (on dark bg) | Transparent | White | 1px solid white |

All buttons: 4px border-radius, `0.25s ease-out` transition.

### Section Variants

| CSS Class | Background | Text Color |
|-----------|-----------|------------|
| `.section.blue` | `#0047bb` | White |
| `.section.dark` | `#141b4d` | White |
| `.section.light` | `#f4f4f5` | Default |

### Files Modified

- `styles/styles.css` — Complete design token system, section variants, button styles
- `styles/fonts.css` — Google Font imports (Inter + Source Serif 4)

### Artifacts Produced

- `migration-work/design-system-extracted.json` — Extraction status and token reference

---

## Task 4: Content Import

Generated full import infrastructure and imported homepage content.

### Import Infrastructure

| Type | Files |
|------|-------|
| Page template | `tools/importer/page-templates.json` (1 template, 5 blocks, 10 sections) |
| Parsers | `hero-homepage.js`, `cards-action.js`, `cards-tiles.js`, `columns-promo.js`, `columns-highlight.js` |
| Transformers | `nationwide-cleanup.js` (site shell removal), `nationwide-sections.js` (section breaks + metadata) |
| Import script | `tools/importer/import-homepage.js` (+ bundled) |

### Import Result

- **Input:** https://www.nationwide.com/
- **Output:** `content/index.plain.html` (7 sections with section-metadata)
- **Report:** `tools/importer/reports/import-homepage.report.xlsx`
- **Status:** 1/1 pages imported successfully

### Content Sections in Imported HTML

1. Hero + Cards (hero-homepage, 3x cards-action)
2. 90 Years Promo — H2 + columns-promo (style: light)
3. Member CTA + Image Tiles — default content + cards-tiles (style: dark)
4. About Text — H2 + paragraphs (style: center)
5. Business CTA — default content (style: dark)
6. Mobile App — columns-highlight with QR code (style: blue)
7. Disclaimer + Page Metadata

---

## Task 5: Header / Navigation Migration

Migrated the Nationwide desktop header as a custom 3-bar layout.

### Source Structure (nationwide.com)

The Nationwide header consists of three horizontal bars:

| Bar | Background | Left Content | Right Content |
|-----|-----------|-------------|---------------|
| 1. Utility | Light gray | Resources for agents, E&S/Specialty partners, Financial professionals | Career seekers |
| 2. Brand | White | Nationwide logo | Search, Log in |
| 3. Menu | Light gray | Vehicle, Property, Personal, Business, Investments, Resources | Claims, Pay a bill |

### Nav Document Structure (content/nav.plain.html)

The nav content has **3 authored sections**, each mapping to a bar in the header:

| Section | CSS Class | Content |
|---------|-----------|---------|
| 1 | `nav-utility` | Left: `<ul>` with 3 utility links + Right: `<p>` with Career seekers link |
| 2 | `nav-brand` | Logo image `<p>` + Search link `<p>` + Login `<strong><a>` |
| 3 | `nav-sections` | `<ul>` with 6 menu items (nested dropdowns) + 2 `<strong><a>` CTA buttons |

### Authoring Pattern

- **Utility links:** `<ul>` for left links with `|` CSS dividers, separate `<p>` for right-aligned link
- **Brand bar:** Logo as `<p><a><img></a></p>`, search as plain `<p><a>Search</a></p>`, login as `<p><strong><a></a></strong></p>`
- **Menu items with dropdowns:** Nested `<ul>` under each `<li>` — standard EDS nav pattern
- **CTA buttons:** Wrapped in `<strong>` tags — EDS auto-converts to `button-wrapper` class, JS re-styles as nav CTA pills

### EDS Auto-Decoration Handling

Key challenge: EDS framework auto-converts `<strong><a>` into `<p class="button-wrapper"><a class="button primary">` before block JS runs. The header.js detects these converted elements:
- Brand bar: `p.button-wrapper` → re-classed as `.nav-login` with `.nav-login-btn`
- Menu bar: `p.button-wrapper` → extracted into `.nav-cta-group` with `.nav-cta-btn`

### Files Modified

| File | Changes |
|------|---------|
| `content/nav.plain.html` | Created — 3 sections: utility (left/right split), brand (logo + search + login), sections (menu + CTAs) |
| `blocks/header/header.js` | Rewritten — decorateUtility(), decorateBrand(), decorateSections() helpers; handles EDS button-wrapper auto-decoration |
| `blocks/header/header.css` | Rewritten — 3-bar layout: white utility bar with `\|` dividers, white brand bar with search underline + blue login pill, gray menu bar with dark navy/teal CTA pill buttons |
| `styles/styles.css` | Updated `--nav-height` to 197px for 3-bar header (45 + 80 + 72) |
| `icons/nationwide-logo.png` | Added — Nationwide horizontal logo (64px height) |

### Visual Comparison

Header was iteratively refined through 5 versions to match the source:
- v1: Basic 3 sections, CTA buttons missing
- v2: CTA buttons clipped at bottom
- v3: CTA buttons visible but on wrong row (flex wrapping issue)
- v4: CTA buttons inline but Login styled incorrectly (EDS auto-decoration issue)
- v5: All elements matching — utility links with dividers, logo + search + login, menu + CTAs

### Menu Items with Dropdown Content

| Menu Item | Dropdown Links |
|-----------|---------------|
| Vehicle | Auto, Motorcycle, Snowmobile, Classic car, ATV, RV, Boat, Personal watercraft, Scooter, Golf cart, Business auto, Auto & home |
| Property | Homeowners, Renters, Condo, Flood, Business property, Home & auto |
| Personal | Life insurance, Term life, Whole life, Pet insurance, Umbrella, Identity theft |
| Business | Businessowners policy (BOP), Business auto, Business property, General liability, Workers' compensation, Agribusiness |
| Investments | Personal retirement plans, Annuities, Mutual funds, Life insurance |
| Resources | Auto, Home, Small business, Powersports, Personal finance, Investments |

### CTA Buttons

| Button | Link | Style |
|--------|------|-------|
| Claims | /insurance-claims/ | Dark navy (#1a3564) background, white text, 4px radius |
| Pay a bill | /bill-pay | Teal (#007a7c) background, white text, 4px radius |
| Log in | /my-account-login | Vibrant blue (#0047bb) background, white text, 4px radius |

---

## Task 6: Block-Level CSS Refinement

Refined all 5 homepage block variants with desktop CSS matching the Nationwide source design.

### Block Styling Summary

| Block | Key Styling | Source Pattern |
|-------|------------|---------------|
| `hero-homepage` | Full-width blue bg, white text, left-aligned content, max-width 560px | Blue banner with heading, subtitle, CTA links |
| `cards-action` | Centered cards with h3 heading, description, outlined CTA button | Tri-promo icon cards below hero |
| `cards-tiles` | Grid tiles with blue bg, white overlay text, hover darkens | Image tiles (2-tile and 3-tile layouts) with 2fr/1fr grid |
| `columns-promo` | 3 equal columns, centered text, blue headings, outlined CTAs | 90 Years promo section on light gray bg |
| `columns-highlight` | 2 columns, white text (inherits blue section bg), QR code right | Mobile app promo with checklist + QR code |

### Files Modified

| File | Changes |
|------|---------|
| `blocks/hero-homepage/hero-homepage.css` | Full rewrite — blue bg, white text, left-aligned content |
| `blocks/cards-action/cards-action.css` | Full rewrite — centered card with outlined CTA buttons |
| `blocks/cards-tiles/cards-tiles.css` | Full rewrite — grid tiles with blue bg, hover, 2fr/1fr desktop layout |
| `blocks/columns-promo/columns-promo.css` | Full rewrite — 3 centered columns, blue headings, outlined CTAs |
| `blocks/columns-highlight/columns-highlight.css` | Full rewrite — 2-column layout, white text, QR code styling |

---

## Header Polish — Iterative Refinements

The header required multiple rounds of pixel-level adjustments to match the source exactly.

### Key Refinements Made

| Area | Issue | Fix |
|------|-------|-----|
| Nav path | Header empty on published EDS page | Changed default from `/content/nav` to `/nav` |
| Font | Body font (Inter) visibly different from Gotham | Switched to Poppins (closest Google Font to Gotham) |
| Utility bar bg | Was white, should be gray | Changed to `#f4f4f5` (matches source `rgb(244,244,245)`) |
| Utility hover | Underline stayed on hover | Added `text-decoration-color: transparent` on hover |
| Logo size | Too large (64px) | Corrected to 205x60px (exact source dimensions) |
| Logo hover | No grow effect | Added `transform: scale(1.05)` with `0.35s` transition |
| Search input | Was a link, clicked away | Replaced with actual `<form>` with `<input>` + `<button>` |
| Search bg | Transparent | Changed to `#f6f6f6` (exact source value) |
| Search border | Full box border | Changed to `border-bottom: 2px solid #707070` only |
| Search icon | Wrong direction, wrong icon | Replaced with actual Nationwide `BoltSearchIcon.svg` |
| Search hover | Border color changed | Changed to outer box-shadow `0 0 6px rgb(0 0 0 / 10%)` |
| Login button | Blue (#0047bb) | Changed to green `#008574`, hover `#056f61` |
| Login size | Too small | Matched source: `min-width: 86px`, `height: 42px` |
| Menu hover | Just bg change | Added 3-sided border (top+left+right) `#707070`, `border-radius: 4px 4px 0 0` |
| CTA buttons | Different colors (navy/teal) | Both now `#0047bb` (Nationwide blue), hover `#053d9a` |
| Sticky header | Fixed position | Changed to `position: relative` (source not sticky) |
| Content width | 1200px, too wide | Changed to `1140px` with `box-sizing: border-box` |
| `:search:` syntax | Not working on published site | Added detection for all 3 EDS transformation states |

### Author-Friendly `:search:` Syntax

The search form uses `:search:` marker in the nav document. The JS detects it in all environments:

| Environment | `:search:` becomes | Detection |
|---|---|---|
| Raw (pre-decoration) | `:search:` text | `text === ':search:'` |
| Published EDS | `<span class="icon icon-search">` | `querySelector('.icon-search')` |
| Local EDS | `<a href="/search">Search</a>` | `link.text === 'search'` |

---

## Current State

**Scope:** Desktop only (mobile excluded for now)

### Completed

- [x] Page structure analysis (10 sections identified)
- [x] Authoring analysis (block vs default content decisions)
- [x] Block variant creation (5 variants with JS, CSS, metadata)
- [x] Design system extraction (colors, typography, buttons, sections)
- [x] Import infrastructure (5 parsers, 2 transformers, 1 import script)
- [x] Content import (homepage → content/index.plain.html)
- [x] Header/navigation migration (3-bar desktop layout, pixel-perfect)
- [x] Block-level CSS refinement (all 5 blocks styled for desktop)

### In Progress

- [ ] Footer migration (6 sections) — initial implementation done, needs polish pass

### Next Steps

- [ ] Footer polish (pixel-perfect comparison against source)
- [ ] Visual QA and comparison against source
- [ ] Mobile responsive adaptation (deferred)

---

## Task 7: Footer Migration

Migrated the Nationwide desktop footer as a 6-section dark layout.

### Source Structure (nationwide.com)

| Section | Content |
|---------|---------|
| 1. Brand | Nationwide logo (white, inverted) + "1-877 On Your Side (1-888-891-0135)" right-aligned |
| 2. Social | Facebook, X, Instagram, LinkedIn, YouTube icons — right-aligned |
| 3. About | About us, For agents, Careers, Help center, Blog, En Español — pipe-separated links |
| 4. Partners | "Sites for business partners:" label + 5 partner links pipe-separated |
| 5. Legal | Products underwritten disclaimer text (small, gray) |
| 6. Privacy | Privacy links pipe-separated + BrokerCheck and TRUSTe badge images |

### Footer Document Structure (content/footer.plain.html)

6 authored sections, each mapped to a CSS class by the footer JS:

| Section | CSS Class | Content |
|---------|-----------|---------|
| 1 | `footer-brand` | Logo `<img>` + phone `<p>` with `<strong>` and `<a href="tel:">` |
| 2 | `footer-social` | `<p>` with 5 `<a><img>` social icon links |
| 3 | `footer-about` | `<p>` with pipe-separated links |
| 4 | `footer-partners` | Label `<p>` + links `<p>` with pipe separators |
| 5 | `footer-legal` | Single `<p>` with disclaimer text and FINRA links |
| 6 | `footer-privacy` | Links `<p>` + images `<p>` with BrokerCheck and TRUSTe badges |

### Design Details

| Property | Value |
|----------|-------|
| Background | `#222222` (dark gray) |
| Text color | `#c9cac8` (light gray) |
| Link color | `#ffffff` (white, underlined) |
| Font size | 14px (12px for legal text) |
| Container max-width | 1200px |
| Social icons | 36x36px SVGs, gray with white on hover |
| Logo | Horizontal logo with `filter: brightness(0) invert(1)` for white |

### Files Created/Modified

| File | Changes |
|------|---------|
| `content/footer.plain.html` | Created — 6 sections with all footer content |
| `blocks/footer/footer.js` | Rewritten — assigns 6 section classes, cleans EDS button decoration |
| `blocks/footer/footer.css` | Rewritten — dark background, 6 section layouts, social icon styling |
| `icons/facebook.svg` | Created — Facebook social icon |
| `icons/x.svg` | Created — X/Twitter social icon |
| `icons/instagram.svg` | Created — Instagram social icon |
| `icons/linkedin.svg` | Created — LinkedIn social icon |
| `icons/youtube.svg` | Created — YouTube social icon |
