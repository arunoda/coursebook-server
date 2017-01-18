const {
  GraphQLObjectType,
  GraphQLList,
  GraphQLString,
  GraphQLNonNull,
} = require('graphql')
const Course = require('./Course')

module.exports = new GraphQLObjectType({
  name: 'RootQuery',
  fields: () => ({
    courses: {
      type: new GraphQLNonNull(new GraphQLList(Course)),
      description: 'Return a list of all the available courses',
      resolve() {
        return [
          { _id: 'simple', name: 'Simple Course', position: 4 }
        ]
      }
    },

    course: {
      args: {
        id: {
          type: new GraphQLNonNull(GraphQLString)
        }
      },
      type: Course,
      description: 'Return the course by the given id',
      resolve() {
        return {
          _id: 'simple',
          name: 'Simple Course',
          position: 4
        }
      }
    }
  })
})
