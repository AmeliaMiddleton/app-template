// "Customize this" button plus a dialog that invites visitors to request a bid
// or more information on geekamu.com. The dialog opens on its own once per
// visitor after `popupDelayMs`, and any time from the button.

// If the visitor is typing when the popup is due, try again after this long.
const TYPING_RETRY_MS = 10_000;
const TYPING_SELECTOR = 'input, textarea, select, [contenteditable]:not([contenteditable="false"])';

export function initRequestCta(info) {
  const dialog = document.getElementById('request-dialog');
  const openButton = document.getElementById('request-open');
  const closeButton = document.getElementById('request-close');
  const bidLink = document.getElementById('request-bid');
  const infoLink = document.getElementById('request-info');
  const audienceInputs = dialog.querySelectorAll('input[name="request-audience"]');
  const seenKey = `request-cta-seen:${info.slug}`;
  let returnFocusTo = null;
  let timer;

  function requestUrl(type) {
    const url = new URL(info.requestUrl);
    url.searchParams.set('app', info.slug);
    url.searchParams.set('type', type);
    const audience = dialog.querySelector('input[name="request-audience"]:checked')?.value;
    if (audience) url.searchParams.set('for', audience);
    return url.toString();
  }

  function updateLinks() {
    bidLink.href = requestUrl('bid');
    infoLink.href = requestUrl('info');
  }

  function open() {
    if (dialog.open) return;
    clearTimeout(timer);
    markSeen();
    returnFocusTo = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    dialog.showModal();
  }

  function scheduleAutoOpen(delayMs) {
    timer = setTimeout(() => {
      if (dialog.open) return;
      if (document.activeElement?.matches(TYPING_SELECTOR)) {
        scheduleAutoOpen(TYPING_RETRY_MS);
        return;
      }
      open();
    }, delayMs);
  }

  // Storage can be missing or blocked (private windows); the popup then just shows once per page load.
  function alreadySeen() {
    try {
      return localStorage.getItem(seenKey) !== null;
    } catch {
      return false;
    }
  }

  function markSeen() {
    try {
      localStorage.setItem(seenKey, new Date().toISOString());
    } catch {
      // Ignore: see alreadySeen().
    }
  }

  audienceInputs.forEach((input) => input.addEventListener('change', updateLinks));
  openButton.addEventListener('click', open);
  closeButton.addEventListener('click', () => dialog.close());
  // Runs for every close, including Esc.
  dialog.addEventListener('close', () => {
    returnFocusTo?.focus();
    returnFocusTo = null;
  });

  updateLinks();
  if (!alreadySeen()) scheduleAutoOpen(info.popupDelayMs);
}
