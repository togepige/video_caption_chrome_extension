
var React = require('react');
var ReactDOM = require('react-dom');
var EditorControl = require("./editor_control.js");
var classNames = require('classnames');

require("../public/jquery.mousewheel.min.js")

var CorrectionEditor = React.createClass({
    blurTimeout: null,
    submitted: function () {
        var that = this;
        this.setState({ submitted: true , submitting: false});
        this.refs.submitBtn.disabled = false;
        this.exitEdit(1500);
    },
    getInitialState: function () {
        // Get initial state from properties
        return {
            text: this.props.text,
            editing: false,
            submitting: false,
            submitted: false
        };
    },
    beginEdit: function () {
        if (this.blurTimeout) {
            clearTimeout(this.blurTimeout);
            blurTimeour = null;
        }
        this.setState({ editing: true, submitted: false, submitting: false });
    },
    exitEdit: function () {
        var that = this;
        time = time ? time : 500
        this.blurTimeout = setTimeout(function () {
            that.setState({ editing: false, submitting: false, submitted: false});
            that.blurTimeout = null;
        }, time);
    },
    onInputFocus: function () {
        this.beginEdit();
    },
    onInputBlur: function () {
        this.exitEdit();
    },
    onButtonFocus: function () {
        this.beginEdit();
    },
    onButtonBlur: function () {
        if(!this.refs.submitBtn.disabled)
            this.exitEdit();
    },
    onSubmit: function () {
        this.props.onSubmit(this.state.text);
        this.beginEdit();
        this.setState({ submitting: true });
        this.refs.submitBtn.disabled = true;
    },
    onChange: function () {
        this.state.text = this.refs.textarea.value;
    },
    submitBtnClass: function () {
        var base = "submit-correction-btn btn btn-success btn-sm hidden";
        if (this.state.editing || this.state.submitting || this.state.submitted)
            base = base.replace("hidden", "");

        if (this.state.submitting){
            base += " submitting";
        }
        
        if(this.state.submitted)
            base += " submitted";
            
        return base;
    },
    render: function () {
        return <div className="correction-input-wrapper">
            <span className="textarea-label approved">Approved Caption</span>
            <div>
                <textarea className="write write-correction" row="3" placeholder="Write the correct caption.."
                    defaultValue={this.state.text}
                    onFocus={this.onInputFocus} onBlur={this.onInputBlur}
                    onChange={this.onChange} ref="textarea" />
            </div>
            <div>
                <button className={ this.submitBtnClass() } type="button"
                    onClick={this.onSubmit} onFocus={this.onButtonFocus} onBlur={this.onButtonBlur} ref="submitBtn">
                    <span className="glyphicon glyphicon-ok" aria-hidden="true" ></span>submit
                </button>
            </div>
        </div>
    }
});



var CommentEditor = React.createClass({
    blurTimeout: null,
    submitted: function () {
        var that = this;
        this.setState({ submitted: true , submitting: false, text: ''});
        this.refs.submitBtn.disabled = false;
        this.exitEdit(1500);
    },
    getInitialState: function () {
        // Get initial state from properties
        return {
            text: this.props.text,
            editing: false,
            submitting: false,
            submitted: false
        };
    },
    beginEdit: function () {
        if (this.blurTimeout) {
            clearTimeout(this.blurTimeout);
            blurTimeour = null;
        }
        this.setState({ editing: true, submitted: false, submitting: false });
    },
    exitEdit: function (time) {
        var that = this;
        time = time ? time : 500;
        this.blurTimeout = setTimeout(function () {
            that.setState({ editing: false, submitting: false, submitted: false});
            that.blurTimeout = null;
        }, time)
    },
    onInputFocus: function () {
        this.beginEdit();
    },
    onInputBlur: function () {
        this.exitEdit();
    },
    onButtonFocus: function () {
        this.beginEdit();
    },
    onButtonBlur: function () {
        if(!this.refs.submitBtn.disabled)
            this.exitEdit();
    },
    onSubmit: function () {
        this.props.onSubmit(this.state.text);
        this.beginEdit();
        this.setState({ submitting: true });
        this.refs.submitBtn.disabled = true;
    },
    onChange: function () {
        this.state.text = this.refs.textarea.value;
    },
    submitBtnClass: function () {
        var base = "submit-correction-btn btn btn-success btn-sm hidden";
        if (this.state.editing || this.state.submitting || this.state.submitted)
            base = base.replace("hidden", "");

        if (this.state.submitting){
            base += " submitting";
        }
        
        if(this.state.submitted)
            base += " submitted";
            
        return base;
    },
    render: function () {
        return <div className="correction-input-wrapper">
            <span className="textarea-label approved">Comments</span>
            <div>
                <textarea className="write write-comment" row="3" placeholder="Write a comment.."
                    defaultValue={this.state.text}
                    onFocus={this.onInputFocus} onBlur={this.onInputBlur}
                    onChange={this.onChange} ref="textarea" />
            </div>
            <div>
                <button className={ this.submitBtnClass() } type="button"
                    onClick={this.onSubmit} onFocus={this.onButtonFocus} onBlur={this.onButtonBlur} ref="submitBtn">
                    <span className="glyphicon glyphicon-ok" aria-hidden="true" ></span>submit
                </button>
            </div>
        </div>
    }
});


