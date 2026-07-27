# THE ORACLE — vertical slice brief

> **SUPERSEDED.** This brief governed the original vertical slice and is
> kept as history. The project contract is now MISSION.md.

A single-page experiment: the machine predicts whether you'll press F or D
before you press it. Based on Scott Aaronson's classroom oracle
(Quantum Computing Since Democritus). No backend, no framework, no build step.
One `index.html`. Everything inline.

## The one-sentence pitch
"Press F or D randomly. You can't. It knows."

## Hard constraints
- ONE file: index.html (inline CSS + JS). No dependencies, no fonts loaded
  from anywhere for the slice — system monospace is fine.
- Desktop keyboard only (F and D keys). No mobile support in the slice.
- No traditional website anatomy: no header, no nav, no footer, no logo,
  no buttons except where stated. The page is a black void with text in it.

## Visual direction (slice-grade)
DIRECTION (decided): "THE GLASS BRAIN"
The interface renders the machine's actual internal state. Nothing on
screen is decorative; everything visible is real data.

Core principle — render only real state:
- Background = the machine's true model: 16 four-key context nodes
  (FFFF...DDDD), labeled in small dusty-red type, scattered across the
  viewport (center column kept clear), drifting very slowly.
- Edges = only transitions the player has actually made; hairline gray,
  thickening/brightening with count. A small red pulse travels the edge
  just taken. Current context glows brighter red.
- The page opens as near-void; the map GROWS out of the player's own
  behavior. Pacing target: barely visible by press 20, undeniable by 60.

Palette: void #0C0C0E · white #F2F1EF · dusty red #C96A5E ·
active red #E2574D · hairline rgba(210,214,220,.14) · dim #6E6E74.
Type: Archivo only. Heavy (700) white center statement; 300-weight for
quiet UI; tiny 11px labels for map nodes. No monospace, no second family.

Center column (the only foreground):
- Machine speech as the large white statement, one line at a time.
- Seal as microcopy beneath: "prediction sealed" -> "it guessed F — miss".
  Commit is always visible BEFORE the press. Never fake it.
- F and D as bare typographic letters (buttons, but styled as letters).
- Bottom readout: press count; accuracy appears only in act 3.

Known accepted tradeoff: a determined player can read the map's thicker
branches and counter the prediction. Accepted — it's rare, earned, and
"I beat it by reading its mind" is a desirable story. Keep the map dim
and drifting (texture, not readout) so the exploit stays earned.

No traditional website anatomy: no header, nav, footer, logo, or chrome.
One focal point at a time; generous emptiness.

## The algorithm (the whole brain)
- Keep a frequency table: for each 4-key context (last 4 presses, so 16
  contexts), count how often the NEXT press was F vs D. (This is the
  5-gram model: 4 of context + 1 predicted.)
- To predict: look up current 4-key context. If unseen or tied, back off
  to 3-key context, then 2, then 1, then overall F/D majority, then coin flip.
- Update the table after every press. Predict before every press.
- Predictions start from press 1 (coin flips at first). All 100 presses count
  toward the final score. Honesty over flattery.

## The arc (this is the product)
Session = exactly 100 presses.

ACT 1 — presses 1-15: "watching"
- Opening screen: just the words: "press F or D. randomly. that's all."
- No numbers, no predictions shown. Keys echo as constellation nodes.
- Around press 10, one line from the machine: "keep going."

ACT 2 — presses 16-30: "the sealed guess"
- Before each press, a small face-down marker appears center-screen:
  the machine has committed its prediction. After your press it flips:
  ✓ (it was right) or ✗ (wrong). No running total yet.
- The commit MUST visibly happen before the keypress. This is the
  credibility mechanic. Never fake it.

ACT 3 — presses 31-100: "the dawning"
- Running accuracy appears, small, in the machine's red: "62%".
- Event-triggered remarks (machine speaks ONLY on triggers, max ~6 total
  per session, never two in a row within 5 presses):
  - 5 correct in a row: "you alternate when you get nervous."
  - 8 correct in a row: "that was a pattern too."
  - Machine below 45% at press 50+: "you're harder than most."
  - Player switches strategy (detectable: context distribution shifts):
    "trying something new. noted."
- Voice rules: lowercase, short, specific, never gloats about the total,
  concedes honestly when losing.

END — after press 100:
- Everything fades except:
  - "FREE WILL SCORE: NN%"  (100 minus machine accuracy)
  - One tailored observation computed from real stats, e.g.:
    "your tell: you never pressed the same key four times." Pick from:
    alternation rate >60%, longest run, most-predictable context.
  - The closing lore, small: "aaronson's program hit 70-80% against his
    students. one student scored 50%. he said he just used his free will."
  - A single "copy result" action producing plain text:
    "The machine predicted my keypresses NN% of the time.
     Free Will Score: NN%. Can you be random? [url]"
  - "again" (restarts, keeps the learned table across runs — round two
    against a machine that already knows you is the replay hook).
- Credit line, tiny, bottom: "after scott aaronson · quantum computing
  since democritus"

## Slice acceptance test (play it yourself)
1. Does the sealed-guess flip produce a real "oh no" moment by press ~25?
2. Does accuracy usually sit 60%+ by press 60 when you play naturally?
3. Does the final observation feel personal, not generic?
If any answer is no, fix pacing/copy before touching visuals.

## Explicitly OUT of the slice
Mobile/touch, share-card images, sounds, percentile comparisons, themes,
analytics, meta tags, favicon, README. Nothing else gets built until the
acceptance test passes.