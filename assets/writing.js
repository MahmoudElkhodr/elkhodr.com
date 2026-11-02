(function () {
  'use strict';
  var tools = document.querySelector('[data-archive-tools]');
  if (tools) {
    var rows = Array.from(document.querySelectorAll('[data-article]'));
    var search = document.getElementById('article-search');
    var topic = document.getElementById('article-topic');
    var buttons = Array.from(document.querySelectorAll('[data-origin-filter]'));
    var more = document.querySelector('[data-load-more]');
    var empty = document.querySelector('[data-empty]');
    var count = document.querySelector('[data-result-count]');
    var step = 6;
    var params = new URLSearchParams(window.location.search);
    var origin = ['site', 'external'].includes(params.get('source')) ? params.get('source') : 'all';
    var limit = step;
    search.value = params.get('q') || '';
    if (Array.from(topic.options).some(function (option) { return option.value === params.get('topic'); })) topic.value = params.get('topic');
    var entries = rows.map(function (row) {
      return { row: row, text: row.textContent.toLocaleLowerCase(), topics: JSON.parse(row.dataset.topics) };
    });
    function filter(updateUrl) {
      var query = search.value.trim().toLocaleLowerCase();
      var words = query.split(/\s+/).filter(Boolean);
      var matches = entries.filter(function (entry) {
        return (origin === 'all' || entry.row.dataset.origin === origin) &&
          (topic.value === 'all' || entry.topics.includes(topic.value)) &&
          words.every(function (word) { return entry.text.includes(word); });
      });
      rows.forEach(function (row) { row.hidden = true; });
      matches.slice(0, limit).forEach(function (entry) { entry.row.hidden = false; });
      buttons.forEach(function (button) { button.setAttribute('aria-pressed', String(button.dataset.originFilter === origin)); });
      count.textContent = matches.length ? 'Showing ' + Math.min(limit, matches.length) + ' of ' + matches.length + (matches.length === 1 ? ' article' : ' articles') : 'No articles match your filters';
      empty.hidden = matches.length !== 0;
      more.hidden = matches.length <= limit;
      more.textContent = 'Show more articles (' + Math.max(0, matches.length - limit) + ')';
      if (updateUrl) {
        var next = new URL(window.location.href);
        ['q', 'topic', 'source'].forEach(function (key) { next.searchParams.delete(key); });
        if (search.value.trim()) next.searchParams.set('q', search.value.trim());
        if (topic.value !== 'all') next.searchParams.set('topic', topic.value);
        if (origin !== 'all') next.searchParams.set('source', origin);
        try { window.history.replaceState(null, '', next); } catch (_) { /* The archive still works without history access. */ }
      }
      return matches;
    }
    function changed() { limit = step; filter(true); }
    search.addEventListener('input', changed);
    topic.addEventListener('change', changed);
    buttons.forEach(function (button) {
      button.addEventListener('click', function () { origin = button.dataset.originFilter; changed(); });
    });
    document.querySelectorAll('[data-reset]').forEach(function (button) {
      button.addEventListener('click', function () { search.value = ''; topic.value = 'all'; origin = 'all'; changed(); search.focus(); });
    });
    more.addEventListener('click', function () {
      var previous = limit;
      limit += step;
      var matches = filter(false);
      var firstNew = matches[previous];
      if (firstNew) firstNew.row.querySelector('h3 a').focus();
    });
    filter(false);
    tools.hidden = false;
  }
  var copy = document.querySelector('[data-copy-link]');
  if (copy) {
    copy.addEventListener('click', async function () {
      var status = document.querySelector('[data-copy-status]');
      try {
        await navigator.clipboard.writeText(copy.dataset.url);
        status.textContent = 'Link copied';
      } catch (_) {
        status.textContent = 'Copy this link: ' + copy.dataset.url;
      }
    });
  }
})();
