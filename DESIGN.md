# DESIGN — the academic-light system

Slice 2 deliverable. Complete enough that slice 3 makes no visual
decisions. If this file contradicts MISSION.md, the mission wins.

---

## 1. Direction: technical memorandum, not literary essay

The mission asks for "a beautiful interactive textbook chapter" in the
spirit of distill.pub. The obvious execution of that — warm cream paper,
high-contrast display serif, terracotta accent — is the house style of
every explorable explanation on the internet right now, and it would say
nothing about *this* subject.

So the direction comes from the subject's own materials, which are sitting
in the dossier. Shannon's 1953 memo describes a machine that kept score
with **a row of up to fifty steel balls** passing momentum down the line,
whose random element was **a commutator spinning ten times a second**, and
the last page of that memo is **a hand-drawn relay circuit diagram**.

The page is therefore a **technical memorandum**, and the instrument is
**laboratory apparatus** drawn in that memo's linework. Cool drafting
paper, not warm literary cream. Hairlines, not shadows. Machine-side
information set in monospace; human-side prose set in serif — a typographic
distinction that encodes something true rather than decorating.

**One deliberate risk:** the running score is not a percentage. It is a row
of fifty small squares that fills left to right as you play — Shannon's ball
counter, reimagined. Your predictability becomes a texture you can read at a
glance before any number explains it.

---

## 2. Palette

Six values. Cool, not warm — engineering drawing rather than paperback.

| Token | Light | Dark | Role |
|---|---|---|---|
| `--vellum` | `#F4F5F2` | `#15171B` | page ground; cool drafting paper |
| `--ink` | `#14161A` | `#E7E9E4` | body text, headings; blue-black drafting ink |
| `--graphite` | `#5C6068` | `#9BA1A8` | captions, secondary, mono labels |
| `--hairline` | `#C8CCC6` | `#343A41` | rules, apparatus outlines, table borders |
| `--relay` | `#1B4D8F` | `#7FAEEA` | **the instrument's only colour** — sealed state, revealed prediction, links |
| `--filament` | `#C4442A` | `#E4735C` | **machine was correct.** Nothing else, anywhere. |

Two values were added in slice 7 because full-bleed bands need a ground
and the seal cover needs a softened hairline: `--band` (`#E9EBE6` /
`#1C1F24`) and `--hatch` (`--hairline` at 55%). Both are derived from the
six, not new colours.

**Dark is the same drawing on a dark ground, not a second design.**
`--relay` and `--filament` are lightened because at their light values
they vanish against `#15171B`; every other token is inverted in place.
The theme follows `prefers-color-scheme`, and a `data-theme` attribute on
`<html>` overrides it in both directions, resolved by a short script in
the head before first paint so the page never flashes the wrong ground.

⚠ **Colour belongs in CSS, never in JS.** Figure 5's chart originally
hardcoded three hex values in `figures.js` and rendered invisibly in dark
mode. It now uses `.chart-line` / `.chart-pip` / `.chart-base` classes, so
it follows the theme live and is never redrawn. The same applies to
`favicon.svg`, which carries its own `prefers-color-scheme` block.

**Rationing `--filament` is the point.** It appears only when the oracle
predicted you correctly. It is never used for headings, links, buttons, or
emphasis. By the end of a session the tally row is flecked with it in
exact proportion to how readable you were — the page's most-used colour is
the one you earned.

**Contrast.** `--ink` on `--vellum` ≈ 16:1. `--graphite` ≈ 5.3:1 (AA at all
sizes). `--relay` ≈ 7.6:1. `--filament` ≈ 4.1:1 — **below AA**, so it is
never used for text. It only ever fills a square, and hit/miss is encoded
by **fill versus hollow**, not by hue. The instrument is fully legible in
greyscale and to colourblind readers.

---

## 3. Type

Two families, three jobs.

**Source Serif 4** (variable, SIL OFL, self-hosted) — all prose. A
transitional serif with the plainness of a journal, not the fashion of a
display face.

**IBM Plex Mono** (400/500/600, SIL OFL, self-hosted) — everything
machine-side: section eyebrows, figure numbers, instrument labels and
readouts, and the displayed source code. IBM Plex Mono is the correct
period-adjacent choice and it means one family covers labels *and* code.

The rule readers absorb without being told: **serif is us talking, mono is
the machine.**

