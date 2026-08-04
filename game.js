/*
 * game.js: the instrument, as a component the page mounts twice.
 *
 * Not shown on the page. All the interesting logic is in oracle.js, and
 * the drawing is in column.js; this file is the session, the keyboard and
 * touch handling, and the commit -> press -> reveal cycle from DESIGN.md.
 *
 * There is no session length. You press until you stop wanting to, which
 * means nothing here ever locks the keys, and the running score has to be
 * legible at every moment rather than announced at a finish line.
 */
(function () {
  'use strict';

  var REVEAL_HOLD = 700;   // ms the revealed guess stays up
  var STRUCK = 90;         // ms the key stays depressed
  var STORE = 'aaronson-oracle.v1.';

  var MILESTONE = 50;      // where the summary note appears; play continues
  var TALLY_KEEP = 50;     // most recent presses kept in the tally row
  var MIN_FOR_PCT = 10;    // under this a percentage is noise, not a score
  var MAX_RESTORE = 5000;  // a corrupt blob must not hang the boot replay

  var instruments = [];

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  // The last n presses, as a string. The same run oracle.js would look up.
  function contextOf(o, n) {
    var h = o.history;
    return h.slice(Math.max(0, h.length - n)).join('');
  }

  // Another instrument's stored score, for the rematch's comparison mark.
  // Returns null rather than a number when there is nothing worth comparing.
  function storedPercent(id) {
    try {
      var raw = localStorage.getItem(STORE + id);
      if (!raw) return null;
      var data = JSON.parse(raw);
      var hits = data && data.hits;
      if (typeof hits !== 'string' || hits.length < MIN_FOR_PCT) return null;
      var right = 0;
      for (var i = 0; i < hits.length; i++) if (hits.charAt(i) === '1') right++;
      return Math.round(100 * right / hits.length);
    } catch (e) { return null; }
  }

  function createInstrument(root, opts) {
    var id = opts.id;

    var oracle = createOracle();
    var sealed = null;         // the committed prediction, before the press
    var hits = [];             // one boolean per press: was it right?
    var noted = false;         // has the milestone note been written yet
    var rearmTimer = null;

    /* ---------------------------------------------------------- markup */
    root.innerHTML = '';
    var head = el('div', 'inst-head');
    var label = el('span', 'eyebrow', opts.label);
    var count = el('span', 'count');
    head.append(label, count);

    var stage = el('div', 'stage');

    // The drawing, and the commitment. The guess is really in the page while
    // you decide — data-sealed carries it, exactly as the note below the
    // instrument says — while the drawing shows where it came from without
    // spelling out the answer.
    var column = el('div', 'column');
    var board = el('div', 'board');
    var legend = el('p', 'column-cap', 'One band per run length, your last ' +
      'five presses at the top. Every grain is one time you made that run: ' +
      'left of the line you followed it with D, right with F. The guess falls ' +
      'down the middle until a band is solid enough to hold it.');
    column.append(board, legend);

    /* ----------------------------------------------------------- meter */
    var meter = el('div', 'meter');
    var mNum = el('div', 'm-num', '—');
    var mCap = el('div', 'm-cap', 'predicted');
    var mTrack = el('div', 'm-track');
    var mYou = el('div', 'm-you');

    function mark(cls, at, text) {
      var n = el('div', cls);
      n.style.setProperty('--at', at + '%');
      mTrack.append(n);
      if (text) {
        var lab = el('div', 'm-lab', text);
        lab.style.setProperty('--at', at + '%');
        mTrack.append(lab);
      }
      return n;
    }

    mTrack.append(mYou);
    // 70–80% is where Aaronson's class landed; 50% is not an achievement,
    // so it is a dashed null rather than a filled bar.
    var band = el('div', 'm-band');
    band.style.setProperty('--at', '70%');
    band.style.setProperty('--span', '10%');
    mTrack.append(band);
    var classLab = el('div', 'm-lab', 'his class');
    classLab.style.setProperty('--at', '75%');
    mTrack.append(classLab);
    mark('m-mark is-chance', 50, 'chance');

    var firstPct = opts.compare ? storedPercent(opts.compare) : null;
    if (firstPct !== null) mark('m-mark is-first', firstPct, 'round 1 · ' + firstPct + '%');

    meter.append(mNum, mCap, mTrack);
    meter.append(el('p', 'm-legend', 'Dashed line 50%, chance. Band 70–80%, ' +
      'what Aaronson\'s class managed.'));

    var rig = el('div', 'rig');
    rig.append(column, meter);

    var keys = el('div', 'keys');
    var keyEls = {};
    // D then F: the on-screen keys sit in the same order as the fingers
    // find them on the keyboard, so the touch targets and the home row
    // never disagree about which side is which.
    ['D', 'F'].forEach(function (k) {
      var b = el('button', 'key', k);
      b.type = 'button';
      b.setAttribute('aria-label', 'Press ' + k);
      b.addEventListener('click', function () { press(k); });
      keyEls[k] = b;
      keys.append(b);
    });

    var tally = el('div', 'tally');
    tally.setAttribute('aria-hidden', 'true');
    var tallyCap = el('p', 'tally-cap');

    var readout = el('p', 'readout');
    readout.setAttribute('role', 'status');
    readout.setAttribute('aria-live', 'polite');

    var endnote = el('p', 'endnote');
    endnote.hidden = true;

    var actions = el('div', 'actions');
    var again = el('button', 'btn', 'Start over');
    again.type = 'button';
    again.addEventListener('click', reset);
    actions.append(again);

    var believe = el('p', 'believe');
    believe.innerHTML = opts.believe;

    stage.append(rig, keys, tally, tallyCap, readout, endnote, actions, believe);
    root.append(head, stage);

    /* ------------------------------------------------------ persistence */
    function save() {
      try {
        localStorage.setItem(STORE + id, JSON.stringify({
          history: oracle.history.join(''),
          hits: hits.map(function (h) { return h ? 1 : 0; }).join('')
        }));
      } catch (e) { /* private browsing or quota: the session still works */ }
    }

    function restore() {
      var raw;
      try { raw = localStorage.getItem(STORE + id); } catch (e) { return false; }
      if (!raw) return false;
      var data;
      try { data = JSON.parse(raw); } catch (e) { return false; }
      if (!data || typeof data.history !== 'string') return false;
      if (data.history.length !== (data.hits || '').length) return false;
      if (!/^[FD]*$/.test(data.history)) return false;
      // Play is unbounded, so a hand-edited or corrupted blob could otherwise
      // hand us an arbitrarily long replay to run before first paint.
      if (data.history.length > MAX_RESTORE) return false;

      data.history.split('').forEach(function (k, i) {
        oracle.record(k);
        hits.push(data.hits[i] === '1');
        addPip(hits[hits.length - 1]);
      });
      return oracle.history.length > 0;
    }

    /* ------------------------------------------------------------ view */
    function addPip(hit) {
      var p = el('span', 'pip' + (hit ? ' is-hit' : ''));
      tally.append(p);
      // The row would otherwise grow without bound; past this many presses
      // it is the texture of recent play, and it says so.
      while (tally.childNodes.length > TALLY_KEEP) tally.removeChild(tally.firstChild);
    }

    function correct() {
      return hits.filter(Boolean).length;
    }

    function percent() {
      var n = oracle.history.length;
      return n ? Math.round(100 * correct() / n) : 0;
    }

    function renderCounters() {
      var n = oracle.history.length;
      count.textContent = n + (n === 1 ? ' press' : ' presses');

      var enough = n >= MIN_FOR_PCT;
      meter.classList.toggle('is-early', !enough);
      mNum.textContent = enough ? percent() + '%' : '—';
      mCap.textContent = enough ? 'predicted' : 'too few presses';
      mYou.style.setProperty('--at', (enough ? percent() : 0) + '%');

      tallyCap.textContent = !n ? '' : (n > TALLY_KEEP
        ? 'Your most recent ' + TALLY_KEEP + ' presses. Filled where it had you.'
        : 'One square per press. Filled where it had you.');

      if (n === 0) readout.textContent = opts.prompt;
    }

    function draw(state) {
      try { oracleColumn.render(board, oracle, state); }
      catch (e) { if (window.console) console.warn('column failed', e); }
    }

    // Commit the guess for the NEXT press. This runs the instant a press is
    // scored, never on a timer, because otherwise a fast player could read the
    // revealed letter and press the opposite before the machine had
    // committed, which would make the seal a lie.
    function commit() {
      sealed = oracle.predict();
      board.dataset.sealed = sealed.key;   // in the page, always current
    }

    // Show the bands the guess just fell through and the one it is resting
    // on, with the guess itself still sealed. Everything drawn here is true;
    // the one thing withheld is the letter, which is the answer.
    function arm() {
      draw({
        path: contextOf(oracle, oracle.maxContext),
        decider: sealed.context,
        guess: '?',
        hit: null
      });
    }

    // The educational framing, once, at the milestone. It does not stop
    // play and it does not repeat: the keys stay live straight through it.
    function maybeNote() {
      if (noted || oracle.history.length < MILESTONE) return;
      noted = true;
      endnote.innerHTML = opts.summary(percent(), correct(), oracle.history.length);
      endnote.hidden = false;
    }

    /* ----------------------------------------------------------- press */
    function press(key) {
      var k = keyEls[key];
      k.classList.add('is-struck');
      setTimeout(function () { k.classList.remove('is-struck'); }, STRUCK);

      var revealed = sealed.key;
      var from = sealed.context;
      // sealed.seen is the live tally inside the notebook, and recording
      // this press is about to change it. Take the numbers it actually
      // decided on before that happens.
      var split = sealed.seen ? sealed.seen.F + 'F ' + sealed.seen.D + 'D' : null;
      var asked = contextOf(oracle, oracle.maxContext);

      var wasRight = revealed === key;
      hits.push(wasRight);
      oracle.record(key);
      addPip(wasRight);

      // Hold the band it decided from, now that the notebook has your press
      // in it. The fall moves when the next guess is armed, not before.
      draw({ path: asked, decider: from, guess: revealed, hit: wasRight });

      renderCounters();
      readout.textContent = 'Sealed ' + revealed + ' ' + (from === null
        ? 'on a coin flip'
        : 'from ' + (from === '' ? 'no context' : from) + ' (' + split + ')') +
        '. You pressed ' + key + '. ' + (wasRight ? 'Hit' : 'Miss') + '. ' +
        correct() + ' of ' + oracle.history.length + '.';
      save();
      maybeNote();
      changed();

      commit();   // before any next press can arrive
      clearTimeout(rearmTimer);
      rearmTimer = setTimeout(arm, REVEAL_HOLD);
    }

    function changed() {
      if (typeof opts.onChange === 'function') opts.onChange(api);
    }

    function reset() {
      try { localStorage.removeItem(STORE + id); } catch (e) {}
      clearTimeout(rearmTimer);
      oracle = createOracle();
      hits = [];
      noted = false;
      tally.innerHTML = '';
      endnote.hidden = true;
      renderCounters();
      commit(); arm();
      changed();
    }

    /* ------------------------------------------------------------ boot */
    restore();
    renderCounters();
    if (oracle.history.length >= MILESTONE) maybeNote();
    commit(); arm();

    var api = {
      root: root,
      press: press,
      isDone: function () { return false; },   // nothing ever finishes now
      oracle: function () { return oracle; },
      hits: function () { return hits; }
    };
    instruments.push(api);
    return api;
  }

  /* ---------------------------------------------------------- keyboard */
  // Two instruments share one keyboard. Keys go to whichever one you are
  // actually looking at: the most-visible one.
  function visibleFraction(node) {
    var r = node.getBoundingClientRect();
    var vh = window.innerHeight || document.documentElement.clientHeight;
    var visible = Math.min(r.bottom, vh) - Math.max(r.top, 0);
    return Math.max(0, visible) / Math.max(1, Math.min(r.height, vh));
  }

  document.addEventListener('keydown', function (e) {
    if (e.repeat || e.metaKey || e.ctrlKey || e.altKey) return;
    var k = e.key.toLowerCase();
    if (k !== 'f' && k !== 'd') return;

    var best = null, bestSeen = 0.15;
    instruments.forEach(function (inst) {
      var seen = visibleFraction(inst.root);
      if (seen > bestSeen) { bestSeen = seen; best = inst; }
    });
    if (!best) return;
    e.preventDefault();
    best.press(k.toUpperCase());
  });

  window.createInstrument = createInstrument;
  window.oracleInstruments = instruments;
})();
