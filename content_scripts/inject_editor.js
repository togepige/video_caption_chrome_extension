/*
* Content Script: inject_editor.js
* Author: Junkai Yang
*/
var extensionOrigin = 'chrome-extension://' + chrome.runtime.id;
var id = "video_caption_editor_" + chrome.runtime.id;

var ifWindowExists = function () {
    return document.getElementById(id) != null;
}


if (!location.ancestorOrigins.contains(extensionOrigin)) {
    // test if the menu window has already existed
    var topPos = ($("video").offset().top + $("video").height() + 10) + "px";
    var leftPos = $("video").offset().left + "px";
    var width = $("video").width() + "px";
    if (!ifWindowExists()) {
        iframe = document.createElement('iframe');
        // Must be declared at web_accessible_resources in manifest.json
        iframe.src = chrome.runtime.getURL('pages/editor.html');
        iframe.id = id;
        iframe.dataset.shown = false;
        iframe.style.cssText = 'position:absolute;top:' + topPos + ';left:' + leftPos + ';display:block;' + 
            'width: 820px;height:330px;z-index:2999999999;border:none;';
        document.body.appendChild(iframe);
    }else{
        iframe = document.getElementById(id);
    }
    
    // Show the window only when it is ready
    // if (iframe.dataset.shown == "false" && iframe.dataset.ready == "true") {
    //     window.parent.postMessage({ application: 'video_caption', type: "UI_SHOW", message: "" }, "*");
    // }else if(iframe.dataset.shown == "true"){
    //     window.parent.postMessage({ application: 'video_caption', type: "UI_HIDE", message: "" }, "*");
    // }
}
