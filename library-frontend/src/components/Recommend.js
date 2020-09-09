import React, {useState, useEffect} from "react"
import BookList from './BookList'
import { CURRENT_USER, ALL_BOOKS } from '../queries.js'
import { useQuery, useLazyQuery } from '@apollo/client'

const Recommend = ({show, token}) => {
    const [bookList, setBookList] = useState([])
    const [ getBooks, books ]  = useLazyQuery(ALL_BOOKS)
    const user = useQuery(CURRENT_USER)

    useEffect(() => {
       token && user.refetch() 
    }, [token])

    useEffect(() => {

        const genre = user.data?.me?.favoriteGenre
        getBooks({ variables : {genre} })
        const bookList = books.data?.allBooks

        if (bookList && genre) {
            setBookList(bookList)
        }

    }, [user.data, books.data])


    if (!show) return null
    if (user.loading || books.loading){
        return (
            <div>
                loading...
            </div>
        )
    }


    return(
        <div>
            <h1> Recommendations </h1>
            <p> books in your genre <strong> { user?.data?.me?.favoriteGenre
 } </strong>  </p>
            <BookList bookList= {bookList}/>
        </div>
    )
}

export default Recommend