| Role | Face | Size (desktop / mobile) | Notes |
|---|---|---|---|
| Page title | Serif 600 | 2.75rem / 2rem | tracking −0.02em |
| Section h2 | Serif 600 | 1.75rem / 1.5rem | tracking −0.01em |
| Sub-head h3 | Serif 600 | 1.1875rem | |
| Body | Serif 400 | 1.0625rem | leading 1.68, measure 62ch |
| Caption | Serif 400 | 0.875rem | `--graphite` |
| Eyebrow | Mono 500 | 0.75rem | uppercase, tracking 0.14em |
| Figure label | Mono 500 | 0.75rem | uppercase, tracking 0.14em |
| Instrument readout | Mono 400 | 0.8125rem | `font-variant-numeric: tabular-nums` |
| Key glyph (F/D) | Mono 500 | 2rem / 1.75rem | |
| Code | Mono 400 | 0.8125rem | leading 1.7 |

`tabular-nums` is required on every live-updating number so the readout
never jitters mid-session.

---

## 4. Space, measure, breakpoints

Base unit 4px, scale: `4 8 12 16 24 32 48 64 96 128`.

**Superseded in slice 7 by the editorial grid.** The original three widths
were centred containers, which left a 34rem ribbon down the middle of a
wide screen. They are now tracks in one grid, `.spread`:

```
[full-start] gutter [wide-start] rail [text-start] TEXT [text-end] rail [wide-end] gutter [full-end]
   20px–1fr            0–14rem          min(38rem, 100%−40px)      0–14rem        20px–1fr
```

| Class | Track | Holds |
|---|---|---|
| (default) | `text` | all prose, 38rem, about 64 characters |
| `.wide` | `wide` | figures, plates, photographs, tables, code |
| `.full` | `full` | quote bands, the instrument band |
| `.railnote` | left rail | dates, short asides pulled from parentheticals |

The prose measure went from 34rem to 38rem, and no further: the page uses
the whole screen through the rails and the breakout tracks, not by
stretching the text. Below 64rem the rails collapse to `0`, `wide` becomes
`text`, rail notes fall back into the flow as indented notes, and the
layout is the single column it always was.

⚠ **Two rules the grid depends on**, each of which caused the page body to
scroll sideways when it was missing:

- `.spread > *{min-width:0}`. Grid items default to `min-width:auto`, so a
  child with wide min-content (the `<pre>`, the comparison table) grows its
  own track past the viewport.
- Figures must use `margin-block` only. An auto inline margin opts the box
  out of grid stretch and sizes it shrink-to-fit, which reintroduces the
  same overflow even with `min-width:0`. Grid already centres it.

**Breakpoints — two, mobile-first.** The instrument is designed for both at
once, not adapted afterward.

- **base (< 48rem)** — single column, 20px gutters, key targets 56px tall
  and full-width-minus-gutter, tally row wraps to 2 rows of 25.
- **≥ 48rem** — measure centred, key targets 64px, tally row single row of
  50, figures may use `--wide`.

Vertical rhythm: 96px between major sections desktop, 64px mobile. Paragraph
spacing 1.15em. Never a bare `<br>`.

---

## 5. The instrument

Full-bleed band, `--vellum` ground, bounded top and bottom by a single
`--hairline` rule. **Its contents sit on `--measure`, the same column as
the prose** — the page has one spine from masthead to references. The
apparatus (plate, keys) is centred on that column; everything that reads as
data (tally, readout, baselines, note) is left-aligned to its left edge.
Two deliberate alignments, never three.

```
┌────────────────────────────────────────────────────────┐  ← hairline
│  FIGURE 1 · THE ORACLE                        32 / 50  │  mono eyebrow + count
│                                                        │
│                  ┌───────────┐                         │
│                  │▨▨▨▨▨▨▨▨▨▨▨│   ← the seal plate      │
│                  │▨ SEALED  ▨│      (hatched, closed)  │
│                  └───────────┘                         │
│                                                        │
│                   ┌───┐ ┌───┐                          │
│                   │ F │ │ D │                          │  key targets
│                   └───┘ └───┘                          │
│                                                        │
│  ■□■■□■□□■■■□■■□■□■■□···                               │  ← the tally
│                                                        │
│  Predicted 16 of your 32 presses.                      │
│  ──────────────────────────────────                    │
│  SESSION COMPLETE                                      │
│  YOU        ▐████████████░░░░░▌  68%                   │
│  CHANCE     ▐▨▨▨▨▨▨▨▨░░░░░░░░░▌  50%                   │
│  HIS CLASS  ▐█████████████░░░░▌  70–80%                │
└────────────────────────────────────────────────────────┘  ← hairline
```

