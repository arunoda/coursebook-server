const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLList,
  GraphQLNonNull
} = require('graphql')

const Step = require('./Step')

module.exports = new GraphQLObjectType({
  name: 'Lesson',
  fields: () => ({
    id: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'Id assigned to a lesson. It\' unique inside a course'
    },
    name: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'Name of the lesson.'
    },
    position: {
      type: new GraphQLNonNull(GraphQLInt),
      description: 'Position of this lesson inside a course.'
    },
    course: {
      type: new GraphQLNonNull(require('./Course')),
      description: 'The course related to this lesson.',
      resolve (lession) {
        return {
          _id: lession.courseId,
          name: 'The Course Name',
          position: 'The course position'
        }
      }
    },
    intro: {
      type: new GraphQLNonNull(GraphQLString),
      description: 'An introduction for the lesson written in markdown'
    },
    steps: {
      type: new GraphQLList(Step),
      description: 'A list of steps in this lesson.',
      resolve (lesson, args, context) {
        if (!context.admin && !context.user) {
          throw new Error('Unauthorized Access: To view steps in a lesson')
        }

        const progressColl = context.db.collection('progress')

        const query = { _id: context.user._id }
        const options = { fields: {} }
        options.fields[`${lesson.courseId}.${lesson.id}`] = 1

        return progressColl.findOne(query, options)
          .then((p) => {
            p = p || {}
            const courseProgress = p[lesson.courseId] || {}
            const lessonProgress = courseProgress[lesson.id] || {}
            // Merge progress object for the step into the actual step.
            const steps = lesson.steps.map(step => {
              return Object.assign(lessonProgress[step.id] || {}, step)
            })

            return steps
          })
      }
    }
  })
})
