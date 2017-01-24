const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull
} = require('graphql')

const Lesson = require('./Lesson')

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
    },
    lessons: {
      type: new GraphQLList(Lesson),
      description: 'A list of lessons in this course',
      args: {
        ids: {
          type: new GraphQLList(GraphQLString),
          description: 'A list of lession ids to filter'
        }
      },
      resolve (course, args, context) {
        const query = { courseId: course._id }
        if (args.ids) {
          query.id = { $in: args.ids }
        }
        const options = {
          sort: { position: 1 }
        }
        return context.db.collection('lessons').find(query, options).toArray()
      }
    }
  })
})
