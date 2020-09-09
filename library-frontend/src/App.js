import React, { useState, useEffect } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import Login from './components/Login'
import Recommend from './components/Recommend'
import { useQuery, useApolloClient } from '@apollo/client'
import { CURRENT_USER } from './queries'

const App = () => {
    const [page, setPage] = useState('authors')
    const [token, setToken] = useState(localStorage.getItem('token'))
    const client = useApolloClient()
    const me = useQuery(CURRENT_USER)

    const [username, setUsername] = useState('')

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
