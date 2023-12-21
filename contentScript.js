
cdoCopyListener = (event) => {
  const AID_REGEX = /aid(\=|\/)(\d+)/;

  document.removeEventListener("copy", cdoCopyListener, true);
  event.preventDefault();
  let clipboardData = event.clipboardData;
  clipboardData.clearData();

  let link = document.querySelector('link[rel="canonical"]').href;
  const matches = link.match(AID_REGEX);
  if (!matches || !matches[2]) {
    console.log(`Link does not seem to include an AID`, link);
    chrome.runtime.sendMessage({success: false});
    return;
  }

  const aid = matches[2];

  const path = `${window.location.origin}/${aid}`;
  clipboardData.setData("text/plain", path);
  console.log('Path', path);
  chrome.runtime.sendMessage({success: true});
};
document.addEventListener("copy", cdoCopyListener, true);
document.execCommand("copy");
