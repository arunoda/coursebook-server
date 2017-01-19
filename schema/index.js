const {
  GraphQLSchema
} = require('graphql')

const Query = require('./Query')
const Mutation = require('./Mutation')

module.exports = new GraphQLSchema({
  query: Query,
  mutation: Mutation
})
