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
          type: GraphQLString
        }
      },
      type: Course,
      description: 'Return the course by the given id',
      resolve (root, args, context) {
        const coll = context.db.collection('courses')
        if (args.id) {
          return coll.findOne({ _id: args.id })
        } else {
          // The "id" can be null and then we should send the first course.
          // This is to support the /start page of the UI
          return coll.findOne({}, { sort: [['position', 1]] })
        }
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
