import React, {useState, useEffect} from "react"
import { useMutation, setError } from '@apollo/client'
import { LOGIN } from '../mutations'

const Login = ({show, setToken, setPage}) => {
    const username = useInput()
    const password = useInput()

    const [login, result] = useMutation(LOGIN, {
        onError: (error) => setError(error.graphQLErrors[0].message),
    })

    useEffect( () => {
        const token = result.data?.login?.value

        if (token){
            setToken(token)
            localStorage.setItem('token',token)
        }
    }, [result.data])

    const submit = async (event) => {
        event.preventDefault()
        await login({ variables : {
            username: username.value, 
            password: password.value
        }})
        setPage('recommend')
    }

    if (!show) return null
    return(
        <div>
            <form onSubmit={submit}>  
                <div>  
                    username
                    <input {...username} />
                </div>
                <div>  
                    password
                    <input type='password' {...password} />
                </div>
                <button type="submit"> login </button>
            </form>
        </div>
        )
}

const useInput = () => {
    const [value, setValue] = useState('')
    const onChange = (event) => {
        event.preventDefault()
        setValue(event.target.value)
    }
    
    return  {
        value,
        onChange
    }
}

export default Login