**The seal plate.** 168 × 116px desktop, 140 × 96px mobile — it must read as
larger than the keys, because it is the subject and they are the controls.
1px `--hairline` border, no radius, no shadow — a drawn plate, not a card.
Closed state is 45° hatching at 6px pitch in `--hairline` at ~55%, with the
mono label `SEALED` in `--graphite` on a `--vellum` chip. Beneath the hatch
sits the actual predicted letter in `--relay` at 3rem.

**The session-end baselines.** A three-row grid (`auto 1fr auto`): mono
label, a 10px track with a 1px `--hairline` border, mono percentage with
`tabular-nums`. `YOU` fills `--filament` — the one place the reader's own
number wears the machine's colour. `CHANCE` fills with the same 45° hatch
as the seal cover, because 50% is not an achievement but a null. `HIS
CLASS` fills `--relay`. Shown only at session end, never during play.

⚠ **Implementation note.** The track and fill must be `display:block`.
Both are spans inside a grid; grid blockifies the track but *not* the fill,
and an inline element silently ignores `width` and `height` — the bars
render as empty outlines. This cost a screenshot cycle in the sketch.

**The prediction is really in the page, behind an opaque cover.** Not held
in a variable and printed later — present in the DOM, occluded visually.
That makes the commitment inspectable: a skeptic can open devtools before
pressing and read the guess. The "why believe this" note says so in as many
words, which turns devtools-verifiability from an excuse into an invitation
while the plain-English sentence carries everyone else.

**The tally row.** One 7px square per press, 3px gap (10px pitch, so 50
presses span 500px and fit `--measure` at every width), left to right, in
press order. Filled `--filament` = the oracle was right; hollow with a
`--hairline` stroke = it was wrong. Unplayed presses are absent, not greyed
— the row grows. This is the score, the pacing indicator, and slice 5's
accuracy-over-time figure, all at once.

**The readout.** Mono, `--graphite`: `predicted 8 of your 12 presses`. No
percentage during play — a percentage over 12 presses is noise, and showing
it invites the reader to over-read early swings. The percentage and the two
baselines appear only at session end.

---

## 6. The seal choreography — frame by frame

The centrepiece. Four states, one loop, repeated 50 times.

**Frame 1 — ARMED** (rest, indefinite)
Plate closed and hatched, `SEALED`. Keys F and D at rest in `--ink`. The
guess is already computed and already in the DOM.

**Frame 2 — STRIKE** (0–90ms)
The struck key fills `--relay`, translates down 1px, and returns. Nothing
else moves. Keyboard and pointer produce identical feedback.

**Frame 3 — OPEN** (90–270ms)
The hatched cover slides up and out of the plate over 180ms,
`cubic-bezier(.2,.7,.3,1)` — a shutter throw, mechanical rather than soft.
The letter beneath is revealed in `--relay`. The tally gains one square:
filled `--filament` on a hit, hollow on a miss. The readout increments.

**Frame 4 — RE-ARM** (970–1150ms)
After 700ms of held reveal, the cover slides back down over 180ms, now
concealing the *next* prediction, which was computed the instant the press
resolved. Return to Frame 1.

**Rules.**
- Presses during frames 2–4 are accepted immediately and restart the cycle;
  the instrument never blocks input or drops a press. A fast player sees a
  faster shutter, never a queue.
- The cover's motion is the only animation on the page. There is no ambient
  drift, no parallax, no scroll-triggered reveal, anywhere.
- `prefers-reduced-motion: reduce` → cover opacity-swaps in 1 frame, hold
  and re-arm timings unchanged. No sliding.
- `aria-live="polite"` on the readout announces `"predicted F. You pressed
  D. Miss. 5 of 12."` Screen-reader users get the same commitment evidence,
  in the same order.

---

## 7. Article conventions

**Section eyebrows.** Mono caps above each h2, naming the section's job
(`THE STORY`, `HOW IT WORKS`, `READ THE MACHINE`). Not numbered — the
lecture is not a procedure, and `01 / 02 / 03` would assert a sequence the
content doesn't have. The one place numbering is honest is figures, which
are genuinely referenced by number from the prose.

**Figures.** Every figure gets a mono label `FIGURE N` and a serif caption
below in `--graphite` at 0.875rem, on `--wide`. Interactive figures carry
the same furniture as static ones — an interactive thing is still a figure.

**Blockquotes.** Historical quotations (Shannon, Hagelbarger, Aaronson) set
in serif italic at 1.0625rem, indented 24px with a 2px `--hairline` rule at
the left. Attribution below in mono 0.75rem.

