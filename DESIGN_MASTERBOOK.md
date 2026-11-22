# ZKS DESIGN BIBLE
# VERSION 1.0

This document defines the permanent design language for the Zahdan Kamal Sentosa (ZKS) web application.
Every future component, page, section, and art direction pass must strictly obey these rules.

---

## RULE 01: ONE FOCAL POINT
Every section may only have **ONE** primary visual focus. Never compete.

- **Hero** → Headline & Primary Central Kitchen Evidence
- **Gallery / Verification** → Photography & Document Explorer
- **Workflow** → Blueprint Sequence
- **Capacity** → Data Statistics & Latency Matrix
- **Food Safety** → Laboratory Process & Clinical Protocols
- **Menu** → Nutrition Matrix & Portion Specs
- **CTA** → Executive Direct Action Ledger

*Never allow two focal points in one viewport.*

---

## RULE 02: NO REPEATED COMPONENTS
Never reuse the exact same composition twice.

**Forbidden repetition:**
```
Title → Paragraph → Image
↓
Title → Paragraph → Image
↓
Title → Paragraph → Image
```

Every section must introduce a distinct rhythm, layout structure, and typographic personality.

---

## RULE 03: NO DECORATIVE UI
Everything must have a concrete operational purpose.

**Never add:**
- Random icons as visual fillers
- Random background gradient blobs or artificial glows
- Random decorative border lines or horizontal dividing hairlines
- Random soft drop shadows or box glows
- Random decorative ornaments, floating pills, or decorative badges

*If a visual element does not communicate verifiable operational proof or function, remove it.*

---

## RULE 04: PHOTOGRAPHY IS CONTENT
Photos are not decoration. Photos are evidence.

Every image must answer one question:
> *"What operational proof does this image provide?"*

If the answer is nothing, **remove the image**.
- No decorative 4%–6% opacity ghost background photos.
- No stock photos or irrelevant culinary decoration.
- Real facilities, real equipment, real audits, real certifications only.

---

## RULE 05: TYPOGRAPHY BEFORE CARDS
Visual hierarchy must come from typography, **NOT** from containers.

Use:
- Font size
- Font weight
- Spatial rhythm
- Alignment and whitespace

**Stop using:**
- Card inside card
- Card inside panel
- Panel inside card
- Nested container outlines

---

## RULE 06: FEW BACKGROUNDS, CHANGED BY CHAPTER
Avoid changing background colors every section. A background changes only when the chapter changes.

- **Public site** (updated 2026-11-22): charcoal canvas `#1A1F22` for almost every chapter. One
  chapter per page may turn to warm paper `#F4F0E8` when its content reads like a document
  (facilities and legal papers on the homepage, ordering terms on the menu). Brick orange carries
  the proposal block and the footer.
- **Admin console**: a charcoal frame around a warm paper canvas, see "Admin console colour" below.
- **Order pages for customers** follow the public site.

See the chapter "Public Site Visual Language" below for the full specification.

---

## RULE 07: MOTION
Motion should explain, never entertain.

**Permitted motion:**
- Scroll reveals with purposeful sequencing
- Living facility micro-motion (e.g. subtle steam wisp or sheen with `prefers-reduced-motion` fallbacks)
- Image focus and inspector transitions
- Immediate tactile navigation and tab feedback

*Everything else must remain still.*

---

## RULE 08: SCROLL STORYTELLING
Visitors must feel they are taking an escorted executive tour through an industrial facility:

1. **Entrance** → Full-bleed hero
2. **Company** → Intro overlapping the hero, with key facts
3. **Clients** → Manufacturing client logos
4. **Packages** → Three menu package cards
5. **Quality** → HACCP/ISO protocols (split feature)
6. **Workflow** → 7-stage one-way production flow (split feature)
7. **Production** → Capacity figures and fleet travel times
8. **Verification** → Facility and legal document cards
9. **Proposal** → Banner with the contact block

*Each section is a deliberate chapter. Never random.*

---

## RULE 09: VISUAL DENSITY
Every viewport must contain generous breathing room.
- Spacing rhythm must be varied (**80px**, **120px**, **140px**, **160px**).
- If everything attracts attention, nothing attracts attention.

