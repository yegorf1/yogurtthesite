import './Post.css';
import * as React from "react";
import Link from "react-router-dom/es/Link";
import ReactMarkdown from "react-markdown";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {actionCreators} from "../store/Posts";

class Post extends React.Component {
    componentDidMount() {
        const postUrl = this.props.match ? this.props.match.params.postUrl : null;
        if (postUrl && !this.props.posts.find(p => p.constantUrl === postUrl)) {
            this.props.requestSinglePost(postUrl);
        }
    }

    render() {
        const {post, loadedPost, posts} = this.props;
        const postUrl = this.props.match ? this.props.match.params.postUrl : null;
        const finalPost = post || posts.find(p => p.constantUrl === postUrl) || loadedPost;
        if (!finalPost) {
            return <div className="post"><h1>Загрузка...</h1></div>;
        }
        return (
            <div className="post" id={"post-" + finalPost.constantUrl}>
                <h1 className="post-title">
                    <Link to={"/p/" + finalPost.constantUrl}>
                        {finalPost.title}
                    </Link>
                </h1>
                <ReactMarkdown className="post-body">
                    {finalPost.body}
                </ReactMarkdown>
            </div>
        );
    }
}

export default connect(
    state => {
        return {
            loadedPost: state.posts.currentPost,
            posts: state.posts.posts,
        }
    },
    dispatch => bindActionCreators(actionCreators, dispatch)
)(Post);