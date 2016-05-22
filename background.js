chrome.browserAction.onClicked.addListener(function (tab) { //Fired when User Clicks ICON
    chrome.tabs.executeScript(null, {file: "inject.js", allFrames: true});
});