# DOSSIER — sources for the lecture

Slice 1 deliverable. **Nothing goes into the site that isn't in this file.**
Every entry gives a full citation, a working link, the exact quote we
intend to use, and the claim it supports. Where a quote is reproduced from
a secondary source because the original is paywalled, that is stated.

Constraint on this dossier: built without a copy of the book and without
institutional access. Everything below is openly reachable. Two originals
(Hagelbarger 1956, in IRE Transactions; the print edition of *Democritus*)
were **not** read directly — see how each is handled.

---

## A. Aaronson — the primary source

### A1. The classroom experiment

**Citation.** Scott Aaronson, *Quantum Computing Since Democritus*,
Cambridge University Press, 2013 — Chapter 18, "Free Will." The chapter
grew from his lecture notes, which are free online and carry the same
passage.

**Link.** https://www.scottaaronson.com/democritus/lec18.html

**Quote (verbatim, complete).**

> In a class I taught at Berkeley, I did an experiment where I wrote a
> simple little program that would let people type either "f" or "d" and
> would predict which key they were going to push next. It's actually very
> easy to write a program that will make the right prediction about 70% of
> the time. Most people don't really know how to type randomly. They'll
> have too many alternations and so on. There will be all sorts of
> patterns, so you just have to build some sort of probabilistic model.
> Even a very crude one will do well. I couldn't even beat my own program,
> knowing exactly how it worked. I challenged people to try this and the
> program was getting between 70% and 80% prediction rates. Then, we found
> one student that the program predicted exactly 50% of the time. We asked
> him what his secret was and he responded that he "just used his free
> will."

**Supports —** and this single passage carries most of the site:

| Claim | Phrase |
|---|---|
| The origin story | "In a class I taught at Berkeley…" |
| The headline figure | "about 70% of the time" |
| The class range (a baseline on the instrument) | "between 70% and 80% prediction rates" |
| Why a crude model suffices | "Even a very crude one will do well." |
| **The rematch thesis** | "I couldn't even beat my own program, knowing exactly how it worked." |
| The student | "just used his free will" |
| Ties the oracle to the psychology literature | "They'll have too many alternations and so on." |

That last row matters more than it looks: Aaronson independently names
*alternation* as the tell, which is the exact bias the randomness
literature documents (C1). The lecture can join those two without
speculating.

### A2. How his program worked — personal communication

**Citation.** Scott Aaronson, personal communication to Nick Merrill,
reproduced in the `aaronson-oracle` README. **This is not a published
source.** Cite it as personal communication quoted in that repository, or
not at all.

**Link.** https://github.com/elsehow/aaronson-oracle

**Framing in the README (verbatim).** "I asked Scott if he remembered what
he did, and he said,"

**Quote (verbatim).**

> As it happens, I do remember!  All the basic program did was to examine
> all 32 possible 5-grams (sequences of five f's and d's), and see which
> 5-grams were more likely to be followed by f or by d in the user's
> previous keypresses, and then use that to generate a prediction based on
> the most recent 5-gram.  There might have been various enhancements on
> top of that -- e.g., if you're not taking enough data for 5-grams to be
> useful, then you can also look at 4-grams and 3-grams, and you can also
> "seed" the predictor with 5-gram data from the previous users (hoping
> that the next user will be pretty similar).

**Supports.** The algorithm description, and the fact that backing off to
shorter contexts is Aaronson's own suggestion rather than our invention.

**Two cautions carried into slice 3 (see F3, F4).** He says the enhancements
"might have been" present — that is not a claim that they were. And his
context is **five** presses (32 five-grams), where our retired slice used
**four**. Both differences must be stated, not smoothed over.

---

## B. The lineage — Bell Labs, 1953–56

### B1. Shannon's Mind-Reading Machine

**Citation.** Claude E. Shannon, "A Mind-Reading (?) Machine," Bell
Laboratories Memorandum, March 18, 1953. Reprinted in *Claude Elwood
Shannon: Collected Papers*, IEEE Press, 1993, pp. 688–690.

**Link (open, full scan read directly).**
https://glaschick.de/rclab/_media/shannon/shannon_mindreadingmachine_searchable.pdf

**Quotes (verbatim).**

