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

var CloseButton = React.createClass({
    render: function () {
        return <div id="close-button-container">
            <a id="close-button-wrapper">
                <img id="close-button-image" src="/images/close.png" />
            </a>
        </div>;
    }
});

var MenuMessage = React.createClass({
    getClass: function () {
        return this.props.message ? "" : "hidden";
    },
    render: function () {
        return (
            <div id="warning-container" class="hidden">
                <p>{this.props.message}</p>
            </div>);
    }
});

var VideoInformation = React.createClass({
    render: function () {
        if (this.props.video) {
            return (
                <div id="video-info-container" class="hidden">
                    <div class="content-wrapper">
                        <label class="info-label">Video Id</label>
                        <p class="info-content" id="video_id">{this.props.video.id}</p>
                    </div>
                    <div class="content-wrapper">
                        <label class="info-label">Video Title</label>
                        <p class="info-content" id="video_title">{this.props.video.title}</p>
                    </div>

                    <div class="content-wrapper">
                        <label class="info-label">Course</label>
                        <p class="info-content">Blackboard Test Course 123</p>
                    </div>

                    <div id="control-container" class="hidden">
                        <button id="load-caption" class="btn-success">Load Caption</button>
                    </div>
                </div>
            );
        }else{
            return (<div id="video-info-container"></div>);
        }

    }
})

var MenuWindow = React.createClass({
    getInitialState: function () {
        return { loaded: false, video: null, message: '' };
    },
    contentClass: function () {
        return this.state.loaded ? '' : 'hidden';
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
                <CloseButton />
                <LoadingIndicator loaded={this.state.loaded} />
                <div id="content-container" className={this.contentClass() }>
                    <h2 id="project-title">Caption Project</h2>
                    <MenuMessage message={this.state.message} />
                    <VideoInformation video={this.state.video} />
                </div>
            </div>
        );
    }
});

ReactDOM.render(
    <MenuWindow />,
    document.getElementById('application')
);
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