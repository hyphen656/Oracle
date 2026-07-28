# DOCTRINE — the start-to-finish plan

This is the working plan for executing MISSION.md. The mission says *what*
and *why*; this file says *how*, slice by slice, with concrete steps and
done-when criteria. If this file ever contradicts MISSION.md, the mission
wins and this file gets fixed.

## Decisions already made (do not reopen casually)

- **Visual system:** distill.pub-style academic — light background, serif
  body, elegant headings, wide margins, figures with numbered captions.
- **Architecture: fully static.** No backend, no serverless, no database,
  no analytics scripts. Everything runs in the browser.
- **Hosting:** develop and push on GitHub; deploy to **Vercel** as a
  static site at publish time. Everything must stay host-agnostic (plain
  files, relative paths) so this is a zero-rework step.
- **Game voice: mostly silent.** During play the instrument shows only
  real state — seal, press, reveal, running score. Prose appears only at
  session end, framed educationally.
- **Stack:** plain HTML/CSS/JS, multiple files allowed, real fonts
  allowed. No framework, no npm, no build step — ever.

## Cross-cutting doctrine (applies to every slice)

- **Truth in rendering.** Everything on screen is actual machine state.
  The sealed prediction is computed and committed before the keypress,
  always, and the page must make that verifiable.
- **Truth in writing.** No claim without a source in the dossier. If the
  dossier can't support it, it doesn't ship.
- **Truth in code.** The predictor shown in "read the machine" is the
  literal module the page runs — enforced by loading the same file for
  both execution and display, never by copy-paste.
- **Tone.** Academic, warm, honest. Never taunting, never mystical.
- **Git practice.** Small commits per slice; each slice ends with a
  commit that passes its done-when checklist before the next begins.
- **Review gate.** At the end of each slice, re-read MISSION.md's
  acceptance test and confirm nothing regressed.

## Target file layout (reached by slice 3)

```
index.html      — the page: instrument at top, lecture below
style.css       — the academic-light design system
oracle.js       — the predictor ONLY: small, self-contained, readable;
                  displayed verbatim on the page in slice 4
game.js         — the instrument as a reusable component: session logic,
                  keyboard + touch input, seal/reveal choreography, DOM
                  wiring. Mounted twice (top of page, and the rematch at
                  the end of the lecture). Not shown on the page.
figures.js      — interactive figures (slice 5)
DOSSIER.md      — research sources with quotes and links (slice 1)
DESIGN.md       — the agreed design spec (slice 2)
```

---

## Slice 1 — Research dossier

**Goal:** a sources file the entire lecture can be written from. Nothing
enters the site that isn't in the dossier.

**Steps:**
1. Aaronson primary sources: the passage in *Quantum Computing Since
   Democritus* (book, and the lecture notes it grew from), any
   Shtetl-Optimized posts or talks where he describes the oracle, the
   70–80% figure, and the student who beat it by hand-simulating a PRNG.
2. Existing implementations: the known web implementations of the oracle
   (e.g. the "Aaronson oracle" pages that circulated), noting what they
   built and what they credit — we acknowledge prior art.
3. Lineage: Shannon's mind-reading machine and Hagelbarger's SEER at Bell
   Labs — primary write-ups, dates, win rates, and a reliable account of
   the machines playing each other.
4. Human-randomness literature: canonical, citable studies showing humans
   are poor random-sequence generators (review papers preferred over
   one-off studies). This grounds the "what it says about us" section.
5. For every source: full citation, working link, the exact quote or
   figure we intend to use, and a note on what claim it supports.
6. Flag any claim we *wanted* to make but couldn't source — listed at the
   bottom as "unsupported, do not publish."

**Deliverable:** `DOSSIER.md`.

**Done when:** every planned lecture section (story, how-it-works,
psychology, lineage) has at least one solid source; every quote has a
link; the unsupported list exists even if empty.

---

## Slice 2 — Design direction

**Goal:** the agreed academic-light visual system, specified before any
rebuild code is written.

**Steps:**
1. Typography: choose the serif body face and heading treatment (real
   font files committed to the repo — no CDN dependency), sizes, measure
   (~65ch), and vertical rhythm.
2. Palette: paper-white background, ink text, one restrained accent for
   interactive/instrument elements. Light theme only.
3. Layout: single-column article flow; the instrument as a full-width
   "figure" at the top; figure/caption conventions for everything
   interactive below. Two breakpoints minimum — the instrument must be
   designed for a phone and a laptop at the same time, not adapted to
   the phone afterwards. Touch targets sized for thumbs.
4. **The seal choreography (the heart of the slice):** storyboard
   commit → press → reveal frame by frame — what the sealed state looks
   like, how commitment is made visibly irreversible, the reveal timing,
   and how a first-time player understands the machine isn't cheating
   without reading a manual. Include the placement of the "why you
   should believe this" note, per mission — the seal is choreography and
   the words carry the proof.
