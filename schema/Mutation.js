const {
  GraphQLObjectType,
  GraphQLInt,
  GraphQLString,
  GraphQLNonNull,
  GraphQLBoolean,
  GraphQLList
} = require('graphql')

const Step = require('./Step')

module.exports = new GraphQLObjectType({
  name: 'RootMutationQuery',
  fields: () => ({
    createCourse: {
      type: require('./Course'),
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) },
        name: { type: new GraphQLNonNull(GraphQLString) },
        position: { type: new GraphQLNonNull(GraphQLInt) }
      },
      resolve (root, { id, name, position }, context) {
        checkForAdmin(context)
        const courses = context.db.collection('courses')

        const course = { _id: id, name, position }
        return courses.save(course)
          .then(() => courses.findOne({ _id: id }))
      }
    },

    removeCourse: {
      type: GraphQLBoolean,
      args: {
        id: { type: new GraphQLNonNull(GraphQLString) }
      },
      resolve (root, { id }, context) {
        checkForAdmin(context)
        const courses = context.db.collection('courses')

        return courses.remove({ _id: id })
          .then(() => true)
      }
    },

    createLesson: {
      type: require('./Lesson'),
      args: {
        courseId: { type: new GraphQLNonNull(GraphQLString) },
        id: { type: new GraphQLNonNull(GraphQLString) },
        name: { type: new GraphQLNonNull(GraphQLString) },
        intro: { type: new GraphQLNonNull(GraphQLString) },
        position: { type: new GraphQLNonNull(GraphQLInt) },
        steps: { type: new GraphQLList(require('./Step').Input) }
      },
      resolve (root, args, context) {
        checkForAdmin(context)
        const lessons = context.db.collection('lessons')

        const _id = `${args.courseId}--${args.id}`
        const lesson = Object.assign({ _id }, args)
        return lessons.save(lesson)
          .then(() => lessons.findOne({ _id }))
      }
    },

    removeLesson: {
      type: GraphQLBoolean,
      args: {
        courseId: { type: new GraphQLNonNull(GraphQLString) },
        id: { type: new GraphQLNonNull(GraphQLString) }
      },
      resolve (root, args, context) {
        checkForAdmin(context)
        const lessons = context.db.collection('lessons')

        const query = { courseId: args.courseId, id: args.id }
        return lessons.remove(query)
          .then(() => true)
      }
    },

    markVisited: {
      type: GraphQLBoolean,
      description: 'Mark a given step in a lesson as visited',
      args: {
        courseId: { type: new GraphQLNonNull(GraphQLString) },
        lessonId: { type: new GraphQLNonNull(GraphQLString) },
        stepId: { type: new GraphQLNonNull(GraphQLString) }
      },
      resolve (root, { courseId, lessonId, stepId }, context) {
        if (!context.user) {
          throw new Error('Unauthorized Access! - Only for loggedIn users')
        }

        const progressColl = context.db.collection('progress')
        const query = {
          _id: context.user._id
        }
        const modifier = {
          $set: {}
        }
        modifier['$set'][`${courseId}.${lessonId}.${stepId}.visited`] = true

        return progressColl.update(query, modifier, { upsert: true })
          .then(() => true)
      }
    },

    submitAnswer: {
      type: Step,
      description: 'Mark a given step in a lesson as visited',
      args: {
        courseId: { type: new GraphQLNonNull(GraphQLString) },
        lessonId: { type: new GraphQLNonNull(GraphQLString) },
        stepId: { type: new GraphQLNonNull(GraphQLString) },
        answer: { type: new GraphQLNonNull(GraphQLString) }
      },
      resolve (root, { courseId, lessonId, stepId, answer }, context) {
        if (!context.user) {
          throw new Error('Unauthorized Access! - Only for loggedIn users')
        }

        const progressColl = context.db.collection('progress')
        const lessonColl = context.db.collection('lessons')

        let step

        // TODO: Prevent checking answer more than once.
        return lessonColl.findOne({ courseId, id: lessonId })
          .then((lesson) => {
            step = lesson.steps.find((s) => s.id === stepId)
            if (step.type !== 'mcq') {
              throw new Error(`Step type is not MCQ but ${step.type}`)
            }

            step.givenAnswer = answer

            // Set the correct answer
            const modifier = { $set: {} }
            modifier['$set'][`${courseId}.${lessonId}.${stepId}.givenAnswer`] = answer
            return progressColl.update({ _id: context.user._id }, modifier, { upsert: true })
          })
          .then(() => step)
      }
    }
  })
})

function checkForAdmin (context) {
  if (!context.admin) {
    throw new Error('Unauthorized Access! - Only for admins')
  }
}
