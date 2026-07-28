/*
 * The Aaronson Oracle: the predictor.
 *
 * This is the whole machine. It is printed on the page you are reading,
 * and it is the same file the page is running: there is no second copy.
 *
 * The idea: remember every short run of presses you have made, and what
 * you did next each time. To guess your next press, find the longest
 * recent run it has seen often enough to trust, and answer with whatever
 * you usually did after it.
 */

function createOracle({ maxContext = 5, minEvidence = 2 } = {}) {
  // A tally per context. The key is a run of presses like "FDDF";
  // the value counts what you pressed next. "" is the empty context,
  // which simply counts every press you have ever made.
  const counts = new Map();
  const history = [];

  // The last n presses, as a string. n = 0 gives "".
  const contextOf = (n) => history.slice(history.length - n).join('');

  function predict() {
    // Longest run first, then shorter ones. This is "backing off":
    // a specific match is better evidence, but a rare one is not.
    for (let n = Math.min(maxContext, history.length); n >= 0; n--) {
      const context = contextOf(n);
      const seen = counts.get(context);
      if (!seen) continue;                            // never happened
      if (seen.F + seen.D < minEvidence) continue;    // too rare to trust
      if (seen.F === seen.D) continue;                // no opinion
      return { key: seen.F > seen.D ? 'F' : 'D', context, seen };
    }
    // Nothing to go on yet, so it is genuinely a coin flip, and it
    // still counts against the machine's score.
    return { key: Math.random() < 0.5 ? 'F' : 'D', context: null, seen: null };
  }

  function record(key) {
    // One press teaches every context length at once: what followed
    // the last 5 presses, the last 4, and so on down to none.
    for (let n = Math.min(maxContext, history.length); n >= 0; n--) {
      const context = contextOf(n);
      const seen = counts.get(context) || { F: 0, D: 0 };
      seen[key]++;
      counts.set(context, seen);
    }
    history.push(key);
  }

  return { predict, record, counts, history, maxContext, minEvidence };
}
