module.exports = function (app, db, onLoginSuccess) {
  app.use(function (req, res, next) {
    const { loginToken } = req.query
    if (!loginToken) return next()

    const query = { 'loginTokens': loginToken }
    db.collection('users').findOne(query)
      .then((user) => {
        req.user = user
        next()
      })
      .catch((ex) => {
        console.error(ex.stack)
        res.status(500).send('Internal Error')
      })
  })
}
