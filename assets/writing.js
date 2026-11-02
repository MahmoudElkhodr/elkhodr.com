(function () {
  'use strict';
  document.querySelectorAll('.broadcast-card audio').forEach(function (player) {
    var source = player.querySelector('source');
    function unavailable() {
      var message = player.closest('.broadcast-card').querySelector('[data-audio-error]');
      if (message) message.hidden = false;
    }
    player.addEventListener('error', unavailable);
    if (source) source.addEventListener('error', unavailable);
  });
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
