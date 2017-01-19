module.exports = function (app, db, onLoginSuccess) {
  app.use(function (req, res, next) {
    const { adminToken } = req.query
    if (!adminToken) return next()

    if (adminToken === process.env.ADMIN_TOKEN) {
      req.admin = true
    }

    next()
  })
}
