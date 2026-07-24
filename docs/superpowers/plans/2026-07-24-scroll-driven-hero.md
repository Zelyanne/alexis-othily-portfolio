# Scroll-Driven Portfolio Hero Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:test-driven-development while implementing this plan task-by-task.

**Goal:** Replace the homepage's static split hero with a reversible, scroll-scrubbed portrait and oversized-name scene that pins for roughly one extra viewport.

**Architecture:** `HomePage` measures one hero scene through a ref and writes derived CSS custom properties from clamped scroll progress without React re-renders. The existing portrait, localized copy, metrics, navigation, and analytics remain authoritative; CSS owns the sticky composition, responsive transforms, and reduced-motion fallback.

**Tech Stack:** React 19, TypeScript, Vite 7, native CSS, Node 24 `node:test`

---

## File Map

- Create `src/hero-motion.ts`: one pure normalized scroll-progress calculation.
- Create `tests/hero-motion.test.ts`: native Node regression check for before/midpoint/after clamping.
- Modify `src/main.tsx`: connect the scene ref, passive scroll/resize scheduling, CSS variables, and layered hero markup.
- Modify `src/styles.css`: replace the split hero with the sticky full-canvas composition and responsive/reduced-motion rules.
- Do not change `package.json`, `package-lock.json`, `api/analytics.js`, routes, analytics functions, localized copy objects, or files below the hero.

### Task 1: Scroll progress calculation

**Files:**
- Create: `tests/hero-motion.test.ts`
- Create: `src/hero-motion.ts`

- [ ] **Step 1: Write the failing native Node test**

Create `tests/hero-motion.test.ts`:

```ts
import assert from 'node:assert/strict'
import test from 'node:test'
import { getHeroScrollProgress } from '../src/hero-motion.ts'

test('normalizes and clamps hero sticky travel', () => {
  assert.equal(getHeroScrollProgress(120, 1400, 800), 0)
  assert.equal(getHeroScrollProgress(-300, 1400, 800), 0.5)
  assert.equal(getHeroScrollProgress(-900, 1400, 800), 1)
  assert.equal(getHeroScrollProgress(-20, 800, 800), 1)
})
```

- [ ] **Step 2: Run the test and verify RED**

Run:

```bash
node --test tests/hero-motion.test.ts
```

Expected: FAIL with `ERR_MODULE_NOT_FOUND` for `src/hero-motion.ts`. A syntax or test-runner error is not the expected failure and must be corrected before continuing.

- [ ] **Step 3: Implement the minimum helper**

Create `src/hero-motion.ts`:

```ts
export function getHeroScrollProgress(sceneTop: number, sceneHeight: number, viewportHeight: number) {
  const travel = Math.max(sceneHeight - viewportHeight, 1)
  return Math.min(Math.max(-sceneTop / travel, 0), 1)
}
```

- [ ] **Step 4: Run the focused test and verify GREEN**

Run:

```bash
node --test tests/hero-motion.test.ts
```

Expected: one passing test, zero failures.

- [ ] **Step 5: Commit the focused behavior**

```bash
git add src/hero-motion.ts tests/hero-motion.test.ts
git commit -m "Add hero scroll progress calculation"
```

### Task 2: Connect scroll progress and layer the hero markup

**Files:**
- Modify: `src/main.tsx:1-14`
- Modify: `src/main.tsx:839-919`

- [ ] **Step 1: Capture the failing structural baseline**

With the current dev server running, inspect the homepage and evaluate:

```js
document.querySelector('.heroScene.heroMotionReady') !== null
```

Expected before implementation: `false`. This is the browser-level RED check for the new scene boundary.

- [ ] **Step 2: Add the imports and scene ref**

Update the React import and add the progress helper import:

```ts
import { StrictMode, useEffect, useMemo, useRef, useState } from 'react'
// existing router and component imports stay unchanged
import { getHeroScrollProgress } from './hero-motion'
```

At the start of `HomePage`, keep the current copy and visitor-region lines and add the ref:

```ts
function HomePage({ showServices = false }: { showServices?: boolean } = {}) {
  const { language, text } = useCopy()
  const [visitorRegion, setVisitorRegion] = useState<VisitorRegion>(getVisitorRegion)
  const heroSceneRef = useRef<HTMLElement>(null)
```

- [ ] **Step 3: Add the scroll paint effect without React state**

Insert this effect after `heroMetrics` and before the existing landing-view effect:

