# Legal First-Aid AI — Design Direction

## Three visual approaches considered

### Theme Name: Quiet Casework
Very light editorial surfaces, ink-blue structure, and a restrained saffron evidence accent. The interface should feel like a well-organized case file rather than a generic AI dashboard.
**Probability:** 0.07

### Theme Name: Archive Room
A darker archival workspace with paper-white panels, oxblood annotation marks, and a more investigative atmosphere. Designed for a focused, late-night research feel.
**Probability:** 0.03

### Theme Name: Civic Utility
A bright public-service interface with cool blue fields, strong information hierarchy, and modular utility cards. Clear and accessible, but intentionally less editorial.
**Probability:** 0.08

## Chosen approach: Quiet Casework

### Design Movement
Contemporary editorialism blended with Swiss information design and tactile legal-paper materiality.

### Core Principles
1. Evidence should be visually traceable: every major action points toward a specific document, clause, or status.
2. The workspace should feel composed, not crowded: one dominant task area with an anchored utility rail on the right.
3. Color should encode confidence and action, never decorate without meaning.
4. Every interaction should reduce uncertainty or reveal the next useful step.

### Color Philosophy
The base is warm ivory and soft parchment to make the workspace feel approachable and document-like. Ink navy carries primary structure and trust. Saffron is the ownable signal for active evidence and next actions, while clay red is reserved for risk and attention. Pale sage is used only for supported states. This palette intentionally avoids the sterile blue/white look of generic enterprise software.

### Layout Paradigm
An asymmetrical document workspace: a compact brand rail on the left, a large analysis canvas in the middle, and a clearly separated action rail on the right. The right rail contains the user's requested file, photo, and document functions and stays visually persistent on wide screens. On mobile, it becomes a horizontally scrollable action strip above the main canvas.

### Signature Elements
- Thin ruled dividers and small evidence-index labels that echo printed case folders.
- A saffron "evidence ribbon" motif that marks active or verified content.
- Compact, slightly offset cards with paper-like layering and soft shadows rather than uniform rounded containers.

### Interaction Philosophy
Interactions should feel like handling a case file: select, annotate, replace, inspect, and ask for help. Buttons provide immediate tactile feedback. Tooltips and status labels explain what is happening instead of relying on icon-only ambiguity. The chatbot is a compact service drawer for resolving blockers, not the product's primary mode.

### Animation
Use short ease-out transitions under 220ms for hover, focus, and selection. Let the action rail cards lift by 2–3px and reveal a saffron edge on hover. Use a gentle opacity/translate entrance for analysis sections, with reduced-motion support. Avoid looping ornamentation; motion should signal progress, state, or response.

### Typography System
Use **DM Serif Display** for major headlines and document-like section titles. Use **Manrope** for navigation, labels, metadata, and body copy. Headings should have generous line-height and restrained weight contrast. Uppercase micro-labels should be tracked and small, used as evidence indexing rather than decoration.

### Brand Essence
Legal First-Aid AI is an evidence-first companion for people who need to understand a legal document before deciding what to do next. It is calm, candid, and practical.

### Brand Voice
Headlines are direct and human. CTAs describe the next action. Microcopy acknowledges uncertainty without sounding evasive.

Example lines:
- “Start with the document. Leave with a clearer next move.”
- “We found a clause worth checking. Here is what it supports—and what it does not.”

### Wordmark & Logo
Use the generated folded-paper / first-aid-cross mark as the compact brand symbol. Pair it with a custom-styled stacked wordmark: “LEGAL FIRST-AID” in tracked Manrope caps with “AI” in a saffron block or underline. Do not render the product name as an unstyled default heading.

### Signature Brand Color
**Evidence Saffron — #D79A38.** It is warm enough to feel human and distinct enough to own the moments where a user needs to notice proof, status, or the next action.

## Implementation reminders

- Use the generated assets from `/manus-storage/legal-paper-texture_e834b3a1.jpg`, `/manus-storage/legal-analysis-hero_8f6f3f5c.jpg`, `/manus-storage/legal-clause-detail_91a1f7b9.jpg`, and `/manus-storage/legal-first-aid-mark_3c9d70cf.png`.
- Keep this frontend demo-only. File selection, analysis, chat, and document actions use local UI state and clearly labeled mock/prototype behavior.
- Preserve the evidence-first hierarchy: supported, partly supported, and insufficient evidence must never look interchangeable.
- When in doubt, ask: “Does this choice reinforce or dilute Quiet Casework?”

## Style Decisions

- Treat the right-hand action rail as a first-class utility surface, not a secondary overflow menu.
- Keep the chatbot compact and contextual, with quick issue categories before freeform text.
- Prefer editorial warmth and restrained contrast over highly rounded SaaS cards or neon/dark AI motifs.
