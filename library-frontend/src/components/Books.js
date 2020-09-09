import React, {useState, useEffect} from 'react'
import { useQuery } from '@apollo/client'
import { ALL_BOOKS } from '../queries.js'
import BookList from '../components/BookList'

const Books = (props) => {
    const result = useQuery(ALL_BOOKS)
    const [bookList, setBookList] = useState([])
    




    const allBooks = result.data ? result.data.allBooks : []
    let genres = [ ...new Set(allBooks.flatMap(b => b.genres)) ]

    useEffect(() => {
        setBookList(allBooks)    
    }, [result.data])

    const filter = (genre) => {
        if (!genre){
            setBookList(allBooks)
        }
        const list = allBooks.filter( b => b.genres.includes(genre))
        setBookList(list)
    }

    if (!props.show) {
        return null
    }

    if (result.loading)  {
        return <div>loading...</div>
    }

    return (
        <div>

            <h2> Genres </h2>
            <button onClick={() => setBookList(allBooks)}> all </button>
            {
                genres.map( g => <button onClick={() => filter(g)}> {g} </button> )
            }

            <h2>Books</h2>
            <BookList bookList={bookList} />
        </div>
    )
}

export default Books
