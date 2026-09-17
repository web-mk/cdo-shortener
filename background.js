chrome.action.onClicked.addListener((tab) => {
  runScript(tab);
});

chrome.commands.onCommand.addListener(async (command, tab) => {
  if (command !== "shorten") return;
  // `tab` is passed by Chrome 96+, but fall back to a query just in case.
  runScript(tab ?? (await getActiveTab()));
});

async function getActiveTab() {
  const [tab] = await chrome.tabs.query({ active: true, lastFocusedWindow: true });
  return tab;
}

async function runScript(tab) {
  if (!tab?.id) {
    setBadge("X", "#FF0000");
    return;
  }
  try {
    await chrome.scripting.executeScript({
      target: { tabId: tab.id },
      files: ["contentScript.js"]
    });
  } catch (err) {
    // chrome://, the Web Store, and other restricted pages block injection.
    console.warn("CDO Shortener: could not run on this page", err);
    setBadge("X", "#FF0000");
  }
}

function setBadge(content, color) {
  chrome.action.setBadgeBackgroundColor({ color });
  chrome.action.setBadgeText({ text: content });
  setTimeout(() => {
    chrome.action.setBadgeText({ text: "" });
  }, 3000);
}

chrome.runtime.onMessage.addListener((request) => {
  if (request.success) {
    setBadge("✔️", "#36ba42");
  } else {
    setBadge("X", "#FF0000");
  }
});