---

## RULE 10: PURPOSE TEST
Every single component, element, and text block must answer:
> *"Why does this exist?"*

If it has no clear answer, **delete it**.

---

## CHAPTER — PUBLIC SITE VISUAL LANGUAGE (updated 2026-11-19)

The public site (homepage `/` and menu catalogue `/menu`, plus the shared `Navbar` and `Footer`) follows
the editorial hospitality style of cage.ca: full-bleed photography, heavy uppercase headlines, photos that
bleed to the viewport edge with one large rounded corner, photo cards, and a solid brand-colour footer.
The admin ERP keeps its own design system.

### Typography
- **Headings**: Saira Semi Condensed 700/800 (SIL OFL 1.1), self-hosted in `src/app/fonts/`, Tailwind
  utility `font-heading`. Always uppercase, leading 1.02, `text-balance`.
- **Body**: Barlow 400/500/600/700 (SIL OFL 1.1), utility `font-text`, 17px with 1.7 line-height.
- **Sizes** come from `TITLE_SIZE` in `src/components/site/ui.tsx`:
  - `hero`: `clamp(3rem, 7.6vw, 7.5rem)`. The second line is indented so the block reads as a stagger.
  - `large` (split feature sections): 2.75rem → 3.75rem → 4.375rem
  - `medium` (card and list sections): 2.25rem → 3rem → 3.125rem
- **Eyebrows**: either `Eyebrow` (Barlow semibold, 22px, uppercase) or `RuledEyebrow` (small heading
  type followed by a double rule that runs to the viewport edge).
- **Links under copy** use `TextLink` (small uppercase, underlined). Calls to action use `ButtonLink` pills.

### Colour
Same "Dapur Rempah" tokens as the admin console (`src/app/globals.css`); never write hex in components.

| Role | Token | Value |
|---|---|---|
| Canvas | `ink` | `#1A1F22` |
| Card / panel surface | `ink-soft` | `#232A2E` |
| Paper chapter (one per page) | `canvas`, text `ink`, body `stone-700` | `#F4F0E8` |
| Buttons, tags, footer, proposal block (anything with text) | `brand-600`, hover `brand-700` | `#B04C10`, `#8F3E0D` |
| Lines, rules, progress, selected outlines (no text) | `brand-500` | `#C85A17` |
| Accent text on dark | `brand-300` | `#E07A35` |
| Text | white; secondary copy white at 75–85% | |

White on `#C85A17` is only 4.3:1, so the brand fill that carries text is `brand-600` (5.4:1).

### Layout and photography
- Content aligns to `CONTAINER` (max 90rem, 100px side padding on desktop).
- **Hero**: full viewport photo with a dark overlay; headline centred as a block; one primary pill.
- **Intro**: the eyebrow, headline and a portrait photo overlap the bottom of the hero.
- **Split feature** (`SplitFeature`): photo at aspect 641/504 bleeds to the left or right edge with a
  70px rounded inner bottom corner; sides alternate down the page.
- **Cards** (`PhotoCard`): 10px radius, photo fills the card, orange tag top-left, title over a gradient.
- **Banner + block**: a full-width photo with an orange block overlapping its lower edge, inset from the
  left, 50px rounded bottom-left corner.
- **Footer**: solid `brand-600`, logo, link columns in small uppercase heading type.

### Admin console colour: "Dapur Rempah" (2026-11-22)
Replaces every earlier admin colour rule (monochrome slate, blue primary, paper canvas) and shares
its tokens with the public site above. The
admin console is a kitchen's control room: a charcoal frame you stop noticing, a warm paper desk
where the work happens, and the ZKS brick orange only where something is yours to act on.
Tokens live in `src/app/globals.css` (`@theme`).

