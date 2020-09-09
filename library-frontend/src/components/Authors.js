import React, {useState} from 'react'
import { useQuery, useMutation } from '@apollo/client'
import { ALL_AUTHORS  } from '../queries.js'
import { SET_AUTHOR_BORN } from '../mutations'

const SetBirthYear = ({authors}) => {
    const [name, setName] = useState(authors[0].name)
    const [born, setBorn] = useState('')
    const [setBornTo] = useMutation(SET_AUTHOR_BORN, {
        refetchQueries : [ { query: ALL_AUTHORS } ]
    })


    const submit = (event) => {
        event.preventDefault()
        
        setBornTo({variables : {
            name,
            setBornTo:parseInt(born)
        }})

    }

    return (
        <div>
            <h1> Set Birth Year </h1> 
            <form onSubmit={submit}>
                <div>
                    <select value={name}  onChange={ ({target}) => setName(target.value)} >
                        { authors.map( a => <option key={a.id} value={a.name}> {a.name} </option> ) }
                    </select>
                </div>
                <div>
                    born
                    <input value={born}  onChange={ ({target}) => setBorn(target.value)} />
                </div>
                <button type='submit'> submit </button>
            </form>
        </div>
    )
}

const Authors = (props) => {
    const result = useQuery(ALL_AUTHORS)

    if (!props.show) {
        return null
    }

    if (result.loading)  {
        return <div>loading...</div>
    }

    const authors = result.data.allAuthors



    return (
        <div>
            <h2>authors</h2>
            <table>
                <tbody>
                    <tr>
                        <th></th>
                        <th>
                            born
                        </th>
                        <th>
                            books
                        </th>
                    </tr>
                    {authors.map(a =>
                    <tr key={a.name}>
                        <td>{a.name}</td>
                        <td>{a.born}</td>
                        <td>{a.bookCount}</td>
                    </tr>
                    )}
                </tbody>
            </table>

            <SetBirthYear authors= {authors}/>
        </div>
    )
}

export default Authors
