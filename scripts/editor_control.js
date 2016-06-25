/**
 * @desc
 * This file is the logic code for caption editor. It is used in editor.jsx to control the behavior of editor.
 * 
 * @author Junkai Yang
 */

EditorControl = {};
EditorControl.server = "https://datascience.ischool.syr.edu/";
/**
 * This function accept the caption object and scroll the editor to the corresponding position.
 * 
 * @author Junkai Yang 
 * @param  {object} caption
 */
EditorControl.scrollTo = function(caption) {
    if(caption){
    var $caption = $("#" + caption.id);
        if(!$caption.is(':visible'))
            return;
        $('#captions').stop(true).animate({scrollLeft: $caption[0].offsetLeft - 40}, 0);
    }
    
}

module.exports = EditorControl;