```ts
  useEffect(() => {
    const scene = heroSceneRef.current
    if (!scene) return

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    let animationFrame = 0

    const paint = () => {
      animationFrame = 0
      const progress = reducedMotion.matches
        ? 1
        : getHeroScrollProgress(scene.getBoundingClientRect().top, scene.offsetHeight, window.innerHeight)
      const remaining = 1 - progress

      scene.style.setProperty('--hero-progress', progress.toFixed(4))
      scene.style.setProperty('--hero-title-x', `${(-18 * progress).toFixed(3)}vw`)
      scene.style.setProperty('--hero-title-y', `${(-5 * progress).toFixed(3)}vh`)
      scene.style.setProperty('--hero-portrait-x', `${(25 * progress).toFixed(3)}vw`)
      scene.style.setProperty('--hero-portrait-scale', (1 - 0.14 * progress).toFixed(4))
      scene.style.setProperty('--hero-backdrop-x', `${(-3 * progress).toFixed(3)}vw`)
      scene.style.setProperty('--hero-copy-opacity', (0.18 + 0.82 * progress).toFixed(4))
      scene.style.setProperty('--hero-copy-y', `${(30 * remaining).toFixed(2)}px`)
      scene.style.setProperty('--hero-stats-opacity', (0.25 + 0.75 * progress).toFixed(4))
      scene.style.setProperty('--hero-stats-y', `${(20 * remaining).toFixed(2)}px`)
    }

    const requestPaint = () => {
      if (!animationFrame) animationFrame = window.requestAnimationFrame(paint)
    }

    scene.classList.add('heroMotionReady')
    paint()
    window.addEventListener('scroll', requestPaint, { passive: true })
    window.addEventListener('resize', requestPaint)
    reducedMotion.addEventListener('change', requestPaint)

    return () => {
      window.removeEventListener('scroll', requestPaint)
      window.removeEventListener('resize', requestPaint)
      reducedMotion.removeEventListener('change', requestPaint)
      if (animationFrame) window.cancelAnimationFrame(animationFrame)
      scene.classList.remove('heroMotionReady')
    }
  }, [])
```

Do not add a custom hook, context, scroll library, React progress state, intersection observer, or programmatic scrolling.

- [ ] **Step 4: Replace only the existing hero JSX**

Replace the current `<section className="hero">...</section>` at the top of `HomePage` with:

```tsx
      <section ref={heroSceneRef} className="heroScene">
        <div className="hero heroStage">
          <div className="stageCode" aria-hidden="true">
            <span>{'const solution = {'}</span>
            <span>model: 'applied',</span>
            <span>tools: 'connected',</span>
            <span>{'}'}</span>
          </div>
          <span className="stageOrbit stageOrbitOne" aria-hidden="true" />
          <span className="stageOrbit stageOrbitTwo" aria-hidden="true" />

          <h1 className="heroTitle">
            <span className="heroName">{heroName}</span>
          </h1>

          <figure className="portrait heroPortrait">
            <figcaption>{text.home.status}</figcaption>
            <img src={portraitUrl} alt={text.home.portraitAlt} />
          </figure>

          <div className="heroCopy min-w-0">
            <Pill className="eyebrow heroEyebrow">{text.home.eyebrow}</Pill>
            <p className="heroSpecialty">{heroSpecialty}</p>
            <p className="lead">{text.home.lead}</p>
            <p className="heroNote">{text.home.note}</p>
            <div className="actions flex flex-wrap">
              <ArrowButton className="button primary" href="#projects">
                {text.home.projectsButton}
              </ArrowButton>
              <ArrowButton className="button" href={contactHref}>
                {text.home.contactButton}
              </ArrowButton>
              <Link className="button" to="/cv">
                {text.home.cvButton}
              </Link>
            </div>
            <div className="techPill flex flex-wrap" aria-label={text.home.domainsLabel}>
              <span>{text.home.domainsLabel}</span>
              {featuredTools.map((tool) => (
                <Pill key={tool}>{tool}</Pill>
              ))}
            </div>
          </div>

          <div className="heroStats grid grid-cols-2">
            {heroMetrics.map((metric) => (
              <StatCard key={metric.label} {...metric} />
            ))}
          </div>
        </div>
      </section>
```

Leave the following `focusSection` and all later sections byte-for-byte unchanged.

- [ ] **Step 5: Run focused and compile checks**

Run:

```bash
node --test tests/hero-motion.test.ts
npm run build
```

Expected: one passing focused test and a successful TypeScript/Vite build.

Do not commit this task until Task 3 supplies the corresponding layout; the intermediate markup is intentionally not a finished user-facing state.

### Task 3: Build the sticky scroll composition in existing CSS

**Files:**
- Modify: `src/styles.css:246-544`
- Modify: `src/styles.css:1306-1401`
- Modify: `src/styles.css:1441-1588`
- Modify: `src/styles.css:1700-1783`

