const { graphql } = require('graphql')
const schema = require('./schema')
const express = require('express')
const expressGraphql = require('express-graphql')

const app = express()
const port = process.env.PORT || 3003

app.use('/graphql', expressGraphql({
  schema,
  graphiql: true
}))

app.listen(port, () => {
  console.log(`Coursebook Server started on port: ${port}`)
})
