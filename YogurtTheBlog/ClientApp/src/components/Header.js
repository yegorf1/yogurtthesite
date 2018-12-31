import '../stylesheets/Header.css';
import * as React from "react";
import {Link} from "react-router-dom";
import connect from "react-redux/es/connect/connect";

class Header extends React.Component {
    render() {
        return <div id="header">
            <div className="logo">
                <h1>
                    Yogurt The{' '}
                    <Link to="/">Блог</Link>
                    /
                    <Link to="/resume">Резюме</Link>
                </h1>
            </div>
            {
                this.props.loggedIn &&
                <div className="float-right">Logged as {this.props.user.username}</div>
            }
            <div className="separator"/>
        </div>;
    }
}

export default connect(
    state => state.auth
)(Header);
