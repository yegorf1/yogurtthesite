import React from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from "redux";
import {actionCreators} from "../store/Posts";
import Post from "./Post";

class Home extends React.Component {
    componentDidMount() {
        this.props.requestPosts(this.props.page);
    }
    
    render() {
        return <div id="posts" className="content" style={{width: "100%"}}>
            {!this.props.isLoading &&  this.props.posts.map(post => <Post key={post.constantUrl} post={post}/>)}
        </div>;
    }
}

export default connect(
    state => state.posts,
    dispatch => bindActionCreators(actionCreators, dispatch)
)(Home);
