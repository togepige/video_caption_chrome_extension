/*
* Background.js
* This script is the background script for extension, 
* It handle the extension button click event and also receive the message from menu window.
*
* Author: Junkai Yang
*/

chrome.browserAction.onClicked.addListener(function (tab) { //Fired when User Clicks ICON
    chrome.tabs.executeScript(null, { file: "scripts/content_scripts/inject_menu.js", allFrames: true });
});

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        console.log(sender.tab ? "from a content script:" + sender.tab.url : "from the extension");
        if (request.application == "video_caption"){
            if(request.type == "OPEN_EDITOR"){
                chrome.tabs.executeScript(null, { file: "scripts/content_scripts/inject_editor.js", allFrames: true });
                sendResponse({ success: true });
            }
        }
    });