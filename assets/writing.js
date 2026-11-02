(function () {
  'use strict';
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
