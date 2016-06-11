/**
 * This file is a backgroun script which is responsible for the handling of voice command.
 * It will receive the message from content script and redirect the message to a native application. Then it wait for 
 * the native application to return the voice command string.
 * It uses the Chrome native message passing ability to communication with native application.
 * 
 * @author Junkai Yang
 */

var clients = [];

var port = null;

function onNativeMessage(message) {
    console.log("Voice command native script receives: " + message.command);
    if (message.command == "ready")
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, { application: 'video_caption', type: "VC_READY" });
        });
    else if (message.command == "action")
        chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
            chrome.tabs.sendMessage(tabs[0].id, { application: 'video_caption', type: "action", action: message.message });
        });

}

function onDisconnected() {
    console.log("Failed to connect: " + chrome.runtime.lastError.message);

    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        chrome.tabs.sendMessage(tabs[0].id, { application: 'video_caption', type: "VC_INIT_FAILED" }, function (response) {
            //console.log(response.farewell);
        });
    });
    port = null;
}

function sendNativeMessage(text) {
    message = { "message": text };
    port.postMessage(message);
}

function connect() {
    var hostName = "com.jy.syr.chrome_native_message_passing";
    port = chrome.runtime.connectNative(hostName);
    port.onMessage.addListener(onNativeMessage);
    port.onDisconnect.addListener(onDisconnected);
}

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        console.log(sender.tab ? "from a content script:" + sender.tab.url : "from the extension");
        if (request.application == "video_caption") {
            if (request.type == "VC_ACTIVE") {
                console.log("Connecting to native application");
                if (port) {
                    sendResponse({ success: true });
                }
                else {
                    sendResponse({ success: false });
                    connect();
                    sendNativeMessage("ACTIVE");
                }
            }
            else if (request.type == "VC_SPEAKING") {
                console.log("SENDING SPEAKING from bg");
                sendNativeMessage("SPEAKING");
            }
        }
    });