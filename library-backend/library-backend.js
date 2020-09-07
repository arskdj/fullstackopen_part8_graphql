const { ApolloServer, gql } = require('apollo-server')
const { v1 : uuid } = require('uuid')
const db = require('./db')
const Author = require('./models/author')
const Book = require('./models/book')


const typeDefs = gql`
type Book {
    title : String!
    published : Int!
    author : Author!
    id : ID!
    genres : [String]!
}

type Author {
    name: String!
    born : Int
    id : ID!
    bookCount : Int!
}

type Query {
    allBooks(author:String, genre:String): [Book]!
    allAuthors: [Author]!
    bookCount : Int
    authorCount: Int!
}

type Mutation {
    addBook(
        title : String!
        published : Int!
        author : String!
        genres : [String]!
    ) : Book
    editAuthor(
        name: String!
        setBornTo : Int!
    ): Author
}
`

const resolvers = {
    Book : {
        author : async (root) => await Author.findById(root.author)
    },

    Author:{
        bookCount: async (root) => {
            const books = await Book.find({author: root.id})
            if (!books) return 0
            return books.length
        }
    },
    Query: {
        allBooks: async (root,args) => {
            let query = {}

            if (args.genre)   query = { genres: { $in : [ args.genres ] } }
            if (args.author)  query = { ...query, author: args.author }
            return await Book.find(query)
        },
        allAuthors : async () => await Author.find({}),
        bookCount : async () => await Book.find({}).length,
        authorCount : async () => await Author.find({}).length
    },

    Mutation : {
        addBook: async (root, args) => {
            let author = await Author.find({name : args.author})
            if (author.length < 1){
                author = new Author({name: args.author, born: null})
                await author.save()
            }
            const book = new Book({ ...args, author: author._id })
            await book.save()
            return book
        },
        editAuthor : async (root, args) => {
            const author = await Author.findOneAndUpdate({ name: args.name }, { born: args.setBornTo}, {new:true})
            if (!author) return null
            return author
        }
    }
}

const server = new ApolloServer({
    typeDefs,
    resolvers,
})

server.listen().then(({ url }) => {
    console.log(`Server ready at ${url}`)
})

db.connect()
db.init()
