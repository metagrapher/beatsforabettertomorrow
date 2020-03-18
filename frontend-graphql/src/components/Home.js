import React, { Component } from 'react';
import { withApollo } from 'react-apollo';
import gql from 'graphql-tag';
import { Link } from 'react-router-dom';
import { createHttpLink } from 'apollo-link-http';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { ApolloClient } from 'apollo-boost';
import { AUTH_TOKEN } from '../constants';
import Config from '../config';
import { ReactComponent as Logo } from '../static/images/Logo.svg';

import { default as PAGE_QUERY } from '../queries/Page';
import { default as PAGES_AND_CATEGORIES_QUERY } from '../queries/PagesAndPosts';
import { default as PROTECTED_QUERY } from '../queries/Protected';


class Home extends Component {
  state = {
    userId: null,
    page: {
      title: '',
      content: '',
    },
    pages: [],
    posts: [],
  };

  // used as a authenticated GraphQL client
  authClient = null;

  componentDidMount() {
    this.executePageQuery();
    this.executePagesAndCategoriesQuery();

    // if localstorage contains a JWT token
    // initiate a authenticated client and execute a protected query
    const authToken = localStorage.getItem(AUTH_TOKEN);
    if (authToken) {
      this.authClient = new ApolloClient({
        link: createHttpLink({
          uri: Config.gqlUrl,
          headers: {
            Authorization: authToken ? `Bearer ${authToken}` : null,
          },
        }),
        cache: new InMemoryCache(),
      });
      this.executeProtectedQuery();
    }
  }

  /**
   * Execute the protected query and update state
   */
  executeProtectedQuery = async () => {
    let error = null;
    const result = await this.authClient
      .query({
        query: PROTECTED_QUERY,
      })
      .catch(err => {
        error = err;
      });
    if (!error) {
      const { userId } = result.data.viewer;
      this.setState({ userId });
    } else {
      const { history } = this.props;
      localStorage.removeItem(AUTH_TOKEN);
      history.push(`/login`);
    }
  };

  /**
   * Execute the page query using uri and set the state
   */
  executePageQuery = async () => {
    const { match, client } = this.props;
    let uri = match.params.slug;
    if (!uri) {
      uri = 'welcome';
    }
    const result = await client.query({
      query: PAGE_QUERY,
      variables: { uri },
    });
    const page = result.data.pageBy;
    this.setState({ page });
  };

  /**
   * Execute the pages and categories query and set the state
   */
  executePagesAndCategoriesQuery = async () => {
    const { client } = this.props;
    const result = await client.query({
      query: PAGES_AND_CATEGORIES_QUERY,
    });
    const modifiedPosts = (type) => ( elm =>{
      const finalLink = `/${type}/${elm.node.slug}`
      const modifiedElm = { ...elm }
      modifiedElm.node.link = finalLink
      return modifiedElm
    })
    const elems = (edges, type) => edges.map(modifiedPosts(type))
    const posts = elems(result.data.posts.edges, 'posts')
    const pages = elems(result.data.pages.edges, 'pages');

    this.setState({ posts, pages });
  };

  render() {
    const { page, posts, pages } = this.state;
    return (
      <div>
        <div className="graphql intro bg-black white ph3 pv4 ph5-m pv5-l flex flex-column flex-row-l hero-1">
          <div className="color-logo w-50-l mr3-l">
            <Logo width={440} height={280} />
          </div>
          <div className="subhed pr6-l">
            <h1>{page.title}</h1>
            <div className="dek">
              Hundreds of survice industry and gig economy people are suddenly without work. Without gatherings, they are unemployed.
            </div>
            <div className="api-info b mt4">
              Please consider donating the tip you would normally spend on a night out, a bar tab, or cab fare. Just the tip.
              <div className="api-toggle">
                <a className="rest" href="http://localhost:3000">Paypal</a>
                <a className="graphql" href="http://localhost:3001">Venmo</a>
              </div>
            </div>
          </div>
        </div>
        <div className="recent flex mh4 mt4 w-two-thirds-l center-l">
          <div className="w-50 pr3">
            <h2>News</h2>
            <ul>
              {posts.map(post => (
                <li key={post.node.slug}>
                  <Link to={post.node.link}>
                    {post.node.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="w-50 pl3">
            <h2>Info</h2>
            <ul>
              {pages.map(post => {
                if (post.node.slug !== 'welcome') {
                  return (
                    <li key={post.node.slug}>
                      <Link to={post.node.link}>
                        {post.node.title}
                      </Link>
                    </li>
                  )
                } else {
                  return false;
                }
              })}
            </ul>
          </div>
        </div>
    );
  }
}

export default withApollo(Home);