- [ ] **Step 1: Replace the obsolete split-hero rules**

Preserve the shared `.eyebrow`, `.button`, `.arrowButton`, `.techPill`, `.pill`, and `.statCard` rules. Remove the old hero grid, separate portrait-card sizing, and hero entrance animation. Add the following hero-specific composition, adjusting only a value that browser evidence proves is necessary:

```css
.homePage {
  padding-top: 0;
}

.heroScene {
  --hero-progress: 1;
  --hero-title-x: -18vw;
  --hero-title-y: -5vh;
  --hero-portrait-x: 25vw;
  --hero-portrait-scale: 0.86;
  --hero-backdrop-x: -3vw;
  --hero-copy-opacity: 1;
  --hero-copy-y: 0px;
  --hero-stats-opacity: 1;
  --hero-stats-y: 0px;
  position: relative;
  height: auto;
}

.heroScene.heroMotionReady {
  height: 180svh;
}

.hero.heroStage {
  position: sticky;
  top: 0;
  height: 100svh;
  min-height: 620px;
  display: block;
  overflow: hidden;
  isolation: isolate;
  margin: 0;
  padding: clamp(24px, 4vw, 58px);
  border-radius: 0 0 52px 30px;
  background:
    radial-gradient(circle at 76% 8%, rgba(255, 255, 255, 0.25), transparent 20%),
    linear-gradient(135deg, #ff4e51, var(--coral) 52%, #ff7770);
  box-shadow: var(--shadow);
}

.heroStage::before,
.heroStage::after {
  position: absolute;
  z-index: -1;
  border: 16px solid rgba(255, 255, 255, 0.16);
  border-radius: 50%;
  content: "";
}

.heroStage::before {
  width: min(48vw, 620px);
  height: 160px;
  right: -8vw;
  bottom: 12vh;
  transform: translate3d(var(--hero-backdrop-x), 0, 0) rotate(-20deg);
}

.heroStage::after {
  width: min(42vw, 540px);
  height: 140px;
  left: -11vw;
  top: 12vh;
  transform: translate3d(var(--hero-backdrop-x), 0, 0) rotate(27deg);
}

.heroTitle {
  position: absolute;
  z-index: 1;
  top: 47%;
  left: clamp(22px, 3vw, 48px);
  width: max-content;
  max-width: none;
  color: rgba(255, 255, 255, 0.92);
  font-size: clamp(7rem, 13vw, 13rem);
  line-height: 0.76;
  white-space: nowrap;
  mix-blend-mode: overlay;
  transform: translate3d(var(--hero-title-x), calc(-50% + var(--hero-title-y)), 0);
  will-change: transform;
}

.heroName {
  display: block;
}

.heroPortrait {
  position: absolute;
  z-index: 2;
  inset: 0;
  overflow: hidden;
  margin: 0;
  pointer-events: none;
  transform: translate3d(var(--hero-portrait-x), 0, 0) scale(var(--hero-portrait-scale));
  transform-origin: center bottom;
  will-change: transform;
}

.heroPortrait img {
  position: absolute;
  bottom: -2%;
  left: 50%;
  width: min(63vw, 690px);
  height: 94%;
  max-height: none;
  object-fit: contain;
  object-position: center bottom;
  filter: drop-shadow(0 28px 22px rgba(42, 13, 14, 0.24));
  transform: translateX(-50%);
}

.heroPortrait figcaption {
  position: absolute;
  z-index: 4;
  top: 20px;
  right: 22px;
  display: inline-flex;
  align-items: center;
  gap: 7px;
  color: white;
  font-size: 10px;
  font-weight: 800;
}

.heroPortrait figcaption::before {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #7ff2b8;
  box-shadow: 0 0 11px rgba(127, 242, 184, 0.9);
  content: "";
}

.heroCopy {
  position: absolute;
  z-index: 3;
  bottom: clamp(24px, 4vh, 52px);
  left: clamp(22px, 4vw, 62px);
  width: min(48%, 560px);
  padding: 18px;
  border: 1px solid rgba(255, 255, 255, 0.24);
  border-radius: 24px;
  background: rgba(52, 17, 18, 0.28);
  color: white;
  opacity: var(--hero-copy-opacity);
  backdrop-filter: blur(12px);
  transform: translate3d(0, var(--hero-copy-y), 0);
  will-change: opacity, transform;
}

.heroCopy:focus-within {
  opacity: 1;
}

.heroSpecialty {
  max-width: 12ch;
  color: white;
  font-family: "Arial Narrow", "Roboto Condensed", "Aptos Display", Arial, sans-serif;
  font-size: clamp(2.4rem, 4.6vw, 4.8rem);
  font-weight: 900;
  letter-spacing: -0.065em;
  line-height: 0.88;
  text-transform: uppercase;
}

.heroCopy .lead {
  max-width: 48ch;
  margin-top: 14px;
  color: rgba(255, 255, 255, 0.86);
  font-size: 14px;
}

.heroCopy .heroNote {
  margin-top: 10px;
  color: white;
  font-size: 12px;
}

.heroCopy .actions {
  margin-top: 16px;
}

.heroCopy .button,
.heroCopy .arrowButton {
  min-height: 42px;
  background: rgba(255, 253, 250, 0.92);
}

.heroCopy .button.primary {
  border-color: white;
  background: white;
  color: var(--coral-dark);
}

.heroCopy .techPill {
  margin-top: 15px;
  background: rgba(255, 253, 250, 0.9);
}

.stageCode {
  position: absolute;
  z-index: 1;
  top: 18%;
  left: 4%;
  display: grid;
  gap: 5px;
  color: rgba(255, 255, 255, 0.72);
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
  font-size: 9px;
  transform: translate3d(var(--hero-backdrop-x), 0, 0);
}

.heroStats {
  position: absolute;
  z-index: 4;
  top: 58px;
  right: 18px;
  width: 200px;
  gap: 9px;
  opacity: var(--hero-stats-opacity);
  transform: translate3d(0, var(--hero-stats-y), 0);
  will-change: opacity, transform;
}
```

