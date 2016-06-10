/**
 * This file is a backgroun script which is responsible for the handling of voice command.
 * It will receive the message from content script and redirect the message to a native application. Then it wait for 
 * the native application to return the voice command string.
 * It uses the Chrome native message passing ability to communication with native application.
 * 
 * @author Junkai Yang
 */
var port = null;

function onNativeMessage(message) {
    console.log("native message received: " + message);
}

function onDisconnected() {
    console.log("Failed to connect: " + chrome.runtime.lastError.message);
    port = null;
}

function sendNativeMessage(text) {
    message = { "message":  text };
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
        //console.log(sender.tab ? "from a content script:" + sender.tab.url : "from the extension");
        if (request.application == "video_caption"){
            if(request.type == "ACTIVE_VOICE_COMMAND"){
                console.log("Connecting to native application");
                connect();  
                sendNativeMessage("ACTIVE");
                sendResponse({ success: true });
            }
        }
    });