var CaptionBox = React.createClass({
    correctionBlurTimeout: null,
    commentBlurTimeout: null,
    getInitialState: function () {
        // Get initial state from properties
        return {
            caption: this.props.caption,
            editingComment: false,
            editingCorrection: false,
            submittingCorrection: false,
            submittingComment: false,
            correction: '',
            comment: ''
        };
    },
    
    doAction: function (actionType) {
        window.parent.postMessage({
            application: 'video_caption', type: "EDITOR_DO_ACTION", message: { type: actionType, caption: this.state.caption }
        }, "*");
    },
    getComments: function () {
        var commentClass = function (comment) {
            var className = "comment";
            if (comment.user.type == 500)
                className += " instructor-comment";
        };
        var comments = [];
        for (var i = 0; i < this.state.caption.comments.length; i++) {
            var c = this.state.caption.comments[i];
            comments.push(<div key={c.id} className={commentClass(c) }>
                <span className="comment comment-username">{c.user.email}</span>
                {c.text}
                <p className="comment-time">- {c.created_at}</p>
            </div>);
        }
        return comments;
    },
    playCaption: function () {
        window.parent.postMessage({
            application: 'video_caption', type: "PLAY_CAPTION", message: { caption: this.state.caption }
        }, "*");
    },
    getIcons: function () {
        var that = this;
        var inaccessibleClass = function () {
            var className = "icon-count inaccessible-count with-tooptip";
            if (that.state.caption.inaccessibles.length) className += " active ";
            if (that.state.caption.selfInaccessible) className += "self-active";
            return className;
        }

        var bookmarkClass = function () {
            var className = "icon-count bookmark-count with-tooptip";
            if (that.state.caption.bookmarks.length) className += " active ";
            if (that.state.caption.selfBookmark) className += "self-active";
            return className;
        }

        var questionClass = function () {
            var className = "icon-count question-count with-tooptip";
            if (that.state.caption.questions.length) className += " active ";
            if (that.state.caption.selfQuestion) className += "self-active";
            return className;
        }

        return (<div className="icon-count-container">
            <div className={ inaccessibleClass() } data-toggle="tooltip" data-placement="bottom" title="" data-original-title="report caption error"
                onClick={ that.doAction.bind(this, "inaccessible") } >
                <span className="inaccessible-count-number icon-count-number">{this.state.caption.inaccessibles.length}</span>
            </div>
            <div className={bookmarkClass() } data-toggle="tooltip" data-placement="bottom" title="" data-original-title="add a bookmark"
                onClick={ that.doAction.bind(this, "bookmark") }>
                <span className="bookmark-count-number icon-count-number">{this.state.caption.bookmarks.length}</span>
            </div>
            <div className={questionClass() } data-toggle="tooltip" data-placement="bottom" title="" data-original-title="ask for help"
                onClick={ that.doAction.bind(this, "question") }>
                <span className="question-count-number icon-count-number">{this.state.caption.questions.length}</span>
            </div>
        </div>);
    },
    submitCorrection: function (text) {
        window.parent.postMessage({
            application: 'video_caption', type: "SUBMIT_CORRECTION", message: {
                text: text,
                caption: this.state.caption
            }
        }, "*");
    },
    correctionSubmitted: function (caption) {
        console.log("correction submitted");
        this.refs.correction.submitted();
    },
    submitComment: function (text) {
        window.parent.postMessage({
            application: 'video_caption', type: "SUBMIT_COMMENT", message: {
                text: text,
                caption: this.state.caption
            }
        }, "*");
    },
    commentSubmitted: function (caption) {
        this.setState({ caption: caption});
        console.log("comment submitted");
        this.refs.comment.submitted();
    },
    
    render: function () {
        return (
            <div className="caption" id={this.state.caption.id}>
                <div className="row caption-header">
                    <div className="time-label-wrapper">
                        <span className="time-label">{this.state.caption.startHuman}-{this.state.caption.endHuman}</span>
                        <span className="time-control-btn play-btn glyphicon glyphicon-play" aria-hidden="true" onClick={this.playCaption}></span>
                        <span className="time-control-btn loop-btn glyphicon glyphicon-repeat" aria-hidden="true"></span>
                    </div>
                    {this.getIcons() }
                </div>
                <div className="caption-body row">
                    <div className="col-sm-6 correction-wrapper">
                        <CorrectionEditor text={this.state.caption.correction} onSubmit={this.submitCorrection} ref="correction"/>
                    </div>
                    <div className="col-sm-6 comment-wrapper">
                        <CommentEditor text="" onSubmit={this.submitComment} ref="comment" />
                        <hr className="comment-splitter" />
                        <div className="comments">
                            {this.getComments() }
                        </div>
                    </div>

                    <div className="caption-footer">
                    </div>
                </div>
            </div>
        );
    }
});

