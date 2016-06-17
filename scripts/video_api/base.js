/**
 * This file is loaded when the extension is running on YouTube page.
 */



VideoApi = {};

VideoApi.videoElement = null;

VideoApi.videoContainerSelector = "";

/**
 * Function to retrieve parameters from url
 * 
 * @author Junkai Yang
 * @param  {String} name - parameter name
 * @param  {String} url
 * @returns {String}
 * @example
 * var param = gup("q", "www.google.com?q=12345"); // param = "12345"
 */
VideoApi.gup = function(name, url) {
    if (!url) url = location.href;
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regexS = "[\\?&]" + name + "=([^&#]*)";
    var regex = new RegExp(regexS);
    var results = regex.exec(url);
    return results == null ? null : results[1];
}


VideoApi.setVideoElement = function(){
    var videos = document.getElementsByTagName('video');
    if(videos.length)
        VideoApi.videoElement = videos[0];
};

/**
 * This function gets the video metadata
 * The return object is like:
 * {
 *      video: {
 *          title: {string}
 *          id: {string}
 *      },
 *      course: {
 *          title: {string}
 *          id: {string}
 *      }    
 * }
 * @return {object}
 * 
 */
VideoApi.getMetadata = function(){}


/**
 * Get the current time of the video
 * @return {number}
 */
VideoApi.getCurrentTime = function(){
    return this.videoElement.currentTime;
}

/**
 * Seek the video to the specified time
 * @param {number} time
 */
VideoApi.setCurrentTime = function(time){
    this.videoElement.currentTime = time;
}

/**
 * Play the video
 */
VideoApi.play = function(){
    this.videoElement.play();
 }

/**
 * Pause the video
 */
VideoApi.pause = function(){
    this.videoElement.pause();
}

/**
 * Loop the video
 * @param {number} start - start time of looping
 * @param {number} stop - end time of looping
 */
VideoApi.loop = function(start, stop){}


VideoApi.setVideoElement();

module.exports = VideoApi;