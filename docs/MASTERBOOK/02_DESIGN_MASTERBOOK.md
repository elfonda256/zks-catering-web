# ZKS DESIGN MASTERBOOK
# VERSION 2.0 (ENTERPRISE ERP EDITION)

This document defines the permanent design language and core doctrines for the Zahdan Kamal Sentosa (ZKS) enterprise platform.
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

- **Public homepage** (updated 2026-11-19): charcoal `#141413` is the main canvas for the company and
  operations chapters, with `#1C1C1A` as the one alternate tone. Paper `#FAF9F5` is reserved for the
  quality, documents and menu chapter, plus the client logo strip (logo artwork has white backgrounds).
  Brand orange `#A4460E` is used for the final proposal block only.
- **Admin ERP and other public pages**: keep the continuous paper canvas (`#FAF9F5`).

See the chapter "Public Homepage Visual Language" below for the full specification.

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

1. **Entrance** → Full-bleed hero with headline and four key facts
2. **Clients** → Manufacturing client logos
3. **Company** → History, credentials, milestones
4. **Production** → Central kitchen capacity and fleet travel times
5. **Menu** → Full-width menu spotlight linking to `/menu`
6. **Workflow** → 7-stage one-way production flow
7. **Quality** → HACCP/ISO protocols
8. **Verification** → Archive document explorer
9. **Specification** → Weekly menu and portion grammage
10. **Proposal** → Contact block with management WhatsApp links

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

## CHAPTER — PUBLIC HOMEPAGE VISUAL LANGUAGE (2026-11-19)

The public homepage (`src/app/page.tsx`, sections in `src/components/home/`) follows a bold editorial
style inspired by hospitality brand sites: full-bleed photography, condensed uppercase headlines,
rounded pill buttons. It applies to the homepage only; the admin ERP keeps its own design system.

### Typography
- **Display face**: Barlow Condensed 700/800 (SIL OFL 1.1), self-hosted via `next/font/local` in
  `src/components/home/fonts.ts`, exposed as the Tailwind utility `font-condensed`.
- **Body face**: the existing system sans stack. Monospace only for registration numbers.
- **Headlines** are uppercase, weight 800, line-height 0.95, and always `text-balance` so no single
  word is left alone on the last line.
- **One title size per level.** Use the shared constants in `src/components/home/ui.tsx`:
  - H1 (hero only): `clamp(3.25rem, 8vw, 7.5rem)`
  - Section titles: `SECTION_TITLE_SIZE` (2.75rem → 3.75rem → 4.5rem)
  - Small labels (list titles, stat captions): `LABEL`
- **Every section opens with `SectionHeading`**: eyebrow, 16px gap, title, 24px gap, lead paragraph
  (max 42rem, `text-pretty`). Buttons follow 36px below. Never hand-roll a section heading.
- **Alignment**: all text is left-aligned to the `max-w-7xl` grid. No centered sections and no
  staggered or indented headline lines.

### Colour
| Role | Value |
|---|---|
| Main canvas | `#141413` |
| Alternate dark | `#1C1C1A` |
| Paper chapter | `#FAF9F5` |
| Primary button | `#C85A17`, hover `#A4460E` |
| Eyebrow on dark | `#E07A35` |
| Eyebrow on paper | `#A4460E` |
| Proposal block | `#A4460E` |

Small orange text is never placed on paper in `#E07A35` or `#C85A17`; use `#A4460E` for contrast.

### Layout
- Hero is full viewport height with a photo, a dark gradient for legibility, and content anchored
  to the bottom-left.
- Split sections bleed the photo to the viewport edge while the text column stays on the grid.
- Section padding: 96px mobile, 128px desktop.
- Calls to action use `PillLink` (solid, outline, dark). External links open in a new tab.

---

## FINAL OBJECTIVE
This platform should feel like an industrial documentary.
Like reading a premium annual report.

**Quiet. Confident. Timeless. Designed by humans. Never by AI.**
