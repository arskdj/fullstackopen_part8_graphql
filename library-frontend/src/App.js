import React, { useState, useEffect } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import Login from './components/Login'
import Recommend from './components/Recommend'
import { useSubscription, useQuery, useApolloClient, gql } from '@apollo/client'
import { CURRENT_USER, ALL_BOOKS } from './queries'

export const BOOK_ADDED = gql`
subscription {
    bookAdded {
        id
        title
        author {
            name
        }
        published
        genres
    }
}
`


const App = () => {
    const [page, setPage] = useState('authors')
    const [token, setToken] = useState(localStorage.getItem('token'))
    const me = useQuery(CURRENT_USER)

    const [username, setUsername] = useState('')

    const client = useApolloClient()
    const updateCacheWith = (addedBook) => {
        const includedIn = (set, object) =>
            set.map(p => p.id).includes(object.id)

        const update = (variables) => {
            const dataInStore = client.readQuery({ query: ALL_BOOKS, variables })
            if (!includedIn(dataInStore.allBooks, addedBook)) {
                client.writeQuery({
                    query: ALL_BOOKS,
                    variables,
                    data: { allBooks : dataInStore.allBooks.concat(addedBook) }
                })
            }
        }

        update({})

        //recommended
        addedBook.genres.forEach( genre => 
            update({genre})
        )
    }

    useSubscription(BOOK_ADDED, {
        onSubscriptionData: ({ subscriptionData }) => {
            const book = subscriptionData.data.bookAdded
            window.alert(`book added ${book.title}, ${book.author.name}, ${book.published}`)
            updateCacheWith(book)
        }
    })

    useEffect( () => {
        me.refetch()
    }, [ token ] )

    useEffect( () => {
        setUsername(me.data?.me?.username)
    }, [ me ] )

    const logout = () => {
        setUsername(null)
        setToken(null)
        setPage('login')
        localStorage.clear()
        client.clearStore()
    }

    return (
        <div>
            <div>
                { <p> hello {username} </p> }
                <button onClick={() => setPage('authors')}>authors</button>
                <button onClick={() => setPage('books')}>books</button>
                { token  && <button onClick={() => setPage('add')}>add book</button>}
                { token  && <button onClick={() => setPage('recommend')}>recommend</button>}
                { !token && <button onClick={() => setPage('login')}>login</button> }
                { token  && <button onClick={logout}>logout</button> }
            </div>

            <Authors
                show={page === 'authors'}
            />

            <Books
                show={page === 'books'}
            />

            <NewBook
                show={page === 'add'}
            />

            <Login
                show={page === 'login'} setToken= {setToken} setPage= {setPage}
            />

            <Recommend
                show={page === 'recommend'} token= {token}
            />
        </div>
    )
}

export default App
