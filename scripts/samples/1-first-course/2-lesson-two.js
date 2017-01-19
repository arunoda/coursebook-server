module.exports = {
  name: 'First Lesson',
  intro: `
    This is the intro for the lesson.
    I hope it'll be pretty great!
  `,
  steps: [
    {
      id: 'step-one',
      text: 'This is the text for this step',
      points: 5
    },
    {
      id: 'step-two',
      text: 'This is the text for this question',
      points: 20,
      answers: [
        'One', 'Two', 'Three', 'Four'
      ],
      correctAnswers: [
        'One', 'Four'
      ]
    }
  ]
}