**Code.** `--wide`, mono 0.8125rem, `--vellum` ground with a 1px
`--hairline` border, 18px/20px padding. Line numbers in `--graphite` at 45%
opacity, `display:inline-block; width:2ch; text-align:right`,
`user-select: none`. Annotations sit in the margin at ≥48rem and inline
between lines below it.

⚠ **Must be a real `<pre>`** with `white-space: pre` and `overflow-x: auto`.
Rendered as a wrapping `<div>`, the line numbers reflow into the middle of
the code and the block becomes unreadable on a phone — verified in the
sketch. Horizontal scroll inside the figure is correct; the page body must
never scroll sideways.

**Links.** `--relay`, underlined with `text-underline-offset: 0.15em` and a
1px `--hairline` decoration that goes `--relay` on hover. No colour-only
affordance.

---

## 8. Figure footprints (reserved now, built in slice 5)

Sized here so the grid is decided against real constraints rather than
retrofitted.

| # | Figure | Footprint | Notes |
|---|---|---|---|
| 1 | The instrument | full-bleed × 420px | top of page |
| 2 | Your frequency table | `--wide` × 300px | 16-row heatmap desktop; scrolls in its own container on mobile |
| 3 | Replay one prediction | `--wide` × 240px | step-through, reader-advanced; no autoplay |
| 4 | Accuracy over time | `--wide` × 160px | reuses the tally row's visual language |
| 5 | The rematch | full-bleed × 420px | identical to figure 1 |

Every figure must hold its box before data arrives — reserved height, no
layout shift when a session loads from `localStorage`.

---

## 9. Quality floor

- Visible focus ring on every interactive element: 2px `--relay`, 2px
  offset. Never removed.
- Key targets ≥ 56px tall on touch; `touch-action: manipulation` to kill
  double-tap zoom; `user-select: none` on the keys only.
- The page renders and reads with JavaScript disabled; the instrument
  degrades to an honest note rather than a dead box.
- Fonts `preload`ed and `font-display: swap`, with a metric-adjacent
  fallback stack so the fold doesn't shift.
- Both themes are held to the same floor: every figure must render, and
  the contrast pairs must be checked on both grounds.

---

## 10. Imagery (slice 7)

Two kinds, and the distinction is the point.

**Drawn plates** are original inline SVG in the hairline language of the
rest of the page: `.rule`, `.box`, `.box-on`, `.lab`, `.val`, `.val-on`.
All colour comes from the tokens, so they invert with the theme for free
and cost nothing to load. Five exist: SEER's eight situations, the umpire
match, the three-machine comparison (an HTML table, not SVG, because it is
genuinely tabular), the notebook's six entries, and the alternation-bias
curve.

**Photographs** are locally committed files under `img/`, resized with
`sips`, with explicit `width`/`height`, `loading="lazy"` and a mild
`--photo-filter` in dark mode so they do not glare. They are capped by
**height** (`max-height: 34rem`), not width: a nearly square object photo
at the full `wide` track is a thousand pixels tall and swallows the page.

**Captions carry two lines with different jobs.** The `figcaption` says
what the picture is; the `.credit` span says where it came from and under
what licence. They are never merged.

**The honesty rule.** No photograph of Shannon's mind-reading machine
exists under a licence we can use. The page therefore shows Nimwit, a
different Shannon machine from the same years, and the caption's first
clause says exactly that before it says anything else. A photograph that
merely looks like the subject, captioned loosely, would be a worse
violation of "truth in rendering" than having no photograph at all.

**Labels, not figure numbers.** Plates and photographs are labelled
`PLATE`, not `FIGURE N`. Section 7 numbers only what the prose refers to
by number, which is the six interactive and data figures. Numbering the
imagery would have asserted a sequence the prose does not use, and forced
a renumber of all six.

---

## 11. The sketch

`sketch.html` was the slice 2 sketch — the instrument plus one lecture
spread, used to judge this direction before committing to it. Its predictor
was real rather than a mock, because a faked seal would have misjudged the
exact thing being designed.

**It was deleted in slice 6**, once the real page had superseded every part
of it. It survives in the history at commit `e456415` if the direction ever
needs re-litigating.

`verify-seal.html` is not a sketch and stays. It is a standalone page that
presses the instrument 400 times with no delay, half the presses chosen
adversarially against whatever is committed, and reports any mismatch
between what was in the DOM before a press and what was scored after it.
It is the proof behind the credibility note, and it is worth being able to
re-run.
