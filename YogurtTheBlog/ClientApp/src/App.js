import './App.css';
import React from 'react';
import { Route } from 'react-router';
import Layout from './components/Layout';
import Home from './components/Home';
import Post from "./components/Post";
import Resume from "./components/Resume";

export default () => (
  <Layout>
    <Route exact path='/' component={Home} />
    <Route path='/p/:postUrl' component={Post} />
    <Route exact path='/resume' component={Resume} />
  </Layout>
);
