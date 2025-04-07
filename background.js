chrome.action.onClicked.addListener((tab) => {
  runScript(tab);
});

chrome.commands.onCommand.addListener((command, tab) => {
  if (command === "shorten") {
    runScript(tab);
  }
});

function runScript(tab) {
  chrome.scripting.executeScript({
    target: { tabId: tab.id },
    files: ['contentScript.js']
  });
}

function setBadge(content, color) {
  chrome.action.setBadgeBackgroundColor({ color });
  chrome.action.setBadgeText({ text: content });
  setTimeout(() => {
    chrome.action.setBadgeText({ text: "" });
  }, 3000);
}

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.success) {
    setBadge("✔️", '#36ba42');
  } else {
    setBadge("X", '#FF0000');
  }
});
