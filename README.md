# The Aaronson Oracle

An interactive lesson in human predictability. A program guesses whether you
will press **F** or **D** — before you press it — and is right far more often
than chance. You play first; the page then explains exactly how it works, in
plain English, then in real notation, then by printing its own source.

The experiment is Scott Aaronson's classroom oracle, described in *Quantum
Computing Since Democritus*. The lineage behind it is Claude Shannon's
mind-reading machine and David Hagelbarger's SEER at Bell Labs. This is a
teaching version of their work and is not affiliated with any of them.

## Running it

Open `index.html` in a browser. That is the entire toolchain.

There is no framework, no npm, no build step, and no backend. Nothing about a
visitor leaves their browser: a session is held in `localStorage` and nowhere
else. There are no analytics.

## Deploying

Any static host serves this as-is. On Vercel: import the repository, framework
preset **Other**, no build command, output directory the repository root.

One post-deploy edit: `og:image` and `twitter:image` in `index.html` are
relative, and most social platforms require an absolute URL. Point them at
`https://your-domain/og-card.png` once the domain is known.

## Files

| File | What it is |
| --- | --- |
| `index.html` | The page: the instrument, then the lecture, then the rematch |
| `style.css` | The design system, light and dark |
| `oracle.js` | The predictor, and only the predictor — an n-gram frequency model with backoff. This file is fetched and printed on the page, so the code a reader sees is the code the page runs |
| `column.js` | The instrument's drawing: six bands, one per run length, deepest at the top. A grain is one observation — left of the centre line for D, right for F — so a band's width is how much the machine knows and its lopsidedness is what it knows. The guess falls down the centre until a band is solid enough to hold it, which is backoff drawn as gravity |
| `tree.js` | The same counts as a tree, one circle per run, used by Figure 3 in the lecture where the full portrait of the model belongs |
| `game.js` | The instrument: endless play, keyboard and touch input, the running meter, the commit → press → reveal cycle. Mounted twice |
| `figures.js` | The interactive figures, drawn from the reader's own session |
| `verify-seal.html` | A test harness that plays hundreds of presses and checks the sealed prediction was committed before every one of them |
| `fonts/`, `img/` | Self-hosted assets. Nothing is hotlinked |

## Licensing

- **Code** — `oracle.js`, `column.js`, `tree.js`, `game.js`, `figures.js`,
  `style.css`, the markup of `index.html` and `verify-seal.html`: MIT, see
  [LICENSE](LICENSE).
- **Prose, figures and the social card**: [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).
- **Photographs** — Nimwit and Theseus (MIT Museum) by Daderot, CC0 1.0; Scott
  Aaronson by Easy n, retouched by Dcoetzee, public domain. All via Wikimedia
  Commons, credited in the page footer.
- **Fonts** — Source Serif 4 (© Adobe, Reserved Font Name 'Source') and IBM
  Plex Mono (© IBM Corp., Reserved Font Name 'Plex'), both under the SIL Open
  Font License 1.1. The upstream licence files are included verbatim as
  [`fonts/LICENSE-SourceSerif4.txt`](fonts/LICENSE-SourceSerif4.txt) and
  [`fonts/LICENSE-IBMPlexMono.txt`](fonts/LICENSE-IBMPlexMono.txt), as the OFL
  requires of anyone redistributing the font files.

Every historical and scientific claim on the page traces to a linked source in
the references section.
