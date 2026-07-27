/*
 * figures.js — the numbered figures, and the source listing.
 *
 * Every figure renders real session state, or a clearly-labelled sample
 * when there is no session to draw on. Nothing here invents data.
 */
(function () {
  'use strict';

  var primary = null;

  function esc(s) {
    return s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }

  /* ------------------------------------------- Figure 4: the source */
  // The promise on the page is that the code shown is the code running.
  // Fetching oracle.js keeps that literally true. Opened straight from
  // disk, though, browsers refuse to fetch a sibling file, so we fall
  // back to asking the running function for its own source text — still
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
            'rather than the file — the same code, without the header comment. ' +
            'Served over http it is fetched from <code>oracle.js</code> instead.'
          : 'The predictor, fetched from <code>oracle.js</code> — the same file ' +
            'this page loaded and ran while you were playing.';
      }
    }
  }

  /* ---------------------------------------------------------- public */
  function init(instrument) {
    primary = instrument;
    showSource();
    refresh();
  }

  function refresh() {
    if (!primary) return;
    if (window.oracleFigureRenderers) {
      window.oracleFigureRenderers.forEach(function (fn) {
        try { fn(primary); } catch (e) { /* a figure must never break the page */ }
      });
    }
  }

  window.oracleFigures = { init: init, refresh: refresh };
})();
