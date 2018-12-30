import './Header.css';
import * as React from "react";
import {Link} from "react-router-dom";

export default class Header extends React.Component {
    render() {
        return <div id="header">
            <div className="logo">
                <h1><Link to="/">Yogurt The Horse</Link></h1>
            </div>
            <div className="separator"/>
        </div>;
    }
}