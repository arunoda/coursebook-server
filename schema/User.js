const {
  GraphQLObjectType,
  GraphQLInt,
  GraphQLNonNull
} = require('graphql')

module.exports = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    points: {
      type: new GraphQLNonNull(GraphQLInt),
      description: 'Total points for this user',
      resolve (user, args, context) {
        const progressColl = context.db.collection('progress')
        return progressColl
          .findOne({ _id: user._id })
          .then((item) => {
            let totalPoints = 0
            delete item._id

            Object.keys(item).forEach((courseId) => {
              Object.keys(item[courseId]).forEach((lessonId) => {
                Object.keys(item[courseId][lessonId]).forEach((stepId) => {
                  const stepProgress = item[courseId][lessonId][stepId]
                  if (stepProgress.type === 'text') {
                    totalPoints += stepProgress.points
                    return
                  }

                  // For MCQ
                  if (stepProgress.isCorrectAnswer) {
                    totalPoints += stepProgress.points
                    return
                  }
                })
              })
            })

            return totalPoints
          })
      }
    }
  })
})
