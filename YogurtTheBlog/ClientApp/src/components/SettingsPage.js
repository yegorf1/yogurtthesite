import '../stylesheets/Settings.css';

import * as React from "react";
import {NavLink} from "react-router-dom";
import {Route} from "react-router";
import PublishersPage from "./settings/PublishersPage";
import MainPage from "./settings/MainPage";

export default class SettingsPage extends React.Component {
    render() {
        return (
            <div id="settings-page" className="centered-content standard-width">
                <div className="settings-navigation">
                    <div className="links" >
                        <NavLink to="/settings">
                            Основные
                        </NavLink>
                        <NavLink to="/settings/publishers">
                            Издатели
                        </NavLink>
                        <NavLink to="/settings/comments">
                            Комментарии
                        </NavLink>
                    </div>
                </div>
                <div className="settings-content">
                    <Route exact path="/settings" component={MainPage}/>
                    <Route path="/settings/publishers" component={PublishersPage}/>
                </div>
            </div>
        )
    }
}