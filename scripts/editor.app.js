var Captions = require('./components/editor.react.jsx')
var React = require('react');
var ReactDOM = require('react-dom');
captionsComponent = ReactDOM.render(
    <Captions />,
    document.getElementById('application')
)

window.addEventListener("message", function (event) {
    if (event.data.application == "video_caption" && event.data.type == "SYNC_EDITOR") {
        //var syncData = JSONevent.data.message);
        // Sync the editor based on the time information from content script
        var syncData = event.data.message;
        console.log(syncData.captionId);
        captionsComponent.setState({ currentCaptionId: syncData.captionId });
    }
    else if (event.data.application == "video_caption" && event.data.type == "UPDATE_CAPTION") {
        captionsComponent.captionComponents[event.data.message.caption.id].setState({ caption: event.data.message.caption });
        //captionsComponent.setState({ currentCaptionId: syncData.captionId });
    } else if (event.data.application == "video_caption" && event.data.type == "CORRECTION_SUBMITTED") {
        captionsComponent.captionComponents[event.data.message.caption.id].correctionSubmitted(event.data.message.caption);
    }
    else if (event.data.application == "video_caption" && event.data.type == "COMMENT_SUBMITTED") {
        captionsComponent.captionComponents[event.data.message.caption.id].commentSubmitted(event.data.message.caption);
    }

});