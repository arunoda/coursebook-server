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
        const coll = context.db.collection('lessons')
        const query = { courseId: course._id }
        const options = {
          sort: { position: 1 }
        }

        if (args.ids && args.ids.length > 0) {
          query.id = { $in: args.ids }
        }

        // If the ids === [], then we need to limit for the first lesson.
        // This is useful for the /start page.
        if (args.ids && args.ids.length === 0) {
          options.limit = 1
        }

        return coll.find(query, options).toArray()
      }
    }
  })
})
