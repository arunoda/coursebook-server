const express = require('express')
const expressGraphql = require('express-graphql')
const cors = require('cors')
const { MongoClient } = require('mongodb')
const expressSession = require('express-session')
const MongoDBSessionStore = require('connect-mongodb-session')(expressSession);

const schema = require('./schema')

const app = express()
const port = process.env.PORT || 3003
const mongoUrl = process.env.MONGO_URL || 'mongodb://localhost/coursebook'
const sessionSecret = process.env.SESSION_SECRET || 'secret'

MongoClient.connect(mongoUrl)
  .then((db) => {
    initMiddlewares(app, db)
    require('./login')(app, db)

    app.use('/graphql', expressGraphql((req) => {
      const { user, admin } = req
      return {
        schema,
        graphiql: true,
        context: {
          user, admin, db
        }
      }
    }))

    app.listen(port, () => {
      console.log(`Coursebook Server started on port: ${port}`)
    })
  })
  .catch((err) => {
    console.error(err.stack)
    process.exit(1)
  })

function initMiddlewares (app, db) {
  app.use(cors({
    credentials: true,
    origin (origin, callback) {
      callback(null, true)
    }
  }))

  app.use(require('cookie-parser')())

  app.use(expressSession({
    secret: sessionSecret,
    resave: true,
    saveUninitialized: true,
    store: new MongoDBSessionStore({ uri: mongoUrl, collection: 'sessions' })
  }))
}