5. **Reserve space for the figures now.** Slice 5's figures (frequency
   table/heatmap, the animated step-through of one prediction, accuracy
   over time) are the most layout-hostile things on the page. Storyboard
   them as sized gray boxes with captions in this slice, so the type and
   grid are decided against real constraints. Content comes later; the
   footprint is decided here.
6. Mock the instrument and one lecture spread as a static HTML sketch to
   judge the direction cheaply (throwaway, not the rebuild).

**Deliverable:** `DESIGN.md` (type scale, palette tokens, spacing rules,
breakpoints, seal storyboard, figure footprints) plus the throwaway
sketch.

**Done when:** the sketch is approved by Spencer and DESIGN.md is
complete enough that the rebuild slice needs no visual decisions.

---

## Slice 3 — Rebuild the instrument

**Goal:** the game, rebuilt in the new design, seal as centerpiece.

**Steps:**
1. Write `oracle.js` first: the 5-gram frequency model with backoff as a
   small, dependency-free, comment-annotated module — written to be
   *read*, since slice 4 displays it verbatim. Back off on **sample
   size, not just on ties**: a 4-key context seen once must not override
   a 2-key context seen forty times. A minimum-count threshold costs two
   characters and keeps the model defensible to anyone who knows
   statistics — which matters precisely because we print the source and
   name the method.
2. Write `game.js` as a **reusable instrument component** (the page
   mounts it twice — top of page, and the rematch closing the lecture):
   the session, F/D input by keyboard *and* by touch/click, the
   commit → press → reveal loop per the DESIGN.md storyboard, running
   accuracy, session-end summary.
3. Session-end framing: educational, per mission — your predictability
   score, what it means, a pointer to scroll down and learn why. Mostly
   silent during play.
4. Edge cases: ignore held keys/auto-repeat, ignore non-F/D input,
   prevent double-fire when a tap and a keypress both land, no
   double-tap-zoom or text selection on the F/D targets, works from
   phone width up.
5. Accessibility pass: the game is keyboard-native already; ensure
   status changes are announced (aria-live on reveal/score), visible
   focus, real button semantics on the touch targets, contrast per
   DESIGN.md.
6. Retire the old dark slice: `index.html` is replaced, BRIEF.md stays
   as history.

**Deliverable:** working instrument at the top of `index.html`, empty
lecture scaffold below.

