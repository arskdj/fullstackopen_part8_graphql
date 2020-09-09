import React, {useState} from 'react'
import { useQuery } from '@apollo/client'
import { ALL_BOOKS } from '../queries.js'

const Books = (props) => {
    const [bookList, setBookList] = useState([])
    const result = useQuery(ALL_BOOKS)
    if (!props.show) {
        return null
    }

    if (result.loading)  {
        return <div>loading...</div>
    }

    const allBooks = result.data.allBooks
    let genres = [ ...new Set(allBooks.flatMap(b => b.genres)) ]

    const filter = (genre) => {
        const list = allBooks.filter( b => b.genres.includes(genre))
        setBookList(list)
    }

    return (
        <div>
            <h2>Books</h2>

            {
                genres.map( g => <button onClick={() => filter(g)}> {g} </button> )
            }

            <table>
                <tbody>
                    <tr>
                        <th></th>
                        <th>
                            author
                        </th>
                        <th>
                            published
                        </th>
                    </tr>
                    {bookList.map(b =>
                    <tr key={b.title}>
                        <td>{b.title}</td>
                        <td>{b.author.name}</td>
                        <td>{b.published}</td>
                    </tr>
                    )}
                </tbody>
            </table>

        </div>
    )
}

export default Books
