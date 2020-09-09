import { gql } from '@apollo/client'

export const CREATE_BOOK = gql`
mutation createBook($title: String!, $published: Int!, $author: String!, $genres: [String]!){
    addBook(
        title: $title,
        published : $published
        author : $author
        genres : $genres
    ) {
        title
        published
        author {
            name
        }
        genres
    } 
}
`

export const SET_AUTHOR_BORN = gql`
mutation setAuthorBorn($name : String!, $setBornTo: Int!){
    editAuthor(
        name : $name,
        setBornTo : $setBornTo
    ){
        name
        born
    }
}
`

export const LOGIN = gql`
mutation muLogin($username : String!, $password: String!){
    login(
        username: $username,
        password: $password
    ){
        value
    }
}
`
