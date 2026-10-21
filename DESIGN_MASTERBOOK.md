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

## RULE 06: ONE BACKGROUND
Avoid changing background colors every section.
Maintain a large, continuous editorial canvas (`#FAF9F5`).

Only change background when the narrative changes dramatically (e.g. transitioning to `#141413` for heavy industrial operational scale and final corporate proposal).

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

1. **Entrance** → Hero Facility Ledger
2. **Company** → History, Credentials, Strategic Value
3. **Production** → Central Kitchen Capacity & Latency Matrix
4. **Workflow** → 7-Stage Engineering Schematic
5. **Quality** → HACCP/ISO Protocols & Laboratory Verification
6. **Verification** → Archive Document Explorer
7. **Specification** → Industrial Nutrition & Portion Grammage
8. **Proposal** → Direct Executive Sign-Off Ledger

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