Opening — establishes that Hagelbarger came first, and the Poe connection:

> This machine is a somewhat simplified model of a machine designed by
> D. W. Hagelbarger. It plays what is essentially the old game of matching
> pennies or "odds and evens." This game has been discussed from the game
> theoretic angle by von Neumann and Morgenstern, and from the
> psychological point of view by Edgar Allen Poe in the "The Purloined
> Letter." Oddly enough, the machine is aimed more nearly at Poe's method
> of play than von Neumann's.

The strategy — note how closely this prefigures our own predictor:

> Basically, the machine looks for certain types of patterns in the
> behavior of its human opponent. If it can find these patterns it
> remembers them and assumes that the player will follow the patterns the
> next time the same situation arises. The machine also contains a random
> element. Until patterns have been found, or if an assumed pattern is not
> repeated at least twice by the player, the machine chooses its move at
> random.

**The single most important quote in the dossier** — Shannon stating our
thesis in 1953, thirty years before Aaronson would restate it:

> A mathematical analysis of the strategy used in this machine shows that
> it can be beaten by the best possible play in the ratio 3:1. To do this
> it is necessary to keep track of the contents of all the memory cells in
> the machine. The player should repeat a behavior pattern twice, and then
> when the machine is prepared to follow this pattern the player should
> alter it. It is extremely difficult to carry out this program mentally
> because of the amount of memory and calculation necessary.

