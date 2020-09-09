import React, { useState } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import NewBook from './components/NewBook'
import Login from './components/Login'
import { useApolloClient } from '@apollo/client'

const App = () => {
    const [page, setPage] = useState('books')
    const [token, setToken] = useState(localStorage.getItem('token'))
    const client = useApolloClient()

    const logout = () => {
        setToken(null)
        localStorage.clear()
        client.clearStore()
    }

    return (
        <div>
            <div>
                <button onClick={() => setPage('authors')}>authors</button>
                <button onClick={() => setPage('books')}>books</button>
                { token  && <button onClick={() => setPage('add')}>add book</button>}
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

        </div>
    )
}

export default App