**Done when:** a first-time player gets the unspoiled "it predicted me"
moment on a laptop *and* on a phone; the seal provably commits before
every press (in the code, and stated in words on the page for readers
who won't read the code); no taunting copy exists.

---

## Slice 4 — Write the lecture

**Goal:** the full educational layer, written from the dossier only.

**Steps:**
1. *The story* — told lineage-first, as one narrative: Shannon's
   mind-reading machine, Hagelbarger's SEER, the two machines playing
   each other, then Aaronson picking the idea up for a lecture hall
   fifty years later — the classroom demo, the 70–80% result, the
   student who beat it, where our version departs from his. Every fact
   from DOSSIER.md. (This replaces the old bottom-of-page "bigger
   picture" section; the history now opens the lecture.)
2. *How it works, in English* — no notation; walk the exact path from
   presses to prediction. Wire it to the reader's own session where
   possible ("in your game, after you pressed F,F,D,F,F, the machine
   looked up…").
3. *How it works, actually* — n-grams, frequency counts, backoff, the
   prediction rule, with light notation.
4. *Read the machine* — `oracle.js` fetched and rendered on the page
   with annotations. Same file the game executes. Line count stated
   plainly; the simplicity is the lesson.
5. *What it says about us* — the psychology takeaway, grounded in the
   human-randomness literature from the dossier. No pop-psych.
6. *The rematch* — the lecture's ending. Mount the instrument a second
   time: same predictor, same rules, but the reader now knows exactly
   how it works. Show their two scores side by side. The copy states
   the result plainly and without gloating, whichever way it goes —
   including for the minority who do beat it, whose method (usually
   an external source of randomness, or hand-simulating one) is itself
   the point and should be named.
7. *References* — numbered, linked, every in-text claim traceable.
8. Read-aloud edit pass: a smart 15-year-old should follow every section
   without backtracking.
9. Word budget, set during slice 1 and checked here: this is the
   largest slice in the project and its only real failure mode is
   sprawl. Each section has a target length before it has a draft.

**Deliverable:** complete lecture in the page, ending in the rematch.

**Done when:** mission acceptance tests 2, 3, 5, and 6 pass — a novice
can explain the predictor, citations check out, the displayed code is
the running code, and the rematch lands.

---

## Slice 5 — Interactive figures

**Goal:** figures only where a figure teaches better than prose.

**Candidates (build in this order, stop when value drops):**
1. **Your own frequency table** — the reader's actual session data as an
   explorable table/heatmap: "after F,F what did you usually do?" This is
   the killer figure; it makes the English explanation personal.
2. **Replay the path** — step through one real prediction from the
   reader's session: context window highlights → table lookup → backoff
   → prediction, animated slowly.
3. **Accuracy over time** — the machine's running accuracy across the
   reader's 100 presses, showing it learning them.
4. A "try to be random" mini-widget in the psychology section, if and
   only if it earns its place.

**Rules:** every figure is numbered and captioned per DESIGN.md; every
figure renders real session state (or an honest sample dataset when the
reader hasn't played, clearly labeled as such); figures degrade to
static content without JS errors if data is absent.

**Done when:** figures 1–2 ship polished; 3–4 ship only if they teach.

---

## Slice 6 — Polish and publish

**Goal:** naming finalized, the site live, mission acceptance test passed.

**Steps:**
1. Final name decision (mission open question) — must signal the lesson
   and credit the origin.
2. Metadata: title, description, favicon, social preview card image —
   honest, non-mystical framing.
3. Performance pass: fonts subset and preloaded, no layout shift at the
   instrument, page interactive fast on a mid-range laptop.
4. Cross-browser check: current Chrome, Safari, Firefox, Edge.
5. Full accessibility audit of the lecture (headings hierarchy, alt
   text/captions, contrast, keyboard-only walkthrough).
6. Deploy: push to GitHub, connect the repo to Vercel as a static
   deployment (no build command, output = repo root). Custom domain if
   and when Spencer buys one.
7. Decide on contacting Aaronson before publicizing (mission open
   question) — draft the note if yes.
8. Final pass against MISSION.md's acceptance test, all five points,
   with at least one real first-time tester for point 1.

**Done when:** the site is live on Vercel and the acceptance test passes.

---

## Slice 7 — Width, imagery, dark theme

**Goal:** the finished lecture was correct and unread-looking: a 34rem
column down the middle of a wide screen, no images anywhere, and the
`#story` section running 143 lines with nothing to break it. Give the page
the width and the visual punctuation of a real article without widening
the prose past what is readable.

**Steps:**
1. **The editorial grid.** One `.spread` grid of five tracks: gutter, rail,
   text, rail, gutter. Prose stays in the text column at 38rem; figures
   take `wide`, bands take `full`, short asides take a rail. The rails
   collapse below 64rem so the phone layout is unchanged.
2. **Dark theme.** A second set of the design tokens, `prefers-color-scheme`
   plus a `data-theme` override so an explicit choice wins in both
   directions, resolved in the head before first paint.
3. **Imagery.** Licensed photographs committed under `img/`, plus drawn SVG
   plates in the existing hairline language for everything no usable
   photograph exists for.
4. **Quote bands.** The five historical quotations become full-bleed bands,
   with a portrait where one exists. These carry the page's rhythm.
5. **A footer**, which the site did not have; the endnote was doing footer
   duty inside the references section.
6. **No em-dashes** in any prose we wrote. Quotations are left exactly as
   the sources have them, em-dashes included; altering a quotation to suit
   a house style would break "truth in writing" to fix a typographic
   preference.
7. Amend MISSION.md, DESIGN.md and this file, and record every photograph's
   licence and provenance in DOSSIER.md.

**Two traps worth writing down, both cost a debugging cycle:**

- Grid items default to `min-width:auto`, so the code block and the
  comparison table pushed their own tracks wider than the viewport and
  scrolled the whole page sideways. `.spread > *{min-width:0}`.
- `figure{margin:40px auto}` opts a figure out of grid stretch and sizes it
  shrink-to-fit, which reintroduces exactly the same overflow even with
  `min-width:0` set. Use `margin-block` only and let the grid centre it.

**Done when:** `document.scrollWidth === clientWidth` at 390, 768, 1024 and
1440; every figure renders in both themes, Figure 5's chart included;
`verify-seal.html` still reports zero mismatches over 400 presses; and
`grep -c '—'` over `index.html` returns only the count inside quotations.

---

## Explicitly out of scope (entire project)

- Any backend, database, serverless function, or third-party analytics.
- Accounts, persistence beyond the in-memory session, leaderboards.
- Frameworks, npm, build tooling of any kind.
- Scroll-triggered animation, parallax, ambient motion. The seal is the
  only thing on the page that moves, and that has not changed.
- Hotlinked assets. Every image, like every font, is a file in the repo.

**Dark theme was here until slice 7**, when the mission was amended to
allow it. It is now built: one set of tokens per theme, browser default
plus a toggle.
