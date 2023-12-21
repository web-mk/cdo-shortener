chrome.browserAction.onClicked.addListener(function(tab) {
  runScript();
});

chrome.commands.onCommand.addListener(function(command) {
  if (command === "shorten") {
    runScript();
  }
});

function runScript() {
  chrome.tabs.executeScript({
    file: 'contentScript.js'
  });
}

function setBadge(content, color) {
  chrome.browserAction.setBadgeBackgroundColor({ color })
  chrome.browserAction.setBadgeText ( { text: content } );
  setTimeout(function() {
    chrome.browserAction.setBadgeText ( { text: "" } );
  }, 3000)
}

chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.success) {
    setBadge("✔️", '#36ba42');
  } else {
    setBadge("X", '#FF0000');
  }
});
