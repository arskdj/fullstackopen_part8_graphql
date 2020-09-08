const { ApolloServer, gql, UserInputError, AuthenticationError } = require('apollo-server')
const jwt = require('jsonwebtoken')
const db = require('./db')
const Author = require('./models/author')
const Book = require('./models/book')
const User = require('./models/user')
const JWT_SECRET = 'lesecret'
let  token = ''

const typeDefs = gql`
type User {
  username: String!
  favoriteGenre: String!
  id: ID!
}

type Token {
  value: String!
}

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
    bookCount : Int!
    authorCount: Int!
    me : User
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

    createUser(
        username: String!
        favoriteGenre: String!
    ): User

    login(
        username: String!
        password: String!
    ): Token
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
            //if (args.author)  query = { ...query, author: args.author }
            return await Book.find(query)
        },
        allAuthors : async () => await Author.find({}),
        bookCount : async () => await Book.find({}).length,
        authorCount : async () => await Author.find({}).length,
        me : (root, args, {currentUser}) => currentUser
    },

    Mutation : {
        addBook: async (root, args, {currentUser}) => {
            if (!currentUser){
                throw new AuthenticationError("not authenticated")
            }
            let author = await Author.find({name : args.author})
            if (author.length < 1){
                author = new Author({name: args.author, born: null})
                try{
                    await author.save()
                } catch( error){
                    throw new UserInputError(error.message, {
                        invalidArgs: args,
                    })
                }
            }
            const book = new Book({ ...args, author: author._id })
            try{
                await book.save()
            } catch (error) {
                throw new UserInputError(error.message, {
                    invalidArgs: args,
                })
            }
            return book
        },
        editAuthor : async (root, args, {currentUser}) => {
            if (!currentUser){
                throw new AuthenticationError("not authenticated")
            }

            const author = await Author.findOneAndUpdate({ name: args.name }, { born: args.setBornTo}, {new:true})
            if (!author) return null
            return author
        },
        login : async (root, args) => {
            const user  = await User.findOne({ username: args.username })

            if (!user || args.password !== '1234') {
                throw new UserInputError('wrong password')
            }

            const payload = {
                username : user.username,
                id : user._id
            }
            console.log(payload)
            const value = await jwt.sign(payload, JWT_SECRET) 
            token = { value }
            console.log('login',token)
            return token
        }
    }
}

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: async ({ req }) => {
    const auth = req ? req.headers.authorization : null
    if (auth && auth.toLowerCase().startsWith('bearer ')) {
      const decodedToken = jwt.verify(
        auth.substring(7), JWT_SECRET
      )

      const currentUser = await User.findById(decodedToken.id)
      return { currentUser }
    }
  }
})

server.listen().then(({ url }) => {
    console.log(`Server ready at ${url}`)
})

db.connect()
db.init()
