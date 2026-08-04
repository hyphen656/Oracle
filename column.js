/*
 * column.js: the notebook as six strata, and backoff as gravity.
 *
 * Not shown on the page — oracle.js is the code the lecture prints. This
 * file only draws what that predictor already knows.
 *
 * One band per run length: your last five presses at the top, down to no
 * context at all at the bottom. Every grain in a band is one observation —
 * one time you made that run and then pressed something. Grains sit left of
 * the centre line if you followed the run with D, right if you followed it
 * with F. So a band's width is how much the machine knows, and a band's
 * lopsidedness is what it knows.
 *
 * The guess falls down the centre. It passes straight through any band that
 * cannot hold it — never seen, seen only once, or split evenly, which leaves
 * the band symmetrical and the crack down the middle open — and comes to
 * rest on the first one that can. That fall is backoff, and it is the whole
 * algorithm: prefer the longest run you have seen often enough to trust.
 *
 * Deep bands are sparse and coarse; shallow ones are dense. Nothing encodes
 * that on purpose. Grains are one per observation at a shared size, so it
 * falls out of the counts: sand at the top, bedrock at the bottom.
 *
 * Colour lives in style.css, never here, so the drawing follows the theme
 * the instant it changes.
 */
(function () {
  'use strict';

  var GRAIN_MAX = 7;   // px — the same square as a tally pip
  var BAR_AT = 60;     // observations per side past which grains become a bar

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  /*
   * state = {
   *   path:    the run to read, oldest press first ('' for none)
   *   decider: the run the machine is betting from, or null for a coin flip
   *   guess:   'F', 'D', '?' — or null to draw no guess at all
   *   hit:     true, false, or null when the guess is still sealed
   * }
   */
  function render(host, oracle, state) {
    var depthMax = oracle.maxContext;
    var counts = oracle.counts;
    var path = state.path || '';
    var decider = (state.decider === null || state.decider === undefined)
      ? null : state.decider;
    var restAt = decider === null ? -1 : decider.length;

    /* ------------------------------------------------- read the notebook */
    // Deepest first, so the list reads top to bottom the way the guess falls.
    var rows = [], widest = 1;
    for (var d = depthMax; d >= 0; d--) {
      var reached = d <= path.length;      // you have not made d presses yet
      var ctx = reached ? path.slice(path.length - d) : null;
      var seen = reached ? counts.get(ctx) : null;
      var F = seen ? seen.F : 0, D = seen ? seen.D : 0;
      rows.push({ d: d, ctx: ctx, reached: reached, seen: !!seen, F: F, D: D });
      if (F > widest) widest = F;
      if (D > widest) widest = D;
    }

    // One grain is one observation at one size across the whole drawing, or
    // the comparison between bands would mean nothing. Past the point where
    // a grain would be thinner than a hairline they are already reading as a
    // solid bar, so we draw the bar and stop making thousands of nodes.
    var grainy = widest <= BAR_AT;
    var grainWidth = 'min(calc(' + (100 / widest).toFixed(3) + '% - 1px), ' +
      GRAIN_MAX + 'px)';

    function fill(side, count) {
      if (!count) return;
      if (!grainy) {
        var bar = el('span', 'grainbar');
        bar.style.width = (100 * count / widest).toFixed(2) + '%';
        side.append(bar);
        return;
      }
      for (var i = 0; i < count; i++) {
        var g = el('span', 'grain');
        g.style.width = grainWidth;
        side.append(g);
      }
    }

    /* ------------------------------------------------------------ draw */
    host.innerHTML = '';
    var grid = el('div', 'strata');

    // The key, on the same four columns as everything below it.
    var head = el('div', 'stratum is-head');
    head.append(el('span', 'st-lab'));
    var headField = el('span', 'st-field');
    var headD = el('span', 'st-side is-d');
    headD.append(el('em', null, 'D'));
    var headF = el('span', 'st-side is-f');
    headF.append(el('em', null, 'F'));
    headField.append(headD, el('span', 'st-mid'), headF);
    head.append(headField, el('span', 'st-n'), el('span', 'st-guess'));
    grid.append(head);

    rows.forEach(function (row) {
      var total = row.F + row.D;
      var isRest = row.d === restAt;
      var passed = restAt < 0 || row.d > restAt;   // the guess fell through

      var cls = 'stratum' +
        (isRest ? ' is-rest' : '') +
        (passed ? ' is-passed' : '') +
        (row.reached ? '' : ' is-void') +
        (row.seen ? '' : ' is-empty');
      var line = el('div', cls);

      line.append(el('span', 'st-lab', row.d === 0 ? 'ANY' : 'LAST ' + row.d));

      var field = el('span', 'st-field');
      var left = el('span', 'st-side is-d');
      var right = el('span', 'st-side is-f');
      fill(left, row.D);
      fill(right, row.F);

      // The chute: dashed while the guess is still falling, plain once it
      // has landed. Drawn on the centre line itself, so it lines up for free.
      var mid = el('span', 'st-mid' + (passed || isRest ? ' is-chute' : ''));
      if (isRest) mid.append(el('span', 'st-mark'));
      field.append(left, mid, right);
      line.append(field);

      // Evidence, or the reason this band could not hold the guess.
      var why;
      if (!row.reached) why = '—';
      else if (!row.seen) why = '—';
      else if (total < oracle.minEvidence) why = 'once';
      else if (row.F === row.D) why = row.F + '–' + row.D;
      else why = String(total);
      line.append(el('span', 'st-n', why));

      var guess = el('span', 'st-guess');
      if (isRest && state.guess) {
        guess.textContent = state.guess;
        guess.className = 'st-guess is-live' +
          (state.hit === true ? ' is-hit' : state.hit === false ? ' is-miss' : '');
      }
      line.append(guess);

      // The row itself is display:contents and generates no box, so the
      // hover target has to be the field.
      if (row.reached) {
        field.title = (row.ctx === '' ? 'any run' : row.ctx) + ' — seen ' +
          total + (total === 1 ? ' time' : ' times');
      }
      grid.append(line);
    });

    host.append(grid);

    /* ------------------------------------------- nothing to stand on yet */
    if (decider === null && state.guess) {
      var foot = el('p', 'st-foot');
      foot.append(document.createTextNode('Nothing solid enough to stand on. '));
      var g = el('span', 'st-guess is-live' +
        (state.hit === true ? ' is-hit' : state.hit === false ? ' is-miss' : ''),
        state.guess);
      foot.append(g, document.createTextNode(' — this one is a coin flip, and it counts against the machine like any other guess.'));
      host.append(foot);
    }

    /* --------------------------------------------------- for listeners */
    var said;
    if (!state.guess) said = 'No guess pending.';
    else if (decider === null) said = 'No run is solid enough yet, so the guess is a coin flip.';
    else said = 'The guess came to rest on ' + (restAt === 0 ? 'no context at all'
      : 'your last ' + restAt + (restAt === 1 ? ' press' : ' presses')) +
      ', ' + (path.length - restAt) + ' band' +
      (path.length - restAt === 1 ? '' : 's') + ' down from the longest.';
    host.setAttribute('role', 'img');
    host.setAttribute('aria-label',
      'The machine’s notebook as six bands, one per run length, widest where ' +
      'it knows most. ' + said);
  }

  window.oracleColumn = { render: render };
})();
