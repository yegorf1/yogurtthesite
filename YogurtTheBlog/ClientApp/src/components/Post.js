import '../stylesheets/Post.css';
import * as React from "react";
import Link from "react-router-dom/es/Link";
import ReactMarkdown from "react-markdown";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {actionCreators} from "../store/Posts";
import Likely, {Facebook, Gplus, Linkedin, Odnoklassniki, Pinterest, Telegram, Twitter, Vkontakte} from "./Likely";

class Post extends React.Component {
    componentDidMount() {
        const postUrl = this.props.match ? this.props.match.params.postUrl : null;
        if (postUrl) {
            this.props.requestSinglePost(postUrl);
        }

    }

    render() {
        const {post, loadedPost, isAdmin, deletePost} = this.props;
        const finalPost = post || loadedPost;
        if (!finalPost) {
            return <div className="post centered-content standard-width"><h1>Загрузка...</h1></div>;
        }

        return (
            <div className="post centered-content standard-width" id={"post-" + finalPost.constantUrl}>
                <div className="post-header">
                    <div className="post-title">
                        <h1>
                            <Link to={"/p/" + finalPost.constantUrl}>
                                {finalPost.title}
                            </Link>
                        </h1>
                    </div>
                    {
                        isAdmin &&
                        <div className="post-controls">
                            <Link to={"/e/" + finalPost.constantUrl}>
                                edit
                            </Link>
                            <Link className="delete-control" to="/" onClick={() => deletePost(finalPost.constantUrl)}>
                                delete
                            </Link>
                        </div>
                    }
                </div>
                <ReactMarkdown className="post-body">
                    {finalPost.body}
                </ReactMarkdown>

                <Likely dataUrl={window.location.origin + '/p/' + finalPost.constantUrl}>
                    <Facebook>Поделиться</Facebook>
                    <Twitter>Твитнуть</Twitter>
                    <Vkontakte>Поделиться</Vkontakte>
                    <Telegram>Отправить</Telegram>
                </Likely>
            </div>
        );
    }
}

export default connect(
    state => {
        return {
            loadedPost: state.posts.currentPost,
            posts: state.posts.posts,
            isAdmin: state.auth.loggedIn && state.auth.user.isAdmin
        }
    },
    dispatch => bindActionCreators(actionCreators, dispatch)
)(Post);