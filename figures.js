/*
 * figures.js: the numbered figures, and the source listing.
 *
 * Every figure renders real state. With a session stored it is yours;
 * without one, the same real predictor is run over a sample sequence and
 * the figure says so. Nothing here invents numbers.
 *
 * A figure must never break the page: each renderer is called inside a
 * try/catch, and each degrades to an honest note rather than an error.
 */
(function () {
  'use strict';

  var primary = null;

  // A sample session, used only when the reader has not played. Typical of
  // the way people miss at randomness: too many alternations, few long runs.
  // Chosen to be representative rather than flattering: the real predictor
  // scores 64% on it, close to what a typical player produces.
  var SAMPLE = 'DFDFDFFDFFDFDDFDFDFFDDFDFDFDFDFDDFDDFDDFDFDFDDFDDF';

  function esc(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }
  function svg(tag, attrs) {
    var n = document.createElementNS('http://www.w3.org/2000/svg', tag);
    for (var k in attrs) if (attrs.hasOwnProperty(k)) n.setAttribute(k, attrs[k]);
    return n;
  }

  /* ------------------------------------------------------- the data */
  // Returns {history, hits, isSample}. When the reader has a session we
  // use it. Otherwise we run the real oracle over SAMPLE and label it.
  function sessionData() {
    if (primary && primary.oracle().history.length >= 6) {
      return {
        history: primary.oracle().history.slice(),
        hits: primary.hits().slice(),
        isSample: false
      };
    }
    var o = createOracle();
    var history = [], hits = [];
    SAMPLE.split('').forEach(function (k) {
      hits.push(o.predict().key === k);
      o.record(k);
      history.push(k);
    });
    return { history: history, hits: hits, isSample: true };
  }

  // Rebuild an oracle that has seen exactly the first `n` presses.
  function oracleAfter(history, n) {
    var o = createOracle();
    for (var i = 0; i < n; i++) o.record(history[i]);
    return o;
  }

  function sampleNote(box) {
    var p = el('p', 'fignote');
    p.innerHTML = '<b>Sample session.</b> You have not played yet, so this ' +
      'shows the same predictor run over an example sequence. Play above and ' +
      'this figure becomes yours.';
    box.append(p);
  }

  /* ------------------------------- Figure 2: your frequency notebook */
  function renderFrequency() {
    var box = document.getElementById('figure-frequency');
    if (!box) return;
    box.innerHTML = '';
    var data = sessionData();
    var o = oracleAfter(data.history, data.history.length);

    var rows = [];
    o.counts.forEach(function (seen, context) {
      var total = seen.F + seen.D;
      if (context.length > 3) return;            // longer runs are too sparse to read
      if (total < 2) return;
      rows.push({ context: context, F: seen.F, D: seen.D, total: total });
    });
    rows.sort(function (a, b) {
      return (b.total - a.total) || (a.context.length - b.context.length);
    });
    rows = rows.slice(0, 12);

    if (!rows.length) {
      box.append(el('p', 'empty', 'Play a few presses and your notebook appears here.'));
      return;
    }

    var table = el('div', 'freq');
    rows.forEach(function (r) {
      var pF = r.F / r.total;
      var lean = Math.abs(pF - 0.5) * 2;         // 0 = balanced, 1 = always one key
      var trusted = r.F !== r.D;

      table.append(el('span', 'freq-ctx', r.context === '' ? '(any)' : r.context));

      var track = el('span', 'freq-track');
      var bar = el('span', 'freq-bar');
      // Diverging from the centre: right of centre means you leaned toward F.
      var half = lean * 50;
      bar.style.left = (pF >= 0.5 ? 50 : 50 - half) + '%';
      bar.style.width = half + '%';
      if (!trusted) bar.classList.add('is-flat');
      track.append(el('span', 'freq-mid'), bar);
      table.append(track);

      var n = el('span', 'freq-n');
      n.textContent = r.F + 'F · ' + r.D + 'D';
      table.append(n);
    });

    var head = el('p', 'fighead');
    head.innerHTML = 'Each row is a run you produced. The bar leans right if ' +
      'you tended to follow it with <b>F</b>, left for <b>D</b>. A centred ' +
      'row told the machine nothing.';
    box.append(head, table);
    if (data.isSample) sampleNote(box);
  }

  /* ------------------------------ Figure 3: one prediction, step by step */
  function renderReplay() {
    var box = document.getElementById('figure-replay');
    if (!box) return;
    box.innerHTML = '';
    var data = sessionData();
    var history = data.history;

    // Find a press where backoff actually happened, so the walk is worth
    // showing. Search backwards for the most recent one.
    var pick = -1, decision = null;
    for (var i = history.length - 1; i >= 6; i--) {
      var o = oracleAfter(history, i);
      var d = o.predict();
      if (d.context !== null && d.context.length < o.maxContext) {
        pick = i; decision = d; break;
      }
    }
    if (pick < 0) {
      box.append(el('p', 'empty', 'Once the machine has enough of your ' +
        'presses to start shortening its question, this figure shows it happening.'));
      return;
    }

    var known = oracleAfter(history, pick);
    var recent = history.slice(Math.max(0, pick - 5), pick);
    var actual = history[pick];

    var head = el('p', 'fighead');
    head.innerHTML = 'At press ' + (pick + 1) + ' you had just pressed ' +
      '<b>' + recent.join(', ') + '</b>. Here is what the machine did with that.';
    box.append(head);

    var steps = el('div', 'steps');
    for (var n = known.maxContext; n >= 0; n--) {
      var ctx = history.slice(Math.max(0, pick - n), pick).join('');
      if (n > pick) continue;
      var seen = known.counts.get(ctx);
      var total = seen ? seen.F + seen.D : 0;

      var why, state;
      if (!seen) { why = 'never seen before'; state = 'skip'; }
      else if (total < known.minEvidence) { why = 'seen once, not evidence'; state = 'skip'; }
      else if (seen.F === seen.D) { why = 'split ' + seen.F + '–' + seen.D + ', no opinion'; state = 'skip'; }
      else {
        why = 'seen ' + total + ' times · ' + seen.F + 'F ' + seen.D + 'D → ' +
              (seen.F > seen.D ? 'F' : 'D');
        state = 'use';
      }

      var row = el('div', 'step is-' + state);
      row.append(el('span', 'step-ctx', ctx === '' ? '(any)' : ctx));
      row.append(el('span', 'step-why', why));
      steps.append(row);
      if (state === 'use') break;
    }
    box.append(steps);

    var out = el('p', 'stepout');
    out.innerHTML = 'It sealed <b>' + decision.key + '</b>. You pressed <b>' +
      actual + '</b>. ' + (decision.key === actual
        ? 'It had you.' : 'It missed.');
    box.append(out);
    if (data.isSample) sampleNote(box);
  }

  /* --------------------------------- Figure 5: how it learned you */
  function renderAccuracy() {
    var box = document.getElementById('figure-accuracy');
    if (!box) return;
    box.innerHTML = '';
    var data = sessionData();
    var hits = data.hits;
    if (hits.length < 6) {
      box.append(el('p', 'empty', 'Your running accuracy appears here once ' +
        'you have played a few presses.'));
      return;
    }

    var W = 640, H = 150, PAD = 28;
    var running = [], correct = 0;
    hits.forEach(function (h, i) {
      if (h) correct++;
      running.push(correct / (i + 1));
    });

    var s = svg('svg', {
      viewBox: '0 0 ' + W + ' ' + H, class: 'chart',
      role: 'img',
      'aria-label': 'Running accuracy across ' + hits.length + ' presses, ' +
        'ending at ' + Math.round(100 * running[running.length - 1]) + ' percent, ' +
        'against a 50 percent chance baseline.'
    });
    var x = function (i) { return PAD + (i / (hits.length - 1)) * (W - PAD * 2); };
    var y = function (v) { return H - PAD - v * (H - PAD * 2); };

    // Colour lives in style.css, not here, so the chart follows the theme
    // the instant it changes and never needs redrawing.
    s.append(svg('line', { x1: PAD, y1: y(0.5), x2: W - PAD, y2: y(0.5),
      class: 'chart-base' }));

    var d = running.map(function (v, i) {
      return (i ? 'L' : 'M') + x(i).toFixed(1) + ' ' + y(v).toFixed(1);
    }).join(' ');
    s.append(svg('path', { d: d, class: 'chart-line' }));

    // the tally, along the bottom: same language as the instrument
    hits.forEach(function (h, i) {
      s.append(svg('rect', {
        x: (x(i) - 2.5).toFixed(1), y: H - 13, width: 5, height: 5,
        class: h ? 'chart-pip is-hit' : 'chart-pip'
      }));
    });

    [[0.5, '50%'], [1, '100%']].forEach(function (t) {
      var lab = svg('text', { x: 2, y: y(t[0]) + 3, class: 'chart-lab' });
      lab.textContent = t[1];
      s.append(lab);
    });

    box.append(s);
    var cap = el('p', 'fighead');
    cap.innerHTML = 'Final accuracy <b>' +
      Math.round(100 * running[running.length - 1]) + '%</b> over ' +
      hits.length + ' presses. Early swings are noise: a handful of presses ' +
      'cannot tell you much. The line settles as the notebook fills.';
    box.append(cap);
    if (data.isSample) sampleNote(box);
  }

  /* ------------------------------------------- Figure 4: the source */
  // The promise on the page is that the code shown is the code running.
  // Fetching oracle.js keeps that literally true. Opened straight from
  // disk, though, browsers refuse to fetch a sibling file, so we fall
  // back to asking the running function for its own source text, still
  // the real thing, just without the file's header comment.
  function showSource() {
    var pre = document.getElementById('oracle-source');
    var note = document.getElementById('oracle-source-note');
    if (!pre) return;

    fetch('oracle.js')
      .then(function (r) { return r.ok ? r.text() : Promise.reject(); })
      .then(function (text) { render(text, false); })
      .catch(function () { render(createOracle.toString(), true); });

    function render(text, fromFunction) {
      var lines = text.replace(/\s+$/, '').split('\n');
      var html = lines.map(function (line, i) {
        return '<span class="ln">' + (i + 1) + '</span>' + esc(line);
      }).join('\n');
      pre.innerHTML = '<code>' + html + '</code>';

      var counter = document.getElementById('oracle-lines');
      if (counter) counter.textContent = lines.length;

      if (note) {
        note.innerHTML = fromFunction
          ? 'The predictor, read back from the function this page is running. ' +
            'Your browser blocks reading sibling files when a page is opened ' +
            'directly from disk, so this is the function\'s own source text ' +
            'rather than the whole file, the same code, without the header ' +
            'comment. Served over http it is fetched from <code>oracle.js</code>.'
          : 'The predictor, fetched from <code>oracle.js</code>, the same file ' +
            'this page loaded and ran while you were playing.';
      }
    }
  }

  /* ---------------------------------------------------------- public */
  var renderers = [renderFrequency, renderReplay, renderAccuracy];

  function refresh() {
    renderers.forEach(function (fn) {
      try { fn(); } catch (e) {
        // A broken figure must never take the lecture down with it.
        if (window.console) console.warn('figure failed', e);
      }
    });
  }

  function init(instrument) {
    primary = instrument;
    showSource();
    refresh();
  }

  window.oracleFigures = { init: init, refresh: refresh };
})();
