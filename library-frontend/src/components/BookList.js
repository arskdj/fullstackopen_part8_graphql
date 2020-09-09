import React, {useState} from "react"

const BookList = ({bookList}) => {
    return(
        <div>
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

export default BookList
