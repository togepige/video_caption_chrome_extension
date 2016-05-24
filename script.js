var f = function(){};
var captions = [];

$(document).ready(function () {
    $("#close-button-wrapper").click(function () {
        window.parent.postMessage({ application: 'video_caption', type: "UI_HIDE", message: "" }, "*");
    });
    
    window.addEventListener("message", function (event) {
        var origin = event.origin || event.originalEvent.origin; // For Chrome, the origin property is in the event.originalEvent object.
            
        if (event.data.application == "video_caption" && event.data.type == "UI_INIT") {
            init(event);
        }
    }, false);
    
    $("#load-caption").click(function(){
        window.parent.postMessage({ application: 'video_caption', type: "LOAD_CAPTION", message: "" }, "*");
    });
    
    window.parent.postMessage({ application: 'video_caption', type: "UI_READY", message: "" }, "*");
});


var init = function(event){
    console.log("Iframe received: " + event.data.type);
    var data = JSON.parse(event.data.message);
    $("#loading").remove();
    $("#content-container").removeClass("hidden");
    if(!event.data.success){
        $("#warning-container").removeClass("hidden").text(message.message);
    }
    else{
        console.log(event.data.message);
        $("#video-info-container").removeClass("hidden");
        $("#video_title").text(data.title);
        $("#video_id").text(data.id);
        if(!data.captionLength)
            $("#loading-message").text("Cannot find captions on the server.");
        else {
            $("#loading-message").hide();
            $("#control-container").removeClass("hidden");
        }
    }
       
}