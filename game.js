/*
 * game.js: the instrument, as a component the page mounts twice.
 *
 * Not shown on the page. All the interesting logic is in oracle.js;
 * this file is the session, the keyboard and touch handling, and the
 * commit -> press -> reveal choreography from DESIGN.md.
 */
(function () {
  'use strict';

  var REVEAL_HOLD = 700;   // ms the prediction stays visible
  var STRUCK = 90;         // ms the key stays depressed
  var STORE = 'aaronson-oracle.v1.';

  var instruments = [];

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  function createInstrument(root, opts) {
    var target = opts.target || 50;
    var extendTo = opts.extendTo || 0;
    var id = opts.id;

    var oracle = createOracle();
    var sealed = null;         // the committed prediction, before the press
    var hits = [];             // one boolean per press: was it right?
    var done = false;
    var rearmTimer = null;

    /* ---------------------------------------------------------- markup */
    root.innerHTML = '';
    var head = el('div', 'inst-head');
    var label = el('span', 'eyebrow', opts.label);
    var count = el('span', 'count');
    head.append(label, count);

    var stage = el('div', 'stage');

    var plate = el('div', 'plate');
    var guess = el('span', 'guess');
    var cover = el('div', 'cover');
    cover.append(el('span', null, 'Sealed'));
    plate.append(guess, cover);

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

    var readout = el('p', 'readout');
    readout.setAttribute('role', 'status');
    readout.setAttribute('aria-live', 'polite');

    var endstate = el('div', 'endstate');
    endstate.hidden = true;

    var believe = el('p', 'believe');
    believe.innerHTML = opts.believe;

    stage.append(plate, keys, tally, readout, endstate, believe);
    root.append(head, stage);

    /* ------------------------------------------------------ persistence */
    function save() {
      try {
        localStorage.setItem(STORE + id, JSON.stringify({
          history: oracle.history.join(''),
          hits: hits.map(function (h) { return h ? 1 : 0; }).join(''),
          target: target
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

      target = data.target || target;
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
    }

    function correct() {
      return hits.filter(Boolean).length;
    }

    function renderCounters() {
      count.textContent = oracle.history.length + ' / ' + target;
      if (oracle.history.length === 0) {
        readout.textContent = opts.prompt;
      } else {
        readout.textContent = 'Predicted ' + correct() +
          ' of your ' + oracle.history.length + ' presses.';
      }
    }

    // Commit the guess for the NEXT press. This runs the instant a press is
    // scored, never on a timer, because otherwise a fast player could read the
    // revealed letter and press the opposite before the machine had
    // committed, which would make the seal a lie.
    function commit() {
      sealed = oracle.predict();
      plate.dataset.sealed = sealed.key;   // in the page, always current
    }

    // Close the cover over the already-committed guess.
    function arm() {
      if (done) return;
      guess.textContent = sealed.key;
      plate.classList.remove('is-open');
      cover.querySelector('span').textContent = 'Sealed';
    }

    /* ----------------------------------------------------------- press */
    function press(key) {
      if (done) return;

      var k = keyEls[key];
      k.classList.add('is-struck');
      setTimeout(function () { k.classList.remove('is-struck'); }, STRUCK);

      var revealed = sealed.key;
      var wasRight = revealed === key;
      hits.push(wasRight);
      oracle.record(key);
      addPip(wasRight);

      guess.textContent = revealed;
      plate.classList.add('is-open');
      renderCounters();
      readout.textContent = 'Sealed ' + revealed + '. You pressed ' + key +
        '. ' + (wasRight ? 'Hit' : 'Miss') + '. ' + correct() +
        ' of ' + oracle.history.length + '.';
      save();
      changed();

      if (oracle.history.length >= target) { finish(); return; }

      commit();   // before any next press can arrive
      clearTimeout(rearmTimer);
      rearmTimer = setTimeout(arm, REVEAL_HOLD);
    }

    /* ---------------------------------------------------------- finish */
    function finish() {
      done = true;
      clearTimeout(rearmTimer);
      keyEls.F.disabled = true;
      keyEls.D.disabled = true;
      cover.querySelector('span').textContent = 'Done';
      delete plate.dataset.sealed;

      var n = oracle.history.length;
      var pct = Math.round(100 * correct() / n);

      endstate.innerHTML = '';
      endstate.append(el('p', 'eyebrow', 'Session complete'));

      var bars = el('div', 'bars');
      [
        ['You', pct, pct + '%', 'you'],
        ['Chance', 50, '50%', 'ghost'],
        ["His class", 75, '70–80%', '']
      ].forEach(function (row) {
        bars.append(el('span', 'lab', row[0]));
        var track = el('span', 'track');
        var fill = el('span', 'fill' + (row[3] ? ' ' + row[3] : ''));
        fill.style.width = row[1] + '%';
        track.append(fill);
        bars.append(track);
        bars.append(el('span', 'num', row[2]));
      });
      endstate.append(bars);

      var note = el('p', 'endnote');
      note.innerHTML = opts.summary(pct, correct(), n);
      endstate.append(note);

      var actions = el('div', 'actions');
      if (extendTo && n < extendTo) {
        var more = el('button', 'btn', 'Keep going to ' + extendTo);
        more.type = 'button';
        more.addEventListener('click', function () {
          target = extendTo;
          done = false;
          keyEls.F.disabled = false;
          keyEls.D.disabled = false;
          endstate.hidden = true;
          renderCounters();
          commit(); arm();
        });
        actions.append(more);
      }
      var again = el('button', 'btn', 'Start over');
      again.type = 'button';
      again.addEventListener('click', reset);
      actions.append(again);
      endstate.append(actions);

      endstate.hidden = false;
      changed();
      readout.textContent = 'Session complete. The oracle predicted ' +
        correct() + ' of your ' + n + ' presses, or ' + pct + ' percent.';
    }

    function changed() {
      if (typeof opts.onChange === 'function') opts.onChange(api);
    }

    function reset() {
      try { localStorage.removeItem(STORE + id); } catch (e) {}
      oracle = createOracle();
      hits = [];
      done = false;
      target = opts.target || 50;
      tally.innerHTML = '';
      endstate.hidden = true;
      keyEls.F.disabled = false;
      keyEls.D.disabled = false;
      renderCounters();
      commit(); arm();
      changed();
    }

    /* ------------------------------------------------------------ boot */
    var hadSession = restore();
    renderCounters();
    if (hadSession && oracle.history.length >= target) { finish(); }
    else { commit(); arm(); }

    var api = {
      root: root,
      press: press,
      isDone: function () { return done; },
      oracle: function () { return oracle; },
      hits: function () { return hits; }
    };
    instruments.push(api);
    return api;
  }

  /* ---------------------------------------------------------- keyboard */
  // Two instruments share one keyboard. Keys go to whichever one you are
  // actually looking at: the most-visible unfinished instrument.
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
      if (inst.isDone()) return;
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
