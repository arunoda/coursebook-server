module.exports = {
  name: 'Second Lesson',
  intro: `
    This is the intro for the lesson.
    I hope it'll be pretty great!
  `,
  steps: [
    {
      id: 'step-one',
      type: 'text',
      text: 'This is the text for this step',
      points: 5
    },
    {
      id: 'step-two',
      text: 'This is the text for this question',
      type: 'mcq',
      points: 20,
      answers: [
        'One', 'Two', 'Three', 'Four'
      ],
      correctAnswer: 'Four'
    }
  ]
}
