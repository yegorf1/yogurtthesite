import '../stylesheets/NewPostPage.css';
import * as React from "react";
import {connect} from "react-redux";
import {bindActionCreators} from "redux";
import {actionCreators} from "../store/Posts";

class NewPostPage extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            post: {
                title: '',
                body: '',
                constantUrl: ''
            }
        };

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);
    }

    handleSubmit(e) {
        e.preventDefault();

        const {post} = this.state;
        if (post.title && post.constantUrl && post.body) {
            this.props.createPost(post);
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
            NewPostPage.textAreaAdjust(event);
        }
    }

    static textAreaAdjust(event) {
        event.target.style.height = (event.target.scrollHeight) + "px";
    }

    render() {
        const {post} = this.state;

        return <div className="centered-content box standard-width">
            <form name="post-form" onSubmit={this.handleSubmit}>
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
                               onChange={this.handleChange} placeholder="Ссылка"/>
                    </span>
                </div>
                <textarea name="body" value={post.body} onChange={this.handleChange}/>
                
                <button>Запостить!</button>
            </form>
        </div>;
    }
}

export default connect(
    state => state.posts,
    dispatch => bindActionCreators(actionCreators, dispatch)
)(NewPostPage);