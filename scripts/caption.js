// main.js
var moment = require("moment");
var CaptionUtil = {};
CaptionUtil.server = "https://datascience.ischool.syr.edu/";
CaptionUtil.getCaptions = function (videoId) {
    var c = [];
    var p = new Promise(function (resolve, reject) {
        $.getJSON('https://datascience.ischool.syr.edu/api/caption?hash=' + videoId).done(function (response) {
            for (var i = 0; i < response.length; i++) {
                for (var j = 0; j < response[i].comments.length; j++) {
                    response[i].comments[j].startTime = response[i].start / 1000;
                    response[i].comments[j].endTime = response[i].end / 1000;
                }

                for (var j = 0; j < response[i].bookmarks.length; j++) {
                    response[i].bookmarks[j].startTime = response[i].start / 1000;
                    response[i].bookmarks[j].endTime = response[i].end / 1000;
                }

                for (var j = 0; j < response[i].questions.length; j++) {
                    response[i].questions[j].startTime = response[i].start / 1000;
                    response[i].questions[j].endTime = response[i].end / 1000;
                }
                for (var j = 0; j < response[i].inaccessibles.length; j++) {
                    response[i].inaccessibles[j].startTime = response[i].start / 1000;
                    response[i].inaccessibles[j].endTime = response[i].end / 1000;
                }

                for (var j = 0; j < response[i].modifications.length; j++) {
                    response[i].modifications[j].startTime = response[i].start / 1000;
                    response[i].modifications[j].endTime = response[i].end / 1000;
                }

                $.each(response[i].comments, function (data) {
                    this.fromInstructor = this.user.type == 500;
                });

                if (!response[i].modifications.length) {
                    response[i].original = true;
                    response[i].correction = response[i].text;
                }
                else {
                    response[i].original = false;
                    response[i].correction = response[i].modifications[response[i].modifications.length - 1].text;

                }
            }
            c = CaptionUtil.formatCaptionData(response);
            resolve(c);
        });
    });
    return p;
}


CaptionUtil.formatCaptionData = function(captions){
    var currentUserId = localStorage.getItem('user.id');
    $.map(captions, function (caption) {
        var msToTime = function (s) {
            function addZ(n) {
                return (n<10? '0':'') + n;
            }
            function addZZ(n) {
                var ret = n;
                ret = (n<10? '0':'') + ret;
                ret = (n<100? '0':'') + ret;
                return ret;
            }
            var ms = s % 1000;
            s = (s - ms) / 1000;
            var secs = s % 60;
            s = (s - secs) / 60;
            var mins = s % 60;
            var hrs = (s - mins) / 60;

            return addZ(hrs) + ':' + addZ(mins) + ':' + addZ(secs);
        };

        //format human readable
        caption.startHuman = msToTime(caption.start);
        caption.endHuman = msToTime(caption.end);
        if(caption.endHuman.substr(0,2) == "00"){
            caption.startHuman = caption.startHuman.substr(3);
            caption.endHuman = caption.endHuman.substr(3);
        }

        caption.comments = $.map(caption.comments, function (comment) {
            comment.created_at = moment(comment.created_at).fromNow();
            return comment;
        });
        caption.selfInaccessible = false;
        caption.selfBookmark = false;
        caption.selfQuestion = false;
        $.each(caption.inaccessibles, function () {
            if(this.created_by == currentUserId) {
                caption.selfInaccessible = true;
            }
        });
        $.each(caption.bookmarks, function () {
            if(this.created_by == currentUserId) {
                caption.selfBookmark = true;
            }
        });
        $.each(caption.questions, function (data) {
            if(this.created_by == currentUserId) {
                caption.selfQuestion = true;
            }
        });

        $.each(caption.comments, function (data) {
            this.fromInstructor = this.user.type == 500;
            this.ownComment = this.user.id == localStorage.getItem('user.id');
        });

        caption.totalInaccessiable = caption.inaccessibles.length > 0;
        caption.totalBookmark = caption.bookmarks.length > 0;
        caption.totalQuestion = caption.questions.length > 0;

        caption.currentCaption = caption.text;
        if(caption.chosen_version){

        }
        else if(caption.modifications && caption.modifications.length) {
            caption.currentCaption = caption.modifications[0].text;
            caption.latestModification = caption.modifications[0];
            moment(caption.latestModification.updated_at).format('MMM Do YYYY');
            caption.latestModification.updated_at = moment(caption.latestModification.updated_at).format('MMM Do YYYY');
        }

        return caption;
    });
    return captions;
}
/**
 * Add a bookmark to a caption
 * @param  {object} caption
 */

CaptionUtil.doBookmark = function(caption){
    return $.post(CaptionUtil.server + "api/bookmark", {caption_id: caption.id});
}

/**
 * Delete a bookmark from a caption
 * @param  {object} caption
 */
CaptionUtil.deleteBookmark = function(caption){
    $.ajax({
        url: CaptionUtil.server + "api/bookmark",
        data: {caption_id: caption.id},
        type: 'DELETE'
    });
}

/**
 * Add a inaccessible to a caption
 * @param  {object} caption
 */

CaptionUtil.doInaccessible = function(caption){
    return $.post(CaptionUtil.server + "api/inaccessible", {caption_id: caption.id});
}

/**
 * Delete a inaccessible from a caption
 * @param  {object} caption
 */
CaptionUtil.deleteInaccessible = function(caption){
    $.ajax({
        url: CaptionUtil.server + "api/inaccessible",
        data: {caption_id: caption.id},
        type: 'DELETE'
    });
}

/**
 * Add a question to a caption
 * @param  {object} caption
 */

CaptionUtil.doQuestion = function(caption){
    return $.post(CaptionUtil.server + "api/question", {caption_id: caption.id});
}

/**
 * Delete a question from a caption
 * @param  {object} caption
 */
CaptionUtil.deleteQuestion = function(caption){
    $.ajax({
        url: CaptionUtil.server + "api/inaccessible",
        data: {caption_id: caption.id},
        type: 'DELETE'
    });
}


// CaptionUtil.scrollTo = function($caption) {
//     if(!$caption.is(':visible'))
//         return;
        
//     console.log($caption.position().left);
//     console.log($caption[0].offsetLeft);
//     $('#captions').stop(true).animate({scrollLeft: $caption[0].offsetLeft - 40}, 0);
// }


module.exports = CaptionUtil;