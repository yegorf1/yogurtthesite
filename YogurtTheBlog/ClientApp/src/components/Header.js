import '../stylesheets/Header.css';
import * as React from "react";
import {Link} from "react-router-dom";
import connect from "react-redux/es/connect/connect";
import {bindActionCreators} from "redux";
import {actionCreators} from "../store/Auth";
import NavLink from "react-router-dom/es/NavLink";

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
            if (this.props.user.isAdmin) {
                links.push({
                    link: '/new',
                    text: 'Новый пост'
                });
                
                links.push({
                    link: '/settings',
                    text: 'Настройки'
                })
            }
            
            links.push({
                link: '/',
                text: 'Выход',
                onClick: this.props.logout
            });
        }

        return links;
    }

    render() {
        return <div id="header">
            <div className="links centered-content" style={{display: "table"}}>
                <h1>
                    {
                        this.getLinks().map(link => (
                            <div key={link.text} className="link-group">
                                <NavLink to={link.link} onClick={link.onClick}>
                                    {link.text}
                                </NavLink>
                            </div>
                        ))
                    }
                </h1>
            </div>
            {
                this.props.loggedIn &&
                <div className="float-right">Logged in as {this.props.user.username}</div>
            }
        </div>;
    }
}

export default connect(
    state => state.auth,
    dispatch => bindActionCreators(actionCreators, dispatch)
)(Header);
