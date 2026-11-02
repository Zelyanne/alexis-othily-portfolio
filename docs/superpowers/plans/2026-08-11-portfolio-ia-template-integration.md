# Portfolio IA template integration — implementation plan

**Approved design:** `docs/superpowers/specs/2026-08-11-portfolio-ia-template-integration-design.md`
**Execution date:** 2026-11-02

## Scope

Apply the Open Design “Portfolio IA” visual system to the existing React/Vite portfolio while keeping one shared page for both variants:

- `/`: same portfolio design, no freelance offers;
- `/freelance`: same portfolio design plus the five existing regional offers;
- French and English copy selected by the existing `useCopy` behavior;
- `/cv`, `/count`, analytics, geo pricing, project links and public anchors remain functional.

Do not modify `package.json`, `package-lock.json`, `api/analytics.js`, portfolio data, prices, projects or experience records.

## Files

- `src/main.tsx`: route variants, header reveal, shared Portfolio IA markup, pointer motion, project tracking, email copy toast.
- `src/styles.css`: light purple/pink OKLCH theme, editorial hero, asymmetric project grid, offer rows, combined skills/experience panels, contact panels and responsive/reduced-motion behavior.
- `src/hero-motion.ts`: replace obsolete sticky-scroll calculations with a clamped pointer-position helper.
- `tests/hero-motion.test.ts`: focused tests for center, edge and out-of-bounds pointer positions.

## Implementation

### 1. Lock the motion contract

Replace the sticky hero tests with assertions for a pure `getHeroPointerPosition` helper:

- center returns `{ x: 0, y: 0 }`;
- edges return `-0.5` and `0.5`;
- points outside the hero are clamped;
- zero dimensions do not produce `NaN` or infinity.

Run `node --test tests/hero-motion.test.ts` and confirm the test fails before implementation, then add the minimal helper and rerun it.

### 2. Restore the two route variants without duplication

Change `HomePage` to accept `showServices: boolean` and keep all shared content in that component. Register `/` with `false` and `/freelance` with `true`.

Only run geo-price detection and render `#services` when `showServices` is true. Keep `trackLandingView` unchanged so its existing pathname classification continues to record `base` and `freelance` separately.

### 3. Translate the Portfolio IA structure into React

In `src/main.tsx`:

- add the missing bilingual labels required by the template;
- render a full-height hero with large `ALEXIS`, portrait, availability, proof caption, calls to action and domain card;
- render all five existing projects in one asymmetric grid, with the first project featured and external links still tracked with `trackLandingClick`;
- render the five services as template-style rows only on `/freelance`, showing one regional price and the timeline;
- combine skills and experience into adjacent panels while preserving `#skills` and `#experience` anchors;
- render the template contact panels, native email-copy fallback and localized live toast;
- keep the existing credential links, CV route, phone, GitHub, LinkedIn and Hugging Face links.

### 4. Implement header and motion behavior with native APIs

In `Layout`, derive the active pathname from TanStack Router. Portfolio routes start with the fixed header inert and hidden; an `IntersectionObserver` reveals it after the hero exits, with a passive scroll fallback. `/cv` and `/count` keep the header immediately visible.

The mobile menu keeps `aria-expanded`, closes on navigation/Escape, and locks body scroll while open. The Offers link points to `/freelance#services` from `/` and `#services` from `/freelance`.

In `HomePage`, use one `requestAnimationFrame`-throttled pointer listener and the tested helper to set portrait/card CSS variables. Skip the listener when `prefers-reduced-motion` is enabled and reset the variables on pointer leave.

### 5. Replace only the presentation layer

Rewrite `src/styles.css` around the Open Design tokens and layouts while retaining the selectors needed by `/cv`, `/count`, the analytics chart/table, the skip link and focus states. Keep touch targets at least 44px and add mobile breakpoints matching the reference behavior.

No dependency, component library or new configuration is introduced.

## Verification

Run:

```bash
node --test tests/hero-motion.test.ts
node --test tests/portfolio-content.test.ts
node --test api/analytics.test.js
npm run build
git diff --check
```

Then launch the Vite app locally and inspect desktop and mobile versions of:

- `/`: Portfolio IA design, no `#services` section, Offers link goes to `/freelance#services`;
- `/freelance`: same design, exactly five offers, one regional price per offer;
- French and English browser locales: localized hero, sections, controls, contact and toast;
- `/cv` and `/count`: readable, themed and behaviorally unchanged;
- header reveal, mobile menu, project links/tracking, pointer parallax, reduced motion and email copy.

Before committing, confirm `package.json`, `package-lock.json`, `graphify-out/` and `output/` are excluded from the staged diff. Commit only the implementation plan and task-owned source/test files, then push `main` as explicitly requested.