| Role | Token | Value | Where |
|---|---|---|---|
| Frame | `ink` | `#1A1F22` | Header bar, sidebar, login backdrop |
| Frame text | white 70% / 50% | | Nav items / section titles; active item white |
| Desk (canvas) | `canvas` | `#F4F0E8` | Behind every page |
| Surface | white | `#FFFFFF` | Cards, tables, dialogs |
| Neutrals | Tailwind `stone` | | Borders, secondary text, table headers (warm, never `slate`) |
| Brand action | `brand-600` / hover `brand-700` | `#B04C10` / `#8F3E0D` | Primary buttons, links that act |
| Brand accent | `brand-500` | `#C85A17` | Active-nav bar, active tab, focus rings, avatar, bars in charts |
| Brand on dark | `brand-300` | `#E07A35` | Active nav icon, "Panel admin" label |
| Brand tint | `brand-50` / `brand-100` | `#FDF4EE` / `#FAE3D3` | Quiet highlights (delivery stop number) |

Status colours are named after the spice rack and keep Tailwind hues so badges stay familiar:

| Meaning | Name | Tailwind | Examples |
|---|---|---|---|
| Done, money in, healthy | Daun (leaf) | `emerald` | Lunas, Diterima, Berjalan |
| Needs a look, waiting | Kunyit (turmeric) | `amber` | Bukti bayar, Belum lunas, Menunggu |
| Problem, money out | Cabai (chili) | `rose` | Refund, Ditolak, Bahan kurang |
| In progress, informative | Telang (butterfly pea) | `sky` | Dimasak, Diproses |
| The thing to do next | Bata (brick) | `brand` | Perlu ongkir, Titik antar, Piutang |

Rules of use
- **KPI cards** carry their meaning on a 3px top edge (`KpiCard tone`): `success`, `warning`,
  `danger`, `brand` or `neutral` (stone). One colour per card, never a coloured background.
- **Badges** are pills (`rounded-full`) with a tinted background and dark text of the same hue.
- **Orange is for action and "you are here"**, not decoration: one primary button per area.
- **Contrast**: white on `brand-600` 5.4:1, `brand-600` on white 5.4:1, `brand-300` on `ink` 5.5:1,
  white 70% on `ink` above 9:1. Never put `brand-500` text on white (4.3:1).
- **Type**: Plus Jakarta Sans for the interface, JetBrains Mono only for codes (`ZKS-…`, PO numbers);
  amounts use the interface face with `tabular-nums`.

---

## FINAL OBJECTIVE
This website should no longer feel like a website.
It should feel like an industrial documentary.
Like reading a premium annual report.

**Quiet. Confident. Timeless. Designed by humans. Never by AI.**

---

# CHAPTER — ENGINEERING RULES

This chapter establishes the core software engineering principles for the Zahdan Kamal Sentosa Enterprise ERP platform.

### Core Principles
• **No duplicate components**: Every UI element must originate from a canonical shared or module component.
• **No duplicate hooks**: Stateful logic must be extracted and reused across pages and modules.
• **No duplicate services**: All API and data transformations belong in dedicated service modules.
• **No duplicate API calls**: Network requests must be consolidated and managed via centralized services.
• **No duplicate constants**: System metrics, thresholds, status options, and strings must be defined once.
• **No duplicate types**: Domain entities, schemas, and API contracts must have single source of truth types.

### Mandatory Feature Requirements
Every feature in this codebase must strictly include:
1. **Types**: Strong TypeScript interfaces and type definitions (`types/`).
2. **Validation**: Runtime validation schemas with Zod or dedicated validators (`schemas/`).
3. **Services**: Encapsulated data layer, API, and mock/production providers (`services/`).
4. **Constants**: Domain configuration, defaults, and lookup tables (`constants/`).
5. **Documentation**: Clear architectural comments and specification notes.

### Architectural Standards
- **Isolate Business Logic**: Business logic must never remain inside page components. Page components are strictly presentation and routing wrappers.
- **Component Reusability**: Prefer reusable components over copied code. Centralize UI primitives into `@/shared/components`.
- **Zero Temporary Clutter**: Never create temporary files that remain unused. Clean up scratchpads and test files before concluding tasks.
- **Consistent Folder Naming**: Always keep folder names consistent across modules (`components`, `hooks`, `services`, `types`, `schemas`, `utils`, `constants`).
- **Independent Module Maintainability**: Every feature module must be independently maintainable and cleanly decoupled from adjacent business modules.

