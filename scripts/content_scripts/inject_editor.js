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
    var leftPos = ($("video").offset().left - 50) + "px";
    var width = $("video").width() + "px";
    
    var $container = $('<div style="' + 'position:absolute;top:' + topPos + ';left:' + leftPos + ';display:block;' 
    + 'width: 890px;height:331px;z-index:2999999999;border:none;border-radius: 5px;"' + '></div>');
    //$container.css("position", absolute)
    
    var $dragHandler = $('<div id="video_caption_editor_drag"></div>');
    $container.hover(function(){
        $dragHandler.show();
    }, function(){
        $dragHandler.hide();
    })
    if (!ifWindowExists()) {
        iframe = document.createElement('iframe');
        // Must be declared at web_accessible_resources in manifest.json
        iframe.src = chrome.runtime.getURL('/html/editor.html');
        iframe.id = id;
        iframe.dataset.shown = false;
        // iframe.style.cssText = 'position:absolute;top:' + topPos + ';left:' + leftPos + ';display:block;' + 
        //     'width: 890px;height:331px;z-index:2999999999;border:none;border-radius: 5px;';
            
        iframe.style.cssText = "height:100%; width:100%;";
        //iframe.onload = addHandle(document.getElementsByTagName('body').item(0), window);
        $container.append($dragHandler);
        $container.append($(iframe));
        $('body').append($container);
        
        $container.draggable({ 
            handle: "#video_caption_editor_drag"
        });
        //document.body.appendChild(iframe);
        
    }else{
        iframe = document.getElementById(id);
    }
    //$( "#" + id ).draggable();

}
