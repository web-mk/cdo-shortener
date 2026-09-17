(() => {
  const AID_REGEX = /aid(=|\/)(\d+)/;

  const report = (success) => chrome.runtime.sendMessage({ success });

  const canonical = document.querySelector('link[rel="canonical"]')?.href || window.location.href;
  const matches = canonical.match(AID_REGEX);
  if (!matches) {
    console.log("CDO Shortener: link does not seem to include an AID", canonical);
    report(false);
    return;
  }

  const path = `${window.location.origin}/${matches[2]}`;

  const onCopy = (event) => {
    event.preventDefault();
    event.clipboardData.clearData();
    event.clipboardData.setData("text/plain", path);
  };

  document.addEventListener("copy", onCopy, true);
  let copied = false;
  try {
    copied = document.execCommand("copy");
  } finally {
    document.removeEventListener("copy", onCopy, true);
  }

  if (copied) {
    console.log("CDO Shortener: copied", path);
    report(true);
    return;
  }

  // Fallback for pages where execCommand is unavailable.
  navigator.clipboard.writeText(path).then(
    () => { console.log("CDO Shortener: copied", path); report(true); },
    (err) => { console.warn("CDO Shortener: copy failed", err); report(false); }
  );
})();
