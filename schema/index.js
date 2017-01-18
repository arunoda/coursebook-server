const {
  graphql,
  GraphQLSchema
} = require('graphql')
const Course = require('./Course')
const Query = require('./Query')

module.exports = new GraphQLSchema({
  query: Query
})
