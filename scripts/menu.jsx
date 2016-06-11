var React = require('react');
var ReactDOM = require('react-dom');

// Loading indicator UI component
var LoadingIndicator = React.createClass({
    isLoaded: function () {
        return this.props.loaded ? "loaded" : "loading";
    },
    render: function () {
        return (
            <div id="loading" className={this.isLoaded() }></div>
        );
    }
});

// Close button UI component
var CloseButton = React.createClass({
    handleClick: function () {
        this.props.onClose();
    },
    render: function () {
        return <div id="close-button-container">
            <a id="close-button-wrapper" onClick={this.handleClick}>
                <img id="close-button-image" src="/images/close.png" />
            </a>
        </div>;
    }
});

// Menu warning message UI component
var MenuMessage = React.createClass({
    getClass: function () {
        return this.props.message ? "" : "hidden";
    },
    render: function () {
        return (
            <div id="warning-container" className="hidden">
                <p>{this.props.message}</p>
            </div>);
    }
});

// Video information UI component
var VideoInformation = React.createClass({
    render: function () {
        if (this.props.video) {
            return (
                <div id="video-info-container">
                    <div className="content-wrapper">
                        <label className="info-label">Video Id</label>
                        <p className="info-content" id="video_id">{this.props.video.id}</p>
                    </div>
                    <div className="content-wrapper">
                        <label className="info-label">Video Title</label>
                        <p className="info-content" id="video_title">{this.props.video.title}</p>
                    </div>

                    <div className="content-wrapper">
                        <label className="info-label">Course</label>
                        <p className="info-content">Blackboard Test Course 123</p>
                    </div>
                </div>
            );
        } else {
            return (<div id="video-info-container"></div>);
        }

    }
});

// Menu control UI component
var CaptionControl = React.createClass({
    getInitialState: function () {
        return { loaded: false };
    },
    handleLoadCaption: function () {
        window.parent.postMessage({ application: 'video_caption', type: "LOAD_CAPTION", message: "" }, "*");
    },
    handleOpenEditor: function () {
        window.parent.postMessage({ application: 'video_caption', type: "OPEN_EDITOR", message: "" }, "*");
    },
    getClass: function () {
        return this.props.video ? '' : 'hidden';
    },
    getButtonText: function () {
    },
    render: function () {
        return (
            <div id="control-container" className={this.getClass() }>
                <button id="load-caption" className="btn btn-success" onClick={this.handleLoadCaption}>Load Caption</button>
                <button id="load-caption" className="btn btn-success" onClick={this.handleOpenEditor}>Open Caption Editor</button>
            </div>
        )
    }
});

// Menu main window UI component
var MenuWindow = React.createClass({
    getInitialState: function () {
        return { loaded: false, video: null, message: '' };
    },
    contentClass: function () {
        return this.state.loaded ? '' : 'hidden';
    },
    handleClose: function () {
        window.parent.postMessage({ application: 'video_caption', type: "UI_HIDE", message: "" }, "*");
    },
    componentDidMount: function () {
        var that = this;
        // Send ready message to content-script
        window.addEventListener("message", function (event) {
            if (event.data.application == "video_caption" && event.data.type == "UI_INIT") {
                var video = null;
                var message = "";
                if (event.data.success != false) {
                    video = JSON.parse(event.data.message);
                }
                else {
                    message = event.data.message;
                }
                that.setState({ "loaded": true, "video": video, "message": message });
            }
        }, false);

        window.parent.postMessage({ application: 'video_caption', type: "UI_READY", message: "" }, "*");
    },
    render: function () {
        return (
            <div id="main-container">
                <CloseButton onClose={this.handleClose}/>
                <LoadingIndicator loaded={this.state.loaded} />
                <div id="content-container" className={this.contentClass() }>
                    <h1 id="project-title">Caption Project</h1>
                    <MenuMessage message={this.state.message} />
                    <VideoInformation video={this.state.video} />
                    <CaptionControl video={this.state.video} />
                </div>
            </div>
        );
    }
});


// Render the menu window component
ReactDOM.render(
    <MenuWindow />,
    document.getElementById('application')
);


// Old code ------------------------------------------------------------------------------------------
// var f = function(){};
// var captions = [];

// $(document).ready(function () {
//     $("#close-button-wrapper").click(function () {
//         window.parent.postMessage({ application: 'video_caption', type: "UI_HIDE", message: "" }, "*");
//     });

//     window.addEventListener("message", function (event) {
//         var origin = event.origin || event.originalEvent.origin; // For Chrome, the origin property is in the event.originalEvent object.

//         if (event.data.application == "video_caption" && event.data.type == "UI_INIT") {
//             init(event);
//         }
//     }, false);

//     $("#load-caption").click(function(){
//         window.parent.postMessage({ application: 'video_caption', type: "LOAD_CAPTION", message: "" }, "*");
//     });

//     window.parent.postMessage({ application: 'video_caption', type: "UI_READY", message: "" }, "*");
// });


// var init = function(event){
//     console.log("Iframe received: " + event.data.type);
//     var data = JSON.parse(event.data.message);
//     $("#loading").remove();
//     $("#content-container").removeClass("hidden");
//     if(!event.data.success){
//         $("#warning-container").removeClass("hidden").text(message.message);
//     }
//     else{
//         console.log(event.data.message);
//         $("#video-info-container").removeClass("hidden");
//         $("#video_title").text(data.title);
//         $("#video_id").text(data.id);
//         if(!data.captionLength)
//             $("#loading-message").text("Cannot find captions on the server.");
//         else {
//             $("#loading-message").hide();
//             $("#control-container").removeClass("hidden");
//         }
//     }

// }