var Captions = React.createClass({
    captionComponents: {},
    captionHash: {},
    componentWillUpdate: function (nextProps, nextState) {
        //console.log(nextProps.  )
        if (nextState.currentCaptionId != this.state.currentCaptionId) {
            var caption = this.captionHash[nextState.currentCaptionId];
            var component = this.captionComponents[nextState.currentCaptionId];
            EditorControl.scrollTo(caption);
        }
    },
    getInitialState: function () {
        return { captions: [], currentCaptionId: 0, voiceCommand: false };
    },
    captionBlocks: function () {
        var blocks = [];
        for (var i = 0; i < this.state.captions.length; i++) {
            this.captionHash[this.state.captions[i].id] = this.state.captions[i];
            var captionComponent = <CaptionBox key={this.state.captions[i].number}  caption={this.state.captions[i]}
                ref={(ref) => { if (ref) this.captionComponents[ref.state.caption.id] = ref; } }/>;
            //this.state.captionMapping[this.state.captions[i].id] = [this.state.captions[i], captionComponent];
            blocks.push(captionComponent);
        }
        if (this.state.captions.length && !this.state.currentCaptionId) {
            this.state.currentCaptionId = this.state.captions[0].id;
        }
        return blocks;
    },
    /**
     * This function handle the voice command toggle event
     */
    handleVoiceCommand() {
        this.setState({
            voiceCommand: !this.state.voiceCommand
        });
        // if checked, active voice command function
        if (!this.state.voiceCommand) {
            window.parent.postMessage({
                application: 'video_caption', type: "ACTIVE_VOICE_COMMAND", message: {
                    type: 'warning',
                    message: 'You can press ctrl key and start speaking now...'
                }
            }, "*");
        } else {
            window.parent.postMessage({ application: 'video_caption', type: "DEACTIVE_VOICE_COMMAND" }, "*");
        }
    },
    componentDidMount: function () {
        var that = this;

        window.addEventListener("message", function (event) {
            if (event.data.application == "video_caption" && event.data.type == "EDITOR_INIT") {
                console.log("editor_init received");
                that.setState({ captions: event.data.message.captions });
            }
        }, false);
        window.parent.postMessage({ application: 'video_caption', type: "EDITOR_READY", message: "" }, "*");

        $(".comments").mousewheel(function (event, delta) {
            event.preventDefault();
        });
        $("#captions").mousewheel(function (event, delta) {
            var $comment;
            if ($(event.toElement).closest('.comments-display').length) {
                $comment = $(event.toElement).closest('.comments-display');
            }
            else if ($(event.toElement).is('.comments-display')) {
                $comment = $(event.toElement);
            }
            if ($comment == null || !$comment.get(0).scrollHeight || $comment.get(0).scrollHeight <= $comment.height()) {
                this.scrollLeft -= (delta * 70);
                event.preventDefault();
            }
        });
        //$("#caption-container").draggable();
    },
    render: function () {
        
        return (
            <div id="caption-container">
                <a className="caption-control-arrow caption-control-arrow-left">
                    <span className="glyphicon glyphicon-chevron-left"></span>
                </a>
                <a className="caption-control-arrow caption-control-arrow-right">
                    <span className="glyphicon glyphicon-chevron-right"></span>
                </a>
                <div id="caption-header" style={{ margin: "4px 8px", marginBottom: "0" }}>
                    <div id="voice-command-wrapper" style={ { display: 'inline-block' } } >
                        <div className="toggle-wrapper">
                            <label className="toggle-label">Voice command</label>
                            <input type="checkbox" id="voice-command" className="toggle hidden" checked={this.state.voiceCommand} onChange={this.handleVoiceCommand}/>
                            <label htmlFor="voice-command" className="toggle-indicator"></label>
                        </div>
                    </div>
                </div>
                <div id="captions">
                    <div>
                        {this.captionBlocks() }
                    </div>
                </div>
            </div>
        );
    }
});

var captionsComponent = <Captions />;
captionsComponent = ReactDOM.render(
    captionsComponent,
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


