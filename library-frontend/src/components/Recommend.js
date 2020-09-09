import React, {useState, useEffect} from "react"
import BookList from './BookList'
import { CURRENT_USER, ALL_BOOKS } from '../queries.js'
import { useQuery } from '@apollo/client'

const Recommend = ({show, token}) => {
    const [bookList, setBookList] = useState([])
    const allBooks = useQuery(ALL_BOOKS)
    const user = useQuery(CURRENT_USER)

    useEffect(() => {
       user.refetch() 
    }, [token])

    useEffect(() => {
        const books = allBooks?.data?.allBooks
        const genre = user?.data?.me?.favoriteGenre

        if (books && genre) {
            const list = books.filter(b => b.genres.includes(genre))
            setBookList(list)
        }

    } , [allBooks, user])


    if (!show) return null
    if (user.loading || allBooks.loading){
        return (
            <div>
                loading...
            </div>
        )
    }


    return(
        <div>
            <h1> Recommendations </h1>
            <BookList bookList= {bookList}/>
        </div>
    )
}

export default Recommend
