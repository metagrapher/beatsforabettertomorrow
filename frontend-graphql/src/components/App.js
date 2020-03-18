import React from 'react';
import { Switch, Route } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import Home from './Home';
import Login from './Login';
import Search from './Search';
import Page from './Page';
import Post from './Post';
import Category from './Category';
import Donate from './Donate'

/*
Website:  Header With Donate Now Button
Landing :  Beats Mission  Vision Statement Link to Current Campaign
Current Campaign page: What We’re Doing Now- Summary Paragraphs and Applications
Join The Team!!!:   General Volunteer Application Page:
Contact Us: Standard Verbiage
*/
export default () => (
  <div className="center">
    <Header />
    <div className="">
      <Switch>
        <Route exact path="/" component={Home} />
        <Route exact path="/donate" component={Donate} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/search" component={Search} />
        <Route exact path="/page/:slug" component={Page} />
        <Route exact path="/post/:slug" component={Post} />
        <Route exact path="/category/:slug" component={Category} />
      </Switch>
    </div>
    <Footer />
  </div>
);
