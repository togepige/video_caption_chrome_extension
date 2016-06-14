/** 
 * @file Content Scripts: event_handler.js
 * 
 * @description
 * This scripts inject to page when user actives the extension.
 * It handle the event from editor or menu iframe.
 * The event is triggered by browser message passing
 * 
 * @author: Junkai Yang
 */

captions = [];
currentCaption = null;
TaskInterval = null;
VideoTasks = [];

VCcaption = null;

CaptionUtil = require("../caption.js");
UserUtil = require("../user.js");
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
function gup(name, url) {
    if (!url) url = location.href;
    name = name.replace(/[\[]/, "\\\[").replace(/[\]]/, "\\\]");
    var regexS = "[\\?&]" + name + "=([^&#]*)";
    var regex = new RegExp(regexS);
    var results = regex.exec(url);
    return results == null ? null : results[1];
}

/**
 * Show menu UI with animation
 * @author Junkai Yang 
 */
var showUI = function () {
    $("#" + chrome.runtime.id).velocity({ width: 340, height: 400 }, 250);
    $("#" + chrome.runtime.id)[0].dataset.shown = true;

}
/**
 * Hide menu UI with animation
 */
var hideUI = function () {
    $("#" + chrome.runtime.id).velocity({ width: 0, height: 0 }, 250);
    $("#" + chrome.runtime.id)[0].dataset.shown = false;
}

/**
 * Tell if the current page contains video element.
 * In future, we may improve this function to test if the page is in our support list. 
 * 
 * @author Junkai Yang
 * 
 * @returns {Boolean}
 */
var isVideoPage = function () { return $("video").length; }

/**
 * Get video information.
 * In future we need to retrieve information base on different video website(YouTube, etc..)
 * 
 * @author Junkai Yang
 * 
 * @returns {Object} - { title: '', id: '' }
 */
var getVideoInfo = function () {
    var videoId = gup("v", window.location.href);
    var videoTitle = $("#eow-title").text();
    return {
        id: videoId,
        title: videoTitle
    };
}
/**
 * Invoked by event handler when ui ready message is received.
 * Get the video information and retrieve the captions from caption server then pass them to the menu frame dom.
 * 
 * @author Junkai Yang
 * @param  {dom} frame - menu frame dom element
 * @param  {dom} videoElement - video dom element
 */
var initUI = function (frame, videoElement) {
    if (!isVideoPage())
        frame.contentWindow.postMessage({ application: 'video_caption', type: "UI_INIT", success: false, message: 'This page does not contain a video.' }, "*");
    else {
        var videoInfo = getVideoInfo();

        CaptionUtil.getCaptions(videoInfo.id).then(function (response) {
            captions = response;
            videoInfo.captionLength = captions.length;
            frame.contentWindow.postMessage(
                {
                    application: 'video_caption',
                    type: "UI_INIT",
                    success: true,
                    message: JSON.stringify(videoInfo)
                },
                "*");
        });
    }

    // Show UI if ready
    if (!frame.dataset.ready && frame.dataset.shown != "true") {
        showUI();
    }
    frame.dataset.ready = "true";
}

/**
 * There is a global interval to execute tasks periodically. 
 * Register a new task by using this function
 * 
 * @author Junkai Yang
 * @param  {function} task
 */
var registerVideoTask = function (task) {
    VideoTasks.push(task);
    if (!TaskInterval) {
        frame = document.getElementById(chrome.runtime.id);
        video = $("video")[0];
        // If the task interval is null then create a new interval to execute tasks periodically
        TaskInterval = window.setInterval(function () {
            // Caption changed
            var captionChanged = false;
            // get the video time
            var time = video.currentTime * 1000;

            // Set current caption
            if (currentCaption && time < currentCaption.end && time >= currentCaption.start) {/* do nothing if caption doesn't change*/ }
            else {
                captionChanged = true;
                for (var i = 0; i < captions.length; i++) {
                    var c = captions[i];
                    if (time < c.end && time >= c.start) {
                        currentCaption = c;
                        break;
                    }
                }
            }

            var videoInfo = {
                time: time,
                currentCaption: currentCaption,
                captionChanged: captionChanged
            }

            // Invoke each video task, pass the video information as function parameter
            for (var i = 0; i < VideoTasks.length; i++) {
                VideoTasks[i](videoInfo);
            }
        }, 500);
    }

}

