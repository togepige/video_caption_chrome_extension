var CaptionBox = React.createClass({
    getInitialState: function () {
        // Get initial state from properties
        return { caption: this.props.caption };
    },
    getComments: function(){
        var commentClass = function(comment){
            var className = "comment";
            if(comment.user.type == 500)
                className += " instructor-comment";
        };
        var comments = [];
        for(var i = 0 ; i < this.state.caption.comments.length; i++){
            var c = this.state.caption.comments[i];
            comments.push(<div key={c.id} className={commentClass(c)}>
                                <span className="comment comment-username">{c.user.email}</span>
                                c.text
                                <p className="comment-time">- c.created_at</p>
                            </div>);
        }
        return comments;
    },
    getIcons: function(){
        
    },
    render: function () {
        return (
            <div className="caption">
                <div className="row caption-header">
                    <div className="time-label-wrapper">
                        <span>{this.state.caption.startHuman}-{this.state.caption.endHuman}</span>
                        <span className="time-control-btn play-btn glyphicon glyphicon-play" aria-hidden="true"></span>
                        <span className="time-control-btn loop-btn glyphicon glyphicon-repeat" aria-hidden="true"></span>
                    </div>
                    
                    <div className="icon-count-container">
                        <div className="icon-count inaccessible-count active with-tooptip" data-toggle="tooltip" data-placement="bottom" title="" data-original-title="report caption error">
                            <span className="inaccessible-count-number icon-count-number">3</span>
                        </div>
                        <div className="icon-count bookmark-count active  with-tooptip" data-toggle="tooltip" data-placement="bottom" title="" data-original-title="add a bookmark">
                            <span className="bookmark-count-number icon-count-number">2</span>
                        </div>
                        <div className="icon-count question-count active  with-tooptip" data-toggle="tooltip" data-placement="bottom" title="" data-original-title="ask for help">
                            <span className="question-count-number icon-count-number">2</span>
                        </div>
                    </div>
                </div>
                <div className="caption-body row">
                    <div className="col-sm-6 correction-wrapper">
                        <div className="correction-input-wrapper">
                            <span className="textarea-label approved">Approved Caption</span>
                            <div>
                                <textarea className="write write-correction" row="3" placeholder="Write the correct caption.." defaultValue={this.state.caption.correction} />
                            </div>
                            <i className="updated fa fa-check-circle-o"></i>
                            <div>
                                <button className="submit-correction-btn btn btn-success btn-sm hidden" type="button">
                                    <span className="glyphicon glyphicon-ok hidden" aria-hidden="true" ></span>submit
                                </button>
                            </div>
                        </div>
                    </div>
                    <div className="col-sm-6 comment-wrapper">
                        <span className="textarea-label">Comment</span>
                        <div>
                            <textarea className="write write-comment" placeholder="Write a comment..." row="1"></textarea>
                        </div>
                        <i className="updated fa fa-check-circle-o"></i>
                        <div>
                            <button className="submit-comment-btn btn btn-success btn-sm hidden" type="button">
                                <span className="glyphicon glyphicon-ok hidden" aria-hidden="true" ></span>submit
                            </button>
                        </div>
                        <hr className="comment-splitter" />
                        <div className="comments">
                            {this.getComments()}
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
    getInitialState: function () {
        return { captions: [] };
    },
    captionBlocks: function () {

        var blocks = [];
        for (var i = 0; i < this.state.captions.length; i++) {
            blocks.push(<CaptionBox key={this.state.captions[i].number}  caption={this.state.captions[i]} />);
        }
        return blocks;
    },
    componentDidMount: function () {
        var that = this;
        getCaptions("EkWfwRPyTG8").then(function (response) {
            that.setState({ captions: response });
        });
    },
    render: function () {
        return (
            <div id="captions">
                <div id="caption-container">
                    {this.captionBlocks()}
                </div>
            </div>
        );
    }
});

ReactDOM.render(
    <Captions />,
    document.getElementById('application')
)


