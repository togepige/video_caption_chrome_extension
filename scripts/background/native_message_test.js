var port = null;

function onNativeMessage(message) {
    console.log("native message received: " + message);
}

function onDisconnected() {
    console.log("Failed to connect: " + chrome.runtime.lastError.message);
    port = null;
}

function sendNativeMessage() {
    message = { "text": "test message" };
    port.postMessage(message);
}


function connect() {
    var hostName = "com.jy.syr.chrome_native_message_passing";
    port = chrome.runtime.connectNative(hostName);
    port.onMessage.addListener(onNativeMessage);
    port.onDisconnect.addListener(onDisconnected);
}


setInterval(function () {
    debugger;
    connect();
    console.log("Sending native message");
    sendNativeMessage();
}, 2000)