VideoApi = require('./base.js');

VideoApi.videoContainerSelector = ".html5-video-player";

VideoApi.getMetadata = function(){
    var videoId = VideoApi.gup("v", window.location.href);
    var videoTitle = $("#eow-title").text();
    return {
        video: {
            title: videoTitle,
            id: videoId
        },
        course: null
    };
}

module.exports = VideoApi;