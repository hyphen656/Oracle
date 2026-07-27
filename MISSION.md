# MISSION — The Aaronson Oracle, taught

This document is the contract for the project. It supersedes BRIEF.md
(kept as history of the original vertical slice). Every future slice is
derived from this mission and must not contradict it.

## What we are building

An educational website built around one interactive experiment: a program
that predicts whether you will press F or D — before you press it — and is
right far more often than chance. The experiment is Scott Aaronson's
classroom oracle (described in *Quantum Computing Since Democritus*). We are
not claiming the idea; we are teaching it. The site gives his tool a clear,
welcoming interface, then explains — in plain English first, real math
second — exactly how it works and why humans can't beat it.

**Working title:** "The Aaronson Oracle — an interactive lesson in human
predictability." (Final name may be refined in the design slice, but the
name must signal the lesson and credit the origin, not manufacture mystique.)

## Audience

The general curious public. No CS, math, or statistics background assumed.
Everything must start from zero. A secondary goal: the material should be
structured well enough that a teacher could point a class at it with no
extra scaffolding.

## The shape of the site

**Play first, scroll to learn.** The site is a homepage: one continuous
page (content may span multiple source files, but the reader experiences
one flow), with the game as its central symbol and everything else
radiating out from it:

1. **The instrument** — the game, at the top. A visitor plays before
   reading anything. The "it predicted me" moment must land unspoiled.
2. **The lecture** — scrolling past the game opens the educational layer:
   - *The story*: the seventy-year lineage as one narrative — Shannon's
     mind-reading machine and Hagelbarger's SEER at Bell Labs, the two
     machines playing each other, and then Aaronson picking the idea up
     for a lecture hall fifty years later: the classroom demonstration,
     the 70–80% result, the student who beat it, and where our version
     departs from his. The history frames the experiment rather than
     trailing it.
   - *How it works, in English*: no notation. "It remembers your last few
     presses and checks what you did next the last time this happened."
     Walk the reader down the exact path from their presses to a
     prediction — ideally tracing a real prediction from their own
     session step by step, so nothing about the machine stays a black box.
   - *How it works, actually*: the 5-gram frequency model, backoff,
     prediction — named properly, with light notation for readers who
     want rigor.
   - *Read the machine*: the actual predictor source code, shown on the
     page and annotated. The code must stay short and plain enough to
     read in one sitting — its simplicity is itself the lesson. The
     displayed code is the real code the page runs, not a cleaned-up
     replica.
   - *What it says about us*: the human-psychology takeaway, stated
     explicitly — a few dozen lines of counting beat human intuition
     because people are systematically bad at behaving randomly. Grounded
     in the human-randomness literature, not pop-psych hand-waving.
   - *References*: every claim traces to a real, linked source.
3. **The rematch** — the lecture ends by handing the instrument back.
   Now that the reader knows exactly how the machine works, they play
   again. Most people still lose. That result — not a citation — is the
   proof of the human-randomness thesis, and it is the page's ending.
   The rematch is honest about what it is: same predictor, same rules,
   the reader's own second score set beside their first.

## The game (the centerpiece)

- Keep the core loop and the 100-press session with a final score. A
  defined session gives the experience shape and a comparable result.
- **The sealed prediction is the centerpiece of the interface.** The
  machine visibly, unmistakably commits its guess before every press,
  then reveals it after. The whole UI choreographs commit → press →
  reveal. It must never feel arbitrary or decorative.
- **The seal is choreography, not proof.** A card that flips over after
  the press cannot, by itself, convince a reader who has no way to
  inspect the page. So the credibility claim is carried in plain words:
  a short "why you should believe this" note that says the predictor is
  a few dozen lines, that those exact lines are printed further down the
  page, and why that leaves no room for it to be faking. Never lean on
  devtools-verifiability for an audience that doesn't open devtools.
- **Never fake the seal.** The prediction is computed and committed
  before the keypress, always. Render only real state — everything
  visible reflects the actual model.
- No taunting. The original slice's mocking voice is retired. If the
  machine "speaks" at all during play, it is a neutral, honest
  observation; whether it speaks at all is decided in the game slice.
- The final score is framed educationally (predictability, what your
  pattern was), not as free-will theater.

## Visual direction

**Clean academic light.** The dark-void aesthetic is retired. The site
reads like a beautiful interactive textbook chapter — light background,
strong typography, figures with captions (in the spirit of distill.pub /
explorable explanations). The game is rendered as a clear scientific
instrument within that page, not a séance.

