const authors = [
    {
        name: 'Robert Martin',
        _id: "5f567a291e2a2150e54d253b",
        born: 1952,
    },
    {
        name: 'Martin Fowler',
        _id: "5f567a291e2a2150e54d253c",
        born: 1963
    },
    {
        name: 'Fyodor Dostoevsky',
        _id: "5f567a291e2a2150e54d253d",
        born: 1821
    },
    { 
        name: 'Joshua Kerievsky',
        _id: "5f567a291e2a2150e54d253e",
    },
    { 
        name: 'Sandi Metz', // birthyear not known
        _id: "5f567a291e2a2150e54d253f",
    },
]

const books = [
    {
        title: 'Clean Code',
        published: 2008,
        author: "5f567a291e2a2150e54d253b",
        genres: ['refactoring']
    },
    {
        title: 'Agile software development',
        published: 2002,
        author: "5f567a291e2a2150e54d253b",
        genres: ['agile', 'patterns', 'design']
    },
    {
        title: 'Refactoring, edition 2',
        published: 2018,
        author: '5f567a291e2a2150e54d253c',
        genres: ['refactoring']
    },
    {
        title: 'Refactoring to patterns',
        published: 2008,
        author: '5f567a291e2a2150e54d253e',
        genres: ['refactoring', 'patterns']
    },  
    {
        title: 'Practical ObjectOriented Design, An Agile Primer Using Ruby',
        published: 2012,
        author: '5f567a291e2a2150e54d253f',
        genres: ['refactoring', 'design']
    },
    {
        title: 'Crime and punishment',
        published: 1866,
        author: '5f567a291e2a2150e54d253d',
        genres: ['classic', 'crime']
    },
    {
        title: 'The Demon ',
        published: 1872,
        author: '5f567a291e2a2150e54d253d',
        genres: ['classic', 'revolution']
    },
]


require('dotenv').config()
const mongoose = require('mongoose')
const Author = require('./models/author')
const Book = require('./models/book')
const DB_URI = process.env.TEST_DB_URI


const settings = {
    'useFindAndModify':    false,
    'useCreateIndex':      true,
    'useNewUrlParser':     true,
    'useUnifiedTopology':  true
}

const connect = async () => {
    try{
        await mongoose.connect(DB_URI, settings)
        console.log('connected to DB', DB_URI)
    }
    catch (error){
        console.log('couldnt connect to DB', error)
    }
}

const close = async () => {
    try{
        await mongoose.connection.close()
        console.log('DB connection closed', DB_URI)
    }
    catch (error){
        console.log('couldnt close DB connection', error)
    }
}

const init = async () => {
    try {
        await Author.deleteMany({})
        await Book.deleteMany({})

        const authorPromises = await authors.map(a => new Author(a).save())
        const bookPromises   = await books.map(b => new Book(b).save())

        await Promise.all(authorPromises.concat(bookPromises))

        console.log('initialized')
    }  catch (error) {
        console.log('init error', error)
    }  
}

module.exports = {init, connect, close}
