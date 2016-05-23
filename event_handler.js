
function gup(name, url) {
    if (!url) url = location.href;
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regexS = "[\\?&]" + name + "=([^&#]*)";
    var regex = new RegExp(regexS);
    var results = regex.exec(url);
    return results == null ? null : results[1];
}
//gup('q', 'hxxp://example.com/?q=abc')

var showUI = function () {
    $("#" + chrome.runtime.id).velocity({ width: 340, height: 330 }, 250);
    $("#" + chrome.runtime.id)[0].dataset.shown = true;

}

var hideUI = function () {
    $("#" + chrome.runtime.id).velocity({ width: 0, height: 0 }, 250);
    $("#" + chrome.runtime.id)[0].dataset.shown = false;
}

var isVideoPage = function () { return $("video").length; }

var getVideoInfo = function () {
    var videoId = gup("v", window.location.href);
    var videoTitle = $("#eow-title").text();
    return {
        id: videoId,
        title: videoTitle
    };
}

window.addEventListener("message", function (event) {
    var origin = event.origin || event.originalEvent.origin; // For Chrome, the origin property is in the event.originalEvent object.

    if (event.data.application == "video_caption" && event.data.type == "UI_HIDE") {
        console.log("Content script received: " + event.data.type);
        hideUI();
    }
}, false);


window.addEventListener("message", function (event) {
    if (event.data.application == "video_caption" && event.data.type == "UI_SHOW") {
        console.log("Content script received: " + event.data.type);
        showUI();
    }
}, false);

window.addEventListener("message", function (event) {
    var frame = document.getElementById (chrome.runtime.id);
    if (event.data.application == "video_caption" && event.data.type == "UI_READY") {
        console.log("Content script received: " + event.data.type);
        if (!isVideoPage())
            frame.contentWindow.postMessage({ application: 'video_caption', type: "UI_INIT", message: JSON.stringify({ success: false, message: 'This page does not contain a video.' }) }, "*");
    }
});
