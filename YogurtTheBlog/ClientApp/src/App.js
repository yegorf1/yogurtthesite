import './stylesheets/App.css';
import React from 'react';
import {Route} from 'react-router';
import Layout from './components/Layout';
import Home from './components/Home';
import Post from "./components/Post";
import Resume from "./components/Resume";
import LoginPage from "./components/LoginPage";
import RegisterPage from "./components/RegisterPage";
import EditPostPage from "./components/EditPostPage";
import SettingsPage from "./components/settings/SettingsPage";

export default () => (
    <Layout>
        <Route exact path='/' component={Home}/>
        <Route path='/p/:postUrl' component={Post}/>
        <Route path='/e/:postUrl' component={EditPostPage}/>
        <Route path='/t/:tag' component={Home}/>
        <Route exact path='/resume' component={Resume}/>
        <Route exact path='/login' component={LoginPage}/>
        <Route exact path='/register' component={RegisterPage}/>
        <Route exact path='/new' component={EditPostPage}/>
        <Route path="/settings" component={SettingsPage}/>
    </Layout>
);
