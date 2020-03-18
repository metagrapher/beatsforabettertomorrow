import gql from 'graphql-tag'

/**
 * GraphQL protected query, an example of an authenticated query
 * If not authenticated it will return an error
 * If authenticated it will return the viewer's id and username
 */
export default gql`
  query ProtectedQuery {
    viewer {
      userId
      username
    }
  }
`