/**
 * Invoked by event handler when load caption event is received.
 * It attach a caption dom element to the video element and change it dynamically.
 * 
 * @author Junkai Yang
 * @param  {dom} frameDom
 * @param  {dom} videoDom
 */
var loadCaption = function (frameDom, videoDom) {
    var $caption = $("<p></p>");
    $caption.css("position", "absolute");
    $caption.css("bottom", "45px");
    $caption.css("width", "100%");
    $caption.css("padding-left", "10%");
    $caption.css("padding-right", "10%")
    $caption.css('z-index', '10000');
    $caption.css("text-align", 'center');
    $caption.css('font-size', '22px');
    $caption.css('box-sizing', 'border-box');
    // Now it only support YouTube website so I just use the '.html5-video-player' selector to get the container of video in YouTube video page.
    $(".html5-video-player").append($caption);

    registerVideoTask(function (videoInfo) {
        if (videoInfo.captionChanged) {
            $caption.text(videoInfo.currentCaption.text);
        }
    });

}

/**
 * 
 * Open the caption editor for user when receive the open editor message.
 * It add a new iframe to current page and allow user to edit caption, make comments and do something else with the caption.
 * 
 * @author Junkai Yang
 * @param  {dom} frameDom
 * @param  {dom} videoDom
 */
var openEditor = function (frameDom, videoDom) {
    chrome.runtime.sendMessage({ application: "video_caption", type: "OPEN_EDITOR" }, function (response) {
        console.log(response.success);
    });

    //var editorDom = $("#video_caption_editor_" + chrome.runtime.id)[0];

    registerVideoTask(function (videoInfo) {
        if (videoInfo.captionChanged) {
            // send the video information to editor
            console.log("sending sync editor message");
            document.getElementById("video_caption_editor_" + chrome.runtime.id).contentWindow.postMessage({
                application: "video_caption", type: "SYNC_EDITOR", message: {
                    time: videoInfo.time,
                    captionId: currentCaption.id
                }
            }, "*");
        }
    });
}

/**
 * Send message to editor to update the caption
 * @param  {object} caption
 */
var updateCaption = function (caption) {
    var captions = [caption];
    captions = CaptionUtil.formatCaptionData(captions);

    document.getElementById("video_caption_editor_" + chrome.runtime.id).contentWindow.postMessage({
        application: "video_caption", type: "UPDATE_CAPTION", message: {
            caption: captions[0]
        }
    }, "*");
}

var correctionSubmitted = function (caption) {
    var captions = [caption];
    captions = CaptionUtil.formatCaptionData(captions);

    document.getElementById("video_caption_editor_" + chrome.runtime.id).contentWindow.postMessage({
        application: "video_caption", type: "CORRECTION_SUBMITTED", message: {
            caption: captions[0]
        }
    }, "*");
}

var commentSubmitted = function (caption) {
    var captions = [caption];
    captions = CaptionUtil.formatCaptionData(captions);

    document.getElementById("video_caption_editor_" + chrome.runtime.id).contentWindow.postMessage({
        application: "video_caption", type: "COMMENT_SUBMITTED", message: {
            caption: captions[0]
        }
    }, "*");
}

