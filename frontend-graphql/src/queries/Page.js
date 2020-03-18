import gql from 'graphql-tag'

/**
 * GraphQL page query
 * Gets page's title and content using slug as uri
 */
export default gql`
  query PageQuery($uri: String!) {
    pageBy(uri: $uri) {
      title
      content
    }
  }
`