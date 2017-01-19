const {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
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
  },
  correctAnswers: {
    type: new GraphQLList(GraphQLString),
    description: 'A list of correct answers'
  }
}

module.exports = new GraphQLObjectType({
  name: 'Step',
  description: 'A single step in the lesson. Usually this is sub-section of a lesson. There is a task assigned it',
  fields: () => (Object.assign({

  }, commonFields))
})

module.exports.Input = new GraphQLInputObjectType({
  name: 'StepInput',
  description: 'A single step in the lesson. Usually this is sub-section of a lesson. There is a task assigned it',
  fields: () => (commonFields)
})
