/**
 * This file is a content script to detect the voice command event. It will send message to background script to active voice capture when user long press 
 * the ctrl key for 2 seconds.
 * 
 * @author Junkai Yang
 */
var controlTimeout;
var controlCancelTimeout;


$(document).on('keydown', function (e) {

    if (controlCancelTimeout != null) {
        clearTimeout(controlCancelTimeout);
        controlCancelTimeout = setTimeout(function () {
            clearInterval(controlTimeout);
            controlTimeout = null;
        }, 200);
    }

    if (e.ctrlKey && controlTimeout == null) {
        console.log('ctrl keydown');
        called = false;
        controlTimeout = setTimeout(function () {
            clearTimeout(controlCancelTimeout);
            controlCancelTimeout = null;
            activeCommandCapture();
        }, 2000);
    }
});


function activeCommandCapture() {
    console.log("Active voice command capture");
    chrome.runtime.sendMessage({ application: "video_caption", type: "ACTIVE_VOICE_COMMAND" }, function (response) {
        //console.log(response.success);
    });
}