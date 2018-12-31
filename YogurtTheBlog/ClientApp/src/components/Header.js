import '../stylesheets/Header.css';
import * as React from "react";
import {Link} from "react-router-dom";
import connect from "react-redux/es/connect/connect";
import {bindActionCreators} from "redux";
import {actionCreators} from "../store/Auth";

class Header extends React.Component {
    getLinks() {
        let links = [
            {
                link: '/',
                text: 'Блог'
            }, {
                link: '/resume',
                text: 'Резюме'
            }
        ];

        if (this.props.loggedIn) {
            links.push({
                link: '/',
                text: 'Выход',
                onClick: this.props.logout
            });

            if (this.props.user.isAdmin) {
                links.push({
                    link: '/new',
                    text: 'Пост'
                });
            }
        }

        return links;
    }

    render() {
        return <div id="header">
            <div className="logo">
                <h1>
                    Yogurt The Horse
                    {
                        this.getLinks().map(link => (
                            <div>
                                {'/'}
                                <Link to={link.link} onClick={link.onClick}>
                                    {link.text}
                                </Link>
                            </div>
                        ))
                    }
                </h1>
            </div>
            {
                this.props.loggedIn &&
                <div className="float-right">Logged in as {this.props.user.username}</div>
            }
            <div className="separator"/>
        </div>;
    }
}

export default connect(
    state => state.auth,
    dispatch => bindActionCreators(actionCreators, dispatch)
)(Header);
