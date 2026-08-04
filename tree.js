/*
 * tree.js: the notebook, drawn.
 *
 * Not shown on the page — the predictor in oracle.js is the code the
 * lecture prints. This file only draws what that predictor already knows.
 *
 * Every circle is one run of presses the machine has recorded. The root is
 * no context at all, and every step down the drawing is one press further
 * back in time, so the path from the root down to a circle spells a run,
 * most recent press first. Circle size and line weight are evidence: how
 * often that run has happened. Nothing is invented and nothing is scaled
 * for effect — the geometry is read straight out of oracle.counts.
 *
 * The lit path is your own last few presses. The ringed circle on it is the
 * one the machine is deciding from: the deepest run on your path it has
 * seen often enough to trust. The crossed circles below the ring are the
 * longer, thinner runs it tried first and would not bet on. That is backoff,
 * drawn rather than described.
 *
 * Colour lives in style.css, never here, so the drawing follows the theme
 * the instant it changes.
 */
(function () {
  'use strict';

  var NS = 'http://www.w3.org/2000/svg';

  var W = 640;        // viewBox width; the drawing scales to its container
  var PADX = 16;      // side margin, so the outermost leaves keep their ink
  var PADY = 18;      // top margin above the root
  var ROW = 42;       // one press further back
  var FOOT = 34;      // room under the deepest row for a guess label

  var RMIN = 1.7, RMAX = 8, RGHOST = 2.6;

  function make(tag, attrs) {
    var n = document.createElementNS(NS, tag);
    for (var k in attrs) if (attrs.hasOwnProperty(k)) n.setAttribute(k, attrs[k]);
    return n;
  }

  // Which column a run sits in. A context is oldest-first, so the last
  // character is the most recent press; going one row down prepends an
  // older press, which is exactly the left/right choice at each fork.
  // D takes the left branch and F the right, matching the two keys.
  function column(c) {
    var v = 0;
    for (var i = 0; i < c.length; i++) if (c.charAt(i) === 'F') v += 1 << i;
    return v;
  }

  /*
   * Positions are fixed by depth and column, not laid out from the data.
   * That is deliberate: a circle never moves once it appears, so a press
   * adds ink rather than rearranging the drawing. The gaps are meaningful —
   * they are the runs you have never produced.
   */
  function xAt(depth, col) {
    return PADX + (col + 0.5) * (W - 2 * PADX) / (1 << depth);
  }
  function yAt(depth) { return PADY + depth * ROW; }

  /*
   * state = {
   *   path:    the run to light, oldest press first ('' for none)
   *   decider: the run the machine is deciding from, or null for a coin flip
   *   guess:   'F', 'D', '?' — or null to draw no guess at all
   *   hit:     true, false, or null when the guess is still sealed
   * }
   */
  function render(host, oracle, state) {
    var depthMax = oracle.maxContext;
    var H = PADY + depthMax * ROW + FOOT;
    host.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
    while (host.firstChild) host.removeChild(host.firstChild);

    var counts = oracle.counts;
    function total(c) {
      var seen = counts.get(c);
      return seen ? seen.F + seen.D : 0;
    }

    // Everything is measured against the root, which has counted every
    // press ever made. So the drawing thins with depth by exactly as much
    // as the evidence does.
    var whole = Math.max(1, total(''));
    function radius(t) {
      return t ? RMIN + (RMAX - RMIN) * Math.sqrt(t / whole) : RGHOST;
    }
    function weight(t) { return 0.5 + 2.5 * Math.sqrt(t / whole); }
    function px(c) { return xAt(c.length, column(c)); }
    function py(c) { return yAt(c.length); }

    /* ------------------------------------------------- how far back */
    var axis = make('g', { class: 'tree-axis' });
    for (var d = 0; d <= depthMax; d++) {
      var mark = make('text', { x: 3, y: yAt(d) + 3 });
      mark.textContent = d;
      axis.appendChild(mark);
    }
    host.appendChild(axis);

    /* ------------------------------------------- what could have happened
       The lattice of every run the reader could produce, in the faintest
       ink the page has. It is drawn first and never grows, so what fills in
       on top of it is visibly a subset: the empty ghosts at the end of a
       session are the runs you never once made. Without it the drawing
       starts as an empty box and reads as broken rather than as unwritten. */
    var ghost = make('g', { class: 'tree-ghost' });
    for (var gd = 0; gd <= depthMax; gd++) {
      for (var gi = 0; gi < (1 << gd); gi++) {
        var gx = xAt(gd, gi), gy = yAt(gd);
        if (gd > 0) {
          ghost.appendChild(make('line', {
            x1: xAt(gd - 1, gi >> 1).toFixed(1), y1: yAt(gd - 1),
            x2: gx.toFixed(1), y2: gy
          }));
        }
        ghost.appendChild(make('circle', { cx: gx.toFixed(1), cy: gy, r: 1.2 }));
      }
    }
    host.appendChild(ghost);

    /* -------------------------------------------- what it has learned */
    // Edges first, then circles, so the joins sit under the ink.
    counts.forEach(function (seen, c) {
      if (!c) return;                       // the root has no run above it
      var up = c.slice(1);                  // drop the oldest press
      host.appendChild(make('line', {
        x1: px(up).toFixed(1), y1: py(up),
        x2: px(c).toFixed(1), y2: py(c),
        class: 'tree-edge',
        'stroke-width': weight(seen.F + seen.D).toFixed(2)
      }));
    });

    if (!counts.has('')) {
      // Before the first press the machine knows nothing at all, and the
      // drawing says so: one empty circle.
      host.appendChild(make('circle', {
        cx: xAt(0, 0), cy: yAt(0), r: RGHOST, class: 'tree-node is-new'
      }));
    }

    counts.forEach(function (seen, c) {
      var t = seen.F + seen.D;
      var dot = make('circle', {
        cx: px(c).toFixed(1), cy: py(c), r: radius(t).toFixed(2),
        class: 'tree-node'
      });
      // Evidence, not the answer: how often the run happened, never the
      // split. The split is what the machine is about to bet on.
      var title = document.createElementNS(NS, 'title');
      title.textContent = (c || 'any run') + ' — seen ' + t +
        (t === 1 ? ' time' : ' times');
      dot.appendChild(title);
      host.appendChild(dot);
    });

    /* ------------------------------------------------------ your path */
    // The run you have just made, from no context down to your last five
    // presses. Each step is one press earlier.
    var chain = [];
    var path = state.path || '';
    for (var i = 0; i <= path.length; i++) chain.push(path.slice(path.length - i));

    for (var j = 1; j < chain.length; j++) {
      var from = chain[j - 1], to = chain[j];
      host.appendChild(make('line', {
        x1: px(from).toFixed(1), y1: py(from),
        x2: px(to).toFixed(1), y2: py(to),
        class: 'tree-path' + (counts.has(to) ? '' : ' is-new')
      }));
    }

    chain.forEach(function (c) {
      var t = total(c);
      host.appendChild(make('circle', {
        cx: px(c).toFixed(1), cy: py(c), r: radius(t).toFixed(2),
        class: 'tree-live' + (t ? '' : ' is-new')
      }));
    });

    /* -------------------------------------------------------- backoff */
    var decider = (state.decider === null || state.decider === undefined)
      ? null : state.decider;

    if (decider !== null) {
      // The runs it asked about first and would not bet on: longer than the
      // one it settled for, and too thin to trust.
      chain.forEach(function (c) {
        if (c.length <= decider.length || !total(c)) return;
        var cx = px(c), cy = py(c), a = 3.4;
        host.appendChild(make('path', {
          d: 'M' + (cx - a).toFixed(1) + ' ' + (cy - a) +
             'L' + (cx + a).toFixed(1) + ' ' + (cy + a) +
             'M' + (cx + a).toFixed(1) + ' ' + (cy - a) +
             'L' + (cx - a).toFixed(1) + ' ' + (cy + a),
          class: 'tree-reject'
        }));
      });
    }

    /* ---------------------------------------------------- the guess */
    var anchor = decider === null ? '' : decider;
    var ax = px(anchor), ay = py(anchor), ar = radius(total(anchor));

    if (decider !== null && state.guess) {
      host.appendChild(make('circle', {
        cx: ax.toFixed(1), cy: ay, r: (ar + 4.5).toFixed(2), class: 'tree-ring'
      }));
    }

    if (state.guess) {
      // Lean the label inward when the deciding run sits near the right edge.
      var dir = ax > W * 0.62 ? -1 : 1;
      var end = dir > 0 ? 'start' : 'end';
      host.appendChild(make('line', {
        x1: (ax + dir * (ar + 5)).toFixed(1), y1: ay,
        x2: (ax + dir * (ar + 17)).toFixed(1), y2: ay,
        class: 'tree-lead'
      }));
      var gx = (ax + dir * (ar + 22)).toFixed(1);

      var glyph = make('text', {
        x: gx, y: ay + 5.5, 'text-anchor': end,
        class: 'tree-guess' +
          (state.hit === true ? ' is-hit' : state.hit === false ? ' is-miss' : '')
      });
      glyph.textContent = state.guess;
      host.appendChild(glyph);

      var lab = make('text', { x: gx, y: ay - 9, 'text-anchor': end, class: 'tree-lab' });
      lab.textContent = decider === null ? 'COIN' : 'GUESS';
      host.appendChild(lab);
    }

    /* --------------------------------------------------- for listeners */
    var said;
    if (!state.guess) said = 'No guess pending.';
    else if (decider === null) said = 'Nothing to go on yet, so the guess is a coin flip.';
    else said = 'Deciding from the run ' + (decider === '' ? 'of no context' : decider) +
      ', ' + (path.length - decider.length) + ' step' +
      (path.length - decider.length === 1 ? '' : 's') + ' back up your path.';
    host.setAttribute('aria-label',
      'The machine’s notebook, drawn as a tree. ' + counts.size +
      ' runs recorded. ' + said);
  }

  window.oracleTree = { render: render };
})();
