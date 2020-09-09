import React, {useState, useEffect} from 'react'
import { useQuery } from '@apollo/client'
import { ALL_BOOKS } from '../queries.js'
import BookList from '../components/BookList'

const Books = (props) => {
    const result = useQuery(ALL_BOOKS)
    const [bookList, setBookList] = useState([])
    const [genre, setGenre] = useState('all')
    




    const allBooks = result.data ? result.data.allBooks : []
    const genres = [ ...new Set(allBooks.flatMap(b => b.genres)) ]

    useEffect(() => {
        setBookList(allBooks)    
    }, [result.data])

    const filter = () => {
        if (genre === 'all'){
            setBookList(allBooks)
        } else {
            const list = allBooks.filter( b => b.genres.includes(genre))
            setBookList(list)
        }
    }

    useEffect( filter, [genre, result.data])

    if (!props.show) {
        return null
    }

    if (result.loading)  {
        return <div>loading...</div>
    }

    return (
        <div>

            <h2>Books</h2>
            <button onClick={() => setGenre('all')}> all </button>
            {
                genres.map( g => <button onClick={() => setGenre(g)}> {g} </button> )
            }

            <h2> Genre: {genre} </h2>
            <BookList bookList={bookList} />
        </div>
    )
}

export default Books
