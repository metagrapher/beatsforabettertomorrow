import gql from 'graphql-tag'

export default gql`
  query PagesAndPostsQuery {
    posts {
      edges {
        node {
          title
          slug
        }
      }
    }
    pages {
      edges {
        node {
          title
          slug
        }
      }
    }
  }
`
