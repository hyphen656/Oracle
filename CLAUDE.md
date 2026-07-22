# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

"The Oracle" — a single-page experiment that predicts whether the player will
press F or D. BRIEF.md is the contract for this project; read it before
changing anything. The entire product is `index.html` (inline CSS + JS).

## Hard constraints

- One file, no dependencies: no framework, no build step, no npm, no external
  JS or fonts. There are no build, lint, or test commands — open `index.html`
  in a browser to run it.
- BRIEF.md's "Explicitly OUT of the slice" list is binding: no mobile/touch,
  share-card images, sounds, percentile comparisons, themes, analytics, meta
  tags, favicon, or README until the acceptance test passes.
- Render only real state: everything visible on screen is actual machine
  state. Never fake the sealed prediction — it must be committed before the
  keypress.