On the random element — a lovely concrete detail, and quietly profound
(the machine's randomness is harvested from human timing jitter):

> Basically, therefore, the randomness of the device depends on the
> uncertainty of the interval between moves, the variation of which due to
> human variability is typically large compared to the tenth of a second
> period of the commutator.

**Supports.** The lineage opening; that the machine is beatable in
principle but not mentally (pairs with A1's "I couldn't even beat my own
program"); the technical contrast with our model — Shannon tracks
**win/lose and same/different**, eight states, *not* an n-gram of the
player's raw choices. The lecture must not blur these into "the same
algorithm."

**Absent from the memo, deliberately noted.** No win rate against humans,
and no mention of the two machines playing each other. Both are sourced
elsewhere or not at all (B2, B4, F2).

### B2. Hagelbarger's SEER — and the machines playing each other

**Citation.** D. W. Hagelbarger, "SEER, A SEquence Extrapolating Robot,"
*IRE Transactions on Electronic Computers*, EC-5(1), 1956, pp. 1–7.
**Original not accessed** (IEEE paywall). All quotes below are reproduced
**as quoted in Breazu et al. 2020 (B3)**, which marks its quotations
explicitly. Cite as: Hagelbarger 1956, qtd. in Breazu et al. 2020.

**The head-to-head, in Hagelbarger's own words:**

> After much discussion an umpire machine was built which connected the
> two machines, and they were allowed to play several thousand games. The
> agility of the small machine triumphed, and it beat the larger one about
> 55-45.

On Shannon's version:

> C.E. Shannon has built a machine using about half as many relays which
> follows a simplified version of the same strategy.

SEER's mechanism — its state is three bits, giving eight states:

> The "state of play" of the machine is determined by three things:

whether it won or lost the play before last (W/L), whether it played same
or different last time (S/D), whether it won or lost last play (W/L) —
eight states, labelled WSW through LDL. Per state it stores whether to
play same or different, and whether it has been winning. The counter
detail is worth quoting for the lecture:

> The a) part of the memory state is controlled by a reversible counter
> which starts at zero and can count up to +3 and down to -3. […] The
> stops at +3 and -3 in effect make the machine forget ancient history.

**Supports.** That the two machines really were played against each other
and Shannon's smaller one won ~55–45; that SEER came first; the "forgetting
ancient history" idea, which is a genuinely nice contrast with our model
(ours never forgets).

### B3. The modern replication

**Citation.** Macarie Breazu, Daniel Volovici, Daniel I. Morariu, Radu G.
Crețulescu, "On Hagelbarger's and Shannon's matching pennies playing
machines," *International Journal of Advanced Statistics and IT&C for
Economics and Life Sciences*, Vol. X, no. 1 (December 2020), pp. 56–66.
DOI: 10.2478/ijasitels-2020-0003.

**Link (open PDF, read directly).**
https://sciendo.com/pdf/10.2478/ijasitels-2020-0003

**Quote (abstract, verbatim).**

> In the 1950s, Hagelbarger's Sequence Extrapolating Robot (SEER) and
> Shannon's Mind-Reading Machine (MRM) were the state-of-the-art research
> results in playing the well-known "matching pennies" game.

**Their result.** They reimplemented both machines in C++ and played them
against each other over ten games. Averages (SEER–MRM): **23.1–26.9** after
50 plays, **44.2–55.8** after 100, **87.2–112.8** after 200. On the match
to Hagelbarger's figure:

> our average result (for 100 play games) of 55.8-44.2 in favour of MRM
> looks remarkable.

They also note SEER does better early and fades: "for the beginning of the
games, SEER has some chances against MRM but, in long enough games, loses
in all cases."

**Supports.** A 2020 replication of a 1956 result — a genuinely satisfying
beat for the lineage section, and a rare case where a piece of computing
folklore survives being checked.

### B4. A human's account, and the only machine-vs-human number

**Citation.** William Poundstone, "How I Beat the Mind-Reading Machine,"
30 July 2015.

**Link.** http://william-poundstone.com/blog/2015/7/30/how-i-beat-the-mind-reading-machine

**Content — read carefully, this is easy to get wrong.** Poundstone did
**not** play Shannon's original machine. In his words:

> I saw Shannon's machine at the storage facility of the MIT Museum. I
> wasn't able to play it, of course. That would have been almost impious,
> for it recorded a final score: Player 3507. Machine 5010.

So 3507–5010 is the machine's **final lifetime score**, accumulated across
everyone who ever played it — the machine on ~58.8%. It is not a controlled
study and not Poundstone's own game. He also notes there are "many
anecdotes but no published statistics on how well humans fared against the
machine."

On the learning curve (quoted exactly; the typo is in the source, so
paraphrase rather than quote in the lecture):

> It takes about 25 moves for the machine to learn your play well enough to
> being predicting effectively.

On beating it — this is against a modern implementation, not the relay
machine:

> I found I did better when I tried to ignore the feedback, and better yet
> when I made sure I couldn't see the bars.

**Supports.** The only concrete human-vs-machine tally we have, correctly
framed as a lifetime exhibit counter. The ~25-move learning curve
independently justifies our 50-press session. And his method is exactly
what the rematch section needs: he won by *refusing his own feedback loop*
and suppressing instinct — which confirms the lesson rather than
contradicting it.

---

## C. Why humans lose — the randomness literature

### C1. The core source

**Citation.** Maja Guseva, Carsten Bogler, Carsten Allefeld, John-Dylan
Haynes, "Instruction effects on randomness in sequence generation,"
*Frontiers in Psychology*, 14:1113654, 2023. DOI:
10.3389/fpsyg.2023.1113654. Open access.

**Link.** https://www.frontiersin.org/journals/psychology/articles/10.3389/fpsyg.2023.1113654/full

**Quotes (verbatim).**

> A common finding of RSG studies is that people are bad randomizers

> Another pervasive bias is the avoidance of repetitions, also called
> *negative recency effect* or *alternation bias*, where an excess of
> alternations and suppression of repeating choices can be observed

> Interestingly, if randomness is not overtly requested but rather an
> implicit requirement, as in competitive games such as matching pennies,
> randomness seems to be higher

**Supports.** The central psychological claim, and the definition of
alternation bias **on the generation side** (most of the literature measures
judgment instead — see F1). This is the source the "what it says about us"
section rests on.

**The third quote is a gift and should be used.** Our site *explicitly*
asks you to be random, which the literature says is the **worse** condition.
Shannon's matching pennies is the implicit condition, where people do
better. That means the two experiments on this page are not equivalent, and
saying so is both more honest and more interesting than pretending they are.

### C2. Human sequences have hidden structure

**Citation.** Marc-Andre Schulz, Barbara Schmalbach, Peter Brugger, Karsten
Witt, "Analysing humanly generated random number sequences: A pattern-based
approach," *PLOS ONE* 7(7): e41531, 2012. DOI: 10.1371/journal.pone.0041531.
Open access.

**Link.** https://journals.plos.org/plosone/article?id=10.1371/journal.pone.0041531

**Quotes (verbatim).**

> Earlier research showed that human beings are far from perfect in
> producing random sequences.

> They typically avoid number repetitions and systematically deviate from
> mathematical randomness.

> These results emphasize the idea of a complex hidden Markov rule system
> that underlies humanly generated random number sequences.

**Supports.** That the structure a predictor exploits is real and
Markov-shaped — which is precisely what our n-gram model assumes. Good
grounding for "how it works, actually."

**⚠ Do not use their 45% prediction figure.** That study uses nine-option
digit sequences, where chance is 11%. Placing "45%" anywhere near our binary
70% would be a straightforward misrepresentation. The general claims above
are safe; the number is not.

### C3–C4. The perception side (use with care)

Two open sources establishing that people also *misjudge* randomness, with
concrete numbers — but for **judgment**, not generation:

- Giorgio Gronchi et al., "Modeling the overalternating bias with an
  asymmetric entropy measure," *Frontiers in Psychology*, 7:1027, 2016.
  DOI: 10.3389/fpsyg.2016.01027. Reports that sequences rated most random
  "ranged from a P(A) = 0.57 to 0.8" against a true-random 0.5, and that
  "people identify randomness with an excess of alternation between symbol
  types compared to the normative criterion employed."
- Stian Reimers, Chris Donkin, Mike E. Le Pelley, "Perceptions of
  randomness in binary sequences: Normative, heuristic, or both?"
  *Cognition*, 172, 2018, pp. 11–25. DOI: 10.1016/j.cognition.2017.11.002
  (https://doi.org/10.1016/j.cognition.2017.11.002). Open accepted version,
  linked directly because the repository's landing page is unreliable:
  https://openaccess.city.ac.uk/id/eprint/18626/1/Coin%20Tossing%20R3%20Clean.pdf
  People "erroneously rate sequences with less internal structure or order
  (such as HTTHT) as more probable than sequences containing more structure
  or order (such as HHHHH)."

**Supports.** A one-paragraph aside that the bias runs both ways: we
*produce* too many alternations and we also *believe* too many alternations
look random. If either is cited, the sentence must say "judge" or "rate,"
never "produce."

---

## D. Prior art — what already exists

- **elsehow/aaronson-oracle** (BSD) — the best-known web implementation,
  and the source of A2. https://github.com/elsehow/aaronson-oracle —
  implements "the no-enhancements version," i.e. pure 5-gram with no
  backoff. Demo: `people.ischool.berkeley.edu/~nick/aaronson-oracle`.
- Other ports: `chronologos/aaronson-oracle-golang`, `Sarkosos/aaronson-oracle`,
  an `aaronson-oracle` crate on crates.io.
**Aaronson endorses that implementation by name — verified.** In his reply
to Roger Penrose (https://scottaaronson.blog/?p=2756) he links Nick
Merrill's version and writes:

> So give it a try! Are you ready to test your free will, your Penrosian
> non-computational powers, your brain's sensitivity to amplified quantum
> fluctuations, against the Aaronson Oracle?

Two things follow. **He uses the name "the Aaronson Oracle" himself**, so
our title is his own coinage rather than something we pinned on him. And he
actively invites people to play web implementations — which bears on the
publish-slice question of whether to write to him, and means our existence
is in keeping with how he has treated the demo.

**We acknowledge this prior art explicitly.** Our contribution is not the
idea or the algorithm; it is the teaching.

---

## E. Word budget for the lecture

Set now, before any prose exists, because sprawl is slice 4's only real
failure mode. Target **~3,500 words**.

| Section | Words |
|---|---|
| The story (lineage-first) | 900 |
| How it works, in English | 600 |
| How it works, actually | 450 |
| Read the machine (annotations) | 350 |
| What it says about us | 600 |
| The rematch | 350 |
| Instrument microcopy + "why believe this" | 250 |
| References | — |

---

## F. Flagged — unsupported, do not publish as-is

**F1. "People alternate about 60% of the time."** Widely repeated and
almost certainly true, but every open source reachable without institutional
access reports that number for *judging* sequences, not *generating* them
(C3–C4). The generation-side sources (C1, C2) are qualitative.
**Resolution:** we don't need it. The site compares each reader's own
alternation rate to **0.5**, which is arithmetic, not a claim requiring a
citation. State the bias qualitatively via C1 and show the reader their own
number. Do not print "60%."

**F2. Shannon's machine's win rate against humans.** The memo gives none;
Poundstone confirms "no published statistics." Only the MIT Museum's
cumulative counter (3507/5010) exists, and it must be labelled as a museum
tally across all visitors.

**F3. Whether Aaronson's program used backoff.** He wrote "There might have
been various enhancements." That is not a claim that there were. Our
predictor's backoff is **our** design choice, informed by his suggestion.
Never describe it as a reconstruction of his program.

**F4. Context length.** Aaronson describes **five** presses of context (32
five-grams). The retired slice used **four** (16 contexts). Slice 3 decides;
slice 4 states the difference plainly in "where our version departs from
his." Recommendation: match him at five presses of context, so the site
teaches the thing it names — and note that this makes the sparse-data
problem worse, which is exactly why our backoff thresholds on sample size.

**F5. RESOLVED.** The typo ("to being predicting") is genuinely in
Poundstone's text — paraphrase the 25-move figure rather than quoting it.
Resolving this also caught a factual error in an earlier draft of this
dossier: Poundstone never played Shannon's machine. See B4.

**F6. RESOLVED.** Verified — Aaronson links the web implementation and uses
the name "the Aaronson Oracle" himself. See section D.

**F7. The book's page number.** We cite the free lecture notes, which carry
the passage. We have not seen the print edition and must not invent a page
citation for it.

---

# G. Images (added slice 7)

Every photograph on the site is a file committed to this repository under
`img/`, never hotlinked. Each one is listed here with its licence, author
and source, on the same rule as every other claim: if it is not in the
dossier, it does not ship.

**G1. Scott Aaronson, portrait.** `img/scott-aaronson.jpg`
Original: `Scott_Aaronson_retouched.jpg` on Wikimedia Commons. Photograph
by Easy n; retouched (cropped, levels, red-eye) by Dcoetzee, 19 January
2011. **Public domain.** Resized to 700px wide.
https://commons.wikimedia.org/wiki/File:Scott_Aaronson_retouched.jpg
Used beside the *Quantum Computing Since Democritus* quotation.

**G2. Nimwit, c. 1953.** `img/shannon-nimwit.jpg`
Claude Shannon's Nim-playing machine, MIT Museum, Cambridge MA.
Photograph by Daderot. **CC0 1.0.** Resized to 1200px wide.
https://commons.wikimedia.org/wiki/File:Nimwit_by_Claude_Shannon,_Nim-playing_machine,_c._1953,_view_1_-_MIT_Museum_-_Cambridge,_MA_-_DSC09104.jpg
Its front panel carries two columns of lamps labelled PLAYER WINS and
MACHINE WINS, which is why it is on this page. **It is not the
mind-reading machine**, and the caption says so in its first clause.

**G3. Theseus, 1952.** `img/shannon-theseus.jpg`
Shannon's maze and mechanical mouse, MIT Museum, Cambridge MA.
Photograph by Daderot, 4 August 2013. **CC0 1.0.** Resized to 1200px wide.
https://commons.wikimedia.org/wiki/File:Theseus_Maze_by_Claude_Shannon,_1952_-_MIT_Museum_-_DSC03702.JPG

**G4. What does not exist.** Searched Wikimedia Commons for a photograph
of Shannon's mind-reading machine and of Hagelbarger's SEER. **Neither is
available under any licence we can use.** Poundstone's blog (ref 4) carries
a photograph of the mind-reading machine, but it is his. Both machines are
therefore drawn or described on the page, never substituted for. If a
usable photograph of either surfaces later, it belongs here first.

**G5. Drawn plates.** The five SVG plates are original to this page and
carry no third-party rights. Each illustrates a claim already sourced
above: the eight situations and the ±3 counter stops from B/ref 2, the
umpire match and its 2020 replication from ref 3, and the alternation-bias
peak from ref 9. The alternation curve is explicitly captioned as an
illustration of the reported peak, **not** a plot of published data, since
we did not obtain the underlying measurements.