Keep the existing `.stageOrbit`, `.stageOrbitOne`, `.stageOrbitTwo`, `.statCard`, `.statCard strong`, and `.statCard span` declarations unless a selector still targets the removed portrait-stage structure.

- [ ] **Step 2: Replace hero-only responsive overrides**

Inside the existing media queries, remove obsolete hero grid/column rules and add:

```css
@media (max-width: 1160px) and (min-width: 900px) {
  .heroCopy {
    width: min(52%, 520px);
  }

  .heroTitle {
    font-size: clamp(6.4rem, 12vw, 10rem);
  }

  .heroPortrait img {
    width: min(68vw, 640px);
  }
}

@media (max-width: 899px) {
  .heroScene.heroMotionReady {
    height: 150svh;
  }

  .hero.heroStage {
    height: 100svh;
    min-height: 680px;
    padding: 20px;
    border-radius: 34px 18px 40px 24px;
  }

  .heroTitle {
    top: 33%;
    left: 18px;
    font-size: clamp(5.4rem, 18vw, 8.5rem);
  }

  .heroPortrait img {
    width: min(105vw, 650px);
    height: 80%;
  }

  .heroCopy {
    right: 18px;
    bottom: 18px;
    left: 18px;
    width: auto;
    max-width: 540px;
    padding: 16px;
  }

  .heroSpecialty {
    font-size: clamp(2.15rem, 8vw, 3.8rem);
  }
}

@media (max-width: 640px) {
  .hero.heroStage {
    min-height: 640px;
    padding: 14px;
    border-radius: 28px 14px 34px 20px;
  }

  .heroTitle {
    top: 27%;
    left: 12px;
    font-size: clamp(4.25rem, 23vw, 6.4rem);
  }

  .heroPortrait img {
    bottom: -4%;
    width: min(130vw, 560px);
    height: 72%;
  }

  .heroPortrait figcaption {
    top: 12px;
    right: 12px;
    font-size: 9px;
  }

  .heroCopy {
    right: 10px;
    bottom: 10px;
    left: 10px;
    padding: 13px;
    border-radius: 18px;
  }

  .heroSpecialty {
    font-size: clamp(1.95rem, 9.5vw, 2.75rem);
  }

  .heroCopy .lead {
    margin-top: 9px;
    font-size: 12px;
    line-height: 1.42;
  }

  .heroCopy .heroNote {
    margin-top: 7px;
    font-size: 11px;
    line-height: 1.4;
  }

  .heroCopy .actions {
    gap: 6px;
    margin-top: 10px;
  }

  .heroCopy .actions .button,
  .heroCopy .actions .arrowButton {
    width: auto;
    min-height: 38px;
    flex: 1 1 auto;
    padding-inline: 11px;
    font-size: 11px;
  }

  .heroCopy .techPill {
    gap: 5px;
    margin-top: 9px;
    padding: 8px;
  }

  .heroCopy .techPill .pill:nth-of-type(n + 5) {
    display: none;
  }

  .heroStats {
    top: 44px;
    right: 10px;
    width: min(46%, 170px);
    gap: 6px;
  }

  .heroStats .statCard {
    min-height: 58px;
    padding: 8px;
  }
}

@media (max-width: 360px) {
  .heroTitle {
    font-size: 4rem;
  }

  .heroSpecialty {
    font-size: 1.85rem;
  }
}
```