## Attribution commitments

- Prominent credit: a dedicated history section telling Aaronson's story,
  not just a footer line.
- Proper citations: *Quantum Computing Since Democritus*, Aaronson's own
  writing on the oracle, and the prior art (Shannon, Hagelbarger, human-
  randomness studies). No folklore — if we can't source a claim, we don't
  publish it.

## Hard constraints

- Multiple plain files allowed (HTML/CSS/JS, real fonts allowed), but
  **no framework, no npm, no build step**. Open it in a browser or host
  it on any static host — that's the whole deployment story.
- Keyboard is the primary input on desktop, but the experiment needs a
  binary choice, not a keyboard: touch is fully supported. The whole
  site — instrument, lecture, figures — works on a phone. A teacher must
  be able to assign it to students who will open it on their phones.
- Every historical and scientific claim on the site must be verifiable
  against a linked source.

## Acceptance test (how we know the mission succeeded)

1. **The "aha" survives.** A first-time visitor who plays before reading
   still gets the visceral "it predicted me" moment.
2. **A novice can explain it.** After reading the lecture, someone with
   no CS background can accurately explain to a friend how the predictor
   works.
3. **Citations check out.** Every claim traces to a real, linked source.
4. **Teachers could use it.** An educator could assign the page as-is.
5. **The code keeps its promise.** A reader who opens the "read the
   machine" section finds code short and simple enough to believe, and
   it matches what the page actually runs.
6. **The rematch lands.** A reader who now knows the algorithm plays
   again and — usually — still loses, and the page names that result
   plainly as the lesson rather than as a gotcha.
7. **It works on a phone.** Every part of the site, experiment included.

## Development plan — slice by slice

Each slice is small, shippable, and judged against this mission before
the next begins.

1. **Research dossier** — scour the internet: Aaronson's original account,
   the book passage, existing implementations, Shannon/Hagelbarger
   history, human-randomness literature. Output: a sources file with
   quotes and links that the lecture will be written from. Nothing gets
   written into the site that isn't in the dossier.
2. **Design direction** — the academic-light visual system: typography,
   layout, and above all the commit → press → reveal choreography.
   Output: agreed look before any rebuild.
3. **Rebuild the instrument** — the game in the new design, seal as
   centerpiece, neutral copy, session and score reframed educationally,
   keyboard and touch. Built as a reusable component, because the page
   mounts it twice. Write the predictor as a small, self-contained,
   readable module from the start — it will be displayed on the page
   verbatim in slice 4.
4. **Write the lecture** — story (lineage first, then Aaronson), the
   plain-English explanation, the real math, the annotated source code
   ("read the machine"), the psychology takeaway, and the rematch that
   closes it. All claims cited from the dossier.
5. **Interactive figures** — where a figure teaches better than prose
   (e.g. the reader's own frequency table from their session), add it.
6. **Polish and publish** — naming finalized, references section, static
   hosting, and a final pass against the acceptance test.

## Decided (see DOCTRINE.md for the execution plan)

- The machine is **mostly silent** during play: real state only (seal,
  press, reveal, running score); prose appears only at session end.
- **Fully static, forever.** No backend of any kind.
- Hosting: developed on GitHub, deployed to **Vercel** as a static site
  at publish time.

## Open questions (decide in the relevant slice, not before)

- Exact final name. (Design/publish slices.)
- Whether to reach out to Aaronson before publicizing. (Publish slice.)
- **Session persistence.** The lecture wires prose and figures to the
  reader's own presses; a refresh currently erases all of it. Storing one
  session in `localStorage` is not a backend and not an account. Decide
  in slice 2, before the figures are designed around data that may not
  survive a scroll.
- **Session length.** 100 presses is a long ask before any payoff on a
  page (Aaronson's demo was live and social; ours isn't). A shorter first
  session with an optional extension to 100 may serve both the "aha" and
  the statistics. Decide in slice 2.
- **The score itself.** "Free will score" is retired but nothing has
  replaced it. Candidates: accuracy set against both baselines (chance
  50%, Aaronson's students 70–80%), or the entropy of the reader's
  sequence in bits per press against a ceiling of 1.0 — the actual
  scientific quantity, and teachable. Decide in slice 2 or 3.
- **The scroll spoiler.** A reader who scrolls mid-session and reads
  "it remembers your last few presses" has destroyed their own first
  result. Gate, discourage by layout, or knowingly accept. Decide in
  slice 2.
