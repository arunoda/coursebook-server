const {
  GraphQLObjectType,
  GraphQLInt,
  GraphQLString,
  GraphQLNonNull,
  GraphQLBoolean
} = require('graphql')

const Course = require('./Course')

module.exports = new GraphQLObjectType({
  name: 'RootMutationQuery',
  fields: () => ({
    createCourse: {
      type: Course,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) },
        name: { type: new GraphQLNonNull(GraphQLString) },
        position: { type: new GraphQLNonNull(GraphQLInt) }
      },
      resolve (root, { id, name, position }, context) {
        checkForAdmin(context)
        const users = context.db.collection('courses')

        const course = { _id: id, name, position }
        return users.save(course)
          .then(() => users.findOne({ _id: id }))
      }
    },

    removeCourse: {
      type: GraphQLBoolean,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) }
      },
      resolve (root, { id }, context) {
        checkForAdmin(context)
        const users = context.db.collection('courses')

        return users.remove({ _id: id })
          .then(() => true)
      }
    }
  })
})

function checkForAdmin (context) {
  if (!context.admin) {
    throw new Error('Unauthorized Access')
  }
}
