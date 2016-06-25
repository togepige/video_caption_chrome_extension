var VideoApi = require("./base.js");

VideoApi.videoContainerSelector = ".c-video";

VideoApi.getMetadata = function(){
    var $candidates = $('[data-click-value]');
    var courseId = '';
    var course = {};
    for(var i = 0 ; i < $candidates.length; i++){
        var data = JSON.parse($candidates.eq(i).attr('data-click-value'));
        if("open_course_id" in data){
            courseId = data["open_course_id"];
            break;
        }
    }

    $.ajax({
        url: 'https://api.coursera.org/api/courses.v1/' + courseId,
        type: 'GET',
        async: false
    }).done(function(response){
        course.id = courseId,
        course.title = response.elements[0].name;
    });
    
    var videoTitle = $('.c-video-title h1').text();
    var urlParams = location.href.split('/');
    var videoId = "";
    for(var i = 0; i < urlParams.length; i++){
        if(urlParams[i] == "lecture"){
            videoId = urlParams[i+1];
        }
    }

    var video = {id: videoId, title: videoTitle};

    // For test:
    var result  = {
        video: {
            id: 'ZQIoIZHdbTY',
            title: 'A5 Video 2'
        },
        course: null
    }
    return result;

    return {
        video: video,
        course: course
    };
}