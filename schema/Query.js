const {
  GraphQLObjectType,
  GraphQLList,
  GraphQLString,
  GraphQLNonNull
} = require('graphql')

const Course = require('./Course')
const User = require('./User')

module.exports = new GraphQLObjectType({
  name: 'RootQuery',
  fields: () => ({
    courses: {
      type: new GraphQLNonNull(new GraphQLList(Course)),
      description: 'Return a list of all the available courses',
      resolve (root, args, context) {
        const query = {}
        const options = {
          sort: { position: 1 }
        }
        return context.db.collection('courses').find(query, options).toArray()
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
      resolve (root, args, context) {
        return context.db.collection('courses').findOne({ _id: args.id })
      }
    },

    user: {
      type: User,
      description: 'Information about the current user',
      resolve (root, args, context) {
        return context.user
      }
    }
  })
})
