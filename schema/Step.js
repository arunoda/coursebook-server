const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLBoolean,
  GraphQLList,
  GraphQLNonNull,
  GraphQLInputObjectType
} = require('graphql')

const commonFields = {
  id: {
    type: new GraphQLNonNull(GraphQLString),
    description: 'id assigned to a step. It\'s unique inside a lesson.'
  },
  type: {
    type: new GraphQLNonNull(GraphQLString),
    description: 'Type of the step.'
  },
  points: {
    type: new GraphQLNonNull(GraphQLInt),
    description: 'Points allocated fot this step.'
  },
  text: {
    type: new GraphQLNonNull(GraphQLString),
    description: 'Text related to this step.'
  },
  answers: {
    type: new GraphQLList(GraphQLString),
    description: 'A list of answers. This is available only if the type = mcq'
  }
}

module.exports = new GraphQLObjectType({
  name: 'Step',
  description: 'A single step in the lesson. Usually this is sub-section of a lesson. There is a task assigned it',
  fields: () => (Object.assign({
    visited: {
      type: new GraphQLNonNull(GraphQLBoolean),
      description: 'Indicate whether user visited this step or not.',
      resolve (step) {
        return step.visited || false
      }
    },

    givenAnswer: {
      type: GraphQLString,
      description: 'The answer given by the user'
    },

    correctAnswer: {
      type: GraphQLString,
      description: 'The correct answer.',
      resolve (step) {
        if (!step.givenAnswer) return null
        return step.correctAnswer
      }
    }
  }, commonFields))
})

module.exports.Input = new GraphQLInputObjectType({
  name: 'StepInput',
  description: 'A single step in the lesson. Usually this is sub-section of a lesson. There is a task assigned it',
  fields: () => (Object.assign({
    correctAnswer: {
      type: GraphQLString,
      description: 'The correct answer.'
    }
  }, commonFields))
})
