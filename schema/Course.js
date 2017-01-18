const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLNonNull
} = require('graphql')

module.exports = new GraphQLObjectType({
  name: 'Course',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'Unique id assigned to a course',
      resolve: (c) => c._id
    },
    name: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'Name of course'
    },
    position: {
      type: new GraphQLNonNull(GraphQLInt),
      description: 'Position of this course when we list all of the courses at once'
    }
  })
})
