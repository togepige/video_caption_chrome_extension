chrome.browserAction.onClicked.addListener(function (tab) { //Fired when User Clicks ICON
    chrome.tabs.executeScript(null, {file: "content_scripts/inject.js", allFrames: true});
});