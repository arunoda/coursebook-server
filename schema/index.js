const {
  GraphQLSchema
} = require('graphql')
const Query = require('./Query')

module.exports = new GraphQLSchema({
  query: Query
})
