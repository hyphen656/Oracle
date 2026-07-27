# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

"The Aaronson Oracle, taught" — an educational website built around an
interactive experiment that predicts whether the player will press F or D,
based on Scott Aaronson's classroom oracle. MISSION.md is the contract for
this project; read it before changing anything. DOCTRINE.md is the
slice-by-slice execution plan derived from it — consult it for what to do
next and each slice's done-when criteria.

BRIEF.md is the retired brief for the original vertical slice — historical
context only, no longer binding. The current `index.html` is that original
slice and will be rebuilt per the mission.

## Hard constraints

The full list lives in MISSION.md ("Hard constraints") and DOCTRINE.md
("Cross-cutting doctrine") — those are authoritative; do not restate them
here, or the three files drift apart. The two that affect every command
you run:

- No framework, no build step, no npm. There are no build, lint, or test
  commands — open `index.html` in a browser to run it.
- Render only real state. Never fake the sealed prediction; it is
  committed before the keypress, always.
