chrome.browserAction.onClicked.addListener(function (tab) { //Fired when User Clicks ICON
    chrome.tabs.executeScript(null, { file: "content_scripts/inject.js", allFrames: true });
});

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        console.log(sender.tab ? "from a content script:" + sender.tab.url : "from the extension");
        if (request.application == "video_caption"){
            if(request.type == "OPEN_EDITOR"){
                chrome.tabs.executeScript(null, { file: "content_scripts/inject_editor.js", allFrames: true });
                sendResponse({ success: true });
            }
        }
    });