Do not duplicate an entire media query; merge these declarations into the existing breakpoints.

- [ ] **Step 3: Make reduced motion a complete static fallback**

Add these hero overrides inside the existing reduced-motion query:

```css
  .heroScene.heroMotionReady {
    height: auto;
  }

  .hero.heroStage {
    position: relative;
    top: auto;
    min-height: 720px;
  }

  .heroTitle,
  .heroPortrait,
  .heroCopy,
  .heroStats,
  .stageCode {
    opacity: 1 !important;
    transform: none !important;
  }
```

In `@media (prefers-reduced-motion: no-preference)`, remove `.heroCopy` and `.heroStage` from the `riseIn` selector so entrance animations cannot overwrite the scroll transforms. Keep the existing card/row entrance and orbit drift.

- [ ] **Step 4: Run automated checks**

Run:

```bash
node --test tests/hero-motion.test.ts
npm run build
git diff --check -- src/main.tsx src/styles.css
```

Expected: one passing focused test, successful build, and no whitespace errors.

- [ ] **Step 5: Commit the complete hero implementation**

```bash
git add src/main.tsx src/styles.css
git commit -m "Add scroll-driven portfolio hero"
```

Do not stage `package.json` or `package-lock.json`.

### Task 4: Browser verification and focused corrections

**Files:**
- Modify only if evidence requires it: `src/main.tsx`, `src/styles.css`, `src/hero-motion.ts`, `tests/hero-motion.test.ts`

- [ ] **Step 1: Start the local app and verify the structural GREEN check**

Run:

```bash
npm run dev
```

At `/`, evaluate `document.querySelector('.heroScene.heroMotionReady') !== null`.

Expected: `true`.

- [ ] **Step 2: Verify desktop scroll behavior at approximately 1280x720**

Confirm with browser screenshots and computed styles:

- at progress near `0`, the portrait is central and the oversized localized name spans behind it;
- at progress near `0.5`, portrait and name have moved in opposite directions;
- at progress near `1`, copy, actions, pills, and metrics are fully readable;
- scrolling upward restores the earlier transforms;
- the scene releases into the existing focus/projects section without a jump;
- there are no console errors or horizontal overflow.

- [ ] **Step 3: Verify responsive and language behavior**

Repeat focused checks around 920px, 680px, and 360px. Confirm:

- all three CTA links remain visible and operable;
- the top mobile navigation opens and remains above the hero;
- French and English hero text fit without horizontal overflow;
- `/freelance` includes the conditional service metric;
- `/cv`, `#projects`, and the contact link still work.

- [ ] **Step 4: Verify reduced motion**

Emulate `prefers-reduced-motion: reduce`, reload, and confirm the hero is static, complete, readable, and not stretched across `150svh`/`180svh`.

- [ ] **Step 5: Apply only evidence-backed corrections**

If a viewport check exposes clipping, overlap, illegible contrast, or overflow, adjust only the responsible hero selector. Do not redesign later sections or introduce a dependency. Re-run the focused test, build, affected viewport, and reduced-motion check after each correction.

- [ ] **Step 6: Commit verified corrections if any**

If browser verification required code changes:

```bash
git add src/main.tsx src/styles.css src/hero-motion.ts tests/hero-motion.test.ts
git commit -m "Polish scroll-driven hero layout"
```

If no code changed, do not create an empty commit.

### Task 5: Final worker self-review

**Files:**
- Review: all changes since the approved design commit

- [ ] **Step 1: Review scope and unrelated work**

Run:

```bash
git status --short
git diff 71fe151 -- src/main.tsx src/styles.css src/hero-motion.ts tests/hero-motion.test.ts
git diff -- package.json package-lock.json api/analytics.js
```

Expected: hero work is limited to the four planned files; package changes remain the user's pre-existing unstaged work; `api/analytics.js` is unchanged.

- [ ] **Step 2: Run the final worker verification**

Run fresh:

```bash
node --test tests/hero-motion.test.ts
npm run build
git diff --check 71fe151 -- src/main.tsx src/styles.css src/hero-motion.ts tests/hero-motion.test.ts
```

Expected: one passing focused test, successful build, and no whitespace errors.

- [ ] **Step 3: Report evidence to the primary**

Report changed files, commit hashes, red/green test evidence, final build output, browser viewport results, reduced-motion result, console/overflow status, and any remaining visual risk. Distinguish confirmed checks from inference. Do not push or modify the user's package files.
