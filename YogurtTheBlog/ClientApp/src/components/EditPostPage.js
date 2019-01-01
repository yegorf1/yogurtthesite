import '../stylesheets/EditPostPage.css';
import * as React from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {actionCreators} from "../store/Posts";

class EditPostPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            editing: false,
            post: {
                title: '',
                body: '',
                constantUrl: ''
            }
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    componentDidMount() {
        const postUrl = this.props.match ? this.props.match.params.postUrl : null;
        if (postUrl) {
            this.setState({
                editing: true
            });
            this.props.requestSinglePost(postUrl).then(post => {
                this.setState({post});
            });
        }
    }

    handleSubmit(e) {
        e.preventDefault();

        const {post, editing} = this.state;
        if (post.title && post.constantUrl && post.body) {
            if (editing) {
                this.props.editPost(post);
            } else {
                this.props.createPost(post);
            }
        }
    }

    handleChange(event) {
        const {name, value} = event.target;
        const {post} = this.state;
        this.setState({
            post: {
                ...post,
                [name]: value
            }
        });

        if (name === 'body') {
            EditPostPage.textAreaAdjust(event);
        }
    }

    static textAreaAdjust(event) {
        event.target.style.height = (event.target.scrollHeight) + "px";
    }

    render() {
        const {isLoading} = this.props;
        const {post, editing} = this.state;

        if (editing && isLoading) {
            return <span>1 second..</span>;
        }
        
        return <div className="centered-content standard-width">
            <form name="post-form" onSubmit={this.handleSubmit}>
                <div>
                    <div>
                        <h1>
                            <input type="text" name="title" value={post.title}
                                   onChange={this.handleChange} placeholder="Название"/>
                        </h1>
                    </div>
                    <div>
                    <span>
                        {window.location.origin + '/p/'}
                        <input type="text" name="constantUrl" value={post.constantUrl}
                               onChange={this.handleChange} placeholder="link"/>
                    </span>
                    </div>
                    <textarea name="body" value={post.body} onChange={this.handleChange}/>
                </div>

                <div className="submit-controls">
                    <button className="primary">{editing ? "Закончить" : "Запостить!"}</button>
                </div>
            </form>
        </div>;
    }
}

export default connect(
    state => state.posts,
    dispatch => bindActionCreators(actionCreators, dispatch)
)(EditPostPage);