var editorDoAction = function (caption, type) {
    var mockObj = { created_by: UserUtil.currentUser.id };
    var found = false;
    switch (type) {
        case "inaccessible":
            for (var i = 0; i < caption.inaccessibles.length; i++) {
                if (caption.inaccessibles[i].created_by == UserUtil.currentUser.id) {
                    caption.inaccessibles.splice(i, 1);
                    found = true;
                    break;
                }
            }
            if (!found) {
                caption.inaccessibles.push(mockObj);
                CaptionUtil.doInaccessible(caption).done(function (response) {
                    updateCaption(caption);
                });
            } else {
                CaptionUtil.deleteInaccessible(caption).done(function (response) {
                    updateCaption(caption);
                });
            }
            break;
        case "bookmark":
            for (var i = 0; i < caption.bookmarks.length; i++) {
                if (caption.bookmarks[i].created_by == UserUtil.currentUser.id) {
                    caption.bookmarks.splice(i, 1);
                    found = true;
                    break;
                }
            }
            if (!found) {
                caption.bookmarks.push(mockObj);
                CaptionUtil.doBookmark(caption).done(function (response) {
                    updateCaption(caption);
                });

            } else {
                CaptionUtil.deleteBookmark(caption).done(function (response) {
                    updateCaption(caption);
                });
            }
            break;
        case "question":
            for (var i = 0; i < caption.questions.length; i++) {
                if (caption.questions[i].created_by == UserUtil.currentUser.id) {
                    caption.questions.splice(i, 1);
                    found = true;
                    break;
                }
            }
            if (!found) {
                caption.questions.push(mockObj);
                CaptionUtil.doQuestion(caption).done(function (response) {
                    updateCaption(caption);
                });

            } else {
                CaptionUtil.deleteQuestion(caption).done(function (response) {
                    updateCaption(caption);
                });
            }
            break;
        default:
            break;
    }
}

/**
 * Show header notification
 * 
 * @param  {object} options
 * @option example
 * {
 *      message: 'message text',
 *      type: 'warning',
 *      time: 3
 * }
 */
var showMessage = function (options) {
    var $container = $('#caption-notification-container');
    if (!$('#caption-notification-container').length) {
        $container = $('<div id="caption-notification-container">');
        $('body').append($container);
    }
    var element = '<div class="caption-notification {type} hidden">'
        + '<span clas="message">{message}</span>'
        + '<button class="close"><span aria-hidden="true">×</span></button>'
        + '</div>';

    var element = element.replace('{message}', options.message).replace('{type}', options.type);
    var $element = $(element)
    if (options.id) {
        $element.attr('id', options.id);
    }
    if (options.remove) {
        $('#' + options.remove).remove();
    }
    $element.find('.close').click(function () {
        $(this).closest('.caption-notification').remove();
    });

    $container.append($element);
    $element.slideDown("fast");
    if (options.time) {
        setTimeout(function () {
            $element.remove();
        }, options.time)
    }
}

/**
 * This function receives the message from the caption editor and redirect the message 
 * to background script to active the voice command application
 */
var activeVoiceCommand = function () {
    chrome.runtime.sendMessage({ application: "video_caption", type: "VC_ACTIVE" }, function (response) {
        if (response.success) {
            showMessage({ type: "warning", message: 'You can press the ctrl key to start speaking now...' });
            registerVCHotKey();
        }
        else
            showMessage({ type: "warning", message: 'Obtaining some resources, it may take few seconds...', id: 'vc-waiting' });

    });
}



// Add listerners to window message system
window.addEventListener("message", function (event) {
    var frame = null;
    var video = null;
    // Check the message sender
    if (event.data.application != 'video_caption')
        return;
    else {
        // Receive a message from our extension
        console.log("Content script received: " + event.data.type);
        frame = document.getElementById(chrome.runtime.id);
        video = $("video")[0];
    }

    switch (event.data.type) {
        case "UI_HIDE":
            hideUI();
            break;
        case "UI_SHOW":
            showUI();
            break;
        case "UI_READY":
            initUI(frame, video);
            break;
        case "LOAD_CAPTION":
            loadCaption(frame, video);
            break;
        case "OPEN_EDITOR":
            openEditor(frame, video);
            break;
        case "EDITOR_READY":
            var videoInfo = getVideoInfo();
            videoInfo.captions = captions;
            document.getElementById("video_caption_editor_" + chrome.runtime.id).contentWindow.postMessage({
                application: "video_caption", type: "EDITOR_INIT", message: videoInfo
            }, "*");
            break;
        case "EDITOR_DO_ACTION":
            editorDoAction(event.data.message.caption, event.data.message.type);
            break;
        case "ACTIVE_VOICE_COMMAND":
            activeVoiceCommand();
            break;
        case "DEACTIVE_VOICE_COMMAND":
            unbindVCHotkey();
            break;
        case "NOTIFY":
            showMessage(event.data.message);
            break;
        case "SUBMIT_CORRECTION":
            submitCorrection(event.data.message.caption, event.data.message.text);
            break;
        case "SUBMIT_COMMENT":
            submitComment(event.data.message.caption, event.data.message.text);
            break;
        case "PLAY_CAPTION":
            playCaption(event.data.message.caption);
            break;
        case "LOOP_CAPTION":
            break;
        default:
            break;
    }

}, false);

