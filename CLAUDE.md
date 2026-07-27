# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

"The Aaronson Oracle, taught" — an educational website built around an
interactive experiment that predicts whether the player will press F or D,
based on Scott Aaronson's classroom oracle. MISSION.md is the contract for
this project; read it before changing anything. Development proceeds slice
by slice per the plan in MISSION.md.

BRIEF.md is the retired brief for the original vertical slice — historical
context only, no longer binding. The current `index.html` is that original
slice and will be rebuilt per the mission.

## Hard constraints

- Plain HTML/CSS/JS across multiple files is fine, but no framework, no
  build step, no npm. There are no build, lint, or test commands — open
  `index.html` in a browser to run it.
- Render only real state: everything visible on screen is actual machine
  state. Never fake the sealed prediction — it must be committed before the
  keypress. The commit → press → reveal choreography is the centerpiece.
- No taunting copy; academic, honest tone throughout.
- Every historical/scientific claim must trace to a source in the research
  dossier (see MISSION.md slice 1).
