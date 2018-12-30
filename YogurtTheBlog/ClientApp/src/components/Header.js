import './Header.css';
import * as React from "react";
import {Link} from "react-router-dom";

export default class Header extends React.Component {
    render() {
        return <div id="header">
            <div className="logo">
                <Link to="/"><h1>Yogurt The Horse</h1></Link>
            </div>
            <div className="separator"/>
        </div>;
    }
}