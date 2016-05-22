

var extensionOrigin = 'chrome-extension://' + chrome.runtime.id;
if (!location.ancestorOrigins.contains(extensionOrigin)) {
    var iframe = document.createElement('iframe');

    
    // Must be declared at web_accessible_resources in manifest.json
    iframe.src = chrome.runtime.getURL('menu.html');
    iframe.onload = function(){
        // Add iframe event handler here and then can access the parent document.
        debugger;
        a = parent.document.getElementsByTagName("video");
    }
    // document.getElementById("theButton").addEventListener("click",
    //     function() {
    //         debugger;
    //         window.postMessage({ type: "FROM_PAGE", text: "Hello from the webpage!" }, "*");
    // }, false);
    // Some styles for a fancy sidebar
    iframe.style.cssText = 'position:fixed;top:0;left:0;display:block;' +
        'width:300px;height:100%;z-index:1000;';
    document.body.appendChild(iframe);
}


