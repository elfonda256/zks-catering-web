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

- **Public site** (updated 2026-11-19): one charcoal canvas `#1A1F22` throughout. Brand orange
  `#C85A17` is reserved for the proposal block and the footer.
- **Admin ERP and the order pages**: keep the continuous paper canvas (`#FAF9F5`).

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
| Role | Value |
|---|---|
| Canvas | `#1A1F22` |
| Card / panel surface | `#232A2E` |
| Brand accent, buttons, tags, footer | `#C85A17`, hover `#A4460E` |
| Accent text on dark | `#E07A35` |
| Text | white; secondary copy white at 75–85% |

### Layout and photography
- Content aligns to `CONTAINER` (max 90rem, 100px side padding on desktop).
- **Hero**: full viewport photo with a dark overlay; headline centred as a block; one primary pill.
- **Intro**: the eyebrow, headline and a portrait photo overlap the bottom of the hero.
- **Split feature** (`SplitFeature`): photo at aspect 641/504 bleeds to the left or right edge with a
  70px rounded inner bottom corner; sides alternate down the page.
- **Cards** (`PhotoCard`): 10px radius, photo fills the card, orange tag top-left, title over a gradient.
- **Banner + block**: a full-width photo with an orange block overlapping its lower edge, inset from the
  left, 50px rounded bottom-left corner.
- **Footer**: solid `#C85A17`, logo, link columns in small uppercase heading type.

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

