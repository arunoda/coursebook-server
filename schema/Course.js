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
      resolve () {
        return [
          {
            lessonId: 'the-lesson',
            name: 'The Lesson',
            position: 1,
            courseId: 'simple',
            intro: 'The intro of this lesson',
            steps: [
              { id: 'the-id-of-a-text-step', type: 'text', text: 'This is the text' },
              {
                id: 'the-id-of-a-mcq-step',
                type: 'mcq',
                text: 'This is the question',
                answers: [
                  'One', 'Two', 'Three'
                ],
                correctAnswers: ['One', 'Three']
              }
            ]
          }
        ]
      }
    }
  })
})
