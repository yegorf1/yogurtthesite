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
                tags: '',
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
                post.tags = post.tags.join(', ');
                this.setState({post});
            });
        }
    }

    handleSubmit(e) {
        e.preventDefault();

        const {post, editing} = this.state;

        if (post.title && post.constantUrl && post.body) {
            const tagsString = post.tags;
            post.tags = [];

            tagsString.split(',').forEach(tag => post.tags.push(tag.trim()));
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
    }

    render() {
        const {isLoading} = this.props;
        const {post, editing} = this.state;

        if (editing && isLoading) {
            return <span>1 second..</span>;
        }

        return (
            <form name="post-form" onSubmit={this.handleSubmit}>
                <div className="centered-content standard-width flex-fill">
                    <div className="post-content">
                        <h1>
                            <input type="text" name="title" value={post.title}
                                   onChange={this.handleChange} placeholder="Название"/>
                        </h1>
                        <div>
                            <span>
                                {window.location.origin + '/p/'}
                                <input type="text" name="constantUrl" value={post.constantUrl}
                                       onChange={this.handleChange} placeholder="link"/>
                            </span>
                        </div>
                        <div>
                            <span>
                                Теги (через запятую):
                                <input type="text" name="tags" value={post.tags}
                                       onChange={this.handleChange} placeholder="теги"/>
                            </span>
                        </div>
                        <textarea name="body" value={post.body} onChange={this.handleChange}/>
                    </div>

                    <div className="submit-controls">
                        <button className="primary">{editing ? "Закончить" : "Запостить!"}</button>
                    </div>
                </div>
            </form>
        );
    }
}

export default connect(
    state => state.posts,
    dispatch => bindActionCreators(actionCreators, dispatch)
)(EditPostPage);