var submitCorrection = function (caption, correction) {
    CaptionUtil.submitCorrection(caption, correction).then(function (caption) {
        correctionSubmitted(caption);
    });
}

var submitComment = function (caption, comment) {
    CaptionUtil.submitComment(caption, comment).then(function (caption) {
        commentSubmitted(caption);

    });
}

var playCaption = function(caption){
    var start = caption.start / 1000;
    $('video')[0].currentTime = start;
    $('video')[0].play();
}

var controlTimeout;
var controlCancelTimeout;
/**
 * This function control the hotkey of voice command
 * It detect the ctrl press and up event to control the voice command input
 */
var registerVCHotKey = function () {
    $(document).on('keydown.video_caption', function (e) {
        if (e.ctrlKey && e.key == "Control")
            if (controlCancelTimeout != null) {
                clearTimeout(controlCancelTimeout);
                controlCancelTimeout = setTimeout(function () {
                    clearInterval(controlTimeout);
                    controlTimeout = null;
                }, 200);
            }

        if (e.ctrlKey && controlTimeout == null) {
            console.log('ctrl keydown');
            controlTimeout = setTimeout(function () {
                clearTimeout(controlCancelTimeout);
                controlCancelTimeout = null;
                activeCommandCapture();
            }, 100);
        }
    }).on('keyup.video_caption', function (e) {
        console.log('key up');
        if (e.key == "Control") {
            if (controlTimeout) {
                clearTimeout(controlTimeout);
                controlTimeout = null;
            }
            deActiveCommandCapture();
        }
    })
};

var unbindVCHotkey = function () {
    $(document).off("keyup.video_caption").off("keydown.video_caption");
}

function activeCommandCapture() {
    console.log("Active voice command capture");
    VCcaption = currentCaption;
    chrome.runtime.sendMessage({ application: "video_caption", type: "VC_SPEAKING" }, function (response) {
        //console.log(response.success);
    });
}

function deActiveCommandCapture() {
    console.log("Deactive voice command capture");
    chrome.runtime.sendMessage({ application: "video_caption", type: "VC_STOP_SPEAKING" }, function (response) {
        //console.log(response.success);
    });
}

chrome.runtime.onMessage.addListener(
    function (request, sender, sendResponse) {
        console.log(sender.tab ?
            "from a content script:" + sender.tab.url :
            "from the extension");
        if (request.application == "video_caption") {
            switch (request.type) {
                case "VC_READY":
                    showMessage({ type: "warning", message: 'You can press the ctrl key to start speaking now...', remove: 'vc-waiting' });
                    registerVCHotKey();
                    break;
                case "VC_ACTION":
                    console.log("Received action from VC: " + request.action);
                    var action = request.action.substr(7).replace(' ', '').replace(/\s/g, '').toLowerCase();
                    if (action == "makebookmark") {
                        editorDoAction(VCcaption, 'bookmark');
                        showMessage({ type: 'warning', message: 'Bookmark added successfully.', time: 2000 });
                    }
                    else if (action == "askquestion") {
                        editorDoAction(VCcaption, 'question');
                        showMessage({ type: 'warning', message: 'Question added successfully.', time: 2000 });
                    }
                    else if (action == "reporterror") {
                        editorDoAction(VCcaption, 'inaccessible');
                        showMessage({ type: 'warning', message: 'Error reported successfully.', time: 2000 });
                    }
                    break;
                default:
                    break;
            }
        }
        sendResponse({ success: true });
    });


